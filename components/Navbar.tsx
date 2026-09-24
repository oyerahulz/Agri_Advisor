"use client";
import Link from "next/link";
import { useLang } from "@/lib/lang";

export default function Navbar() {
  const { lang, toggle } = useLang();
  return (
    <nav className="navbar sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="navbar-logo flex items-center gap-2 text-xl">
          🚜 {lang === "hi" ? "एग्री एडवाइजर" : "Agri Advisor"}
        </Link>
        <button onClick={toggle} className="lang-toggle text-sm">
          {lang === "hi" ? "EN" : "हि"}
        </button>
      </div>
    </nav>
  );
}
