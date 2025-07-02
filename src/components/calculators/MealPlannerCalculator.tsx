import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UnitSystem } from "@/types/calculatorTypes";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import IntroSection from "@/components/calculator/IntroSection";

interface MealPlannerCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const MealPlannerCalculator: React.FC<MealPlannerCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [dietType, setDietType] = useState<string>("balanced");
  const [calorieGoal, setCalorieGoal] = useState<string>("2000");
  const [mealsPerDay, setMealsPerDay] = useState<string>("3");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  
  const [mealPlan, setMealPlan] = useState<{
    meals: {
      [key: string]: {
        name: string;
        calories: number;
        ingredients: string[];
      }[];
    };
    shoppingList: string[];
  } | null>(null);

  const allergyOptions = ["Nuts", "Dairy", "Gluten", "Shellfish", "Eggs", "Soy"];
  const preferenceOptions = ["Low-carb", "High-protein", "Vegetarian", "Vegan", "Mediterranean"];

  const handleAllergyChange = (allergy: string, checked: boolean) => {
    if (checked) {
      setAllergies([...allergies, allergy]);
    } else {
      setAllergies(allergies.filter(a => a !== allergy));
    }
  };

  const handlePreferenceChange = (preference: string, checked: boolean) => {
    if (checked) {
      setPreferences([...preferences, preference]);
    } else {
      setPreferences(preferences.filter(p => p !== preference));
    }
  };

  const generateMealPlan = () => {
    if (!calorieGoal || !mealsPerDay) {
      showErrorToast("Please fill in all required fields");
      return;
    }

    const totalCalories = parseInt(calorieGoal);
    const numMeals = parseInt(mealsPerDay);
    const caloriesPerMeal = Math.round(totalCalories / numMeals);

    // Sample meal plans based on diet type
    const balancedMeals = {
      breakfast: [
        { name: "Oatmeal with Berries", calories: 350, ingredients: ["Oats", "Mixed berries", "Honey", "Milk"] },
        { name: "Greek Yogurt Parfait", calories: 300, ingredients: ["Greek yogurt", "Granola", "Banana", "Honey"] }
      ],
      lunch: [
        { name: "Grilled Chicken Salad", calories: 450, ingredients: ["Chicken breast", "Mixed greens", "Tomatoes", "Cucumber", "Olive oil"] },
        { name: "Turkey Sandwich", calories: 400, ingredients: ["Whole grain bread", "Turkey", "Lettuce", "Tomato", "Avocado"] }
      ],
      dinner: [
        { name: "Salmon with Quinoa", calories: 500, ingredients: ["Salmon fillet", "Quinoa", "Broccoli", "Lemon"] },
        { name: "Chicken Stir-fry", calories: 450, ingredients: ["Chicken breast", "Mixed vegetables", "Brown rice", "Soy sauce"] }
      ],
      snacks: [
        { name: "Apple with Peanut Butter", calories: 200, ingredients: ["Apple", "Peanut butter"] },
        { name: "Trail Mix", calories: 150, ingredients: ["Nuts", "Dried fruit", "Dark chocolate"] }
      ]
    };

    const mealCategories = ["breakfast", "lunch", "dinner"];
    if (numMeals > 3) {
      mealCategories.push("snacks");
    }

    const selectedMeals: { [key: string]: any[] } = {};
    const allIngredients: string[] = [];

    mealCategories.forEach(category => {
      const categoryMeals = balancedMeals[category as keyof typeof balancedMeals] || [];
      selectedMeals[category] = [categoryMeals[0]]; // Select first meal for simplicity
      selectedMeals[category][0].ingredients.forEach((ingredient: string) => {
        if (!allIngredients.includes(ingredient)) {
          allIngredients.push(ingredient);
        }
      });
    });

    setMealPlan({
      meals: selectedMeals,
      shoppingList: allIngredients
    });

    showSuccessToast("Meal plan generated!");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Meal Planner</h2>
        <p className="text-gray-600 mb-4 text-center">
          Create a personalized meal plan based on your dietary preferences and goals
        </p>

        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="userName" className="block text-left">Your Name (optional)</Label>
            <Input
              id="userName"
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="block text-left">Diet Type</Label>
            <Select value={dietType} onValueChange={setDietType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balanced">Balanced Diet</SelectItem>
                <SelectItem value="lowCarb">Low Carb</SelectItem>
                <SelectItem value="highProtein">High Protein</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="mediterranean">Mediterranean</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calorieGoal" className="block text-left">Daily Calorie Goal</Label>
              <Input
                id="calorieGoal"
                type="number"
                placeholder="e.g., 2000"
                value={calorieGoal}
                onChange={(e) => setCalorieGoal(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="block text-left">Meals per Day</Label>
              <Select value={mealsPerDay} onValueChange={setMealsPerDay}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 meals</SelectItem>
                  <SelectItem value="4">4 meals</SelectItem>
                  <SelectItem value="5">5 meals</SelectItem>
                  <SelectItem value="6">6 meals</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="block text-left">Food Allergies</Label>
            <div className="grid grid-cols-2 gap-2">
              {allergyOptions.map((allergy) => (
                <div key={allergy} className="flex items-center space-x-2">
                  <Checkbox
                    id={allergy}
                    checked={allergies.includes(allergy)}
                    onCheckedChange={(checked) => handleAllergyChange(allergy, checked as boolean)}
                  />
                  <Label htmlFor={allergy} className="text-sm">{allergy}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="block text-left">Dietary Preferences</Label>
            <div className="grid grid-cols-2 gap-2">
              {preferenceOptions.map((preference) => (
                <div key={preference} className="flex items-center space-x-2">
                  <Checkbox
                    id={preference}
                    checked={preferences.includes(preference)}
                    onCheckedChange={(checked) => handlePreferenceChange(preference, checked as boolean)}
                  />
                  <Label htmlFor={preference} className="text-sm">{preference}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={generateMealPlan} className="w-full mb-6">
          Generate Meal Plan
        </Button>

        {mealPlan && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Your Personalized Meal Plan</h3>
              {userName && <p className="text-sm mt-2">Plan for: {userName}</p>}
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
        )}
      </Card>

      <IntroSection calculatorId="mealplan" title="" description="" />
    </div>
  );
};

export default MealPlannerCalculator;
