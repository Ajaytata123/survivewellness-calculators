
import React from 'react';
import { Search } from "@/components/ui/search";
import { CalculatorInfo } from './WellnessCalculatorHub';
import CalculatorDisplay from './CalculatorDisplay';
import { UnitSystem } from '@/types/calculatorTypes';
import { CategorySelector } from './calculator/CategorySelector';
import { CalculatorCards } from './calculator/CalculatorCards';

interface MobileCalculatorViewProps {
  calculators: CalculatorInfo[];
  activeCalculator: string;
  onCalculatorSelect: (calculatorId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

export const MobileCalculatorView: React.FC<MobileCalculatorViewProps> = ({
  calculators,
  activeCalculator,
  onCalculatorSelect,
  searchQuery,
  setSearchQuery,
  unitSystem,
  onUnitSystemChange,
}) => {
  const categories = Array.from(new Set(calculators.map(calc => calc.category)));
  const [activeCategory, setActiveCategory] = React.useState(categories[0]);

  const filteredCalculators = calculators.filter(calc => 
    calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    calc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryCalculators = calculators.filter(calc => calc.category === activeCategory);

  // Create a wrapper function to handle the category type correctly
  const handleCategorySelect = (category: string) => {
    setActiveCategory(category as "body" | "fitness" | "nutrition" | "wellness");
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="sticky top-0 z-10 bg-white shadow-sm p-4 space-y-4">
        <Search 
          placeholder="Search calculators..." 
          value={searchQuery}
          onSearch={setSearchQuery}
          className="w-full"
        />
        
        <CategorySelector
          categories={categories}
          activeCategory={activeCategory}
          onCategorySelect={handleCategorySelect}
        />
      </div>

      <div className="flex-1 p-4">
        <CalculatorCards
          calculators={searchQuery ? filteredCalculators : categoryCalculators}
          activeCalculator={activeCalculator}
          onCalculatorSelect={onCalculatorSelect}
          isSearching={!!searchQuery}
        />

        <div className="mt-6">
          <CalculatorDisplay
            activeCalculator={activeCalculator}
            unitSystem={unitSystem}
            onUnitSystemChange={onUnitSystemChange}
          />
        </div>
      </div>
    </div>
  );
};
