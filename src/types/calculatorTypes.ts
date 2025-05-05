// Types for calculator components

// Common types
export type UnitSystem = "imperial" | "metric";

export interface BaseCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
  userName?: string;
}

// BMI Calculator
export interface BMICalcProps extends BaseCalcProps {}

export interface BMIResult {
  bmi: number;
  category: string;
  categoryColor: string;
}

// BMR Calculator
export interface BMRCalcProps extends BaseCalcProps {}

export interface BMRResult {
  bmr: number;
  calorieMaintenance: number;
  calorieWeightLoss: number;
  calorieWeightGain: number;
}

// Ideal Weight Calculator
export interface IdealWeightCalcProps extends BaseCalcProps {}

export interface IdealWeightResult {
  idealWeight: number;
  unit: string;
}

// Body Fat Calculator
export interface BodyFatCalcProps extends BaseCalcProps {}

export interface BodyFatResult {
  bodyFatPercentage: number;
  category: string;
}

// Heart Rate Zone Calculator
export interface HeartRateCalcProps extends BaseCalcProps {}

export interface HeartRateResult {
  maxHeartRate: number;
  zones: {
    [key: string]: {
      min: number;
      max: number;
    };
  };
}

// VO2 Max Calculator
export interface VO2MaxCalcProps extends BaseCalcProps {}

export interface VO2MaxResult {
  vo2Max: number;
  fitnessLevel: string;
}

// Workout Planner Calculator
export interface WorkoutPlannerCalcProps extends BaseCalcProps {}

export interface WorkoutPlannerResult {
  plan: string;
  daysPerWeek: number;
  focusAreas: string[];
}

// Step Counter Calculator
export interface StepCounterCalcProps extends BaseCalcProps {}

export interface StepCounterResult {
  steps: number;
  distance: number;
  calories: number;
}

// Water Intake Calculator
export interface WaterIntakeCalcProps extends BaseCalcProps {}

export interface WaterIntakeResult {
  waterIntakeLiters: number;
  waterIntakeOz: number;
  glassesOfWater: number;
}

// Macronutrient Calculator
export interface MacroCalcProps extends BaseCalcProps {}

export interface MacroResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Calorie Tracker Calculator
export interface CalorieTrackerCalcProps extends BaseCalcProps {}

export interface CalorieTrackerResult {
  consumed: number;
  burned: number;
  net: number;
}

// Intermittent Fasting Calculator
export interface IntermittentFastingCalcProps extends BaseCalcProps {}

export interface IntermittentFastingResult {
  fastingHours: number;
  eatingHours: number;
  startTime: string;
  endTime: string;
}

// Pregnancy Weight Calculator
export interface PregnancyCalcProps extends BaseCalcProps {}

export interface PregnancyResult {
  recommendedGain: number;
  minGain: number;
  maxGain: number;
  unit: string;
}

// Alcohol Impact Calculator
export interface AlcoholCalcProps extends BaseCalcProps {}

export interface AlcoholResult {
  caloriesPerYear: number;
  liverImpact: string;
  healthRisk: string;
}

// Smoking Impact Calculator
export interface SmokingCalcProps extends BaseCalcProps {}

export interface SmokingResult {
  packYears: number;
  lifeLostDays: number;
  moneyCost: number;
  healthRisk: string;
}

// Stress & Anxiety Calculator
export interface StressCalcProps extends BaseCalcProps {}

export interface StressResult {
  stressLevel: number;
  category: string;
  recommendations: string[];
}

// Age Calculator
export interface AgeCalcProps extends BaseCalcProps {}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthday: string;
  daysUntilNextBirthday: number;
}

// Obesity Risk Calculator
export interface ObesityRiskCalcProps extends BaseCalcProps {}

export interface ObesityRiskResult {
  bmi: number;
  bmiCategory: string;
  waistRisk: string;
  overallRisk: string;
  recommendations: string[];
}

// Meal Planner Calculator
export interface MealPlannerCalcProps extends BaseCalcProps {}

export interface MealPlannerResult {
  dailyCalories: number;
  meals: {
    name: string;
    caloriePct: number;
    calorieAmount: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    recommendations: string[];
  }[];
}

// Ovulation Calculator 
export interface OvulationCalcProps extends BaseCalcProps {}

export interface OvulationResult {
  cycleLength: number;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  ovulationDate: string;
  nextPeriodDate: string;
}

// Due Date Calculator
export interface DueDateCalcProps extends BaseCalcProps {}

export interface DueDateResult {
  dueDate: string;
  gestationalAge: {
    weeks: number;
    days: number;
  };
  trimester: number;
  milestones: {
    name: string;
    date: string;
    description: string;
  }[];
}

// Menopause Calculator
export interface MenopauseCalcProps extends BaseCalcProps {}

export interface MenopauseResult {
  estimatedAge: number;
  riskLevel: string;
  earlyMenopauseRisk: boolean;
  estimatedYear: number;
  recommendations: string[];
}

// Breast Cancer Risk Calculator
export interface BreastCancerRiskCalcProps extends BaseCalcProps {}

export interface BreastCancerRiskResult {
  lifetimeRisk: number;
  fiveYearRisk: number;
  riskCategory: string;
  recommendations: string[];
}

// Osteoporosis Risk Calculator
export interface OsteoporosisRiskCalcProps extends BaseCalcProps {}

export interface OsteoporosisRiskResult {
  riskScore: number;
  riskCategory: string;
  recommendations: string[];
}

// Iron Intake Calculator
export interface IronIntakeCalcProps extends BaseCalcProps {}

export interface IronIntakeResult {
  dailyNeed: number;
  currentIntake: number;
  deficitOrSurplus: number;
  recommendations: string[];
  foodSuggestions: {
    name: string;
    ironContent: number;
    servingSize: string;
  }[];
}

// Menstrual Cycle Calculator
export interface MenstrualCycleCalcProps extends BaseCalcProps {}

export interface MenstrualCycleResult {
  nextPeriod: string;
  ovulation: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  nextThreePeriods: string[];
}

// Download utilities
export interface ResultForDownload {
  title: string;
  results: Record<string, any>;
  date: string;
  unitSystem: UnitSystem;
  userName?: string;
}
