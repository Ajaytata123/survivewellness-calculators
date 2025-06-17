
import React, { useState, useEffect } from 'react';
import { Search } from "@/components/ui/search";
import { CalculatorInfo, CalculatorCategory, getCategoryName } from '@/types/calculator';
import CalculatorDisplay from './CalculatorDisplay';
import { UnitSystem } from '@/types/calculatorTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { getIconComponent } from '@/utils/iconUtils';
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
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    body: true,
    fitness: true,
    nutrition: true,
    wellness: true,
    women: true
  });

  // Filter calculators based on search query
  const filteredCalculators = calculators.filter(calc => 
    calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    calc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCalcInfo = calculators.find(calc => calc.id === activeCalculator);

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

  // When a calculator is selected, automatically switch to calculator tab and scroll to top
  const handleCalculatorSelect = (id: string) => {
    onCalculatorSelect(id);
    setActiveTab("calculator");
    
    // Immediately scroll to top and ensure calculator content is visible from beginning
    setTimeout(() => {
      // Scroll page to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Scroll mobile container to top
      const mobileContainer = document.querySelector('.mobile-calculator-container');
      if (mobileContainer) {
        mobileContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      // Also scroll the calculator display container to top
      const calculatorContent = document.querySelector('.calculator-content');
      if (calculatorContent) {
        calculatorContent.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

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

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Function to render calculator cards with proper IDs
  const renderCalculatorCard = (calc: CalculatorInfo) => {
    const IconComponent = getIconComponent(calc.icon);
    // Rename "Menstrual Cycle" to "Period" calculator
    const displayName = calc.id === 'menstrualCycle' || calc.id === 'menstrual' ? 'Period Calculator' : calc.name;
    
    return (
      <div 
        key={calc.id}
        id={`mobile-calc-${calc.id}`}
        className={cn(
          "p-4 border rounded-lg shadow-sm cursor-pointer transition-all",
          activeCalculator === calc.id 
            ? `border-${calc.color} bg-${calc.color}/10` 
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800/50"
        )}
        onClick={() => handleCalculatorSelect(calc.id)}
      >
        <div className="flex flex-col items-center text-center">
          <div className={`p-3 rounded-full bg-${calc.color}/20 mb-2`}>
            <IconComponent className={`h-6 w-6 text-${calc.color}`} />
          </div>
          <h3 className="font-medium text-sm">{displayName}</h3>
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
    <div className="flex flex-col w-full h-full mobile-calculator-container">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm p-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "browse" | "calculator")} className="w-auto">
          <TabsList className="grid w-[180px] grid-cols-2">
            <TabsTrigger value="browse" id="mobile-browse-tab">Browse</TabsTrigger>
            <TabsTrigger value="calculator" id="mobile-calculator-tab">Calculator</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {activeTab === "browse" && (
          <Search 
            placeholder="Search calculators..." 
            value={searchQuery}
            onSearch={setSearchQuery}
            className="w-full mt-4"
            id="mobile-calculator-search"
          />
        )}
        
        {activeTab === "calculator" && activeCalcInfo && (
          <div className="space-y-2 mt-4">
            <div className="flex items-center space-x-2 px-1">
              <button 
                onClick={() => setActiveTab("browse")}
                className="text-sm text-wellness-purple hover:underline flex items-center"
                aria-label="Back to calculator list"
                id="mobile-back-button"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </button>
              <Separator orientation="vertical" className="h-4" />
              <span className="font-medium">
                {activeCalcInfo.id === 'menstrualCycle' || activeCalcInfo.id === 'menstrual' ? 'Period Calculator' : activeCalcInfo.name}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 pb-16 overflow-y-auto calculator-content">
        {activeTab === "browse" ? (
          <div className="animate-fade-in">
            {!searchQuery ? (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category} 
                       id={`mobile-category-${category}`}
                       className="border rounded-lg overflow-hidden dark:border-gray-700">
                    <div 
                      className={`flex items-center justify-between p-3 cursor-pointer ${getCategoryColor(category)}`}
                      onClick={() => toggleCategory(category)}
                    >
                      <div className="flex items-center">
                        {getCategoryIcon(category)}
                        <span className="ml-2 font-medium">{getCategoryName(category)}</span>
                      </div>
                      <ChevronLeft className={`h-4 w-4 transform transition-transform ${expandedCategories[category] ? 'rotate-90' : '-rotate-90'}`} />
                    </div>
                    
                    {expandedCategories[category] && (
                      <div className="p-3">
                        <div className="grid grid-cols-2 gap-3">
                          {calculators
                            .filter(calc => {
                              // Move pregnancy calculator to women's health
                              if (calc.id === 'pregnancy' || calc.id === 'pregnancyweight') {
                                return category === 'women';
                              }
                              return calc.category === category;
                            })
                            .map(calc => renderCalculatorCard(calc))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
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

// Helper function to get category color
function getCategoryColor(category: CalculatorCategory): string {
  const colors: Record<CalculatorCategory, string> = {
    body: "bg-wellness-softPurple/30 text-wellness-purple",
    fitness: "bg-wellness-softBlue/30 text-wellness-blue", 
    nutrition: "bg-wellness-softGreen/30 text-wellness-green",
    wellness: "bg-wellness-softOrange/30 text-wellness-orange",
    women: "bg-wellness-softPink/30 text-wellness-pink"
  };
  return colors[category] || "bg-wellness-softPurple/30 text-wellness-purple";
}
