
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalculatorInfo, getCategoryName } from '@/types/calculator';

interface BreadcrumbProps {
  calculators: CalculatorInfo[];
  activeCalculator: string;
  onCalculatorSelect: (id: string) => void;
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  calculators,
  activeCalculator,
  onCalculatorSelect,
  className
}) => {
  const activeCalc = calculators.find(calc => calc.id === activeCalculator);
  
  if (!activeCalc) return null;
  
  const categoryName = getCategoryName(activeCalc.category);
  
  return (
    <nav className={cn("mb-4 py-1 px-1", className)}>
      <ol className="flex text-sm items-center flex-wrap">
        <li className="flex items-center">
          <button 
            onClick={() => onCalculatorSelect('bmi')} 
            className="text-gray-500 dark:text-gray-400 hover:text-wellness-blue dark:hover:text-wellness-blue/90"
          >
            Home
          </button>
        </li>
        <li className="flex items-center mx-1">
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </li>
        <li className="flex items-center">
          <span className="text-gray-600 dark:text-gray-300">
            {categoryName}
          </span>
        </li>
        <li className="flex items-center mx-1">
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </li>
        <li>
          <span className="text-wellness-purple dark:text-wellness-purple/90 font-medium">
            {activeCalc.name}
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
