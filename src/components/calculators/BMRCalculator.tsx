import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateBMR, calculateCalorieNeeds } from "@/utils/calculationUtils";
import { BMRCalcProps, UnitSystem } from "@/types/calculatorTypes";
import { HeightInput } from "@/components/ui/height-input";
import IntroSection from "@/components/calculator/IntroSection";
import ResultActions from "@/components/calculator/ResultActions";
import KnowMoreButton from "@/components/calculator/KnowMoreButton";
import { validateWeight, validateAge } from "@/utils/validationUtils";
import { showErrorToast } from "@/utils/notificationUtils";

const BMRCalculator: React.FC<BMRCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activity, setActivity] = useState<string>("light");
  const [bmrResult, setBmrResult] = useState<number | null>(null);
  const [calorieNeeds, setCalorieNeeds] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>("");
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Reset errors when inputs change
  useEffect(() => {
    setErrors({});
  }, [height, weight, age, gender, activity, unitSystem]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!height) {
      newErrors.height = "Height is required";
    }
    
    if (!weight) {
      newErrors.weight = "Weight is required";
    } else {
      const weightValue = parseFloat(weight);
      const weightError = validateWeight(weightValue, unitSystem === "metric" ? "kg" : "lbs");
      if (weightError) {
        newErrors.weight = weightError;
      }
    }
    
    if (!age) {
      newErrors.age = "Age is required";
    } else {
      const ageValue = parseInt(age);
      const ageError = validateAge(ageValue);
      if (ageError) {
        newErrors.age = ageError;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateBMRResult = () => {
    if (!validateForm()) {
      showErrorToast("Please fill all required fields correctly");
      return;
    }

    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);
    const ageValue = parseInt(age);

    if (
      isNaN(heightValue) ||
      isNaN(weightValue) ||
      isNaN(ageValue) ||
      heightValue <= 0 ||
      weightValue <= 0 ||
      ageValue <= 0
    ) {
      showErrorToast("Please enter valid height, weight, and age values.");
      return;
    }

    try {
      const bmr = calculateBMR(
        weightValue,
        heightValue,
        ageValue,
        gender,
        unitSystem === "metric"
      );
      
      const calories = calculateCalorieNeeds(bmr, activity);

      setBmrResult(Math.round(bmr));
      setCalorieNeeds(Math.round(calories));
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('bmr-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error("Error calculating BMR:", error);
      showErrorToast("Error calculating your BMR. Please check your inputs.");
    }
  };

  const handleUnitChange = (value: string) => {
    onUnitSystemChange(value as UnitSystem);
    // Reset fields when changing units
    setHeight("");
    setWeight("");
    setBmrResult(null);
    setCalorieNeeds(null);
  };

  const getActivityLabel = (value: string): string => {
    switch (value) {
      case "sedentary":
        return "Sedentary (little or no exercise)";
      case "light":
        return "Light (1-3 days/week)";
      case "moderate":
        return "Moderate (3-5 days/week)";
      case "active":
        return "Active (6-7 days/week)";
      case "veryActive":
        return "Very Active (physical job or 2x training)";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">BMR & Calorie Calculator</h2>
      
        <IntroSection 
          title="What is BMR?"
          description="Basal Metabolic Rate (BMR) is the number of calories your body needs to accomplish its most basic life-sustaining functions. This calculator helps you determine your BMR and daily caloric needs based on your activity level."
        />

        <div className="mb-6">
          <Label htmlFor="userName" className="block text-left">Your Name (optional)</Label>
          <Input
            id="userName"
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="mt-1"
          />
        </div>

        <Tabs
          defaultValue={unitSystem}
          onValueChange={handleUnitChange}
          className="mb-6 unit-tabs"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger 
              value="imperial"
            >
              Imperial (US)
            </TabsTrigger>
            <TabsTrigger 
              value="metric"
            >
              Metric
            </TabsTrigger>
          </TabsList>

          <TabsContent value="imperial" className="space-y-4">
            <HeightInput 
              unitSystem="imperial"
              height={height}
              onHeightChange={setHeight}
              id="height-imperial"
            />

            <div className="space-y-2">
              <Label htmlFor="weight-imperial" className="block text-left">Weight (pounds)</Label>
              <Input
                id="weight-imperial"
                type="number"
                placeholder="e.g., 160"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={errors.weight ? "input-error" : ""}
              />
              {errors.weight && <div className="error-message">{errors.weight}</div>}
            </div>
          </TabsContent>

          <TabsContent value="metric" className="space-y-4">
            <HeightInput 
              unitSystem="metric"
              height={height}
              onHeightChange={setHeight}
              id="height-metric"
            />

            <div className="space-y-2">
              <Label htmlFor="weight-metric" className="block text-left">Weight (kg)</Label>
              <Input
                id="weight-metric"
                type="number"
                placeholder="e.g., 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={errors.weight ? "input-error" : ""}
              />
              {errors.weight && <div className="error-message">{errors.weight}</div>}
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="age" className="block text-left">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="e.g., 30"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className={errors.age ? "input-error" : ""}
            />
            {errors.age && <div className="error-message">{errors.age}</div>}
          </div>

          <div className="space-y-2">
            <Label className="block text-left">Gender</Label>
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

          <div className="space-y-2">
            <Label htmlFor="activity" className="block text-left">Activity Level</Label>
            <Select
              value={activity}
              onValueChange={setActivity}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">{getActivityLabel("sedentary")}</SelectItem>
                <SelectItem value="light">{getActivityLabel("light")}</SelectItem>
                <SelectItem value="moderate">{getActivityLabel("moderate")}</SelectItem>
                <SelectItem value="active">{getActivityLabel("active")}</SelectItem>
                <SelectItem value="veryActive">{getActivityLabel("veryActive")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculateBMRResult} className="w-full mb-6">
          Calculate BMR & Calories
        </Button>

        {bmrResult !== null && calorieNeeds !== null && (
          <div id="bmr-results" className="results-container">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Your Results</h3>
              {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="result-highlight rounded-md text-center p-4">
                  <h4 className="text-gray-500 dark:text-gray-400 text-sm">Basal Metabolic Rate</h4>
                  <p className="text-2xl font-bold text-wellness-purple dark:text-wellness-purple/90">{bmrResult}</p>
                  <p className="text-sm">calories/day</p>
                </div>
                <div className="result-highlight rounded-md text-center p-4">
                  <h4 className="text-gray-500 dark:text-gray-400 text-sm">Daily Calorie Needs</h4>
                  <p className="text-2xl font-bold text-wellness-green dark:text-wellness-green/90">{calorieNeeds}</p>
                  <p className="text-sm">calories/day</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Calorie Targets:</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-wellness-softBlue dark:bg-wellness-softBlue/30 p-3 rounded-md">
                  <p className="text-sm font-medium">Weight Loss</p>
                  <p className="text-lg font-bold">{Math.round(calorieNeeds * 0.8)} calories</p>
                </div>
                <div className="bg-wellness-softGreen dark:bg-wellness-softGreen/30 p-3 rounded-md">
                  <p className="text-sm font-medium">Weight Gain</p>
                  <p className="text-lg font-bold">{Math.round(calorieNeeds * 1.2)} calories</p>
                </div>
              </div>
            </div>

            <ResultActions
              title="BMR & Calorie Calculator"
              results={{
                "Basal Metabolic Rate": `${bmrResult} calories/day`,
                "Daily Calorie Needs": `${calorieNeeds} calories/day`,
                "Weight Loss Target": `${Math.round(calorieNeeds * 0.8)} calories/day`,
                "Weight Gain Target": `${Math.round(calorieNeeds * 1.2)} calories/day`,
                "Height": `${height} ${unitSystem === "metric" ? "cm" : "inches"}`,
                "Weight": `${weight} ${unitSystem === "metric" ? "kg" : "pounds"}`,
                "Age": age,
                "Gender": gender,
                "Activity Level": getActivityLabel(activity)
              }}
              fileName="BMR-Calculator"
              userName={userName}
              unitSystem={unitSystem}
            />
            
            <KnowMoreButton 
              calculatorName="BMR"
              calculatorId="bmr"
            />
            
            <p className="disclaimer-text">
              Based on the Mifflin-St Jeor Equation. Results may vary for individuals with specific medical conditions.
            </p>
            
            <p className="thank-you-text">
              Thank you for using SurviveWellness!
            </p>
          </div>
        )}
      </Card>

      {/* Add info section at the bottom */}
      <IntroSection calculatorId="bmr" title="" description="" />
    </div>
  );
};

export default BMRCalculator;
