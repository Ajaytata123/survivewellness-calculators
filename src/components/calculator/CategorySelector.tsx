
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Activity, Scale, Utensils } from "lucide-react";
import { cn } from '@/lib/utils';

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
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'body':
        return <Scale className="w-4 h-4 mr-2" />;
      case 'fitness':
        return <Activity className="w-4 h-4 mr-2" />;
      case 'nutrition':
        return <Utensils className="w-4 h-4 mr-2" />;
      case 'wellness':
        return <Heart className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      body: "Body Composition",
      fitness: "Fitness & Exercise",
      nutrition: "Nutrition & Diet",
      wellness: "Wellness & Lifestyle"
    };
    return names[category] || category;
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex space-x-2 min-w-min">
        {categories.map(category => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className={cn(
              "whitespace-nowrap min-w-[80%] justify-start",
              activeCategory === category && "bg-wellness-purple text-white"
            )}
            onClick={() => onCategorySelect(category)}
          >
            {getCategoryIcon(category)}
            {getCategoryName(category)}
          </Button>
        ))}
      </div>
    </div>
  );
};
