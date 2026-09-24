// Central config — API key loaded from .env.local (never hardcode here)
// Add this to .env.local: NEXT_PUBLIC_GEMINI_KEY=your_key_here
export const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY ?? "";
export const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";
