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
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);
  
  // Track which category contains the active calculator
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
    body: "wellness-purple",
    fitness: "wellness-blue",
    nutrition: "wellness-green",
    wellness: "wellness-orange",
    women: "wellness-pink"
  };

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Determine which category contains the active calculator and expand it
  useEffect(() => {
    if (!activeCalculator) return;
    
    const activeCalc = calculators.find(calc => calc.id === activeCalculator);
    if (activeCalc) {
      let category = activeCalc.category;
      // Move pregnancy calculator to women's health
      if (activeCalc.id === 'pregnancy') {
        category = 'women';
      }
      
      setActiveCategory(category);
      
      // Ensure the category containing the active calculator is expanded
      setCollapsedCategories(prev => ({
        ...prev,
        [category]: false, // Make sure it's not collapsed
      }));
    }
  }, [activeCalculator, calculators]);

  // Fixed scroll behavior - prevent jumping to top and maintain position
  useEffect(() => {
    if (activeItemRef.current && sidebarRef.current) {
      const sidebar = sidebarRef.current;
      const activeItem = activeItemRef.current;
      
      // Get current scroll position
      const currentScrollTop = sidebar.scrollTop;
      const sidebarHeight = sidebar.clientHeight;
      const activeItemTop = activeItem.offsetTop;
      const activeItemHeight = activeItem.offsetHeight;
      
      // Check if active item is visible in viewport
      const itemVisibleTop = activeItemTop - currentScrollTop;
      const itemVisibleBottom = itemVisibleTop + activeItemHeight;
      
      // Only scroll if item is not fully visible
      if (itemVisibleTop < 100 || itemVisibleBottom > sidebarHeight - 100) {
        const targetScroll = Math.max(0, activeItemTop - (sidebarHeight / 2) + (activeItemHeight / 2));
        
        // Use smooth scrolling with reduced movement
        sidebar.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }
    }
  }, [activeCalculator]); // Only depend on activeCalculator
  
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
        <div className="px-2 py-2 overflow-y-auto max-h-[85vh]" ref={sidebarRef}>
          {categoryOrder.map(category => {
            const CategoryIcon = getCategoryIcon(category);
            const isCollapsed = collapsedCategories[category];
            
            return (
              <div key={category} className="sidebar-category mb-2" id={`mobile-category-${category}`}>
                <div 
                  className="sidebar-category-header flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={() => toggleCategory(category)}
                >
                  <div className={`flex items-center text-${categoryColors[category]}`}>
                    <CategoryIcon className="h-4 w-4 mr-2" />
                    <span className="font-medium">{categoryNames[category]}</span>
                  </div>
                  {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </div>
                
                {!isCollapsed && (
                  <div className="sidebar-category-content">
                    {filteredCalculators
                      .filter(calc => {
                        // Move pregnancy calculator to women's health
                        if (calc.id === 'pregnancy') {
                          return category === 'women';
                        }
                        return calc.category === category;
                      })
                      .map(calculator => {
                        const IconComponent = getIconComponent(calculator.icon);
                        const isActive = activeCalculator === calculator.id;
                        // Rename "Menstrual Cycle" to "Period" calculator
                        const displayName = calculator.id === 'menstrual' ? 'Period Calculator' : calculator.name;
                        
                        return (
                        <button
                          key={calculator.id}
                          id={`mobile-calc-${calculator.id}`}
                          ref={isActive ? activeItemRef : null}
                          onClick={() => onCalculatorSelect(calculator.id)}
                          className={cn(
                            "w-full text-left px-3 py-1.5 text-sm rounded-md flex items-center my-1",
                            isActive
                              ? `bg-${calculator.color}/20 text-${calculator.color}`
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
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

  // Desktop sidebar
  const DesktopSidebar = () => (
    <SidebarProvider defaultOpen={!isCollapsed}>
      <Sidebar className={cn(
        "hidden md:flex border-r transition-all duration-300",
        isCollapsed ? "md:w-16" : "md:w-64"
      )}>
        <SidebarContent>
          <SidebarGroup>
            {!isCollapsed && (
              <div className="px-2 pt-2 pb-4">
                <Search 
                  placeholder="Search calculators..." 
                  value={searchQuery}
                  onSearch={setSearchQuery}
                />
              </div>
            )}
            <div className="absolute right-0 top-2 transform translate-x-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 rounded-full bg-white dark:bg-gray-800 border shadow-sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                id="toggle-sidebar"
              >
                {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
              </Button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(100vh-100px)] relative" ref={sidebarRef}>
              {categoryOrder.map(category => {
                const CategoryIcon = getCategoryIcon(category);
                const isGroupCollapsed = collapsedCategories[category];
                
                return (
                  <div key={category} className="sidebar-category mb-1" id={`desktop-category-${category}`}>
                    <div 
                      className={cn(
                        "flex items-center justify-between p-2 cursor-pointer",
                        isCollapsed ? "justify-center" : "",
                        `hover:bg-${categoryColors[category]}/10 rounded-md`
                      )}
                      onClick={() => !isCollapsed && toggleCategory(category)}
                    >
                      <div className={cn(
                        "flex items-center",
                        `text-${categoryColors[category]}`,
                        isCollapsed ? "justify-center" : ""
                      )}>
                        <CategoryIcon className="h-5 w-5" />
                        {!isCollapsed && <span className="ml-2 font-medium">{categoryNames[category]}</span>}
                      </div>
                      {!isCollapsed && (
                        isGroupCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />
                      )}
                    </div>
                    
                    {!isGroupCollapsed && (
                      <div className="sidebar-category-content">
                        {filteredCalculators
                          .filter(calc => {
                            // Move pregnancy calculator to women's health
                            if (calc.id === 'pregnancy') {
                              return category === 'women';
                            }
                            return calc.category === category;
                          })
                          .map(calculator => {
                            const IconComponent = getIconComponent(calculator.icon);
                            const isActive = activeCalculator === calculator.id;
                            // Rename "Menstrual Cycle" to "Period" calculator
                            const displayName = calculator.id === 'menstrual' ? 'Period Calculator' : calculator.name;
                            
                            return (
                              <button
                                key={calculator.id}
                                id={`desktop-calc-${calculator.id}`}
                                ref={isActive ? activeItemRef : null}
                                onClick={() => onCalculatorSelect(calculator.id)}
                                className={cn(
                                  "w-full text-left px-3 py-1.5 text-sm rounded-md flex items-center my-1",
                                  isCollapsed ? "justify-center" : "",
                                  isActive
                                    ? `bg-${calculator.color}/20 text-${calculator.color}`
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                )}
                              >
                                <IconComponent className={cn("h-4 w-4", isCollapsed ? "" : "mr-2")} />
                                {!isCollapsed && <span>{displayName}</span>}
                              </button>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
};
