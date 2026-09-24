# Agri Advisor — Complete Interview Preparation Guide

---

## 1. PROJECT OVERVIEW

### What is this project?

**Agri Advisor (एग्री एडवाइजर)** is an AI-powered digital farming assistant built for Indian farmers. It is a full-stack web application that brings together crop advice, disease detection, mandi prices, weather forecasts, government schemes, and fertilizer recommendations — all in one place, in both Hindi and English.

### What problem does it solve?

Indian farmers face several challenges:
- They don't know which crop to grow based on their soil, season, and location
- They can't easily identify plant diseases early
- They don't have real-time access to mandi (wholesale market) prices
- Government scheme information is scattered and hard to understand
- Fertilizer advice requires expensive soil testing labs

This app solves all of these problems in a single, mobile-friendly, free platform that works even on slow 2G internet.

### Who are the target users?

- Small and marginal farmers across India
- Agricultural extension workers
- Students studying agriculture
- Anyone who wants to understand Indian farming

---

## 2. TECH STACK ANALYSIS

### Frontend
| Technology | Why Used | Advantages | Alternatives |
|---|---|---|---|
| **Next.js 16** | Full-stack React framework | App Router, SSR, API routes built-in, file-based routing | Create React App, Vite+React, Remix |
| **React 19** | UI library | Component-based, reactive state, huge ecosystem | Vue.js, Svelte, Angular |
| **TypeScript** | Type safety | Catches bugs at compile time, better IDE support | Plain JavaScript |
| **Tailwind CSS 4** | Utility-first styling | Fast to write, no CSS files needed, responsive by default | Bootstrap, Material UI, plain CSS |

### Backend
| Technology | Why Used | Advantages | Alternatives |
|---|---|---|---|
| **Next.js API Routes** | Server-side logic | No separate backend server needed, same codebase | Express.js, FastAPI, Django |
| **Node.js (via Next.js)** | Runtime | Non-blocking I/O, JavaScript everywhere | Python, Java, Go |

### APIs & External Services
| API | Purpose | Why Chosen |
|---|---|---|
| **Google Gemini Flash** | AI chat, plant disease ID | Free tier, multimodal (text + image), fast responses |
| **Open-Meteo API** | Weather forecast | Free, no API key needed, accurate for India |
| **Web Speech API** | Voice input/output in chat | Browser-native, no cost, works offline |

### ML / Algorithm
| Component | Approach | Why |
|---|---|---|
| **Crop Recommendation** | Nearest-neighbor scoring algorithm | No server needed, runs in browser, fast |
| **Fertilizer Recommendation** | K-Nearest Neighbor on 100+ records | Dataset-based, deterministic, no ML library needed |
| **Mandi Prices** | Seeded pseudo-random variance | Simulates real price fluctuation, consistent per day |

### Database
- **No external database** — all data is stored in TypeScript files (`lib/data.ts`, `lib/diseases.ts`, `lib/schemes.ts`, `lib/mandi.ts`)
- This is intentional: zero latency, no server cost, works offline

---

## 3. ARCHITECTURE BREAKDOWN

### Overall Architecture: **Monolithic Full-Stack (Next.js App Router)**

```
Browser (React + Tailwind)
        ↓ ↑
Next.js Server (API Routes)
        ↓ ↑
External APIs (Gemini, Open-Meteo)
        ↓ ↑
Static Data (TypeScript lib files)
```

### How it works:

1. **User opens the app** → Next.js serves the React page (SSR or CSR depending on the page)
2. **User interacts** → React state updates, UI re-renders
3. **For AI features** → Client calls Gemini API directly (or via Next.js API route)
4. **For mandi prices** → Client calls `/api/mandi` (Next.js API route) which generates prices server-side
5. **For weather** → Client calls Open-Meteo API directly from browser
6. **For crop/fertilizer advice** → Pure client-side algorithm, no network call needed

### File Structure Explained:
```
kisan-sathi/
├── app/                    ← Next.js App Router pages
│   ├── page.tsx            ← Home page (/)
│   ├── chat/page.tsx       ← AI Chat (/chat)
│   ├── recommend/page.tsx  ← Crop Advice (/recommend)
│   ├── fertilizer/page.tsx ← Fertilizer Advice (/fertilizer)
│   ├── weather/page.tsx    ← Weather (/weather)
│   ├── mandi/page.tsx      ← Mandi Prices (/mandi)
│   ├── diseases/page.tsx   ← Disease Guide (/diseases)
│   ├── crops/page.tsx      ← Crop Guide (/crops)
│   ├── yojana/page.tsx     ← Gov. Schemes (/yojana)
│   ├── calendar/page.tsx   ← Crop Calendar (/calendar)
│   ├── calculator/page.tsx ← Cost Calculator (/calculator)
│   ├── plant-id/page.tsx   ← Plant Disease ID (/plant-id)
│   ├── tools/page.tsx      ← Farming Tools (/tools)
│   └── api/mandi/route.ts  ← Server API endpoint
├── components/             ← Reusable UI components
│   ├── Navbar.tsx          ← Top navigation bar
│   └── BackButton.tsx      ← Back navigation button
├── lib/                    ← Data and logic (no UI)
│   ├── config.ts           ← API keys (single source of truth)
│   ├── data.ts             ← 50 crops with full data
│   ├── diseases.ts         ← 30 plant diseases
│   ├── schemes.ts          ← 20+ government schemes
│   ├── fertilizer.ts       ← 100+ fertilizer records + ML algorithm
│   ├── mandi.ts            ← Mandi/commodity data
│   ├── tools.ts            ← 30 farming tools
│   └── lang.tsx            ← Bilingual (Hindi/English) system
└── types/
    └── speech.d.ts         ← TypeScript types for Web Speech API
```

---

## 4. FEATURE-WISE EXPLANATION

### Feature 1: AI Crop Recommendation (`/recommend`)

**What it does:** Suggests the top 5 crops based on state, district, season, rainfall, temperature, and soil type.

**Technologies:** React, TypeScript, custom scoring algorithm

**How it works internally:**
1. User selects state → district dropdown populates dynamically
2. User fills season, rainfall, temperature (slider), soil type
3. On submit, `scorecrops()` function runs:
   - Filters crops by season match
   - Scores each crop 0-100 based on: season match (+20), rainfall match (+20), temperature range match (+15), soil match (+10-15)
   - Sorts by score, returns top 5
4. Results display with match percentage, crop details, MSP price

**Example:**
```
Input: Kharif, High rainfall, 30°C, Clay-loam
→ Rice scores 95% (perfect match for all criteria)
→ Maize scores 75% (good temp, medium water mismatch)
```

---

### Feature 2: AI Chat (`/chat`)

**What it does:** A conversational AI assistant that answers any farming question in Hindi or English.

**Technologies:** React, Gemini Flash API, Web Speech API (voice input/output)

**How it works internally:**
1. User types or speaks a question (mic button triggers Web Speech API)
2. Message + last 6 messages of history sent to Gemini API
3. System prompt instructs Gemini to act as a farming expert
4. Response is cleaned (markdown symbols stripped) and displayed
5. Text-to-Speech reads the response aloud if voice is enabled
6. User can upload an image — it's converted to base64 and sent as `inline_data` to Gemini

**API Request structure:**
```json
{
  "system_instruction": { "parts": [{ "text": "You are Agri Advisor AI..." }] },
  "contents": [
    { "role": "user", "parts": [{ "text": "What fertilizer for wheat?" }] }
  ],
  "generationConfig": { "temperature": 0.7, "maxOutputTokens": 5000 }
}
```

---

### Feature 3: Plant Disease ID (`/plant-id`)

**What it does:** User uploads a photo of a diseased plant, AI identifies the disease and suggests treatment.

**Technologies:** React, Gemini Vision API (multimodal)

**How it works internally:**
1. User uploads image → converted to base64 string
2. User optionally adds a text note ("leaves are turning yellow")
3. Both image (as `inline_data`) and text sent to Gemini
4. Gemini returns structured JSON: `{ disease, confidence, symptoms, treatment, prevention }`
5. JSON is extracted from response using regex, displayed in color-coded cards

---

### Feature 4: Mandi Prices (`/mandi`)

**What it does:** Shows today's wholesale market prices for 30 commodities across 15 states.

**Technologies:** Next.js API Route, seeded random algorithm

**How it works internally:**
1. Frontend calls `/api/mandi?commodity=wheat&state=punjab`
2. Next.js API route (`app/api/mandi/route.ts`) runs on the server
3. Algorithm: `seed = date + commodity_char_code + mandi_char_code`
4. `seededRand(seed)` produces consistent variance (±8%) around base MSP price
5. Same seed = same price for the whole day, different next day
6. Returns JSON with min/modal/max prices for each mandi

**Why not use a real API?** The government's agmarknet.gov.in API returns 403 errors for direct browser calls. This approach gives realistic, consistent prices without CORS issues.

---

### Feature 5: Weather Forecast (`/weather`)

**What it does:** Shows 7-day weather forecast for any Indian city.

**Technologies:** Open-Meteo API, Geocoding API

**How it works internally:**
1. User types city name → Geocoding API converts to lat/lon
2. Lat/lon sent to Open-Meteo: `https://api.open-meteo.com/v1/forecast?latitude=...`
3. Response includes temperature, rainfall, wind, humidity for 7 days
4. Data displayed as weather cards with icons

**Why Open-Meteo?** It's completely free, no API key required, and has accurate data for Indian cities.

---

### Feature 6: Fertilizer Recommendation (`/fertilizer`)

**What it does:** Recommends the best fertilizer (Urea, DAP, NPK mix, etc.) based on soil NPK levels, pH, crop type, temperature, and humidity.

**Technologies:** React, K-Nearest Neighbor algorithm in TypeScript

**How it works internally:**
1. User inputs: N, P, K values, pH, soil type, temperature, humidity, crop type, crop stage
2. `recommendFertilizer()` runs KNN on 100+ records in `lib/fertilizer.ts`
3. Each record is normalized to 0-1 range, Euclidean distance calculated
4. Closest matching record's fertilizer is recommended
5. Confidence score = `(1 - distance / max_distance) * 100`
6. Advisory screen shows: fertilizer name, NPK breakdown, dosage, cost, application schedule, warnings

---

### Feature 7: Disease Guide (`/diseases`)

**What it does:** Encyclopedia of 30 plant diseases with symptoms, prevention, organic and chemical treatments.

**Technologies:** React, static data from `lib/diseases.ts`

**How it works:** Accordion-style UI. Each disease expands to show 4 color-coded sections: Symptoms (red), Prevention (blue), Organic Treatment (green), Chemical Treatment (orange). Search + crop filter.

---

### Feature 8: Government Schemes (`/yojana`)

**What it does:** Lists 20+ government schemes with status (Active/Expired/Upcoming), deadlines, benefits, and how to apply.

**Technologies:** React, static data from `lib/schemes.ts`

**How it works:** 3 tabs (Active/Expired/Upcoming). Auto-expiry based on `lastDateToApply` compared to current date. Urgency badges for schemes expiring within 30 days. Search + category filter.

---

### Feature 9: Crop Calendar (`/calendar`)

**What it does:** Gantt-chart style table showing sowing and harvesting months for all crops.

**Technologies:** React, `sowMonths` and `harvestMonths` arrays from `lib/data.ts`

**How it works:** 12-column table (Jan-Dec). Green = sowing month, Orange = harvest month, Yellow = both. Click month header to highlight that column.

---

### Feature 10: Cost Calculator (`/calculator`)

**What it does:** Calculates profit/loss for any crop based on area, costs, and expected yield.

**Technologies:** React, MSP data from `lib/data.ts`

**How it works:** User selects crop (auto-fills seed/fertilizer/labour costs from data), enters area in acres, adjusts costs, enters selling price. Calculates: Total Cost, Revenue, Profit/Loss, ROI%.

---

## 5. API & INTEGRATION DETAILS

### Gemini Flash API

- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`
- **Auth:** `X-goog-api-key` header
- **Used in:** Chat, Plant Disease ID
- **Key config:** Stored in `lib/config.ts`, imported wherever needed

**Request flow:**
```
User types question
→ React state updates
→ fetch() POST to Gemini URL
→ JSON response parsed
→ text extracted from candidates[0].content.parts[0].text
→ Markdown stripped with regex
→ Displayed in chat bubble
```

### Open-Meteo API

- **Endpoint:** `https://api.open-meteo.com/v1/forecast`
- **Auth:** None required
- **Parameters:** `latitude`, `longitude`, `daily=temperature_2m_max,precipitation_sum,...`

### Web Speech API (Browser Native)

- **SpeechRecognition:** Converts voice to text
- **SpeechSynthesis:** Converts text to voice
- **No API key needed** — built into Chrome/Edge browsers
- Language set to `hi-IN` for Hindi, `en-IN` for English

### Internal API: `/api/mandi`

- **Type:** Next.js Route Handler (server-side)
- **Method:** GET
- **Params:** `commodity`, `state`, `market`
- **Returns:** Array of price records with min/modal/max prices

---

## 6. DATABASE DESIGN

This project uses **no external database**. All data is stored as TypeScript arrays/objects in `lib/` files. This is called a **"data-as-code"** pattern.

### Why no database?

- Data is mostly static (crop info, disease info, schemes)
- Zero latency — no network round-trip
- No server cost
- Works offline
- TypeScript gives type safety on the data

### Data Structures:

**Crop (`lib/data.ts`)**
```typescript
interface Crop {
  id: string;           // "rice"
  nameHi: string;       // "धान"
  nameEn: string;       // "Rice"
  season: Season;       // "kharif" | "rabi" | "zaid" | "annual"
  category: CropCategory;
  temp: string;         // "20-36°C"
  water: string;        // "High (1500mm+)"
  npk: string;          // "N 120, P 60, K 60"
  sowMonths: number[];  // [5, 6] = June, July
  harvestMonths: number[];
  msp?: number;         // Minimum Support Price
  seedCost?: number;    // Rs per acre
  yieldQtl?: number;    // Expected yield in quintals
}
```

**Disease (`lib/diseases.ts`)**
```typescript
interface Disease {
  id: string;
  nameEn: string; nameHi: string;
  crop: string;
  symptomsEn: string; symptomsHi: string;
  preventionEn: string; preventionHi: string;
  organicEn: string; organicHi: string;
  chemicalEn: string; chemicalHi: string;
}
```

**Scheme (`lib/schemes.ts`)**
```typescript
interface Scheme {
  id: string;
  nameEn: string; nameHi: string;
  status: "active" | "expired" | "upcoming";
  lastDateToApply?: string;  // "2026-06-30"
  benefit: string;
  eligibility: string;
  howToApply: string;
}
```

---

## 7. CODE FLOW SIMPLIFIED

### Example: User asks a farming question in AI Chat

```
1. User types "गेहूँ में कौन सी खाद डालें?" and clicks Send

2. React: handleSubmit() called
   → userMsg added to messages state
   → loading = true
   → askGemini() called

3. askGemini() function:
   → Builds contents array (last 6 messages + new message)
   → Adds system_instruction (farming expert prompt)
   → fetch() POST to Gemini URL with X-goog-api-key header

4. Gemini API processes request
   → Returns JSON with AI response text

5. Response processing:
   → Extract text from candidates[0].content.parts[0].text
   → Strip markdown: replace /\*\*(.+?)\*\*/g with "$1"
   → Add bot message to messages state
   → loading = false

6. React re-renders:
   → New chat bubble appears with AI response
   → If TTS enabled, SpeechSynthesis.speak() reads it aloud
```

### Example: Mandi price fetch

```
1. User selects "Wheat" + "Punjab" and clicks Fetch

2. React: fetch("/api/mandi?commodity=wheat&state=punjab")

3. Next.js routes to app/api/mandi/route.ts (runs on server)
   → Reads BASE_PRICES["wheat"] = { modal: 2350, ... }
   → Gets today's date → dateSeed = 20260330
   → For each mandi in Punjab:
     seed = 20260330 + "w".charCodeAt(0)*1000 + "L".charCodeAt(0)*100
     modalPrice = 2350 * (1 + variance(seed))
   → Returns JSON array

4. React receives JSON
   → Updates state with price records
   → Renders price cards
```

---

## 8. INTERVIEW QUESTIONS & ANSWERS

**Q1: Why did you choose Next.js over a separate React + Express setup?**

A: Next.js gives us the best of both worlds in one framework. The App Router handles routing automatically — each folder in `app/` becomes a URL. API routes let me write server-side logic without a separate Express server. This means one codebase, one deployment, and no CORS issues between frontend and backend. For a project like this where the backend logic is relatively simple (price generation, data serving), it's the perfect fit.

---

**Q2: How does your fertilizer recommendation work? Is it real machine learning?**

A: It uses a K-Nearest Neighbor algorithm, which is technically a machine learning algorithm — just without a training phase. I have a dataset of 100+ records, each with soil conditions (N, P, K, temperature, humidity, soil type, crop type) and the correct fertilizer. When a user inputs their data, I normalize all values to 0-1 range and calculate the Euclidean distance to every record in the dataset. The record with the smallest distance is the "nearest neighbor" — its fertilizer is the recommendation. The confidence score is derived from how close the match is.

---

**Q3: Your mandi prices — are they real?**

A: They're realistic estimates, not live data. The government's agmarknet.gov.in API blocks direct browser requests with CORS errors. So I built a server-side algorithm that uses MSP (Minimum Support Price) as a base and applies a seeded pseudo-random variance of ±8%. The seed is derived from the date + commodity + mandi name, so prices are consistent throughout the day but change daily — just like real markets. I display a disclaimer that these are estimates.

---

**Q4: How does the bilingual system work?**

A: I built a custom `lang.tsx` context with a `LangProvider` that wraps the entire app. It stores the current language (`"hi"` or `"en"`) in React state. Every component uses the `useLang()` hook to get the current language, and the `t(hindi, english, lang)` helper function to return the right string. The language toggle in the Navbar calls `setLang()` which updates the context and all components re-render with the new language instantly.

---

**Q5: How do you handle the Gemini API key securely?**

A: Currently the key is stored in `lib/config.ts` and imported wherever needed — this is a single source of truth so it only needs to be changed in one place. For production, the proper approach is to move it to a `.env.local` file as `NEXT_PUBLIC_GEMINI_KEY` (or better, keep it server-side only and proxy all Gemini calls through a Next.js API route so the key is never exposed to the browser).

---

**Q6: What is the App Router in Next.js and how did you use it?**

A: The App Router (introduced in Next.js 13) uses the file system for routing. Every `page.tsx` file inside the `app/` directory becomes a route. For example, `app/weather/page.tsx` is automatically available at `/weather`. I also used `app/api/mandi/route.ts` which is a Route Handler — it exports `GET` and `POST` functions that run on the server, similar to Express route handlers.

---

**Q7: How does the plant disease detection work?**

A: It uses Gemini's multimodal capability. When a user uploads an image, I read it with `FileReader` and convert it to a base64 string. This base64 data is sent to Gemini as `inline_data` with the MIME type. Gemini can "see" the image and analyze it. I prompt it to return a structured JSON response with disease name, confidence, symptoms, treatment, and prevention. I then extract the JSON from the response using regex and display it in formatted cards.

---

**Q8: Why no database? Isn't that a limitation?**

A: For this project, it's actually an advantage. The crop, disease, and scheme data is static — it doesn't change frequently. Storing it in TypeScript files means zero latency (no database query), zero cost (no database server), type safety (TypeScript validates the data structure), and it works offline. The trade-off is that adding new data requires a code deployment. For a production system with user-generated content (like farmers adding their own crop records), I would add MongoDB or PostgreSQL.

---

**Q9: How does the voice feature work?**

A: I use two browser-native Web APIs. For voice input (speech-to-text), I use `SpeechRecognition` — I create a new instance, set the language to `hi-IN` or `en-IN`, and call `.start()`. When the user speaks, `onresult` fires with the transcript which I put into the input field. For voice output (text-to-speech), I use `SpeechSynthesis.speak()` with a `SpeechSynthesisUtterance` object. Both APIs are built into Chrome and Edge — no external service needed.

---

**Q10: How would you scale this for production with millions of users?**

A: Several steps:
1. Move the Gemini API calls to server-side Next.js API routes to protect the API key
2. Add Redis caching for mandi prices (cache for 1 hour instead of generating every request)
3. Add a real database (MongoDB Atlas) for user profiles, saved recommendations, and analytics
4. Deploy on Vercel (frontend + API routes) with CDN for static assets
5. Add rate limiting on API routes to prevent abuse
6. Use environment variables for all secrets

---

## 9. IMPROVEMENTS & SCALABILITY

### What can be improved?

| Area | Current | Improvement |
|---|---|---|
| Mandi Prices | Estimated/simulated | Integrate real agmarknet.gov.in data via server-side proxy |
| API Key | In source code | Move to `.env.local`, proxy through API routes |
| Fertilizer ML | KNN on 100 records | Train a proper Random Forest model with 10,000+ records |
| Language | Hindi + English | Add Punjabi, Marathi, Telugu, Tamil |
| Offline | Partial | Add PWA (Progressive Web App) with service workers |
| User Data | None | Add login + save history with MongoDB |
| Images | Wikipedia Commons | Use actual tool/crop photos from a CDN |

### Security Improvements

1. **API Key Protection:** Never expose keys in client-side code. Use Next.js API routes as a proxy.
2. **Rate Limiting:** Add `express-rate-limit` or Vercel's built-in rate limiting on API routes
3. **Input Validation:** Sanitize all user inputs before sending to Gemini
4. **HTTPS:** Vercel provides this automatically
5. **CSP Headers:** Add Content Security Policy headers in `next.config.ts`

### Scalability Plan

```
Current: Single Next.js app on Vercel (free tier)
         ↓
Phase 1: Add MongoDB Atlas for user data + Redis for caching
         ↓
Phase 2: Separate ML microservice (Python FastAPI) for better models
         ↓
Phase 3: CDN for images, Edge functions for global low latency
         ↓
Phase 4: Mobile app (React Native) sharing the same API layer
```

---

## 10. QUICK REVISION SUMMARY

**What:** AI-powered farming assistant for Indian farmers — crop advice, disease ID, mandi prices, weather, schemes, fertilizer recommendation.

**Stack:** Next.js 16 + React 19 + TypeScript + Tailwind CSS + Gemini AI + Open-Meteo API

**Architecture:** Monolithic full-stack Next.js app. No separate backend. API routes handle server logic. Static TypeScript files serve as the "database".

**Key Features (12 total):**
- Crop Recommendation → KNN scoring algorithm
- AI Chat → Gemini Flash with conversation history + voice I/O
- Plant Disease ID → Gemini Vision (multimodal image analysis)
- Mandi Prices → Next.js API route with seeded price algorithm
- Weather → Open-Meteo free API
- Fertilizer Advice → KNN on 100+ fertilizer records
- Disease Guide → 30 diseases, accordion UI
- Gov. Schemes → 20+ schemes with auto-expiry
- Crop Calendar → Gantt chart (sow/harvest months)
- Calculator → Cost-profit analysis
- Farming Tools → 30 tools with YouTube tutorials
- Bilingual → Hindi/English toggle via React Context

**No database** — data stored in TypeScript files for zero latency and offline support.

**Single API key** — stored in `lib/config.ts`, imported everywhere.

**Deployment:** Vercel (zero-config for Next.js, free tier covers everything).

---

*Prepared for interview use. Project: Agri Advisor (एग्री एडवाइजर) — 2026*
