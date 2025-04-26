import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import MacronutrientCalculator from "./calculators/MacronutrientCalculator";
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
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("imperial");

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

  const renderCalculatorButtons = (category: CalculatorCategory) => {
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
          onClick={() => setActiveCalculator(calculator.id)}
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

  // Add direct navigation function
  const scrollToCalculator = (calculatorId: string) => {
    const element = document.getElementById(calculatorId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="calculator-hub-container container mx-auto p-4 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-2 text-wellness-purple">
        Survivewellness Calculator Hub
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Explore our health and wellness calculators to track your fitness progress
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button 
          onClick={() => scrollToCalculator('body')}
          className="p-4 bg-wellness-purple text-white rounded-lg hover:bg-wellness-purple/90 transition-colors"
        >
          Body Composition
        </button>
        <button 
          onClick={() => scrollToCalculator('fitness')}
          className="p-4 bg-wellness-blue text-white rounded-lg hover:bg-wellness-blue/90 transition-colors"
        >
          Fitness & Exercise
        </button>
        <button 
          onClick={() => scrollToCalculator('nutrition')}
          className="p-4 bg-wellness-green text-white rounded-lg hover:bg-wellness-green/90 transition-colors"
        >
          Nutrition & Diet
        </button>
        <button 
          onClick={() => scrollToCalculator('wellness')}
          className="p-4 bg-wellness-orange text-white rounded-lg hover:bg-wellness-orange/90 transition-colors"
        >
          Wellness & Lifestyle
        </button>
      </div>

      <div className="mb-8">
        <Tabs defaultValue="body" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="body" id="body">Body Composition</TabsTrigger>
            <TabsTrigger value="fitness" id="fitness">Fitness & Exercise</TabsTrigger>
            <TabsTrigger value="nutrition" id="nutrition">Nutrition & Diet</TabsTrigger>
            <TabsTrigger value="wellness" id="wellness">Wellness & Lifestyle</TabsTrigger>
          </TabsList>
          
          <TabsContent value="body">
            <h2 className="text-xl font-semibold mb-4">Body Composition Calculators</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {renderCalculatorButtons("body")}
            </div>
          </TabsContent>
          
          <TabsContent value="fitness">
            <h2 className="text-xl font-semibold mb-4">Fitness & Exercise Calculators</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {renderCalculatorButtons("fitness")}
            </div>
          </TabsContent>
          
          <TabsContent value="nutrition">
            <h2 className="text-xl font-semibold mb-4">Nutrition & Diet Calculators</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {renderCalculatorButtons("nutrition")}
            </div>
          </TabsContent>
          
          <TabsContent value="wellness">
            <h2 className="text-xl font-semibold mb-4">Wellness & Lifestyle Calculators</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {renderCalculatorButtons("wellness")}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="calculator-container">
        {renderActiveCalculator()}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© 2025 <a href="https://survivewellness.com" target="_blank" rel="noopener noreferrer" className="text-wellness-purple hover:underline">Survive<span className="lowercase">w</span>ellness</a>. All calculations are based on established formulas and guidelines.</p>
        <p className="mt-1">Always consult with healthcare professionals for personalized advice.</p>
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
};

export default WellnessCalculatorHub;
