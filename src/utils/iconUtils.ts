
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { CalculatorCategory } from "@/types/calculator";

export const getIconComponent = (iconName: string): LucideIcon => {
  return LucideIcons[iconName as keyof typeof LucideIcons] || LucideIcons.Calculator;
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
    default:
      return LucideIcons.Calculator;
  }
};

export const getCategoryName = (category: CalculatorCategory): string => {
  const names: Record<CalculatorCategory, string> = {
    body: "Body Composition",
    fitness: "Fitness & Exercise",
    nutrition: "Nutrition & Diet",
    wellness: "Wellness & Lifestyle"
  };
  return names[category] || category;
};

export const getCategoryColor = (category: CalculatorCategory): string => {
  const colors: Record<CalculatorCategory, string> = {
    body: "wellness-purple",
    fitness: "wellness-blue", 
    nutrition: "wellness-green",
    wellness: "wellness-orange"
  };
  return colors[category] || "wellness-purple";
};
