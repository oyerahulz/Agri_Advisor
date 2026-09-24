import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { LangProvider } from "@/lib/lang";

export const metadata: Metadata = {
  title: "Agri Advisor — AI Farming Assistant for Indian Farmers",
  description:
    "AI-powered agricultural advisor for Indian farmers: crop advice, disease detection, mandi prices, weather, fertilizer guidance and government schemes. Free, in 5 Indian languages.",
  applicationName: "Agri Advisor",
  authors: [{ name: "Rahul Kumar", url: "mailto:rahulkumarindia200@gmail.com" }],
  keywords: ["agriculture", "farming", "kisan", "crop advice", "mandi price", "plant disease", "India"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <LangProvider>
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
          <footer className="site-footer text-center text-sm py-6 mt-12">
            🌾 2026 Agri Advisor — एग्री एडवाइजर
            <br />
            <span>
              Developed by{" "}
              <a
                href="mailto:rahulkumarindia200@gmail.com"
                className="font-semibold underline decoration-dotted underline-offset-2"
              >
                Rahul Kumar
              </a>{" "}
              · ✉ rahulkumarindia200@gmail.com
            </span>
            <br />
            <a href="/about" className="underline decoration-dotted underline-offset-2 opacity-80 hover:opacity-100">
              About · हमारे बारे में
            </a>
            <span aria-hidden="true"> · </span>
            <a
              href="https://github.com/oyerahulz/Agri_Advisor"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted underline-offset-2 opacity-80 hover:opacity-100"
            >
              GitHub
            </a>
          </footer>
        </LangProvider>
      </body>
    </html>
  );
}
