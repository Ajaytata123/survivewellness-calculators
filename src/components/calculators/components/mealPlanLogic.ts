
export interface MealPlan {
  meals: {
    [key: string]: {
      name: string;
      calories: number;
      ingredients: string[];
    }[];
  };
  shoppingList: string[];
}

export interface MealPlanOptions {
  dietType: string;
  preferences: string[];
  calorieGoal: number;
  mealsPerDay: number;
}

export const generateMealPlan = (options: MealPlanOptions): MealPlan => {
  const { dietType, preferences, calorieGoal, mealsPerDay } = options;
  
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
  if (mealsPerDay > 3) {
    mealCategories.push("snacks");
  }

  const selectedMeals: { [key: string]: any[] } = {};
  const allIngredients: string[] = [];

  mealCategories.forEach(category => {
    const categoryMeals = availableMeals[category as keyof typeof availableMeals] || [];
    if (categoryMeals.length > 0) {
      selectedMeals[category] = [categoryMeals[0]];
      selectedMeals[category][0].ingredients.forEach((ingredient: string) => {
        if (!allIngredients.includes(ingredient)) {
          allIngredients.push(ingredient);
        }
      });
    }
  });

  return {
    meals: selectedMeals,
    shoppingList: allIngredients
  };
};
