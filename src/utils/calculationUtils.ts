// BMI Calculations
export const calculateBMI = (weight: number, height: number, isMetric: boolean): number => {
  let bmi: number;
  if (isMetric) {
    bmi = weight / (height / 100) ** 2;
  } else {
    bmi = (weight / height ** 2) * 703;
  }
  return bmi;
};

export const getBMICategory = (bmi: number): { category: string; color: string } => {
  if (bmi < 18.5) {
    return { category: "Underweight", color: "text-wellness-orange" };
  } else if (bmi < 25) {
    return { category: "Normal weight", color: "text-wellness-green" };
  } else if (bmi < 30) {
    return { category: "Overweight", color: "text-wellness-orange" };
  } else if (bmi < 35) {
    return { category: "Obesity (Class 1)", color: "text-wellness-red" };
  } else if (bmi < 40) {
    return { category: "Obesity (Class 2)", color: "text-wellness-red" };
  } else {
    return { category: "Extreme Obesity (Class 3)", color: "text-wellness-dark" };
  }
};

// BMR Calculations
export const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  gender: "male" | "female",
  isMetric: boolean
): number => {
  // Mifflin-St Jeor Equation
  let bmr: number;
  if (gender === "male") {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }

  if (!isMetric) {
    // Convert weight from pounds to kg
    weight = weight * 0.453592;
    // Convert height from inches to cm
    height = height * 2.54;

    if (gender === "male") {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
  }

  return Math.round(bmr);
};

export const calculateCalorieNeeds = (bmr: number, activity: string): number => {
  let activityFactor: number;

  switch (activity) {
    case "sedentary":
      activityFactor = 1.2;
      break;
    case "light":
      activityFactor = 1.375;
      break;
    case "moderate":
      activityFactor = 1.55;
      break;
    case "active":
      activityFactor = 1.725;
      break;
    case "veryActive":
      activityFactor = 1.9;
      break;
    default:
      activityFactor = 1.2;
  }

  return Math.round(bmr * activityFactor);
};

// Body Fat Calculations
export const calculateBodyFat = (
  gender: string,
  waist: number,
  neck: number,
  height: number,
  isMetric: boolean,
  hip?: number
): number => {
  let bodyFatPercentage: number;

  if (!isMetric) {
    // Convert measurements to metric if using imperial units
    waist = waist * 2.54;
    neck = neck * 2.54;
    height = height * 2.54;
    if (hip) {
      hip = hip * 2.54;
    }
  }

  if (gender === "male") {
    bodyFatPercentage =
      495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
  } else {
    if (!hip) {
      return 0; // Hip measurement is required for females
    }
    bodyFatPercentage =
      495 /
        (1.29579 -
          0.35004 * Math.log10(waist + hip - neck) +
          0.221 * Math.log10(height)) -
      450;
  }

  return Math.round(bodyFatPercentage * 10) / 10;
};

// Heart Rate Calculations
export const calculateMaxHeartRate = (age: number): number => {
  // Tanaka formula: HRmax = 208 - (0.7 * age)
  return Math.round(208 - (0.7 * age));
};

export const calculateHeartRateZones = (
  maxHR: number,
  restingHR?: number
): Record<string, { min: number; max: number }> => {
  const zones: Record<string, { min: number; max: number }> = {};
  
  if (restingHR) {
    // Karvonen formula (with resting heart rate)
    const hrReserve = maxHR - restingHR;
    
    zones.recovery = {
      min: Math.round(restingHR + (hrReserve * 0.5)),
      max: Math.round(restingHR + (hrReserve * 0.6))
    };
    zones.aerobic = {
      min: zones.recovery.max + 1,
      max: Math.round(restingHR + (hrReserve * 0.7))
    };
    zones.tempo = {
      min: zones.aerobic.max + 1,
      max: Math.round(restingHR + (hrReserve * 0.8))
    };
    zones.threshold = {
      min: zones.tempo.max + 1,
      max: Math.round(restingHR + (hrReserve * 0.9))
    };
    zones.anaerobic = {
      min: zones.threshold.max + 1,
      max: Math.round(restingHR + (hrReserve * 0.95))
    };
    zones.maximal = {
      min: zones.anaerobic.max + 1,
      max: maxHR
    };
  } else {
    // Percentage of max HR (without resting heart rate)
    zones.recovery = {
      min: Math.round(maxHR * 0.5),
      max: Math.round(maxHR * 0.6)
    };
    zones.aerobic = {
      min: zones.recovery.max + 1,
      max: Math.round(maxHR * 0.7)
    };
    zones.tempo = {
      min: zones.aerobic.max + 1,
      max: Math.round(maxHR * 0.8)
    };
    zones.threshold = {
      min: zones.tempo.max + 1,
      max: Math.round(maxHR * 0.9)
    };
    zones.anaerobic = {
      min: zones.threshold.max + 1,
      max: Math.round(maxHR * 0.95)
    };
    zones.maximal = {
      min: zones.anaerobic.max + 1,
      max: maxHR
    };
  }
  
  return zones;
};

// Ideal Weight Calculations
export const calculateIdealWeight = (
  height: number,
  gender: "male" | "female",
  isMetric: boolean
): number => {
  let idealWeight: number;
  
  // Convert height to cm for metric calculations or inches for imperial
  const heightInCm = isMetric ? height : height * 2.54;
  const heightInInches = isMetric ? height / 2.54 : height;
  
  // Modified Devine Formula
  if (gender === "male") {
    // For males: IBW = 50 kg + 2.3 kg for each inch over 5 feet
    idealWeight = 50 + 2.3 * (heightInInches - 60);
  } else {
    // For females: IBW = 45.5 kg + 2.3 kg for each inch over 5 feet
    idealWeight = 45.5 + 2.3 * (heightInInches - 60);
  }
  
  // Convert to pounds if using imperial
  if (!isMetric) {
    idealWeight = idealWeight * 2.20462;
  }
  
  return Math.round(idealWeight * 10) / 10;
};

// Water Intake Calculations
export const calculateWaterIntake = (
  weight: number,
  activityLevel: string,
  climate: string,
  isMetric: boolean
): { liters: number; ounces: number; glasses: number } => {
  // Convert weight to kg if using imperial
  const weightInKg = isMetric ? weight : weight / 2.20462;
  
  // Base calculation: ~33ml per kg of body weight
  let waterInLiters = (weightInKg * 0.033);
  
  // Adjust for activity level
  switch (activityLevel) {
    case "sedentary":
      waterInLiters *= 0.8;
      break;
    case "light":
      waterInLiters *= 0.9;
      break;
    case "moderate":
      // Default value, no adjustment
      break;
    case "active":
      waterInLiters *= 1.1;
      break;
    case "veryActive":
      waterInLiters *= 1.2;
      break;
  }
  
  // Adjust for climate
  switch (climate) {
    case "cold":
      waterInLiters *= 0.9;
      break;
    case "temperate":
      // Default value, no adjustment
      break;
    case "hot":
      waterInLiters *= 1.1;
      break;
    case "veryHot":
      waterInLiters *= 1.2;
      break;
  }
  
  // Calculate ounces and glasses (standard 8oz glass)
  const waterInOunces = waterInLiters * 33.814;
  const glasses = waterInOunces / 8;

  // Round to reasonable values
  return {
    liters: Math.round(waterInLiters * 100) / 100,
    ounces: Math.round(waterInOunces),
    glasses: Math.round(glasses)
  };
};

// VO2 Max Calculations
export const calculateVO2Max = (
  time: number, // in minutes
  distance: number, // in km or miles
  heartRate: number,
  age: number,
  gender: "male" | "female",
  isMetric: boolean
): number => {
  // Convert distance to meters if metric, or to meters from miles if imperial
  const distanceInMeters = isMetric ? distance * 1000 : distance * 1609.34;
  
  // Calculate running speed in meters per minute
  const speedMeterPerMin = distanceInMeters / time;
  
  // Calculate VO2 Max using modified Cooper formula
  let vo2Max = (0.02 * speedMeterPerMin) + 3.5;
  
  // Adjust for age and gender
  const ageFactor = Math.max(0, (age - 20) * 0.2);
  vo2Max = vo2Max - ageFactor;
  
  if (gender === "female") {
    vo2Max = vo2Max * 0.9;
  }
  
  // Heart rate adjustment - higher heart rates typically indicate lower efficiency
  const hrAdjustment = Math.max(0, (heartRate - 180) * 0.05);
  vo2Max = vo2Max - hrAdjustment;
  
  return Math.round(vo2Max * 10) / 10;
};

export const getVO2MaxCategory = (vo2Max: number, gender: "male" | "female", age: number): string => {
  if (gender === "male") {
    if (age < 30) {
      if (vo2Max >= 55) return "Excellent";
      if (vo2Max >= 45) return "Good";
      if (vo2Max >= 35) return "Average";
      if (vo2Max >= 25) return "Fair";
      return "Poor";
    } else if (age < 40) {
      if (vo2Max >= 50) return "Excellent";
      if (vo2Max >= 40) return "Good";
      if (vo2Max >= 35) return "Average";
      if (vo2Max >= 25) return "Fair";
      return "Poor";
    } else if (age < 50) {
      if (vo2Max >= 45) return "Excellent";
      if (vo2Max >= 35) return "Good";
      if (vo2Max >= 30) return "Average";
      if (vo2Max >= 25) return "Fair";
      return "Poor";
    } else {
      if (vo2Max >= 40) return "Excellent";
      if (vo2Max >= 30) return "Good";
      if (vo2Max >= 25) return "Average";
      if (vo2Max >= 20) return "Fair";
      return "Poor";
    }
  } else {
    if (age < 30) {
      if (vo2Max >= 50) return "Excellent";
      if (vo2Max >= 40) return "Good";
      if (vo2Max >= 35) return "Average";
      if (vo2Max >= 25) return "Fair";
      return "Poor";
    } else if (age < 40) {
      if (vo2Max >= 45) return "Excellent";
      if (vo2Max >= 35) return "Good";
      if (vo2Max >= 30) return "Average";
      if (vo2Max >= 20) return "Fair";
      return "Poor";
    } else if (age < 50) {
      if (vo2Max >= 40) return "Excellent";
      if (vo2Max >= 30) return "Good";
      if (vo2Max >= 25) return "Average";
      if (vo2Max >= 20) return "Fair";
      return "Poor";
    } else {
      if (vo2Max >= 35) return "Excellent";
      if (vo2Max >= 25) return "Good";
      if (vo2Max >= 20) return "Average";
      if (vo2Max >= 15) return "Fair";
      return "Poor";
    }
  }
};

// Pregnancy Weight Gain Calculations
export const calculatePregnancyWeightGain = (
  prePregnancyBMI: number,
  isMultiples: boolean
): { min: number; max: number; recommended: number; unit: string } => {
  let minGain: number;
  let maxGain: number;
  
  if (isMultiples) {
    // Twins or more
    if (prePregnancyBMI < 18.5) {
      minGain = 25;
      maxGain = 45;
    } else if (prePregnancyBMI < 25) {
      minGain = 37;
      maxGain = 54;
    } else if (prePregnancyBMI < 30) {
      minGain = 31;
      maxGain = 50;
    } else {
      minGain = 25;
      maxGain = 42;
    }
  } else {
    // Singleton pregnancy
    if (prePregnancyBMI < 18.5) {
      minGain = 28;
      maxGain = 40;
    } else if (prePregnancyBMI < 25) {
      minGain = 25;
      maxGain = 35;
    } else if (prePregnancyBMI < 30) {
      minGain = 15;
      maxGain = 25;
    } else {
      minGain = 11;
      maxGain = 20;
    }
  }
  
  // Calculate recommended value as the midpoint
  const recommended = Math.round((minGain + maxGain) / 2);
  
  return {
    min: minGain,
    max: maxGain,
    recommended,
    unit: "lbs"  // All pregnancy weight ranges typically given in pounds
  };
};

// Alcohol Impact Calculations
export const calculateAlcoholImpact = (
  drinksPerWeek: number,
  years: number,
  weightKg: number,
  gender: "male" | "female"
): { caloriesPerYear: number; liverImpact: string; healthRisk: string } => {
  // Average calories per standard alcoholic drink
  const caloriesPerDrink = 150;
  const drinksPerYear = drinksPerWeek * 52;
  const caloriesPerYear = drinksPerYear * caloriesPerDrink;
  
  // Determine health risk
  let healthRisk: string;
  if (gender === "male") {
    if (drinksPerWeek <= 7) {
      healthRisk = "Low";
    } else if (drinksPerWeek <= 14) {
      healthRisk = "Moderate";
    } else if (drinksPerWeek <= 21) {
      healthRisk = "High";
    } else {
      healthRisk = "Severe";
    }
  } else {
    if (drinksPerWeek <= 4) {
      healthRisk = "Low";
    } else if (drinksPerWeek <= 7) {
      healthRisk = "Moderate";
    } else if (drinksPerWeek <= 14) {
      healthRisk = "High";
    } else {
      healthRisk = "Severe";
    }
  }
  
  // Determine liver impact based on drinking volume and duration
  let liverImpact: string;
  const lifetimeDrinks = drinksPerWeek * 52 * years;
  
  if (lifetimeDrinks < 500) {
    liverImpact = "Minimal";
  } else if (lifetimeDrinks < 2000) {
    liverImpact = "Mild";
  } else if (lifetimeDrinks < 5000) {
    liverImpact = "Moderate";
  } else if (lifetimeDrinks < 10000) {
    liverImpact = "Significant";
  } else {
    liverImpact = "Severe";
  }
  
  return {
    caloriesPerYear,
    liverImpact,
    healthRisk
  };
};

// Smoking Impact Calculations
export const calculateSmokingImpact = (
  cigarettesPerDay: number,
  years: number,
  pricePerPack: number
): { packYears: number; lifeLostDays: number; moneyCost: number; healthRisk: string } => {
  // Calculate pack years (packs per day × years smoked)
  const packsPerDay = cigarettesPerDay / 20; // Assuming 20 cigarettes per pack
  const packYears = packsPerDay * years;
  
  // Calculate life expectancy impact
  // Estimated 11 minutes of life lost per cigarette
  const lifeLostMinutes = cigarettesPerDay * 365 * years * 11;
  const lifeLostDays = Math.round(lifeLostMinutes / (60 * 24));
  
  // Calculate financial cost
  const packsPerYear = packsPerDay * 365;
  const moneyCost = packsPerYear * pricePerPack * years;
  
  // Determine health risk
  let healthRisk: string;
  if (packYears < 10) {
    healthRisk = "Moderate";
  } else if (packYears < 20) {
    healthRisk = "High";
  } else if (packYears < 40) {
    healthRisk = "Very High";
  } else {
    healthRisk = "Severe";
  }
  
  return {
    packYears: Math.round(packYears * 10) / 10,
    lifeLostDays,
    moneyCost: Math.round(moneyCost),
    healthRisk
  };
};

// Macronutrient Calculations
export const calculateMacros = (
  weight: number,
  height: number,
  age: number,
  gender: "male" | "female",
  activityLevel: string,
  goal: string,
  isMetric: boolean
): { calories: number; protein: number; carbs: number; fat: number } => {
  // Convert to metric if needed
  const weightKg = isMetric ? weight : weight / 2.20462;
  const heightCm = isMetric ? height : height * 2.54;
  
  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr: number;
  if (gender === "male") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  
  // Calculate TDEE (Total Daily Energy Expenditure)
  let activityMultiplier: number;
  switch (activityLevel) {
    case "sedentary":
      activityMultiplier = 1.2;
      break;
    case "light":
      activityMultiplier = 1.375;
      break;
    case "moderate":
      activityMultiplier = 1.55;
      break;
    case "active":
      activityMultiplier = 1.725;
      break;
    case "veryActive":
      activityMultiplier = 1.9;
      break;
    default:
      activityMultiplier = 1.2;
  }
  
  let tdee = bmr * activityMultiplier;
  
  // Adjust based on goal
  let goalCalories: number;
  let proteinRatio: number;
  let carbRatio: number;
  let fatRatio: number;
  
  switch (goal) {
    case "lose":
      goalCalories = tdee * 0.8; // 20% deficit
      proteinRatio = 0.35; // Higher protein for weight loss
      carbRatio = 0.35;
      fatRatio = 0.3;
      break;
    case "maintain":
      goalCalories = tdee;
      proteinRatio = 0.3;
      carbRatio = 0.4;
      fatRatio = 0.3;
      break;
    case "gain":
      goalCalories = tdee * 1.1; // 10% surplus
      proteinRatio = 0.25;
      carbRatio = 0.45;
      fatRatio = 0.3;
      break;
    case "gainMuscle":
      goalCalories = tdee * 1.15; // 15% surplus
      proteinRatio = 0.3;
      carbRatio = 0.45;
      fatRatio = 0.25;
      break;
    default:
      goalCalories = tdee;
      proteinRatio = 0.3;
      carbRatio = 0.4;
      fatRatio = 0.3;
  }
  
  // Calculate macros in grams
  // Protein and carbs = 4 calories per gram, fat = 9 calories per gram
  const protein = Math.round((goalCalories * proteinRatio) / 4);
  const carbs = Math.round((goalCalories * carbRatio) / 4);
  const fat = Math.round((goalCalories * fatRatio) / 9);
  
  return {
    calories: Math.round(goalCalories),
    protein,
    carbs,
    fat
  };
};

// Stress Level Calculations
export const calculateStressLevel = (
  answers: number[]
): { score: number; category: string; recommendations: string[] } => {
  // Sum up stress scores
  const score = answers.reduce((sum, value) => sum + value, 0);
  
  // Determine stress category
  let category: string;
  let recommendations: string[] = [];
  
  if (score <= 10) {
    category = "Low Stress";
    recommendations = [
      "Maintain your healthy coping strategies",
      "Continue with regular exercise",
      "Practice mindfulness for general well-being",
      "Ensure consistent sleep schedule"
    ];
  } else if (score <= 20) {
    category = "Moderate Stress";
    recommendations = [
      "Consider adding 10-minute meditation sessions",
      "Ensure you're getting adequate sleep",
      "Add more physical activity to your routine",
      "Practice deep breathing exercises when feeling tense"
    ];
  } else if (score <= 30) {
    category = "High Stress";
    recommendations = [
      "Prioritize stress-reducing activities daily",
      "Consider talking to a friend or counselor",
      "Evaluate work-life balance",
      "Try guided meditation apps or programs",
      "Ensure you're getting proper nutrition"
    ];
  } else {
    category = "Severe Stress";
    recommendations = [
      "Consider consulting a healthcare professional",
      "Prioritize self-care activities",
      "Evaluate sources of stress and create an action plan",
      "Implement regular meditation and deep breathing",
      "Consider cognitive behavioral techniques",
      "Ensure adequate sleep and nutrition"
    ];
  }
  
  return {
    score,
    category,
    recommendations
  };
};
