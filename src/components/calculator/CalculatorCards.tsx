
import React from 'react';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import * as LucideIcons from "lucide-react";
import { CalculatorInfo } from '@/types/calculator';
import { cn } from '@/lib/utils';

interface CalculatorCardsProps {
  calculators: CalculatorInfo[];
  activeCalculator: string;
  onCalculatorSelect: (id: string) => void;
  isSearching: boolean;
}

export const CalculatorCards: React.FC<CalculatorCardsProps> = ({
  calculators,
  activeCalculator,
  onCalculatorSelect,
  isSearching,
}) => {
  const renderCalculatorButton = (calc: CalculatorInfo) => {
    // Get the proper icon component or default to Calculator
    const iconName = calc.icon as keyof typeof LucideIcons;
    const IconComponent = LucideIcons[iconName] || LucideIcons.Calculator;
    
    return (
      <Button
        key={calc.id}
        variant="outline"
        className={cn(
          isSearching ? "w-full justify-start" : "w-full h-24 flex flex-col items-center justify-center space-y-2",
          activeCalculator === calc.id && "border-wellness-purple"
        )}
        onClick={() => onCalculatorSelect(calc.id)}
      >
        <IconComponent className={isSearching ? "w-4 h-4 mr-2" : "w-6 h-6"} />
        <span className={isSearching ? "" : "text-sm font-medium"}>{calc.name}</span>
      </Button>
    );
  };

  if (isSearching) {
    return (
      <div className="space-y-4">
        {calculators.map(calc => renderCalculatorButton(calc))}
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {calculators.map(calc => (
          <CarouselItem key={calc.id} className="md:basis-1/2 lg:basis-1/3">
            {renderCalculatorButton(calc)}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
};
