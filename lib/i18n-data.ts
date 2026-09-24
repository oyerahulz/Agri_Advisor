import type { Lang } from "./lang";
import { UI_TRANSLATIONS } from "./translations";

type Label = { hi: string; en: string };

const pick = (label: Label, lang: Lang) => {
  if (lang === "hi") return label.hi;
  if (lang === "en") return label.en;
  return UI_TRANSLATIONS[lang]?.[label.en] ?? label.en;
};

export const CROP_CATEGORY_LABELS: Record<string, Label> = {
  cereal: { hi: "अनाज", en: "Cereal" },
  pulse: { hi: "दलहन", en: "Pulse" },
  oilseed: { hi: "तिलहन", en: "Oilseed" },
  cash: { hi: "नकदी", en: "Cash" },
  plantation: { hi: "बागान", en: "Plantation" },
  spice: { hi: "मसाले", en: "Spice" },
  fruit: { hi: "फल", en: "Fruit" },
  vegetable: { hi: "सब्जी", en: "Vegetable" },
};

export const SEASON_LABELS: Record<string, Label> = {
  kharif: { hi: "खरीफ", en: "Kharif" },
  rabi: { hi: "रबी", en: "Rabi" },
  zaid: { hi: "जायद", en: "Zaid" },
  annual: { hi: "वार्षिक", en: "Annual" },
};

export const TOOL_CATEGORY_LABELS: Record<string, Label> = {
  "Heavy Machinery": { hi: "भारी मशीनरी", en: "Heavy Machinery" },
  Tillage: { hi: "जुताई", en: "Tillage" },
  Sowing: { hi: "बुवाई", en: "Sowing" },
  Spraying: { hi: "छिड़काव", en: "Spraying" },
  Irrigation: { hi: "सिंचाई", en: "Irrigation" },
  Harvesting: { hi: "कटाई", en: "Harvesting" },
  "Post-Harvest": { hi: "कटाई के बाद", en: "Post-Harvest" },
  "Soil Management": { hi: "मिट्टी प्रबंधन", en: "Soil Management" },
  Fertilizing: { hi: "खाद देना", en: "Fertilizing" },
  "Weed Control": { hi: "खरपतवार नियंत्रण", en: "Weed Control" },
};

export const SOIL_TYPE_LABELS: Record<string, Label> = {
  Sandy: { hi: "बलुई", en: "Sandy" },
  Loamy: { hi: "दोमट", en: "Loamy" },
  Black: { hi: "काली मिट्टी", en: "Black" },
  Red: { hi: "लाल मिट्टी", en: "Red" },
  Clayey: { hi: "चिकनी मिट्टी", en: "Clayey" },
  Alluvial: { hi: "जलोढ़", en: "Alluvial" },
};

export const FERTILIZER_CROP_LABELS: Record<string, Label> = {
  Maize: { hi: "मक्का", en: "Maize" },
  Sugarcane: { hi: "गन्ना", en: "Sugarcane" },
  Cotton: { hi: "कपास", en: "Cotton" },
  Tobacco: { hi: "तम्बाकू", en: "Tobacco" },
  Paddy: { hi: "धान", en: "Paddy" },
  Barley: { hi: "जौ", en: "Barley" },
  Wheat: { hi: "गेहूँ", en: "Wheat" },
  Millets: { hi: "मोटे अनाज", en: "Millets" },
  "Oil seeds": { hi: "तिलहन", en: "Oil seeds" },
  Pulses: { hi: "दलहन", en: "Pulses" },
  "Ground Nuts": { hi: "मूँगफली", en: "Ground Nuts" },
};

export const CROP_STAGE_LABELS: Record<string, Label> = {
  Sowing: { hi: "बुवाई", en: "Sowing" },
  Germination: { hi: "अंकुरण", en: "Germination" },
  Vegetative: { hi: "वानस्पतिक वृद्धि", en: "Vegetative" },
  Flowering: { hi: "फूल आना", en: "Flowering" },
  Fruiting: { hi: "फल बनना", en: "Fruiting" },
  Harvesting: { hi: "कटाई", en: "Harvesting" },
};

export const IRRIGATION_LABELS: Record<string, Label> = {
  "Tube Well": { hi: "ट्यूबवेल", en: "Tube Well" },
  Canal: { hi: "नहर", en: "Canal" },
  Drip: { hi: "ड्रिप", en: "Drip" },
  Sprinkler: { hi: "स्प्रिंकलर", en: "Sprinkler" },
  Rainfed: { hi: "वर्षा आधारित", en: "Rainfed" },
  Flood: { hi: "भराव सिंचाई", en: "Flood" },
};

const FERTILIZER_LABELS: Record<string, Label> = {
  Urea: { hi: "यूरिया", en: "Urea" },
  DAP: { hi: "डीएपी", en: "DAP" },
  "14-35-14": { hi: "फास्फोरस प्रधान NPK 14:35:14", en: "Phosphorus-rich NPK 14:35:14" },
  "28-28": { hi: "नाइट्रोजन-फास्फोरस NPK 28:28:0", en: "Nitrogen-Phosphorus NPK 28:28:0" },
  "17-17-17": { hi: "संतुलित NPK 17:17:17", en: "Balanced NPK 17:17:17" },
  "20-20": { hi: "संतुलित NP 20:20:0", en: "Balanced NP 20:20:0" },
  "10-26-26": { hi: "फास्फोरस-पोटेशियम NPK 10:26:26", en: "Phosphorus-Potassium NPK 10:26:26" },
  "NPK Mix": { hi: "NPK मिश्रण", en: "NPK Mix" },
};

const SCHEDULE_ACTIONS_HI: Record<string, string> = {
  "Apply as basal dose uniformly during final ploughing.": "अंतिम जुताई के समय बेसल डोज समान रूप से डालें।",
  "First top dressing after germination.": "अंकुरण के बाद पहली टॉप ड्रेसिंग करें।",
  "Light top dressing near root zone.": "जड़ क्षेत्र के पास हल्की टॉप ड्रेसिंग करें।",
  "Second application after thinning.": "छंटाई के बाद दूसरी बार खाद डालें।",
  "Apply split dose for active growth support.": "अच्छी वृद्धि के लिए खाद को विभाजित खुराक में दें।",
  "First top dressing.": "पहली टॉप ड्रेसिंग करें।",
  "Second top dressing before flowering.": "फूल आने से पहले दूसरी टॉप ड्रेसिंग करें।",
  "Foliar spray for micronutrient support.": "सूक्ष्म पोषक तत्वों के लिए पत्तियों पर स्प्रे करें।",
  "Top dressing to support fruit development.": "फल विकास के लिए टॉप ड्रेसिंग करें।",
  "Post-harvest soil enrichment application.": "कटाई के बाद मिट्टी सुधार के लिए खाद डालें।",
};

const WARNING_HI: Record<string, string> = {
  "High rainfall expected. Delay fertilizer application to prevent runoff.": "अधिक बारिश की संभावना है। खाद बहने से बचाने के लिए डालने में देरी करें।",
  "Soil pH is too acidic. Apply lime before fertilizing.": "मिट्टी का pH बहुत अम्लीय है। खाद डालने से पहले चूना डालें।",
  "Soil pH is too alkaline. Consider sulfur treatment first.": "मिट्टी का pH बहुत क्षारीय है। पहले सल्फर उपचार पर विचार करें।",
  "Nitrogen levels already high. Reduce urea application to avoid toxicity.": "नाइट्रोजन पहले से अधिक है। नुकसान से बचने के लिए यूरिया कम डालें।",
  "Phosphorus is sufficient. Skip DAP to avoid soil lock-up.": "फास्फोरस पर्याप्त है। मिट्टी में पोषक अवरोध से बचने के लिए DAP न डालें।",
  "Potassium levels are adequate. No MOP needed this season.": "पोटेशियम पर्याप्त है। इस मौसम में MOP की जरूरत नहीं है।",
};

const AGRI_TIP_HI: Record<string, string> = {
  "Applying fertilizer in split doses reduces nutrient runoff, matching the crop's dynamic needs through its growth stages, which saves money and protects the environment.": "खाद को विभाजित खुराक में देने से पोषक तत्व बहते नहीं हैं और फसल की अवस्था के अनुसार पोषण मिलता है। इससे खर्च कम होता है और पर्यावरण सुरक्षित रहता है।",
  "Always test soil before applying fertilizer. Over-application of nitrogen can cause leaf burn and groundwater contamination.": "खाद डालने से पहले मिट्टी की जांच जरूर करें। नाइट्रोजन की अधिक मात्रा पत्तियों को जला सकती है और भूजल को दूषित कर सकती है।",
  "Drip fertigation delivers nutrients directly to roots, improving efficiency by up to 40% compared to broadcast application.": "ड्रिप फर्टिगेशन पोषक तत्व सीधे जड़ों तक पहुंचाता है और छिड़काव विधि की तुलना में दक्षता लगभग 40 प्रतिशत तक बढ़ा सकता है।",
  "Organic matter improves fertilizer uptake. Mix compost with chemical fertilizers for best results.": "जैविक पदार्थ खाद के अवशोषण को बेहतर बनाता है। बेहतर परिणाम के लिए कम्पोस्ट को रासायनिक खाद के साथ मिलाएं।",
  "Apply fertilizer in the evening or early morning to reduce evaporation losses.": "वाष्पीकरण से नुकसान कम करने के लिए खाद सुबह जल्दी या शाम को डालें।",
};

const STATE_LABELS: Record<string, Label> = {
  "दिल्ली": { hi: "दिल्ली", en: "Delhi" },
  "हरियाणा": { hi: "हरियाणा", en: "Haryana" },
  "ओडिशा": { hi: "ओडिशा", en: "Odisha" },
  "मध्य प्रदेश": { hi: "मध्य प्रदेश", en: "Madhya Pradesh" },
  "उत्तर प्रदेश": { hi: "उत्तर प्रदेश", en: "Uttar Pradesh" },
  "राजस्थान": { hi: "राजस्थान", en: "Rajasthan" },
  "कर्नाटक": { hi: "कर्नाटक", en: "Karnataka" },
  "गुजरात": { hi: "गुजरात", en: "Gujarat" },
  "आंध्र प्रदेश": { hi: "आंध्र प्रदेश", en: "Andhra Pradesh" },
  "महाराष्ट्र": { hi: "महाराष्ट्र", en: "Maharashtra" },
  "तमिलनाडु": { hi: "तमिलनाडु", en: "Tamil Nadu" },
};

const CROP_TIP_HI: Record<string, string> = {
  "Maintain 5 cm standing water. Transplant at 20-25 days.": "5 सेमी खड़ा पानी बनाए रखें। 20-25 दिन की पौध रोपें।",
  "Sow Oct-Nov. Irrigate at crown root initiation stage.": "अक्टूबर-नवंबर में बुवाई करें। क्राउन रूट अवस्था पर सिंचाई करें।",
  "Thinning at 25 days keeps one plant per hill.": "25 दिन पर छंटाई करके प्रति स्थान एक पौधा रखें।",
  "Most salt-tolerant cereal. Good for marginal lands.": "यह नमक सहन करने वाला अनाज है और कमजोर भूमि के लिए अच्छा है।",
  "Best rainfed crop for arid zones. Very drought tolerant.": "शुष्क क्षेत्रों के लिए अच्छी वर्षा आधारित फसल है और सूखा सहन करती है।",
  "Rhizobium seed treatment boosts nitrogen fixation.": "राइजोबियम बीज उपचार नाइट्रोजन स्थिरीकरण बढ़ाता है।",
  "Irrigate at flowering.": "फूल आने पर सिंचाई करें।",
};

export function labelFrom(map: Record<string, Label>, value: string, lang: Lang) {
  return map[value] ? pick(map[value], lang) : value;
}

export const formatCropCategory = (value: string, lang: Lang) => labelFrom(CROP_CATEGORY_LABELS, value, lang);
export const formatSeason = (value: string, lang: Lang) => labelFrom(SEASON_LABELS, value, lang);
export const formatToolCategory = (value: string, lang: Lang) => labelFrom(TOOL_CATEGORY_LABELS, value, lang);
export const formatSoilType = (value: string, lang: Lang) => labelFrom(SOIL_TYPE_LABELS, value, lang);
export const formatFertilizerCrop = (value: string, lang: Lang) => labelFrom(FERTILIZER_CROP_LABELS, value, lang);
export const formatCropStage = (value: string, lang: Lang) => labelFrom(CROP_STAGE_LABELS, value, lang);
export const formatIrrigation = (value: string, lang: Lang) => labelFrom(IRRIGATION_LABELS, value, lang);
export const formatFertilizerName = (value: string, lang: Lang) => labelFrom(FERTILIZER_LABELS, value, lang);
export const formatStateName = (value: string, lang: Lang) => labelFrom(STATE_LABELS, value, lang);

export function formatToolUsage(value: string, lang: Lang) {
  if (lang !== "hi") return value;
  return Object.entries(TOOL_CATEGORY_LABELS).reduce(
    (text, [category, label]) => text.replaceAll(category, label.hi),
    value
  );
}

export function formatCropWater(value: string, lang: Lang) {
  if (lang !== "hi") return value;
  return value
    .replace(/^Low-Med/, "कम-मध्यम")
    .replace(/^Med-High/, "मध्यम-अधिक")
    .replace(/^High/, "अधिक")
    .replace(/^Med/, "मध्यम")
    .replace(/^Low/, "कम");
}

export function formatCropDuration(value: string, lang: Lang) {
  if (lang !== "hi") return value;
  return value
    .replace(/days/g, "दिन")
    .replace(/months/g, "महीने")
    .replace(/yrs bear/g, "साल में फल")
    .replace(/yr bear/g, "साल में फल")
    .replace(/yr maturity/g, "साल में परिपक्व")
    .replace(/Perennial/g, "बहुवर्षीय");
}

export function formatCropSoil(value: string, lang: Lang) {
  if (lang !== "hi") return value;
  return value
    .replace(/Well-drained/gi, "अच्छी जल निकासी वाली")
    .replace(/well-drained/gi, "अच्छी जल निकासी वाली")
    .replace(/Sandy loam/gi, "बलुई दोमट")
    .replace(/sandy loam/gi, "बलुई दोमट")
    .replace(/Clay-loam/gi, "चिकनी दोमट")
    .replace(/clay-loam/gi, "चिकनी दोमट")
    .replace(/Loam/gi, "दोमट")
    .replace(/loam/gi, "दोमट")
    .replace(/Black/gi, "काली")
    .replace(/Red/gi, "लाल")
    .replace(/Alluvial/gi, "जलोढ़")
    .replace(/Laterite/gi, "लेटराइट")
    .replace(/waterlogged/gi, "जलभराव")
    .replace(/waterlogging/gi, "जलभराव")
    .replace(/acidic/gi, "अम्लीय")
    .replace(/alkaline OK/gi, "क्षारीय मिट्टी भी ठीक")
    .replace(/slightly alkaline/gi, "हल्की क्षारीय")
    .replace(/coastal/gi, "तटीय")
    .replace(/river beds/gi, "नदी किनारे की भूमि");
}

export function formatCropTip(value: string, lang: Lang) {
  if (lang !== "hi") return value;
  return CROP_TIP_HI[value] ?? value
    .replace(/Sow/g, "बुवाई करें")
    .replace(/Plant/g, "रोपण करें")
    .replace(/Irrigate/g, "सिंचाई करें")
    .replace(/Harvest/g, "कटाई करें")
    .replace(/major producers/gi, "मुख्य उत्पादक क्षेत्र")
    .replace(/main areas/gi, "मुख्य क्षेत्र")
    .replace(/well-drained/gi, "अच्छी जल निकासी")
    .replace(/Drip/gi, "ड्रिप")
    .replace(/saves/gi, "बचाता है")
    .replace(/water/gi, "पानी");
}

export function formatScheduleAction(value: string, lang: Lang) {
  return lang === "hi" ? (SCHEDULE_ACTIONS_HI[value] ?? value) : value;
}

export function formatWarning(value: string, lang: Lang) {
  return lang === "hi" ? (WARNING_HI[value] ?? value) : value;
}

export function formatAgriTip(value: string, lang: Lang) {
  return lang === "hi" ? (AGRI_TIP_HI[value] ?? value) : value;
}
