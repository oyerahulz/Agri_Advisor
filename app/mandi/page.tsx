"use client";
import { useState } from "react";
import { MANDI_PRICES, MandiPrice } from "@/lib/mandi";
import { useLang, t } from "@/lib/lang";
import BackButton from "@/components/BackButton";
import { formatStateName } from "@/lib/i18n-data";

const CATS_EN = ["All","Cereal","Oilseed","Pulse","Cash","Vegetable","Fruit","Spice"];
const CATS_HI = ["सभी","अनाज","तिलहन","दलहन","नकदी","सब्जी","फल","मसाला"];

const EMPTY: Omit<MandiPrice,"id"> = {
  cropEmoji:"🌾", cropHi:"", cropEn:"", category:"Cereal",
  mandi:"", state:"", min:0, modal:0, max:0, trend:"stable"
};

// Commodity suggestions for search
const COMMODITY_SUGGESTIONS = [
  "Wheat","Rice","Maize","Soybean","Cotton","Mustard","Onion",
  "Potato","Tomato","Chickpea","Lentil","Bajra","Turmeric","Chilli","Garlic","Cumin"
];

interface LiveRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

function parseRecords(records: LiveRecord[]): MandiPrice[] {
  const emojiMap: Record<string,string> = {
    wheat:"🌿", rice:"🌾", paddy:"🌾", maize:"🌽", bajra:"🌾", jowar:"🌾",
    soybean:"🫘", mustard:"🌼", groundnut:"🥜", sunflower:"🌻", cotton:"🤍",
    onion:"🧅", potato:"🥔", tomato:"🍅", brinjal:"🍆", okra:"🟢",
    chickpea:"🟤", lentil:"🫘", arhar:"🫘", moong:"🟢",
    turmeric:"🟡", chilli:"🌶️", garlic:"🧄", cumin:"🟤", coriander:"🌿",
    mango:"🥭", banana:"🍌", pomegranate:"🔴", grape:"🍇",
    sugarcane:"🍬", jute:"🧶",
  };
  const catMap: Record<string,string> = {
    wheat:"Cereal", rice:"Cereal", paddy:"Cereal", maize:"Cereal", bajra:"Cereal", jowar:"Cereal", ragi:"Cereal",
    soybean:"Oilseed", mustard:"Oilseed", groundnut:"Oilseed", sunflower:"Oilseed", sesame:"Oilseed",
    cotton:"Cash", sugarcane:"Cash", jute:"Cash",
    chickpea:"Pulse", lentil:"Pulse", arhar:"Pulse", moong:"Pulse", urad:"Pulse",
    onion:"Vegetable", potato:"Vegetable", tomato:"Vegetable", brinjal:"Vegetable", okra:"Vegetable",
    mango:"Fruit", banana:"Fruit", pomegranate:"Fruit", grape:"Fruit",
    turmeric:"Spice", chilli:"Spice", garlic:"Spice", cumin:"Spice", coriander:"Spice",
  };

  return records.map((r, i) => {
    const key = r.commodity.toLowerCase().split(" ")[0];
    const modal = Math.round(parseFloat(r.modal_price) || 0);
    const min   = Math.round(parseFloat(r.min_price) || 0);
    const max   = Math.round(parseFloat(r.max_price) || 0);
    // Use emoji/category from API if present, else derive from maps
    return {
      id: "live-" + i,
      cropEmoji: (r as unknown as Record<string,string>).emoji ?? emojiMap[key] ?? "🌾",
      cropHi: r.commodity,
      cropEn: r.commodity,
      category: (r as unknown as Record<string,string>).category ?? catMap[key] ?? "Cereal",
      mandi: r.market,
      state: r.state,
      min,
      modal,
      max,
      trend: "stable" as const,
    };
  });
}

export default function MandiPage() {
  const { lang } = useLang();
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [extra, setExtra] = useState<MandiPrice[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<MandiPrice,"id">>({...EMPTY});

  // Live search state
  const [liveQuery, setLiveQuery] = useState("");
  const [liveType, setLiveType] = useState<"commodity"|"state"|"market">("commodity");
  const [liveData, setLiveData] = useState<MandiPrice[]|null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState("");
  const [liveDate, setLiveDate] = useState("");
  const [liveNote, setLiveNote] = useState("");

  const cats    = lang === "hi" ? CATS_HI : CATS_EN;
  const catKeys = CATS_EN; // always use EN keys for filtering
  const base    = liveData ?? [...MANDI_PRICES, ...extra];

  const filtered = base.filter(p => {
    const activeCatKey = catKeys[cats.indexOf(cat)] ?? "All";
    const matchCat = activeCatKey === "All" || p.category === activeCatKey;
    const q = search.toLowerCase();
    const matchSearch = !q || p.cropHi.toLowerCase().includes(q) ||
      p.cropEn.toLowerCase().includes(q) || p.mandi.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  async function handleLiveSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!liveQuery.trim()) return;
    setLiveLoading(true);
    setLiveError("");
    setLiveData(null);
    try {
      const params = new URLSearchParams({ [liveType]: liveQuery.trim() });
      const res = await fetch(`/api/mandi?${params.toString()}`);
      const json = await res.json();

      if (json.error) throw new Error(json.error);
      if (!json.records || json.records.length === 0) {
        setLiveError(lang === "hi"
          ? `"${liveQuery}" के लिए कोई डेटा नहीं मिला। दूसरा नाम आज़माएं।`
          : `No data found for "${liveQuery}". Try a different name.`);
      } else {
        const parsed = parseRecords(json.records as LiveRecord[]);
        setLiveData(parsed);
        if (json.records[0]?.arrival_date) setLiveDate(json.records[0].arrival_date);
        if (json.note) setLiveNote(json.note);
      }
    } catch {
      setLiveError(lang === "hi"
        ? "लाइव डेटा लोड नहीं हो सका। स्थैतिक डेटा दिखाया जा रहा है।"
        : "Could not load live data. Showing static data.");
    }
    setLiveLoading(false);
  }

  function resetLive() {
    setLiveData(null);
    setLiveQuery("");
    setLiveError("");
    setLiveDate("");
    setLiveNote("");
  }

  function addPrice() {
    if (!form.cropHi || !form.mandi) return;
    setExtra(prev => [...prev, { ...form, id: "custom-" + Date.now() }]);
    setForm({ ...EMPTY });
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <BackButton />
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            🏪 {t("मंडी भाव", "Mandi Prices", lang)}
          </h1>
          <p className="text-gray-500">{t("थोक बाज़ार भाव — Rs/क्विंटल", "Wholesale market rates — Rs/qtl", lang)}</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn-primary text-sm">
          + {t("भाव जोड़ें", "Add Price", lang)}
        </button>
      </div>

      {/* ── Live Search Card ── */}
      <div className="card space-y-3" style={{background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)",border:"1.5px solid #86efac"}}>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse inline-block" />
          <p className="text-sm font-bold text-green-800">
            {t("लाइव मंडी भाव — Agmarknet (data.gov.in)", "Live Mandi Prices — Agmarknet (data.gov.in)", lang)}
          </p>
        </div>

        <form onSubmit={handleLiveSearch} className="space-y-2">
          <div className="flex gap-2 flex-wrap">
            {(["commodity","state","market"] as const).map(type => (
              <button key={type} type="button"
                onClick={() => setLiveType(type)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${liveType === type ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-200 hover:border-green-400"}`}>
                {type === "commodity"
                  ? t("🌾 फसल", "🌾 Commodity", lang)
                  : type === "state"
                  ? t("📍 राज्य", "📍 State", lang)
                  : t("🏪 मंडी", "🏪 Market", lang)}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                className="input-field pr-4"
                placeholder={
                  liveType === "commodity"
                    ? t("फसल का नाम (जैसे: Wheat, Onion, Tomato)", "Crop name (e.g. Wheat, Onion, Tomato)", lang)
                    : liveType === "state"
                    ? t("राज्य का नाम (जैसे: Rajasthan, Punjab)", "State name (e.g. Rajasthan, Punjab)", lang)
                    : t("मंडी का नाम (जैसे: Azadpur, Nashik)", "Market name (e.g. Azadpur, Nashik)", lang)
                }
                value={liveQuery}
                onChange={e => setLiveQuery(e.target.value)}
              />
            </div>
            <button type="submit" disabled={liveLoading} className="btn-primary px-5 disabled:opacity-60 whitespace-nowrap">
              {liveLoading
                ? <span className="flex items-center gap-1"><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />{t("लोड हो रहा है...","Loading...",lang)}</span>
                : t("खोजें", "Search", lang)}
            </button>
            {liveData && (
              <button type="button" onClick={resetLive} className="btn-secondary px-3 text-sm">
                {t("रीसेट", "Reset", lang)}
              </button>
            )}
          </div>
        </form>

        {/* Suggestions */}
        {liveType === "commodity" && !liveData && (
          <div className="flex flex-wrap gap-1.5">
            {COMMODITY_SUGGESTIONS.map(s => (
              <button key={s} type="button"
                onClick={() => setLiveQuery(s)}
                className="text-xs px-2.5 py-1 bg-white border border-green-200 text-green-700 rounded-full hover:bg-green-50 transition-colors">
                {s}
              </button>
            ))}
          </div>
        )}

        {liveError && (
          <div className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-700">
            <span>⚠️</span>
            <span>{liveError}</span>
          </div>
        )}
        {liveData && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-green-700 font-medium">
              <span>✅</span>
              <span>{liveData.length} {t("रिकॉर्ड मिले", "records found", lang)}</span>
              {liveDate && <span className="text-gray-400">• {t("तारीख", "Date", lang)}: {liveDate}</span>}
            </div>
            {liveNote && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded px-2 py-1">
                ℹ️ {liveNote}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Add Price Form ── */}
      {showForm && (
        <div className="card border-green-200 space-y-3">
          <h3 className="font-bold text-gray-800">{t("नया भाव जोड़ें", "Add New Price", lang)}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div><label className="block text-gray-500 mb-1">{t("फसल (हिंदी)", "Crop (Hindi)", lang)}</label><input className="input-field" value={form.cropHi} onChange={e => setForm(f => ({ ...f, cropHi: e.target.value }))} /></div>
            <div><label className="block text-gray-500 mb-1">{t("फसल (English)", "Crop (English)", lang)}</label><input className="input-field" value={form.cropEn} onChange={e => setForm(f => ({ ...f, cropEn: e.target.value }))} /></div>
            <div><label className="block text-gray-500 mb-1">{t("मंडी", "Mandi", lang)}</label><input className="input-field" value={form.mandi} onChange={e => setForm(f => ({ ...f, mandi: e.target.value }))} /></div>
            <div><label className="block text-gray-500 mb-1">{t("राज्य", "State", lang)}</label><input className="input-field" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} /></div>
            <div><label className="block text-gray-500 mb-1">{t("न्यूनतम", "Min", lang)}</label><input type="number" className="input-field" value={form.min || ""} onChange={e => setForm(f => ({ ...f, min: +e.target.value }))} /></div>
            <div><label className="block text-gray-500 mb-1">{t("मॉडल", "Modal", lang)}</label><input type="number" className="input-field" value={form.modal || ""} onChange={e => setForm(f => ({ ...f, modal: +e.target.value }))} /></div>
            <div><label className="block text-gray-500 mb-1">{t("अधिकतम", "Max", lang)}</label><input type="number" className="input-field" value={form.max || ""} onChange={e => setForm(f => ({ ...f, max: +e.target.value }))} /></div>
            <div><label className="block text-gray-500 mb-1">{t("रुझान", "Trend", lang)}</label>
              <select className="input-field" value={form.trend} onChange={e => setForm(f => ({ ...f, trend: e.target.value as MandiPrice["trend"] }))}>
                <option value="up">{t("↑ बढ़त", "↑ Up", lang)}</option>
                <option value="down">{t("↓ गिरावट", "↓ Down", lang)}</option>
                <option value="stable">{t("→ स्थिर", "→ Stable", lang)}</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addPrice} className="btn-primary text-sm">{t("सहेजें", "Save", lang)}</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">{t("रद्द करें", "Cancel", lang)}</button>
          </div>
        </div>
      )}

      {/* ── Filter bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          className="input-field max-w-xs"
          placeholder={t("फसल या मंडी खोजें...", "Search crop or mandi...", lang)}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`text-sm px-3 py-1 rounded-full border transition-colors ${cat === c ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-200 hover:border-green-400"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr style={{background:"linear-gradient(135deg,#1a6b3a,#2d9e5f)",color:"white"}}>
              <th className="px-3 py-3 text-left font-semibold">{t("फसल", "Crop", lang)}</th>
              <th className="px-3 py-3 text-left font-semibold">{t("मंडी", "Mandi", lang)}</th>
              <th className="px-3 py-3 text-left font-semibold">{t("राज्य", "State", lang)}</th>
              <th className="px-3 py-3 text-right font-semibold">{t("न्यूनतम", "Min", lang)}</th>
              <th className="px-3 py-3 text-right font-semibold">{t("मॉडल", "Modal", lang)}</th>
              <th className="px-3 py-3 text-right font-semibold">{t("अधिकतम", "Max", lang)}</th>
              <th className="px-3 py-3 font-semibold">{t("रुझान", "Trend", lang)}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} className={`border-b border-gray-50 hover:bg-green-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                <td className="px-3 py-2.5 font-medium text-gray-800">{p.cropEmoji} {lang === "hi" ? p.cropHi : p.cropEn}</td>
                <td className="px-3 py-2.5 text-gray-600">{p.mandi}</td>
                <td className="px-3 py-2.5 text-gray-500 text-xs">{formatStateName(p.state, lang)}</td>
                <td className="px-3 py-2.5 text-right text-gray-500">₹{p.min.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-right font-bold text-gray-800">₹{p.modal.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-right text-gray-500">₹{p.max.toLocaleString()}</td>
                <td className="px-3 py-2.5">
                  <span className={`badge ${p.trend === "up" ? "bg-green-100 text-green-700" : p.trend === "down" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
                    {p.trend === "up" ? t("↑ बढ़त", "↑ Up", lang) : p.trend === "down" ? t("↓ गिरावट", "↓ Down", lang) : t("→ स्थिर", "→ Stable", lang)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">🔍</div>
            <p>{t("कोई परिणाम नहीं मिला", "No results found", lang)}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        {liveData
          ? t("✅ Agmarknet लाइव डेटा (data.gov.in)", "✅ Agmarknet live data (data.gov.in)", lang)
          : t("📊 स्थैतिक डेटा — लाइव भाव के लिए ऊपर खोजें", "📊 Static data — search above for live prices", lang)}
      </p>
    </div>
  );
}
