
/**
 * Returns desktop category button ID
 * @param category Category slug
 * @returns Category button ID
 */
export const getCategoryButtonId = (category: string): string => {
  return `calculator-category-${category}`;
};

/**
 * Returns desktop calculator button ID
 * @param calculatorId Calculator ID/slug
 * @returns Calculator button ID
 */
export const getCalculatorButtonId = (calculatorId: string): string => {
  return `calc-${calculatorId}`;
};

/**
 * Returns mobile category button ID
 * @param category Category slug
 * @returns Mobile category button ID
 */
export const getMobileCategoryButtonId = (category: string): string => {
  return `mobile-category-${category}`;
};

/**
 * Returns mobile calculator button ID
 * @param calculatorId Calculator ID/slug
 * @returns Mobile calculator button ID
 */
export const getMobileCalculatorButtonId = (calculatorId: string): string => {
  return `mobile-calc-${calculatorId}`;
};
