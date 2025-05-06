
import React from 'react';
import { Link } from 'react-router-dom';
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
  onCalculatorSelect,
}) => {
  const activeCalcInfo = calculators.find((calc) => calc.id === activeCalculator);
  
  if (!activeCalcInfo) return null;
  
  const categoryName = getCategoryName(activeCalcInfo.category);
  
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
        <li>
          <Link to="/" className="hover:text-wellness-blue">
            Home
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRight className="h-4 w-4" />
        </li>
        <li>
          <button 
            onClick={() => {
              // Find the first calculator of this category
              const firstCalcInCategory = calculators.find(
                (calc) => calc.category === activeCalcInfo.category
              );
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
          <ChevronRight className="h-4 w-4" />
        </li>
        <li>
          <span className={cn("font-medium", activeCalcInfo ? 
            `text-${activeCalcInfo.color}` : 
            "text-wellness-blue")}>
            {activeCalcInfo?.name}
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
