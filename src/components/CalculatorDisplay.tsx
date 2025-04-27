
import React from "react";
import { UnitSystem } from "@/types/calculatorTypes";

// Body Composition Calculators
import BMICalculator from "./calculators/BMICalculator";
import BMRCalculator from "./calculators/BMRCalculator";
import BodyFatCalculator from "./calculators/BodyFatCalculator";
import IdealWeightCalculator from "./calculators/IdealWeightCalculator";

// Fitness & Exercise Calculators
import HeartRateCalculator from "./calculators/HeartRateCalculator";
import VO2MaxCalculator from "./calculators/VO2MaxCalculator";
import WorkoutPlannerCalculator from "./calculators/WorkoutPlannerCalculator";
import StepCounterCalculator from "./calculators/StepCounterCalculator";

// Nutrition & Diet Calculators
import WaterIntakeCalculator from "./calculators/WaterIntakeCalculator";
import MacronutrientCalculator from "./calculators/MacroCalculator";
import CalorieTrackerCalculator from "./calculators/CalorieTrackerCalculator";
import IntermittentFastingCalculator from "./calculators/IntermittentFastingCalculator";

// Wellness & Lifestyle Calculators
import PregnancyWeightCalculator from "./calculators/PregnancyWeightCalculator";
import AlcoholImpactCalculator from "./calculators/AlcoholImpactCalculator";
import SmokingImpactCalculator from "./calculators/SmokingImpactCalculator";
import StressAnxietyCalculator from "./calculators/StressAnxietyCalculator";

interface CalculatorDisplayProps {
  activeCalculator: string;
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

// Added input validation helpers
export const validateInputRange = (
  value: number, 
  min: number, 
  max: number, 
  fieldName: string
): string | null => {
  if (value < min) return `${fieldName} must be at least ${min}`;
  if (value > max) return `${fieldName} must be less than ${max}`;
  return null;
};

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ 
  activeCalculator, 
  unitSystem, 
  onUnitSystemChange 
}) => {
  
  const renderCalculator = () => {
    switch (activeCalculator) {
      // Body Composition
      case "bmi":
        return <BMICalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "bmr":
        return <BMRCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "bodyfat":
        return <BodyFatCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "idealweight":
        return <IdealWeightCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      
      // Fitness & Exercise
      case "heartrate":
        return <HeartRateCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "vo2max":
        return <VO2MaxCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "workout":
        return <WorkoutPlannerCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "steps":
        return <StepCounterCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      
      // Nutrition & Diet
      case "macro":
        return <MacronutrientCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "water":
        return <WaterIntakeCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "fasting":
        return <IntermittentFastingCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "calories":
        return <CalorieTrackerCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      
      // Wellness & Lifestyle
      case "pregnancy":
        return <PregnancyWeightCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "alcohol":
        return <AlcoholImpactCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "smoking":
        return <SmokingImpactCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "stress":
        return <StressAnxietyCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      
      default:
        return <BMICalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
    }
  };

  return (
    <div className="calculator-container">
      {renderCalculator()}
    </div>
  );
};

export default CalculatorDisplay;
