
import React from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Search } from "@/components/ui/search";
import { CalculatorInfo as CalcInfo } from '@/types/calculator';
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

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
  const filteredCalculators = searchQuery 
    ? calculators.filter(calc => 
        calc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : calculators;

  const categoryOrder: ("body" | "fitness" | "nutrition" | "wellness" | "women")[] = ["body", "fitness", "nutrition", "wellness", "women"];
  const categoryNames: Record<"body" | "fitness" | "nutrition" | "wellness" | "women", string> = {
    body: "Body Composition",
    fitness: "Fitness & Exercise",
    nutrition: "Nutrition & Diet",
    wellness: "Wellness & Lifestyle",
    women: "Women's Health"
  };

  const categoryColors: Record<"body" | "fitness" | "nutrition" | "wellness" | "women", string> = {
    body: "wellness-purple",
    fitness: "wellness-blue",
    nutrition: "wellness-green",
    wellness: "wellness-orange",
    women: "wellness-pink"
  };
  
  // Mobile sidebar
  const MobileSidebar = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] p-0">
        <div className="p-4 pb-2">
          <Search 
            placeholder="Search calculators..." 
            value={searchQuery}
            onSearch={setSearchQuery}
          />
        </div>
        <div className="px-2 py-2">
          {categoryOrder.map(category => (
            <div key={category} className="mb-4">
              <h3 className={`text-sm font-medium mb-1 text-${categoryColors[category]} px-3`}>
                {categoryNames[category]}
              </h3>
              <div className="space-y-1">
                {filteredCalculators
                  .filter(calc => calc.category === category)
                  .map(calculator => (
                    <button
                      key={calculator.id}
                      onClick={() => onCalculatorSelect(calculator.id)}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-sm rounded-md",
                        activeCalculator === calculator.id
                          ? `bg-${calculator.color} text-white`
                          : "hover:bg-gray-100"
                      )}
                    >
                      {calculator.name}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );

  // Desktop sidebar
  const DesktopSidebar = () => (
    <SidebarProvider defaultOpen={true}>
      <Sidebar className="hidden md:flex border-r">
        <SidebarContent>
          <SidebarGroup>
            <div className="px-2 pt-2 pb-4">
              <Search 
                placeholder="Search calculators..." 
                value={searchQuery}
                onSearch={setSearchQuery}
              />
            </div>
            {categoryOrder.map(category => (
              <React.Fragment key={category}>
                <SidebarGroupLabel className={`text-${categoryColors[category]}`}>
                  {categoryNames[category]}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {filteredCalculators
                      .filter(calc => calc.category === category)
                      .map(calculator => (
                        <SidebarMenuItem key={calculator.id}>
                          <SidebarMenuButton
                            onClick={() => onCalculatorSelect(calculator.id)}
                            isActive={activeCalculator === calculator.id}
                          >
                            <span>{calculator.name}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </React.Fragment>
            ))}
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
