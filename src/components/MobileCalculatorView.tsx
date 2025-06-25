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
  const [activeTab, setActiveTab] = useState<"browse" | "calculator">("browse");
  const [filteredCategories, setFilteredCategories] = useState<CalculatorCategory[]>(categories);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    body: true,
    fitness: true,
    nutrition: true,
    wellness: true,
    women: true
  });

  // Enhanced search to include "Period" for menstrual/ovulation calculators
  const filteredCalculators = calculators.filter(calc => {
    const searchLower = searchQuery.toLowerCase();
    const calcName = calc.name.toLowerCase();
    const displayName = getDisplayName(calc).toLowerCase();
    
    // Special handling for Period Calculator search
    if (searchLower.includes('period') || searchLower.includes('p')) {
      if (calc.id === 'menstrualCycle' || calc.id === 'menstrual' || calc.id === 'ovulation') {
        return true;
      }
    }
    
    return calcName.includes(searchLower) || 
           displayName.includes(searchLower) ||
           calc.category.toLowerCase().includes(searchLower);
  });

  const activeCalcInfo = calculators.find(calc => calc.id === activeCalculator);

  const getDisplayName = (calc: CalculatorInfo) => {
    if (calc.id === 'menstrualCycle' || calc.id === 'menstrual' || calc.id === 'period') {
      return 'Period Calculator';
    }
    return calc.name;
  };

  useEffect(() => {
    if (!searchQuery) {
      setFilteredCategories(categories);
      return;
    }

    const matchingCategories = Array.from(new Set(
      filteredCalculators.map(calc => calc.category)
    )) as CalculatorCategory[];

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

    if (matchingCategories.length > 0 && !matchingCategories.includes(categories[0])) {
      // Keep current expanded state
    }
  }, [searchQuery, calculators]);

  // When a calculator is selected, switch to calculator tab
  const handleCalculatorSelect = (id: string) => {
    onCalculatorSelect(id);
    setActiveTab("calculator");
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

  // Function to render calculator cards
  const renderCalculatorCard = (calc: CalculatorInfo) => {
    const IconComponent = getIconComponent(calc.icon);
    const displayName = getDisplayName(calc);
    
    return (
      <div 
        key={calc.id}
        id={`mobile-calc-${calc.id}`}
        className={cn(
          "p-4 border rounded-lg shadow-sm cursor-pointer transition-all",
          activeCalculator === calc.id 
            ? `border-violet-500 bg-violet-50` 
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        )}
        onClick={() => handleCalculatorSelect(calc.id)}
      >
        <div className="flex flex-col items-center text-center">
          <div className="p-3 rounded-full bg-violet-100 mb-2">
            <IconComponent className="h-6 w-6 text-violet-600" />
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

  const getCategoryColor = (category: CalculatorCategory): string => {
    const colors: Record<CalculatorCategory, string> = {
      body: "bg-violet-100 text-violet-700",
      fitness: "bg-blue-100 text-blue-700", 
      nutrition: "bg-green-100 text-green-700",
      wellness: "bg-orange-100 text-orange-700",
      women: "bg-pink-100 text-pink-700"
    };
    return colors[category] || "bg-violet-100 text-violet-700";
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white shadow-sm border-b p-4">
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
                className="text-sm text-violet-600 hover:underline flex items-center font-medium"
                aria-label="Back to calculator list"
                id="mobile-back-button"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </button>
              <Separator orientation="vertical" className="h-4" />
              <span className="font-medium text-gray-800">
                {getDisplayName(activeCalcInfo)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "browse" ? (
          <div className="h-full overflow-y-auto p-4">
            {!searchQuery ? (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category} 
                       id={`mobile-category-${category}`}
                       className="border rounded-lg overflow-hidden">
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
                      <h2 className={`text-md font-semibold flex items-center ${getCategoryColor(category)}`}>
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
          <div className="h-full overflow-y-auto bg-white">
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
