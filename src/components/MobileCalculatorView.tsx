
import React, { useState } from 'react';
import { Search } from "@/components/ui/search";
import { CalculatorInfo } from '@/types/calculator';
import CalculatorDisplay from './CalculatorDisplay';
import { UnitSystem } from '@/types/calculatorTypes';
import { CategorySelector } from './calculator/CategorySelector';
import { CalculatorCards } from './calculator/CalculatorCards';
import { TabsContent, Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';

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
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [activeTab, setActiveTab] = useState<"browse" | "calculator">("browse");

  const filteredCalculators = calculators.filter(calc => 
    calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    calc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryCalculators = calculators.filter(calc => calc.category === activeCategory);

  // Create a wrapper function to handle the category type correctly
  const handleCategorySelect = (category: string) => {
    setActiveCategory(category as "body" | "fitness" | "nutrition" | "wellness");
  };

  // When a calculator is selected, automatically switch to calculator tab
  const handleCalculatorSelect = (id: string) => {
    onCalculatorSelect(id);
    setActiveTab("calculator");
  };

  const activeCalcInfo = calculators.find(calc => calc.id === activeCalculator);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="sticky top-0 z-10 bg-white shadow-sm p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-wellness-purple">Wellness Calculators</h1>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "browse" | "calculator")} className="w-auto">
            <TabsList className="grid w-[180px] grid-cols-2">
              <TabsTrigger value="browse">Browse</TabsTrigger>
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {activeTab === "browse" && (
          <>
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
          </>
        )}
        
        {activeTab === "calculator" && activeCalcInfo && (
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setActiveTab("browse")}
              className="text-sm text-wellness-purple hover:underline"
            >
              « Back to browse
            </button>
            <Separator orientation="vertical" className="h-4" />
            <span className="font-medium">{activeCalcInfo.name}</span>
          </div>
        )}
      </div>

      <div className="flex-1 p-4">
        {activeTab === "browse" ? (
          <div className="animate-fade-in">
            <CalculatorCards
              calculators={searchQuery ? filteredCalculators : categoryCalculators}
              activeCalculator={activeCalculator}
              onCalculatorSelect={handleCalculatorSelect}
              isSearching={!!searchQuery}
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            <CalculatorDisplay
              activeCalculator={activeCalculator}
              unitSystem={unitSystem}
              onUnitSystemChange={onUnitSystemChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
