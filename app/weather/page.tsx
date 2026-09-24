"use client";
import { useState } from "react";
import { useLang, t } from "@/lib/lang";
import BackButton from "@/components/BackButton";

// Using Open-Meteo geocoding (free, no key, no CORS issues)

interface DayForecast {
  date: string;
  dayHi: string;
  dayEn: string;
  emoji: string;
  hi: number;
  lo: number;
  rain: number;
  desc: string;
  descHi: string;
}

interface CurrentWeather {
  temp: number;
  humidity: number;
  windspeed: number;
  desc: string;
  descHi: string;
  emoji: string;
  rain: number;
}

const WMO_MAP: Record<number, { desc: string; descHi: string; emoji: string }> = {
  0:  { desc:"Clear sky",       descHi:"साफ़ आसमान",      emoji:"☀️" },
  1:  { desc:"Mainly clear",    descHi:"अधिकतर साफ़",     emoji:"🌤️" },
  2:  { desc:"Partly cloudy",   descHi:"आंशिक बादल",     emoji:"⛅" },
  3:  { desc:"Overcast",        descHi:"बादल छाए",        emoji:"☁️" },
  45: { desc:"Foggy",           descHi:"कोहरा",           emoji:"🌫️" },
  48: { desc:"Icy fog",         descHi:"बर्फीला कोहरा",   emoji:"🌫️" },
  51: { desc:"Light drizzle",   descHi:"हल्की बूंदाबांदी",emoji:"🌦️" },
  61: { desc:"Light rain",      descHi:"हल्की बारिश",     emoji:"🌦️" },
  63: { desc:"Moderate rain",   descHi:"मध्यम बारिश",     emoji:"🌧️" },
  65: { desc:"Heavy rain",      descHi:"भारी बारिश",      emoji:"🌧️" },
  71: { desc:"Light snow",      descHi:"हल्की बर्फ",      emoji:"🌨️" },
  80: { desc:"Rain showers",    descHi:"बारिश के झोंके",  emoji:"🌦️" },
  95: { desc:"Thunderstorm",    descHi:"आंधी-तूफ़ान",     emoji:"⛈️" },
  99: { desc:"Heavy thunderstorm",descHi:"भारी तूफ़ान",   emoji:"⛈️" },
};

function wmo(code: number) {
  return WMO_MAP[code] ?? { desc:"Unknown", descHi:"अज्ञात", emoji:"🌡️" };
}

const DAYS_HI = ["रवि","सोम","मंगल","बुध","गुरु","शुक्र","शनि"];
const DAYS_EN = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

async function geocode(place: string): Promise<{ lat: number; lon: number; name: string } | null> {
  // Open-Meteo geocoding — free, no API key, works from browser
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=5&language=en&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results || data.results.length === 0) return null;

  // Prefer results in India
  const india = data.results.find((r: { country_code?: string }) => r.country_code === "IN") ?? data.results[0];
  return {
    lat: india.latitude,
    lon: india.longitude,
    name: india.name + (india.admin1 ? `, ${india.admin1}` : ""),
  };
}

async function fetchWeather(lat: number, lon: number): Promise<{ current: CurrentWeather; forecast: DayForecast[] }> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKolkata&forecast_days=7`;
  const res = await fetch(url);
  const data = await res.json();

  const c = data.current;
  const cw = wmo(c.weather_code);
  const current: CurrentWeather = {
    temp: Math.round(c.temperature_2m),
    humidity: c.relative_humidity_2m,
    windspeed: Math.round(c.wind_speed_10m),
    desc: cw.desc,
    descHi: cw.descHi,
    emoji: cw.emoji,
    rain: Math.round(c.precipitation ?? 0),
  };

  const forecast: DayForecast[] = data.daily.time.map((dateStr: string, i: number) => {
    const d = new Date(dateStr);
    const dow = d.getDay();
    const fw = wmo(data.daily.weather_code[i]);
    return {
      date: dateStr,
      dayHi: i === 0 ? "आज" : i === 1 ? "कल" : DAYS_HI[dow],
      dayEn: i === 0 ? "Today" : i === 1 ? "Tomorrow" : DAYS_EN[dow],
      emoji: fw.emoji,
      hi: Math.round(data.daily.temperature_2m_max[i]),
      lo: Math.round(data.daily.temperature_2m_min[i]),
      rain: data.daily.precipitation_probability_max[i] ?? 0,
      desc: fw.desc,
      descHi: fw.descHi,
    };
  });

  return { current, forecast };
}

function farmingTips(forecast: DayForecast[], lang: "hi" | "en"): string[] {
  const tips: string[] = [];
  const rainyDays = forecast.filter(d => d.rain > 50).map(d => lang === "hi" ? d.dayHi : d.dayEn);
  const hotDays = forecast.filter(d => d.hi > 38);
  const coldDays = forecast.filter(d => d.lo < 10);

  if (rainyDays.length > 0) {
    tips.push(lang === "hi"
      ? `${rainyDays.join(", ")} को बारिश — उन दिनों छिड़काव न करें`
      : `Rain expected on ${rainyDays.join(", ")} — avoid spraying those days`);
  }
  if (hotDays.length > 0) {
    tips.push(lang === "hi"
      ? "तापमान 38°C+ — सिंचाई सुबह 6-9 बजे या शाम 5-7 बजे करें"
      : "Temp 38°C+ — irrigate between 6-9 AM or 5-7 PM");
  }
  if (coldDays.length > 0) {
    tips.push(lang === "hi"
      ? "रात का तापमान 10°C से कम — पाले से फसल बचाएं"
      : "Night temp below 10°C — protect crops from frost");
  }
  if (tips.length === 0) {
    tips.push(lang === "hi"
      ? "मौसम अनुकूल है — खेती के काम के लिए अच्छा समय"
      : "Weather is favorable — good time for farm activities");
  }
  return tips;
}

export default function WeatherPage() {
  const { lang } = useLang();
  const [village, setVillage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationName, setLocationName] = useState("");
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<DayForecast[]>([]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!village.trim()) return;
    setLoading(true);
    setError("");
    setCurrent(null);
    setForecast([]);
    try {
      const geo = await geocode(village.trim());
      if (!geo) {
        setError(lang === "hi" ? "स्थान नहीं मिला। कृपया दूसरा नाम आज़माएं।" : "Location not found. Please try another name.");
        setLoading(false);
        return;
      }
      setLocationName(geo.name);
      const { current: cur, forecast: fc } = await fetchWeather(geo.lat, geo.lon);
      setCurrent(cur);
      setForecast(fc);
    } catch {
      setError(lang === "hi" ? "मौसम डेटा लोड नहीं हो सका।" : "Could not load weather data.");
    }
    setLoading(false);
  }

  const tips = forecast.length > 0 ? farmingTips(forecast, lang) : [];

  return (
    <div className="space-y-6">
      <BackButton />
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          🌤️ {t("मौसम पूर्वानुमान", "Weather Forecast", lang)}
        </h1>
        <p className="text-gray-500">{t("7 दिन का लाइव मौसम — खेती के लिए सही समय जानें", "7-day live forecast — plan your farming", lang)}</p>
        <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
          {t("Open-Meteo Geocoding + Open-Meteo लाइव डेटा", "Open-Meteo Geocoding + Open-Meteo live data", lang)}
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
        <input
          className="input-field"
          placeholder={t("गाँव या शहर का नाम...", "Village or city name...", lang)}
          value={village}
          onChange={e => setVillage(e.target.value)}
          required
        />
        <button type="submit" disabled={loading} className="btn-primary px-5 disabled:opacity-60">
          {loading ? "..." : t("खोजें", "Search", lang)}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
      )}

      {current && (
        <div className="space-y-4">
          {/* Current weather card */}
          <div className="card bg-gradient-to-br from-blue-50 to-sky-50">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl">{current.emoji}</span>
              <div>
                <div className="text-2xl font-bold text-gray-800">{current.temp}°C</div>
                <div className="text-gray-600 font-medium">{locationName}</div>
                <div className="text-gray-500 text-sm">{lang === "hi" ? current.descHi : current.desc}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="bg-white rounded-lg p-2">
                <div className="text-blue-500 font-bold">{current.rain} mm</div>
                <div className="text-gray-500">{t("बारिश", "Rain", lang)}</div>
              </div>
              <div className="bg-white rounded-lg p-2">
                <div className="text-teal-500 font-bold">{current.humidity}%</div>
                <div className="text-gray-500">{t("नमी", "Humidity", lang)}</div>
              </div>
              <div className="bg-white rounded-lg p-2">
                <div className="text-orange-500 font-bold">{current.windspeed} km/h</div>
                <div className="text-gray-500">{t("हवा", "Wind", lang)}</div>
              </div>
            </div>
          </div>

          {/* 7-day forecast */}
          <h2 className="text-lg font-bold text-gray-800">{t("7 दिन का पूर्वानुमान", "7-Day Forecast", lang)}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {forecast.map(w => (
              <div key={w.date} className="card text-center">
                <div className="font-medium text-gray-700 text-sm">{lang === "hi" ? w.dayHi : w.dayEn}</div>
                <div className="text-3xl my-2">{w.emoji}</div>
                <div className="text-sm font-bold text-gray-800">{w.hi}°</div>
                <div className="text-xs text-gray-400">{w.lo}°</div>
                <div className="text-xs text-blue-500 mt-1">{w.rain}%</div>
                <div className="text-xs text-gray-400 mt-1 leading-tight">{lang === "hi" ? w.descHi : w.desc}</div>
              </div>
            ))}
          </div>

          {/* Farming tips */}
          <div className="card bg-amber-50 border-amber-200">
            <h3 className="font-bold text-amber-800 mb-2">🌾 {t("किसान सलाह", "Farming Tips", lang)}</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              {tips.map((tip, i) => <li key={i}>• {tip}</li>)}
            </ul>
          </div>
        </div>
      )}

      {!current && !loading && !error && (
        <div className="card text-center py-12 text-gray-400">
          <div className="text-5xl mb-3">🌍</div>
          <p>{t("अपने गाँव का नाम डालें और लाइव मौसम देखें", "Enter your village name to see live weather", lang)}</p>
        </div>
      )}
    </div>
  );
}
