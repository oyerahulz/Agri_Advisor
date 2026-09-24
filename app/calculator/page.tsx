"use client";
import { useState } from "react";
import { CROPS } from "@/lib/data";
import { useLang, t } from "@/lib/lang";
import BackButton from "@/components/BackButton";

const MSP_CROPS = CROPS.filter(c => c.msp && c.msp > 0);
const DEFAULTS = { seed: 2000, fert: 3500, labour: 5000, irrig: 2000, other: 1000, yieldQ: 20, price: 2000, area: 1 };

function NumField({ label, value, onChange, prefix = "\u20b9", min = 0 }: {
  label: string; value: number; onChange: (v: number) => void; prefix?: string; min?: number;
}) {
  const [raw, setRaw] = useState<string | null>(null);
  const display = raw !== null ? raw : String(value);
  return (
    <div>
      <label className="block text-sm text-gray-500 mb-1">{label}</label>
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-green-400">
        <span className="px-3 py-2 bg-gray-50 text-gray-400 text-sm border-r border-gray-200 shrink-0">{prefix}</span>
        <input
          type="number" min={min} value={display}
          onFocus={() => setRaw("")}
          onBlur={() => {
            const n = parseFloat(raw ?? "");
            onChange(!isNaN(n) && n >= min ? n : value);
            setRaw(null);
          }}
          onChange={e => setRaw(e.target.value)}
          className="flex-1 px-3 py-2 text-sm outline-none bg-white w-full"
        />
      </div>
    </div>
  );
}

export default function CalculatorPage() {
  const { lang } = useLang();
  const [seed,    setSeed]    = useState(DEFAULTS.seed);
  const [fert,    setFert]    = useState(DEFAULTS.fert);
  const [labour,  setLabour]  = useState(DEFAULTS.labour);
  const [irrig,   setIrrig]   = useState(DEFAULTS.irrig);
  const [other,   setOther]   = useState(DEFAULTS.other);
  const [yieldQ,  setYieldQ]  = useState(DEFAULTS.yieldQ);
  const [price,   setPrice]   = useState(DEFAULTS.price);
  const [area,    setArea]    = useState(DEFAULTS.area);
  const [mspCrop, setMspCrop] = useState("");
  const [showResult, setShowResult] = useState(false);

  const totalCost = (seed + fert + labour + irrig + other) * area;
  const revenue   = yieldQ * price * area;
  const profit    = revenue - totalCost;
  const roi       = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(1) : "0";
  const breakeven = yieldQ > 0 ? (totalCost / (yieldQ * area)).toFixed(0) : "-";

  function applyMSP() {
    const crop = MSP_CROPS.find(c => c.id === mspCrop);
    if (crop?.msp) setPrice(crop.msp);
  }

  function reset() {
    setSeed(DEFAULTS.seed); setFert(DEFAULTS.fert); setLabour(DEFAULTS.labour);
    setIrrig(DEFAULTS.irrig); setOther(DEFAULTS.other); setYieldQ(DEFAULTS.yieldQ);
    setPrice(DEFAULTS.price); setArea(DEFAULTS.area); setMspCrop(""); setShowResult(false);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <BackButton />
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            🧮 {t("फसल लागत कैलकुलेटर","Crop Cost Calculator",lang)}
          </h1>
          <p className="text-gray-500">
            {t("लागत, उपज और मुनाफ़ा — सब एक जगह","Cost, yield and profit — all in one place",lang)}
          </p>
        </div>
        <button onClick={reset}
          className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-600 transition-colors font-medium whitespace-nowrap">
          🔄 {t("रीसेट","Reset",lang)}
        </button>
      </div>

      {/* Area */}
      <div className="card space-y-4">
        <h2 className="font-bold text-gray-700">📐 {t("खेत का क्षेत्रफल","Farm Area",lang)}</h2>
        <NumField label={t("एकड़ में क्षेत्रफल","Area (in acres)",lang)} value={area} onChange={setArea} prefix={t("एकड़","acre",lang)} min={0.1} />
      </div>

      {/* Costs */}
      <div className="card space-y-4">
        <h2 className="font-bold text-gray-700">💸 {t("लागत (प्रति एकड़)","Costs (per acre)",lang)}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumField label={t("बीज","Seed",lang)}              value={seed}   onChange={setSeed} />
          <NumField label={t("खाद/उर्वरक","Fertilizer",lang)} value={fert}   onChange={setFert} />
          <NumField label={t("मज़दूरी","Labour",lang)}         value={labour} onChange={setLabour} />
          <NumField label={t("सिंचाई","Irrigation",lang)}     value={irrig}  onChange={setIrrig} />
          <NumField label={t("अन्य खर्च","Other",lang)}       value={other}  onChange={setOther} />
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
          {t("कुल लागत/एकड़","Total cost/acre",lang)}:{" "}
          <span className="font-bold text-gray-800">₹{(seed+fert+labour+irrig+other).toLocaleString()}</span>
        </div>
      </div>

      {/* Yield & Price */}
      <div className="card space-y-4">
        <h2 className="font-bold text-gray-700">🌾 {t("उपज और बिक्री","Yield & Sale",lang)}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumField label={t("उपज (क्विंटल/एकड़)","Yield (qtl/acre)",lang)} value={yieldQ} onChange={setYieldQ} prefix={t("क्विंटल","qtl",lang)} />
          <NumField label={t("बिक्री भाव (₹/क्विंटल)","Sale price (₹/qtl)",lang)} value={price} onChange={setPrice} />
        </div>
        <div className="flex gap-2 items-end flex-wrap">
          <div className="flex-1 min-w-40">
            <label className="block text-sm text-gray-500 mb-1">{t("MSP से भाव लें","Use MSP price",lang)}</label>
            <select className="input-field text-sm" value={mspCrop} onChange={e => setMspCrop(e.target.value)}>
              <option value="">{t("-- फसल चुनें --","-- Select crop --",lang)}</option>
              {MSP_CROPS.map(c => (
                <option key={c.id} value={c.id}>
                  {lang === "hi" ? c.nameHi : c.nameEn}
                </option>
              ))}
            </select>
          </div>
          <button onClick={applyMSP} disabled={!mspCrop}
            className="btn-secondary text-sm px-4 py-2 disabled:opacity-40">
            {t("MSP लागू करें","Apply MSP",lang)}
          </button>
        </div>
      </div>

      {/* Calculate button */}
      <button onClick={() => setShowResult(true)}
        className="w-full btn-primary py-3 text-base font-bold rounded-xl">
        🧮 {t("गणना करें","Calculate",lang)}
      </button>

      {/* Results - only shown after Calculate clicked */}
      {showResult && (
        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 space-y-4">
          <h2 className="font-bold text-gray-800 text-lg">📊 {t("परिणाम","Results",lang)} ({area} {t("एकड़","acre",lang)})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <div className="text-xs text-gray-400 mb-1">{t("कुल लागत","Total Cost",lang)}</div>
              <div className="font-bold text-red-600 text-lg">₹{totalCost.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <div className="text-xs text-gray-400 mb-1">{t("कुल आमदनी","Revenue",lang)}</div>
              <div className="font-bold text-blue-600 text-lg">₹{revenue.toLocaleString()}</div>
            </div>
            <div className={`rounded-xl p-3 text-center shadow-sm ${profit >= 0 ? "bg-green-100" : "bg-red-100"}`}>
              <div className="text-xs text-gray-500 mb-1">{t("शुद्ध मुनाफ़ा","Net Profit",lang)}</div>
              <div className={`font-bold text-xl ${profit >= 0 ? "text-green-700" : "text-red-700"}`}>
                {profit >= 0 ? "+" : ""}₹{profit.toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <div className="text-xs text-gray-400 mb-1">ROI</div>
              <div className={`font-bold text-lg ${+roi >= 0 ? "text-green-700" : "text-red-600"}`}>{roi}%</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 text-sm text-gray-600">
            💡 {t(`ब्रेकईवन भाव: ₹${breakeven}/क्विंटल — इससे कम पर बेचने पर नुकसान होगा`,
              `Break-even price: ₹${breakeven}/qtl — selling below this means a loss`,lang)}
          </div>
        </div>
      )}
    </div>
  );
}
