import React, { useState, useEffect, useRef } from 'react';
import { CalculatorInfo, CalculatorCategory, getCategoryName } from '@/types/calculator';
import { getIconComponent } from '@/utils/iconUtils';
import { Search } from "@/components/ui/search";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';

interface CalculatorSidebarProps {
  activeCalculator: string;
  onCalculatorSelect: (calculatorId: string) => void;
  calculators: CalculatorInfo[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const CalculatorSidebar: React.FC<CalculatorSidebarProps> = ({
  activeCalculator,
  onCalculatorSelect,
  calculators,
  searchQuery,
  setSearchQuery,
}) => {
  // Create a ref for the sidebar scroll area
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Track if user has manually scrolled
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  
  // Store scroll position
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Group calculators by category
  const categories: Record<string, CalculatorInfo[]> = {};
  
  calculators
    .filter(calc => calc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    calc.category.toLowerCase().includes(searchQuery.toLowerCase()))
    .forEach(calc => {
      if (!categories[calc.category]) {
        categories[calc.category] = [];
      }
      categories[calc.category].push(calc);
    });
    
  // Keep track of scroll events
  useEffect(() => {
    const scrollContainer = sidebarRef.current;
    
    if (!scrollContainer) return;
    
    const handleScroll = () => {
      setHasUserScrolled(true);
      setScrollPosition(scrollContainer.scrollTop);
    };
    
    scrollContainer.addEventListener('scroll', handleScroll);
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Restore scroll position when component updates
  useEffect(() => {
    const scrollContainer = sidebarRef.current;
    
    if (scrollContainer && hasUserScrolled) {
      scrollContainer.scrollTop = scrollPosition;
    }
  }, [calculators, activeCalculator, hasUserScrolled, scrollPosition]);
  
  // Scroll to active calculator when it changes (only if user hasn't manually scrolled)
  useEffect(() => {
    if (hasUserScrolled) return;
    
    const activeCalcElement = document.getElementById(`calc-${activeCalculator}`);
    if (activeCalcElement) {
      activeCalcElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeCalculator, hasUserScrolled]);

  // When search query changes, reset the user scrolled state to allow automatic scrolling
  useEffect(() => {
    setHasUserScrolled(false);
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Wellness Calculators</h2>
        <Search 
          placeholder="Search calculators..." 
          value={searchQuery}
          onSearch={setSearchQuery}
          className="w-full"
          id="desktop-calculator-search"
        />
      </div>
      
      <Separator />
      
      <ScrollArea 
        className="flex-1 overflow-y-auto" 
        ref={sidebarRef}
      >
        <div className="p-2">
          {Object.keys(categories).map(category => (
            <div key={category} id={`category-${category}`} className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider px-2 py-2">
                {getCategoryName(category as CalculatorCategory)}
              </h3>
              <div className="space-y-1">
                {categories[category].map(calc => {
                  const IconComponent = getIconComponent(calc.icon);
                  // Change "Menstrual Cycle" calculator to "Period" calculator
                  const displayName = calc.id === 'menstrual' ? 'Period Calculator' : calc.name;
                  
                  return (
                    <button
                      key={calc.id}
                      id={`calc-${calc.id}`}
                      onClick={() => onCalculatorSelect(calc.id)}
                      className={cn(
                        "w-full flex items-center px-2 py-2 text-sm rounded-lg transition-colors",
                        activeCalculator === calc.id
                          ? `bg-${calc.color}/20 text-${calc.color} font-medium`
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                      )}
                    >
                      <div className={`p-1.5 rounded-md bg-${calc.color}/10 mr-3`}>
                        <IconComponent className={`h-4 w-4 text-${calc.color}`} />
                      </div>
                      <span>{displayName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
