
import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalculatorInfo, getCategoryName } from '@/types/calculator';

interface BreadcrumbProps {
  calculators: CalculatorInfo[];
  activeCalculator: string;
  onCalculatorSelect: (calculatorId: string) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  calculators,
  activeCalculator,
  onCalculatorSelect
}) => {
  const activeCalcInfo = calculators.find(calc => calc.id === activeCalculator);
  
  if (!activeCalcInfo) return null;
  
  const categoryName = getCategoryName(activeCalcInfo.category);
  
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
        <li>
          <Link href="/" className="hover:text-wellness-blue">
            Home
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          <button 
            onClick={() => {
              const firstCalcInCategory = calculators.find(c => c.category === activeCalcInfo.category);
              if (firstCalcInCategory) {
                onCalculatorSelect(firstCalcInCategory.id);
              }
            }}
            className="hover:text-wellness-blue"
          >
            {categoryName}
          </button>
        </li>
        <li className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-gray-900 dark:text-white">
            {activeCalcInfo.name}
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
