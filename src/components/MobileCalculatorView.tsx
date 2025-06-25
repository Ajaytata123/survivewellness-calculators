
import React, { useState, useEffect } from 'react';
import { Search } from "@/components/ui/search";
import { CalculatorInfo, CalculatorCategory, getCategoryName } from '@/types/calculator';
import CalculatorDisplay from './CalculatorDisplay';
import { UnitSystem } from '@/types/calculatorTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { getIconComponent, getCategoryIcon } from '@/utils/iconUtils';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const getDisplayName = (calc: CalculatorInfo) => {
    if (calc.id === 'menstrualCycle' || calc.id === 'menstrual' || calc.id === 'period') {
      return 'Period Calculator';
    }
    return calc.name;
  };

  const getFilteredCalculators = () => {
    if (!searchQuery.trim()) {
      return calculators;
    }

    try {
      const searchLower = searchQuery.toLowerCase().trim();
      
      return calculators.filter(calc => {
        const calcName = calc.name.toLowerCase();
        const displayName = getDisplayName(calc).toLowerCase();
        const categoryName = getCategoryName(calc.category).toLowerCase();
        
        if (searchLower.includes('period') || searchLower === 'p') {
          if (calc.id === 'menstrualCycle' || calc.id === 'menstrual' || calc.id === 'ovulation') {
            return true;
          }
        }
        
        return calcName.includes(searchLower) || 
               displayName.includes(searchLower) ||
               categoryName.includes(searchLower);
      });
    } catch (error) {
      console.error('Search filtering error:', error);
      return calculators;
    }
  };

  const filteredCalculators = getFilteredCalculators();
  const activeCalcInfo = calculators.find(calc => calc.id === activeCalculator);

  const handleCalculatorSelect = (id: string) => {
    onCalculatorSelect(id);
    setActiveTab("calculator");
  };

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
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

  const renderCalculatorCard = (calc: CalculatorInfo) => {
    const IconComponent = getIconComponent(calc.icon);
    const displayName = getDisplayName(calc);
    
    return (
      <div 
        key={calc.id}
        className={cn(
          "p-4 border rounded-lg shadow-sm cursor-pointer transition-all",
          activeCalculator === calc.id 
            ? "border-violet-500 bg-violet-50" 
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

  const calculatorsByCategory = React.useMemo(() => {
    const grouped: Record<CalculatorCategory, CalculatorInfo[]> = {
      body: [],
      fitness: [],
      nutrition: [],
      wellness: [],
      women: []
    };

    filteredCalculators.forEach(calc => {
      if (calc.id === 'pregnancy' || calc.id === 'pregnancyweight') {
        grouped.women.push(calc);
      } else {
        grouped[calc.category].push(calc);
      }
    });

    return grouped;
  }, [filteredCalculators]);

  return (
    <div className="h-screen w-full bg-white flex flex-col">
      <div className="flex-shrink-0 bg-white shadow-sm border-b p-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "browse" | "calculator")} className="w-auto">
          <TabsList className="grid w-[180px] grid-cols-2">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {activeTab === "browse" && (
          <Search 
            placeholder="Search calculators..." 
            value={searchQuery}
            onSearch={setSearchQuery}
            className="w-full mt-4"
          />
        )}
        
        {activeTab === "calculator" && activeCalcInfo && (
          <div className="space-y-2 mt-4">
            <div className="flex items-center space-x-2 px-1">
              <button 
                onClick={() => setActiveTab("browse")}
                className="text-sm text-violet-600 hover:underline flex items-center font-medium"
                aria-label="Back to calculator list"
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

      <div className="flex-1 overflow-hidden">
        {activeTab === "browse" ? (
          <div className="h-full overflow-y-auto p-4">
            {!searchQuery ? (
              <div className="space-y-4">
                {categories.map((category) => {
                  const CategoryIcon = getCategoryIcon(category);
                  return (
                    <div key={category} className="border rounded-lg overflow-hidden">
                      <div 
                        className={`flex items-center justify-between p-3 cursor-pointer ${getCategoryColor(category)}`}
                        onClick={() => toggleCategory(category)}
                      >
                        <div className="flex items-center">
                          <CategoryIcon className="h-5 w-5 mr-2" />
                          <span className="font-medium">{getCategoryName(category)}</span>
                        </div>
                        {collapsedCategories[category] ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronUp className="h-4 w-4" />
                        }
                      </div>
                      
                      {!collapsedCategories[category] && (
                        <div className="p-3">
                          <div className="grid grid-cols-2 gap-3">
                            {calculatorsByCategory[category].map(calc => renderCalculatorCard(calc))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                {categories.map(category => {
                  const categoryCalcs = calculatorsByCategory[category];
                  if (categoryCalcs.length === 0) return null;
                  
                  const CategoryIcon = getCategoryIcon(category);
                  return (
                    <div key={category} className="space-y-2">
                      <h2 className={`text-md font-semibold flex items-center px-2 py-1 rounded ${getCategoryColor(category)}`}>
                        <CategoryIcon className="h-5 w-5 mr-2" />
                        <span>{getCategoryName(category)}</span>
                      </h2>
                      <div className="grid grid-cols-2 gap-3">
                        {categoryCalcs.map(calc => renderCalculatorCard(calc))}
                      </div>
                    </div>
                  );
                })}
                
                {filteredCalculators.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No calculators found matching "{searchQuery}"</p>
                  </div>
                )}
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
