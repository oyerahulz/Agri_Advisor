"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { UI_TRANSLATIONS, translatePattern } from "./translations";

export type Lang = "hi" | "en" | "mr" | "ta" | "te";

export const LANGUAGES: { code: Lang; native: string; locale: string }[] = [
  { code: "en", native: "English", locale: "en-IN" },
  { code: "hi", native: "हिन्दी", locale: "hi-IN" },
  { code: "mr", native: "मराठी", locale: "mr-IN" },
  { code: "ta", native: "தமிழ்", locale: "ta-IN" },
  { code: "te", native: "తెలుగు", locale: "te-IN" },
];

export function localeFor(lang: Lang): string {
  return LANGUAGES.find(l => l.code === lang)?.locale ?? "en-IN";
}

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; toggle: () => void }>({
  lang: "en",
  setLang: () => {},
  toggle: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  // Default language: English (restores a saved choice if present)
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("agri-lang");
      if (saved === "hi" || saved === "en" || saved === "mr" || saved === "ta" || saved === "te") setLangState(saved);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { window.localStorage.setItem("agri-lang", l); } catch {}
  };

  const toggle = () => setLang(lang === "en" ? "hi" : "en");

  return (
    <LangContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() { return useContext(LangContext); }

// t() helper — returns the hi or en string; for mr/ta/te it looks the English
// string up in the UI translation dictionary (with pattern fallback for
// dynamic strings) and falls back to English.
export function t(hi: string, en: string, lang: Lang): string {
  if (lang === "hi") return hi;
  if (lang === "en") return en;
  return UI_TRANSLATIONS[lang]?.[en] ?? translatePattern(en, lang) ?? en;
}
