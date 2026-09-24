export interface MandiPrice {
  id: string;
  cropEmoji: string;
  cropHi: string;
  cropEn: string;
  category: string;
  mandi: string;
  state: string;
  min: number;
  modal: number;
  max: number;
  msp?: number;
  trend: 'up' | 'down' | 'stable';
}

export const MANDI_PRICES: MandiPrice[] = [
  { id:'rice-azadpur', cropEmoji:'🌾', cropHi:'धान', cropEn:'Rice', category:'Cereal', mandi:'Azadpur', state:'दिल्ली', min:2200, modal:2400, max:2600, msp:2320, trend:'up' },
  { id:'rice-karnal', cropEmoji:'🌾', cropHi:'धान', cropEn:'Rice', category:'Cereal', mandi:'Karnal', state:'हरियाणा', min:2150, modal:2320, max:2500, msp:2320, trend:'stable' },
  { id:'rice-sambalpur', cropEmoji:'🌾', cropHi:'धान', cropEn:'Rice', category:'Cereal', mandi:'Sambalpur', state:'ओडिशा', min:2100, modal:2280, max:2450, msp:2320, trend:'down' },
  { id:'wheat-indore', cropEmoji:'🌿', cropHi:'गेहूँ', cropEn:'Wheat', category:'Cereal', mandi:'Indore', state:'मध्य प्रदेश', min:2200, modal:2350, max:2500, msp:2275, trend:'up' },
  { id:'wheat-hapur', cropEmoji:'🌿', cropHi:'गेहूँ', cropEn:'Wheat', category:'Cereal', mandi:'Hapur', state:'उत्तर प्रदेश', min:2100, modal:2275, max:2400, msp:2275, trend:'stable' },
  { id:'wheat-jaipur', cropEmoji:'🌿', cropHi:'गेहूँ', cropEn:'Wheat', category:'Cereal', mandi:'Jaipur', state:'राजस्थान', min:2180, modal:2300, max:2450, msp:2275, trend:'up' },
  { id:'maize-gulbarga', cropEmoji:'🌽', cropHi:'मक्का', cropEn:'Maize', category:'Cereal', mandi:'Gulbarga', state:'कर्नाटक', min:1900, modal:2100, max:2300, msp:2090, trend:'stable' },
  { id:'maize-davangere', cropEmoji:'🌽', cropHi:'मक्का', cropEn:'Maize', category:'Cereal', mandi:'Davangere', state:'कर्नाटक', min:1850, modal:2050, max:2200, msp:2090, trend:'down' },
  { id:'cotton-rajkot', cropEmoji:'🤍', cropHi:'कपास', cropEn:'Cotton', category:'Cash', mandi:'Rajkot', state:'गुजरात', min:6800, modal:7150, max:7500, msp:7121, trend:'up' },
  { id:'cotton-guntur', cropEmoji:'🤍', cropHi:'कपास', cropEn:'Cotton', category:'Cash', mandi:'Guntur', state:'आंध्र प्रदेश', min:6700, modal:7050, max:7400, msp:7121, trend:'stable' },
  { id:'soybean-indore', cropEmoji:'🫘', cropHi:'सोयाबीन', cropEn:'Soybean', category:'Oilseed', mandi:'Indore', state:'मध्य प्रदेश', min:4500, modal:4900, max:5200, msp:4892, trend:'up' },
  { id:'soybean-latur', cropEmoji:'🫘', cropHi:'सोयाबीन', cropEn:'Soybean', category:'Oilseed', mandi:'Latur', state:'महाराष्ट्र', min:4400, modal:4800, max:5100, msp:4892, trend:'stable' },
  { id:'chickpea-bikaner', cropEmoji:'🟤', cropHi:'चना', cropEn:'Chickpea', category:'Pulse', mandi:'Bikaner', state:'राजस्थान', min:5200, modal:5500, max:5800, msp:5440, trend:'up' },
  { id:'chickpea-indore', cropEmoji:'🟤', cropHi:'चना', cropEn:'Chickpea', category:'Pulse', mandi:'Indore', state:'मध्य प्रदेश', min:5100, modal:5400, max:5700, msp:5440, trend:'stable' },
  { id:'mustard-alwar', cropEmoji:'🌼', cropHi:'सरसों', cropEn:'Mustard', category:'Oilseed', mandi:'Alwar', state:'राजस्थान', min:5300, modal:5650, max:6000, msp:5650, trend:'stable' },
  { id:'mustard-agra', cropEmoji:'🌼', cropHi:'सरसों', cropEn:'Mustard', category:'Oilseed', mandi:'Agra', state:'उत्तर प्रदेश', min:5200, modal:5550, max:5900, msp:5650, trend:'down' },
  { id:'sugarcane-muz', cropEmoji:'🍬', cropHi:'गन्ना', cropEn:'Sugarcane', category:'Cash', mandi:'Muzaffarnagar', state:'उत्तर प्रदेश', min:315, modal:340, max:365, msp:340, trend:'stable' },
  { id:'sugarcane-kol', cropEmoji:'🍬', cropHi:'गन्ना', cropEn:'Sugarcane', category:'Cash', mandi:'Kolhapur', state:'महाराष्ट्र', min:320, modal:350, max:370, msp:340, trend:'up' },
  { id:'groundnut-jun', cropEmoji:'🥜', cropHi:'मूँगफली', cropEn:'Groundnut', category:'Oilseed', mandi:'Junagadh', state:'गुजरात', min:6000, modal:6400, max:6800, msp:6377, trend:'up' },
  { id:'tomato-azadpur', cropEmoji:'🍅', cropHi:'टमाटर', cropEn:'Tomato', category:'Vegetable', mandi:'Azadpur', state:'दिल्ली', min:800, modal:1500, max:2200, trend:'up' },
  { id:'tomato-koyam', cropEmoji:'🍅', cropHi:'टमाटर', cropEn:'Tomato', category:'Vegetable', mandi:'Koyambedu', state:'तमिलनाडु', min:600, modal:1200, max:1800, trend:'down' },
  { id:'onion-nashik', cropEmoji:'🧅', cropHi:'प्याज', cropEn:'Onion', category:'Vegetable', mandi:'Nashik', state:'महाराष्ट्र', min:1200, modal:1800, max:2400, trend:'up' },
  { id:'onion-azadpur', cropEmoji:'🧅', cropHi:'प्याज', cropEn:'Onion', category:'Vegetable', mandi:'Azadpur', state:'दिल्ली', min:1400, modal:2000, max:2600, trend:'up' },
  { id:'potato-agra', cropEmoji:'🥔', cropHi:'आलू', cropEn:'Potato', category:'Vegetable', mandi:'Agra', state:'उत्तर प्रदेश', min:600, modal:1000, max:1500, trend:'down' },
  { id:'potato-azadpur', cropEmoji:'🥔', cropHi:'आलू', cropEn:'Potato', category:'Vegetable', mandi:'Azadpur', state:'दिल्ली', min:800, modal:1200, max:1600, trend:'stable' },
  { id:'lentil-indore', cropEmoji:'🫘', cropHi:'मसूर', cropEn:'Lentil', category:'Pulse', mandi:'Indore', state:'मध्य प्रदेश', min:6000, modal:6400, max:6800, msp:6425, trend:'stable' },
  { id:'bajra-jodhpur', cropEmoji:'🌾', cropHi:'बाजरा', cropEn:'Bajra', category:'Cereal', mandi:'Jodhpur', state:'राजस्थान', min:2300, modal:2500, max:2700, msp:2500, trend:'stable' },
  { id:'turmeric-erode', cropEmoji:'🟡', cropHi:'हल्दी', cropEn:'Turmeric', category:'Spice', mandi:'Erode', state:'तमिलनाडु', min:7000, modal:9500, max:12000, trend:'up' },
  { id:'turmeric-sangli', cropEmoji:'🟡', cropHi:'हल्दी', cropEn:'Turmeric', category:'Spice', mandi:'Sangli', state:'महाराष्ट्र', min:6500, modal:8500, max:10000, trend:'up' },
  { id:'chilli-guntur', cropEmoji:'🌶️', cropHi:'मिर्च', cropEn:'Chilli', category:'Spice', mandi:'Guntur', state:'आंध्र प्रदेश', min:10000, modal:12500, max:15000, trend:'up' },
  { id:'mango-vashi', cropEmoji:'🥭', cropHi:'आम', cropEn:'Mango', category:'Fruit', mandi:'Vashi', state:'महाराष्ट्र', min:2000, modal:3200, max:4500, trend:'up' },
  { id:'banana-jalgaon', cropEmoji:'🍌', cropHi:'केला', cropEn:'Banana', category:'Fruit', mandi:'Jalgaon', state:'महाराष्ट्र', min:500, modal:800, max:1100, trend:'stable' },
  { id:'cumin-unjha', cropEmoji:'🟤', cropHi:'जीरा', cropEn:'Cumin', category:'Spice', mandi:'Unjha', state:'गुजरात', min:22000, modal:25000, max:28000, trend:'up' },
  { id:'garlic-mandsaur', cropEmoji:'🧄', cropHi:'लहसुन', cropEn:'Garlic', category:'Spice', mandi:'Mandsaur', state:'मध्य प्रदेश', min:3000, modal:4200, max:5500, trend:'up' },
];
