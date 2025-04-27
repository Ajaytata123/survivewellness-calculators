
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UnitSystem } from "@/types/calculatorTypes";
import { Toaster } from "sonner";
import { CalculatorSidebar } from "./CalculatorSidebar";
import CalculatorDisplay from "./CalculatorDisplay";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();

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

  // Handle direct calculator access via URL
  useEffect(() => {
    const hash = location.hash.slice(1);
    if (hash) {
      const calculatorInfo = calculators.find(calc => calc.id === hash);
      if (calculatorInfo) {
        setActiveCalculator(hash);
      }
    }
  }, [location]);

  const handleUnitSystemChange = (system: UnitSystem) => {
    setUnitSystem(system);
  };

  const handleCalculatorSelect = (calculatorId: string) => {
    setActiveCalculator(calculatorId);
    navigate(`#${calculatorId}`);
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <div className="md:w-64 flex-shrink-0">
        <CalculatorSidebar 
          activeCalculator={activeCalculator} 
          onCalculatorSelect={handleCalculatorSelect} 
          calculators={calculators}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 p-2 sm:p-4 md:p-6 bg-white">
        <div className="text-center space-y-2 mb-6 px-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-wellness-purple">
            Survivewellness Calculator Hub
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Explore our professional health and wellness calculators to track your fitness progress
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <CalculatorDisplay 
            activeCalculator={activeCalculator}
            unitSystem={unitSystem}
            onUnitSystemChange={handleUnitSystemChange}
          />
        </div>
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
};

export default WellnessCalculatorHub;
