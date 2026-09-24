export type FertilizerRecord = {
  temp: number; humidity: number; moisture: number;
  soilType: string; cropType: string;
  nitrogen: number; potassium: number; phosphorous: number;
  fertilizer: string;
};

export const FERTILIZER_DATA: FertilizerRecord[] = [
  {temp:26,humidity:52,moisture:38,soilType:"Sandy",cropType:"Maize",nitrogen:37,potassium:0,phosphorous:0,fertilizer:"Urea"},
  {temp:29,humidity:48,moisture:27,soilType:"Loamy",cropType:"Sugarcane",nitrogen:12,potassium:36,phosphorous:6,fertilizer:"DAP"},
  {temp:34,humidity:65,moisture:58,soilType:"Black",cropType:"Cotton",nitrogen:7,potassium:9,phosphorous:30,fertilizer:"14-35-14"},
  {temp:25,humidity:72,moisture:60,soilType:"Clayey",cropType:"Paddy",nitrogen:20,potassium:0,phosphorous:20,fertilizer:"28-28"},
  {temp:22,humidity:82,moisture:70,soilType:"Loamy",cropType:"Paddy",nitrogen:37,potassium:0,phosphorous:0,fertilizer:"Urea"},
  {temp:31,humidity:60,moisture:45,soilType:"Red",cropType:"Ground Nuts",nitrogen:22,potassium:30,phosphorous:15,fertilizer:"17-17-17"},
  {temp:28,humidity:55,moisture:35,soilType:"Alluvial",cropType:"Wheat",nitrogen:35,potassium:0,phosphorous:0,fertilizer:"Urea"},
  {temp:20,humidity:45,moisture:25,soilType:"Sandy",cropType:"Barley",nitrogen:10,potassium:20,phosphorous:20,fertilizer:"20-20"},
  {temp:27,humidity:68,moisture:50,soilType:"Loamy",cropType:"Millets",nitrogen:0,potassium:20,phosphorous:20,fertilizer:"10-26-26"},
  {temp:33,humidity:75,moisture:65,soilType:"Black",cropType:"Sugarcane",nitrogen:20,potassium:20,phosphorous:20,fertilizer:"17-17-17"},
  {temp:24,humidity:58,moisture:40,soilType:"Alluvial",cropType:"Wheat",nitrogen:12,potassium:36,phosphorous:6,fertilizer:"DAP"},
  {temp:30,humidity:70,moisture:55,soilType:"Clayey",cropType:"Paddy",nitrogen:37,potassium:0,phosphorous:0,fertilizer:"Urea"},
  {temp:26,humidity:50,moisture:30,soilType:"Sandy",cropType:"Ground Nuts",nitrogen:22,potassium:30,phosphorous:15,fertilizer:"17-17-17"},
  {temp:35,humidity:40,moisture:20,soilType:"Red",cropType:"Millets",nitrogen:0,potassium:20,phosphorous:20,fertilizer:"10-26-26"},
  {temp:23,humidity:62,moisture:42,soilType:"Loamy",cropType:"Oil seeds",nitrogen:20,potassium:20,phosphorous:20,fertilizer:"NPK Mix"},
  {temp:29,humidity:78,moisture:68,soilType:"Alluvial",cropType:"Sugarcane",nitrogen:20,potassium:0,phosphorous:20,fertilizer:"28-28"},
  {temp:32,humidity:55,moisture:38,soilType:"Black",cropType:"Cotton",nitrogen:12,potassium:36,phosphorous:6,fertilizer:"DAP"},
  {temp:21,humidity:48,moisture:28,soilType:"Sandy",cropType:"Barley",nitrogen:37,potassium:0,phosphorous:0,fertilizer:"Urea"},
  {temp:27,humidity:65,moisture:48,soilType:"Red",cropType:"Pulses",nitrogen:0,potassium:20,phosphorous:20,fertilizer:"10-26-26"},
  {temp:25,humidity:72,moisture:55,soilType:"Clayey",cropType:"Maize",nitrogen:20,potassium:20,phosphorous:20,fertilizer:"17-17-17"},
  {temp:38,humidity:35,moisture:15,soilType:"Sandy",cropType:"Millets",nitrogen:37,potassium:0,phosphorous:0,fertilizer:"Urea"},
  {temp:22,humidity:80,moisture:72,soilType:"Loamy",cropType:"Paddy",nitrogen:12,potassium:36,phosphorous:6,fertilizer:"DAP"},
  {temp:30,humidity:60,moisture:44,soilType:"Alluvial",cropType:"Wheat",nitrogen:20,potassium:20,phosphorous:20,fertilizer:"20-20"},
  {temp:28,humidity:52,moisture:36,soilType:"Black",cropType:"Sugarcane",nitrogen:7,potassium:9,phosphorous:30,fertilizer:"14-35-14"},
  {temp:33,humidity:68,moisture:52,soilType:"Red",cropType:"Cotton",nitrogen:20,potassium:0,phosphorous:20,fertilizer:"28-28"},
  {temp:24,humidity:75,moisture:60,soilType:"Clayey",cropType:"Oil seeds",nitrogen:22,potassium:30,phosphorous:15,fertilizer:"17-17-17"},
  {temp:26,humidity:58,moisture:40,soilType:"Sandy",cropType:"Pulses",nitrogen:0,potassium:20,phosphorous:20,fertilizer:"10-26-26"},
  {temp:31,humidity:45,moisture:25,soilType:"Loamy",cropType:"Barley",nitrogen:37,potassium:0,phosphorous:0,fertilizer:"Urea"},
  {temp:29,humidity:70,moisture:58,soilType:"Alluvial",cropType:"Maize",nitrogen:12,potassium:36,phosphorous:6,fertilizer:"DAP"},
  {temp:36,humidity:38,moisture:18,soilType:"Red",cropType:"Ground Nuts",nitrogen:20,potassium:20,phosphorous:20,fertilizer:"NPK Mix"},
  {temp:23,humidity:82,moisture:74,soilType:"Clayey",cropType:"Paddy",nitrogen:20,potassium:0,phosphorous:20,fertilizer:"28-28"},
  {temp:27,humidity:55,moisture:38,soilType:"Black",cropType:"Wheat",nitrogen:7,potassium:9,phosphorous:30,fertilizer:"14-35-14"},
  {temp:32,humidity:62,moisture:46,soilType:"Sandy",cropType:"Sugarcane",nitrogen:22,potassium:30,phosphorous:15,fertilizer:"17-17-17"},
  {temp:20,humidity:50,moisture:30,soilType:"Loamy",cropType:"Millets",nitrogen:37,potassium:0,phosphorous:0,fertilizer:"Urea"},
  {temp:34,humidity:72,moisture:62,soilType:"Alluvial",cropType:"Cotton",nitrogen:12,potassium:36,phosphorous:6,fertilizer:"DAP"},
  {temp:25,humidity:65,moisture:48,soilType:"Red",cropType:"Maize",nitrogen:20,potassium:20,phosphorous:20,fertilizer:"20-20"},
  {temp:28,humidity:78,moisture:68,soilType:"Clayey",cropType:"Paddy",nitrogen:0,potassium:20,phosphorous:20,fertilizer:"10-26-26"},
  {temp:30,humidity:42,moisture:22,soilType:"Sandy",cropType:"Barley",nitrogen:20,potassium:0,phosphorous:20,fertilizer:"28-28"},
  {temp:22,humidity:68,moisture:52,soilType:"Black",cropType:"Oil seeds",nitrogen:22,potassium:30,phosphorous:15,fertilizer:"17-17-17"},
  {temp:35,humidity:55,moisture:38,soilType:"Loamy",cropType:"Ground Nuts",nitrogen:37,potassium:0,phosphorous:0,fertilizer:"Urea"},
  {temp:26,humidity:75,moisture:62,soilType:"Alluvial",cropType:"Sugarcane",nitrogen:12,potassium:36,phosphorous:6,fertilizer:"DAP"},
  {temp:29,humidity:48,moisture:28,soilType:"Red",cropType:"Pulses",nitrogen:7,potassium:9,phosphorous:30,fertilizer:"14-35-14"},
  {temp:33,humidity:60,moisture:44,soilType:"Clayey",cropType:"Wheat",nitrogen:20,potassium:20,phosphorous:20,fertilizer:"NPK Mix"},
  {temp:21,humidity:85,moisture:76,soilType:"Sandy",cropType:"Paddy",nitrogen:0,potassium:20,phosphorous:20,fertilizer:"10-26-26"},
  {temp:27,humidity:52,moisture:35,soilType:"Black",cropType:"Maize",nitrogen:20,potassium:0,phosphorous:20,fertilizer:"28-28"},
  {temp:31,humidity:65,moisture:50,soilType:"Loamy",cropType:"Cotton",nitrogen:22,potassium:30,phosphorous:15,fertilizer:"17-17-17"},
  {temp:24,humidity:70,moisture:55,soilType:"Alluvial",cropType:"Millets",nitrogen:37,potassium:0,phosphorous:0,fertilizer:"Urea"},
  {temp:37,humidity:32,moisture:12,soilType:"Sandy",cropType:"Ground Nuts",nitrogen:12,potassium:36,phosphorous:6,fertilizer:"DAP"},
  {temp:23,humidity:78,moisture:66,soilType:"Red",cropType:"Sugarcane",nitrogen:20,potassium:20,phosphorous:20,fertilizer:"20-20"},
  {temp:28,humidity:58,moisture:42,soilType:"Clayey",cropType:"Barley",nitrogen:7,potassium:9,phosphorous:30,fertilizer:"14-35-14"},
  {temp:32,humidity:45,moisture:25,soilType:"Black",cropType:"Oil seeds",nitrogen:0,potassium:20,phosphorous:20,fertilizer:"10-26-26"},
  {temp:26,humidity:72,moisture:58,soilType:"Loamy",cropType:"Pulses",nitrogen:20,potassium:0,phosphorous:20,fertilizer:"28-28"},
  {temp:30,humidity:62,moisture:46,soilType:"Alluvial",cropType:"Maize",nitrogen:22,potassium:30,phosphorous:15,fertilizer:"17-17-17"},
  {temp:19,humidity:88,moisture:78,soilType:"Clayey",cropType:"Paddy",nitrogen:37,potassium:0,phosphorous:0,fertilizer:"Urea"},
  {temp:34,humidity:50,moisture:32,soilType:"Sandy",cropType:"Cotton",nitrogen:12,potassium:36,phosphorous:6,fertilizer:"DAP"},
  {temp:25,humidity:68,moisture:52,soilType:"Red",cropType:"Wheat",nitrogen:20,potassium:20,phosphorous:20,fertilizer:"NPK Mix"},
  {temp:29,humidity:55,moisture:38,soilType:"Black",cropType:"Sugarcane",nitrogen:0,potassium:20,phosphorous:20,fertilizer:"10-26-26"},
  {temp:22,humidity:75,moisture:62,soilType:"Loamy",cropType:"Ground Nuts",nitrogen:20,potassium:0,phosphorous:20,fertilizer:"28-28"},
  {temp:36,humidity:40,moisture:20,soilType:"Alluvial",cropType:"Millets",nitrogen:7,potassium:9,phosphorous:30,fertilizer:"14-35-14"},
  {temp:27,humidity:65,moisture:48,soilType:"Clayey",cropType:"Oil seeds",nitrogen:22,potassium:30,phosphorous:15,fertilizer:"17-17-17"},
  {temp:31,humidity:52,moisture:35,soilType:"Sandy",cropType:"Barley",nitrogen:37,potassium:0,phosphorous:0,fertilizer:"Urea"},
  {temp:24,humidity:80,moisture:70,soilType:"Red",cropType:"Paddy",nitrogen:12,potassium:36,phosphorous:6,fertilizer:"DAP"},
  {temp:33,humidity:58,moisture:42,soilType:"Black",cropType:"Maize",nitrogen:20,potassium:20,phosphorous:20,fertilizer:"20-20"},
  {temp:20,humidity:70,moisture:55,soilType:"Loamy",cropType:"Pulses",nitrogen:0,potassium:20,phosphorous:20,fertilizer:"10-26-26"},
  {temp:28,humidity:45,moisture:28,soilType:"Alluvial",cropType:"Cotton",nitrogen:20,potassium:0,phosphorous:20,fertilizer:"28-28"},
  {temp:35,humidity:62,moisture:46,soilType:"Clayey",cropType:"Sugarcane",nitrogen:22,potassium:30,phosphorous:15,fertilizer:"17-17-17"},
  {temp:23,humidity:72,moisture:58,soilType:"Sandy",cropType:"Wheat",nitrogen:37,potassium:0,phosphorous:0,fertilizer:"Urea"},
  {temp:30,humidity:85,moisture:75,soilType:"Red",cropType:"Paddy",nitrogen:12,potassium:36,phosphorous:6,fertilizer:"DAP"},
  {temp:26,humidity:55,moisture:38,soilType:"Black",cropType:"Ground Nuts",nitrogen:7,potassium:9,phosphorous:30,fertilizer:"14-35-14"},
  {temp:32,humidity:68,moisture:52,soilType:"Loamy",cropType:"Millets",nitrogen:20,potassium:20,phosphorous:20,fertilizer:"NPK Mix"},
  {temp:21,humidity:48,moisture:28,soilType:"Alluvial",cropType:"Barley",nitrogen:0,potassium:20,phosphorous:20,fertilizer:"10-26-26"},
  {temp:29,humidity:75,moisture:62,soilType:"Clayey",cropType:"Oil seeds",nitrogen:20,potassium:0,phosphorous:20,fertilizer:"28-28"},
  {temp:38,humidity:35,moisture:15,soilType:"Sandy",cropType:"Tobacco",nitrogen:22,potassium:30,phosphorous:15,fertilizer:"17-17-17"},
  {temp:25,humidity:60,moisture:44,soilType:"Red",cropType:"Tobacco",nitrogen:37,potassium:0,phosphorous:0,fertilizer:"Urea"},
  {temp:27,humidity:78,moisture:66,soilType:"Black",cropType:"Paddy",nitrogen:12,potassium:36,phosphorous:6,fertilizer:"DAP"},
  {temp:31,humidity:50,moisture:32,soilType:"Loamy",cropType:"Maize",nitrogen:20,potassium:20,phosphorous:20,fertilizer:"20-20"},
  {temp:34,humidity:65,moisture:50,soilType:"Alluvial",cropType:"Cotton",nitrogen:0,potassium:20,phosphorous:20,fertilizer:"10-26-26"},
  {temp:22,humidity:82,moisture:72,soilType:"Clayey",cropType:"Sugarcane",nitrogen:20,potassium:0,phosphorous:20,fertilizer:"28-28"},
  {temp:36,humidity:42,moisture:22,soilType:"Sandy",cropType:"Pulses",nitrogen:7,potassium:9,phosphorous:30,fertilizer:"14-35-14"},
  {temp:24,humidity:68,moisture:52,soilType:"Red",cropType:"Wheat",nitrogen:22,potassium:30,phosphorous:15,fertilizer:"17-17-17"},
  {temp:28,humidity:55,moisture:38,soilType:"Black",cropType:"Barley",nitrogen:37,potassium:0,phosphorous:0,fertilizer:"Urea"},
  {temp:33,humidity:72,moisture:60,soilType:"Loamy",cropType:"Ground Nuts",nitrogen:12,potassium:36,phosphorous:6,fertilizer:"DAP"},
  {temp:20,humidity:88,moisture:78,soilType:"Alluvial",cropType:"Paddy",nitrogen:20,potassium:20,phosphorous:20,fertilizer:"NPK Mix"},
  {temp:30,humidity:58,moisture:42,soilType:"Clayey",cropType:"Millets",nitrogen:0,potassium:20,phosphorous:20,fertilizer:"10-26-26"},
  {temp:26,humidity:45,moisture:25,soilType:"Sandy",cropType:"Oil seeds",nitrogen:20,potassium:0,phosphorous:20,fertilizer:"28-28"},
  {temp:32,humidity:70,moisture:56,soilType:"Red",cropType:"Maize",nitrogen:7,potassium:9,phosphorous:30,fertilizer:"14-35-14"},
  {temp:23,humidity:62,moisture:46,soilType:"Black",cropType:"Cotton",nitrogen:22,potassium:30,phosphorous:15,fertilizer:"17-17-17"},
  {temp:29,humidity:80,moisture:70,soilType:"Loamy",cropType:"Sugarcane",nitrogen:37,potassium:0,phosphorous:0,fertilizer:"Urea"},
  {temp:35,humidity:50,moisture:32,soilType:"Alluvial",cropType:"Pulses",nitrogen:12,potassium:36,phosphorous:6,fertilizer:"DAP"},
  {temp:21,humidity:75,moisture:62,soilType:"Clayey",cropType:"Wheat",nitrogen:20,potassium:20,phosphorous:20,fertilizer:"20-20"},
  {temp:27,humidity:52,moisture:36,soilType:"Sandy",cropType:"Tobacco",nitrogen:0,potassium:20,phosphorous:20,fertilizer:"10-26-26"},
  {temp:31,humidity:65,moisture:50,soilType:"Red",cropType:"Barley",nitrogen:20,potassium:0,phosphorous:20,fertilizer:"28-28"},
  {temp:25,humidity:78,moisture:66,soilType:"Black",cropType:"Ground Nuts",nitrogen:7,potassium:9,phosphorous:30,fertilizer:"14-35-14"},
  {temp:34,humidity:55,moisture:38,soilType:"Loamy",cropType:"Oil seeds",nitrogen:22,potassium:30,phosphorous:15,fertilizer:"17-17-17"},
  {temp:22,humidity:85,moisture:76,soilType:"Alluvial",cropType:"Paddy",nitrogen:37,potassium:0,phosphorous:0,fertilizer:"Urea"},
  {temp:28,humidity:60,moisture:44,soilType:"Clayey",cropType:"Maize",nitrogen:12,potassium:36,phosphorous:6,fertilizer:"DAP"},
  {temp:37,humidity:38,moisture:18,soilType:"Sandy",cropType:"Millets",nitrogen:20,potassium:20,phosphorous:20,fertilizer:"NPK Mix"},
  {temp:24,humidity:70,moisture:55,soilType:"Red",cropType:"Sugarcane",nitrogen:0,potassium:20,phosphorous:20,fertilizer:"10-26-26"},
  {temp:30,humidity:48,moisture:28,soilType:"Black",cropType:"Cotton",nitrogen:20,potassium:0,phosphorous:20,fertilizer:"28-28"},
  {temp:26,humidity:75,moisture:62,soilType:"Loamy",cropType:"Pulses",nitrogen:7,potassium:9,phosphorous:30,fertilizer:"14-35-14"},
  {temp:33,humidity:62,moisture:46,soilType:"Alluvial",cropType:"Wheat",nitrogen:22,potassium:30,phosphorous:15,fertilizer:"17-17-17"},
  {temp:19,humidity:90,moisture:80,soilType:"Clayey",cropType:"Paddy",nitrogen:37,potassium:0,phosphorous:0,fertilizer:"Urea"},
  {temp:29,humidity:52,moisture:35,soilType:"Sandy",cropType:"Barley",nitrogen:12,potassium:36,phosphorous:6,fertilizer:"DAP"},
  {temp:32,humidity:68,moisture:52,soilType:"Red",cropType:"Ground Nuts",nitrogen:20,potassium:20,phosphorous:20,fertilizer:"20-20"},
];

export const SOIL_TYPES = ["Sandy","Loamy","Black","Red","Clayey","Alluvial"];
export const CROP_TYPES = ["Maize","Sugarcane","Cotton","Tobacco","Paddy","Barley","Wheat","Millets","Oil seeds","Pulses","Ground Nuts"];

export const CROP_NPK_TARGETS: Record<string, { n: number; p: number; k: number }> = {
  "Wheat":       { n: 120, p: 60,  k: 40  },
  "Paddy":       { n: 120, p: 60,  k: 60  },
  "Maize":       { n: 150, p: 75,  k: 75  },
  "Cotton":      { n: 100, p: 50,  k: 50  },
  "Sugarcane":   { n: 250, p: 100, k: 120 },
  "Ground Nuts": { n: 25,  p: 50,  k: 50  },
  "Pulses":      { n: 20,  p: 50,  k: 20  },
  "Millets":     { n: 60,  p: 30,  k: 30  },
  "Barley":      { n: 60,  p: 30,  k: 20  },
  "Oil seeds":   { n: 80,  p: 40,  k: 30  },
  "Tobacco":     { n: 90,  p: 40,  k: 60  },
};

const FERTILIZER_GRADES: Record<string, { n: number; p: number; k: number }> = {
  "Urea":     { n: 46, p: 0,  k: 0  },
  "DAP":      { n: 18, p: 46, k: 0  },
  "14-35-14": { n: 14, p: 35, k: 14 },
  "28-28":    { n: 28, p: 28, k: 0  },
  "17-17-17": { n: 17, p: 17, k: 17 },
  "20-20":    { n: 20, p: 20, k: 0  },
  "10-26-26": { n: 10, p: 26, k: 26 },
  "NPK Mix":  { n: 20, p: 20, k: 20 },
};

export type RecommendResult = {
  fertilizer: string;
  score: number;
  match: FertilizerRecord;
  deficits: { n: number; p: number; k: number };
  reason: string;
};

export function recommendFertilizer(input: Omit<FertilizerRecord,"fertilizer">): RecommendResult {
  const target = CROP_NPK_TARGETS[input.cropType] ?? { n: 100, p: 50, k: 50 };
  const deficits = {
    n: Math.max(0, target.n - input.nitrogen),
    p: Math.max(0, target.p - input.phosphorous),
    k: Math.max(0, target.k - input.potassium),
  };

  const totalDeficit = deficits.n + deficits.p + deficits.k;
  if (totalDeficit <= 10) {
    return makeResult("NPK Mix", 92, input, deficits, "NPK levels are close to the crop target, so only a light balanced maintenance dose is suggested.");
  }

  const neededRatio = {
    n: deficits.n / totalDeficit,
    p: deficits.p / totalDeficit,
    k: deficits.k / totalDeficit,
  };

  let bestName = "NPK Mix";
  let bestDistance = Infinity;

  for (const [name, grade] of Object.entries(FERTILIZER_GRADES)) {
    const gradeTotal = grade.n + grade.p + grade.k;
    const gradeRatio = {
      n: gradeTotal ? grade.n / gradeTotal : 0,
      p: gradeTotal ? grade.p / gradeTotal : 0,
      k: gradeTotal ? grade.k / gradeTotal : 0,
    };

    const missingPenalty =
      (deficits.n > 15 && grade.n === 0 ? 0.25 : 0) +
      (deficits.p > 15 && grade.p === 0 ? 0.25 : 0) +
      (deficits.k > 15 && grade.k === 0 ? 0.25 : 0);

    const excessPenalty =
      (deficits.n < 10 && grade.n > 25 ? 0.12 : 0) +
      (deficits.p < 10 && grade.p > 25 ? 0.12 : 0) +
      (deficits.k < 10 && grade.k > 15 ? 0.12 : 0);

    const distance = Math.sqrt(
      Math.pow(neededRatio.n - gradeRatio.n, 2) +
      Math.pow(neededRatio.p - gradeRatio.p, 2) +
      Math.pow(neededRatio.k - gradeRatio.k, 2)
    ) + missingPenalty + excessPenalty;

    if (distance < bestDistance) {
      bestDistance = distance;
      bestName = name;
    }
  }

  const score = Math.round(Math.max(55, Math.min(98, 100 - bestDistance * 80)));
  return makeResult(bestName, score, input, deficits, buildReason(bestName, deficits));
}

function makeResult(
  fertilizer: string,
  score: number,
  input: Omit<FertilizerRecord,"fertilizer">,
  deficits: { n: number; p: number; k: number },
  reason: string
): RecommendResult {
  return {
    fertilizer,
    score,
    deficits,
    reason,
    match: { ...input, fertilizer },
  };
}

function buildReason(fertilizer: string, deficits: { n: number; p: number; k: number }) {
  const needs = [
    deficits.n > 10 ? `nitrogen ${deficits.n} kg/acre` : "",
    deficits.p > 10 ? `phosphorus ${deficits.p} kg/acre` : "",
    deficits.k > 10 ? `potassium ${deficits.k} kg/acre` : "",
  ].filter(Boolean);
  return `${fertilizer} best matches the current nutrient gap: ${needs.join(", ") || "low nutrient deficit"}.`;
}
