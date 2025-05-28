
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnitSystem } from "@/types/calculatorTypes";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import IntroSection from "@/components/calculator/IntroSection";

interface MacroCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const MacroCalculator: React.FC<MacroCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("moderate");
  const [goal, setGoal] = useState<string>("maintain");
  
  const [macroResults, setMacroResults] = useState<{
    calories: number;
    protein: { grams: number; calories: number; percentage: number };
    carbs: { grams: number; calories: number; percentage: number };
    fats: { grams: number; calories: number; percentage: number };
  } | null>(null);

  const activityMultipliers = {
    sedentary: { label: "Sedentary (little/no exercise)", value: 1.2 },
    light: { label: "Light activity (light exercise 1-3 days/week)", value: 1.375 },
    moderate: { label: "Moderate activity (moderate exercise 3-5 days/week)", value: 1.55 },
    very: { label: "Very active (hard exercise 6-7 days/week)", value: 1.725 },
    extra: { label: "Extra active (very hard exercise/physical job)", value: 1.9 }
  };

  const goalAdjustments = {
    lose: { label: "Lose weight", adjustment: -500 },
    maintain: { label: "Maintain weight", adjustment: 0 },
    gain: { label: "Gain weight", adjustment: 500 }
  };

  const calculateMacros = () => {
    if (!age || !height || !weight) {
      showErrorToast("Please fill in all required fields");
      return;
    }

    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (isNaN(ageNum) || isNaN(heightNum) || isNaN(weightNum)) {
      showErrorToast("Please enter valid numbers");
      return;
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (unitSystem === "imperial") {
      // Convert to metric for calculation
      const weightKg = weightNum * 0.453592;
      const heightCm = heightNum * 2.54;
      
      if (gender === "male") {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
      } else {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
      }
    } else {
      if (gender === "male") {
        bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
      } else {
        bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
      }
    }

    // Calculate TDEE
    const activityMultiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers].value;
    const tdee = bmr * activityMultiplier;

    // Adjust for goal
    const goalAdjustment = goalAdjustments[goal as keyof typeof goalAdjustments].adjustment;
    const targetCalories = Math.round(tdee + goalAdjustment);

    // Calculate macros based on goal
    let proteinPercentage: number;
    let carbsPercentage: number;
    let fatsPercentage: number;

    if (goal === "lose") {
      proteinPercentage = 35;
      carbsPercentage = 35;
      fatsPercentage = 30;
    } else if (goal === "gain") {
      proteinPercentage = 25;
      carbsPercentage = 45;
      fatsPercentage = 30;
    } else {
      proteinPercentage = 30;
      carbsPercentage = 40;
      fatsPercentage = 30;
    }

    // Calculate macro amounts
    const proteinCalories = Math.round((targetCalories * proteinPercentage) / 100);
    const carbsCalories = Math.round((targetCalories * carbsPercentage) / 100);
    const fatsCalories = Math.round((targetCalories * fatsPercentage) / 100);

    const proteinGrams = Math.round(proteinCalories / 4);
    const carbsGrams = Math.round(carbsCalories / 4);
    const fatsGrams = Math.round(fatsCalories / 9);

    setMacroResults({
      calories: targetCalories,
      protein: {
        grams: proteinGrams,
        calories: proteinCalories,
        percentage: proteinPercentage
      },
      carbs: {
        grams: carbsGrams,
        calories: carbsCalories,
        percentage: carbsPercentage
      },
      fats: {
        grams: fatsGrams,
        calories: fatsCalories,
        percentage: fatsPercentage
      }
    });
  };

  const handleUnitChange = (value: string) => {
    onUnitSystemChange(value as UnitSystem);
    setHeight("");
    setWeight("");
    setMacroResults(null);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Macronutrient Calculator</h2>
        <p className="text-gray-600 mb-4 text-center">
          Calculate your optimal daily intake of proteins, carbohydrates, and fats
        </p>

        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="userName">Your Name (optional)</Label>
            <Input
              id="userName"
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g., 30"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup
                value={gender}
                onValueChange={(value) => setGender(value as "male" | "female")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Tabs defaultValue={unitSystem} onValueChange={handleUnitChange} className="mb-6">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="imperial">Imperial (US)</TabsTrigger>
              <TabsTrigger value="metric">Metric</TabsTrigger>
            </TabsList>

            <TabsContent value="imperial" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height-imperial">Height (inches)</Label>
                  <Input
                    id="height-imperial"
                    type="number"
                    placeholder="e.g., 70"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight-imperial">Weight (lbs)</Label>
                  <Input
                    id="weight-imperial"
                    type="number"
                    placeholder="e.g., 160"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metric" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height-metric">Height (cm)</Label>
                  <Input
                    id="height-metric"
                    type="number"
                    placeholder="e.g., 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight-metric">Weight (kg)</Label>
                  <Input
                    id="weight-metric"
                    type="number"
                    placeholder="e.g., 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label>Activity Level</Label>
            <Select value={activityLevel} onValueChange={setActivityLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(activityMultipliers).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Goal</Label>
            <Select value={goal} onValueChange={setGoal}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(goalAdjustments).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculateMacros} className="w-full mb-6">
          Calculate Macros
        </Button>

        {macroResults && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Your Daily Macronutrient Targets</h3>
              {userName && <p className="text-sm mt-2">Results for: {userName}</p>}
            </div>

            <div className="bg-wellness-softPurple p-4 rounded-md mb-4 text-center">
              <p className="text-sm text-gray-700">Daily Calories</p>
              <p className="text-2xl font-bold text-wellness-purple">{macroResults.calories}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-white p-3 rounded-md text-center border-l-4 border-red-400">
                <p className="text-sm text-gray-700">Protein</p>
                <p className="text-lg font-bold">{macroResults.protein.grams}g</p>
                <p className="text-xs text-gray-500">{macroResults.protein.calories} cal ({macroResults.protein.percentage}%)</p>
              </div>
              <div className="bg-white p-3 rounded-md text-center border-l-4 border-blue-400">
                <p className="text-sm text-gray-700">Carbohydrates</p>
                <p className="text-lg font-bold">{macroResults.carbs.grams}g</p>
                <p className="text-xs text-gray-500">{macroResults.carbs.calories} cal ({macroResults.carbs.percentage}%)</p>
              </div>
              <div className="bg-white p-3 rounded-md text-center border-l-4 border-yellow-400">
                <p className="text-sm text-gray-700">Fats</p>
                <p className="text-lg font-bold">{macroResults.fats.grams}g</p>
                <p className="text-xs text-gray-500">{macroResults.fats.calories} cal ({macroResults.fats.percentage}%)</p>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-wellness-purple">
              <p>Thank you for using Survive<span className="lowercase">w</span>ellness!</p>
            </div>
          </div>
        )}
      </Card>

      <IntroSection calculatorId="macro" title="" description="" />
    </div>
  );
};

export default MacroCalculator;
