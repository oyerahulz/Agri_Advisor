"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "hi" | "en";
const LangContext = createContext<{ lang: Lang; toggle: () => void }>({ lang: "en", toggle: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  // Default language: English (restores a saved choice if present)
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("agri-lang");
      if (saved === "hi" || saved === "en") setLang(saved);
    } catch {}
  }, []);

  const toggle = () =>
    setLang(l => {
      const next: Lang = l === "hi" ? "en" : "hi";
      try { window.localStorage.setItem("agri-lang", next); } catch {}
      return next;
    });

  return (
    <LangContext.Provider value={{ lang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() { return useContext(LangContext); }

// t() helper — returns hi or en string
export function t(hi: string, en: string, lang: Lang) { return lang === "hi" ? hi : en; }
