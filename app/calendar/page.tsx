"use client";
import { useState } from "react";
import { CROPS } from "@/lib/data";
import { useLang, t } from "@/lib/lang";
import BackButton from "@/components/BackButton";
import { formatCropDuration, formatCropWater } from "@/lib/i18n-data";

const MONTHS_HI = ["जन","फर","मार","अप्र","मई","जून","जुल","अग","सित","अक्त","नव","दिस"];
const MONTHS_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const CATS = [
  { v:"all",        hi:"सभी",      en:"All" },
  { v:"cereal",     hi:"अनाज",     en:"Cereal" },
  { v:"pulse",      hi:"दलहन",     en:"Pulse" },
  { v:"oilseed",    hi:"तिलहन",    en:"Oilseed" },
  { v:"cash",       hi:"नकदी",     en:"Cash" },
  { v:"plantation", hi:"बागान",    en:"Plantation" },
  { v:"vegetable",  hi:"सब्जी",    en:"Vegetable" },
  { v:"fruit",      hi:"फल",       en:"Fruit" },
  { v:"spice",      hi:"मसाले",    en:"Spice" },
];

const SEASON_COLORS: Record<string, string> = {
  kharif:  "#2d9e5f",
  rabi:    "#3b82f6",
  zaid:    "#f59e0b",
  annual:  "#8b5cf6",
};

const SEASON_LABELS: Record<string, { hi: string; en: string }> = {
  kharif: { hi: "खरीफ",  en: "Kharif" },
  rabi:   { hi: "रबी",   en: "Rabi" },
  zaid:   { hi: "जायद",  en: "Zaid" },
  annual: { hi: "वार्षिक", en: "Annual" },
};

function activeMonths(sowMonths: number[], harvestMonths: number[]) {
  const months = new Set([...sowMonths, ...harvestMonths]);
  for (const sow of sowMonths) {
    for (const harvest of harvestMonths) {
      const distance = (harvest - sow + 12) % 12;
      if (distance > 0 && distance <= 9) {
        for (let i = 1; i < distance; i++) months.add((sow + i) % 12);
      }
    }
  }
  return months;
}

export default function CalendarPage() {
  const { lang } = useLang();
  const [cat, setCat]       = useState("all");
  const [search, setSearch] = useState("");
  const [highlight, setHighlight] = useState<number | null>(new Date().getMonth());

  const months = lang === "hi" ? MONTHS_HI : MONTHS_EN;

  const filtered = CROPS.filter(c => {
    const matchCat = cat === "all" || c.category === cat;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      c.nameHi.includes(q) ||
      c.nameEn.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const activeInHighlight = highlight === null ? [] : filtered.filter(c => activeMonths(c.sowMonths, c.harvestMonths).has(highlight));
  const sowingNow = highlight === null ? [] : filtered.filter(c => c.sowMonths.includes(highlight));
  const harvestingNow = highlight === null ? [] : filtered.filter(c => c.harvestMonths.includes(highlight));

  // Count crops active in each month
  const monthActivity = Array.from({ length: 12 }, (_, m) => ({
    sow:     CROPS.filter(c => c.sowMonths.includes(m)).length,
    harvest: CROPS.filter(c => c.harvestMonths.includes(m)).length,
  }));

  return (
    <div className="space-y-5">
      <BackButton />

      <div className="rounded-2xl overflow-hidden border border-green-200 shadow-sm">
        <div
          className="px-5 py-6 text-white"
          style={{
            background:
              "linear-gradient(135deg, rgba(26,107,58,0.96), rgba(45,158,95,0.88)), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=70') center/cover",
          }}
        >
          <h1 className="text-3xl font-bold mb-1">
            📅 {t("फसल कैलेंडर", "Crop Calendar", lang)}
          </h1>
          <p className="text-sm text-white/85">
            {t("बुवाई, बढ़वार और कटाई का मासिक चक्र", "Monthly sowing, growing and harvesting cycle", lang)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="card flex items-center gap-3 border-green-200">
          <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold">🌱</div>
          <div>
            <div className="text-2xl font-extrabold text-green-700">{sowingNow.length}</div>
            <div className="text-xs text-gray-500">{t("इस महीने बुवाई", "Sowing now", lang)} · {highlight !== null ? months[highlight] : ""}</div>
          </div>
        </div>
        <div className="card flex items-center gap-3 border-amber-200">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">🌾</div>
          <div>
            <div className="text-2xl font-extrabold text-amber-700">{harvestingNow.length}</div>
            <div className="text-xs text-gray-500">{t("इस महीने कटाई", "Harvesting now", lang)} · {highlight !== null ? months[highlight] : ""}</div>
          </div>
        </div>
        <div className="card flex items-center gap-3 border-blue-200">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">📊</div>
          <div>
            <div className="text-2xl font-extrabold text-blue-700">{filtered.length}</div>
            <div className="text-xs text-gray-500">{t("कुल फसलें दिखाई गईं", "Crops shown", lang)}</div>
          </div>
        </div>
      </div>

      <div className="card space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <input
            className="input-field text-sm lg:max-w-sm"
            placeholder={t("फसल, क्षेत्र या नाम खोजें...", "Search crop, region or name...", lang)}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="text-xs text-gray-400">
            {t(`${filtered.length} में से ${CROPS.length} फसलें`, `Showing ${filtered.length} of ${CROPS.length} crops`, lang)}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATS.map(c => (
            <button key={c.v} onClick={() => setCat(c.v)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                cat === c.v
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
              }`}>
              {lang === "hi" ? c.hi : c.en}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-xs pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-3 rounded-sm inline-block" style={{background:"#22c55e"}}></span>
            {t("बुवाई", "Sowing", lang)}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-3 rounded-sm inline-block" style={{background:"#e8a020"}}></span>
            {t("बढ़वार", "Growing", lang)}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-3 rounded-sm inline-block" style={{background:"#f97316"}}></span>
            {t("कटाई", "Harvesting", lang)}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-green-200 shadow-sm bg-white">
        <table className="w-full text-xs border-collapse" style={{minWidth:"980px"}}>
          <thead>
            <tr style={{background:"linear-gradient(135deg,#1a6b3a,#2d9e5f)", color:"white"}}>
              <th className="text-left px-3 py-3 font-semibold sticky left-0 z-20"
                style={{background:"#1a6b3a", minWidth:"230px"}}>
                {t("फसल", "Crop", lang)}
              </th>
              {months.map((m, i) => (
                <th key={i}
                  onClick={() => setHighlight(highlight === i ? null : i)}
                  className="text-center py-3 font-semibold cursor-pointer select-none transition-colors"
                  style={{
                    minWidth:"62px",
                    background: highlight === i ? "#e8a020" : undefined,
                    color: highlight === i ? "#1c2b1a" : "white",
                  }}>
                  {m}
                  <div className="flex gap-px justify-center mt-1">
                    {monthActivity[i].sow > 0 && (
                      <div className="rounded-sm" style={{width:"7px", height:"3px", background:"#bbf7d0", opacity:0.9}}></div>
                    )}
                    {monthActivity[i].harvest > 0 && (
                      <div className="rounded-sm" style={{width:"7px", height:"3px", background:"#fed7aa", opacity:0.9}}></div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((crop, idx) => {
              const seasonColor = SEASON_COLORS[crop.season] || "#6b7280";
              const growingMonths = activeMonths(crop.sowMonths, crop.harvestMonths);
              return (
                <tr key={crop.id}
                  style={{background: idx % 2 === 0 ? "#ffffff" : "#f7fbf7"}}
                  className="hover:bg-green-50 transition-colors group">
                  <td className="px-3 py-2 border-b border-green-100 sticky left-0 z-10 group-hover:bg-green-50"
                    style={{background: idx % 2 === 0 ? "#ffffff" : "#f7fbf7"}}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{crop.emoji}</span>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-800 leading-tight">
                          {lang === "hi" ? crop.nameHi : crop.nameEn}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className="w-2 h-2 rounded-full inline-block shrink-0"
                            style={{background: seasonColor}}></span>
                          <span className="text-gray-400" style={{fontSize:"10px"}}>
                            {lang === "hi" ? SEASON_LABELS[crop.season]?.hi : SEASON_LABELS[crop.season]?.en}
                            {" · "}{formatCropDuration(crop.duration, lang)}
                          </span>
                        </div>
                        <div className="text-gray-400 mt-0.5 truncate" style={{fontSize:"10px"}}>
                          {formatCropWater(crop.water, lang)} · {crop.temp}
                        </div>
                      </div>
                    </div>
                  </td>

                  {Array.from({ length: 12 }, (_, m) => {
                    const isSow     = crop.sowMonths.includes(m);
                    const isHarvest = crop.harvestMonths.includes(m);
                    const isBoth    = isSow && isHarvest;
                    const isHL      = highlight === m;
                    const isGrow    = growingMonths.has(m);

                    let bg = "transparent";
                    let label = "";
                    if (isBoth)         { bg = "#fbbf24"; label = t("दोनों", "Both", lang); }
                    else if (isSow)     { bg = "#22c55e"; label = t("बोएं", "Sow", lang); }
                    else if (isHarvest) { bg = "#f97316"; label = t("काटें", "Harv", lang); }
                    else if (isGrow)    { bg = "#e8a020"; label = t("बढ़े", "Grow", lang); }

                    return (
                      <td key={m}
                        className="text-center border-b border-green-100 py-1.5 px-1"
                        style={{
                          background: isHL ? "rgba(220,252,231,0.7)" : "transparent",
                        }}>
                        {(isSow || isHarvest || isGrow) && (
                          <div className="mx-auto rounded-md flex items-center justify-center font-bold text-white shadow-sm"
                            style={{
                              background: bg,
                              width: "48px",
                              height: "20px",
                              fontSize: lang === "hi" ? "9px" : "10px",
                              boxShadow: isHL ? "0 0 0 2px #166534" : undefined,
                            }}>
                            {label}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Month summary strip */}
      {highlight !== null && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl p-4 border" style={{background:"rgba(34,197,94,0.06)", borderColor:"rgba(34,197,94,0.2)"}}>
          <div className="font-semibold text-green-800 mb-2 text-sm">
            📆 {months[highlight]} — {t("इस महीने की गतिविधि", "Activity this month", lang)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <div className="text-xs font-medium text-amber-700 mb-1">
                🌿 {t("सक्रिय", "Active", lang)} ({activeInHighlight.length})
              </div>
              <div className="flex flex-wrap gap-1">
                {activeInHighlight.slice(0, 18).map(c => (
                  <span key={c.id} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                    style={{background:"rgba(232,160,32,0.16)", color:"#92400e"}}>
                    {c.emoji} {lang === "hi" ? c.nameHi : c.nameEn}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-green-700 mb-1">
                🌱 {t("बुवाई", "Sowing", lang)} ({filtered.filter(c => c.sowMonths.includes(highlight)).length})
              </div>
              <div className="flex flex-wrap gap-1">
                {filtered.filter(c => c.sowMonths.includes(highlight)).map(c => (
                  <span key={c.id} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                    style={{background:"rgba(34,197,94,0.15)", color:"#166534"}}>
                    {c.emoji} {lang === "hi" ? c.nameHi : c.nameEn}
                  </span>
                ))}
                {filtered.filter(c => c.sowMonths.includes(highlight)).length === 0 && (
                  <span className="text-xs text-gray-400">{t("कोई नहीं", "None", lang)}</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-orange-700 mb-1">
                🌾 {t("कटाई", "Harvesting", lang)} ({filtered.filter(c => c.harvestMonths.includes(highlight)).length})
              </div>
              <div className="flex flex-wrap gap-1">
                {filtered.filter(c => c.harvestMonths.includes(highlight)).map(c => (
                  <span key={c.id} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                    style={{background:"rgba(249,115,22,0.12)", color:"#c2410c"}}>
                    {c.emoji} {lang === "hi" ? c.nameHi : c.nameEn}
                  </span>
                ))}
                {filtered.filter(c => c.harvestMonths.includes(highlight)).length === 0 && (
                  <span className="text-xs text-gray-400">{t("कोई नहीं", "None", lang)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-4 border bg-white" style={{borderColor:"rgba(45,158,95,0.2)"}}>
          <div className="font-semibold text-green-800 mb-3 text-sm">
            📚 {t("श्रेणी सारांश", "Category Summary", lang)}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {CATS.filter(c => c.v !== "all").map(c => {
              const count = filtered.filter(crop => crop.category === c.v).length;
              return (
                <div key={c.v} className="flex items-center justify-between border-b border-green-50 pb-1">
                  <span className="text-gray-600">{lang === "hi" ? c.hi : c.en}</span>
                  <span className="font-bold text-green-700">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        {t(
          `${filtered.length} फसलें दिखाई जा रही हैं · महीने पर क्लिक करें विवरण के लिए`,
          `Showing ${filtered.length} crops · Click a month header to see details`,
          lang
        )}
      </p>
    </div>
  );
}
