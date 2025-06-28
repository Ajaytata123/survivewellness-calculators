
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
  highlightedCategory?: string;
  onCategoryHighlight?: (category: string | undefined) => void;
}

export const CalculatorSidebar = ({ 
  activeCalculator, 
  onCalculatorSelect, 
  calculators, 
  searchQuery, 
  setSearchQuery,
  highlightedCategory,
  onCategoryHighlight
}: CalculatorSidebarProps) => {
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const getDisplayName = (calc: CalcInfo) => {
    if (calc.id === 'menstrualCycle' || calc.id === 'menstrual' || calc.id === 'period') {
      return 'Period Calculator';
    }
    return calc.name;
  };

  // Enhanced search with better error handling
  const getFilteredCalculators = () => {
    if (!searchQuery.trim()) {
      return calculators;
    }

    try {
      const searchLower = searchQuery.toLowerCase().trim();
      
      return calculators.filter(calc => {
        const calcName = calc.name.toLowerCase();
        const displayName = getDisplayName(calc).toLowerCase();
        
        // Special handling for Period Calculator search
        if (searchLower.includes('period') || searchLower === 'p') {
          if (calc.id === 'menstrualCycle' || calc.id === 'menstrual' || calc.id === 'ovulation') {
            return true;
          }
        }
        
        return calcName.includes(searchLower) || displayName.includes(searchLower);
      });
    } catch (error) {
      console.error('Search filtering error:', error);
      return calculators;
    }
  };

  const filteredCalculators = getFilteredCalculators();

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

  // Improved scroll function with debouncing to prevent jumping
  const scrollToActiveItem = (immediate = false) => {
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const performScroll = () => {
      if (activeItemRef.current && sidebarRef.current) {
        const activeElement = activeItemRef.current;
        const sidebarElement = sidebarRef.current;
        
        // Get positions
        const sidebarRect = sidebarElement.getBoundingClientRect();
        const activeRect = activeElement.getBoundingClientRect();
        
        // Calculate if element is in view with more tolerance
        const tolerance = 100;
        const isInView = activeRect.top >= sidebarRect.top + tolerance && 
                         activeRect.bottom <= sidebarRect.bottom - tolerance;
        
        // Only scroll if not in view
        if (!isInView) {
          const relativeTop = activeRect.top - sidebarRect.top + sidebarElement.scrollTop;
          const targetScrollTop = relativeTop - (sidebarElement.clientHeight / 2) + (activeRect.height / 2);
          
          sidebarElement.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: immediate ? 'auto' : 'smooth'
          });
        }
      }
    };

    if (immediate) {
      performScroll();
    } else {
      // Debounce scroll to prevent jumping
      scrollTimeoutRef.current = setTimeout(performScroll, 100);
    }
  };

  // Scroll to category when highlighted via breadcrumb - without jumping to top
  const scrollToCategory = (category: string) => {
    const categoryElement = categoryRefs.current[category];
    if (categoryElement && sidebarRef.current) {
      const sidebarElement = sidebarRef.current;
      const categoryRect = categoryElement.getBoundingClientRect();
      const sidebarRect = sidebarElement.getBoundingClientRect();
      
      // Calculate if category is already visible
      const isVisible = categoryRect.top >= sidebarRect.top && 
                       categoryRect.bottom <= sidebarRect.bottom;
      
      // Only scroll if not visible
      if (!isVisible) {
        const relativeTop = categoryRect.top - sidebarRect.top + sidebarElement.scrollTop;
        const targetScrollTop = Math.max(0, relativeTop - 100);
        
        sidebarElement.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
      
      // Expand the category if collapsed
      setCollapsedCategories(prev => ({
        ...prev,
        [category]: false
      }));
    }
  };

  // Handle category highlighting from breadcrumb
  useEffect(() => {
    if (highlightedCategory) {
      scrollToCategory(highlightedCategory);
      
      // Clear highlight after 3 seconds
      const timer = setTimeout(() => {
        onCategoryHighlight?.(undefined);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [highlightedCategory, onCategoryHighlight]);

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
      
      // Scroll to active item after a delay with improved timing
      setTimeout(() => {
        scrollToActiveItem();
      }, 200);
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
            const isHighlighted = highlightedCategory === category;
            
            return (
              <div key={category} className="mb-2">
                <div 
                  className={cn(
                    "flex items-center justify-between p-2 cursor-pointer rounded-md transition-colors",
                    isHighlighted 
                      ? "bg-violet-100 border-2 border-violet-300" 
                      : "hover:bg-gray-100"
                  )}
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
                              ? "bg-violet-100 text-violet-700"
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

  // Desktop sidebar with enhanced scroll stability and thinner scrollbar
  const DesktopSidebar = () => (
    <div className="h-full flex flex-col overflow-hidden bg-[#F9F7FD] rounded-xl shadow-md border border-violet-100">
      {/* Fixed Search Section */}
      <div className="flex-shrink-0 p-4 border-b border-violet-100">
        <Search 
          placeholder="Search calculators..." 
          value={searchQuery}
          onSearch={setSearchQuery}
          className="rounded-lg border-violet-200 focus:border-violet-400"
        />
      </div>
      
      {/* Scrollable Categories with custom thin scrollbar */}
      <div 
        className="flex-1 overflow-y-auto px-2 py-4" 
        style={{ 
          height: 'calc(100vh - 200px)',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(139, 92, 246, 0.3) rgba(0, 0, 0, 0.05)'
        }}
        ref={sidebarRef}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            .custom-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(0, 0, 0, 0.05);
              border-radius: 2px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(139, 92, 246, 0.3);
              border-radius: 2px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(139, 92, 246, 0.5);
            }
          `
        }} />
        
        {categoryOrder.map(category => {
          const CategoryIcon = getCategoryIcon(category);
          const isGroupCollapsed = collapsedCategories[category];
          const isHighlighted = highlightedCategory === category;
          
          return (
            <div 
              key={category} 
              className="mb-4" 
              id={`desktop-category-${category}`}
              ref={el => categoryRefs.current[category] = el}
            >
              {/* Category Header with highlighting */}
              <div 
                className={cn(
                  "flex items-center justify-between p-3 cursor-pointer rounded-lg transition-all duration-200 group",
                  isHighlighted 
                    ? "bg-violet-100 border-2 border-violet-300 shadow-sm" 
                    : "hover:bg-white hover:shadow-sm"
                )}
                onClick={() => toggleCategory(category)}
              >
                <div className={`flex items-center font-['Poppins'] font-semibold text-${categoryColors[category]}`}>
                  <CategoryIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="text-sm">{categoryNames[category]}</span>
                </div>
                <div className="text-gray-400 group-hover:text-violet-500 transition-colors flex-shrink-0">
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <MobileSidebar />
      <div className="hidden md:block h-full">
        <DesktopSidebar />
      </div>
    </>
  );
};
