import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { LangProvider } from "@/lib/lang";

export const metadata: Metadata = {
  title: "Agri Advisor",
  description: "AI-powered agricultural advisor for Indian farmers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
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
          </footer>
        </LangProvider>
      </body>
    </html>
  );
}
