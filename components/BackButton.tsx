"use client";
import { useRouter } from "next/navigation";
import { useLang, t } from "@/lib/lang";

export default function BackButton() {
  const router = useRouter();
  const { lang } = useLang();
  return (
    <button onClick={() => router.push("/")} className="back-btn">
      <span className="text-base">←</span>
      {t("होम पर वापस जाएं", "Back to Home", lang)}
    </button>
  );
}
