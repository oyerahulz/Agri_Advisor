"use client";
import { useState } from "react";
import { useLang, t } from "@/lib/lang";
import BackButton from "@/components/BackButton";
import { FARM_TOOLS, TOOL_CATEGORIES, FarmTool } from "@/lib/tools";
import { formatToolCategory, formatToolUsage } from "@/lib/i18n-data";

export default function ToolsPage() {
  const { lang } = useLang();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<FarmTool | null>(null);

  const filtered = FARM_TOOLS.filter(tool => {
    const matchCat = category === "All" || tool.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      tool.nameEn.toLowerCase().includes(q) ||
      tool.nameHi.includes(q) ||
      tool.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      <BackButton />
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          🛠️ {t("खेती के उपकरण", "Farming Tools", lang)}
        </h1>
        <p className="text-gray-500 text-sm">
          {t("30 उपकरण — विशेषताएं, उपयोग और जानकारी", "30 tools — features, usage and details", lang)}
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder={t("उपकरण खोजें...", "Search tools...", lang)}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field flex-1"
        />
        <select
          className="input-field sm:w-52"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="All">{t("सभी श्रेणियां", "All Categories", lang)}</option>
          {TOOL_CATEGORIES.map(c => <option key={c} value={c}>{formatToolCategory(c, lang)}</option>)}
        </select>
      </div>

      <p className="text-xs text-gray-400">
        {filtered.length} {t("उपकरण मिले", "tools found", lang)}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(tool => (
          <div
            key={tool.id}
            className="card hover:shadow-lg hover:border-green-200 transition-all cursor-pointer group overflow-hidden p-0"
            onClick={() => setSelected(tool)}
          >
            <div className="relative w-full h-44 overflow-hidden bg-gray-100">
              <img
                src={tool.image}
                alt={tool.nameEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80"; }}
              />
              <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                {formatToolCategory(tool.category, lang)}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 text-base group-hover:text-green-700">
                {lang === "hi" ? tool.nameHi : tool.nameEn}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {lang === "hi" ? tool.descHi : tool.descEn}
              </p>
              <button className="mt-3 text-xs text-green-600 font-medium hover:underline">
                {t("विवरण देखें →", "View Details →", lang)}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🔍</div>
          <p>{t("कोई उपकरण नहीं मिला", "No tools found", lang)}</p>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative w-full h-52 overflow-hidden rounded-t-2xl bg-gray-100">
              <img
                src={selected.image}
                alt={selected.nameEn}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80"; }}
              />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-600 font-bold shadow"
              >✕</button>
              <span className="absolute bottom-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                {formatToolCategory(selected.category, lang)}
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {lang === "hi" ? selected.nameHi : selected.nameEn}
                </h2>
                <p className="text-sm text-gray-400">{lang === "hi" ? selected.nameEn : selected.nameHi}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                    📌 {t("विवरण", "Description", lang)}
                  </p>
                  <p className="text-sm text-gray-700">
                    {lang === "hi" ? selected.descHi : selected.descEn}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                    ⚙️ {t("विशेषताएं", "Features & Where to Use", lang)}
                  </p>
                  <p className="text-sm text-gray-700">
                    {lang === "hi" ? selected.featureHi : selected.featureEn}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1">
                    🔧 {t("कैसे उपयोग करें", "How to Use", lang)}
                  </p>
                  <p className="text-sm text-gray-700">
                    {lang === "hi" ? formatToolUsage(selected.howToUseHi, lang) : selected.howToUseEn}
                  </p>
                </div>
              </div>

              {selected.youtubeUrl && (
                <a
                  href={selected.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  {t("YouTube पर ट्यूटोरियल देखें", "Watch Tutorial on YouTube", lang)}
                </a>
              )}

              <button
                onClick={() => setSelected(null)}
                className="btn-secondary w-full py-2 text-sm"
              >
                {t("बंद करें", "Close", lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
