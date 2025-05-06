
import React from 'react';
import { CalculatorInfo } from '@/types/calculator';
import { CalculatorCard } from './CalculatorCard';
import CalculatorSidebar from './CalculatorSidebar';
import Breadcrumb from './Breadcrumb';

interface DesktopLayoutProps {
  calculators: CalculatorInfo[];
  activeCalculator: string;
  onCalculatorSelect: (calculatorId: string) => void;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({ 
  calculators, 
  activeCalculator, 
  onCalculatorSelect 
}) => {
  const activeCalcInfo = calculators.find(calc => calc.id === activeCalculator);

  return (
    <div className="desktop-layout flex">
      <div className="sticky top-0 h-screen overflow-hidden border-r border-gray-200 dark:border-gray-800">
        <CalculatorSidebar 
          calculators={calculators} 
          activeCalculator={activeCalculator} 
          onCalculatorSelect={onCalculatorSelect}
        />
      </div>
      <div className="flex-1 p-6">
        <div className="mb-6">
          <Breadcrumb 
            calculators={calculators}
            activeCalculator={activeCalculator}
            onCalculatorSelect={onCalculatorSelect}
          />
        </div>
        <div className="max-w-4xl mx-auto">
          {activeCalcInfo && (
            <CalculatorCard calculatorInfo={activeCalcInfo} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopLayout;
