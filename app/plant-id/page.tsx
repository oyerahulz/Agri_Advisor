"use client";
import { useState, useRef } from "react";
import { useLang, t, type Lang } from "@/lib/lang";
import BackButton from "@/components/BackButton";

import { GEMINI_KEY, GEMINI_URL } from "@/lib/config";
import { getMockDiagnosis } from "@/lib/mock-ai";

interface DiseaseResult {
  name: string;
  crop: string;
  type: string;
  confidence: string;
  symptoms: string;
  prevention: string;
  treatment: string;
}

type RawDiagnosis = Partial<Record<keyof DiseaseResult, unknown>>;

const TYPE_VALUES = ["fungal", "pest", "viral", "bacterial", "nutritional", "healthy"];
const CONFIDENCE_VALUES = ["High", "Medium", "Low"];

async function analyzeWithGemini(
  base64: string,
  mimeType: string,
  lang: Lang,
  userNote: string
): Promise<DiseaseResult[]> {
  const langNames: Record<Lang, string> = {
    hi: "Hindi using Devanagari script", en: "English", mr: "Marathi using Devanagari script",
    ta: "Tamil using Tamil script", te: "Telugu using Telugu script",
  };
  const langNote = `Respond entirely in ${langNames[lang]}.`;

  const extraNote = userNote.trim()
    ? `The user has provided this additional instruction or question: ${userNote.trim()}`
    : "";

  const prompt = `${langNote}
${extraNote}

You are an expert plant pathologist specializing in Indian crops.
Analyze this plant or crop image carefully and identify any diseases, pests, or health issues visible.

CRITICAL RULES for your response:
- Return valid JSON only. Do not add markdown fences or explanation outside the JSON.
- The JSON syntax must be correct, but the text values must be plain sentences with no markdown.
- Always provide detailed prevention and treatment. Never leave them blank.
- Give complete information and do not cut off mid sentence.

Return a JSON array of up to 3 diagnoses ordered by likelihood. Each object must have exactly these keys:
- name: disease or pest name written in plain text
- crop: affected crop name in plain text
- type: one of fungal or pest or viral or bacterial or nutritional or healthy
- confidence: High or Medium or Low
- symptoms: 3 to 5 complete sentences describing visible symptoms
- prevention: 4 to 6 complete sentences with practical prevention steps for Indian farmers
- treatment: 4 to 6 complete sentences with immediate action, organic options, chemical options, dose guidance, and safety advice

If the plant looks healthy, return one entry with type healthy.
If crop or disease is uncertain, say most likely and still give broad safe advice for the visible problem.
Return ONLY a valid JSON array.`;

  const body = {
    contents: [{
      parts: [
        { text: prompt },
        { inline_data: { mime_type: mimeType, data: base64 } }
      ]
    }],
    generationConfig: { temperature: 0.15, maxOutputTokens: 3500 }
  };

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-goog-api-key": GEMINI_KEY },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("\n") ?? "[]";
  return normalizeDiagnoses(parseGeminiJson(raw), lang);
}

function parseGeminiJson(raw: string): RawDiagnosis[] {
  const stripped = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const candidates = [
    stripped,
    extractBetween(stripped, "[", "]"),
    extractBetween(stripped, "{", "}"),
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (Array.isArray(parsed)) return parsed as RawDiagnosis[];
      if (parsed && typeof parsed === "object") return [parsed as RawDiagnosis];
    } catch {
      // Try next extraction shape.
    }
  }

  return [{
    name: extractJsonString(stripped, "name"),
    crop: extractJsonString(stripped, "crop"),
    type: extractJsonString(stripped, "type"),
    confidence: extractJsonString(stripped, "confidence"),
    symptoms: extractJsonString(stripped, "symptoms") || stripped,
    prevention: extractJsonString(stripped, "prevention"),
    treatment: extractJsonString(stripped, "treatment"),
  }];
}

function extractBetween(text: string, open: string, close: string) {
  const start = text.indexOf(open);
  const end = text.lastIndexOf(close);
  return start !== -1 && end !== -1 && end > start ? text.slice(start, end + 1) : "";
}

function extractJsonString(text: string, key: keyof DiseaseResult) {
  const match = text.match(new RegExp(`"${key}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`, "i"));
  if (!match) return "";
  try {
    return JSON.parse(`"${match[1]}"`) as string;
  } catch {
    return match[1];
  }
}

function normalizeDiagnoses(items: RawDiagnosis[], lang: Lang): DiseaseResult[] {
  const normalized = items
    .slice(0, 3)
    .map(item => normalizeDiagnosis(item, lang))
    .filter(Boolean) as DiseaseResult[];

  return normalized.length > 0 ? normalized : [normalizeDiagnosis({}, lang)];
}

function normalizeDiagnosis(item: RawDiagnosis, lang: Lang): DiseaseResult {
  const type = normalizeType(asText(item.type));
  const confidence = normalizeConfidence(asText(item.confidence));
  const name = cleanText(asText(item.name)) || defaultName(type, lang);
  const crop = cleanText(asText(item.crop)) || tFallback("अज्ञात फसल", "Unknown crop", lang);

  return {
    name,
    crop,
    type,
    confidence,
    symptoms: ensureUsefulText(asText(item.symptoms), defaultSymptoms(name, crop, type, lang)),
    prevention: ensureUsefulText(asText(item.prevention), defaultPrevention(type, lang)),
    treatment: ensureUsefulText(asText(item.treatment), defaultTreatment(type, lang)),
  };
}

function asText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(asText).filter(Boolean).join(" ");
  if (value && typeof value === "object") return JSON.stringify(value);
  return "";
}

function cleanText(value: string) {
  return value
    .replace(/```json|```/gi, "")
    .replace(/^[\s"'{}[\],:]+|[\s"'{}[\],:]+$/g, "")
    .replace(/\\"/g, "\"")
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function ensureUsefulText(value: string, fallback: string) {
  const cleaned = cleanText(value);
  const looksLikeJson = /"\w+"\s*:/.test(cleaned) || cleaned.startsWith("{") || cleaned.startsWith("[");
  const tooShort = cleaned.split(/\s+/).filter(Boolean).length < 8;
  return looksLikeJson || tooShort ? fallback : cleaned;
}

function normalizeType(value: string) {
  const lower = value.toLowerCase();
  return TYPE_VALUES.find(type => lower.includes(type)) ?? "fungal";
}

function normalizeConfidence(value: string) {
  const lower = value.toLowerCase();
  return CONFIDENCE_VALUES.find(level => lower.includes(level.toLowerCase())) ?? "Low";
}

function tFallback(hi: string, en: string, lang: Lang) {
  return t(hi, en, lang);
}

function defaultName(type: string, lang: Lang) {
  const names: Record<string, { hi: string; en: string }> = {
    fungal: { hi: "संभावित फफूंद रोग", en: "Likely fungal disease" },
    pest: { hi: "संभावित कीट प्रकोप", en: "Likely pest attack" },
    viral: { hi: "संभावित वायरल रोग", en: "Likely viral disease" },
    bacterial: { hi: "संभावित जीवाणु रोग", en: "Likely bacterial disease" },
    nutritional: { hi: "संभावित पोषण कमी", en: "Likely nutrient deficiency" },
    healthy: { hi: "पौधा स्वस्थ दिखता है", en: "Plant appears healthy" },
  };
  return tFallback(names[type]?.hi ?? names.fungal.hi, names[type]?.en ?? names.fungal.en, lang);
}

function defaultSymptoms(name: string, crop: string, type: string, lang: Lang) {
  if (lang === "hi") {
    if (type === "healthy") return "फोटो में पौधा सामान्य रूप से स्वस्थ दिखता है। पत्तियों पर बड़े धब्बे, सड़न या कीट का भारी प्रकोप स्पष्ट नहीं दिख रहा है। फिर भी खेत में नए धब्बों, पीलापन या मुरझाने पर निगरानी रखें।";
    return `${crop} में ${name} की संभावना दिखती है। प्रभावित पत्तियों पर धब्बे, पीलापन, सूखापन या जले हुए किनारे दिख सकते हैं। रोग बढ़ने पर धब्बे फैलते हैं और पत्ती की हरी सतह कम हो जाती है। नमी और लगातार पत्ती गीली रहने से समस्या तेजी से बढ़ सकती है।`;
  }
  if (type === "healthy") return "The plant appears generally healthy in the photo. No major leaf spots, rot, or severe pest damage are clearly visible. Keep monitoring for new spots, yellowing, wilting, or abnormal growth in the field.";
  return `${name} is the most likely issue on ${crop}. Affected leaves may show spots, yellowing, drying, burnt edges, or damaged tissue. As the problem advances, spots can spread and reduce the green leaf area. High humidity and wet leaves can make the issue spread faster.`;
}

function defaultPrevention(type: string, lang: Lang) {
  if (lang === "hi") {
    if (type === "healthy") return "स्वस्थ पौधों को बचाने के लिए खेत में नियमित निगरानी करें। पत्तियों को लंबे समय तक गीला न रहने दें और जरूरत के अनुसार सिंचाई करें। खेत में हवा का अच्छा आवागमन रखें और खरपतवार हटाते रहें। रोगग्रस्त पौधे मिलने पर उन्हें अलग करें और औजार साफ रखें।";
    return "रोगग्रस्त पत्तियों को तोड़कर खेत से बाहर नष्ट करें ताकि संक्रमण न फैले। ऊपर से सिंचाई करने से बचें और सुबह के समय सिंचाई करें ताकि पत्तियां जल्दी सूखें। पौधों के बीच उचित दूरी रखें और खेत में हवा का आवागमन बनाए रखें। फसल चक्र अपनाएं और टमाटर, मिर्च, आलू जैसी संबंधित फसलें उसी जगह लगातार न लगाएं। खेत की सफाई रखें और नाइट्रोजन की अधिक मात्रा से बचें।";
  }
  if (type === "healthy") return "Keep the crop healthy by scouting the field regularly. Avoid keeping leaves wet for long periods and irrigate only as needed. Maintain good airflow, remove weeds, and keep tools clean. Isolate any plant that starts showing clear disease symptoms.";
  return "Remove badly affected leaves and destroy them away from the field to reduce spread. Avoid overhead irrigation and water early in the day so foliage dries quickly. Maintain proper spacing and airflow between plants. Rotate crops and avoid planting related crops such as tomato, chilli, and potato repeatedly in the same plot. Keep the field clean and avoid excessive nitrogen fertilizer.";
}

function defaultTreatment(type: string, lang: Lang) {
  if (lang === "hi") {
    if (type === "pest") return "पहले प्रभावित पत्तियों और कीटों को हाथ से हटाएं। हल्के प्रकोप में नीम तेल 3 से 5 मिली प्रति लीटर पानी में मिलाकर शाम को छिड़कें। प्रकोप अधिक हो तो स्थानीय कृषि अधिकारी की सलाह से उपयुक्त कीटनाशक का उपयोग करें। दवा के लेबल पर लिखी मात्रा, प्रतीक्षा अवधि और सुरक्षा निर्देशों का पालन करें। छिड़काव करते समय दस्ताने, मास्क और पूरी बांह के कपड़े पहनें।";
    if (type === "nutritional") return "मिट्टी की जांच कराएं और कमी के अनुसार संतुलित खाद दें। तुरंत राहत के लिए सूक्ष्म पोषक तत्वों का फोलियर स्प्रे कृषि विशेषज्ञ की सलाह से करें। जैविक पदार्थ बढ़ाने के लिए कम्पोस्ट या अच्छी सड़ी गोबर खाद डालें। अधिक खाद एक साथ न डालें क्योंकि इससे जड़ों को नुकसान हो सकता है।";
    return "तुरंत बहुत ज्यादा संक्रमित पत्तियां हटा दें और खेत में नमी कम रखें। जैविक विकल्प के रूप में नीम आधारित उत्पाद या ट्राइकोडर्मा जैसे जैव नियंत्रण का उपयोग स्थानीय उपलब्धता के अनुसार करें। फफूंद रोग की संभावना में कृषि विशेषज्ञ की सलाह से मैंकोजेब या कॉपर आधारित फफूंदनाशी का लेबल अनुसार छिड़काव किया जा सकता है। जीवाणु रोग की संभावना में कॉपर आधारित उत्पाद उपयोगी हो सकते हैं। छिड़काव 7 से 10 दिन बाद दोहराने की जरूरत पड़ सकती है और कटाई से पहले प्रतीक्षा अवधि जरूर मानें।";
  }
  if (type === "pest") return "First remove visible insects and heavily damaged leaves by hand. For a light attack, spray neem oil at 3 to 5 ml per litre of water in the evening. If infestation is severe, use a suitable insecticide only after advice from a local agriculture officer. Follow the label dose, waiting period, and safety instructions. Wear gloves, a mask, and full sleeves while spraying.";
  if (type === "nutritional") return "Get the soil tested and apply balanced fertilizer according to the deficiency. For quicker correction, use a micronutrient foliar spray recommended by an agriculture expert. Add compost or well decomposed farmyard manure to improve nutrient availability. Do not apply large fertilizer doses at once because it can damage roots.";
  return "Remove heavily infected leaves immediately and reduce excess moisture around the crop. As an organic option, use neem based products or biological controls such as Trichoderma where locally available. For likely fungal disease, a Mancozeb or copper based fungicide may be sprayed according to label instructions after expert advice. For possible bacterial disease, copper based products may help. Repeat spraying after 7 to 10 days if needed and always follow the pre harvest waiting period.";
}

function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve({ base64: result.split(",")[1], mimeType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const TYPE_COLOR: Record<string, string> = {
  fungal:      "bg-orange-100 text-orange-700",
  pest:        "bg-red-100 text-red-700",
  viral:       "bg-purple-100 text-purple-700",
  bacterial:   "bg-blue-100 text-blue-700",
  nutritional: "bg-yellow-100 text-yellow-700",
  healthy:     "bg-green-100 text-green-700",
};
const CONF_COLOR: Record<string, string> = {
  High:   "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low:    "bg-gray-100 text-gray-600",
};
const TYPE_LABELS: Record<string, { hi: string; en: string }> = {
  fungal: { hi: "फफूंद", en: "fungal" },
  pest: { hi: "कीट", en: "pest" },
  viral: { hi: "वायरस", en: "viral" },
  bacterial: { hi: "जीवाणु", en: "bacterial" },
  nutritional: { hi: "पोषण कमी", en: "nutritional" },
  healthy: { hi: "स्वस्थ", en: "healthy" },
};
const CONF_LABELS: Record<string, { hi: string; en: string }> = {
  High: { hi: "अधिक", en: "High" },
  Medium: { hi: "मध्यम", en: "Medium" },
  Low: { hi: "कम", en: "Low" },
};

function AdviceText({ text }: { text: string }) {
  const points = text
    .split(/(?<=[.!?।])\s+/)
    .map(point => point.trim())
    .filter(Boolean);

  if (points.length <= 1) {
    return <p className="text-sm text-gray-700 leading-relaxed">{text}</p>;
  }

  return (
    <ul className="text-sm text-gray-700 leading-relaxed space-y-1.5">
      {points.map((point, idx) => (
        <li key={idx} className="flex gap-2">
          <span className="text-gray-400">•</span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PlantIDPage() {
  const { lang } = useLang();
  const [preview, setPreview]   = useState<string | null>(null);
  const [file, setFile]         = useState<File | null>(null);
  const [userNote, setUserNote] = useState("");
  const [results, setResults]   = useState<DiseaseResult[]>([]);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setDone(false);
    setResults([]);
    setError("");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  async function analyze() {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const { base64, mimeType } = await fileToBase64(file);
      let res: DiseaseResult[];
      if (!GEMINI_KEY) {
        // Demo mode — no API key: show offline mock diagnosis
        res = getMockDiagnosis(lang);
      } else {
        res = await analyzeWithGemini(base64, mimeType, lang, userNote);
      }
      setResults(res);
      setDone(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(lang === "hi"
        ? `\u26a0\ufe0f \u0935\u093f\u0936\u094d\u0932\u0947\u0937\u0923 \u092e\u0947\u0902 \u0924\u094d\u0930\u0941\u091f\u093f: ${msg}`
        : `\u26a0\ufe0f Analysis failed: ${msg}`);
    }
    setLoading(false);
  }

  function reset() {
    setPreview(null); setFile(null); setDone(false);
    setResults([]); setError(""); setUserNote("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <BackButton />
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          🌿 {t("\u092a\u094c\u0927\u093e \u0930\u094b\u0917 \u092a\u0939\u091a\u093e\u0928", "Plant Disease Identification", lang)}
        </h1>
        <p className="text-gray-500">
          {t("\u092b\u0938\u0932 \u0915\u0940 \u092b\u094b\u091f\u094b \u0905\u092a\u0932\u094b\u0921 \u0915\u0930\u0947\u0902 \u0914\u0930 \u0930\u094b\u0917 \u092a\u0939\u091a\u093e\u0928\u0947\u0902 \u0924\u0925\u093e \u0909\u092a\u093e\u092f \u092a\u093e\u090f\u0902",
             "Upload a crop photo and identify the disease and suggest treatment", lang)}
        </p>
        <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
          {t("Google Gemini Vision \u0926\u094d\u0935\u093e\u0930\u093e \u0938\u0902\u091a\u093e\u0932\u093f\u0924", "Powered by Google Gemini Vision", lang)}
        </div>
      </div>

      {/* Upload zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => !loading && inputRef.current?.click()}
        className="border-2 border-dashed border-green-300 rounded-2xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors">
        {preview
          ? <img src={preview} alt={t("अपलोड की गई फोटो", "uploaded", lang)} className="max-h-64 mx-auto rounded-xl object-contain" />
          : (
            <div className="space-y-2">
              <div className="text-5xl">📷</div>
              <p className="font-medium text-gray-700">{t("\u092b\u094b\u091f\u094b \u092f\u0939\u093e\u0901 \u0916\u0940\u0902\u091a\u0947\u0902 \u092f\u093e \u0915\u094d\u0932\u093f\u0915 \u0915\u0930\u0947\u0902", "Drag and drop or click to upload", lang)}</p>
              <p className="text-sm text-gray-400">{t("JPG, PNG, WEBP \u2014 \u0905\u0927\u093f\u0915\u0924\u092e 10MB", "JPG, PNG, WEBP \u2014 max 10MB", lang)}</p>
            </div>
          )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      </div>

      {/* User instruction input — shown after image is selected */}
      {preview && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            💬 {t("\u0905\u0924\u093f\u0930\u093f\u0915\u094d\u0924 \u0928\u093f\u0930\u094d\u0926\u0947\u0936 \u092f\u093e \u0938\u0935\u093e\u0932 \u0932\u093f\u0916\u0947\u0902 \u0935\u0948\u0915\u0932\u094d\u092a\u093f\u0915", "Add instruction or question (optional)", lang)}
          </label>
          <textarea
            className="input-field w-full text-sm resize-none"
            rows={3}
            placeholder={t(
              "\u091c\u0948\u0938\u0947: \u092f\u0939 \u0917\u0947\u0939\u0942\u0901 \u0915\u0940 \u092a\u0924\u094d\u0924\u0940 \u0939\u0948, \u0907\u0938 \u092a\u0930 \u092a\u0940\u0932\u0947 \u0927\u092c\u094d\u092c\u0947 \u0939\u0948\u0902 \u2014 \u0915\u094d\u092f\u093e \u0915\u0930\u0947\u0902?",
              "e.g. This is a wheat leaf with yellow spots \u2014 what should I do?",
              lang
            )}
            value={userNote}
            onChange={e => setUserNote(e.target.value)}
            disabled={loading}
          />
        </div>
      )}

      {preview && !done && (
        <button onClick={analyze} disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-60">
          {loading
            ? t("⏳ Gemini AI विश्लेषण कर रहा है...", "⏳ Gemini AI is analysing...", lang)
            : t("🔍 Gemini से रोग पहचानें", "🔍 Identify with Gemini AI", lang)}
        </button>
      )}

      {preview && (
        <button onClick={reset} className="text-sm text-gray-400 hover:text-red-500 transition-colors block">
          {t("\u00d7 \u0926\u0942\u0938\u0930\u0940 \u092b\u094b\u091f\u094b \u091a\u0941\u0928\u0947\u0902", "\u00d7 Choose another photo", lang)}
        </button>
      )}

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}

      {done && results.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-bold text-gray-800 text-lg">
            🔬 {t("Gemini AI \u0915\u093e \u0935\u093f\u0936\u094d\u0932\u0947\u0937\u0923", "Gemini AI Analysis", lang)}
          </h2>

          {results.map((d, i) => (
            <div key={i} className="card space-y-4">
              {/* Header */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-800 text-base">{d.name}</span>
                <span className="text-gray-400 text-sm">{d.crop}</span>
                {i === 0 && <span className="badge bg-green-100 text-green-700">{t("\u0938\u092c\u0938\u0947 \u0938\u0902\u092d\u093e\u0935\u093f\u0924", "Most Likely", lang)}</span>}
                <span className={`badge ${TYPE_COLOR[d.type] ?? "bg-gray-100 text-gray-600"}`}>
                  {TYPE_LABELS[d.type] ? (lang === "hi" ? TYPE_LABELS[d.type].hi : TYPE_LABELS[d.type].en) : d.type}
                </span>
                <span className={`badge ${CONF_COLOR[d.confidence] ?? "bg-gray-100 text-gray-600"}`}>
                  {t("\u0935\u093f\u0936\u094d\u0935\u093e\u0938", "Confidence", lang)}: {CONF_LABELS[d.confidence] ? (lang === "hi" ? CONF_LABELS[d.confidence].hi : CONF_LABELS[d.confidence].en) : d.confidence}
                </span>
              </div>

              {/* Symptoms */}
              <div className="rounded-xl p-4" style={{background:"#fff5f5", border:"1px solid #fecaca"}}>
                <div className="text-xs font-bold uppercase tracking-wide text-red-700 mb-2">
                  🔴 {t("लक्षण", "Symptoms", lang)}
                </div>
                <AdviceText text={d.symptoms} />
              </div>

              {/* Prevention */}
              <div className="rounded-xl p-4" style={{background:"#eff6ff", border:"1px solid #bfdbfe"}}>
                <div className="text-xs font-bold uppercase tracking-wide text-blue-700 mb-2">
                  🔵 {t("रोकथाम", "Prevention", lang)}
                </div>
                <AdviceText text={d.prevention} />
              </div>

              {/* Treatment */}
              <div className="rounded-xl p-4" style={{background:"#f0fdf4", border:"1px solid #bbf7d0"}}>
                <div className="text-xs font-bold uppercase tracking-wide text-green-700 mb-2">
                  🟢 {t("उपचार", "Treatment", lang)}
                </div>
                <AdviceText text={d.treatment} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card bg-blue-50 border-blue-100">
        <h3 className="font-bold text-blue-800 mb-2">📸 {t("बेहतर पहचान के लिए", "For better identification", lang)}</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• {t("प्रभावित पत्ती या तने की साफ़, नज़दीकी फोटो लें", "Take a clear close-up photo of the affected leaf or stem", lang)}</li>
          <li>• {t("अच्छी रोशनी में फोटो खींचें", "Photograph in good lighting", lang)}</li>
          <li>• {t("फोटो में पूरा रोगग्रस्त हिस्सा दिखाएं", "Show the entire affected area in the photo", lang)}</li>
        </ul>
      </div>
    </div>
  );
}
