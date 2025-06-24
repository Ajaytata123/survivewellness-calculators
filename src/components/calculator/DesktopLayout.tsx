
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="w-80 flex-shrink-0 bg-gray-50 border-r border-gray-200">
        <div className="h-full p-6">
          <CalculatorSidebar 
            activeCalculator={activeCalculator} 
            onCalculatorSelect={onCalculatorSelect} 
            calculators={calculators}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>
      
      {/* Main Content Area - Fixed height with internal scroll */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-100 px-6 py-4">
          {calculatorInfo && (
            <Breadcrumb 
              calculators={calculators}
              activeCalculator={activeCalculator}
              onCalculatorSelect={onCalculatorSelect}
              className="flex items-center text-sm"
            />
          )}
        </div>
        
        {/* Scrollable Calculator Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-6" id={`desktop-calculator-${activeCalculator}-container`}>
            <CalculatorDisplay 
              activeCalculator={activeCalculator}
              unitSystem={unitSystem}
              onUnitSystemChange={onUnitSystemChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
