
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalculatorInfo, getCategoryName } from '@/types/calculator';
import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

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

  // Rename "Menstrual Cycle" to "Period" calculator
  const displayName = activeCalc.id === 'menstrualCycle' ? 'Period Calculator' : activeCalc.name;
  
  return (
    <ShadcnBreadcrumb className={cn("py-2 px-0", className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink 
            onClick={() => onCalculatorSelect('bmi')}
            className="text-gray-500 dark:text-gray-400 hover:text-wellness-blue dark:hover:text-wellness-blue/90 cursor-pointer"
            id="breadcrumb-home"
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator />
        
        <BreadcrumbItem>
          <BreadcrumbLink 
            className="text-gray-600 dark:text-gray-300 cursor-pointer"
            onClick={() => {
              // Find first calculator of this category and navigate to it
              const firstCalcOfCategory = calculators.find(calc => calc.category === activeCalc.category);
              if (firstCalcOfCategory) {
                onCalculatorSelect(firstCalcOfCategory.id);
              }
            }}
            id={`breadcrumb-category-${activeCalc.category}`}
          >
            {categoryName}
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator />
        
        <BreadcrumbItem>
          <BreadcrumbPage 
            className="text-wellness-purple dark:text-wellness-purple/90 font-medium"
            id={`breadcrumb-calc-${activeCalc.id}`}
          >
            {displayName}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  );
};

export default Breadcrumb;
