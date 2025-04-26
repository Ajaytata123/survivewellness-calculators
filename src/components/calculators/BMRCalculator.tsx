import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateBMR, calculateCalorieNeeds } from "@/utils/calculationUtils";
import { BMRCalcProps, UnitSystem } from "@/types/calculatorTypes";
import { downloadResultsAsCSV, copyResultsToClipboard } from "@/utils/downloadUtils";

const BMRCalculator: React.FC<BMRCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activity, setActivity] = useState<string>("light");
  const [bmrResult, setBmrResult] = useState<number | null>(null);
  const [calorieNeeds, setCalorieNeeds] = useState<number | null>(null);

  const calculateBMRResult = () => {
    if (!height || !weight || !age) return;

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
      alert("Please enter valid height, weight, and age values.");
      return;
    }

    const bmr = calculateBMR(
      weightValue,
      heightValue,
      ageValue,
      gender,
      unitSystem === "metric"
    );
    
    const calories = calculateCalorieNeeds(bmr, activity);

    setBmrResult(bmr);
    setCalorieNeeds(calories);
  };

  const handleUnitChange = (value: string) => {
    onUnitSystemChange(value as UnitSystem);
    // Reset fields when changing units
    setHeight("");
    setWeight("");
    setBmrResult(null);
    setCalorieNeeds(null);
  };

  const downloadResults = () => {
    if (bmrResult === null || calorieNeeds === null) return;

    const weightLoss = Math.round(calorieNeeds * 0.8);
    const weightGain = Math.round(calorieNeeds * 1.2);

    const results = {
      title: "BMR & Calorie Calculator",
      results: {
        "Basal Metabolic Rate": `${bmrResult} calories/day`,
        "Daily Calorie Needs": `${calorieNeeds} calories/day`,
        "Weight Loss Target": `${weightLoss} calories/day`,
        "Weight Gain Target": `${weightGain} calories/day`,
        "Height": `${height} ${unitSystem === "metric" ? "cm" : "inches"}`,
        "Weight": `${weight} ${unitSystem === "metric" ? "kg" : "pounds"}`,
        "Age": age,
        "Gender": gender,
        "Activity Level": activity
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
    };

    downloadResultsAsCSV(results, "BMR-Calculator");
  };

  const copyResults = () => {
    if (bmrResult === null || calorieNeeds === null) return;

    const weightLoss = Math.round(calorieNeeds * 0.8);
    const weightGain = Math.round(calorieNeeds * 1.2);

    const results = {
      title: "BMR & Calorie Calculator",
      results: {
        "Basal Metabolic Rate": `${bmrResult} calories/day`,
        "Daily Calorie Needs": `${calorieNeeds} calories/day`,
        "Weight Loss Target": `${weightLoss} calories/day`,
        "Weight Gain Target": `${weightGain} calories/day`,
        "Height": `${height} ${unitSystem === "metric" ? "cm" : "inches"}`,
        "Weight": `${weight} ${unitSystem === "metric" ? "kg" : "pounds"}`,
        "Age": age,
        "Gender": gender,
        "Activity Level": activity
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
    };

    copyResultsToClipboard(results);
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
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">BMR & Calorie Calculator</h2>
      <p className="text-gray-600 mb-4 text-center">
        Calculate your Basal Metabolic Rate and daily calorie needs
      </p>

      <Tabs
        defaultValue={unitSystem}
        onValueChange={handleUnitChange}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger 
            value="imperial"
            className={`${unitSystem === 'imperial' ? 'bg-wellness-blue text-white' : 'bg-gray-100'} transition-colors`}
          >
            Imperial (US)
          </TabsTrigger>
          <TabsTrigger 
            value="metric"
            className={`${unitSystem === 'metric' ? 'bg-wellness-green text-white' : 'bg-gray-100'} transition-colors`}
          >
            Metric
          </TabsTrigger>
        </TabsList>

        <TabsContent value="imperial" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="height-imperial">Height (inches)</Label>
            <Input
              id="height-imperial"
              type="number"
              placeholder="e.g., 70"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              For 5'10", enter 70 inches (5×12 + 10)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight-imperial">Weight (pounds)</Label>
            <Input
              id="weight-imperial"
              type="number"
              placeholder="e.g., 160"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </TabsContent>

        <TabsContent value="metric" className="space-y-4">
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
        </TabsContent>
      </Tabs>

      <div className="space-y-4 mb-6">
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

        <div className="space-y-2">
          <Label htmlFor="activity">Activity Level</Label>
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
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Your Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-3 rounded-md shadow-sm">
                <h4 className="text-gray-500 text-sm">Basal Metabolic Rate</h4>
                <p className="text-2xl font-bold text-wellness-purple">{bmrResult}</p>
                <p className="text-sm">calories/day</p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <h4 className="text-gray-500 text-sm">Daily Calorie Needs</h4>
                <p className="text-2xl font-bold text-wellness-green">{calorieNeeds}</p>
                <p className="text-sm">calories/day</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Calorie Targets:</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-wellness-softBlue p-3 rounded-md">
                <p className="text-sm font-medium">Weight Loss</p>
                <p className="text-lg font-bold">{Math.round(calorieNeeds * 0.8)} calories</p>
              </div>
              <div className="bg-wellness-softGreen p-3 rounded-md">
                <p className="text-sm font-medium">Weight Gain</p>
                <p className="text-lg font-bold">{Math.round(calorieNeeds * 1.2)} calories</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">
              Based on the Mifflin-St Jeor Equation
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyResults}>
                Copy Results
              </Button>
              <Button variant="outline" size="sm" onClick={downloadResults}>
                Download CSV
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BMRCalculator;
