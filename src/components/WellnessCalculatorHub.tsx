
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UnitSystem } from "@/types/calculatorTypes";
import { Toaster } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileCalculatorView } from "./MobileCalculatorView";
import { DesktopLayout } from "./calculator/DesktopLayout";
import { calculators } from "@/data/calculatorData";
import { CalculatorCategory } from "@/types/calculator";

const WellnessCalculatorHub = () => {
  const [activeCalculator, setActiveCalculator] = useState<string>("bmi");
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("imperial");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Handle dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

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

  const handleCalculatorSelect = (calculatorId: string) => {
    setActiveCalculator(calculatorId);
    window.location.hash = calculatorId;
  };

  return (
    <div className={`flex min-h-screen flex-col md:flex-row transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      {isMobile ? (
        <MobileCalculatorView
          calculators={calculators}
          activeCalculator={activeCalculator}
          onCalculatorSelect={handleCalculatorSelect}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          unitSystem={unitSystem}
          onUnitSystemChange={setUnitSystem}
        />
      ) : (
        <DesktopLayout
          activeCalculator={activeCalculator}
          onCalculatorSelect={handleCalculatorSelect}
          calculators={calculators}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          unitSystem={unitSystem}
          onUnitSystemChange={setUnitSystem}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
      )}
      <Toaster position="top-right" />
    </div>
  );
};

export default WellnessCalculatorHub;
