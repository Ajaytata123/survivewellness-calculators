
export type CalculatorCategory = "body" | "fitness" | "nutrition" | "wellness" | "women";

export interface CalculatorInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: CalculatorCategory;
  url: string;
}

export const getCategoryName = (category: CalculatorCategory): string => {
  switch (category) {
    case 'body':
      return 'Body Composition';
    case 'fitness':
      return 'Fitness & Exercise';
    case 'nutrition':
      return 'Nutrition & Diet';
    case 'wellness':
      return 'Wellness & Lifestyle';
    case 'women':
      return 'Women\'s Health';
    default:
      // Since we've covered all possible enum values above,
      // this is a type-safe approach for handling unexpected values
      const value = String(category);
      return value.charAt(0).toUpperCase() + value.slice(1);
  }
};
