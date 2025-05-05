
import React, { useState, useEffect } from 'react';
import { Search } from "@/components/ui/search";
import { CalculatorInfo, CalculatorCategory } from '@/types/calculator';
import CalculatorDisplay from './CalculatorDisplay';
import { UnitSystem } from '@/types/calculatorTypes';
import { CategorySelector } from './calculator/CategorySelector';
import { TabsContent, Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { getCategoryName, getCategoryIcon, getIconComponent } from '@/utils/iconUtils';
import { Button } from './ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ChevronLeft, Home, Calendar, Activity, Heart, Scale, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  // Function to render calculator cards
  const renderCalculatorCard = (calc: CalculatorInfo) => {
    const IconComponent = getIconComponent(calc.icon);
    
    return (
      <div 
        key={calc.id}
        className={cn(
          "p-4 border rounded-lg shadow-sm cursor-pointer transition-all",
          activeCalculator === calc.id 
            ? `border-${calc.color} bg-${calc.color}/10` 
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        )}
        onClick={() => handleCalculatorSelect(calc.id)}
      >
        <div className="flex flex-col items-center text-center">
          <div className={`p-3 rounded-full bg-${calc.color}/20 mb-2`}>
            <IconComponent className={`h-6 w-6 text-${calc.color}`} />
          </div>
          <h3 className="font-medium text-sm">{calc.name}</h3>
        </div>
      </div>
    );
  };

  const getCategoryIcon = (category: CalculatorCategory) => {
    switch(category) {
      case 'body': return <Scale className="h-5 w-5" />;
      case 'fitness': return <Activity className="h-5 w-5" />;
      case 'nutrition': return <Utensils className="h-5 w-5" />;
      case 'wellness': return <Heart className="h-5 w-5" />;
      case 'women': return <Calendar className="h-5 w-5" />;
    }
  };

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
          </>
        )}
        
        {activeTab === "calculator" && activeCalcInfo && (
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setActiveTab("browse")}
              className="text-sm text-wellness-purple hover:underline flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
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
              <Accordion type="single" collapsible className="w-full space-y-2">
                {categories.map((category) => (
                  <AccordionItem 
                    key={category} 
                    value={category}
                    className="border rounded-lg px-2 overflow-hidden"
                  >
                    <AccordionTrigger className={`text-${getCategoryColor(category)} hover:no-underline px-2`}>
                      <div className="flex items-center">
                        {getCategoryIcon(category)}
                        <span className="ml-2 font-medium">{getCategoryName(category)}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-2">
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        {calculators
                          .filter(calc => calc.category === category)
                          .map(calc => renderCalculatorCard(calc))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="space-y-6">
                {filteredCategories.map(category => {
                  const categoryCalcs = calculatorsByCategory[category];
                  if (categoryCalcs.length === 0) return null;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <h2 className={`text-md font-semibold flex items-center text-${getCategoryColor(category)}`}>
                        {getCategoryIcon(category)}
                        <span className="ml-2">{getCategoryName(category)}</span>
                      </h2>
                      <div className="grid grid-cols-2 gap-3">
                        {categoryCalcs.map(calc => renderCalculatorCard(calc))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in pb-20">
            <CalculatorDisplay
              activeCalculator={activeCalculator}
              unitSystem={unitSystem}
              onUnitSystemChange={onUnitSystemChange}
            />
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar for Mobile */}
      {activeTab === "browse" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-around py-2 z-10">
          {categories.map(category => {
            const isActive = activeCategory === category;
            return (
              <Button 
                key={category}
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center p-1 h-auto",
                  isActive && `text-${getCategoryColor(category)}`
                )}
                onClick={() => {
                  setActiveCategory(category);
                  // Scroll to the category section
                  const element = document.querySelector(`[value="${category}"]`);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                {getCategoryIcon(category)}
                <span className="text-xs mt-1">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
              </Button>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center p-1 h-auto"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Button>
        </div>
      )}
    </div>
  );
};

// Helper function to get category color
function getCategoryColor(category: CalculatorCategory): string {
  const colors: Record<CalculatorCategory, string> = {
    body: "wellness-purple",
    fitness: "wellness-blue", 
    nutrition: "wellness-green",
    wellness: "wellness-orange",
    women: "wellness-pink"
  };
  return colors[category] || "wellness-purple";
}
