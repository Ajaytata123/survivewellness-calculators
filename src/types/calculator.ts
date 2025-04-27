
export type CalculatorCategory = "body" | "fitness" | "nutrition" | "wellness";

export interface CalculatorInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: CalculatorCategory;
  url: string;
}
