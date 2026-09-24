"use client";
import { useState } from "react";
import { useLang, t, type Lang } from "@/lib/lang";
import BackButton from "@/components/BackButton";
import { SOIL_TYPES, CROP_TYPES, recommendFertilizer } from "@/lib/fertilizer";
import {
  formatAgriTip,
  formatCropStage,
  formatFertilizerCrop,
  formatFertilizerName,
  formatIrrigation,
  formatScheduleAction,
  formatSoilType,
  formatWarning,
} from "@/lib/i18n-data";

const CROP_STAGES = ["Sowing", "Germination", "Vegetative", "Flowering", "Fruiting", "Harvesting"];
const IRRIGATION_TYPES = ["Tube Well", "Canal", "Drip", "Sprinkler", "Rainfed", "Flood"];

type FormData = {
  nitrogen: number; phosphorus: number; potassium: number;
  ph: number; soilType: string;
  temperature: number; humidity: number; rainfall: number; irrigationType: string;
  cropType: string; cropStage: string;
};

type Advisory = {
  fertilizer: string; confidence: number;
  npk: { n: number; p: number; k: number };
  dosage: number; costPer50kg: number;
  schedule: { day: number; action: string }[];
  warnings: string[];
  tip: string;
  reason: string;
};

const FERTILIZER_NPK: Record<string, { n: number; p: number; k: number; cost: number }> = {
  "Urea":     { n: 46, p: 0,  k: 0,  cost: 270  },
  "DAP":      { n: 18, p: 46, k: 0,  cost: 1350 },
  "14-35-14": { n: 14, p: 35, k: 14, cost: 1200 },
  "28-28":    { n: 28, p: 28, k: 0,  cost: 950  },
  "17-17-17": { n: 17, p: 17, k: 17, cost: 1100 },
  "20-20":    { n: 20, p: 20, k: 0,  cost: 850  },
  "10-26-26": { n: 10, p: 26, k: 26, cost: 1470 },
  "NPK Mix":  { n: 20, p: 20, k: 20, cost: 1300 },
};

const SCHEDULES: Record<string, { day: number; action: string }[]> = {
  "Sowing":     [{ day: 1, action: "Apply as basal dose uniformly during final ploughing." }, { day: 21, action: "First top dressing after germination." }],
  "Germination":[{ day: 1, action: "Light top dressing near root zone." }, { day: 15, action: "Second application after thinning." }],
  "Vegetative": [{ day: 1, action: "Apply split dose for active growth support." }, { day: 30, action: "First top dressing." }, { day: 45, action: "Second top dressing before flowering." }],
  "Flowering":  [{ day: 1, action: "Apply as basal dose uniformly during final ploughing." }, { day: 30, action: "First top dressing." }, { day: 45, action: "Second top dressing before flowering." }],
  "Fruiting":   [{ day: 1, action: "Foliar spray for micronutrient support." }, { day: 20, action: "Top dressing to support fruit development." }],
  "Harvesting": [{ day: 1, action: "Post-harvest soil enrichment application." }],
};

const AGRI_TIPS = [
  "Applying fertilizer in split doses reduces nutrient runoff, matching the crop's dynamic needs through its growth stages, which saves money and protects the environment.",
  "Always test soil before applying fertilizer. Over-application of nitrogen can cause leaf burn and groundwater contamination.",
  "Drip fertigation delivers nutrients directly to roots, improving efficiency by up to 40% compared to broadcast application.",
  "Organic matter improves fertilizer uptake. Mix compost with chemical fertilizers for best results.",
  "Apply fertilizer in the evening or early morning to reduce evaporation losses.",
];

function computeAdvisory(form: FormData): Advisory {
  const result = recommendFertilizer({
    temp: form.temperature, humidity: form.humidity, moisture: 40,
    soilType: form.soilType, cropType: form.cropType,
    nitrogen: form.nitrogen, potassium: form.potassium, phosphorous: form.phosphorus,
  });

  const npkInfo = FERTILIZER_NPK[result.fertilizer] ?? { n: 20, p: 20, k: 20, cost: 1000 };

  const reqN = result.deficits.n;
  const reqP = result.deficits.p;
  const reqK = result.deficits.k;

  // Dosage based on actual deficiency
  const dosage = Math.round(30 + reqN * 0.25 + reqP * 0.15 + reqK * 0.1);

  const warnings: string[] = [];
  if (form.rainfall > 100) warnings.push("High rainfall expected. Delay fertilizer application to prevent runoff.");
  if (form.ph < 5.5) warnings.push("Soil pH is too acidic. Apply lime before fertilizing.");
  if (form.ph > 8.0) warnings.push("Soil pH is too alkaline. Consider sulfur treatment first.");
  if (form.nitrogen > 80) warnings.push("Nitrogen levels already high. Reduce urea application to avoid toxicity.");
  if (form.phosphorus > 70) warnings.push("Phosphorus is sufficient. Skip DAP to avoid soil lock-up.");
  if (form.potassium > 80) warnings.push("Potassium levels are adequate. No MOP needed this season.");

  const schedule = SCHEDULES[form.cropStage] ?? SCHEDULES["Flowering"];
  const tip = AGRI_TIPS[Math.floor(Math.random() * AGRI_TIPS.length)];

  return {
    fertilizer: result.fertilizer,
    confidence: result.score,
    npk: { n: reqN, p: reqP, k: reqK },
    dosage,
    costPer50kg: npkInfo.cost,
    schedule,
    warnings,
    tip,
    reason: result.reason,
  };
}

function formatModelReason(advisory: Advisory, lang: Lang) {
  const parts = [
    advisory.npk.n > 10 ? t(`नाइट्रोजन ${advisory.npk.n} किलो/एकड़`, `nitrogen ${advisory.npk.n} kg/acre`, lang) : "",
    advisory.npk.p > 10 ? t(`फास्फोरस ${advisory.npk.p} किलो/एकड़`, `phosphorus ${advisory.npk.p} kg/acre`, lang) : "",
    advisory.npk.k > 10 ? t(`पोटेशियम ${advisory.npk.k} किलो/एकड़`, `potassium ${advisory.npk.k} kg/acre`, lang) : "",
  ].filter(Boolean);

  return parts.length
    ? t(
      `मॉडल ने आपकी मिट्टी और फसल की जरूरत की तुलना करके कमी निकाली: ${parts.join(", ")}। इसी कमी के अनुपात से यह खाद चुनी गई है।`,
      `The model compared your soil values with the crop target and found these gaps: ${parts.join(", ")}. The fertilizer is selected to match this nutrient ratio.`,
      lang
    )
    : t(
      "मॉडल के अनुसार NPK स्तर फसल की जरूरत के करीब हैं, इसलिए हल्की संतुलित खुराक सुझाई गई है।",
      "The model found NPK levels close to the crop target, so it suggests a light balanced maintenance dose.",
      lang
    );
}

export default function FertilizerPage() {
  const { lang } = useLang();
  const [form, setForm] = useState<FormData>({
    nitrogen: 50, phosphorus: 20, potassium: 30, ph: 6.5, soilType: "Loamy",
    temperature: 25, humidity: 60, rainfall: 120, irrigationType: "Tube Well",
    cropType: "Wheat", cropStage: "Sowing",
  });
  const [advisory, setAdvisory] = useState<Advisory | null>(null);

  function set(k: keyof FormData, v: string | number) {
    setForm(f => ({ ...f, [k]: typeof v === "string" ? v : Number(v) }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAdvisory(computeAdvisory(form));
  }

  // ── INPUT SCREEN ──────────────────────────────────────────────────────────
  if (!advisory) {
    return (
      <div className="min-h-screen" style={{ background: "#c8f5d8" }}>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <BackButton />

          {/* Header card */}
          <div className="rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0px_#000] p-8 mt-4">
            <h1 className="text-3xl font-black text-center uppercase tracking-tight text-gray-900 mb-2">
              {t("बुद्धिमान खाद निदान", "Intelligent Fertilizer Diagnostics", lang)}
            </h1>
            <div className="w-16 h-0.5 bg-black mx-auto mb-4" />
            <p className="text-center text-sm text-gray-600 max-w-md mx-auto">
              {t(
                "अपने खेत की जानकारी दर्ज करें और AI-आधारित सटीक खाद सुझाव पाएं।",
                "Empowering your harvest. Enter your recent field analysis parameters below for a precise, machine-learning optimized farming schedule.",
                lang
              )}
            </p>

            {/* 3-column grid */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* SOIL HEALTH */}
                <div className="rounded-xl border-2 border-black bg-[#d4f5e2] p-4 space-y-3">
                  <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                    <span className="text-2xl bg-white rounded-lg p-1 border border-black">🌱</span>
                    <span className="font-black uppercase text-sm tracking-wide">
                      {t("मिट्टी स्वास्थ्य", "Soil Health", lang)}
                    </span>
                  </div>
                  {[
                    { key: "nitrogen",   label: t("नाइट्रोजन (N)", "Nitrogen (N)", lang),   ph: t("जैसे: 50", "e.g. 50", lang) },
                    { key: "phosphorus", label: t("फास्फोरस (P)", "Phosphorus (P)", lang),  ph: t("जैसे: 20", "e.g. 20", lang) },
                    { key: "potassium",  label: t("पोटेशियम (K)", "Potassium (K)", lang),   ph: t("जैसे: 30", "e.g. 30", lang) },
                    { key: "ph",         label: t("pH स्तर", "PH Level", lang),              ph: t("जैसे: 6.5", "e.g. 6.5", lang) },
                  ].map(({ key, label, ph }) => (
                    <div key={key}>
                      <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
                        {label} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number" step="0.1" placeholder={ph}
                        value={form[key as keyof FormData] as number}
                        onChange={e => set(key as keyof FormData, e.target.value)}
                        className="w-full rounded-lg border-2 border-black bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
                      {t("मिट्टी का प्रकार", "Soil Type", lang)}
                    </label>
                    <select
                      value={form.soilType} onChange={e => set("soilType", e.target.value)}
                      className="w-full rounded-lg border-2 border-black bg-white px-3 py-2 text-sm font-medium focus:outline-none"
                    >
                      {SOIL_TYPES.map(s => <option key={s} value={s}>{formatSoilType(s, lang)}</option>)}
                    </select>
                  </div>
                </div>

                {/* CLIMATE */}
                <div className="rounded-xl border-2 border-black bg-[#d4f5e2] p-4 space-y-3">
                  <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                    <span className="text-2xl bg-white rounded-lg p-1 border border-black">🌤️</span>
                    <span className="font-black uppercase text-sm tracking-wide">
                      {t("जलवायु", "Climate", lang)}
                    </span>
                  </div>
                  {[
                    { key: "temperature", label: t("तापमान (°C)", "Temperature (°C)", lang), ph: t("जैसे: 25.5", "e.g. 25.5", lang) },
                    { key: "humidity",    label: t("नमी (%)", "Humidity (%)", lang),           ph: t("जैसे: 60", "e.g. 60", lang) },
                    { key: "rainfall",    label: t("वर्षा (mm)", "Rainfall (mm)", lang),       ph: t("जैसे: 120", "e.g. 120", lang) },
                  ].map(({ key, label, ph }) => (
                    <div key={key}>
                      <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
                        {label} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number" step="0.1" placeholder={ph}
                        value={form[key as keyof FormData] as number}
                        onChange={e => set(key as keyof FormData, e.target.value)}
                        className="w-full rounded-lg border-2 border-black bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
                      {t("सिंचाई प्रकार", "Irrigation Type", lang)}
                    </label>
                    <select
                      value={form.irrigationType} onChange={e => set("irrigationType", e.target.value)}
                      className="w-full rounded-lg border-2 border-black bg-white px-3 py-2 text-sm font-medium focus:outline-none"
                    >
                      {IRRIGATION_TYPES.map(s => <option key={s} value={s}>{formatIrrigation(s, lang)}</option>)}
                    </select>
                  </div>
                </div>

                {/* CROPS */}
                <div className="rounded-xl border-2 border-black bg-[#d4f5e2] p-4 space-y-3">
                  <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                    <span className="text-2xl bg-white rounded-lg p-1 border border-black">🌾</span>
                    <span className="font-black uppercase text-sm tracking-wide">
                      {t("फसल", "Crops", lang)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
                      {t("फसल का प्रकार", "Crop Type", lang)} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.cropType} onChange={e => set("cropType", e.target.value)}
                      className="w-full rounded-lg border-2 border-black bg-white px-3 py-2 text-sm font-medium focus:outline-none"
                    >
                      {CROP_TYPES.map(c => <option key={c} value={c}>{formatFertilizerCrop(c, lang)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
                      {t("फसल अवस्था", "Crop Stage", lang)}
                    </label>
                    <select
                      value={form.cropStage} onChange={e => set("cropStage", e.target.value)}
                      className="w-full rounded-lg border-2 border-black bg-white px-3 py-2 text-sm font-medium focus:outline-none"
                    >
                      {CROP_STAGES.map(s => <option key={s} value={s}>{formatCropStage(s, lang)}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl border-2 border-black bg-[#3ddc84] hover:bg-[#2bc970] font-black uppercase tracking-widest text-base shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] transition-all active:translate-y-0.5"
              >
                🤖 {t("AI सुझाव लें", "Get AI Recommendation", lang)}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── ADVISORY / RESULTS SCREEN ─────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "#c8f5d8" }}>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <BackButton />

        {/* Header row */}
        <div className="flex items-center justify-between rounded-xl border-2 border-black bg-white px-5 py-3 shadow-[3px_3px_0px_#000]">
          <div className="flex items-center gap-2">
            <span className="text-xl bg-[#d4f5e2] rounded-lg p-1 border border-black">📊</span>
            <span className="font-black uppercase tracking-wide text-sm">
              {t("आपकी सलाह", "Your Advisory", lang)}
            </span>
          </div>
          <button
            onClick={() => setAdvisory(null)}
            className="flex items-center gap-1 rounded-lg border-2 border-black bg-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-gray-50 shadow-[2px_2px_0px_#000]"
          >
            {t("नया डेटा दर्ज करें", "Input New Data", lang)} ↺
          </button>
        </div>

        {/* Warnings */}
        {advisory.warnings.map((w, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border-2 border-black bg-white px-5 py-3 shadow-[3px_3px_0px_#000]">
            <span className="text-xl mt-0.5">⚠️</span>
            <div>
              <p className="font-bold text-xs uppercase tracking-wide text-gray-700 mb-0.5">
                {t("चेतावनी", "Warning", lang)}
              </p>
              <p className="text-sm text-gray-700">{formatWarning(w, lang)}</p>
            </div>
          </div>
        ))}

        {/* Main 2-col row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Recommended fertilizer card — 2/3 width */}
          <div className="md:col-span-2 rounded-xl border-2 border-black bg-[#1a6b3a] text-white shadow-[4px_4px_0px_#000] p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-green-200 mb-1">
                  {t("अनुशंसित खाद", "Recommended Fertilizer", lang)}
                </p>
                <p className="text-4xl font-black tracking-tight">{formatFertilizerName(advisory.fertilizer, lang)}</p>
                {advisory.fertilizer.match(/\d/) && (
                  <p className="text-xs text-green-200 mt-1">
                    {t("यह N:P:K ग्रेड है, यानी नाइट्रोजन : फास्फोरस : पोटेशियम", "This is an N:P:K grade, meaning nitrogen : phosphorus : potassium", lang)}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-2xl bg-white/20 rounded-lg p-2">🌿</span>
                <span className="text-xs font-bold bg-black/30 rounded-full px-3 py-1">
                  AI {t("विश्वास", "Confidence", lang)}: {advisory.confidence}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* NPK */}
              <div className="rounded-lg border border-white/30 bg-white/10 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-green-200 mb-2">
                  {t("आवश्यक पोषक (किलो/एकड़)", "Required Nutrients (kg/acre)", lang)}
                </p>
                <div className="flex gap-3">
                  {[
                    { label: t("नाइट्रोजन", "Nitrogen", lang), short: "N", val: advisory.npk.n, color: "bg-green-400" },
                    { label: t("फास्फोरस", "Phosphorus", lang), short: "P", val: advisory.npk.p, color: "bg-yellow-300" },
                    { label: t("पोटेशियम", "Potassium", lang), short: "K", val: advisory.npk.k, color: "bg-orange-300" },
                  ].map(({ label, short, val, color }) => (
                    <div key={label} className="flex flex-col items-center">
                      <span className={`${color} text-black font-black text-lg rounded-lg w-10 h-10 flex items-center justify-center`}>
                        {val}
                      </span>
                      <span className="text-xs text-green-200 mt-1 uppercase" title={label}>{short}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dosage */}
              <div className="rounded-lg border border-white/30 bg-white/10 p-3 flex flex-col justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-green-200 mb-1">
                  {t("कुल खुराक", "Total Dosage Needed", lang)}
                </p>
                <p className="text-3xl font-black leading-tight">
                  {advisory.dosage} <span className="text-base font-bold">{t("किलो", "kg", lang)}</span>
                </p>
                <p className="text-xl font-black">{t("प्रति एकड़", "per acre", lang)}</p>
                <p className="text-xs text-green-300 mt-1">* {t("चुनी फसल और क्षेत्र के लिए", "For selected crop & area", lang)}</p>
              </div>
            </div>
          </div>

          {/* Cost card — 1/3 width */}
          <div className="rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_#000] p-5 flex flex-col items-center justify-center text-center space-y-3">
            <span className="text-4xl">💰</span>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              {t("अनुमानित लागत", "Estimated Cost", lang)}
            </p>
            <div className="rounded-xl border-2 border-black bg-[#d4f5e2] px-4 py-3 w-full">
              <p className="text-3xl font-black text-gray-900">₹{advisory.costPer50kg}</p>
              <p className="text-sm font-bold text-gray-700">{t("प्रति", "per", lang)}</p>
              <p className="text-xl font-black text-gray-900">{t("50 किलो बोरी", "50kg bag", lang)}</p>
            </div>
            <p className="text-xs text-gray-400">* {t("कीमतें स्थानीय रूप से भिन्न हो सकती हैं", "Prices may vary locally", lang)}</p>
          </div>

          <div className="md:col-span-3 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_#000] p-4">
            <p className="text-xs font-black uppercase tracking-wide text-gray-500 mb-1">
              {t("मॉडल का आधार", "Model Basis", lang)}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{formatModelReason(advisory, lang)}</p>
          </div>
        </div>

        {/* Bottom 2-col row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Schedule — 2/3 */}
          <div className="md:col-span-2 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_#000] p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl bg-[#d4f5e2] rounded-lg p-1 border border-black">📅</span>
              <span className="font-black uppercase tracking-wide text-sm">
                {t("आवेदन अनुसूची", "Application Schedule", lang)}
              </span>
            </div>
            <div className="relative pl-6 space-y-3">
              {/* vertical line */}
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-[#3ddc84]" />
              {advisory.schedule.map((s, i) => (
                <div key={i} className="relative">
                  {/* dot */}
                  <div className="absolute -left-4 top-3 w-3 h-3 rounded-full bg-[#1a6b3a] border-2 border-white shadow" />
                  <div className="rounded-xl border-2 border-black bg-[#f0fdf4] p-3">
                    <p className="text-xs font-black uppercase tracking-wide text-gray-500 mb-1">
                      {t("दिन", "Day", lang)} {s.day}
                    </p>
                    <p className="text-sm text-gray-700">{formatScheduleAction(s.action, lang)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agri-tip — 1/3 */}
          <div className="rounded-xl border-2 border-black bg-[#1a6b3a] text-white shadow-[4px_4px_0px_#000] p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-black uppercase tracking-wide text-sm">
                {t("कृषि सुझाव", "Agri-Tip", lang)}
              </span>
              <span>✨</span>
            </div>
            <p className="text-sm text-green-100 leading-relaxed flex-1">{formatAgriTip(advisory.tip, lang)}</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 py-2">
          © 2026 Digital Krishi Advisor. {t("AI के साथ भविष्य उगाएं", "Growing the future with AI", lang)} ⚡
        </p>
      </div>
    </div>
  );
}
