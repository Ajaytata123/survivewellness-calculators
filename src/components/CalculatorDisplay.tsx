
import React, { useRef, useEffect } from "react";
import { UnitSystem } from "@/types/calculatorTypes";

// Calculators
import BMICalculator from "@/components/calculators/BMICalculator";
import BMRCalculator from "@/components/calculators/BMRCalculator";
import BodyFatCalculator from "@/components/calculators/BodyFatCalculator";
import IdealWeightCalculator from "@/components/calculators/IdealWeightCalculator";
import HeartRateCalculator from "@/components/calculators/HeartRateCalculator";
import VO2MaxCalculator from "@/components/calculators/VO2MaxCalculator";
import WorkoutPlannerCalculator from "@/components/calculators/WorkoutPlannerCalculator";
import StepCounterCalculator from "@/components/calculators/StepCounterCalculator";
import WaterIntakeCalculator from "@/components/calculators/WaterIntakeCalculator";
import MacronutrientCalculator from "@/components/calculators/MacronutrientCalculator";
import CalorieTrackerCalculator from "@/components/calculators/CalorieTrackerCalculator";
import IntermittentFastingCalculator from "@/components/calculators/IntermittentFastingCalculator";
import PregnancyWeightCalculator from "@/components/calculators/PregnancyWeightCalculator";
import AlcoholImpactCalculator from "@/components/calculators/AlcoholImpactCalculator";
import SmokingImpactCalculator from "@/components/calculators/SmokingImpactCalculator";
import StressAnxietyCalculator from "@/components/calculators/StressAnxietyCalculator";
import AgeCalculator from "@/components/calculators/AgeCalculator";
import ObesityRiskCalculator from "@/components/calculators/ObesityRiskCalculator";
import MealPlannerCalculator from "@/components/calculators/MealPlannerCalculator";
import OvulationCalculator from "@/components/calculators/OvulationCalculator";
import DueDateCalculator from "@/components/calculators/DueDateCalculator";
import PeriodCalculator from "@/components/calculators/PeriodCalculator"; // Renamed from MenstrualCycleCalculator
import MenopauseCalculator from "@/components/calculators/MenopauseCalculator";
import BreastCancerRiskCalculator from "@/components/calculators/BreastCancerRiskCalculator";
import OsteoporosisRiskCalculator from "@/components/calculators/OsteoporosisRiskCalculator";
import IronIntakeCalculator from "@/components/calculators/IronIntakeCalculator";

interface CalculatorDisplayProps {
  activeCalculator: string;
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  activeCalculator,
  unitSystem,
  onUnitSystemChange,
}) => {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const prevCalculatorId = useRef<string>(activeCalculator);

  // When calculator changes, we want to maintain scroll position instead of jumping to top
  useEffect(() => {
    if (prevCalculatorId.current !== activeCalculator) {
      prevCalculatorId.current = activeCalculator;
      // Don't scroll to top when changing calculators
      // We'll let the browser maintain its scroll position
    }
  }, [activeCalculator]);

  const renderCalculator = () => {
    switch (activeCalculator) {
      case "bmi":
        return <BMICalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "bmr":
        return <BMRCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "bodyfat":
        return <BodyFatCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "idealweight":
        return <IdealWeightCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "heartrate":
        return <HeartRateCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "vo2max":
        return <VO2MaxCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "workout":
        return <WorkoutPlannerCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "steps":
        return <StepCounterCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "water":
        return <WaterIntakeCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "macro":
        return <MacronutrientCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "calories":
        return <CalorieTrackerCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "fasting":
        return <IntermittentFastingCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "pregnancy":
        return <PregnancyWeightCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "alcohol":
        return <AlcoholImpactCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "smoking":
        return <SmokingImpactCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "stress":
        return <StressAnxietyCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "age":
        return <AgeCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "obesity":
        return <ObesityRiskCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "mealplan":
        return <MealPlannerCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "ovulation":
        return <OvulationCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "duedate":
        return <DueDateCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "menstrual":
        return <PeriodCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "menopause":
        return <MenopauseCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "breastcancer":
        return <BreastCancerRiskCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "osteoporosis":
        return <OsteoporosisRiskCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      case "iron":
        return <IronIntakeCalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
      default:
        return <BMICalculator unitSystem={unitSystem} onUnitSystemChange={onUnitSystemChange} />;
    }
  };

  return <div ref={calculatorRef}>{renderCalculator()}</div>;
};

export default CalculatorDisplay;
