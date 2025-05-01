
import React, { useState, useEffect } from 'react';
import { Search } from "@/components/ui/search";
import { CalculatorInfo, CalculatorCategory } from '@/types/calculator';
import CalculatorDisplay from './CalculatorDisplay';
import { UnitSystem } from '@/types/calculatorTypes';
import { CategorySelector } from './calculator/CategorySelector';
import { CalculatorCards } from './calculator/CalculatorCards';
import { TabsContent, Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { getCategoryName } from '@/utils/iconUtils';

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
  const categories: CalculatorCategory[] = ["body", "fitness", "nutrition", "wellness", "women"];
  const [activeCategory, setActiveCategory] = useState<CalculatorCategory>(categories[0]);
  const [activeTab, setActiveTab] = useState<"browse" | "calculator">("browse");
  const [filteredCategories, setFilteredCategories] = useState<CalculatorCategory[]>(categories);

  // Filter calculators based on search query
  const filteredCalculators = calculators.filter(calc => 
    calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    calc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update filtered categories whenever search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCategories(categories);
      return;
    }

    // Find categories that have matching calculators
    const matchingCategories = Array.from(new Set(
      filteredCalculators.map(calc => calc.category)
    )) as CalculatorCategory[];

    // Also include categories that match the search directly
    categories.forEach(category => {
      const categoryName = getCategoryName(category).toLowerCase();
      if (
        categoryName.includes(searchQuery.toLowerCase()) &&
        !matchingCategories.includes(category)
      ) {
        matchingCategories.push(category);
      }
    });

    setFilteredCategories(matchingCategories);

    // If current active category isn't in filtered list but we have matches, switch to first match
    if (matchingCategories.length > 0 && !matchingCategories.includes(activeCategory)) {
      setActiveCategory(matchingCategories[0]);
    }
  }, [searchQuery, calculators, activeCategory]);

  // Get calculators for the currently selected category
  const categoryCalculators = calculators.filter(calc => calc.category === activeCategory);

  // When a calculator is selected, automatically switch to calculator tab
  const handleCalculatorSelect = (id: string) => {
    onCalculatorSelect(id);
    setActiveTab("calculator");
  };

  const activeCalcInfo = calculators.find(calc => calc.id === activeCalculator);

  // Group calculators by category for search results
  const calculatorsByCategory: Record<CalculatorCategory, CalculatorInfo[]> = {
    body: [],
    fitness: [],
    nutrition: [],
    wellness: [],
    women: []
  };

  if (searchQuery) {
    filteredCalculators.forEach(calc => {
      calculatorsByCategory[calc.category].push(calc);
    });
  }

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
            
            {!searchQuery && (
              <CategorySelector
                categories={categories}
                activeCategory={activeCategory}
                onCategorySelect={(cat) => setActiveCategory(cat as CalculatorCategory)}
              />
            )}
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
            {!searchQuery ? (
              <CalculatorCards
                calculators={categoryCalculators}
                activeCalculator={activeCalculator}
                onCalculatorSelect={handleCalculatorSelect}
                isSearching={false}
              />
            ) : (
              <div className="space-y-6">
                {filteredCategories.map(category => {
                  const categoryCalcs = calculatorsByCategory[category];
                  if (categoryCalcs.length === 0) return null;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <h2 className="text-md font-semibold text-wellness-purple">
                        {getCategoryName(category)}
                      </h2>
                      <CalculatorCards
                        calculators={categoryCalcs}
                        activeCalculator={activeCalculator}
                        onCalculatorSelect={handleCalculatorSelect}
                        isSearching={true}
                      />
                    </div>
                  );
                })}
              </div>
            )}
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
