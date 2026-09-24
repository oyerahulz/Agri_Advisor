"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLang, LANGUAGES, type Lang } from "@/lib/lang";
import Logo from "./Logo";

export default function Navbar() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  const current = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0];

  return (
    <nav className="navbar sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="navbar-logo flex items-center gap-2 text-xl">
          <Logo size={30} /> {lang === "hi" ? "एग्री एडवाइजर" : "Agri Advisor"}
        </Link>
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(o => !o)}
            className="lang-toggle text-sm flex items-center gap-1"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label="Choose language"
          >
            🌐 {current.native} <span className="text-xs opacity-70">▼</span>
          </button>
          {open && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-44 rounded-xl shadow-lg border border-white/20 bg-white text-gray-900 overflow-hidden"
            >
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  role="menuitem"
                  onClick={() => {
                    setLang(l.code as Lang);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-green-50 flex items-center justify-between ${
                    l.code === lang ? "bg-green-50 font-semibold" : ""
                  }`}
                >
                  <span>{l.native}</span>
                  {l.code === lang && <span className="text-green-600">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
