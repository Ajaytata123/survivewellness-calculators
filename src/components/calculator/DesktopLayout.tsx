
import React, { useState } from "react";
import { CalculatorInfo } from "@/types/calculator";
import CalculatorSidebar from "../CalculatorSidebar";
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
  const [highlightedCategory, setHighlightedCategory] = useState<string | undefined>();
  const calculatorInfo = calculators.find(calc => calc.id === activeCalculator);

  const handleCategorySelect = (category: string) => {
    setHighlightedCategory(category);
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar - Increased height to show more content */}
      <div className="fixed left-0 top-0 w-80 h-[calc(100vh)] bg-gray-50 border-r border-gray-200 z-10">
        <div className="h-full p-4 overflow-hidden flex flex-col">
          <CalculatorSidebar 
            selectedCalculator={activeCalculator}
            onCalculatorSelect={onCalculatorSelect}
          />
        </div>
      </div>
      
      {/* Main Content Area - Fixed margin to account for sidebar */}
      <div className="flex-1 ml-80">
        <div className="min-h-screen flex flex-col">
          {/* Fixed Header */}
          <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-5">
            {calculatorInfo && (
              <Breadcrumb 
                calculators={calculators}
                activeCalculator={activeCalculator}
                onCalculatorSelect={onCalculatorSelect}
                onCategorySelect={handleCategorySelect}
                className="flex items-center text-sm"
              />
            )}
          </div>
          
          {/* Calculator Content */}
          <div className="flex-1 bg-white">
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
    </div>
  );
};
