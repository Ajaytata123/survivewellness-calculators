import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UnitSystem } from "@/types/calculatorTypes";
import { Toaster } from "sonner";

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

type CalculatorCategory = "body" | "fitness" | "nutrition" | "wellness";

interface CalculatorInfo {
  id: string;
  name: string;
  color: string;
  category: CalculatorCategory;
}

const WellnessCalculatorHub: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<string>("bmi");
  const [activeCategory, setActiveCategory] = useState<string>("body");
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("imperial");
  const location = useLocation();
  const navigate = useNavigate();

  // Handle direct calculator access via URL
  useEffect(() => {
    const hash = location.hash.slice(1);
    if (hash) {
      const calculatorInfo = calculators.find(calc => calc.id === hash);
      if (calculatorInfo) {
        setActiveCalculator(hash);
        setActiveCategory(calculatorInfo.category);
      }
    }
  }, [location]);

  const handleUnitSystemChange = (system: UnitSystem) => {
    setUnitSystem(system);
  };

  const calculators: CalculatorInfo[] = [
    // Body Composition
    { id: "bmi", name: "BMI Calculator", color: "wellness-purple", category: "body" },
    { id: "bmr", name: "BMR & Calories", color: "wellness-blue", category: "body" },
    { id: "bodyfat", name: "Body Fat", color: "wellness-green", category: "body" },
    { id: "idealweight", name: "Ideal Weight", color: "wellness-orange", category: "body" },
    
    // Fitness & Exercise
    { id: "heartrate", name: "Heart Rate Zones", color: "wellness-red", category: "fitness" },
    { id: "vo2max", name: "VO2 Max", color: "wellness-blue", category: "fitness" },
    { id: "workout", name: "Workout Planner", color: "wellness-green", category: "fitness" },
    { id: "steps", name: "Step Counter", color: "wellness-purple", category: "fitness" },
    
    // Nutrition & Diet
    { id: "macro", name: "Macronutrients", color: "wellness-green", category: "nutrition" },
    { id: "water", name: "Water Intake", color: "wellness-blue", category: "nutrition" },
    { id: "fasting", name: "Intermittent Fasting", color: "wellness-orange", category: "nutrition" },
    { id: "calories", name: "Calorie Tracker", color: "wellness-purple", category: "nutrition" },
    
    // Wellness & Lifestyle
    { id: "pregnancy", name: "Pregnancy Weight", color: "wellness-pink", category: "wellness" },
    { id: "alcohol", name: "Alcohol Impact", color: "wellness-red", category: "wellness" },
    { id: "smoking", name: "Smoking Impact", color: "wellness-orange", category: "wellness" },
    { id: "stress", name: "Stress & Anxiety", color: "wellness-purple", category: "wellness" },
  ];

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    const firstCalcInCategory = calculators.find(calc => calc.category === category);
    if (firstCalcInCategory) {
      setActiveCalculator(firstCalcInCategory.id);
      navigate(`#${firstCalcInCategory.id}`);
    }
  };

  const handleCalculatorClick = (calculatorId: string) => {
    setActiveCalculator(calculatorId);
    navigate(`#${calculatorId}`);
  };

  const renderCalculatorButtons = (category: string) => {
    return calculators
      .filter(calc => calc.category === category)
      .map(calculator => (
        <button
          key={calculator.id}
          className={`p-3 rounded-lg transition-all ${
            activeCalculator === calculator.id
              ? `bg-${calculator.color} text-white shadow-md`
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => handleCalculatorClick(calculator.id)}
        >
          {calculator.name}
        </button>
      ));
  };

  const renderActiveCalculator = () => {
    switch (activeCalculator) {
      // Body Composition
      case "bmi":
        return <BMICalculator unitSystem={unitSystem} onUnitSystemChange={handleUnitSystemChange} />;
      case "bmr":
        return <BMRCalculator unitSystem={unitSystem} onUnitSystemChange={handleUnitSystemChange} />;
      case "bodyfat":
        return <BodyFatCalculator unitSystem={unitSystem} onUnitSystemChange={handleUnitSystemChange} />;
      case "idealweight":
        return <IdealWeightCalculator unitSystem={unitSystem} onUnitSystemChange={handleUnitSystemChange} />;
      
      // Fitness & Exercise
      case "heartrate":
        return <HeartRateCalculator unitSystem={unitSystem} onUnitSystemChange={handleUnitSystemChange} />;
      case "vo2max":
        return <VO2MaxCalculator unitSystem={unitSystem} onUnitSystemChange={handleUnitSystemChange} />;
      case "workout":
        return <WorkoutPlannerCalculator unitSystem={unitSystem} onUnitSystemChange={handleUnitSystemChange} />;
      case "steps":
        return <StepCounterCalculator unitSystem={unitSystem} onUnitSystemChange={handleUnitSystemChange} />;
      
      // Nutrition & Diet
      case "macro":
        return <MacronutrientCalculator unitSystem={unitSystem} onUnitSystemChange={handleUnitSystemChange} />;
      case "water":
        return <WaterIntakeCalculator unitSystem={unitSystem} onUnitSystemChange={handleUnitSystemChange} />;
      case "fasting":
        return <IntermittentFastingCalculator unitSystem={unitSystem} onUnitSystemChange={handleUnitSystemChange} />;
      case "calories":
        return <CalorieTrackerCalculator unitSystem={unitSystem} onUnitSystemChange={handleUnitSystemChange} />;
      
      // Wellness & Lifestyle
      case "pregnancy":
        return <PregnancyWeightCalculator unitSystem={unitSystem} onUnitSystemChange={handleUnitSystemChange} />;
      case "alcohol":
        return <AlcoholImpactCalculator unitSystem={unitSystem} onUnitSystemChange={handleUnitSystemChange} />;
      case "smoking":
        return <SmokingImpactCalculator unitSystem={unitSystem} onUnitSystemChange={handleUnitSystemChange} />;
      case "stress":
        return <StressAnxietyCalculator unitSystem={unitSystem} onUnitSystemChange={handleUnitSystemChange} />;
      
      default:
        return <BMICalculator unitSystem={unitSystem} onUnitSystemChange={handleUnitSystemChange} />;
    }
  };

  return (
    <div className="calculator-hub-container mx-auto p-2 sm:p-4 max-w-4xl">
      <div className="text-center space-y-2 mb-6 sm:mb-8 px-3 sm:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-wellness-purple">
          Survivewellness Calculator Hub
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          Explore our professional health and wellness calculators to track your fitness progress
        </p>
      </div>

      {/* Main Category Buttons - Improved Mobile Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <button 
          onClick={() => handleCategoryClick('body')}
          className={`p-2 sm:p-3 md:p-4 ${
            activeCategory === 'body' ? 'bg-wellness-purple' : 'bg-wellness-purple/80'
          } text-white rounded-lg hover:bg-wellness-purple/90 transition-colors text-xs sm:text-sm md:text-base font-medium`}
        >
          Body Composition
        </button>
        <button 
          onClick={() => handleCategoryClick('fitness')}
          className={`p-2 sm:p-3 md:p-4 ${
            activeCategory === 'fitness' ? 'bg-wellness-blue' : 'bg-wellness-blue/80'
          } text-white rounded-lg hover:bg-wellness-blue/90 transition-colors text-xs sm:text-sm md:text-base font-medium`}
        >
          Fitness & Exercise
        </button>
        <button 
          onClick={() => handleCategoryClick('nutrition')}
          className={`p-2 sm:p-3 md:p-4 ${
            activeCategory === 'nutrition' ? 'bg-wellness-green' : 'bg-wellness-green/80'
          } text-white rounded-lg hover:bg-wellness-green/90 transition-colors text-xs sm:text-sm md:text-base font-medium`}
        >
          Nutrition & Diet
        </button>
        <button 
          onClick={() => handleCategoryClick('wellness')}
          className={`p-2 sm:p-3 md:p-4 ${
            activeCategory === 'wellness' ? 'bg-wellness-orange' : 'bg-wellness-orange/80'
          } text-white rounded-lg hover:bg-wellness-orange/90 transition-colors text-xs sm:text-sm md:text-base font-medium`}
        >
          Wellness & Lifestyle
        </button>
      </div>

      {/* Sub-calculator buttons with improved mobile styling */}
      <div className="mb-4 sm:mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
          {renderCalculatorButtons(activeCategory)}
        </div>
      </div>

      <div className="calculator-container">
        {renderActiveCalculator()}
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
};

export default WellnessCalculatorHub;
