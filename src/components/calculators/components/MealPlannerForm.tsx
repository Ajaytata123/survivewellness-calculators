
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface MealPlannerFormProps {
  userName: string;
  setUserName: (name: string) => void;
  dietType: string;
  setDietType: (type: string) => void;
  calorieGoal: string;
  setCalorieGoal: (goal: string) => void;
  mealsPerDay: string;
  setMealsPerDay: (meals: string) => void;
  preferences: string[];
  onPreferenceChange: (preference: string, checked: boolean) => void;
  onGeneratePlan: () => void;
}

const MealPlannerForm: React.FC<MealPlannerFormProps> = ({
  userName,
  setUserName,
  dietType,
  setDietType,
  calorieGoal,
  setCalorieGoal,
  mealsPerDay,
  setMealsPerDay,
  preferences,
  onPreferenceChange,
  onGeneratePlan
}) => {
  const preferenceOptions = ["Low-carb", "High-protein", "Vegetarian", "Vegan", "Mediterranean"];

  // Auto-generate meal plan when preferences change
  useEffect(() => {
    if (calorieGoal && mealsPerDay) {
      onGeneratePlan();
    }
  }, [preferences, dietType, calorieGoal, mealsPerDay]);

  return (
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
        <Label className="block text-left">Dietary Preferences</Label>
        <div className="grid grid-cols-2 gap-2">
          {preferenceOptions.map((preference) => (
            <div key={preference} className="flex items-center space-x-2">
              <Checkbox
                id={preference}
                checked={preferences.includes(preference)}
                onCheckedChange={(checked) => onPreferenceChange(preference, checked as boolean)}
              />
              <Label htmlFor={preference} className="text-sm">{preference}</Label>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={onGeneratePlan} className="w-full">
        Generate Meal Plan
      </Button>
    </div>
  );
};

export default MealPlannerForm;
