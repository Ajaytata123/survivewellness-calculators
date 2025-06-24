
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 p-6">
        <div className="sticky top-6">
          <CalculatorSidebar 
            activeCalculator={activeCalculator} 
            onCalculatorSelect={onCalculatorSelect} 
            calculators={calculators}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 p-6 pr-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 min-h-[calc(100vh-3rem)]">
          {/* Breadcrumb Section */}
          <div className="sticky top-0 z-10 bg-white rounded-t-2xl border-b border-gray-100 px-6 py-4">
            {calculatorInfo && (
              <Breadcrumb 
                calculators={calculators}
                activeCalculator={activeCalculator}
                onCalculatorSelect={onCalculatorSelect}
                className="flex items-center text-sm"
              />
            )}
          </div>
          
          {/* Calculator Content */}
          <div className="p-6 calculator-display-area overflow-y-auto" id={`desktop-calculator-${activeCalculator}-container`}>
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
