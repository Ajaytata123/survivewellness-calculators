
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UnitSystem, MacroCalcProps } from "@/types/calculatorTypes";
import { calculateMacros } from "@/utils/calculationUtils";
import { downloadResultsAsCSV, copyResultsToClipboard, createShareableLink } from "@/utils/downloadUtils";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { Check, Copy, Share } from "lucide-react";
import IntroSection from "@/components/calculator/IntroSection";

const MacroCalculator: React.FC<MacroCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activity, setActivity] = useState<string>("moderate");
  const [goal, setGoal] = useState<string>("maintain");
  const [errors, setErrors] = useState<{height?: string; weight?: string; age?: string}>({});
  const [macroResult, setMacroResult] = useState<{calories: number; protein: number; carbs: number; fat: number} | null>(null);
  const [copied, setCopied] = useState(false);

  const validateInputs = (): boolean => {
    const newErrors: {height?: string; weight?: string; age?: string} = {};
    let isValid = true;
    if (!height.trim() || Number(height) <= 0) {
      newErrors.height = "Please enter your height";
      isValid = false;
    }
    if (!weight.trim() || Number(weight) <= 0) {
      newErrors.weight = "Please enter your weight";
      isValid = false;
    }
    if (!age.trim() || Number(age) <= 0) {
      newErrors.age = "Please enter your age";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleUnitChange = (value: string) => {
    onUnitSystemChange(value as UnitSystem);
    setHeight("");
    setWeight("");
    setAge("");
    setMacroResult(null);
    setErrors({});
  };

  const calculateMacroResults = () => {
    if (!validateInputs()) {
      showErrorToast("Please fill out all required fields.");
      return;
    }

    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);
    const ageValue = parseInt(age);

    if (isNaN(heightValue) || isNaN(weightValue) || isNaN(ageValue) || heightValue <= 0 || weightValue <= 0 || ageValue <= 0) {
      showErrorToast("Please input valid height, weight, and age.");
      return;
    }

    const result = calculateMacros(
      weightValue, heightValue, ageValue, gender, activity, goal, unitSystem === "metric"
    );
    setMacroResult(result);
  };

  const downloadResults = () => {
    if (!macroResult) return;

    const results = {
      title: "Macronutrient Calculator",
      results: {
        "Total Calories": `${macroResult.calories} kcal/day`,
        "Protein": `${macroResult.protein} g/day`,
        "Carbohydrates": `${macroResult.carbs} g/day`,
        "Fat": `${macroResult.fat} g/day`,
        "Height": `${height} ${unitSystem === "metric" ? "cm" : "inches"}`,
        "Weight": `${weight} ${unitSystem === "metric" ? "kg" : "pounds"}`,
        "Age": age,
        "Gender": gender,
        "Activity Level": activity,
        "Diet Goal": goal,
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined,
    };

    downloadResultsAsCSV(results, "Macronutrient-Calculator");
    showSuccessToast("Results downloaded successfully!");
  };

  const copyResults = () => {
    if (!macroResult) return;

    const results = {
      title: "Macronutrient Calculator",
      results: {
        "Total Calories": `${macroResult.calories} kcal/day`,
        "Protein": `${macroResult.protein} g/day`,
        "Carbohydrates": `${macroResult.carbs} g/day`,
        "Fat": `${macroResult.fat} g/day`,
        "Height": `${height} ${unitSystem === "metric" ? "cm" : "inches"}`,
        "Weight": `${weight} ${unitSystem === "metric" ? "kg" : "pounds"}`,
        "Age": age,
        "Gender": gender,
        "Activity Level": activity,
        "Diet Goal": goal,
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined,
    };

    copyResultsToClipboard(results);
    setCopied(true);
    showSuccessToast("Results copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = () => {
    if (!macroResult) return;
    const params = {
      height,
      weight,
      age,
      gender,
      activity,
      goal,
      system: unitSystem,
      name: userName || ""
    };
    const link = createShareableLink("macro", params);
    navigator.clipboard.writeText(link);
    showSuccessToast("Shareable link copied to clipboard!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Macronutrient Calculator</h2>
      <p className="text-gray-600 mb-4 text-center">
        Determine daily calories and macros for your goals
      </p>

      <div className="space-y-4 mb-4">
        <Label htmlFor="name">Your Name (optional)</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>

      <Tabs defaultValue={unitSystem} onValueChange={handleUnitChange} className="mb-6">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="imperial">Imperial (US)</TabsTrigger>
          <TabsTrigger value="metric">Metric</TabsTrigger>
        </TabsList>

        <TabsContent value="imperial" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="height-imperial" className="flex justify-between">
              Height (inches)
              {errors.height && <span className="text-red-500 text-sm">{errors.height}</span>}
            </Label>
            <Input
              id="height-imperial"
              type="number"
              placeholder="e.g., 70"
              value={height}
              onChange={e => {
                setHeight(e.target.value);
                if (e.target.value) setErrors({...errors, height: undefined});
              }}
              className={errors.height ? "border-red-500" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight-imperial" className="flex justify-between">
              Weight (pounds)
              {errors.weight && <span className="text-red-500 text-sm">{errors.weight}</span>}
            </Label>
            <Input
              id="weight-imperial"
              type="number"
              placeholder="e.g., 160"
              value={weight}
              onChange={e => {
                setWeight(e.target.value);
                if (e.target.value) setErrors({...errors, weight: undefined});
              }}
              className={errors.weight ? "border-red-500" : ""}
            />
          </div>
        </TabsContent>

        <TabsContent value="metric" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="height-metric" className="flex justify-between">
              Height (cm)
              {errors.height && <span className="text-red-500 text-sm">{errors.height}</span>}
            </Label>
            <Input
              id="height-metric"
              type="number"
              placeholder="e.g., 175"
              value={height}
              onChange={e => {
                setHeight(e.target.value);
                if (e.target.value) setErrors({...errors, height: undefined});
              }}
              className={errors.height ? "border-red-500" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight-metric" className="flex justify-between">
              Weight (kg)
              {errors.weight && <span className="text-red-500 text-sm">{errors.weight}</span>}
            </Label>
            <Input
              id="weight-metric"
              type="number"
              placeholder="e.g., 70"
              value={weight}
              onChange={e => {
                setWeight(e.target.value);
                if (e.target.value) setErrors({...errors, weight: undefined});
              }}
              className={errors.weight ? "border-red-500" : ""}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-2 mb-4">
        <Label htmlFor="age" className="flex justify-between">
          Age
          {errors.age && <span className="text-red-500 text-sm">{errors.age}</span>}
        </Label>
        <Input
          id="age"
          type="number"
          placeholder="e.g., 30"
          value={age}
          onChange={e => {
            setAge(e.target.value);
            if (e.target.value) setErrors({...errors, age: undefined});
          }}
          className={errors.age ? "border-red-500" : ""}
        />
      </div>

      <div className="space-y-2 mb-4">
        <Label>Gender</Label>
        <RadioGroup
          value={gender}
          onValueChange={val => setGender(val as "male" | "female")}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male-macro" />
            <Label htmlFor="male-macro">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female-macro" />
            <Label htmlFor="female-macro">Female</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2 mb-4">
        <Label htmlFor="activity">Activity Level</Label>
        <select
          id="activity"
          className="block w-full rounded-md border border-input px-3 py-2 bg-background"
          value={activity}
          onChange={e => setActivity(e.target.value)}
        >
          <option value="sedentary">Sedentary (little/no exercise)</option>
          <option value="light">Light (1-3 days/week)</option>
          <option value="moderate">Moderate (3-5 days/week)</option>
          <option value="active">Active (6-7 days/week)</option>
          <option value="veryActive">Very Active (physical job/2× training)</option>
        </select>
      </div>

      <div className="space-y-2 mb-6">
        <Label htmlFor="goal">Diet Goal</Label>
        <select
          id="goal"
          className="block w-full rounded-md border border-input px-3 py-2 bg-background"
          value={goal}
          onChange={e => setGoal(e.target.value)}
        >
          <option value="lose">Lose Weight</option>
          <option value="maintain">Maintain Weight</option>
          <option value="gain">Gain Weight</option>
          <option value="gainMuscle">Gain Muscle</option>
        </select>
      </div>

      <Button onClick={calculateMacroResults} className="w-full mb-6">
        Calculate Macros
      </Button>

      {macroResult && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center">
            <h3 className="text-xl font-bold">Your Macronutrient Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
              <div className="bg-white p-2 rounded shadow-sm">
                <span className="text-gray-500 text-xs">Calories</span>
                <p className="text-lg font-bold text-wellness-purple">{macroResult.calories}</p>
                <span className="text-xs">kcal/day</span>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <span className="text-gray-500 text-xs">Protein</span>
                <p className="text-lg font-bold text-wellness-blue">{macroResult.protein}g</p>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <span className="text-gray-500 text-xs">Carbs</span>
                <p className="text-lg font-bold text-wellness-green">{macroResult.carbs}g</p>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <span className="text-gray-500 text-xs">Fat</span>
                <p className="text-lg font-bold text-wellness-orange">{macroResult.fat}g</p>
              </div>
            </div>
            {userName && <p className="text-sm mt-2">Results for: {userName}</p>}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={copyResults} className="flex items-center">
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              {copied ? "Copied!" : "Copy Results"}
            </Button>
            <Button variant="outline" size="sm" onClick={shareLink} className="flex items-center">
              <Share className="h-4 w-4 mr-1" />
              Share Link
            </Button>
            <Button variant="outline" size="sm" onClick={downloadResults}>
              Download CSV
            </Button>
          </div>
          <div className="pt-4 text-center text-sm text-wellness-purple">
            <span>
              Results based on U.S.{unitSystem === "imperial" ? " (NIH Standards)" : " or Indian standards"}
            </span>
            <br />
            <span className="text-wellness-green">
              Generated by: survive<span className="lowercase">w</span>ellness
            </span>
          </div>
          <div className="mt-3 text-center text-sm text-wellness-purple">
            Thank you for using Survive<span className="lowercase">w</span>ellness!
          </div>
        </div>
      )}

      {/* Add info section at the bottom */}
      <IntroSection calculatorId="macro" title="" description="" />
    </Card>
  );
};

export default MacroCalculator;
