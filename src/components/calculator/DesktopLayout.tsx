
import React from "react";
import { CalculatorInfo } from "@/types/calculator";
import { CalculatorSidebar } from "../CalculatorSidebar";
import CalculatorDisplay from "../CalculatorDisplay";
import { UnitSystem } from "@/types/calculatorTypes";
import Breadcrumb from "./Breadcrumb";

interface DesktopLayoutProps {
  activeCalculator: string;
  onCalculatorSelect: (calculatorId: string) => void;
  calculators: CalculatorInfo[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  activeCalculator,
  onCalculatorSelect,
  calculators,
  searchQuery,
  setSearchQuery,
  unitSystem,
  onUnitSystemChange,
}) => {
  const calculatorInfo = calculators.find(calc => calc.id === activeCalculator);
  
  return (
    <div className="flex">
      <div className="md:w-64 flex-shrink-0 overflow-y-auto">
        <CalculatorSidebar 
          activeCalculator={activeCalculator} 
          onCalculatorSelect={onCalculatorSelect} 
          calculators={calculators}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      
      <div className="flex-1 p-2 sm:p-4 md:p-6 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 pt-2 pb-4 mb-4">
          {calculatorInfo && (
            <Breadcrumb 
              calculators={calculators}
              activeCalculator={activeCalculator}
              onCalculatorSelect={onCalculatorSelect}
              className="hidden md:flex" // Only show on desktop
            />
          )}
        </div>
        
        <div className="calculator-area p-4 transition-all duration-500 transform" id={`desktop-calculator-${activeCalculator}-container`}>
          <CalculatorDisplay 
            activeCalculator={activeCalculator}
            unitSystem={unitSystem}
            onUnitSystemChange={onUnitSystemChange}
          />
        </div>
      </div>
    </div>
  );
};
