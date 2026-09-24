import type { Lang } from "./lang";

// Offline "demo mode" answers — used when no Gemini API key is configured or
// the API is unreachable, so the app always gives a professional reply.

const isHi = (l: Lang) => l === "hi";

export function isDemoMode(): boolean {
  return true; // call sites gate on GEMINI_KEY first; this file only formats
}

function banner(lang: Lang, offline = false): string {
  return isHi(lang)
    ? offline
      ? "ℹ️ ऑफ़लाइन डेमो उत्तर — AI सेवा अभी उपलब्ध नहीं है, इसलिए सामान्य मार्गदर्शन दिया जा रहा है।\n"
      : "ℹ️ डेमो उत्तर — AI कुंजी कॉन्फ़िगर नहीं है। वास्तविक AI उत्तर के लिए .env.local में NEXT_PUBLIC_GEMINI_KEY जोड़ें।\n"
    : offline
      ? "ℹ️ Offline demo answer — the AI service is currently unreachable, so here is general guidance instead.\n"
      : "ℹ️ Demo answer — AI key is not configured. Add NEXT_PUBLIC_GEMINI_KEY in .env.local for live AI answers.\n";
}

// ── Chat mock answers ────────────────────────────────────────────────

type Topic = "greeting" | "disease" | "fertilizer" | "weather" | "mandi" | "scheme" | "crop" | "irrigation" | "general";

const KEYWORDS: [Topic, RegExp][] = [
  ["greeting", /^(hi|hii+|hello|hey|namaste|namaskar|नमस्ते|नमस्कार|vanakkam|வணக்கம்)\b/i],
  ["disease", /(disease|pest|insect|fungus|fungal|yellow|leaf spot|blight|rust|aphid|borer|रोग|कीट|फफूंद|पील)/i],
  ["fertilizer", /(fertilizer|fertiliser|urea|dap|npk|nutrient|खाद|खेत|यूरिया)/i],
  ["weather", /(weather|rain|rainfall|temperature|forecast|mausam|मौसम|बारिश|तापमान)/i],
  ["mandi", /(mandi|price|market|rate|msp|भाव|मंडी|दाम|कीमत)/i],
  ["scheme", /(scheme|yojana|kisan|pm-kisan|pmfby|subsidy|योजना|सब्सिडी)/i],
  ["crop", /(crop|grow|sow|variety|which seed|फसल|बुवाई|बीज)/i],
  ["irrigation", /(irrigat|water|drip|sprinkler|सिंचाई|पानी)/i],
];

function detectTopic(q: string): Topic {
  for (const [topic, re] of KEYWORDS) if (re.test(q)) return topic;
  return "general";
}

export function getMockChatReply(question: string, lang: Lang, offline = false): string {
  const topic = detectTopic(question);
  const body = isHi(lang) ? MOCK_HI[topic] : MOCK_EN[topic];
  return `${banner(lang, offline)}\n${body}`;
}

const MOCK_EN: Record<Topic, string> = {
  greeting:
    "🙏 Welcome to Agri Advisor!\n\nI can help you with:\n🌱 Crop selection for your soil & season\n🔬 Plant disease identification\n🧪 Fertilizer & NPK advice\n🏪 Mandi prices\n🏛️ Government schemes (PM-KISAN, PMFBY, KCC…)\n🌦️ 7-day weather planning\n\nAsk me any farming question in English, हिन्दी, मराठी, தமிழ் or తెలుగు.",
  disease:
    "🌿 Crop Health Check (demo)\n🔍 Cause: Yellowing leaves are most commonly caused by nitrogen deficiency, water stress, or early fungal infection (leaf spot).\n💊 Treatment:\n• Remove and destroy badly affected leaves away from the field\n• Spray neem oil 3–5 ml/litre in the evening for early pest signs\n• For suspected fungal spots, spray Mancozeb 2 g/litre as per label\n✅ Prevention:\n• Avoid overhead irrigation; water early in the day\n• Maintain 25–30 cm plant spacing for airflow\n• Follow crop rotation; avoid excess nitrogen\n\n🔎 For a precise diagnosis, upload a clear close-up photo on the Plant ID page.",
  fertilizer:
    "🧪 Fertilizer Guidance (demo)\n\nTypical NPK schedule per acre:\n• Basal dose at final ploughing: full P & K + 1/3 N\n• First top dressing (20–25 days): 1/3 N\n• Second top dressing (before flowering): 1/3 N\n\n📌 Tips:\n• Always test soil before applying — pH 6.5–7.5 is ideal\n• Split nitrogen doses to reduce runoff and cost\n• Add 2–3 t compost/acre to improve uptake\n\nTry the Fertilizer Advice page for a soil-test-based recommendation.",
  weather:
    "🌦️ Weather & Farming (demo)\n\nGeneral planning tips:\n• Spray only when wind is below 15 km/h and no rain expected for 4–6 hours\n• Irrigate early morning (6–9 AM) or evening (5–7 PM) to cut evaporation\n• If heavy rain is forecast, delay fertilizer application to prevent runoff\n• Protect young plants from frost with light evening irrigation\n\n📍 Open the Weather page and enter your village for the live 7-day forecast.",
  mandi:
    "🏪 Mandi Prices (demo)\n\nToday's rates are estimated from MSP + daily market variance and are shown on the Mandi page for 30+ commodities across all major states.\n\n📌 To sell smart:\n• Compare modal prices of nearby mandis before transport\n• Check the trend arrow — sell on rising markets if storage is available\n• e-NAM registration gives access to more buyers\n\nNote: Official prices are published at agmarknet.gov.in.",
  scheme:
    "🏛️ Key Government Schemes (demo)\n\n• PM-KISAN: ₹6,000/year in 3 installments — apply at pm-kisan.gov.in\n• PMFBY: crop insurance at ~2% premium for food crops — apply via your bank/CSC\n• KCC: credit up to ₹3 lakh at 4% effective interest with prompt repayment\n• PM-KUSUM: 60%+ subsidy for solar pumps\n• SMAM: subsidy on tractors & machinery (50% for small farmers)\n\n📌 Documents usually needed: Aadhaar, land record (7/12 or khatauni), bank passbook, mobile linked to Aadhaar.",
  crop:
    "🌱 Crop Selection (demo)\n\nBest matches by season:\n❄️ Rabi: Wheat, Chickpea, Mustard, Barley, Peas\n🌧️ Kharif: Rice, Maize, Cotton, Soybean, Bajra\n☀️ Zaid: Watermelon, Cucumber, Moong, Okra\n🔄 Annual: Sugarcane, Banana, Vegetables\n\n📌 Match these with your soil type (Sandy → Bajra/Moong; Black → Cotton/Soybean; Loamy → Wheat/Rice) and your irrigation availability.\n\nOpen the Crop Advice page — enter your village and get AI-suggested top 5 crops for your exact conditions.",
  irrigation:
    "💧 Irrigation Guidance (demo)\n\n• Drip: saves 40–60% water; best for cotton, tomato, sugarcane — subsidy available under PMKSY\n• Sprinkler: good for wheat, mustard, vegetables\n• Flood: traditional but water-heavy; use alternate-furrow method to save ~30%\n\n⏰ Best times: early morning or evening. Critical stages: crown-root (wheat), tillering (rice), flowering (pulses).\n\n📍 Check rainfall on the Weather page before scheduling.",
  general:
    "🙏 Thank you for your question.\n\nIn demo mode I can share general guidance on:\n🌱 Crop selection · 🔬 Disease control · 🧪 Fertilizer · 💧 Irrigation · 🏪 Mandi prices · 🏛️ Schemes · 🌦️ Weather\n\nAsk about any of these, or explore the Tools page. For live AI answers, configure your Gemini key.",
};

const MOCK_HI: Record<Topic, string> = {
  greeting:
    "🙏 एग्री एडवाइजर में आपका स्वागत है!\n\nमैं इनमें मदद कर सकता हूँ:\n🌱 मिट्टी और मौसम के अनुसार फसल चुनना\n🔬 पौध रोग पहचान\n🧪 खाद और NPK सलाह\n🏪 मंडी भाव\n🏛️ सरकारी योजनाएँ (PM-KISAN, PMFBY, KCC…)\n🌦️ 7 दिन का मौसम प्लानिंग\n\nअंग्रेज़ी, हिन्दी, मराठी, तमिल या तेलुगु में कोई भी खेती सवाल पूछें।",
  disease:
    "🌿 फसल स्वास्थ्य जांच (डेमो)\n🔍 कारण: पत्तियों का पीलापन आमतौर पर नाइट्रोजन की कमी, पानी की पाबंदी या शुरुआती फफूंद (लीफ स्पॉट) से होता है।\n💊 उपचार:\n• ज्यादा प्रभावित पत्तियां तोड़कर खेत से बाहर नष्ट करें\n• शुरुआती कीट संकेत पर शाम को नीम तेल 3–5 मिली/लीटर छिड़कें\n• फफूंद संदेह पर मैंकोजेब 2 ग्राम/लीटर लेबल अनुसार छिड़काव करें\n✅ बचाव:\n• ऊपर से सिंचाई न करें; सुबह पानी दें\n• 25–30 सेमी पौध दूरी रखें ताकि हवा आवागमन हो\n• फसल चक्र अपनाएं; अधिक नाइट्रोजन से बचें\n\n🔎 सटीक पहचान के लिए Plant ID पेज पर स्पष्ट फोटो अपलोड करें।",
  fertilizer:
    "🧪 खाद सलाह (डेमो)\n\nप्रति एकड़ सामान्य NPK कार्यक्रम:\n• बेसल डोज़ (अंतिम जुताई में): पूरा P व K + 1/3 N\n• पहली टॉप ड्रेसिंग (20–25 दिन): 1/3 N\n• दूसरी टॉप ड्रेसिंग (फूल से पहले): 1/3 N\n\n📌 सुझाव:\n• खाद डालने से पहले मिट्टी जांच कराएं — pH 6.5–7.5 आदर्श\n• नाइट्रोजन को विभाजित खुराक में दें — खर्च और बहाव दोनों कम होंगे\n• 2–3 टन कम्पोस्ट/एकर डालने से पोषण अवशोषण बेहतर होता है\n\nमिट्टी जांच रिपोर्ट आधारित सिफारिश के लिए खाद सलाह पेज खोलें।",
  weather:
    "🌦️ मौसम और खेती (डेमो)\n\nसामान्य प्लानिंग सुझाव:\n• हवा 15 किमी/घंटा से कम हो और 4–6 घंटे बारिश की संभावना न हो तभी छिड़काव करें\n• सिंचाई सुबह 6–9 बजे या शाम 5–7 बजे करें — वाष्पीकरण कम होगा\n• भारी बारिश के समाचार पर खाद डालना टालें — बहाव से बचें\n• पाला संभावना पर हल्की शाम सिंचाई से पौध बचाएं\n\n📍 मौसम पेज पर अपना गांव डालें और 7 दिन का सटीक पूर्वानुमान देखें।",
  mandi:
    "🏪 मंडी भाव (डेमो)\n\nआज के भाव MSP + दैनिक बाजार अंतर से अनुमानित हैं और मंडी पेज पर 30+ फसलों के लिए सभी प्रमुख राज्यों में दिखाए जाते हैं।\n\n📌 समझदारी से बेचें:\n• परिवहन से पहले आसपास की मंडियों के मॉडल भाव तुलना करें\n• ट्रेंड एरो देखें — भंडारण हो तो बढ़त भाव में बेचें\n• e-NAM पंजीकरण से अधिक खरीदारों तक पहुंच बनती है\n\nध्यान दें: आधिकारिक भाव agmarknet.gov.in पर प्रकाशित होते हैं।",
  scheme:
    "🏛️ प्रमुख सरकारी योजनाएँ (डेमो)\n\n• PM-KISAN: ₹6,000/वर्ष, 3 किस्तों में — pm-kisan.gov.in पर आवेदन\n• PMFBY: फसल बीमा, खाद्य फसलों पर ~2% प्रीमियम — बैंक/CSC से कराएं\n• KCC: ₹3 लाख तक साख, समय पर भुगतान पर प्रभावी 4% ब्याज\n• PM-KUSUM: सोलर पंप पर 60%+ सब्सिडी\n• SMAM: ट्रैक्टर व मशीनरी पर सब्सिडी (छोटे किसानों को 50%)\n\n📌 आमतौर पर जरूरी दस्तावेज़: आधार, भूमि रिकॉर्ड (7/12 या खतौनी), बैंक पासबुक, आधार से लिंक मोबाइल।",
  crop:
    "🌱 फसल चयन (डेमो)\n\nमौसम अनुसार सर्वोत्तम विकल्प:\n❄️ रबी: गेहूँ, चना, सरसों, जौ, मटर\n🌧️ खरीफ: धान, मक्का, कपास, सोयाबीन, बाजरा\n☀️ जायद: तरबूज, खीरा, मूंग, भिंडी\n🔄 वार्षिक: गन्ना, केला, सब्जियाँ\n\n📌 अपनी मिट्टी से मिलाएं (बलुई → बाजरा/मूंग; काली → कपास/सोयाबीन; दोमट → गेहूँ/धान) और सिंचाई की उपलब्धता देखें।\n\nफसल सलाह पेज खोलें — गांव डालें और अपनी परिस्थिति के लिए टॉप 5 फसलें पाएं।",
  irrigation:
    "💧 सिंचाई सलाह (डेमो)\n\n• ड्रिप: 40–60% पानी बचाती है; कपास, टमाटर, गन्ने के लिए उत्तम — PMKSY के तहत सब्सिडी\n• स्प्रिंकलर: गेहूँ, सरसों, सब्जियों के लिए अच्छी\n• भराव: पारंपरिक पर पानी अधिक — वैकल्पिक फरो विधि से ~30% बचत\n\n⏰ सही समय: सुबह या शाम। महत्वपूर्ण अवस्था: क्राउन-रूट (गेहूँ), टिलरिंग (धान), फूल (दलहन)।\n\n📍 कार्यक्रम बनाने से पहले मौसम पेज पर बारिश जांचें।",
  general:
    "🙏 आपके प्रश्न के लिए धन्यवाद।\n\nडेमो मोड में मैं इन विषयों पर सामान्य मार्गदर्शन दे सकता हूँ:\n🌱 फसल चयन · 🔬 रोग नियंत्रण · 🧪 खाद · 💧 सिंचाई · 🏪 मंडी भाव · 🏛️ योजनाएँ · 🌦️ मौसम\n\nइनमें से कुछ पूछें या टूल्स पेज देखें। वास्तविक AI उत्तरों के लिए Gemini कुंजी कॉन्फ़िगर करें।",
};

// ── Plant ID mock diagnosis ──────────────────────────────────────────

export interface MockDiagnosis {
  name: string; crop: string; type: string; confidence: string;
  symptoms: string; prevention: string; treatment: string;
}

export function getMockDiagnosis(lang: Lang): MockDiagnosis[] {
  const hi = isHi(lang);
  return [
    {
      name: hi ? "संभावित फफूंद रोग (डेमो)" : "Likely fungal disease (demo)",
      crop: hi ? "आपकी फसल" : "Your crop",
      type: "fungal", confidence: "Medium",
      symptoms: hi
        ? "पत्तियों पर धब्बे, पीलापन या सूखे किनारे दिख सकते हैं। नमी में यह तेजी से फैलता है।"
        : "Leaf spots, yellowing or drying edges may appear. It spreads fast in humid weather.",
      prevention: hi
        ? "पत्तियां गीली न रहें, सुबह सिंचाई करें, पौध दूरी और हवा आवागमन बनाए रखें।"
        : "Keep foliage dry, irrigate in the morning, maintain spacing and airflow.",
      treatment: hi
        ? "प्रभावित पत्तियां हटाएं; जरूरत पर मैंकोजेब 2 ग्राम/लीटर लेबल अनुसार छिड़कें।"
        : "Remove affected leaves; if needed spray Mancozeb 2 g/l as per label.",
    },
    {
      name: hi ? "पोषण कमी की संभावना (डेमो)" : "Possible nutrient deficiency (demo)",
      crop: hi ? "आपकी फसल" : "Your crop",
      type: "nutritional", confidence: "Medium",
      symptoms: hi
        ? "पुरानी पत्तियों का समान पीलापन आमतौर पर नाइट्रोजन की कमी दर्शाता है।"
        : "Uniform yellowing of older leaves usually indicates nitrogen deficiency.",
      prevention: hi
        ? "संतुलित NPK, नियमित कम्पोस्ट और मिट्टी जांच हर मौसम में कराएं।"
        : "Balanced NPK, regular compost, and soil testing every season.",
      treatment: hi
        ? "यूरिया की हल्की टॉप ड्रेसिंग करें; जल्दी राहत के लिए 2% यूरिया फोलियर स्प्रे।"
        : "Apply a light urea top dressing; 2% urea foliar spray for quick recovery.",
    },
  ];
}
