
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { UnitSystem } from "@/types/calculatorTypes";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import IntroSection from "@/components/calculator/IntroSection";
import MealPlannerForm from "./components/MealPlannerForm";
import MealPlanResults from "./components/MealPlanResults";
import { generateMealPlan, MealPlan } from "./components/mealPlanLogic";

interface MealPlannerCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const MealPlannerCalculator: React.FC<MealPlannerCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [dietType, setDietType] = useState<string>("balanced");
  const [calorieGoal, setCalorieGoal] = useState<string>("2000");
  const [mealsPerDay, setMealsPerDay] = useState<string>("3");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

  const handlePreferenceChange = (preference: string, checked: boolean) => {
    if (checked) {
      setPreferences([...preferences, preference]);
    } else {
      setPreferences(preferences.filter(p => p !== preference));
    }
  };

  const handleGenerateMealPlan = () => {
    if (!calorieGoal || !mealsPerDay) {
      showErrorToast("Please fill in all required fields");
      return;
    }

    const calorieGoalNum = parseInt(calorieGoal);
    const mealsPerDayNum = parseInt(mealsPerDay);

    if (isNaN(calorieGoalNum) || isNaN(mealsPerDayNum)) {
      showErrorToast("Please enter valid numbers");
      return;
    }

    const generatedPlan = generateMealPlan({
      dietType,
      preferences,
      calorieGoal: calorieGoalNum,
      mealsPerDay: mealsPerDayNum
    });

    setMealPlan(generatedPlan);
    showSuccessToast("Personalized meal plan generated based on your preferences!");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Meal Planner</h2>
        <p className="text-gray-600 mb-4 text-center">
          Create a personalized meal plan based on your dietary preferences and goals
        </p>

        <MealPlannerForm
          userName={userName}
          setUserName={setUserName}
          dietType={dietType}
          setDietType={setDietType}
          calorieGoal={calorieGoal}
          setCalorieGoal={setCalorieGoal}
          mealsPerDay={mealsPerDay}
          setMealsPerDay={setMealsPerDay}
          preferences={preferences}
          onPreferenceChange={handlePreferenceChange}
          onGeneratePlan={handleGenerateMealPlan}
        />

        {mealPlan && (
          <MealPlanResults
            mealPlan={mealPlan}
            userName={userName}
            dietType={dietType}
            preferences={preferences}
          />
        )}
      </Card>

      <IntroSection calculatorId="mealplan" title="" description="" />
    </div>
  );
};

export default MealPlannerCalculator;
