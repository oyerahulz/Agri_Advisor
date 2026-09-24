"use client";
import { useState } from "react";
import { CROPS, Crop } from "@/lib/data";
import { useLang, t } from "@/lib/lang";
import BackButton from "@/components/BackButton";
import {
  formatCropCategory,
  formatCropDuration,
  formatCropSoil,
  formatCropTip,
  formatCropWater,
  formatSeason,
} from "@/lib/i18n-data";

const SEASONS = [{v:"all",hi:"सभी",en:"All"},{v:"kharif",hi:"खरीफ",en:"Kharif"},{v:"rabi",hi:"रबी",en:"Rabi"},{v:"annual",hi:"वार्षिक",en:"Annual"}];
const CATS = [{v:"all",hi:"सभी",en:"All"},{v:"cereal",hi:"अनाज",en:"Cereal"},{v:"pulse",hi:"दलहन",en:"Pulse"},{v:"oilseed",hi:"तिलहन",en:"Oilseed"},{v:"cash",hi:"नकदी",en:"Cash"},{v:"plantation",hi:"बागान",en:"Plantation"},{v:"spice",hi:"मसाले",en:"Spice"},{v:"fruit",hi:"फल",en:"Fruit"},{v:"vegetable",hi:"सब्जी",en:"Vegetable"}];

const EMPTY_CROP: Omit<Crop,"id"|"sowMonths"|"harvestMonths"> & {sowMonths:number[];harvestMonths:number[]} = {
  emoji:"🌿", nameHi:"", nameEn:"", season:"kharif", category:"cereal",
  temp:"20-35°C", water:"Medium", duration:"90-120 days", soil:"Loam",
  npk:"N:P:K = 120:60:40", tip:"", msp:0,
  sowMonths:[], harvestMonths:[],
};

export default function CropsPage() {
  const { lang } = useLang();
  const [season, setSeason] = useState("all");
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [extra, setExtra] = useState<Crop[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({...EMPTY_CROP});

  const allCrops = [...CROPS, ...extra];
  const filtered = allCrops.filter(c => {
    const mS = season === "all" || c.season === season;
    const mC = cat === "all" || c.category === cat;
    const mQ = c.nameHi.includes(search) || c.nameEn.toLowerCase().includes(search.toLowerCase());
    return mS && mC && mQ;
  });
  const detail = allCrops.find(c => c.id === selected);

  function addCrop() {
    if (!form.nameHi || !form.nameEn) return;
    setExtra(prev => [...prev, { ...form, id: "custom-" + Date.now() }]);
    setForm({...EMPTY_CROP});
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <BackButton />
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">📚 {t("फसल गाइड","Crop Guide",lang)}</h1>
          <p className="text-gray-500">{t(`${allCrops.length} प्रमुख फसलों की पूरी जानकारी`,`Complete guide to ${allCrops.length} major crops`,lang)}</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-1 btn-primary text-sm">
          + {t("फसल जोड़ें","Add Crop",lang)}
        </button>
      </div>

      {showForm && (
        <div className="card border-green-200 space-y-3">
          <h3 className="font-bold text-gray-800">{t("नई फसल जोड़ें","Add New Crop",lang)}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div><label className="block text-gray-500 mb-1">{t("नाम (हिंदी)","Name (Hindi)",lang)}</label><input className="input-field" value={form.nameHi} onChange={e=>setForm(f=>({...f,nameHi:e.target.value}))} /></div>
            <div><label className="block text-gray-500 mb-1">{t("नाम (English)","Name (English)",lang)}</label><input className="input-field" value={form.nameEn} onChange={e=>setForm(f=>({...f,nameEn:e.target.value}))} /></div>
            <div><label className="block text-gray-500 mb-1">{t("इमोजी","Emoji",lang)}</label><input className="input-field" value={form.emoji} onChange={e=>setForm(f=>({...f,emoji:e.target.value}))} /></div>
            <div><label className="block text-gray-500 mb-1">{t("मौसम","Season",lang)}</label>
              <select className="input-field" value={form.season} onChange={e=>setForm(f=>({...f,season:e.target.value as Crop["season"]}))}>
                {SEASONS.filter(s=>s.v!=="all").map(s=><option key={s.v} value={s.v}>{lang==="hi"?s.hi:s.en}</option>)}
              </select>
            </div>
            <div><label className="block text-gray-500 mb-1">{t("श्रेणी","Category",lang)}</label>
              <select className="input-field" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value as Crop["category"]}))}>
                {CATS.filter(c=>c.v!=="all").map(c=><option key={c.v} value={c.v}>{lang==="hi"?c.hi:c.en}</option>)}
              </select>
            </div>
            <div><label className="block text-gray-500 mb-1">{t("तापमान","Temperature",lang)}</label><input className="input-field" placeholder="20-35°C" value={form.temp} onChange={e=>setForm(f=>({...f,temp:e.target.value}))} /></div>
            <div><label className="block text-gray-500 mb-1">{t("पानी","Water",lang)}</label><input className="input-field" placeholder={t("मध्यम","Medium",lang)} value={form.water} onChange={e=>setForm(f=>({...f,water:e.target.value}))} /></div>
            <div><label className="block text-gray-500 mb-1">{t("अवधि","Duration",lang)}</label><input className="input-field" placeholder={t("90-120 दिन","90-120 days",lang)} value={form.duration} onChange={e=>setForm(f=>({...f,duration:e.target.value}))} /></div>
            <div><label className="block text-gray-500 mb-1">{t("मिट्टी","Soil",lang)}</label><input className="input-field" value={form.soil} onChange={e=>setForm(f=>({...f,soil:e.target.value}))} /></div>
            <div><label className="block text-gray-500 mb-1">NPK</label><input className="input-field" placeholder="N:P:K = 120:60:40" value={form.npk} onChange={e=>setForm(f=>({...f,npk:e.target.value}))} /></div>
            <div className="sm:col-span-2"><label className="block text-gray-500 mb-1">{t("सुझाव","Tip",lang)}</label><textarea className="input-field" rows={2} value={form.tip} onChange={e=>setForm(f=>({...f,tip:e.target.value}))} /></div>
          </div>
          <div className="flex gap-2">
            <button onClick={addCrop} className="btn-primary text-sm">{t("सहेजें","Save",lang)}</button>
            <button onClick={()=>setShowForm(false)} className="btn-secondary text-sm">{t("रद्द करें","Cancel",lang)}</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <input className="input-field max-w-xs" placeholder={t("फसल खोजें...","Search crops...",lang)} value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          {SEASONS.map(s => (
            <button key={s.v} onClick={() => setSeason(s.v)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${season === s.v ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-200 hover:border-green-400"}`}>
              {lang === "hi" ? s.hi : s.en}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {CATS.map(c => (
            <button key={c.v} onClick={() => setCat(c.v)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${cat === c.v ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"}`}>
              {lang === "hi" ? c.hi : c.en}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map(c => (
          <button key={c.id} onClick={() => setSelected(c.id === selected ? null : c.id)}
            className={`card text-center hover:shadow-md transition-all ${selected === c.id ? "border-green-400 ring-2 ring-green-200" : ""}`}>
            <div className="text-3xl mb-1">{c.emoji}</div>
            <div className="font-semibold text-gray-800 text-sm">{lang === "hi" ? c.nameHi : c.nameEn}</div>
            {c.id.startsWith("custom-") && <div className="text-xs text-yellow-600 mt-1">{t("कस्टम","Custom",lang)}</div>}
          </button>
        ))}
        {filtered.length === 0 && <p className="col-span-5 text-center text-gray-400 py-8">{t("कोई फसल नहीं मिली","No crops found",lang)}</p>}
      </div>
      {detail && (
        <div className="card border-green-200 bg-green-50/30 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{detail.emoji}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{lang === "hi" ? detail.nameHi : detail.nameEn}</h2>
              <p className="text-gray-500">
                {detail.nameEn} · {formatSeason(detail.season, lang)} · {formatCropCategory(detail.category, lang)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div className="bg-white rounded-lg p-3"><div className="text-gray-400 text-xs">{t("तापमान","Temperature",lang)}</div><div className="font-medium">{detail.temp}</div></div>
            <div className="bg-white rounded-lg p-3"><div className="text-gray-400 text-xs">{t("पानी","Water",lang)}</div><div className="font-medium">{formatCropWater(detail.water, lang)}</div></div>
            <div className="bg-white rounded-lg p-3"><div className="text-gray-400 text-xs">{t("अवधि","Duration",lang)}</div><div className="font-medium">{formatCropDuration(detail.duration, lang)}</div></div>
            <div className="bg-white rounded-lg p-3"><div className="text-gray-400 text-xs">NPK</div><div className="font-medium text-xs">{detail.npk}</div></div>
            <div className="bg-white rounded-lg p-3"><div className="text-gray-400 text-xs">{t("मिट्टी","Soil",lang)}</div><div className="font-medium text-xs">{formatCropSoil(detail.soil, lang)}</div></div>
            {detail.msp ? <div className="bg-white rounded-lg p-3"><div className="text-gray-400 text-xs">MSP</div><div className="font-medium text-green-700">Rs.{detail.msp}/{t("क्विंटल","qtl",lang)}</div></div> : null}
          </div>
          <div className="bg-green-100 rounded-lg p-3 text-sm text-green-800">💡 {formatCropTip(detail.tip, lang)}</div>
        </div>
      )}
    </div>
  );
}
