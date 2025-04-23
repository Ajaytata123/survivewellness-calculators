
// Utility functions for wellness calculators

// BMI Calculator
export const calculateBMI = (weight: number, height: number, isMetric: boolean): number => {
  if (isMetric) {
    // Metric: weight in kg, height in cm
    return weight / Math.pow(height / 100, 2);
  } else {
    // Imperial: weight in pounds, height in inches
    return (weight * 703) / Math.pow(height, 2);
  }
};

export const getBMICategory = (bmi: number): { category: string; color: string } => {
  if (bmi < 18.5) {
    return { category: "Underweight", color: "text-blue-500" };
  } else if (bmi < 24.9) {
    return { category: "Normal weight", color: "text-green-500" };
  } else if (bmi < 29.9) {
    return { category: "Overweight", color: "text-yellow-500" };
  } else if (bmi < 34.9) {
    return { category: "Obesity (Class 1)", color: "text-orange-500" };
  } else if (bmi < 39.9) {
    return { category: "Obesity (Class 2)", color: "text-red-500" };
  } else {
    return { category: "Extreme Obesity (Class 3)", color: "text-red-700" };
  }
};

// BMR Calculator (Mifflin-St Jeor Equation)
export const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  gender: string,
  isMetric: boolean
): number => {
  let bmr = 0;
  
  // Convert imperial to metric if needed
  const weightKg = isMetric ? weight : weight * 0.453592;
  const heightCm = isMetric ? height : height * 2.54;
  
  if (gender === "male") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  
  return Math.round(bmr);
};

// Calculate daily calorie needs based on activity level
export const calculateCalorieNeeds = (bmr: number, activityLevel: string): number => {
  const activityMultipliers: { [key: string]: number } = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  
  return Math.round(bmr * activityMultipliers[activityLevel]);
};

// Ideal Weight Calculator (Devine Formula)
export const calculateIdealWeight = (height: number, gender: string, isMetric: boolean): number => {
  // Convert to inches if metric
  const heightInches = isMetric ? height / 2.54 : height;
  
  // Devine Formula
  if (gender === "male") {
    const idealKg = 50 + 2.3 * (heightInches - 60);
    return isMetric ? idealKg : Math.round(idealKg * 2.20462); // Convert to pounds if imperial
  } else {
    const idealKg = 45.5 + 2.3 * (heightInches - 60);
    return isMetric ? idealKg : Math.round(idealKg * 2.20462); // Convert to pounds if imperial
  }
};

// Body Fat Percentage Calculator (U.S. Navy Method)
export const calculateBodyFat = (
  gender: string,
  waist: number,
  neck: number,
  height: number,
  isMetric: boolean,
  hip?: number // Only used for women
): number => {
  // Convert to centimeters if imperial
  const waistCm = isMetric ? waist : waist * 2.54;
  const neckCm = isMetric ? neck : neck * 2.54;
  const heightCm = isMetric ? height : height * 2.54;
  const hipCm = hip && !isMetric ? hip * 2.54 : hip;
  
  let bodyFat = 0;
  
  if (gender === "male") {
    bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
  } else if (gender === "female" && hipCm) {
    bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
  }
  
  return Math.round(bodyFat * 10) / 10; // Round to 1 decimal place
};

// Heart Rate Zone Calculator
export const calculateMaxHeartRate = (age: number): number => {
  return 220 - age;
};

export const calculateHeartRateZones = (maxHR: number): { [key: string]: { min: number; max: number } } => {
  return {
    rest: { min: Math.round(maxHR * 0.5), max: Math.round(maxHR * 0.6) },
    warmup: { min: Math.round(maxHR * 0.6), max: Math.round(maxHR * 0.7) },
    fatBurn: { min: Math.round(maxHR * 0.7), max: Math.round(maxHR * 0.8) },
    aerobic: { min: Math.round(maxHR * 0.8), max: Math.round(maxHR * 0.9) },
    anaerobic: { min: Math.round(maxHR * 0.9), max: maxHR }
  };
};

// VO2 Max Calculator (Estimation based on Rockport Walking Test)
export const calculateVO2Max = (
  time: number, // in minutes
  heartRate: number, // bpm
  weight: number, // in kg
  age: number,
  gender: string,
  isMetric: boolean
): number => {
  // Convert pounds to kg if imperial
  const weightKg = isMetric ? weight : weight * 0.453592;
  
  let vo2Max = 0;
  const genderFactor = gender === "male" ? 1 : 0;
  
  // Simplified estimation
  vo2Max = 132.853 - (0.0769 * weightKg) - (0.3877 * age) + (6.315 * genderFactor) - (3.2649 * time) - (0.1565 * heartRate);
  
  return Math.round(vo2Max * 10) / 10; // Round to 1 decimal place
};

// Macronutrient Calculator
export const calculateMacros = (
  calories: number,
  goal: string // "weightloss", "maintenance", "musclegain"
): { protein: number; carbs: number; fat: number } => {
  let proteinRatio = 0;
  let fatRatio = 0;
  let carbsRatio = 0;
  
  switch (goal) {
    case "weightloss":
      proteinRatio = 0.4; // 40%
      fatRatio = 0.35; // 35%
      carbsRatio = 0.25; // 25%
      break;
    case "maintenance":
      proteinRatio = 0.3; // 30%
      fatRatio = 0.3; // 30%
      carbsRatio = 0.4; // 40%
      break;
    case "musclegain":
      proteinRatio = 0.3; // 30%
      fatRatio = 0.2; // 20%
      carbsRatio = 0.5; // 50%
      break;
    default:
      proteinRatio = 0.3;
      fatRatio = 0.3;
      carbsRatio = 0.4;
  }
  
  // Protein and carbs have 4 calories per gram, fat has 9
  const protein = Math.round((calories * proteinRatio) / 4);
  const carbs = Math.round((calories * carbsRatio) / 4);
  const fat = Math.round((calories * fatRatio) / 9);
  
  return { protein, carbs, fat };
};

// Water Intake Calculator
export const calculateWaterIntake = (
  weight: number,
  activityLevel: string,
  isMetric: boolean
): number => {
  // Convert pounds to kg if imperial
  const weightKg = isMetric ? weight : weight * 0.453592;
  
  // Base calculation: 30ml per kg of body weight
  let waterMl = weightKg * 30;
  
  // Adjust for activity level
  const activityMultipliers: { [key: string]: number } = {
    sedentary: 1,
    light: 1.1,
    moderate: 1.2,
    active: 1.3,
    veryActive: 1.4,
  };
  
  waterMl *= activityMultipliers[activityLevel];
  
  return Math.round(waterMl / 1000 * 10) / 10; // Convert to liters and round to 1 decimal place
};

// Pregnancy Weight Gain Calculator
export const calculatePregnancyWeightGain = (
  prePregnancyBMI: number,
  currentWeek: number
): { recommended: number; min: number; max: number } => {
  let totalRecommended = 0;
  let min = 0;
  let max = 0;
  
  // Calculate target total weight gain based on pre-pregnancy BMI
  if (prePregnancyBMI < 18.5) {
    // Underweight
    min = 12.5; // kg
    max = 18; // kg
  } else if (prePregnancyBMI < 25) {
    // Normal weight
    min = 11.5; // kg
    max = 16; // kg
  } else if (prePregnancyBMI < 30) {
    // Overweight
    min = 7; // kg
    max = 11.5; // kg
  } else {
    // Obese
    min = 5; // kg
    max = 9; // kg
  }
  
  totalRecommended = (min + max) / 2;
  
  // Calculate expected weight gain for current week (assuming 40 week pregnancy)
  // First trimester (weeks 1-12): About 1-2 kg total
  // Second and third trimesters: Steady weight gain
  
  let currentExpectedGain = 0;
  
  if (currentWeek <= 12) {
    // First trimester - gradual gain
    currentExpectedGain = (totalRecommended * 0.15) * (currentWeek / 12);
  } else {
    // Second and third trimesters - more steady gain
    const firstTrimesterGain = totalRecommended * 0.15;
    const remainingGain = totalRecommended - firstTrimesterGain;
    const remainingWeeks = 40 - 12;
    const weeklyGain = remainingGain / remainingWeeks;
    
    currentExpectedGain = firstTrimesterGain + (weeklyGain * (currentWeek - 12));
  }
  
  return {
    recommended: Math.round(currentExpectedGain * 10) / 10,
    min: Math.round((currentExpectedGain * min / totalRecommended) * 10) / 10,
    max: Math.round((currentExpectedGain * max / totalRecommended) * 10) / 10
  };
};

// Alcohol Impact Calculator
export const calculateAlcoholImpact = (
  drinksPerWeek: number,
  yearsOfDrinking: number,
  age: number
): { caloriesPerYear: number; liverImpact: string; healthRisk: string } => {
  // Average calories in a standard drink (beer/wine/spirits)
  const caloriesPerDrink = 150;
  const caloriesPerYear = drinksPerWeek * 52 * caloriesPerDrink;
  
  // Simple liver impact assessment
  let liverImpact = "Low";
  if (drinksPerWeek > 7 && drinksPerWeek <= 14) {
    liverImpact = "Moderate";
  } else if (drinksPerWeek > 14) {
    liverImpact = "High";
  }
  
  // Health risk assessment (simplified)
  let healthRisk = "Low";
  const lifetimeDrinks = drinksPerWeek * 52 * yearsOfDrinking;
  if (lifetimeDrinks > 10000 || (drinksPerWeek > 14 && yearsOfDrinking > 10)) {
    healthRisk = "High";
  } else if (lifetimeDrinks > 5000 || (drinksPerWeek > 7 && yearsOfDrinking > 5)) {
    healthRisk = "Moderate";
  }
  
  return { caloriesPerYear, liverImpact, healthRisk };
};

// Smoking Impact Calculator
export const calculateSmokingImpact = (
  cigarettesPerDay: number,
  yearsOfSmoking: number,
  age: number
): { packYears: number; lifeLostDays: number; moneyCost: number; healthRisk: string } => {
  // Calculate pack years (packs per day * years smoking)
  const packYears = (cigarettesPerDay / 20) * yearsOfSmoking;
  
  // Estimated life lost (very rough calculation - for educational purposes)
  // Based on estimate that each cigarette reduces life by ~11 minutes
  const lifeLostMinutes = cigarettesPerDay * 11 * 365 * yearsOfSmoking;
  const lifeLostDays = Math.round(lifeLostMinutes / (60 * 24));
  
  // Rough financial cost (assuming $8 per pack of 20 cigarettes)
  const costPerYear = (cigarettesPerDay / 20) * 8 * 365;
  const moneyCost = Math.round(costPerYear * yearsOfSmoking);
  
  // Health risk assessment (simplified)
  let healthRisk = "Low";
  if (packYears > 20) {
    healthRisk = "High";
  } else if (packYears > 10) {
    healthRisk = "Moderate";
  }
  
  return { packYears, lifeLostDays, moneyCost, healthRisk };
};
