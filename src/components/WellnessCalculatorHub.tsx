
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { UnitSystem } from "@/types/calculatorTypes";
import { Toaster } from "sonner";
import { CalculatorSidebar } from "./CalculatorSidebar";
import CalculatorDisplay from "./CalculatorDisplay";
import { MobileCalculatorView } from "./MobileCalculatorView";
import { useIsMobile } from "@/hooks/use-mobile";

type CalculatorCategory = "body" | "fitness" | "nutrition" | "wellness";

export interface CalculatorInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: CalculatorCategory;
  url: string;
}

export const calculators: CalculatorInfo[] = [
  // Body Composition
  { 
    id: "bmi", 
    name: "BMI Calculator", 
    icon: "body", 
    color: "wellness-purple", 
    category: "body",
    url: "https://survivewellness.com/tools-calculators/#bmi"
  },
  { 
    id: "bmr", 
    name: "BMR & Calories", 
    icon: "activity", 
    color: "wellness-blue", 
    category: "body",
    url: "https://survivewellness.com/tools-calculators/#bmr"
  },
  { 
    id: "bodyfat", 
    name: "Body Fat", 
    icon: "weight", 
    color: "wellness-green", 
    category: "body",
    url: "https://survivewellness.com/tools-calculators/#bodyfat"
  },
  { 
    id: "idealweight", 
    name: "Ideal Weight", 
    icon: "weight", 
    color: "wellness-orange", 
    category: "body",
    url: "https://survivewellness.com/tools-calculators/#idealweight"
  },
  
  // Fitness & Exercise
  { 
    id: "heartrate", 
    name: "Heart Rate Zones", 
    icon: "heart", 
    color: "wellness-red", 
    category: "fitness",
    url: "https://survivewellness.com/tools-calculators/#heartrate"
  },
  { 
    id: "vo2max", 
    name: "VO2 Max", 
    icon: "activity", 
    color: "wellness-blue", 
    category: "fitness",
    url: "https://survivewellness.com/tools-calculators/#vo2max"
  },
  { 
    id: "workout", 
    name: "Workout Planner", 
    icon: "fitness", 
    color: "wellness-green", 
    category: "fitness",
    url: "https://survivewellness.com/tools-calculators/#workout"
  },
  { 
    id: "steps", 
    name: "Step Counter", 
    icon: "activity", 
    color: "wellness-purple", 
    category: "fitness",
    url: "https://survivewellness.com/tools-calculators/#steps"
  },
  
  // Nutrition & Diet
  { 
    id: "macro", 
    name: "Macronutrients", 
    icon: "nutrition", 
    color: "wellness-green", 
    category: "nutrition",
    url: "https://survivewellness.com/tools-calculators/#macro"
  },
  { 
    id: "water", 
    name: "Water Intake", 
    icon: "nutrition", 
    color: "wellness-blue", 
    category: "nutrition",
    url: "https://survivewellness.com/tools-calculators/#water"
  },
  { 
    id: "fasting", 
    name: "Intermittent Fasting", 
    icon: "nutrition", 
    color: "wellness-orange", 
    category: "nutrition",
    url: "https://survivewellness.com/tools-calculators/#fasting"
  },
  { 
    id: "calories", 
    name: "Calorie Tracker", 
    icon: "calculator", 
    color: "wellness-purple", 
    category: "nutrition",
    url: "https://survivewellness.com/tools-calculators/#calories"
  },
  
  // Wellness & Lifestyle
  { 
    id: "pregnancy", 
    name: "Pregnancy Weight", 
    icon: "weight", 
    color: "wellness-pink", 
    category: "wellness",
    url: "https://survivewellness.com/tools-calculators/#pregnancy"
  },
  { 
    id: "alcohol", 
    name: "Alcohol Impact", 
    icon: "activity", 
    color: "wellness-red", 
    category: "wellness",
    url: "https://survivewellness.com/tools-calculators/#alcohol"
  },
  { 
    id: "smoking", 
    name: "Smoking Impact", 
    icon: "activity", 
    color: "wellness-orange", 
    category: "wellness",
    url: "https://survivewellness.com/tools-calculators/#smoking"
  },
  { 
    id: "stress", 
    name: "Stress & Anxiety", 
    icon: "heart", 
    color: "wellness-purple", 
    category: "wellness",
    url: "https://survivewellness.com/tools-calculators/#stress"
  },
];

const WellnessCalculatorHub = () => {
  const [activeCalculator, setActiveCalculator] = useState<string>("bmi");
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("imperial");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const location = useLocation();
  const isMobile = useIsMobile();

  // Handle direct calculator access via URL
  React.useEffect(() => {
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
    window.location.hash = calculatorId;
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {isMobile ? (
        <MobileCalculatorView
          calculators={calculators}
          activeCalculator={activeCalculator}
          onCalculatorSelect={handleCalculatorSelect}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          unitSystem={unitSystem}
          onUnitSystemChange={handleUnitSystemChange}
        />
      ) : (
        <>
          <div className="md:w-64 flex-shrink-0">
            <CalculatorSidebar 
              activeCalculator={activeCalculator} 
              onCalculatorSelect={handleCalculatorSelect} 
              calculators={calculators}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          
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
        </>
      )}
      
      <Toaster position="top-right" />
    </div>
  );
};

export default WellnessCalculatorHub;
