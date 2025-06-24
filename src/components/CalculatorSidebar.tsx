import React, { useState, useEffect, useRef } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Search } from "@/components/ui/search";
import { CalculatorInfo as CalcInfo, CalculatorCategory } from '@/types/calculator';
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Menu } from "lucide-react";
import { getIconComponent, getCategoryIcon } from "@/utils/iconUtils";

interface CalculatorSidebarProps {
  activeCalculator: string;
  onCalculatorSelect: (calculatorId: string) => void;
  calculators: CalcInfo[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const CalculatorSidebar = ({ 
  activeCalculator, 
  onCalculatorSelect, 
  calculators, 
  searchQuery, 
  setSearchQuery 
}: CalculatorSidebarProps) => {
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  const filteredCalculators = searchQuery 
    ? calculators.filter(calc => 
        calc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : calculators;

  const categoryOrder: CalculatorCategory[] = ["body", "fitness", "nutrition", "wellness", "women"];
  const categoryNames: Record<CalculatorCategory, string> = {
    body: "Body Composition",
    fitness: "Fitness & Exercise",
    nutrition: "Nutrition & Diet",
    wellness: "Wellness & Lifestyle",
    women: "Women's Health"
  };

  const categoryColors: Record<CalculatorCategory, string> = {
    body: "violet-600",
    fitness: "blue-600",
    nutrition: "green-600",
    wellness: "orange-600",
    women: "pink-600"
  };

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getDisplayName = (calc: CalcInfo) => {
    if (calc.id === 'menstrualCycle' || calc.id === 'menstrual' || calc.id === 'period') {
      return 'Period Calculator';
    }
    return calc.name;
  };

  // Get calculator from URL hash if present
  useEffect(() => {
    // Get calculator from URL hash if present
    const hash = window.location.hash.substring(1);
    if (hash && calculators.some(calc => calc.id === hash)) {
      onCalculatorSelect(hash);
    }

    // Listen for calculator button clicks for iframe integration
    const handleCalculatorButtonClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const buttonId = target.id;
      
      // Map button IDs to calculator IDs
      const buttonToCalculatorMap: { [key: string]: string } = {
        'SurviveWellnessBMI': 'bmi',
        'SurviveWellnessBMR': 'bmr',
        'SurviveWellnessBodyFat': 'bodyfat',
        'SurviveWellnessIdealWeight': 'idealweight',
        'SurviveWellnessObesityRisk': 'obesity',
        'SurviveWellnessAge': 'age',
        'SurviveWellnessHeartRate': 'heartrate',
        'SurviveWellnessVO2Max': 'vo2max',
        'SurviveWellnessWorkout': 'workout',
        'SurviveWellnessSteps': 'steps',
        'SurviveWellnessMacro': 'macro',
        'SurviveWellnessWater': 'water',
        'SurviveWellnessFasting': 'fasting',
        'SurviveWellnessCalories': 'calories',
        'SurviveWellnessMealPlan': 'mealplan',
        'SurviveWellnessPregnancy': 'pregnancy',
        'SurviveWellnessAlcohol': 'alcohol',
        'SurviveWellnessSmoking': 'smoking',
        'SurviveWellnessStress': 'stress',
        'SurviveWellnessOvulation': 'ovulation',
        'SurviveWellnessDueDate': 'duedate',
        'SurviveWellnessPeriod': 'menstrual',
        'SurviveWellnessMenopause': 'menopause',
        'SurviveWellnessBreastCancer': 'breastcancer',
        'SurviveWellnessOsteoporosis': 'osteoporosis',
        'SurviveWellnessIron': 'iron'
      };

      if (buttonToCalculatorMap[buttonId]) {
        onCalculatorSelect(buttonToCalculatorMap[buttonId]);
        // Update URL hash
        window.location.hash = buttonToCalculatorMap[buttonId];
      }
    };

    // Add event listeners for all calculator buttons
    Object.keys({
      'SurviveWellnessBMI': 'bmi',
      'SurviveWellnessBMR': 'bmr',
      'SurviveWellnessBodyFat': 'bodyfat',
      'SurviveWellnessIdealWeight': 'idealweight',
      'SurviveWellnessObesityRisk': 'obesity',
      'SurviveWellnessAge': 'age',
      'SurviveWellnessHeartRate': 'heartrate',
      'SurviveWellnessVO2Max': 'vo2max',
      'SurviveWellnessWorkout': 'workout',
      'SurviveWellnessSteps': 'steps',
      'SurviveWellnessMacro': 'macro',
      'SurviveWellnessWater': 'water',
      'SurviveWellnessFasting': 'fasting',
      'SurviveWellnessCalories': 'calories',
      'SurviveWellnessMealPlan': 'mealplan',
      'SurviveWellnessPregnancy': 'pregnancy',
      'SurviveWellnessAlcohol': 'alcohol',
      'SurviveWellnessSmoking': 'smoking',
      'SurviveWellnessStress': 'stress',
      'SurviveWellnessOvulation': 'ovulation',
      'SurviveWellnessDueDate': 'duedate',
      'SurviveWellnessPeriod': 'menstrual',
      'SurviveWellnessMenopause': 'menopause',
      'SurviveWellnessBreastCancer': 'breastcancer',
      'SurviveWellnessOsteoporosis': 'osteoporosis',
      'SurviveWellnessIron': 'iron'
    }).forEach(buttonId => {
      const button = document.getElementById(buttonId);
      if (button) {
        button.addEventListener('click', handleCalculatorButtonClick);
      }
    });

    // Cleanup event listeners
    return () => {
      Object.keys({
        'SurviveWellnessBMI': 'bmi',
        'SurviveWellnessBMR': 'bmr',
        'SurviveWellnessBodyFat': 'bodyfat',
        'SurviveWellnessIdealWeight': 'idealweight',
        'SurviveWellnessObesityRisk': 'obesity',
        'SurviveWellnessAge': 'age',
        'SurviveWellnessHeartRate': 'heartrate',
        'SurviveWellnessVO2Max': 'vo2max',
        'SurviveWellnessWorkout': 'workout',
        'SurviveWellnessSteps': 'steps',
        'SurviveWellnessMacro': 'macro',
        'SurviveWellnessWater': 'water',
        'SurviveWellnessFasting': 'fasting',
        'SurviveWellnessCalories': 'calories',
        'SurviveWellnessMealPlan': 'mealplan',
        'SurviveWellnessPregnancy': 'pregnancy',
        'SurviveWellnessAlcohol': 'alcohol',
        'SurviveWellnessSmoking': 'smoking',
        'SurviveWellnessStress': 'stress',
        'SurviveWellnessOvulation': 'ovulation',
        'SurviveWellnessDueDate': 'duedate',
        'SurviveWellnessPeriod': 'menstrual',
        'SurviveWellnessMenopause': 'menopause',
        'SurviveWellnessBreastCancer': 'breastcancer',
        'SurviveWellnessOsteoporosis': 'osteoporosis',
        'SurviveWellnessIron': 'iron'
      }).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
          button.removeEventListener('click', handleCalculatorButtonClick);
        }
      });
    };
  }, [onCalculatorSelect, calculators]);

  // Determine which category contains the active calculator and expand it
  useEffect(() => {
    if (!activeCalculator) return;
    
    const activeCalc = calculators.find(calc => calc.id === activeCalculator);
    if (activeCalc) {
      let category = activeCalc.category;
      if (activeCalc.id === 'pregnancy' || activeCalc.id === 'pregnancyweight') {
        category = 'women';
      }
      
      setCollapsedCategories(prev => ({
        ...prev,
        [category]: false,
      }));
    }
  }, [activeCalculator, calculators]);

  // Mobile sidebar
  const MobileSidebar = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0">
        <div className="p-4 pb-2">
          <Search 
            placeholder="Search calculators..." 
            value={searchQuery}
            onSearch={setSearchQuery}
          />
        </div>
        <div className="px-2 py-2 h-[85vh] overflow-y-auto" ref={sidebarRef}>
          {categoryOrder.map(category => {
            const CategoryIcon = getCategoryIcon(category);
            const isCollapsed = collapsedCategories[category];
            
            return (
              <div key={category} className="mb-2" id={`mobile-category-${category}`}>
                <div 
                  className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => toggleCategory(category)}
                >
                  <div className={`flex items-center text-${categoryColors[category]}`}>
                    <CategoryIcon className="h-4 w-4 mr-2" />
                    <span className="font-medium">{categoryNames[category]}</span>
                  </div>
                  {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </div>
                
                {!isCollapsed && (
                  <div className="ml-2">
                    {filteredCalculators
                      .filter(calc => {
                        if (calc.id === 'pregnancy' || calc.id === 'pregnancyweight') {
                          return category === 'women';
                        }
                        return calc.category === category;
                      })
                      .map(calculator => {
                        const IconComponent = getIconComponent(calculator.icon);
                        const isActive = activeCalculator === calculator.id;
                        const displayName = getDisplayName(calculator);
                        
                        return (
                        <button
                          key={calculator.id}
                          id={`mobile-calc-${calculator.id}`}
                          ref={isActive ? activeItemRef : null}
                          onClick={() => onCalculatorSelect(calculator.id)}
                          className={cn(
                            "w-full text-left px-3 py-1.5 text-sm rounded-md flex items-center my-1 transition-colors",
                            isActive
                              ? `bg-${calculator.color}/20 text-${calculator.color}`
                              : "hover:bg-gray-100"
                          )}
                        >
                          <IconComponent className="h-4 w-4 mr-2 text-gray-500" />
                          {displayName}
                        </button>
                      )})}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );

  // Desktop sidebar with stable layout
  const DesktopSidebar = () => (
    <div className="h-full bg-[#F9F7FD] rounded-xl shadow-md border border-violet-100 flex flex-col overflow-hidden">
      {/* Fixed Search Section */}
      <div className="flex-shrink-0 p-4 border-b border-violet-100">
        <Search 
          placeholder="Search calculators..." 
          value={searchQuery}
          onSearch={setSearchQuery}
          className="rounded-lg border-violet-200 focus:border-violet-400"
        />
      </div>
      
      {/* Scrollable Categories */}
      <div className="flex-1 overflow-y-auto px-2 py-4" ref={sidebarRef}>
        {categoryOrder.map(category => {
          const CategoryIcon = getCategoryIcon(category);
          const isGroupCollapsed = collapsedCategories[category];
          
          return (
            <div key={category} className="mb-4" id={`desktop-category-${category}`}>
              {/* Category Header */}
              <div 
                className="flex items-center justify-between p-3 cursor-pointer rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 group"
                onClick={() => toggleCategory(category)}
              >
                <div className={`flex items-center font-['Poppins'] font-semibold text-${categoryColors[category]}`}>
                  <CategoryIcon className="h-5 w-5 mr-3" />
                  <span className="text-sm">{categoryNames[category]}</span>
                </div>
                <div className="text-gray-400 group-hover:text-violet-500 transition-colors">
                  {isGroupCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </div>
              </div>
              
              {/* Calculator Items */}
              {!isGroupCollapsed && (
                <div className="ml-4 space-y-1">
                  {filteredCalculators
                    .filter(calc => {
                      if (calc.id === 'pregnancy' || calc.id === 'pregnancyweight') {
                        return category === 'women';
                      }
                      return calc.category === category;
                    })
                    .map(calculator => {
                      const IconComponent = getIconComponent(calculator.icon);
                      const isActive = activeCalculator === calculator.id;
                      const displayName = getDisplayName(calculator);
                      
                      return (
                        <button
                          key={calculator.id}
                          id={`desktop-calc-${calculator.id}`}
                          ref={isActive ? activeItemRef : null}
                          onClick={() => onCalculatorSelect(calculator.id)}
                          className={cn(
                            "w-full text-left px-3 py-2.5 text-sm rounded-lg flex items-center transition-all duration-200 font-['Poppins']",
                            isActive
                              ? "bg-violet-100 text-violet-700 shadow-sm border border-violet-200"
                              : "hover:bg-white hover:shadow-sm text-gray-700 hover:text-violet-600"
                          )}
                        >
                          <IconComponent className="h-4 w-4 mr-3 flex-shrink-0" />
                          <span className="truncate">{displayName}</span>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <MobileSidebar />
      <div className="hidden md:block h-full">
        <DesktopSidebar />
      </div>
    </>
  );
};
