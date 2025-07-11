
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CalculatorCategory } from "@/types/calculator";

export const getIconComponent = (iconName: string): LucideIcon => {
  // Handle special icon mappings and ensure all calculator icons are available
  const iconMappings: Record<string, keyof typeof LucideIcons> = {
    // Body category icons
    "Body": "User",
    "Scale": "Scale",
    "Weight": "Weight",
    
    // Fitness category icons
    "Dumbbell": "Dumbbell",
    "Activity": "Activity",
    "Heart": "Heart",
    "HeartPulse": "HeartPulse",
    
    // Nutrition category icons
    "Utensils": "Utensils",
    "Droplets": "Droplets",
    "Clock": "Clock",
    "Calculator": "Calculator",
    
    // Wellness category icons
    "Wine": "Wine",
    "Cigarette": "Cigarette",
    
    // Women's health icons
    "CalendarDays": "CalendarDays",
    "Baby": "Baby",
    "Calendar": "Calendar",
    
    // General icons
    "Footprints": "Footprints",
    "Bone": "Bone"
  };
  
  // Use mapping if available, otherwise use the original name
  const mappedIconName = iconMappings[iconName] || iconName;
  
  // Type assertion to deal with the TypeScript error
  const iconKey = mappedIconName as keyof typeof LucideIcons;
  
  // Check if icon exists in the library
  const iconExists = Object.prototype.hasOwnProperty.call(LucideIcons, iconKey);
  
  // Return the requested icon or fallback to Calculator
  const IconComponent = iconExists 
    ? LucideIcons[iconKey] as LucideIcon
    : LucideIcons.Calculator as LucideIcon;
  
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
