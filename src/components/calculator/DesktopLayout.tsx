
import React from "react";
import { CalculatorInfo } from "@/types/calculator";
import { CalculatorSidebar } from "../CalculatorSidebar";
import CalculatorDisplay from "../CalculatorDisplay";
import { UnitSystem } from "@/types/calculatorTypes";

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
  return (
    <>
      <div className="md:w-64 flex-shrink-0">
        <CalculatorSidebar 
          activeCalculator={activeCalculator} 
          onCalculatorSelect={onCalculatorSelect} 
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
            onUnitSystemChange={onUnitSystemChange}
          />
        </div>
      </div>
    </>
  );
};
