
import React from 'react';
import { Search } from "@/components/ui/search";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";
import { CalculatorInfo } from './WellnessCalculatorHub';
import CalculatorDisplay from './CalculatorDisplay';
import { UnitSystem } from '@/types/calculatorTypes';
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
  const categories = Array.from(new Set(calculators.map(calc => calc.category)));
  const [activeCategory, setActiveCategory] = React.useState(categories[0]);

  const filteredCalculators = calculators.filter(calc => 
    calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    calc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryCalculators = calculators.filter(calc => calc.category === activeCategory);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="sticky top-0 z-10 bg-white shadow-sm p-4 space-y-4">
        <Search 
          placeholder="Search calculators..." 
          value={searchQuery}
          onSearch={setSearchQuery}
          className="w-full"
        />
        
        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-2 min-w-min">
            {categories.map(category => {
              const Icon = Icons[categoryIcons[category]];
              return (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  className={cn(
                    "whitespace-nowrap min-w-[80%] justify-start",
                    activeCategory === category && "bg-wellness-purple text-white"
                  )}
                  onClick={() => setActiveCategory(category)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {categoryNames[category]}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        {searchQuery ? (
          <div className="space-y-4">
            {filteredCalculators.map(calc => {
              const Icon = Icons[calc.icon as keyof typeof Icons];
              return (
                <Button
                  key={calc.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onCalculatorSelect(calc.id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {calc.name}
                </Button>
              );
            })}
          </div>
        ) : (
          <Carousel className="w-full">
            <CarouselContent>
              {categoryCalculators.map(calc => {
                const Icon = Icons[calc.icon as keyof typeof Icons];
                return (
                  <CarouselItem key={calc.id} className="md:basis-1/2 lg:basis-1/3">
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-24 flex flex-col items-center justify-center space-y-2",
                        activeCalculator === calc.id && "border-wellness-purple"
                      )}
                      onClick={() => onCalculatorSelect(calc.id)}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{calc.name}</span>
                    </Button>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}

        <div className="mt-6">
          <CalculatorDisplay
            activeCalculator={activeCalculator}
            unitSystem={unitSystem}
            onUnitSystemChange={onUnitSystemChange}
          />
        </div>
      </div>
    </div>
  );
};

const categoryNames: Record<string, string> = {
  body: "Body Composition",
  fitness: "Fitness & Exercise",
  nutrition: "Nutrition & Diet",
  wellness: "Wellness & Lifestyle"
};

const categoryIcons: Record<string, keyof typeof Icons> = {
  body: "body",
  fitness: "activity",
  nutrition: "nutrition",
  wellness: "heart"
};
