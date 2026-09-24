"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useLang, t, localeFor, type Lang } from "@/lib/lang";
import BackButton from "@/components/BackButton";

import { GEMINI_KEY, GEMINI_URL } from "@/lib/config";

interface Message { role: "user" | "bot"; text: string; imageUrl?: string; }

// SpeechRecognition types are declared in types/speech.d.ts

const SYSTEM_PROMPT = `You are Agri Advisor AI, an expert agricultural assistant for Indian farmers.
You have deep knowledge of:
- Indian crops (kharif, rabi, annual), their sowing/harvesting seasons, NPK requirements, MSP prices
- Crop diseases, pests, symptoms, prevention and treatment using Indian agrochemicals
- Government schemes: PM-KISAN, PMFBY, KCC, SMAM, PMKSY, e-NAM, PKVY, PM-KUSUM etc.
- Mandi prices, market trends for major crops across Indian states
- Indian soil types, weather patterns, irrigation methods
- Organic farming, integrated pest management

Rules:
- Always respond in the same language the user writes in (Hindi or English)
- Give COMPLETE, thorough answers — never cut off mid-sentence
- NEVER use markdown formatting: no ###, no **, no *, no __, no backticks, no bullet dashes with markdown
- Use plain text only. Use emojis as visual separators instead of markdown headers
- Structure answers with emojis like: 🔍 Cause: ... 💊 Treatment: ... ✅ Prevention: ...
- For diseases, always mention: symptoms, prevention, treatment
- For schemes, always mention: benefit, eligibility, how to apply
- For crops, mention: season, temperature, water, duration, fertilizer`;

async function askGemini(
  question: string,
  history: Message[],
  lang: Lang,
  imageBase64?: string,
  imageMime?: string
): Promise<string> {
  const langNames: Record<Lang, string> = {
    hi: "Hindi (Devanagari script)", en: "English", mr: "Marathi (Devanagari script)",
    ta: "Tamil (Tamil script)", te: "Telugu (Telugu script)",
  };
  const langInstruction = `Respond in ${langNames[lang]}.`;

  // Build the last user parts — text + optional image
  const userParts: object[] = [{ text: `${langInstruction}\n\n${question}` }];
  if (imageBase64 && imageMime) {
    userParts.push({ inline_data: { mime_type: imageMime, data: imageBase64 } });
  }

  const contents = [
    ...history.slice(-6).map(m => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.text }] })),
    { role: "user", parts: userParts }
  ];
  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: { temperature: 0.7, maxOutputTokens: 5000 }
  };
  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-goog-api-key": GEMINI_KEY },
    body: JSON.stringify(body),
  });
  if (!res.ok) { const err = await res.text(); throw new Error(`Gemini error: ${res.status} — ${err}`); }
  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? (lang === "hi" ? "माफ़ करें, कोई उत्तर नहीं मिला।" : "Sorry, no response received.");
  // Strip markdown symbols
  return raw
    .replace(/#{1,6}\s*/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_{2}(.+?)_{2}/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .trim();
}

const QUICK_HI = [
  "इस मौसम में कौन सी फसल उगाएं?",
  "गेहूँ की पत्तियाँ पीली हो रही हैं — क्या करें?",
  "टमाटर में कीट लगा है — उपाय बताएं",
  "आज मंडी में सोयाबीन का भाव?",
  "PM-Kisan योजना के बारे में बताएं",
  "धान के लिए खाद कब डालें?",
];
const QUICK_EN = [
  "Which crop should I grow this season?",
  "My wheat has yellow leaves — what to do?",
  "Tomato pest attack — suggest remedy",
  "How's the weather for farming today?",
  "Tell me about PM-Kisan scheme",
  "When to apply fertilizer for rice?",
];

export default function ChatPage() {
  const { lang } = useLang();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ttsOn, setTtsOn] = useState(true);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [pendingImage, setPendingImage] = useState<{ base64: string; mime: string; url: string } | null>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  // Text-to-Speech: speak AI reply
  function speak(text: string) {
    if (!ttsOn || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = localeFor(lang);
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  }

  function stopSpeaking() {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      setPendingImage({ base64, mime: file.type, url: dataUrl });
    };
    reader.readAsDataURL(file);
    // reset so same file can be picked again
    e.target.value = "";
  }

  // Speech-to-Text: mic button
  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert(t("इस ब्राउज़र में आवाज़ पहचान समर्थित नहीं है।", "Speech recognition not supported in this browser.", lang));
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new SR();
    rec.lang = localeFor(lang);
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => setListening(true);
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
  }, [lang, listening]);

  async function send(text: string) {
    if ((!text.trim() && !pendingImage) || loading) return;
    stopSpeaking();
    const img = pendingImage;
    const userMsg: Message = {
      role: "user",
      text: text.trim() || (lang === "hi" ? "इस फोटो को देखें और बताएं।" : "Please analyse this image."),
      imageUrl: img?.url,
    };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setPendingImage(null);
    setLoading(true);
    setError("");
    try {
      const reply = await askGemini(userMsg.text, messages, lang, img?.base64, img?.mime);
      setMessages(prev => [...prev, { role: "bot", text: reply }]);
      speak(reply);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      const errText = lang === "hi"
        ? "\u26a0\ufe0f AI \u0938\u0947 \u091c\u0941\u0921\u093c\u0928\u0947 \u092e\u0947\u0902 \u0938\u092e\u0938\u094d\u092f\u093e \u0939\u0941\u0908\u0964 \u0915\u0943\u092a\u092f\u093e \u0926\u094b\u092c\u093e\u0930\u093e \u0915\u094b\u0936\u093f\u0936 \u0915\u0930\u0947\u0902\u0964"
        : "\u26a0\ufe0f Could not connect to AI. Please try again.";
      setMessages(prev => [...prev, { role: "bot", text: errText }]);
    }
    setLoading(false);
  }

  function handleSubmit(e: React.FormEvent) { e.preventDefault(); send(input); }

  const quickQuestions = lang === "hi"
    ? QUICK_HI
    : QUICK_EN.map(q => t(q, q, lang));
  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 pb-4 border-b border-gray-100">
        <BackButton />
        <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center text-white text-xl shadow shrink-0 hidden sm:flex">🌾</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-800">{t("एग्री एडवाइजर AI", "Agri Advisor AI", lang)}</div>
          <div className="text-xs text-gray-400">{t("कोई भी खेती सवाल पूछें", "Ask any farming question", lang)}</div>
        </div>
        {/* TTS toggle */}
        <button
          onClick={() => { setTtsOn(v => !v); if (ttsOn) stopSpeaking(); }}
          title={ttsOn ? t("AI आवाज़ बंद करें", "Mute AI voice", lang) : t("AI आवाज़ चालू करें", "Unmute AI voice", lang)}
          className={"flex items-center gap-1.5 text-xs px-2 sm:px-3 py-1.5 rounded-full border-2 font-medium transition-all shrink-0 " + (
            ttsOn
              ? "border-green-400 text-green-700 bg-green-50"
              : "border-gray-300 text-gray-400 bg-white"
          )}>
          {ttsOn ? (
            <><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0 0l-3-3m3 3l3-3M9 9H5a1 1 0 00-1 1v4a1 1 0 001 1h4l5 4V5L9 9z" />
            </svg>{t("आवाज़ चालू", "Voice ON", lang)}</>
          ) : (
            <><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>{t("आवाज़ बंद", "Voice OFF", lang)}</>
          )}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-6">
            <div className="w-16 h-16 bg-green-600 rounded-3xl flex items-center justify-center text-white text-3xl shadow-lg">✨</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("नमस्ते किसान! 🙏", "Hello Farmer! 🙏", lang)}</h2>
              <p className="text-gray-500 max-w-sm text-sm">
                {t("मैं Agri Advisor AI हूँ। फसल, रोग, मौसम, योजना — कुछ भी पूछें।",
                   "I'm Agri Advisor AI. Ask me anything about farming\n\u2014 crops, diseases, weather, schemes, anything.", lang)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {quickQuestions.map(q => (
                <button key={q} onClick={() => send(q)}
                  className="text-sm px-4 py-2 rounded-full border-2 border-green-200 text-green-800 bg-white hover:bg-green-50 hover:border-green-400 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <div key={i} className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}>
                {m.role === "bot" && (
                  <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center text-white text-sm mr-2 mt-1 shrink-0">🌾</div>
                )}
                <div className={"max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line leading-relaxed " + (
                  m.role === "user"
                    ? "bg-green-600 text-white rounded-br-sm"
                    : "bg-white border border-gray-100 text-gray-800 shadow-sm rounded-bl-sm"
                )}>
                  {m.imageUrl && (
                    <img src={m.imageUrl} alt={t("अपलोड की गई फोटो", "uploaded", lang)} className="max-w-full rounded-xl mb-2 max-h-48 object-contain" />
                  )}
                  {m.text}
                  {/* Replay TTS for bot messages */}
                  {m.role === "bot" && ttsOn && (
                    <button onClick={() => speak(m.text)}
                      className="ml-2 opacity-40 hover:opacity-100 transition-opacity align-middle"
                      title={t("आवाज़ फिर सुनें", "Replay voice", lang)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0 0l-3-3m3 3l3-3M9 9H5a1 1 0 00-1 1v4a1 1 0 001 1h4l5 4V5L9 9z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center text-white text-sm mr-2 shrink-0">🌾</div>
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay:"0ms"}} />
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay:"150ms"}} />
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay:"300ms"}} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {error && <div className="text-xs text-red-500 px-2 pb-1 truncate">{error}</div>}

      {/* Image preview strip */}
      {pendingImage && (
        <div className="flex items-center gap-2 px-1 pb-2">
          <div className="relative inline-block">
            <img src={pendingImage.url} alt={t("चुनी गई फोटो", "pending", lang)} className="h-16 w-16 rounded-xl object-cover border-2 border-green-400" />
            <button
              onClick={() => setPendingImage(null)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none">
              ×
            </button>
          </div>
          <span className="text-xs text-gray-400">{t("फोटो तैयार है — सवाल लिखें या सीधे भेजें", "Image ready — add a question or send directly", lang)}</span>
        </div>
      )}

      {/* Input bar */}
      <div className="border-t border-gray-100 pt-4">
        <form onSubmit={handleSubmit}
          className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-2xl px-3 py-2 focus-within:border-green-400 transition-colors">

          {/* Mic button */}
          <button type="button" onClick={startListening}
            title={listening ? t("सुनना बंद करें", "Stop listening", lang) : t("अपना सवाल बोलें", "Speak your question", lang)}
            className={"w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all " + (
              listening
                ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-200"
                : "bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700"
            )}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>

          {/* Image upload button */}
          <button type="button" onClick={() => imgInputRef.current?.click()}
            title={t("फोटो अपलोड करें", "Upload image", lang)}
            className={"w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all " + (
              pendingImage
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700"
            )}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />

          <input
            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            placeholder={listening
              ? t("सुन रहा हूँ...", "Listening...", lang)
              : t("खेती का सवाल लिखें...", "Type your farming question...", lang)}
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />

          {/* Send button */}
          <button type="submit" disabled={(!input.trim() && !pendingImage) || loading}
            className="w-9 h-9 rounded-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 flex items-center justify-center text-white transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-2">
          Agri Advisor AI — Powered by Gemini Flash · {t("नि:शुल्क", "Free", lang)}
        </p>
      </div>
    </div>
  );
}
