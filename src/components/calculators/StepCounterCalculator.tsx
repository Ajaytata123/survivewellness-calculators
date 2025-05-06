
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UnitSystem } from "@/types/calculatorTypes";
import { downloadResultsAsCSV, copyResultsToClipboard } from "@/utils/downloadUtils";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { Check, Copy } from "lucide-react";

interface StepCounterCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const StepCounterCalculator: React.FC<StepCounterCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [steps, setSteps] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [results, setResults] = useState<{
    distance: number;
    calories: number;
    activeMins: number;
    goalPercentage: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleUnitChange = (value: string) => {
    onUnitSystemChange(value as UnitSystem);
    // Reset fields when changing units
    setHeight("");
    setWeight("");
    setResults(null);
  };

  const calculateResults = () => {
    if (!steps || !height) {
      showErrorToast("Please enter your step count and height");
      return;
    }

    const stepsValue = parseInt(steps);
    const heightValue = parseFloat(height);

    if (isNaN(stepsValue) || isNaN(heightValue) || stepsValue < 0 || heightValue <= 0) {
      showErrorToast("Please enter valid steps and height");
      return;
    }

    // Optional values validation
    let ageValue = 30; // default if not provided
    let weightValue = gender === "male" ? 70 : 60; // default in kg if not provided

    if (age) {
      const parsedAge = parseInt(age);
      if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 120) {
        showErrorToast("Please enter a valid age between 1 and 120");
        return;
      }
      ageValue = parsedAge;
    }

    if (weight) {
      const parsedWeight = parseFloat(weight);
      if (isNaN(parsedWeight) || parsedWeight <= 0) {
        showErrorToast("Please enter a valid weight");
        return;
      }
      weightValue = parsedWeight;
      if (unitSystem === "imperial") {
        // Convert pounds to kg
        weightValue = weightValue * 0.453592;
      }
    }

    // Convert height to meters for stride length calculation
    let heightInM = heightValue;
    if (unitSystem === "imperial") {
      // Convert inches to meters
      heightInM = heightValue * 0.0254;
    } else {
      // Convert cm to meters
      heightInM = heightValue / 100;
    }

    // Calculate stride length based on height (approximate) - stride length is ~0.42 of height
    const strideLength = heightInM * 0.42;
    
    // Calculate distance in km or miles
    const distanceInMeters = stepsValue * strideLength;
    let distance: number;
    
    if (unitSystem === "imperial") {
      // Convert to miles
      distance = distanceInMeters / 1609;
    } else {
      // Convert to km
      distance = distanceInMeters / 1000;
    }

    // Calculate calories burned (using MET method)
    // MET value for walking is ~3-4 depending on speed
    const MET = 3.5; // Metabolic equivalent for moderate walking
    // Calories = MET * weight (kg) * time (hours)
    
    // Estimate time based on steps and average cadence (steps per minute)
    const averageCadence = 110; // steps per minute for moderate walking
    const timeInMinutes = stepsValue / averageCadence;
    const timeInHours = timeInMinutes / 60;
    
    // Calculate calories
    const calories = Math.round(MET * weightValue * timeInHours);
    
    // Calculate active minutes (time spent walking)
    const activeMins = Math.round(timeInMinutes);
    
    // Calculate percentage of daily 10,000 step goal
    const goalPercentage = Math.round((stepsValue / 10000) * 100);

    setResults({
      distance: parseFloat(distance.toFixed(2)),
      calories,
      activeMins,
      goalPercentage: goalPercentage > 100 ? 100 : goalPercentage
    });
  };

  const downloadResults = () => {
    if (!results) return;

    const distanceUnit = unitSystem === "imperial" ? "miles" : "km";

    const data = {
      title: "Step Counter Calculator",
      results: {
        "Total Steps": steps,
        "Distance": `${results.distance} ${distanceUnit}`,
        "Calories Burned": `${results.calories} calories`,
        "Active Minutes": `${results.activeMins} minutes`,
        "Goal Progress": `${results.goalPercentage}% of 10,000 steps`,
        "Height": `${height} ${unitSystem === "imperial" ? "in" : "cm"}`,
        ...(weight ? {"Weight": `${weight} ${unitSystem === "imperial" ? "lbs" : "kg"}`} : {}),
        ...(age ? {"Age": age} : {}),
        "Gender": gender
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined,
    };

    downloadResultsAsCSV(data, "Step-Counter");
    showSuccessToast("Results downloaded successfully!");
  };

  const copyResults = () => {
    if (!results) return;

    const distanceUnit = unitSystem === "imperial" ? "miles" : "km";

    const data = {
      title: "Step Counter Calculator",
      results: {
        "Total Steps": steps,
        "Distance": `${results.distance} ${distanceUnit}`,
        "Calories Burned": `${results.calories} calories`,
        "Active Minutes": `${results.activeMins} minutes`,
        "Goal Progress": `${results.goalPercentage}% of 10,000 steps`,
        "Height": `${height} ${unitSystem === "imperial" ? "in" : "cm"}`,
        ...(weight ? {"Weight": `${weight} ${unitSystem === "imperial" ? "lbs" : "kg"}`} : {}),
        ...(age ? {"Age": age} : {}),
        "Gender": gender
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined,
    };

    copyResultsToClipboard(data);
    setCopied(true);
    showSuccessToast("Results copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Step Counter Calculator</h2>
      <p className="text-gray-600 mb-4 text-center">
        Convert your steps into distance, calories, and activity metrics
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

        <div className="space-y-2">
          <Label htmlFor="steps">Number of Steps</Label>
          <Input
            id="steps"
            type="number"
            placeholder="e.g., 8000"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        defaultValue={unitSystem}
        onValueChange={handleUnitChange}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="imperial">Imperial (US)</TabsTrigger>
          <TabsTrigger value="metric">Metric</TabsTrigger>
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
            <Label htmlFor="weight-imperial">Weight (pounds, optional)</Label>
            <Input
              id="weight-imperial"
              type="number"
              placeholder="e.g., 160"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              For more accurate calorie calculation
            </p>
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
            <Label htmlFor="weight-metric">Weight (kg, optional)</Label>
            <Input
              id="weight-metric"
              type="number"
              placeholder="e.g., 70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              For more accurate calorie calculation
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="age">Age (optional)</Label>
          <Input
            id="age"
            type="number"
            placeholder="e.g., 35"
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
              <RadioGroupItem value="male" id="male-steps" />
              <Label htmlFor="male-steps">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female-steps" />
              <Label htmlFor="female-steps">Female</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <Button onClick={calculateResults} className="w-full mb-6">
        Calculate Results
      </Button>

      {results && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Your Step Results</h3>
            {userName && <p className="text-sm mt-2">Results for: {userName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-wellness-softPurple p-3 rounded-md text-center">
              <p className="text-sm text-gray-700">Total Steps</p>
              <p className="font-bold text-lg">{parseInt(steps).toLocaleString()}</p>
            </div>
            <div className="bg-wellness-softBlue p-3 rounded-md text-center">
              <p className="text-sm text-gray-700">Distance</p>
              <p className="font-bold text-lg">
                {results.distance} {unitSystem === "imperial" ? "miles" : "km"}
              </p>
            </div>
            <div className="bg-wellness-softGreen p-3 rounded-md text-center">
              <p className="text-sm text-gray-700">Calories</p>
              <p className="font-bold text-lg">{results.calories}</p>
            </div>
            <div className="bg-wellness-softOrange p-3 rounded-md text-center">
              <p className="text-sm text-gray-700">Active Time</p>
              <p className="font-bold text-lg">{results.activeMins} min</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Daily Goal Progress (10,000 steps)</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-wellness-purple h-2.5 rounded-full" 
                style={{ width: `${results.goalPercentage}%` }}
              ></div>
            </div>
            <p className="text-right text-xs mt-1">{results.goalPercentage}% complete</p>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">
              Based on your height and step count
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={copyResults} className="flex items-center">
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied!" : "Copy Results"}
              </Button>
              <Button variant="outline" size="sm" onClick={downloadResults}>
                Download CSV
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-wellness-purple">
            <p>Thank you for using Survive<span className="lowercase">w</span>ellness!</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default StepCounterCalculator;
