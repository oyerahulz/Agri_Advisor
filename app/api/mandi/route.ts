"use server";
import { NextRequest, NextResponse } from "next/server";

// Commodity base prices (MSP / typical market rates in Rs/qtl)
const BASE_PRICES: Record<string, { min: number; modal: number; max: number; emoji: string; category: string }> = {
  wheat:      { min: 2200, modal: 2350, max: 2500, emoji: "🌿", category: "Cereal" },
  rice:       { min: 2100, modal: 2350, max: 2600, emoji: "🌾", category: "Cereal" },
  paddy:      { min: 2100, modal: 2320, max: 2550, emoji: "🌾", category: "Cereal" },
  maize:      { min: 1900, modal: 2100, max: 2300, emoji: "🌽", category: "Cereal" },
  bajra:      { min: 2200, modal: 2500, max: 2700, emoji: "🌾", category: "Cereal" },
  jowar:      { min: 2900, modal: 3180, max: 3400, emoji: "🌾", category: "Cereal" },
  barley:     { min: 1600, modal: 1750, max: 1900, emoji: "🌾", category: "Cereal" },
  soybean:    { min: 4400, modal: 4900, max: 5300, emoji: "🫘", category: "Oilseed" },
  mustard:    { min: 5200, modal: 5650, max: 6100, emoji: "🌼", category: "Oilseed" },
  groundnut:  { min: 5800, modal: 6400, max: 7000, emoji: "🥜", category: "Oilseed" },
  sunflower:  { min: 6200, modal: 6760, max: 7200, emoji: "🌻", category: "Oilseed" },
  cotton:     { min: 6500, modal: 7150, max: 7800, emoji: "🤍", category: "Cash" },
  sugarcane:  { min: 310,  modal: 340,  max: 370,  emoji: "🍬", category: "Cash" },
  chickpea:   { min: 5000, modal: 5440, max: 5900, emoji: "🟤", category: "Pulse" },
  lentil:     { min: 5800, modal: 6425, max: 7000, emoji: "🫘", category: "Pulse" },
  arhar:      { min: 6000, modal: 7000, max: 7800, emoji: "🫘", category: "Pulse" },
  moong:      { min: 7000, modal: 8558, max: 9500, emoji: "🟢", category: "Pulse" },
  onion:      { min: 1000, modal: 1800, max: 2800, emoji: "🧅", category: "Vegetable" },
  potato:     { min: 600,  modal: 1100, max: 1600, emoji: "🥔", category: "Vegetable" },
  tomato:     { min: 500,  modal: 1400, max: 2500, emoji: "🍅", category: "Vegetable" },
  brinjal:    { min: 400,  modal: 900,  max: 1500, emoji: "🍆", category: "Vegetable" },
  okra:       { min: 600,  modal: 1200, max: 2000, emoji: "🟢", category: "Vegetable" },
  turmeric:   { min: 7000, modal: 9500, max: 12000, emoji: "🟡", category: "Spice" },
  chilli:     { min: 9000, modal: 12500, max: 16000, emoji: "🌶️", category: "Spice" },
  garlic:     { min: 2500, modal: 4200, max: 6000, emoji: "🧄", category: "Spice" },
  cumin:      { min: 20000, modal: 25000, max: 30000, emoji: "🟤", category: "Spice" },
  coriander:  { min: 5000, modal: 7000, max: 9000, emoji: "🌿", category: "Spice" },
  mango:      { min: 1500, modal: 3000, max: 5000, emoji: "🥭", category: "Fruit" },
  banana:     { min: 400,  modal: 800,  max: 1200, emoji: "🍌", category: "Fruit" },
  pomegranate:{ min: 4000, modal: 7000, max: 10000, emoji: "🔴", category: "Fruit" },
};

// Major mandis per state
const STATE_MANDIS: Record<string, string[]> = {
  "uttar pradesh":   ["Agra","Hapur","Lucknow","Kanpur","Varanasi","Muzaffarnagar","Bareilly","Allahabad"],
  "madhya pradesh":  ["Indore","Bhopal","Mandsaur","Ujjain","Gwalior","Jabalpur","Ratlam","Sagar"],
  "rajasthan":       ["Jaipur","Jodhpur","Bikaner","Alwar","Kota","Ajmer","Unjha","Bharatpur"],
  "maharashtra":     ["Nashik","Pune","Nagpur","Latur","Kolhapur","Jalgaon","Sangli","Aurangabad"],
  "punjab":          ["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Moga","Gurdaspur","Firozpur"],
  "haryana":         ["Karnal","Hisar","Rohtak","Panipat","Ambala","Sirsa","Fatehabad","Yamunanagar"],
  "gujarat":         ["Rajkot","Junagadh","Ahmedabad","Surat","Unjha","Gondal","Anand","Mehsana"],
  "karnataka":       ["Bengaluru","Gulbarga","Davangere","Hubli","Mysuru","Bellary","Bijapur","Raichur"],
  "andhra pradesh":  ["Guntur","Kurnool","Nellore","Vijayawada","Kakinada","Tirupati","Ongole","Kadapa"],
  "telangana":       ["Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam","Nalgonda","Adilabad","Suryapet"],
  "tamil nadu":      ["Chennai","Koyambedu","Erode","Madurai","Coimbatore","Salem","Tirunelveli","Dindigul"],
  "west bengal":     ["Kolkata","Howrah","Siliguri","Bardhaman","Malda","Murshidabad","Hooghly","Nadia"],
  "bihar":           ["Patna","Gaya","Muzaffarpur","Bhagalpur","Darbhanga","Purnia","Begusarai","Katihar"],
  "odisha":          ["Bhubaneswar","Cuttack","Sambalpur","Berhampur","Rourkela","Puri","Balasore","Baripada"],
  "delhi":           ["Azadpur","Okhla","Shahdara","Narela","Ghazipur"],
};

// Seeded pseudo-random for consistent daily prices
function seededRand(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function dailyVariance(base: number, seed: number, pct = 0.08): number {
  const v = (seededRand(seed) - 0.5) * 2 * pct;
  return Math.round(base * (1 + v) / 10) * 10;
}

function todayStr(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const commodity = (searchParams.get("commodity") || "").toLowerCase().trim();
  const state     = (searchParams.get("state") || "").toLowerCase().trim();
  const market    = (searchParams.get("market") || "").toLowerCase().trim();

  const today = new Date();
  const dateSeed = today.getFullYear() * 10000 + (today.getMonth()+1) * 100 + today.getDate();

  const records: object[] = [];

  // Determine which commodities to show
  const commoditiesToShow = commodity
    ? [commodity]
    : Object.keys(BASE_PRICES).slice(0, 15);

  // Determine which states/mandis to show
  const statesToShow = state
    ? [state]
    : market
    ? Object.keys(STATE_MANDIS).slice(0, 5)
    : Object.keys(STATE_MANDIS).slice(0, 6);

  for (const comm of commoditiesToShow) {
    const base = BASE_PRICES[comm];
    if (!base) continue;

    for (const st of statesToShow) {
      const mandis = STATE_MANDIS[st] || [];
      const filteredMandis = market
        ? mandis.filter(m => m.toLowerCase().includes(market))
        : mandis.slice(0, 3);

      for (const mandi of filteredMandis) {
        const seed = dateSeed + comm.charCodeAt(0) * 1000 + mandi.charCodeAt(0) * 100;
        const modalPrice = dailyVariance(base.modal, seed);
        const minPrice   = Math.round(modalPrice * (0.88 + seededRand(seed+1) * 0.06));
        const maxPrice   = Math.round(modalPrice * (1.04 + seededRand(seed+2) * 0.08));

        records.push({
          state:        st.split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join(" "),
          district:     mandi,
          market:       mandi,
          commodity:    comm.charAt(0).toUpperCase() + comm.slice(1),
          variety:      "Mixed",
          arrival_date: todayStr(),
          min_price:    String(minPrice),
          max_price:    String(maxPrice),
          modal_price:  String(modalPrice),
          emoji:        base.emoji,
          category:     base.category,
        });
      }
    }
  }

  if (records.length === 0) {
    return NextResponse.json({ records: [], count: 0, message: "No matching data" });
  }

  return NextResponse.json({
    records,
    count: records.length,
    source: "estimated-daily",
    date: todayStr(),
    note: "Prices estimated from MSP + market variance. For official prices visit agmarknet.gov.in",
  });
}
