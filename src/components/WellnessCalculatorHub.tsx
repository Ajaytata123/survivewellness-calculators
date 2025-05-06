
import React, { useState, useEffect } from 'react';
import { calculators } from '@/data/calculatorData';
import { CalculatorInfo } from '@/types/calculator';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileCalculatorView } from './MobileCalculatorView';
import { DesktopLayout } from './calculator/DesktopLayout';

const WellnessCalculatorHub: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<string>('bmi');
  const isMobile = useIsMobile();

  useEffect(() => {
    // Set active calculator from URL hash if available
    const hash = window.location.hash.replace('#', '');
    if (hash && calculators.some(calc => calc.id === hash)) {
      setActiveCalculator(hash);
    }
  }, []);

  const handleCalculatorSelect = (calculatorId: string) => {
    setActiveCalculator(calculatorId);
    window.history.pushState(null, '', `#${calculatorId}`);
    
    // Auto-scroll to the calculator section on mobile
    if (isMobile) {
      const calculatorElement = document.getElementById('calculator-content');
      if (calculatorElement) {
        calculatorElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="wellness-calculator-hub">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-2">SurviveWellness Calculator Hub</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Explore our professional health and wellness calculators to track your fitness progress
        </p>
        
        {isMobile ? (
          <MobileCalculatorView 
            calculators={calculators}
            activeCalculator={activeCalculator}
            onCalculatorSelect={handleCalculatorSelect}
          />
        ) : (
          <DesktopLayout 
            calculators={calculators}
            activeCalculator={activeCalculator}
            onCalculatorSelect={handleCalculatorSelect}
          />
        )}
      </div>
    </div>
  );
};

export default WellnessCalculatorHub;
