
// Types for calculator components

// Common types
export type UnitSystem = "imperial" | "metric";

// BMI Calculator
export interface BMICalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (unitSystem: UnitSystem) => void;
}

export interface BMIResult {
  bmi: number;
  category: string;
  categoryColor: string;
}

// BMR Calculator
export interface BMRCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (unitSystem: UnitSystem) => void;
}

export interface BMRResult {
  bmr: number;
  calorieMaintenance: number;
  calorieWeightLoss: number;
  calorieWeightGain: number;
}

// Ideal Weight Calculator
export interface IdealWeightCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (unitSystem: UnitSystem) => void;
}

export interface IdealWeightResult {
  idealWeight: number;
  unit: string;
}

// Body Fat Calculator
export interface BodyFatCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (unitSystem: UnitSystem) => void;
}

export interface BodyFatResult {
  bodyFatPercentage: number;
  category: string;
}

// Heart Rate Zone Calculator
export interface HeartRateCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (unitSystem: UnitSystem) => void;
}

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
export interface VO2MaxCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (unitSystem: UnitSystem) => void;
}

export interface VO2MaxResult {
  vo2Max: number;
  fitnessLevel: string;
}

// Water Intake Calculator
export interface WaterIntakeCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (unitSystem: UnitSystem) => void;
}

export interface WaterIntakeResult {
  waterIntakeLiters: number;
  waterIntakeOz: number;
}

// Macronutrient Calculator
export interface MacroCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (unitSystem: UnitSystem) => void;
}

export interface MacroResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Pregnancy Weight Calculator
export interface PregnancyCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (unitSystem: UnitSystem) => void;
}

export interface PregnancyResult {
  recommendedGain: number;
  minGain: number;
  maxGain: number;
  unit: string;
}

// Alcohol Impact Calculator
export interface AlcoholCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (unitSystem: UnitSystem) => void;
}

export interface AlcoholResult {
  caloriesPerYear: number;
  liverImpact: string;
  healthRisk: string;
}

// Smoking Impact Calculator
export interface SmokingCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (unitSystem: UnitSystem) => void;
}

export interface SmokingResult {
  packYears: number;
  lifeLostDays: number;
  moneyCost: number;
  healthRisk: string;
}

// Download utilities
export interface ResultForDownload {
  title: string;
  results: Record<string, any>;
  date: string;
  unitSystem: UnitSystem;
}
