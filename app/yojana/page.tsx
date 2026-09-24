"use client";
import { useState } from "react";
import { SCHEMES, Scheme, getEffectiveStatus, daysUntilDeadline, daysUntilLaunch } from "@/lib/schemes";
import { useLang, t } from "@/lib/lang";
import BackButton from "@/components/BackButton";

const CATS = [
  { v:"all",       hi:"सभी",        en:"All" },
  { v:"subsidy",   hi:"सब्सिडी",    en:"Subsidy" },
  { v:"insurance", hi:"बीमा",       en:"Insurance" },
  { v:"loan",      hi:"ऋण",         en:"Loan" },
  { v:"equipment", hi:"यंत्र",      en:"Equipment" },
  { v:"irrigation",hi:"सिंचाई",     en:"Irrigation" },
  { v:"other",     hi:"अन्य",       en:"Other" },
];

const TABS = [
  { v:"active",   hi:"✅ सक्रिय",    en:"✅ Active" },
  { v:"upcoming", hi:"🔜 आने वाली",  en:"🔜 Upcoming" },
  { v:"expired",  hi:"❌ बंद",       en:"❌ Expired" },
];

export default function YojanaPage() {
  const { lang } = useLang();
  const [tab, setTab]   = useState<"active"|"upcoming"|"expired">("active");
  const [cat, setCat]   = useState("all");
  const [open, setOpen] = useState<string|null>(null);
  const [search, setSearch] = useState("");

  // Resolve effective status for every scheme using today's date
  const withStatus = SCHEMES.map(s => ({ ...s, _eff: getEffectiveStatus(s) }));

  const tabFiltered = withStatus.filter(s => s._eff === tab);
  const catFiltered = cat === "all" ? tabFiltered : tabFiltered.filter(s => s.category === cat);
  const filtered = catFiltered.filter(s => {
    const q = search.toLowerCase();
    return !q || (lang === "hi" ? s.nameHi : s.nameEn).toLowerCase().includes(q) ||
      s.benefitEn.toLowerCase().includes(q);
  });

  const counts = {
    active:   withStatus.filter(s => s._eff === "active").length,
    upcoming: withStatus.filter(s => s._eff === "upcoming").length,
    expired:  withStatus.filter(s => s._eff === "expired").length,
  };

  return (
    <div className="space-y-6">
      <BackButton />
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          🏛️ {t("सरकारी योजनाएँ", "Government Schemes", lang)}
        </h1>
        <p className="text-gray-500 text-sm">
          {t(
            "किसानों के लिए केंद्रीय योजनाएँ — स्वतः अपडेट होती हैं",
            "Central schemes for farmers — auto-updated by date",
            lang
          )}
        </p>
      </div>

      {/* ── Status Tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(tb => (
          <button key={tb.v} onClick={() => { setTab(tb.v as typeof tab); setOpen(null); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
              tab === tb.v
                ? tb.v === "active"   ? "bg-green-600 text-white border-green-600"
                : tb.v === "upcoming" ? "bg-blue-600 text-white border-blue-600"
                :                       "bg-gray-500 text-white border-gray-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
            }`}>
            {lang === "hi" ? tb.hi : tb.en}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
              tab === tb.v ? "bg-white/25" : "bg-gray-100 text-gray-500"
            }`}>
              {counts[tb.v as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Info banner per tab ── */}
      {tab === "active" && (
        <div className="flex items-start gap-2 text-sm rounded-xl px-4 py-3"
          style={{background:"rgba(45,158,95,0.08)",border:"1px solid rgba(45,158,95,0.2)",color:"#1a6b3a"}}>
          <span>✅</span>
          <span>{t("ये योजनाएँ अभी आवेदन के लिए खुली हैं। समय सीमा वाली योजनाओं पर ध्यान दें।",
            "These schemes are currently open for applications. Watch for deadline warnings.", lang)}</span>
        </div>
      )}
      {tab === "upcoming" && (
        <div className="flex items-start gap-2 text-sm rounded-xl px-4 py-3"
          style={{background:"rgba(59,130,246,0.08)",border:"1px solid rgba(59,130,246,0.2)",color:"#1d4ed8"}}>
          <span>🔜</span>
          <span>{t("ये योजनाएँ जल्द लॉन्च होंगी। तैयार रहें और नज़र रखें।",
            "These schemes are launching soon. Stay prepared and keep an eye out.", lang)}</span>
        </div>
      )}
      {tab === "expired" && (
        <div className="flex items-start gap-2 text-sm rounded-xl px-4 py-3"
          style={{background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.2)",color:"#b91c1c"}}>
          <span>❌</span>
          <span>{t("ये योजनाएँ बंद हो चुकी हैं या उनकी अंतिम तिथि निकल चुकी है।",
            "These schemes are closed or their application deadline has passed.", lang)}</span>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          className="input-field max-w-xs"
          placeholder={t("योजना खोजें...", "Search schemes...", lang)}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {CATS.map(c => (
            <button key={c.v} onClick={() => setCat(c.v)}
              className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                cat === c.v ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
              }`}>
              {lang === "hi" ? c.hi : c.en}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scheme Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(s => {
          const days = daysUntilDeadline(s);
          const launchDays = daysUntilLaunch(s);
          const isUrgent = days !== null && days <= 30 && days >= 0;
          const isExpiring = days !== null && days > 30 && days <= 90;

          return (
            <div key={s.id} className={`card transition-all hover:shadow-md ${
              tab === "expired"  ? "opacity-60 border-dashed" :
              tab === "upcoming" ? "border-blue-200 bg-blue-50/30" :
              isUrgent           ? "border-red-300 bg-red-50/20" :
              isExpiring         ? "border-amber-300 bg-amber-50/20" : ""
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-3xl">{s.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <div className="font-bold text-gray-800 text-sm leading-snug">
                      {lang === "hi" ? s.nameHi : s.nameEn}
                    </div>
                    {/* Status badges */}
                    {tab === "expired" && (
                      <span className="badge bg-red-100 text-red-700 shrink-0">
                        {t("बंद", "Closed", lang)}
                      </span>
                    )}
                    {tab === "upcoming" && (
                      <span className="badge bg-blue-100 text-blue-700 shrink-0">
                        {t("जल्द आएगी", "Coming Soon", lang)}
                      </span>
                    )}
                    {isUrgent && (
                      <span className="badge bg-red-100 text-red-700 shrink-0 animate-pulse">
                        ⚠️ {days === 0 ? t("आज अंतिम दिन!", "Last day!", lang) : t(`${days} दिन बचे`, `${days} days left`, lang)}
                      </span>
                    )}
                    {isExpiring && (
                      <span className="badge bg-amber-100 text-amber-700 shrink-0">
                        ⏳ {t(`${days} दिन बचे`, `${days} days left`, lang)}
                      </span>
                    )}
                  </div>

                  <div className="text-green-700 font-medium text-sm mt-1">
                    {lang === "hi" ? s.benefit : s.benefitEn}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {lang === "hi" ? s.ministry : s.ministryEn}
                  </div>

                  {/* Deadline / launch info */}
                  {(s.deadlineNote || s.deadlineNoteHi) && (
                    <div className={`text-xs mt-1 font-medium ${
                      tab === "expired"  ? "text-red-500" :
                      tab === "upcoming" ? "text-blue-600" :
                      isUrgent           ? "text-red-600" :
                      isExpiring         ? "text-amber-600" : "text-gray-400"
                    }`}>
                      📅 {lang === "hi" ? (s.deadlineNoteHi || s.deadlineNote) : s.deadlineNote}
                    </div>
                  )}
                  {tab === "upcoming" && launchDays !== null && launchDays > 0 && (
                    <div className="text-xs text-blue-600 font-medium mt-0.5">
                      🚀 {t(`${launchDays} दिन में लॉन्च`, `Launches in ${launchDays} days`, lang)}
                    </div>
                  )}
                </div>
              </div>

              {/* Expandable details */}
              {open === s.id ? (
                <div className="mt-3 space-y-2 text-sm border-t border-gray-100 pt-3">
                  <div>
                    <span className="font-medium text-gray-700">{t("पात्रता: ", "Eligibility: ", lang)}</span>
                    <span className="text-gray-600">{lang === "hi" ? s.eligibility : s.eligibilityEn}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">{t("आवेदन: ", "Apply: ", lang)}</span>
                    <span className="text-gray-600">{lang === "hi" ? s.howToApply : s.howToApplyEn}</span>
                  </div>
                  {s.link && tab !== "expired" && (
                    <a href={s.link} target="_blank" rel="noopener noreferrer"
                      className="inline-block mt-1 text-blue-600 hover:underline text-xs">
                      🔗 {t("आधिकारिक वेबसाइट →", "Official Website →", lang)}
                    </a>
                  )}
                  <button onClick={() => setOpen(null)} className="block text-xs text-gray-400 mt-1">
                    {t("कम दिखाएं ▲", "Show less ▲", lang)}
                  </button>
                </div>
              ) : (
                <button onClick={() => setOpen(s.id)}
                  className="text-xs text-green-600 mt-2 hover:underline">
                  {t("विवरण देखें ▼", "View details ▼", lang)}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-2">🔍</div>
          <p>{t("कोई योजना नहीं मिली", "No schemes found", lang)}</p>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        {t(
          "⚙️ योजनाएँ तारीख के अनुसार स्वतः सक्रिय/बंद होती हैं",
          "⚙️ Schemes auto-activate/expire based on today's date",
          lang
        )}
      </p>
    </div>
  );
}
