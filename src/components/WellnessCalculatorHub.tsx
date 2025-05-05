
import React, { useState, useEffect } from "react";
import { CalculatorSidebar } from "./CalculatorSidebar";
import CalculatorDisplay from "./CalculatorDisplay";
import calculatorsData from "@/data/calculatorData";
import { useMobile } from "@/hooks/use-mobile";
import MobileCalculatorView from "./MobileCalculatorView";
import DesktopLayout from "./calculator/DesktopLayout";
import { UnitSystem } from "@/types/calculatorTypes";

const WellnessCalculatorHub: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<string>("bmi");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("imperial");
  const isMobile = useMobile();

  const handleCalculatorSelect = (calculatorId: string) => {
    setActiveCalculator(calculatorId);
    if (isMobile) {
      // For mobile, reset search when a calculator is selected
      setSearchQuery("");
    }
  };

  const handleUnitSystemChange = (system: UnitSystem) => {
    setUnitSystem(system);
  };

  useEffect(() => {
    // Get calculator from URL hash if present
    const hash = window.location.hash.substring(1);
    if (hash && calculatorsData.some(calc => calc.id === hash)) {
      setActiveCalculator(hash);
    }
  }, []);

  // Update hash when calculator changes
  useEffect(() => {
    if (activeCalculator) {
      window.location.hash = activeCalculator;
    }
  }, [activeCalculator]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="text-center py-6 px-4 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-wellness-purple">SurviveWellness Calculator Hub</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
          Explore our professional health and wellness calculators to track your fitness progress
        </p>
      </div>
      
      {isMobile ? (
        <MobileCalculatorView
          calculators={calculatorsData}
          activeCalculator={activeCalculator}
          onCalculatorSelect={handleCalculatorSelect}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          unitSystem={unitSystem}
          onUnitSystemChange={handleUnitSystemChange}
        />
      ) : (
        <DesktopLayout
          calculators={calculatorsData}
          activeCalculator={activeCalculator}
          onCalculatorSelect={handleCalculatorSelect}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          unitSystem={unitSystem}
          onUnitSystemChange={handleUnitSystemChange}
        />
      )}
    </div>
  );
};

export default WellnessCalculatorHub;
