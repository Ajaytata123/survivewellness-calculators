
import React from "react";
import { CalculatorInfo } from "@/types/calculator";
import { CalculatorSidebar } from "../CalculatorSidebar";
import CalculatorDisplay from "../CalculatorDisplay";
import { UnitSystem } from "@/types/calculatorTypes";
import { Moon, Sun } from "lucide-react";
import { Breadcrumb } from "./Breadcrumb";

interface DesktopLayoutProps {
  activeCalculator: string;
  onCalculatorSelect: (calculatorId: string) => void;
  calculators: CalculatorInfo[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  activeCalculator,
  onCalculatorSelect,
  calculators,
  searchQuery,
  setSearchQuery,
  unitSystem,
  onUnitSystemChange,
  isDarkMode,
  toggleDarkMode,
}) => {
  const calculatorInfo = calculators.find(calc => calc.id === activeCalculator);
  
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
      
      <div className="flex-1 p-2 sm:p-4 md:p-6 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 pt-2 pb-4 mb-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gradient">
              SurviveWellness Calculator Hub
            </h1>
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 transition-colors"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm max-w-2xl mt-2">
            Explore our professional health and wellness calculators to track your fitness progress
          </p>
          
          {calculatorInfo && <Breadcrumb calculatorInfo={calculatorInfo} />}
        </div>
        
        <div className="calculator-area p-4 transition-all duration-500 transform">
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
