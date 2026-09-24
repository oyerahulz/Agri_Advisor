"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "hi" | "en";
const LangContext = createContext<{ lang: Lang; toggle: () => void }>({ lang: "hi", toggle: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("hi");
  return (
    <LangContext.Provider value={{ lang, toggle: () => setLang(l => l === "hi" ? "en" : "hi") }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() { return useContext(LangContext); }

// t() helper — returns hi or en string
export function t(hi: string, en: string, lang: Lang) { return lang === "hi" ? hi : en; }
