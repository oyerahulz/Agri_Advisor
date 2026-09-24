"use client";
import { useState } from "react";
import { CROPS, Crop } from "@/lib/data";
import { useLang, t } from "@/lib/lang";
import BackButton from "@/components/BackButton";
import { formatCropDuration, formatCropTip, formatCropWater } from "@/lib/i18n-data";

const STATE_DISTRICTS: Record<string, string[]> = {
  "Uttar Pradesh": ["Lucknow","Agra","Varanasi","Kanpur","Allahabad","Meerut","Bareilly","Aligarh","Moradabad","Gorakhpur"],
  "Madhya Pradesh": ["Bhopal","Indore","Gwalior","Jabalpur","Ujjain","Sagar","Rewa","Satna","Ratlam","Dewas"],
  "Rajasthan": ["Jaipur","Jodhpur","Udaipur","Kota","Bikaner","Ajmer","Alwar","Bharatpur","Sikar","Pali"],
  "Maharashtra": ["Mumbai","Pune","Nagpur","Nashik","Aurangabad","Solapur","Kolhapur","Amravati","Latur","Jalgaon"],
  "Punjab": ["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Mohali","Hoshiarpur","Gurdaspur","Firozpur","Moga"],
  "Haryana": ["Gurugram","Faridabad","Hisar","Rohtak","Panipat","Karnal","Sonipat","Ambala","Yamunanagar","Bhiwani"],
  "Gujarat": ["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Junagadh","Gandhinagar","Anand","Mehsana"],
  "Bihar": ["Patna","Gaya","Muzaffarpur","Bhagalpur","Darbhanga","Purnia","Arrah","Begusarai","Katihar","Munger"],
  "West Bengal": ["Kolkata","Howrah","Durgapur","Asansol","Siliguri","Bardhaman","Malda","Murshidabad","Nadia","Hooghly"],
  "Karnataka": ["Bengaluru","Mysuru","Hubli","Mangaluru","Belagavi","Kalaburagi","Davangere","Ballari","Vijayapura","Shivamogga"],
  "Tamil Nadu": ["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli","Erode","Vellore","Thoothukudi","Dindigul"],
  "Andhra Pradesh": ["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Tirupati","Kakinada","Rajahmundry","Kadapa","Anantapur"],
  "Telangana": ["Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam","Mahbubnagar","Nalgonda","Adilabad","Suryapet","Siddipet"],
  "Odisha": ["Bhubaneswar","Cuttack","Rourkela","Berhampur","Sambalpur","Puri","Balasore","Baripada","Bhadrak","Jharsuguda"],
  "Kerala": ["Thiruvananthapuram","Kochi","Kozhikode","Thrissur","Kollam","Palakkad","Alappuzha","Malappuram","Kannur","Kasaragod"],
  "Assam": ["Guwahati","Silchar","Dibrugarh","Jorhat","Nagaon","Tinsukia","Tezpur","Bongaigaon","Dhubri","Karimganj"],
  "Jharkhand": ["Ranchi","Jamshedpur","Dhanbad","Bokaro","Deoghar","Hazaribagh","Giridih","Ramgarh","Dumka","Chaibasa"],
  "Chhattisgarh": ["Raipur","Bhilai","Bilaspur","Korba","Durg","Rajnandgaon","Jagdalpur","Ambikapur","Raigarh","Dhamtari"],
  "Uttarakhand": ["Dehradun","Haridwar","Roorkee","Haldwani","Rudrapur","Kashipur","Rishikesh","Kotdwar","Pithoragarh","Almora"],
  "Himachal Pradesh": ["Shimla","Dharamshala","Solan","Mandi","Kullu","Hamirpur","Una","Bilaspur","Chamba","Kangra"],
};

const STATES_EN = Object.keys(STATE_DISTRICTS);
const STATES_HI = ["उत्तर प्रदेश","मध्य प्रदेश","राजस्थान","महाराष्ट्र","पंजाब","हरियाणा","गुजरात","बिहार","पश्चिम बंगाल","कर्नाटक","तमिलनाडु","आंध्र प्रदेश","तेलंगाना","ओडिशा","केरल","असम","झारखंड","छत्तीसगढ़","उत्तराखंड","हिमाचल प्रदेश"];

const SOILS_HI = ["दोमट (Loam)","बलुई दोमट (Sandy Loam)","काली मिट्टी (Black)","लाल मिट्टी (Red)","जलोढ़ (Alluvial)","लेटराइट"];
const SOILS_EN = ["Loam","Sandy Loam","Black Soil","Red Soil","Alluvial","Laterite"];

const SEASONS = [
  { v:"kharif", hi:"खरीफ (जून-नवंबर)",          en:"Kharif (Jun-Nov)"        },
  { v:"rabi",   hi:"रबी (अक्टूबर-मार्च)",        en:"Rabi (Oct-Mar)"          },
  { v:"zaid",   hi:"ज़ायद / गर्मी (मार्च-जून)",  en:"Zaid / Summer (Mar-Jun)" },
  { v:"annual", hi:"वार्षिक (पूरे साल)",          en:"Annual (Year-round)"     },
];

function scorecrops(season: string, rainfall: string, temp: number, soil: string): (Crop & { score: number })[] {
  const rainMap: Record<string, number> = { low: 300, medium: 700, high: 1500 };
  const rainVal = rainMap[rainfall] ?? 700;
  return CROPS
    .filter(c => {
      if (season === "annual") return true;
      if (c.season === "annual") return true;
      if (season === "zaid") return c.season === "zaid" || c.season === "kharif";
      return c.season === season;
    })
    .map(c => {
      let score = 50;
      if (c.season === season) score += 20;
      const cWater = c.water.toLowerCase();
      if (rainVal < 400 && cWater.includes("low")) score += 20;
      else if (rainVal >= 400 && rainVal < 900 && cWater.includes("med")) score += 20;
      else if (rainVal >= 900 && cWater.includes("high")) score += 20;
      const tRange = c.temp.match(/(\d+)-(\d+)/);
      if (tRange) {
        const lo = +tRange[1], hi = +tRange[2];
        if (temp >= lo && temp <= hi) score += 15;
        else if (temp >= lo - 3 && temp <= hi + 3) score += 7;
      }
      const cSoil = c.soil.toLowerCase();
      const sSoil = soil.toLowerCase();
      if (sSoil.includes("loam") && cSoil.includes("loam")) score += 10;
      if (sSoil.includes("black") && cSoil.includes("black")) score += 15;
      if (sSoil.includes("red") && cSoil.includes("red")) score += 15;
      if (sSoil.includes("alluvial") && cSoil.includes("alluvial")) score += 10;
      return { ...c, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export default function RecommendPage() {
  const { lang } = useLang();
  const [stateIdx, setStateIdx] = useState(-1);
  const [district, setDistrict] = useState("");
  const [season, setSeason] = useState("kharif");
  const [rainfall, setRainfall] = useState("medium");
  const [temp, setTemp] = useState(28);
  const [soil, setSoil] = useState("");
  const [results, setResults] = useState<(Crop & { score: number })[]>([]);
  const [done, setDone] = useState(false);

  const stateKey = stateIdx >= 0 ? STATES_EN[stateIdx] : "";
  const districts = stateKey ? STATE_DISTRICTS[stateKey] : [];

  function handleStateChange(idx: number) {
    setStateIdx(idx);
    setDistrict("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResults(scorecrops(season, rainfall, temp, soil));
    setDone(true);
  }

  const soils = lang === "hi" ? SOILS_HI : SOILS_EN;

  return (
    <div className="space-y-8">
      <BackButton />
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          🌱 {t("AI फसल सलाह", "AI Crop Advice", lang)}
        </h1>
        <p className="text-gray-500">
          {t("अपनी जानकारी भरें — AI सबसे उपयुक्त फसलें सुझाएगा", "Fill in your details — AI will suggest the best crops", lang)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("राज्य", "State", lang)}</label>
            <select className="input-field" value={stateIdx} onChange={e => handleStateChange(+e.target.value)} required>
              <option value={-1}>{t("-- राज्य चुनें --", "-- Select State --", lang)}</option>
              {STATES_EN.map((s, i) => <option key={i} value={i}>{lang === "hi" ? STATES_HI[i] : s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("जिला", "District", lang)}</label>
            <select className="input-field" value={district} onChange={e => setDistrict(e.target.value)} disabled={!stateKey}>
              <option value="">{stateKey ? t("-- जिला चुनें --", "-- Select District --", lang) : t("पहले राज्य चुनें", "Select state first", lang)}</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("मौसम / ऋतु", "Season", lang)}</label>
            <select className="input-field" value={season} onChange={e => setSeason(e.target.value)}>
              {SEASONS.map(s => <option key={s.v} value={s.v}>{lang === "hi" ? s.hi : s.en}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("वर्षा", "Rainfall", lang)}</label>
            <select className="input-field" value={rainfall} onChange={e => setRainfall(e.target.value)}>
              <option value="low">{t("कम (300mm से कम)", "Low (< 300mm)", lang)}</option>
              <option value="medium">{t("मध्यम (300-900mm)", "Medium (300-900mm)", lang)}</option>
              <option value="high">{t("अधिक (900mm+)", "High (900mm+)", lang)}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t(`औसत तापमान: ${temp}°C`, `Avg Temperature: ${temp}°C`, lang)}
            </label>
            <input type="range" min={5} max={45} value={temp}
              onChange={e => setTemp(+e.target.value)}
              className="w-full accent-green-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5"><span>5°C</span><span>45°C</span></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("मिट्टी का प्रकार", "Soil Type", lang)}</label>
            <select className="input-field" value={soil} onChange={e => setSoil(e.target.value)} required>
              <option value="">{t("-- मिट्टी चुनें --", "-- Select Soil --", lang)}</option>
              {soils.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Season info badge */}
        <div className="text-xs rounded-lg px-3 py-2 font-medium"
          style={{background:"rgba(45,158,95,0.08)", color:"#1a6b3a", border:"1px solid rgba(45,158,95,0.2)"}}>
          {season === "kharif" && t("🌧️ खरीफ — मानसून की फसलें: धान, मक्का, कपास, सोयाबीन, बाजरा", "🌧️ Kharif — Monsoon crops: Rice, Maize, Cotton, Soybean, Bajra", lang)}
          {season === "rabi"   && t("❄️ रबी — सर्दी की फसलें: गेहूँ, चना, सरसों, मटर, जौ", "❄️ Rabi — Winter crops: Wheat, Chickpea, Mustard, Peas, Barley", lang)}
          {season === "zaid"   && t("☀️ ज़ायद — गर्मी की फसलें: तरबूज, खीरा, मूँग, भिंडी, सूरजमुखी", "☀️ Zaid — Summer crops: Watermelon, Cucumber, Moong, Okra, Sunflower", lang)}
          {season === "annual" && t("🔄 वार्षिक — पूरे साल उगने वाली फसलें: गन्ना, केला, सब्जियाँ", "🔄 Annual — Year-round crops: Sugarcane, Banana, Vegetables", lang)}
        </div>

        <button type="submit" className="btn-primary w-full py-3 text-base">
          🤖 {t("फसल सुझाव लें", "Get Crop Advice", lang)}
        </button>
      </form>

      {done && (
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-xl font-bold text-gray-800">
            🏆 {t("आपके लिए सुझाई गई फसलें", "Recommended Crops For You", lang)}
            {district && <span className="text-base font-normal text-gray-500 ml-2">— {district}</span>}
          </h2>
          {results.map((c, i) => (
            <div key={c.id} className="card flex gap-4 items-start">
              <div className="text-4xl">{c.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-800 text-lg">{lang === "hi" ? c.nameHi : c.nameEn}</span>
                  {i === 0 && <span className="badge bg-green-100 text-green-700">{t("सर्वश्रेष्ठ", "Best Match", lang)}</span>}
                  <span className="badge bg-blue-50 text-blue-700">{t("मिलान", "Match", lang)}: {c.score}%</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-sm text-gray-600">
                  <span>🌡️ {c.temp}</span>
                  <span>💧 {formatCropWater(c.water, lang)}</span>
                  <span>⏱️ {formatCropDuration(c.duration, lang)}</span>
                  {c.msp ? <span>💰 MSP ₹{c.msp}</span> : null}
                </div>
                <p className="text-sm text-green-700 mt-2 bg-green-50 rounded p-2">💡 {formatCropTip(c.tip, lang)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
