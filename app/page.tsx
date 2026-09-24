"use client";
import Link from "next/link";
import { useLang, t } from "@/lib/lang";

const tools = [
  { href:"/recommend",  emoji:"🌱", hi:"सलाह लें",        en:"Crop Advice",          subHi:"AI फसल सलाह",           subEn:"AI crop advice" },
  { href:"/weather",    emoji:"🌤️", hi:"मौसम",            en:"Weather",              subHi:"7 दिन पूर्वानुमान",     subEn:"7-day forecast" },
  { href:"/mandi",      emoji:"🏪", hi:"मंडी भाव",        en:"Mandi Prices",         subHi:"आज के भाव",             subEn:"Today's rates" },
  { href:"/yojana",     emoji:"🏛️", hi:"सरकारी योजना",    en:"Gov. Schemes",         subHi:"15+ योजनाएँ",           subEn:"15+ schemes" },
  { href:"/calendar",   emoji:"📅", hi:"फसल कैलेंडर",     en:"Crop Calendar",        subHi:"बुवाई/कटाई समय",       subEn:"Sow & harvest" },
  { href:"/diseases",   emoji:"🔬", hi:"रोग गाइड",        en:"Disease Guide",        subHi:"रोग पहचान व उपाय",     subEn:"Identify & treat" },
  { href:"/crops",      emoji:"📚", hi:"फसल गाइड",        en:"Crop Guide",           subHi:"50 फसलों की गाइड",     subEn:"50 crops guide" },
  { href:"/calculator", emoji:"🧮", hi:"कैलकुलेटर",       en:"Calculator",           subHi:"लागत-मुनाफा",           subEn:"Cost & profit" },
  { href:"/plant-id",   emoji:"🌿", hi:"रोग पहचान",       en:"Plant Disease ID",     subHi:"फोटो से रोग पहचानें",  subEn:"Upload & detect" },
  { href:"/chat",       emoji:"🤖", hi:"AI चैट",          en:"AI Chat",              subHi:"खेती का सवाल पूछें",   subEn:"Ask farming questions" },
  { href:"/fertilizer", emoji:"🧪", hi:"खाद सलाह",        en:"Fertilizer Advice",    subHi:"NPK आधारित सुझाव",     subEn:"NPK-based recommendation" },
  { href:"/tools",      emoji:"🛠️", hi:"खेती के उपकरण",   en:"Farming Tools",        subHi:"30 उपकरण गाइड",        subEn:"30 tools guide" },
];

const steps = [
  { n:1, hi:"स्थान डालें",      en:"Enter Location",    descHi:"गाँव का नाम लिखें — कोई अकाउंट नहीं चाहिए।",          descEn:"Type your village name — no account needed." },
  { n:2, hi:"मौसम और मिट्टी",   en:"Weather & Soil",    descHi:"हम अपने आप तापमान, बारिश और मिट्टी का डेटा लाते हैं।", descEn:"We auto-fetch temperature, rainfall and soil data." },
  { n:3, hi:"AI सुझाव",         en:"AI Suggestion",     descHi:"ML मॉडल शीर्ष 5 फसलें चुनता है।",                     descEn:"ML model picks the top 5 crops for you." },
  { n:4, hi:"समझदारी से उगाएँ", en:"Farm Smarter",      descHi:"बुवाई, पानी और खाद की सलाह देखें।",                   descEn:"See sowing, irrigation and fertilizer tips." },
];

const features = [
  { emoji:"🤖", hi:"AI-संचालित",     en:"AI-Powered",        descHi:"2200 मिट्टी-फसल नमूनों पर प्रशिक्षित मॉडल।",    descEn:"Model trained on 2200 soil-crop samples." },
  { emoji:"🌿", hi:"रोग पहचान",      en:"Disease Detection",  descHi:"फोटो अपलोड करें — AI रोग पहचानेगा।",            descEn:"Upload a photo — AI identifies the disease." },
  { emoji:"🧪", hi:"खाद सलाह",       en:"Fertilizer Advice",  descHi:"मिट्टी के अनुसार NPK और खाद की सलाह।",          descEn:"NPK and fertilizer advice based on soil." },
  { emoji:"🏪", hi:"मंडी भाव",       en:"Live Mandi Rates",   descHi:"34+ मंडियों के आज के थोक भाव।",                 descEn:"Today's wholesale rates from 34+ mandis." },
  { emoji:"🏛️", hi:"सरकारी योजनाएँ", en:"Gov. Schemes",       descHi:"15+ केंद्रीय योजनाओं की पूरी जानकारी।",         descEn:"Complete info on 15+ central schemes." },
  { emoji:"📱", hi:"मोबाइल फर्स्ट",  en:"Mobile First",       descHi:"धीमे इंटरनेट पर भी तेज़ और आसान।",              descEn:"Fast and easy even on slow internet." },
];

const HERO_CROPS = [
  { emoji:"🌾", hi:"धान",     en:"Rice" },
  { emoji:"🌿", hi:"गेहूँ",   en:"Wheat" },
  { emoji:"🌽", hi:"मक्का",   en:"Maize" },
  { emoji:"🤍", hi:"कपास",   en:"Cotton" },
  { emoji:"🍬", hi:"गन्ना",   en:"Sugarcane" },
  { emoji:"🫘", hi:"सोयाबीन", en:"Soybean" },
  { emoji:"🥜", hi:"मूँगफली", en:"Groundnut" },
  { emoji:"🥭", hi:"आम",     en:"Mango" },
];

export default function Home() {
  const { lang } = useLang();
  return (
    <div className="space-y-16">

      {/* ── Hero ── */}
      <section className="hero-section text-center py-16 px-6">
        <p className="text-sm font-semibold mb-4 opacity-90 tracking-wide uppercase"
           style={{color:"#fef3c7"}}>
          {t("मुफ़्त · बिना साइन-अप · 2G पर भी चले","Free · No sign-up · Works on 2G",lang)}
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-white drop-shadow">
          {t("सही फसल · सही समय","Right Crop · Right Time",lang)}<br/>
          <span style={{color:"#fef3c7"}}>{t("बेहतर उपज","Better Yield",lang)}</span>
        </h1>
        <p className="text-white/85 max-w-xl mx-auto mb-8 text-base leading-relaxed">
          {t(
            "AI की मदद से भारतीय किसानों के लिए फसल सुझाव, रोग पहचान, मंडी भाव और सरकारी योजनाएँ — सब एक जगह।",
            "AI-powered crop advice, disease detection, mandi prices and government schemes for Indian farmers — all in one place.",
            lang
          )}
        </p>
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <Link href="/recommend" className="btn-primary text-base px-7 py-3" style={{background:"linear-gradient(135deg,#e8a020,#c97d10)",boxShadow:"0 4px 16px rgba(232,160,32,0.4)"}}>
            🌱 {t("अभी सलाह लें","Get Advice",lang)}
          </Link>
          <Link href="/plant-id" className="text-base px-7 py-3 rounded-xl font-semibold transition-all"
            style={{background:"rgba(255,255,255,0.18)",border:"2px solid rgba(255,255,255,0.5)",color:"white",backdropFilter:"blur(4px)"}}>
            🌿 {t("रोग पहचान","Plant ID",lang)}
          </Link>
          <Link href="/mandi" className="text-base px-7 py-3 rounded-xl font-semibold transition-all"
            style={{background:"rgba(255,255,255,0.18)",border:"2px solid rgba(255,255,255,0.5)",color:"white",backdropFilter:"blur(4px)"}}>
            🏪 {t("मंडी भाव","Mandi Prices",lang)}
          </Link>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {HERO_CROPS.map(c => (
            <span key={c.en} className="crop-pill">
              {c.emoji} {t(c.hi, c.en, lang)}
            </span>
          ))}
        </div>
      </section>

      {/* ── Toolbox ── */}
      <section>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">🧰</span>
          <h2 className="section-title">{t("किसान का टूलबॉक्स","Farmer's Toolbox",lang)}</h2>
        </div>
        <p className="section-sub">{t("सभी ज़रूरी टूल एक जगह","All essential tools in one place",lang)}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {tools.map(tool => (
            <Link key={tool.href} href={tool.href} className="tool-card group">
              <div className="text-3xl mb-2">{tool.emoji}</div>
              <div className="font-bold text-sm mb-1" style={{color:"#1a6b3a"}}>{lang === "hi" ? tool.hi : tool.en}</div>
              <div className="text-xs" style={{color:"#5a6e57"}}>{lang === "hi" ? tool.subHi : tool.subEn}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">🔄</span>
          <h2 className="section-title">{t("कैसे काम करता है","How It Works",lang)}</h2>
        </div>
        <p className="section-sub">{t("4 आसान कदम","4 simple steps",lang)}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map(s => (
            <div key={s.n} className="card text-center">
              <div className="step-number">{s.n}</div>
              <div className="font-bold mb-1" style={{color:"#1a6b3a"}}>{lang === "hi" ? s.hi : s.en}</div>
              <div className="text-sm" style={{color:"#5a6e57"}}>{lang === "hi" ? s.descHi : s.descEn}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">✨</span>
          <h2 className="section-title">{t("Agri Advisor क्यों?","Why Agri Advisor?",lang)}</h2>
        </div>
        <p className="section-sub">{t("भारतीय किसानों के लिए ख़ास","Built specifically for Indian farmers",lang)}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map(f => (
            <div key={f.hi} className="feature-card">
              <div className="text-2xl mb-2">{f.emoji}</div>
              <div className="font-bold mb-1" style={{color:"#1a6b3a"}}>{lang === "hi" ? f.hi : f.en}</div>
              <div className="text-sm" style={{color:"#5a6e57"}}>{lang === "hi" ? f.descHi : f.descEn}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section text-white p-10 text-center">
        <h2 className="text-2xl font-extrabold mb-3">
          🚜 {t("आज से समझदारी से खेती करें","Farm smarter starting today",lang)}
        </h2>
        <p className="mb-6 text-white/80 max-w-lg mx-auto">
          {t(
            "AI आपकी मिट्टी और मौसम का विश्लेषण करके सबसे अच्छी फसल बताएगा।",
            "AI will analyse your soil and weather to suggest the best crops.",
            lang
          )}
        </p>
        <Link href="/recommend"
          className="inline-block font-bold px-10 py-3 rounded-xl transition-all"
          style={{background:"linear-gradient(135deg,#e8a020,#c97d10)",color:"white",boxShadow:"0 4px 18px rgba(232,160,32,0.45)"}}>
          {t("फसल सुझाव लें — मुफ़्त","Get crop advice — free",lang)}
        </Link>
      </section>

      {/* ── About ── */}
      <section className="max-w-2xl mx-auto pb-6">
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium select-none list-none flex items-center gap-1" style={{color:"#5a6e57"}}>
            <span className="transition-transform group-open:rotate-90 inline-block">▶</span>
            {t("Agri Advisor के बारे में", "About Agri Advisor", lang)}
          </summary>
          <div className="mt-4 space-y-3 text-sm leading-relaxed pl-4 border-l-2" style={{color:"#5a6e57", borderColor:"#bbf7d0"}}>
            <p>
              {t(
                "Agri Advisor एक AI-संचालित डिजिटल कृषि सहायक है जो भारतीय किसानों को सही फसल चुनने, रोग पहचानने, मंडी भाव जानने और सरकारी योजनाओं का लाभ उठाने में मदद करता है।",
                "Agri Advisor is an AI-powered digital farming assistant that helps Indian farmers choose the right crops, identify plant diseases, check mandi prices, and access government schemes.",
                lang
              )}
            </p>
            <p>
              <span className="font-semibold" style={{color:"#1a6b3a"}}>🎯 {t("लक्ष्य","Mission",lang)}:</span>{" "}
              {t("हर किसान तक सही जानकारी — भाषा और तकनीक की बाधा के बिना।","Right information for every farmer — without language or tech barriers.",lang)}
            </p>
            <p>
              <span className="font-semibold" style={{color:"#1a6b3a"}}>🛠️ {t("तकनीक","Tech",lang)}:</span>{" "}
              Next.js · Gemini AI · Open-Meteo API · ML crop model
            </p>
            <p>
              <span className="font-semibold" style={{color:"#1a6b3a"}}>🌍 {t("कवरेज","Coverage",lang)}:</span>{" "}
              {t("भारत के सभी राज्य · हिंदी और अंग्रेज़ी · 2G पर भी चले","All Indian states · Hindi & English · Works on 2G",lang)}
            </p>
            <p className="text-xs pt-1" style={{color:"#9ca3af"}}>
              © 2026 Agri Advisor · {t("किसानों के लिए, किसानों द्वारा","For farmers, by farmers",lang)} 🌱
            </p>
          </div>
        </details>
      </section>

    </div>
  );
}
