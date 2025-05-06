
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
      // Fix: Ensure category is treated as a string to use charAt and slice methods
      return category.toString().charAt(0).toUpperCase() + category.toString().slice(1);
  }
};
