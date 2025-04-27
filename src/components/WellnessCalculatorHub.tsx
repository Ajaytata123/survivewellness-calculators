
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { UnitSystem } from "@/types/calculatorTypes";
import { Toaster } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileCalculatorView } from "./MobileCalculatorView";
import { DesktopLayout } from "./calculator/DesktopLayout";
import { calculators } from "@/data/calculatorData";

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
        />
      )}
      <Toaster position="top-right" />
    </div>
  );
};

export default WellnessCalculatorHub;
