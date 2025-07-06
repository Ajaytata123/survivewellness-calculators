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

    // Different meal plans based on diet type and preferences
    const getMealsBasedOnDiet = () => {
      const isVegetarian = dietType === "vegetarian" || preferences.includes("Vegetarian");
      const isVegan = dietType === "vegan" || preferences.includes("Vegan");
      const isLowCarb = dietType === "lowCarb" || preferences.includes("Low-carb");
      const isHighProtein = dietType === "highProtein" || preferences.includes("High-protein");
      const isMediterranean = dietType === "mediterranean" || preferences.includes("Mediterranean");

      // Vegetarian meals
      if (isVegetarian && !isVegan) {
        return {
          breakfast: [
            { name: "Vegetable Scrambled Eggs", calories: 320, ingredients: ["Eggs", "Bell peppers", "Spinach", "Cheese", "Olive oil"] },
            { name: "Greek Yogurt with Granola", calories: 300, ingredients: ["Greek yogurt", "Granola", "Honey", "Mixed berries"] }
          ],
          lunch: [
            { name: "Quinoa Salad Bowl", calories: 420, ingredients: ["Quinoa", "Chickpeas", "Cucumber", "Tomatoes", "Feta cheese", "Olive oil"] },
            { name: "Caprese Sandwich", calories: 380, ingredients: ["Whole grain bread", "Mozzarella", "Tomatoes", "Basil", "Balsamic glaze"] }
          ],
          dinner: [
            { name: "Vegetable Stir-fry with Tofu", calories: 450, ingredients: ["Tofu", "Broccoli", "Carrots", "Bell peppers", "Brown rice", "Soy sauce"] },
            { name: "Eggplant Parmesan", calories: 480, ingredients: ["Eggplant", "Marinara sauce", "Mozzarella", "Parmesan", "Basil"] }
          ],
          snacks: [
            { name: "Hummus with Vegetables", calories: 180, ingredients: ["Hummus", "Carrots", "Celery", "Bell peppers"] },
            { name: "Greek Yogurt with Nuts", calories: 200, ingredients: ["Greek yogurt", "Mixed nuts", "Honey"] }
          ]
        };
      }

      // Vegan meals
      if (isVegan) {
        return {
          breakfast: [
            { name: "Chia Pudding with Berries", calories: 280, ingredients: ["Chia seeds", "Almond milk", "Mixed berries", "Maple syrup"] },
            { name: "Avocado Toast", calories: 320, ingredients: ["Whole grain bread", "Avocado", "Tomatoes", "Nutritional yeast", "Lemon"] }
          ],
          lunch: [
            { name: "Buddha Bowl", calories: 450, ingredients: ["Quinoa", "Chickpeas", "Roasted vegetables", "Tahini dressing", "Spinach"] },
            { name: "Lentil Soup", calories: 380, ingredients: ["Red lentils", "Vegetables", "Vegetable broth", "Spices", "Coconut milk"] }
          ],
          dinner: [
            { name: "Mushroom and Vegetable Curry", calories: 420, ingredients: ["Mushrooms", "Chickpeas", "Coconut milk", "Curry spices", "Brown rice"] },
            { name: "Stuffed Bell Peppers", calories: 400, ingredients: ["Bell peppers", "Quinoa", "Black beans", "Tomatoes", "Nutritional yeast"] }
          ],
          snacks: [
            { name: "Energy Balls", calories: 150, ingredients: ["Dates", "Nuts", "Coconut", "Chia seeds"] },
            { name: "Fruit and Nut Mix", calories: 180, ingredients: ["Mixed nuts", "Dried fruits", "Pumpkin seeds"] }
          ]
        };
      }

      // Low-carb meals
      if (isLowCarb) {
        return {
          breakfast: [
            { name: "Avocado and Egg Bowl", calories: 350, ingredients: ["Eggs", "Avocado", "Spinach", "Cheese", "Olive oil"] },
            { name: "Greek Yogurt with Nuts", calories: 280, ingredients: ["Greek yogurt", "Almonds", "Walnuts", "Berries"] }
          ],
          lunch: [
            { name: "Grilled Chicken Salad", calories: 420, ingredients: ["Chicken breast", "Mixed greens", "Avocado", "Cucumber", "Olive oil"] },
            { name: "Zucchini Noodles with Pesto", calories: 380, ingredients: ["Spiralized zucchini", "Pesto sauce", "Cherry tomatoes", "Pine nuts"] }
          ],
          dinner: [
            { name: "Grilled Salmon with Asparagus", calories: 480, ingredients: ["Salmon fillet", "Asparagus", "Lemon", "Herbs", "Olive oil"] },
            { name: "Cauliflower Rice Stir-fry", calories: 420, ingredients: ["Cauliflower rice", "Chicken", "Vegetables", "Coconut oil"] }
          ],
          snacks: [
            { name: "Cheese and Olives", calories: 200, ingredients: ["Cheese cubes", "Olives", "Cucumber"] },
            { name: "Hard-boiled Eggs", calories: 140, ingredients: ["Eggs", "Salt", "Pepper"] }
          ]
        };
      }

      // High-protein meals
      if (isHighProtein) {
        return {
          breakfast: [
            { name: "Protein Smoothie", calories: 380, ingredients: ["Protein powder", "Banana", "Spinach", "Almond milk", "Peanut butter"] },
            { name: "Egg White Omelet", calories: 320, ingredients: ["Egg whites", "Lean ham", "Vegetables", "Low-fat cheese"] }
          ],
          lunch: [
            { name: "Grilled Chicken Bowl", calories: 480, ingredients: ["Chicken breast", "Quinoa", "Black beans", "Vegetables", "Greek yogurt"] },
            { name: "Tuna Salad Wrap", calories: 420, ingredients: ["Tuna", "Whole wheat tortilla", "Greek yogurt", "Vegetables"] }
          ],
          dinner: [
            { name: "Lean Beef with Sweet Potato", calories: 520, ingredients: ["Lean beef", "Sweet potato", "Broccoli", "Herbs"] },
            { name: "Grilled Fish with Lentils", calories: 480, ingredients: ["White fish", "Lentils", "Vegetables", "Herbs"] }
          ],
          snacks: [
            { name: "Protein Bar", calories: 200, ingredients: ["Protein bar", "Water"] },
            { name: "Cottage Cheese with Berries", calories: 180, ingredients: ["Cottage cheese", "Mixed berries"] }
          ]
        };
      }

      // Mediterranean diet
      if (isMediterranean) {
        return {
          breakfast: [
            { name: "Greek Yogurt with Honey", calories: 300, ingredients: ["Greek yogurt", "Honey", "Walnuts", "Figs"] },
            { name: "Mediterranean Omelet", calories: 350, ingredients: ["Eggs", "Tomatoes", "Olives", "Feta cheese", "Herbs"] }
          ],
          lunch: [
            { name: "Mediterranean Salad", calories: 420, ingredients: ["Mixed greens", "Chickpeas", "Olives", "Feta", "Olive oil", "Lemon"] },
            { name: "Hummus and Vegetable Wrap", calories: 380, ingredients: ["Whole wheat tortilla", "Hummus", "Vegetables", "Olives"] }
          ],
          dinner: [
            { name: "Grilled Fish with Vegetables", calories: 450, ingredients: ["White fish", "Zucchini", "Tomatoes", "Olive oil", "Herbs"] },
            { name: "Chicken with Mediterranean Rice", calories: 480, ingredients: ["Chicken", "Rice", "Tomatoes", "Olives", "Herbs"] }
          ],
          snacks: [
            { name: "Olives and Nuts", calories: 180, ingredients: ["Mixed olives", "Almonds", "Walnuts"] },
            { name: "Greek Yogurt with Nuts", calories: 200, ingredients: ["Greek yogurt", "Mixed nuts", "Honey"] }
          ]
        };
      }

      // Default balanced meals
      return {
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
    };

    const availableMeals = getMealsBasedOnDiet();
    const mealCategories = ["breakfast", "lunch", "dinner"];
    if (numMeals > 3) {
      mealCategories.push("snacks");
    }

    const selectedMeals: { [key: string]: any[] } = {};
    const allIngredients: string[] = [];

    mealCategories.forEach(category => {
      const categoryMeals = availableMeals[category as keyof typeof availableMeals] || [];
      if (categoryMeals.length > 0) {
        selectedMeals[category] = [categoryMeals[0]]; // Select first meal for each category
        selectedMeals[category][0].ingredients.forEach((ingredient: string) => {
          if (!allIngredients.includes(ingredient)) {
            allIngredients.push(ingredient);
          }
        });
      }
    });

    setMealPlan({
      meals: selectedMeals,
      shoppingList: allIngredients
    });

    showSuccessToast("Personalized meal plan generated based on your preferences!");
  };

  // Custom calculator name mapping - Updated to change "Menstrual Cycle" to "Period Calculator"
  const getCalculatorDisplayName = (calc: any): string => {
    if (calc.id === 'menstrual-cycle') {
      return 'Period Calculator';
    }
    // Also handle if the calculator name is "Menstrual Cycle Calculator"
    if (calc.name === 'Menstrual Cycle Calculator' || calc.name === 'Menstrual Cycle') {
      return 'Period Calculator';
    }
    return calc.name;
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
              <p className="text-sm text-gray-600 mt-1">
                Based on: {dietType === 'balanced' ? 'Balanced Diet' : 
                         dietType === 'lowCarb' ? 'Low Carb' :
                         dietType === 'highProtein' ? 'High Protein' :
                         dietType === 'vegetarian' ? 'Vegetarian' :
                         dietType === 'vegan' ? 'Vegan' :
                         dietType === 'mediterranean' ? 'Mediterranean' : dietType}
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
        )}
      </Card>

      <IntroSection calculatorId="mealplan" title="" description="" />
    </div>
  );
};

export default MealPlannerCalculator;
