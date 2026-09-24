# 🌾 Agri Advisor (Kisan Sathi)

AI-powered agricultural advisor for Indian farmers — crop advice, disease identification, mandi prices, weather, fertilizer calculator, crop calendar, and government schemes (yojana), in Hindi and English.

**Developer: Rahul Kumar** — ✉ rahulkumarindia200@gmail.com

> This project is developed and maintained by **Rahul Kumar only**.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- React 19 + TypeScript
- Tailwind CSS 4
- Google Gemini API for AI chat/advice (optional)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create `.env.local` in the project root:

```
NEXT_PUBLIC_GEMINI_KEY=your_gemini_api_key_here
```

> Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey). Without it, all non-AI features (mandi prices, weather, calendar, schemes, calculator) still work.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it on [Vercel](https://vercel.com/new).
3. Add environment variable `NEXT_PUBLIC_GEMINI_KEY` in Project Settings → Environment Variables.
4. Deploy.

## Author

**Rahul Kumar** · rahulkumarindia200@gmail.com
