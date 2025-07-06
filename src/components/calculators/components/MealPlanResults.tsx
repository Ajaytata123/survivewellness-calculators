
import React from "react";
import { MealPlan } from "./mealPlanLogic";

interface MealPlanResultsProps {
  mealPlan: MealPlan;
  userName?: string;
  dietType: string;
  preferences: string[];
}

const MealPlanResults: React.FC<MealPlanResultsProps> = ({
  mealPlan,
  userName,
  dietType,
  preferences
}) => {
  const getDietTypeDisplay = () => {
    switch (dietType) {
      case 'balanced': return 'Balanced Diet';
      case 'lowCarb': return 'Low Carb';
      case 'highProtein': return 'High Protein';
      case 'vegetarian': return 'Vegetarian';
      case 'vegan': return 'Vegan';
      case 'mediterranean': return 'Mediterranean';
      default: return dietType;
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold">Your Personalized Meal Plan</h3>
        {userName && <p className="text-sm mt-2">Plan for: {userName}</p>}
        <p className="text-sm text-gray-600 mt-1">
          Based on: {getDietTypeDisplay()}
          {preferences.length > 0 && ` + ${preferences.join(', ')}`}
        </p>
      </div>

      <div className="space-y-4 mb-4">
        {Object.entries(mealPlan.meals).map(([mealType, meals]) => (
          <div key={mealType} className="bg-white p-4 rounded-md">
            <h4 className="font-medium mb-3 capitalize">{mealType}</h4>
            {meals.map((meal, index) => (
              <div key={index} className="border-l-4 border-wellness-purple pl-3 mb-2">
                <p className="font-medium">{meal.name}</p>
                <p className="text-sm text-gray-600">{meal.calories} calories</p>
                <p className="text-xs text-gray-500">
                  Ingredients: {meal.ingredients.join(", ")}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="bg-wellness-softGreen p-4 rounded-md">
        <h4 className="font-medium mb-3">Shopping List</h4>
        <div className="grid grid-cols-2 gap-2">
          {mealPlan.shoppingList.map((item, index) => (
            <div key={index} className="flex items-center">
              <span className="text-wellness-green mr-2">✓</span>
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-wellness-purple">
        <p>Thank you for using Survive<span className="lowercase">w</span>ellness!</p>
      </div>
    </div>
  );
};

export default MealPlanResults;
