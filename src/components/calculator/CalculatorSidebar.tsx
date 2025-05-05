
import React, { useRef, useEffect } from 'react';
import { CalculatorInfo, CalculatorCategory, getCategoryName } from '@/types/calculator';

interface CalculatorSidebarProps {
  calculators: CalculatorInfo[];
  activeCalculator: string;
  onCalculatorSelect: (calculatorId: string) => void;
}

const CalculatorSidebar: React.FC<CalculatorSidebarProps> = ({
  calculators,
  activeCalculator,
  onCalculatorSelect,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    // When the active calculator changes, don't scroll the sidebar to the top
    // Instead, if the active item is out of view, scroll it into view
    if (activeItemRef.current && sidebarRef.current) {
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const activeItemRect = activeItemRef.current.getBoundingClientRect();
      
      // If the active item is out of view, scroll it into view
      if (activeItemRect.top < sidebarRect.top || activeItemRect.bottom > sidebarRect.bottom) {
        activeItemRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [activeCalculator]);

  // Group calculators by category
  const categories: Record<CalculatorCategory, CalculatorInfo[]> = {
    body: calculators.filter(calc => calc.category === 'body'),
    fitness: calculators.filter(calc => calc.category === 'fitness'),
    nutrition: calculators.filter(calc => calc.category === 'nutrition'),
    wellness: calculators.filter(calc => calc.category === 'wellness'),
    women: calculators.filter(calc => calc.category === 'women'),
  };

  return (
    <div className="calculator-sidebar h-full flex flex-col bg-white dark:bg-gray-900 w-64">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold">Calculators</h2>
      </div>
      <div className="flex-1 overflow-y-auto" ref={sidebarRef}>
        <nav className="flex flex-col p-2">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-3 mb-2">
                {getCategoryName(category as CalculatorCategory)}
              </h3>
              <ul className="space-y-1">
                {items.map((calculator) => (
                  <li
                    key={calculator.id}
                    ref={calculator.id === activeCalculator ? activeItemRef : undefined}
                    className={`rounded-md ${
                      calculator.id === activeCalculator
                        ? 'bg-gray-100 dark:bg-gray-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <button
                      className="w-full flex items-center px-3 py-2 text-sm font-medium text-left"
                      onClick={() => onCalculatorSelect(calculator.id)}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mr-2 ${calculator.color}`}
                      ></span>
                      {calculator.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CalculatorSidebar;
