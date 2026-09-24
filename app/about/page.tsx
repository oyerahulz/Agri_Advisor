"use client";
import Link from "next/link";
import { useLang, t } from "@/lib/lang";
import BackButton from "@/components/BackButton";

const FEATURES = [
  { emoji: "🌱", hi: "फसल सलाह", en: "Crop Advice",
    dHi: "आपकी मिट्टी, मौसम और सिंचाई के अनुसार ML मॉडल से टॉप 5 फसलें।",
    dEn: "Top 5 crops from an ML model matched to your soil, weather and irrigation." },
  { emoji: "🔬", hi: "रोग पहचान", en: "Disease Detection",
    dHi: "प्रभावित पत्ती की फोटो अपलोड करें — AI रोग, लक्षण और उपचार बताता है।",
    dEn: "Upload a photo of the affected leaf — AI identifies disease, symptoms and treatment." },
  { emoji: "🧪", hi: "खाद सलाह", en: "Fertilizer Advice",
    dHi: "मिट्टी जांच NPK मूल्यों से सही खाद और मात्रा की योजना।",
    dEn: "Soil-test NPK values mapped to the right fertilizer and dosage schedule." },
  { emoji: "🏪", hi: "मंडी भाव", en: "Mandi Prices",
    dHi: "30+ फसलों के थोक भाव, ट्रेंड और राज्यवार तुलना।",
    dEn: "Wholesale rates, trends and state-wise comparison for 30+ commodities." },
  { emoji: "🏛️", hi: "सरकारी योजनाएँ", en: "Gov. Schemes",
    dHi: "PM-KISAN से PMFBY तक — पात्रता, लाभ और आवेदन प्रक्रिया।",
    dEn: "From PM-KISAN to PMFBY — eligibility, benefits and how to apply." },
  { emoji: "🌦️", hi: "मौसम पूर्वानुमान", en: "Weather Forecast",
    dHi: "गांव-स्तर पर 7 दिन का पूर्वानुमान और खेती सुझाव।",
    dEn: "Village-level 7-day forecast with farming tips." },
];

const TECH = [
  { k: "Next.js 16 + React 19", d: "App · UI · API" },
  { k: "Google Gemini AI", d: "Chat · Vision" },
  { k: "ML Crop Model", d: "2200 samples" },
  { k: "Open-Meteo API", d: "Weather · Soil" },
  { k: "Tailwind CSS 4", d: "Mobile-first UI" },
  { k: "Vercel", d: "Hosting · CDN" },
];

const LANGS = ["English", "हिन्दी", "मराठी", "தமிழ்", "తెలుగు"];

export default function AboutPage() {
  const { lang } = useLang();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <BackButton />

      {/* Hero */}
      <header className="text-center pt-4">
        <div className="text-5xl mb-2">🌾</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{color:"#14532d"}}>
          {t("एग्री एडवाइजर के बारे में", "About Agri Advisor", lang)}
        </h1>
        <p className="mt-3 text-gray-600 leading-relaxed">
          {t(
            "एक AI-संचालित डिजिटल कृषि सहायक — भारतीय किसानों के लिए सही फसल, रोग पहचान, मंडी भाव और सरकारी योजनाएँ, सब एक जगह।",
            "An AI-powered digital farming assistant — the right crops, disease detection, mandi prices and government schemes for Indian farmers, all in one place.",
            lang
          )}
        </p>
      </header>

      {/* Mission */}
      <section className="rounded-2xl p-5 sm:p-6 border-2 border-black bg-white shadow-[4px_4px_0px_#000]">
        <h2 className="text-lg font-bold mb-2" style={{color:"#1a6b3a"}}>
          🎯 {t("हमारा लक्ष्य", "Our Mission", lang)}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {t(
            "हर किसान तक सही जानकारी — बिना भाषा की बाधा, बिना महंगे उपकरण, बिना तकनीकी झंझट। सरल भाषा में, मुफ़्त, हर मोबाइल पर।",
            "Right information for every farmer — without language barriers, expensive tools, or tech headaches. In simple words, free, on any phone.",
            lang
          )}
        </p>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-lg font-bold mb-4" style={{color:"#14532d"}}>
          ✨ {t("क्या-क्या मिलता है", "What You Get", lang)}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map(f => (
            <div key={f.en} className="rounded-xl border border-green-100 bg-white p-4">
              <div className="flex items-center gap-2 font-semibold" style={{color:"#14532d"}}>
                <span className="text-xl">{f.emoji}</span> {t(f.hi, f.en, lang)}
              </div>
              <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                {t(f.dHi, f.dEn, lang)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section>
        <h2 className="text-lg font-bold mb-4" style={{color:"#14532d"}}>
          🛠️ {t("तकनीक", "Technology", lang)}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TECH.map(x => (
            <div key={x.k} className="rounded-xl bg-white border border-green-100 p-3 text-center">
              <div className="font-semibold text-sm" style={{color:"#1a6b3a"}}>{x.k}</div>
              <div className="text-xs text-gray-500 mt-0.5">{x.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Languages + coverage */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-green-100 bg-white p-4">
          <h3 className="font-semibold mb-2" style={{color:"#1a6b3a"}}>🌐 {t("भाषाएँ", "Languages", lang)}</h3>
          <div className="flex flex-wrap gap-1.5">
            {LANGS.map(l => (
              <span key={l} className="text-xs px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-800">{l}</span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-green-100 bg-white p-4">
          <h3 className="font-semibold mb-2" style={{color:"#1a6b3a"}}>🌍 {t("कवरेज", "Coverage", lang)}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {t(
              "भारत के सभी राज्य · 34+ मंडियाँ · 2G पर भी चलता है · मोफ़त, बिना साइन-अप।",
              "All Indian states · 34+ mandis · works on 2G · free, no sign-up.",
              lang
            )}
          </p>
        </div>
      </section>

      {/* Developer credit */}
      <section className="rounded-2xl p-5 sm:p-6 text-center border-2 border-black bg-white shadow-[4px_4px_0px_#000]">
        <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">{t("विकासकर्ता", "Developer", lang)}</div>
        <div className="text-xl font-bold" style={{color:"#14532d"}}>Rahul Kumar</div>
        <a href="mailto:rahulkumarindia200@gmail.com" className="text-sm text-green-700 hover:underline">
          ✉ rahulkumarindia200@gmail.com
        </a>
        <p className="text-xs text-gray-400 mt-2">
          © 2026 Agri Advisor · {t("किसानों के लिए, किसानों द्वारा", "For farmers, by farmers", lang)} 🌱
        </p>
      </section>

      <div className="text-center pb-4">
        <Link href="/" className="btn-primary inline-block px-8 py-3 rounded-xl font-bold">
          🚜 {t("एप्लिकेशन आज़माएँ", "Try the App", lang)}
        </Link>
      </div>
    </div>
  );
}
