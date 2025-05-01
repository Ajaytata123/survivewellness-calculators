
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CalculatorCategory } from "@/types/calculator";

export const getIconComponent = (iconName: string): LucideIcon => {
  // Safety check for icon name
  const iconExists = Object.prototype.hasOwnProperty.call(LucideIcons, iconName);
  const IconComponent = iconExists 
    ? (LucideIcons as Record<string, LucideIcon>)[iconName] 
    : LucideIcons.Calculator;
  
  return IconComponent;
};

export const getCategoryIcon = (category: CalculatorCategory): LucideIcon => {
  switch (category) {
    case 'body':
      return LucideIcons.Scale;
    case 'fitness':
      return LucideIcons.Activity;
    case 'nutrition':
      return LucideIcons.Utensils;
    case 'wellness':
      return LucideIcons.Heart;
    case 'women':
      return LucideIcons.Heart;
    default:
      return LucideIcons.Calculator;
  }
};

export const getCategoryName = (category: CalculatorCategory): string => {
  const names: Record<CalculatorCategory, string> = {
    body: "Body Composition",
    fitness: "Fitness & Exercise",
    nutrition: "Nutrition & Diet",
    wellness: "Wellness & Lifestyle",
    women: "Women's Health"
  };
  return names[category] || category;
};

export const getCategoryColor = (category: CalculatorCategory): string => {
  const colors: Record<CalculatorCategory, string> = {
    body: "wellness-purple",
    fitness: "wellness-blue", 
    nutrition: "wellness-green",
    wellness: "wellness-orange",
    women: "wellness-pink"
  };
  return colors[category] || "wellness-purple";
};
