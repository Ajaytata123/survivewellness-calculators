
import React from 'react';
import { Button } from "@/components/ui/button";
import { CalculatorCategory } from '@/types/calculator';
import { cn } from '@/lib/utils';
import { getCategoryIcon, getCategoryName } from '@/utils/iconUtils';

interface CategorySelectorProps {
  categories: string[];
  activeCategory: string;
  onCategorySelect: (category: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  activeCategory,
  onCategorySelect,
}) => {
  const renderCategoryButton = (category: string) => {
    const IconComponent = getCategoryIcon(category as CalculatorCategory);
    const categoryName = getCategoryName(category as CalculatorCategory);
    
    return (
      <Button
        key={category}
        variant={activeCategory === category ? "default" : "outline"}
        className={cn(
          "whitespace-nowrap flex-shrink-0 justify-start px-4 py-2",
          activeCategory === category && "bg-wellness-purple text-white"
        )}
        onClick={() => onCategorySelect(category)}
      >
        <IconComponent className="w-4 h-4 mr-2" />
        <span className="text-sm">{categoryName}</span>
      </Button>
    );
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex space-x-2 min-w-max">
        {categories.map(category => renderCategoryButton(category))}
      </div>
    </div>
  );
};
