import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WaterIntakeCalcProps, UnitSystem } from "@/types/calculatorTypes";
import { downloadResultsAsCSV, copyResultsToClipboard, createShareableLink } from "@/utils/downloadUtils";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { Check, Copy, Share } from "lucide-react";
import IntroSection from "@/components/calculator/IntroSection";

const WaterIntakeCalculator: React.FC<WaterIntakeCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [weight, setWeight] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("moderate");
  const [climate, setClimate] = useState<string>("temperate");
  const [userName, setUserName] = useState<string>("");
  const [errors, setErrors] = useState<{weight?: string}>({});
  const [waterResult, setWaterResult] = useState<{
    liters: number;
    ounces: number;
    glasses: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const validateInputs = (): boolean => {
    const newErrors: {weight?: string} = {};
    let isValid = true;
    
    if (!weight.trim()) {
      newErrors.weight = "Please enter your weight";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const calculateWaterIntake = () => {
    if (!validateInputs()) return;

    const weightValue = parseFloat(weight);

    if (isNaN(weightValue) || weightValue <= 0) {
      showErrorToast("Please enter a valid weight value.");
      return;
    }

    // Convert weight to kg if using imperial
    const weightInKg = unitSystem === "imperial" ? weightValue / 2.20462 : weightValue;
    
    // Base calculation: ~30-35ml per kg of body weight
    let waterInLiters = (weightInKg * 0.033);
    
    // Adjust for activity level
    switch (activityLevel) {
      case "sedentary":
        waterInLiters *= 0.8;
        break;
      case "light":
        waterInLiters *= 0.9;
        break;
      case "moderate":
        // Default value, no adjustment
        break;
      case "active":
        waterInLiters *= 1.1;
        break;
      case "veryActive":
        waterInLiters *= 1.2;
        break;
    }
    
    // Adjust for climate
    switch (climate) {
      case "cold":
        waterInLiters *= 0.9;
        break;
      case "temperate":
        // Default value, no adjustment
        break;
      case "hot":
        waterInLiters *= 1.1;
        break;
      case "veryHot":
        waterInLiters *= 1.2;
        break;
    }
    
    // Calculate ounces and glasses (standard 8oz glass)
    const waterInOunces = waterInLiters * 33.814;
    const glasses = waterInOunces / 8;

    // Round to reasonable values
    setWaterResult({
      liters: Math.round(waterInLiters * 100) / 100,
      ounces: Math.round(waterInOunces),
      glasses: Math.round(glasses)
    });
  };

  const handleUnitChange = (value: string) => {
    onUnitSystemChange(value as UnitSystem);
    // Reset fields when changing units
    setWeight("");
    setWaterResult(null);
    setErrors({});
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

  const getClimateLabel = (value: string): string => {
    switch (value) {
      case "cold":
        return "Cold (below 50°F/10°C)";
      case "temperate":
        return "Temperate (50-75°F/10-24°C)";
      case "hot":
        return "Hot (75-90°F/24-32°C)";
      case "veryHot":
        return "Very Hot (above 90°F/32°C)";
      default:
        return "";
    }
  };

  const downloadResults = () => {
    if (!waterResult) return;

    const results = {
      title: "Water Intake Calculator",
      results: {
        "Daily Water Intake (Liters)": waterResult.liters,
        "Daily Water Intake (Ounces)": waterResult.ounces,
        "Glasses of Water (8oz)": waterResult.glasses,
        "Weight": `${weight} ${unitSystem === "metric" ? "kg" : "pounds"}`,
        "Activity Level": getActivityLabel(activityLevel),
        "Climate": getClimateLabel(climate),
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined,
    };

    downloadResultsAsCSV(results, "Water-Intake-Calculator");
    showSuccessToast("Results downloaded successfully!");
  };

  const copyResults = () => {
    if (!waterResult) return;

    const results = {
      title: "Water Intake Calculator",
      results: {
        "Daily Water Intake (Liters)": waterResult.liters,
        "Daily Water Intake (Ounces)": waterResult.ounces,
        "Glasses of Water (8oz)": waterResult.glasses,
        "Weight": `${weight} ${unitSystem === "metric" ? "kg" : "pounds"}`,
        "Activity Level": getActivityLabel(activityLevel),
        "Climate": getClimateLabel(climate),
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
    if (!waterResult) return;
    
    const params = {
      weight,
      activity: activityLevel,
      climate,
      system: unitSystem,
      name: userName || ""
    };
    
    const link = createShareableLink("water", params);
    navigator.clipboard.writeText(link);
    showSuccessToast("Shareable link copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Water Intake Calculator</h2>
        <p className="text-gray-600 mb-4 text-center">
          Calculate your daily water needs based on your weight and activity level
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
              <Label htmlFor="weight-imperial" className="flex justify-between">
                Weight (pounds)
                {errors.weight && <span className="text-red-500 text-sm">{errors.weight}</span>}
              </Label>
              <Input
                id="weight-imperial"
                type="number"
                placeholder="e.g., 160"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  if (e.target.value) setErrors({...errors, weight: undefined});
                }}
                className={errors.weight ? "border-red-500" : ""}
              />
            </div>
          </TabsContent>

          <TabsContent value="metric" className="space-y-4">
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
                onChange={(e) => {
                  setWeight(e.target.value);
                  if (e.target.value) setErrors({...errors, weight: undefined});
                }}
                className={errors.weight ? "border-red-500" : ""}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="activity">Activity Level</Label>
            <Select
              value={activityLevel}
              onValueChange={setActivityLevel}
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

        <div className="space-y-2">
          <Label htmlFor="climate">Climate</Label>
          <Select
            value={climate}
            onValueChange={setClimate}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select climate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cold">{getClimateLabel("cold")}</SelectItem>
              <SelectItem value="temperate">{getClimateLabel("temperate")}</SelectItem>
              <SelectItem value="hot">{getClimateLabel("hot")}</SelectItem>
              <SelectItem value="veryHot">{getClimateLabel("veryHot")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={calculateWaterIntake} className="w-full mb-6">
        Calculate Water Intake
      </Button>

      {waterResult && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Your Daily Water Intake</h3>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-wellness-softBlue p-3 rounded-md">
                <p className="text-sm text-gray-600">Liters</p>
                <p className="text-2xl font-bold">{waterResult.liters}</p>
              </div>
              <div className="bg-wellness-softGreen p-3 rounded-md">
                <p className="text-sm text-gray-600">Ounces</p>
                <p className="text-2xl font-bold">{waterResult.ounces}</p>
              </div>
              <div className="bg-wellness-softPurple p-3 rounded-md">
                <p className="text-sm text-gray-600">Glasses (8oz)</p>
                <p className="text-2xl font-bold">{waterResult.glasses}</p>
              </div>
            </div>
            {userName && <p className="text-sm mt-4">Results for: {userName}</p>}
          </div>

          <div className="mt-4 text-sm text-gray-700">
            <h4 className="font-medium">Hydration Tips:</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Drink water consistently throughout the day</li>
              <li>Carry a reusable water bottle with you</li>
              <li>Set reminders to drink water regularly</li>
              <li>Increase intake during exercise or hot weather</li>
              <li>Foods with high water content (fruits, vegetables) also contribute to hydration</li>
            </ul>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">
              Based on recommendations from the U.S. National Academies of Sciences, Engineering, and Medicine
            </p>
            <div className="flex flex-wrap gap-2">
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
          </div>
          
          <div className="mt-6 text-center text-sm text-wellness-purple">
            <p>Thank you for using Survive<span className="lowercase">w</span>ellness!</p>
          </div>
        </div>
      )}
    </Card>

      <IntroSection calculatorId="water" title="" description="" />
    </div>
  );
};

export default WaterIntakeCalculator;
