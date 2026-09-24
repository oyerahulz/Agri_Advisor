"use client";
import { useState } from "react";
import { DISEASES } from "@/lib/diseases";
import { useLang, t } from "@/lib/lang";
import BackButton from "@/components/BackButton";

const TYPES = [
  { v:"all",       hi:"सभी फसलें", en:"All Crops",  color:"" },
  { v:"fungal",    hi:"फफूंद",     en:"Fungal",     color:"bg-orange-100 text-orange-700 border-orange-200" },
  { v:"pest",      hi:"कीट",       en:"Pest",       color:"bg-red-100 text-red-700 border-red-200" },
  { v:"viral",     hi:"वायरस",     en:"Viral",      color:"bg-purple-100 text-purple-700 border-purple-200" },
  { v:"bacterial", hi:"जीवाणु",    en:"Bacterial",  color:"bg-blue-100 text-blue-700 border-blue-200" },
];

const TYPE_BADGE: Record<string,string> = {
  fungal:    "bg-orange-100 text-orange-700",
  pest:      "bg-red-100 text-red-700",
  viral:     "bg-purple-100 text-purple-700",
  bacterial: "bg-blue-100 text-blue-700",
};

const SECTION_STYLES = [
  { key:"symptoms",   icon:"🔴", labelHi:"लक्षण",          labelEn:"Symptoms",           bg:"#fff5f5", border:"#fecaca", text:"#991b1b" },
  { key:"prevention", icon:"🔵", labelHi:"रोकथाम",         labelEn:"Prevention",         bg:"#eff6ff", border:"#bfdbfe", text:"#1e40af" },
  { key:"organic",    icon:"🟢", labelHi:"जैविक उपाय",     labelEn:"Organic Remedy",     bg:"#f0fdf4", border:"#bbf7d0", text:"#166534" },
  { key:"chemical",   icon:"🟡", labelHi:"रासायनिक उपचार", labelEn:"Chemical Treatment", bg:"#fffbeb", border:"#fde68a", text:"#92400e" },
];

// Unique crop chips from data
const CROP_CHIPS = Array.from(
  new Map(DISEASES.map(d => [d.cropId, { id: d.cropId, emoji: d.cropEmoji, hi: d.cropHi, en: d.cropId }])).values()
);

export default function DiseasesPage() {
  const { lang } = useLang();
  const [type, setType]       = useState("all");
  const [search, setSearch]   = useState("");
  const [cropFilter, setCrop] = useState("all");
  const [openId, setOpenId]   = useState<string | null>(null);

  const filtered = DISEASES.filter(d => {
    const matchType = type === "all" || d.type === type;
    const matchCrop = cropFilter === "all" || d.cropId === cropFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || d.nameHi.includes(search) ||
      d.nameEn.toLowerCase().includes(q) ||
      d.cropHi.includes(search) ||
      d.cropId.toLowerCase().includes(q);
    return matchType && matchCrop && matchSearch;
  });

  function toggle(id: string) {
    setOpenId(prev => prev === id ? null : id);
  }

  return (
    <div className="space-y-5">
      <BackButton />

      {/* Header */}
      <div className="rounded-2xl p-6 text-white"
        style={{background:"linear-gradient(135deg,#b91c1c 0%,#dc2626 50%,#ef4444 100%)"}}>
        <h1 className="text-2xl font-bold mb-1">
          🔬 {t("फसल रोग एवं कीट गाइड", "Crop Disease & Pest Guide", lang)}
        </h1>
        <p className="text-red-100 text-sm">
          {t("सामान्य रोगों की पहचान करें — लक्षण, रोकथाम और उपचार",
            "Identify common diseases and pests — symptoms, prevention & treatment", lang)}
        </p>
        <div className="mt-3 inline-block bg-white/20 rounded-full px-3 py-1 text-xs font-medium">
          {DISEASES.length} {t("रोग/कीट", "Diseases/Pests", lang)}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          className="input-field pl-9"
          placeholder={t("फसल या रोग खोजें...", "Search crop or disease...", lang)}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Type filter chips */}
      <div className="flex flex-wrap gap-2">
        {TYPES.map(tp => (
          <button key={tp.v} onClick={() => setType(tp.v)}
            className={"text-sm px-4 py-1.5 rounded-full border-2 font-medium transition-all " + (
              type === tp.v
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
            )}>
            {lang === "hi" ? tp.hi : tp.en}
          </button>
        ))}
      </div>

      {/* Crop chips */}
      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => setCrop("all")}
          className={"text-xs px-3 py-1 rounded-full border transition-colors " + (
            cropFilter === "all" ? "bg-gray-700 text-white border-gray-700" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
          )}>
          {t("सभी", "All", lang)}
        </button>
        {CROP_CHIPS.map(c => (
          <button key={c.id} onClick={() => setCrop(c.id)}
            className={"text-xs px-3 py-1 rounded-full border transition-colors " + (
              cropFilter === c.id ? "bg-gray-700 text-white border-gray-700" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
            )}>
            {c.emoji} {lang === "hi" ? c.hi : c.en}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500">{filtered.length} {t("परिणाम", "results", lang)}</p>

      {/* Accordion list */}
      <div className="space-y-2">
        {filtered.map(d => {
          const isOpen = openId === d.id;
          const typeMeta = TYPES.find(tp => tp.v === d.type);
          return (
            <div key={d.id}
              className={"rounded-xl border transition-all overflow-hidden " + (isOpen ? "border-gray-300 shadow-md" : "border-gray-200 hover:border-gray-300")}>

              {/* Row header — click to toggle */}
              <button
                onClick={() => toggle(d.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors">
                <span className="text-2xl shrink-0">{d.cropEmoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800 text-sm">
                      {lang === "hi" ? d.nameHi : d.nameEn}
                    </span>
                    <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + (TYPE_BADGE[d.type] || "")}>
                      {lang === "hi" ? typeMeta?.hi : typeMeta?.en}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {lang === "hi" ? d.cropHi : d.cropId.charAt(0).toUpperCase() + d.cropId.slice(1)}
                  </div>
                </div>
                <span className={"text-gray-400 text-lg transition-transform duration-200 shrink-0 " + (isOpen ? "rotate-180" : "")}>
                  ▾
                </span>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="border-t border-gray-100">
                  {SECTION_STYLES.map(sec => {
                    const hiKey = sec.key + "Hi" as keyof typeof d;
                    const enKey = sec.key + "En" as keyof typeof d;
                    const content = lang === "hi" ? d[hiKey] : d[enKey];
                    return (
                      <div key={sec.key} className="px-4 py-3 border-b border-gray-50 last:border-0"
                        style={{background: sec.bg}}>
                        <div className="flex items-start gap-2">
                          <span className="text-sm mt-0.5">{sec.icon}</span>
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wide mb-1"
                              style={{color: sec.text}}>
                              {lang === "hi" ? sec.labelHi : sec.labelEn}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {content as string}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">🔍</div>
            <p>{t("कोई परिणाम नहीं मिला", "No results found", lang)}</p>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 text-xs text-amber-700 rounded-xl px-4 py-3"
        style={{background:"rgba(251,191,36,0.1)", border:"1px solid rgba(251,191,36,0.3)"}}>
        <span>⚠️</span>
        <span>{t(
          "गंभीर रोग के लिए स्थानीय कृषि अधिकारी से सलाह लें।",
          "For severe disease, consult your local agriculture officer at KVK.",
          lang
        )}</span>
      </div>
    </div>
  );
}
