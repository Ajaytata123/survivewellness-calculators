import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UnitSystem } from "@/types/calculatorTypes";
import { downloadResultsAsCSV, copyResultsToClipboard, createShareableLink } from "@/utils/downloadUtils";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { Check, Copy, Share } from "lucide-react";
import IntroSection from "@/components/calculator/IntroSection";

interface VO2MaxCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const VO2MaxCalculator: React.FC<VO2MaxCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [age, setAge] = useState<string>("");
  const [restingHR, setRestingHR] = useState<string>("");
  const [maxHR, setMaxHR] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activityLevel, setActivityLevel] = useState<string>("moderate");
  const [userName, setUserName] = useState<string>("");
  const [vo2MaxResult, setVO2MaxResult] = useState<number | null>(null);
  const [fitnessCategory, setFitnessCategory] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const calculateVO2Max = () => {
    // Validate inputs
    if (!age || !restingHR || !maxHR) {
      showErrorToast("Please fill in all required fields");
      return;
    }

    const ageValue = parseInt(age);
    const restingHRValue = parseInt(restingHR);
    const maxHRValue = parseInt(maxHR);

    if (isNaN(ageValue) || isNaN(restingHRValue) || isNaN(maxHRValue)) {
      showErrorToast("Please enter valid numbers for all fields");
      return;
    }

    if (ageValue <= 0 || ageValue > 120) {
      showErrorToast("Please enter a valid age between 1 and 120");
      return;
    }

    if (restingHRValue <= 30 || restingHRValue > 120) {
      showErrorToast("Please enter a valid resting heart rate between 30 and 120");
      return;
    }

    if (maxHRValue <= 100 || maxHRValue > 230) {
      showErrorToast("Please enter a valid maximum heart rate between 100 and 230");
      return;
    }

    // Calculate VO2 Max using the Heart Rate Reserve method
    // VO2max = 15.3 × (MaxHR/RestHR)
    const vo2Max = Math.round(15.3 * (maxHRValue / restingHRValue));
    
    // Apply activity level adjustment
    let activityMultiplier = 1.0;
    switch (activityLevel) {
      case "sedentary": activityMultiplier = 0.85; break;
      case "light": activityMultiplier = 0.95; break;
      case "moderate": activityMultiplier = 1.0; break; 
      case "active": activityMultiplier = 1.05; break;
      case "veryActive": activityMultiplier = 1.1; break;
    }
    
    const adjustedVO2Max = Math.round(vo2Max * activityMultiplier);
    
    // Determine fitness category based on age and gender
    setVO2MaxResult(adjustedVO2Max);
    setFitnessCategory(determineFitnessCategory(adjustedVO2Max, ageValue, gender));
  };
  
  const determineFitnessCategory = (vo2Max: number, age: number, gender: string): string => {
    // These are approximate categories based on Cooper Institute standards
    if (gender === "male") {
      if (age < 30) {
        if (vo2Max < 38) return "Poor";
        if (vo2Max < 43) return "Fair";
        if (vo2Max < 48) return "Good";
        if (vo2Max < 53) return "Excellent";
        return "Superior";
      } else if (age < 40) {
        if (vo2Max < 36) return "Poor";
        if (vo2Max < 41) return "Fair";
        if (vo2Max < 46) return "Good";
        if (vo2Max < 51) return "Excellent";
        return "Superior";
      } else if (age < 50) {
        if (vo2Max < 34) return "Poor";
        if (vo2Max < 39) return "Fair";
        if (vo2Max < 44) return "Good";
        if (vo2Max < 49) return "Excellent";
        return "Superior";
      } else {
        if (vo2Max < 31) return "Poor";
        if (vo2Max < 36) return "Fair";
        if (vo2Max < 41) return "Good";
        if (vo2Max < 46) return "Excellent";
        return "Superior";
      }
    } else { // Female
      if (age < 30) {
        if (vo2Max < 32) return "Poor";
        if (vo2Max < 37) return "Fair";
        if (vo2Max < 42) return "Good";
        if (vo2Max < 47) return "Excellent";
        return "Superior";
      } else if (age < 40) {
        if (vo2Max < 30) return "Poor";
        if (vo2Max < 35) return "Fair";
        if (vo2Max < 40) return "Good";
        if (vo2Max < 45) return "Excellent";
        return "Superior";
      } else if (age < 50) {
        if (vo2Max < 28) return "Poor";
        if (vo2Max < 33) return "Fair";
        if (vo2Max < 38) return "Good";
        if (vo2Max < 43) return "Excellent";
        return "Superior";
      } else {
        if (vo2Max < 26) return "Poor";
        if (vo2Max < 31) return "Fair";
        if (vo2Max < 36) return "Good";
        if (vo2Max < 41) return "Excellent";
        return "Superior";
      }
    }
  };

  const getActivityLabel = (value: string): string => {
    switch (value) {
      case "sedentary": return "Sedentary (little or no exercise)";
      case "light": return "Light (1-3 days/week)";
      case "moderate": return "Moderate (3-5 days/week)";
      case "active": return "Active (6-7 days/week)";
      case "veryActive": return "Very Active (physical job or 2x training)";
      default: return "";
    }
  };

  const downloadResults = () => {
    if (vo2MaxResult === null) return;

    const results = {
      title: "VO2 Max Calculator",
      results: {
        "VO2 Max": `${vo2MaxResult} ml/kg/min`,
        "Fitness Category": fitnessCategory,
        "Age": age,
        "Resting Heart Rate": `${restingHR} bpm`,
        "Maximum Heart Rate": `${maxHR} bpm`,
        "Gender": gender,
        "Activity Level": getActivityLabel(activityLevel)
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined,
    };

    downloadResultsAsCSV(results, "VO2Max-Calculator");
    showSuccessToast("Results downloaded successfully!");
  };

  const copyResults = () => {
    if (vo2MaxResult === null) return;

    const results = {
      title: "VO2 Max Calculator",
      results: {
        "VO2 Max": `${vo2MaxResult} ml/kg/min`,
        "Fitness Category": fitnessCategory,
        "Age": age,
        "Resting Heart Rate": `${restingHR} bpm`,
        "Maximum Heart Rate": `${maxHR} bpm`,
        "Gender": gender,
        "Activity Level": getActivityLabel(activityLevel)
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
    if (vo2MaxResult === null) return;
    
    const params = {
      age,
      restingHR,
      maxHR,
      gender,
      activityLevel,
      name: userName || ""
    };
    
    const link = createShareableLink("vo2max", params);
    navigator.clipboard.writeText(link);
    showSuccessToast("Shareable link copied to clipboard!");
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "Poor": return "text-red-500";
      case "Fair": return "text-orange-500";
      case "Good": return "text-yellow-500";
      case "Excellent": return "text-green-500";
      case "Superior": return "text-blue-500";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">VO2 Max Calculator</h2>
        <p className="text-gray-600 mb-4 text-center">
          Estimate your maximal oxygen uptake capacity
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
            <Label htmlFor="age">Age</Label>
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
                <RadioGroupItem value="male" id="male-vo2" />
                <Label htmlFor="male-vo2">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female-vo2" />
                <Label htmlFor="female-vo2">Female</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="restingHR">Resting Heart Rate (bpm)</Label>
            <Input
              id="restingHR"
              type="number"
              placeholder="e.g., 65"
              value={restingHR}
              onChange={(e) => setRestingHR(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Measure your heart rate when you first wake up, before getting out of bed
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxHR">Maximum Heart Rate (bpm)</Label>
            <Input
              id="maxHR"
              type="number"
              placeholder="e.g., 190"
              value={maxHR}
              onChange={(e) => setMaxHR(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              If unknown, you can estimate it as 220 minus your age
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activityLevel">Activity Level</Label>
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
      </div>

      <Button onClick={calculateVO2Max} className="w-full mb-6">
        Calculate VO2 Max
      </Button>

      {vo2MaxResult !== null && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Your VO2 Max Result</h3>
            <p className="text-3xl font-bold my-2">{vo2MaxResult} ml/kg/min</p>
            <p className={`text-lg font-medium ${getCategoryColor(fitnessCategory)}`}>
              {fitnessCategory}
            </p>
            {userName && <p className="text-sm mt-2">Results for: {userName}</p>}
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">VO2 Max Categories:</h4>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-white p-2 rounded-md shadow-sm">
                <p className="text-sm font-medium">Poor</p>
                <p className="text-xs text-gray-600">
                  {gender === "male" ? "< 35" : "< 29"} ml/kg/min
                </p>
              </div>
              <div className="bg-white p-2 rounded-md shadow-sm">
                <p className="text-sm font-medium">Fair</p>
                <p className="text-xs text-gray-600">
                  {gender === "male" ? "35-39" : "29-34"} ml/kg/min
                </p>
              </div>
              <div className="bg-white p-2 rounded-md shadow-sm">
                <p className="text-sm font-medium">Good</p>
                <p className="text-xs text-gray-600">
                  {gender === "male" ? "40-45" : "35-40"} ml/kg/min
                </p>
              </div>
              <div className="bg-white p-2 rounded-md shadow-sm">
                <p className="text-sm font-medium">Excellent</p>
                <p className="text-xs text-gray-600">
                  {gender === "male" ? "46-52" : "41-47"} ml/kg/min
                </p>
              </div>
            </div>
            <p className="text-sm italic text-gray-500">Note: Categories are adjusted for age and gender</p>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">
              Based on heart rate reserve method
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

    <IntroSection calculatorId="vo2max" title="" description="" />
    </div>
  );
};

export default VO2MaxCalculator;
