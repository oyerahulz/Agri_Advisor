<div align="center">

# 🌾 Agri Advisor (Kisan Sathi)

**AI-powered farming assistant for Indian farmers**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-agri--advisor--two.vercel.app-16a34a?style=for-the-badge)](https://agri-advisor-two.vercel.app)
[![Developer](https://img.shields.io/badge/👨‍💻_Developer-Rahul_Kumar-blue?style=for-the-badge)](mailto:rahulkumarindia200@gmail.com)

![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI-8E75B2?style=flat-square&logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

<img src="public/screenshot.png" alt="Agri Advisor — home screen showing AI crop advice, weather, mandi prices, disease guide, calendar and 12 farming tools" width="100%"/>

</div>

---

## 🔗 Quick Links

| | |
|---|---|
| 🌐 **Live Website** | https://agri-advisor-two.vercel.app |
| ℹ️ **About Page** | https://agri-advisor-two.vercel.app/about |
| 👨‍💻 **Developer** | Rahul Kumar — rahulkumarindia200@gmail.com |

> This project is developed and maintained by **Rahul Kumar only**.

## ✨ Features

- 🌱 **AI Crop Advice** — top 5 crops matched to your village's soil, season, rainfall & temperature (ML model, 2200 samples)
- 🔬 **Plant Disease ID** — upload a photo, Gemini Vision identifies the disease with symptoms, prevention & treatment
- 🧪 **Fertilizer Advisor** — soil-test NPK values → exact fertilizer grade, dosage & application schedule with warnings
- 🏪 **Mandi Prices** — 30+ commodities across all major states, with trends and live search
- 🌦️ **Weather** — village-level 7-day forecast with farming-specific tips (Open-Meteo)
- 📅 **Crop Calendar** — monthly sowing/growing/harvesting cycle for 64 crops
- 🏛️ **Government Schemes** — PM-KISAN, PMFBY, KCC & more with eligibility and apply steps
- 🧮 **Cost Calculator** — per-acre cost, revenue, profit & break-even price
- 🛠️ **Farming Tools** — guide to 30 tools with features and usage
- 🤖 **AI Chat** — voice input/output, image upload, works offline with demo answers
- 🗣️ **5 Languages** — English, हिन्दी, मराठी, தமிழ், తెలుగు
- 📱 **Mobile-first** — fast on 2G, no sign-up, completely free

## 🚀 Getting Started

```bash
git clone https://github.com/oyerahulz/Agri_Advisor.git
cd Agri_Advisor/kiro_project/kisan-sathi
npm install

# create .env.local
echo "NEXT_PUBLIC_GEMINI_KEY=your_gemini_api_key" > .env.local

npm run dev
```

Open http://localhost:3000 — get a free Gemini key at [Google AI Studio](https://aistudio.google.com/apikey).

> The app works without a key too (demo mode) — AI chat & disease ID give helpful offline answers.

## 🛠️ Tech Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS 4** · **Google Gemini AI** (chat + vision) · **Open-Meteo API**
- ML crop recommendation model · Deployed on **Vercel**

## 📄 License & Author

**Rahul Kumar** · [rahulkumarindia200@gmail.com](mailto:rahulkumarindia200@gmail.com) · [GitHub](https://github.com/oyerahulz)

© 2026 Agri Advisor · For farmers, by farmers 🌱
