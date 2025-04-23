
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnitSystem } from "@/types/calculatorTypes";
import BMICalculator from "./calculators/BMICalculator";
import BMRCalculator from "./calculators/BMRCalculator";
import BodyFatCalculator from "./calculators/BodyFatCalculator";

const WellnessCalculatorHub: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<string>("bmi");
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("imperial");

  const handleUnitSystemChange = (system: UnitSystem) => {
    setUnitSystem(system);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-2 text-wellness-purple">Wellness Calculator Hub</h1>
      <p className="text-gray-600 text-center mb-8">
        Explore our health and wellness calculators to track your fitness progress
      </p>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Explore Our Calculators</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <button
            className={`p-3 rounded-lg transition-all ${
              activeCalculator === "bmi"
                ? "bg-wellness-purple text-white shadow-md"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setActiveCalculator("bmi")}
          >
            BMI Calculator
          </button>
          <button
            className={`p-3 rounded-lg transition-all ${
              activeCalculator === "bmr"
                ? "bg-wellness-blue text-white shadow-md"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setActiveCalculator("bmr")}
          >
            BMR & Calories
          </button>
          <button
            className={`p-3 rounded-lg transition-all ${
              activeCalculator === "bodyfat"
                ? "bg-wellness-green text-white shadow-md"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setActiveCalculator("bodyfat")}
          >
            Body Fat
          </button>
        </div>
      </div>

      <div className="calculator-container">
        {activeCalculator === "bmi" && (
          <BMICalculator 
            unitSystem={unitSystem} 
            onUnitSystemChange={handleUnitSystemChange} 
          />
        )}
        {activeCalculator === "bmr" && (
          <BMRCalculator 
            unitSystem={unitSystem} 
            onUnitSystemChange={handleUnitSystemChange} 
          />
        )}
        {activeCalculator === "bodyfat" && (
          <BodyFatCalculator 
            unitSystem={unitSystem} 
            onUnitSystemChange={handleUnitSystemChange} 
          />
        )}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© 2025 SurviveWellness. All calculations are based on established formulas and guidelines.</p>
        <p className="mt-1">Always consult with healthcare professionals for personalized advice.</p>
      </div>
    </div>
  );
};

export default WellnessCalculatorHub;
