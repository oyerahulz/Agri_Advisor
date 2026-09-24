export interface Scheme {
  id: string;
  emoji: string;
  nameHi: string;
  nameEn: string;
  category: 'subsidy' | 'insurance' | 'loan' | 'equipment' | 'irrigation' | 'other';
  benefit: string;
  benefitEn: string;
  ministry: string;
  ministryEn: string;
  eligibility: string;
  eligibilityEn: string;
  howToApply: string;
  howToApplyEn: string;
  link: string;
  // Lifecycle fields
  status: 'active' | 'expired' | 'upcoming';
  lastDateToApply?: string;   // "YYYY-MM-DD" — auto-expires after this date
  launchDate?: string;        // "YYYY-MM-DD" — upcoming schemes become active on this date
  deadlineNote?: string;      // human-readable deadline note
  deadlineNoteHi?: string;
}

export const SCHEMES: Scheme[] = [
  // ── ACTIVE SCHEMES ──────────────────────────────────────────────────────────
  {
    id:'pmkisan', emoji:'🏛️', status:'active',
    nameHi:'पीएम-किसान सम्मान निधि', nameEn:'PM-KISAN Samman Nidhi',
    category:'subsidy',
    benefit:'₹6,000/वर्ष (3 किस्तों में)', benefitEn:'₹6,000/year (in 3 installments)',
    ministry:'कृषि मंत्रालय', ministryEn:'Ministry of Agriculture',
    eligibility:'2 हेक्टेयर तक भूमि वाले किसान', eligibilityEn:'Farmers with up to 2 hectares of land',
    howToApply:'pmkisan.gov.in पर ऑनलाइन या CSC केंद्र', howToApplyEn:'Online at pmkisan.gov.in or CSC center',
    link:'https://pmkisan.gov.in',
    deadlineNote:'Ongoing — no fixed deadline', deadlineNoteHi:'जारी — कोई अंतिम तिथि नहीं',
  },
  {
    id:'pmfby', emoji:'🛡️', status:'active',
    nameHi:'पीएम फसल बीमा योजना', nameEn:'PM Fasal Bima Yojana',
    category:'insurance',
    benefit:'प्रीमियम: खरीफ 2%, रबी 1.5%, बागवानी 5%', benefitEn:'Premium: Kharif 2%, Rabi 1.5%, Horticulture 5%',
    ministry:'कृषि मंत्रालय', ministryEn:'Ministry of Agriculture',
    eligibility:'सभी किसान (ऋणी और गैर-ऋणी)', eligibilityEn:'All farmers (loanee and non-loanee)',
    howToApply:'बैंक, CSC या pmfby.gov.in', howToApplyEn:'Bank, CSC or pmfby.gov.in',
    link:'https://pmfby.gov.in',
    lastDateToApply:'2026-07-31',
    deadlineNote:'Kharif 2026 deadline: 31 Jul 2026', deadlineNoteHi:'खरीफ 2026 अंतिम तिथि: 31 जुलाई 2026',
  },
  {
    id:'kcc', emoji:'💳', status:'active',
    nameHi:'किसान क्रेडिट कार्ड', nameEn:'Kisan Credit Card',
    category:'loan',
    benefit:'₹3 लाख तक 4% ब्याज पर ऋण', benefitEn:'Loan up to ₹3 lakh at 4% interest',
    ministry:'वित्त मंत्रालय', ministryEn:'Ministry of Finance',
    eligibility:'सभी किसान, मछुआरे, पशुपालक', eligibilityEn:'All farmers, fishermen, animal husbandry',
    howToApply:'नज़दीकी बैंक शाखा में आवेदन', howToApplyEn:'Apply at nearest bank branch',
    link:'https://www.nabard.org',
    deadlineNote:'Ongoing — apply anytime', deadlineNoteHi:'जारी — कभी भी आवेदन करें',
  },
  {
    id:'shc', emoji:'🧪', status:'active',
    nameHi:'मिट्टी स्वास्थ्य कार्ड योजना', nameEn:'Soil Health Card Scheme',
    category:'other',
    benefit:'मुफ्त मिट्टी परीक्षण और सुझाव', benefitEn:'Free soil testing and recommendations',
    ministry:'कृषि मंत्रालय', ministryEn:'Ministry of Agriculture',
    eligibility:'सभी किसान', eligibilityEn:'All farmers',
    howToApply:'नज़दीकी कृषि विभाग या soilhealth.dac.gov.in', howToApplyEn:'Nearest agriculture dept or soilhealth.dac.gov.in',
    link:'https://soilhealth.dac.gov.in',
    deadlineNote:'Ongoing', deadlineNoteHi:'जारी',
  },
  {
    id:'pmkmy', emoji:'👴', status:'active',
    nameHi:'पीएम किसान मानधन योजना', nameEn:'PM Kisan Maandhan Yojana',
    category:'subsidy',
    benefit:'₹3,000/माह पेंशन (60 वर्ष बाद)', benefitEn:'₹3,000/month pension (after 60 years)',
    ministry:'कृषि मंत्रालय', ministryEn:'Ministry of Agriculture',
    eligibility:'18-40 वर्ष के छोटे/सीमांत किसान', eligibilityEn:'Small/marginal farmers aged 18-40 years',
    howToApply:'CSC केंद्र या maandhan.in', howToApplyEn:'CSC center or maandhan.in',
    link:'https://maandhan.in',
    deadlineNote:'Ongoing', deadlineNoteHi:'जारी',
  },
  {
    id:'smam', emoji:'🚜', status:'active',
    nameHi:'कृषि मशीनीकरण उप मिशन', nameEn:'Sub-Mission on Agricultural Mechanization',
    category:'equipment',
    benefit:'40-80% सब्सिडी पर कृषि यंत्र', benefitEn:'40-80% subsidy on farm equipment',
    ministry:'कृषि मंत्रालय', ministryEn:'Ministry of Agriculture',
    eligibility:'सभी किसान (SC/ST/महिला को प्राथमिकता)', eligibilityEn:'All farmers (SC/ST/women get priority)',
    howToApply:'agrimachinery.dac.gov.in', howToApplyEn:'agrimachinery.dac.gov.in',
    link:'https://agrimachinery.dac.gov.in',
    lastDateToApply:'2026-12-31',
    deadlineNote:'Apply before 31 Dec 2026', deadlineNoteHi:'31 दिसंबर 2026 से पहले आवेदन करें',
  },
  {
    id:'pmksy', emoji:'💧', status:'active',
    nameHi:'पीएम कृषि सिंचाई योजना', nameEn:'PM Krishi Sinchai Yojana',
    category:'irrigation',
    benefit:'55-75% सब्सिडी (ड्रिप/स्प्रिंकलर)', benefitEn:'55-75% subsidy (drip/sprinkler)',
    ministry:'कृषि मंत्रालय', ministryEn:'Ministry of Agriculture',
    eligibility:'सभी किसान', eligibilityEn:'All farmers',
    howToApply:'राज्य कृषि विभाग', howToApplyEn:'State Agriculture Department',
    link:'https://pmksy.gov.in',
    deadlineNote:'Ongoing', deadlineNoteHi:'जारी',
  },
  {
    id:'enam', emoji:'🛒', status:'active',
    nameHi:'ई-नाम (राष्ट्रीय कृषि बाज़ार)', nameEn:'e-NAM (National Agriculture Market)',
    category:'other',
    benefit:'ऑनलाइन मंडी, बेहतर भाव', benefitEn:'Online mandi, better prices',
    ministry:'कृषि मंत्रालय', ministryEn:'Ministry of Agriculture',
    eligibility:'सभी किसान', eligibilityEn:'All farmers',
    howToApply:'enam.gov.in पर पंजीकरण', howToApplyEn:'Register at enam.gov.in',
    link:'https://enam.gov.in',
    deadlineNote:'Ongoing', deadlineNoteHi:'जारी',
  },
  {
    id:'pkvy', emoji:'🌿', status:'active',
    nameHi:'परंपरागत कृषि विकास योजना', nameEn:'Paramparagat Krishi Vikas Yojana',
    category:'subsidy',
    benefit:'₹50,000/हे. (3 वर्ष) जैविक खेती के लिए', benefitEn:'₹50,000/ha (3 years) for organic farming',
    ministry:'कृषि मंत्रालय', ministryEn:'Ministry of Agriculture',
    eligibility:'जैविक खेती करने वाले किसान', eligibilityEn:'Farmers doing organic farming',
    howToApply:'राज्य कृषि विभाग', howToApplyEn:'State Agriculture Department',
    link:'https://pgsindia-ncof.gov.in',
    deadlineNote:'Ongoing', deadlineNoteHi:'जारी',
  },
  {
    id:'nhm', emoji:'🍎', status:'active',
    nameHi:'राष्ट्रीय बागवानी मिशन', nameEn:'National Horticulture Mission',
    category:'subsidy',
    benefit:'50-75% सब्सिडी (बागवानी फसलें)', benefitEn:'50-75% subsidy (horticulture crops)',
    ministry:'कृषि मंत्रालय', ministryEn:'Ministry of Agriculture',
    eligibility:'बागवानी किसान', eligibilityEn:'Horticulture farmers',
    howToApply:'राज्य बागवानी विभाग', howToApplyEn:'State Horticulture Department',
    link:'https://nhb.gov.in',
    deadlineNote:'Ongoing', deadlineNoteHi:'जारी',
  },
  {
    id:'aif', emoji:'🏗️', status:'active',
    nameHi:'कृषि अवसंरचना कोष', nameEn:'Agriculture Infrastructure Fund',
    category:'loan',
    benefit:'₹2 करोड़ तक 3% ब्याज सब्सिडी', benefitEn:'3% interest subsidy up to ₹2 crore',
    ministry:'कृषि मंत्रालय', ministryEn:'Ministry of Agriculture',
    eligibility:'FPO, PACS, किसान', eligibilityEn:'FPO, PACS, farmers',
    howToApply:'agriinfra.dac.gov.in', howToApplyEn:'agriinfra.dac.gov.in',
    link:'https://agriinfra.dac.gov.in',
    lastDateToApply:'2027-03-31',
    deadlineNote:'Apply before 31 Mar 2027', deadlineNoteHi:'31 मार्च 2027 से पहले आवेदन करें',
  },
  {
    id:'pmkusum', emoji:'☀️', status:'active',
    nameHi:'पीएम-कुसुम योजना', nameEn:'PM-KUSUM Scheme',
    category:'equipment',
    benefit:'60-90% सब्सिडी (सोलर पंप)', benefitEn:'60-90% subsidy (solar pump)',
    ministry:'नवीन एवं नवीकरणीय ऊर्जा मंत्रालय', ministryEn:'Ministry of New & Renewable Energy',
    eligibility:'सभी किसान', eligibilityEn:'All farmers',
    howToApply:'mnre.gov.in या राज्य नोडल एजेंसी', howToApplyEn:'mnre.gov.in or state nodal agency',
    link:'https://mnre.gov.in',
    lastDateToApply:'2026-09-30',
    deadlineNote:'Apply before 30 Sep 2026', deadlineNoteHi:'30 सितंबर 2026 से पहले आवेदन करें',
  },
  {
    id:'rkvy', emoji:'🌱', status:'active',
    nameHi:'राष्ट्रीय कृषि विकास योजना', nameEn:'Rashtriya Krishi Vikas Yojana',
    category:'other',
    benefit:'₹25 लाख तक परियोजना सहायता', benefitEn:'Project support up to ₹25 lakh',
    ministry:'कृषि मंत्रालय', ministryEn:'Ministry of Agriculture',
    eligibility:'किसान, FPO, SHG', eligibilityEn:'Farmers, FPO, SHG',
    howToApply:'rkvy.nic.in', howToApplyEn:'rkvy.nic.in',
    link:'https://rkvy.nic.in',
    deadlineNote:'Ongoing', deadlineNoteHi:'जारी',
  },
  {
    id:'nfsm', emoji:'🌾', status:'active',
    nameHi:'राष्ट्रीय खाद्य सुरक्षा मिशन', nameEn:'National Food Security Mission',
    category:'subsidy',
    benefit:'सब्सिडी पर बीज, खाद, यंत्र', benefitEn:'Subsidized seeds, fertilizers, equipment',
    ministry:'कृषि मंत्रालय', ministryEn:'Ministry of Agriculture',
    eligibility:'चावल, गेहूँ, दलहन किसान', eligibilityEn:'Rice, wheat, pulse farmers',
    howToApply:'राज्य कृषि विभाग', howToApplyEn:'State Agriculture Department',
    link:'https://nfsm.gov.in',
    deadlineNote:'Ongoing', deadlineNoteHi:'जारी',
  },
  {
    id:'nmoop', emoji:'🌻', status:'active',
    nameHi:'तिलहन और ऑयल पाम राष्ट्रीय मिशन', nameEn:'National Mission on Oilseeds & Oil Palm',
    category:'subsidy',
    benefit:'घटक अनुसार भिन्न सब्सिडी', benefitEn:'Subsidy varies by component',
    ministry:'कृषि मंत्रालय', ministryEn:'Ministry of Agriculture',
    eligibility:'तिलहन/ऑयल पाम किसान', eligibilityEn:'Oilseed/oil palm farmers',
    howToApply:'राज्य कृषि विभाग', howToApplyEn:'State Agriculture Department',
    link:'https://nmoop.gov.in',
    deadlineNote:'Ongoing', deadlineNoteHi:'जारी',
  },

  // ── EXPIRED SCHEMES (auto-hidden from active list) ───────────────────────────
  {
    id:'dbtl-old', emoji:'⛽', status:'expired',
    nameHi:'डीबीटी-एल (पुरानी LPG सब्सिडी)', nameEn:'DBTL Old LPG Subsidy Scheme',
    category:'subsidy',
    benefit:'LPG सब्सिडी सीधे बैंक खाते में', benefitEn:'LPG subsidy directly to bank account',
    ministry:'पेट्रोलियम मंत्रालय', ministryEn:'Ministry of Petroleum',
    eligibility:'BPL परिवार', eligibilityEn:'BPL families',
    howToApply:'बंद हो गई', howToApplyEn:'Scheme closed',
    link:'',
    lastDateToApply:'2023-12-31',
    deadlineNote:'Closed — Dec 2023', deadlineNoteHi:'बंद — दिसंबर 2023',
  },
  {
    id:'pmry-old', emoji:'🏭', status:'expired',
    nameHi:'प्रधानमंत्री रोज़गार योजना (पुरानी)', nameEn:'PM Rozgar Yojana (Old)',
    category:'loan',
    benefit:'स्वरोज़गार ऋण', benefitEn:'Self-employment loan',
    ministry:'श्रम मंत्रालय', ministryEn:'Ministry of Labour',
    eligibility:'बेरोज़गार युवा', eligibilityEn:'Unemployed youth',
    howToApply:'बंद हो गई', howToApplyEn:'Scheme closed',
    link:'',
    lastDateToApply:'2024-03-31',
    deadlineNote:'Closed — Mar 2024', deadlineNoteHi:'बंद — मार्च 2024',
  },
  {
    id:'nais-old', emoji:'🌧️', status:'expired',
    nameHi:'राष्ट्रीय कृषि बीमा योजना (पुरानी)', nameEn:'National Agricultural Insurance Scheme (Old)',
    category:'insurance',
    benefit:'फसल नुकसान पर मुआवज़ा', benefitEn:'Compensation for crop loss',
    ministry:'कृषि मंत्रालय', ministryEn:'Ministry of Agriculture',
    eligibility:'सभी किसान', eligibilityEn:'All farmers',
    howToApply:'PMFBY से बदली गई', howToApplyEn:'Replaced by PMFBY',
    link:'',
    lastDateToApply:'2024-06-30',
    deadlineNote:'Replaced by PMFBY', deadlineNoteHi:'PMFBY से बदली गई',
  },

  // ── UPCOMING SCHEMES ─────────────────────────────────────────────────────────
  {
    id:'digital-kisan-2026', emoji:'📱', status:'upcoming',
    nameHi:'डिजिटल किसान पोर्टल 2.0', nameEn:'Digital Kisan Portal 2.0',
    category:'other',
    benefit:'एक पोर्टल पर सभी सरकारी सेवाएं', benefitEn:'All government services on one portal',
    ministry:'कृषि मंत्रालय', ministryEn:'Ministry of Agriculture',
    eligibility:'सभी किसान', eligibilityEn:'All farmers',
    howToApply:'लॉन्च के बाद ऑनलाइन', howToApplyEn:'Online after launch',
    link:'https://agricoop.nic.in',
    launchDate:'2026-06-01',
    deadlineNote:'Launching June 2026', deadlineNoteHi:'जून 2026 में लॉन्च होगी',
  },
  {
    id:'nano-urea-subsidy', emoji:'🧬', status:'upcoming',
    nameHi:'नैनो यूरिया सब्सिडी योजना', nameEn:'Nano Urea Subsidy Scheme',
    category:'subsidy',
    benefit:'50% सब्सिडी पर नैनो यूरिया', benefitEn:'50% subsidy on nano urea',
    ministry:'रसायन एवं उर्वरक मंत्रालय', ministryEn:'Ministry of Chemicals & Fertilizers',
    eligibility:'सभी किसान', eligibilityEn:'All farmers',
    howToApply:'लॉन्च के बाद कृषि विभाग', howToApplyEn:'Agriculture dept after launch',
    link:'https://iffco.in',
    launchDate:'2026-07-15',
    deadlineNote:'Launching July 2026', deadlineNoteHi:'जुलाई 2026 में लॉन्च होगी',
  },
  {
    id:'agri-drone-scheme', emoji:'🚁', status:'upcoming',
    nameHi:'कृषि ड्रोन सब्सिडी योजना 2.0', nameEn:'Agri Drone Subsidy Scheme 2.0',
    category:'equipment',
    benefit:'75% सब्सिडी पर कृषि ड्रोन', benefitEn:'75% subsidy on agriculture drones',
    ministry:'कृषि मंत्रालय', ministryEn:'Ministry of Agriculture',
    eligibility:'FPO, किसान समूह, व्यक्तिगत किसान', eligibilityEn:'FPO, farmer groups, individual farmers',
    howToApply:'लॉन्च के बाद agrimachinery.dac.gov.in', howToApplyEn:'agrimachinery.dac.gov.in after launch',
    link:'https://agrimachinery.dac.gov.in',
    launchDate:'2026-08-15',
    deadlineNote:'Launching Aug 2026', deadlineNoteHi:'अगस्त 2026 में लॉन्च होगी',
  },
  {
    id:'kisan-ai-advisory', emoji:'🤖', status:'upcoming',
    nameHi:'किसान AI सलाह सेवा', nameEn:'Kisan AI Advisory Service',
    category:'other',
    benefit:'AI आधारित मुफ्त फसल सलाह', benefitEn:'Free AI-based crop advisory',
    ministry:'कृषि मंत्रालय', ministryEn:'Ministry of Agriculture',
    eligibility:'सभी किसान', eligibilityEn:'All farmers',
    howToApply:'मोबाइल ऐप के माध्यम से', howToApplyEn:'Via mobile app',
    link:'https://agricoop.nic.in',
    launchDate:'2026-09-01',
    deadlineNote:'Launching Sep 2026', deadlineNoteHi:'सितंबर 2026 में लॉन्च होगी',
  },
  {
    id:'climate-resilient-farming', emoji:'🌍', status:'upcoming',
    nameHi:'जलवायु अनुकूल कृषि योजना', nameEn:'Climate Resilient Farming Scheme',
    category:'subsidy',
    benefit:'₹15,000/हे. जलवायु अनुकूल बीज और तकनीक', benefitEn:'₹15,000/ha for climate-resilient seeds & tech',
    ministry:'कृषि मंत्रालय', ministryEn:'Ministry of Agriculture',
    eligibility:'सभी किसान', eligibilityEn:'All farmers',
    howToApply:'राज्य कृषि विभाग', howToApplyEn:'State Agriculture Department',
    link:'https://agricoop.nic.in',
    launchDate:'2026-10-01',
    deadlineNote:'Launching Oct 2026', deadlineNoteHi:'अक्टूबर 2026 में लॉन्च होगी',
  },
];

// Helper: resolve effective status based on today's date
export function getEffectiveStatus(s: Scheme): 'active' | 'expired' | 'upcoming' {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (s.lastDateToApply) {
    const exp = new Date(s.lastDateToApply);
    if (today > exp) return 'expired';
  }
  if (s.launchDate) {
    const launch = new Date(s.launchDate);
    if (today < launch) return 'upcoming';
  }
  return s.status;
}

export function daysUntilDeadline(s: Scheme): number | null {
  if (!s.lastDateToApply) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const exp = new Date(s.lastDateToApply);
  return Math.ceil((exp.getTime() - today.getTime()) / 86400000);
}

export function daysUntilLaunch(s: Scheme): number | null {
  if (!s.launchDate) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const launch = new Date(s.launchDate);
  return Math.ceil((launch.getTime() - today.getTime()) / 86400000);
}
