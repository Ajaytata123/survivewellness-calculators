
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateBMI, getBMICategory } from "@/utils/calculationUtils";
import { BMICalcProps, UnitSystem } from "@/types/calculatorTypes";
import { 
  downloadResultsAsCSV, 
  prepareResultsAsText, 
  copyResultsToClipboard,
  createShareableLink 
} from "@/utils/downloadUtils";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { Check, Copy, Share } from "lucide-react";

const BMICalculator: React.FC<BMICalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [errors, setErrors] = useState<{height?: string; weight?: string}>({});
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");
  const [bmiCategoryColor, setBmiCategoryColor] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const validateInputs = (): boolean => {
    const newErrors: {height?: string; weight?: string} = {};
    let isValid = true;
    
    if (!height.trim()) {
      newErrors.height = "Please enter your height";
      isValid = false;
    }
    
    if (!weight.trim()) {
      newErrors.weight = "Please enter your weight";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const calculateBMIResult = () => {
    if (!validateInputs()) return;

    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);

    if (isNaN(heightValue) || isNaN(weightValue) || heightValue <= 0 || weightValue <= 0) {
      showErrorToast("Please enter valid height and weight values.");
      return;
    }

    const bmi = calculateBMI(weightValue, heightValue, unitSystem === "metric");
    const roundedBMI = Math.round(bmi * 10) / 10;
    const { category, color } = getBMICategory(roundedBMI);

    setBmiResult(roundedBMI);
    setBmiCategory(category);
    setBmiCategoryColor(color);
  };

  const handleUnitChange = (value: string) => {
    onUnitSystemChange(value as UnitSystem);
    // Reset fields when changing units
    setHeight("");
    setWeight("");
    setBmiResult(null);
    setErrors({});
  };

  const downloadResults = () => {
    if (bmiResult === null) return;

    const results = {
      title: "BMI Calculator",
      results: {
        BMI: bmiResult.toFixed(1),
        Category: bmiCategory,
        Height: `${height} ${unitSystem === "metric" ? "cm" : "inches"}`,
        Weight: `${weight} ${unitSystem === "metric" ? "kg" : "pounds"}`,
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined,
    };

    downloadResultsAsCSV(results, "BMI-Calculator");
    showSuccessToast("Results downloaded successfully!");
  };

  const copyResults = () => {
    if (bmiResult === null) return;

    const results = {
      title: "BMI Calculator",
      results: {
        BMI: bmiResult.toFixed(1),
        Category: bmiCategory,
        Height: `${height} ${unitSystem === "metric" ? "cm" : "inches"}`,
        Weight: `${weight} ${unitSystem === "metric" ? "kg" : "pounds"}`,
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
    if (bmiResult === null) return;
    
    const params = {
      height,
      weight,
      system: unitSystem,
      name: userName || ""
    };
    
    const link = createShareableLink("bmi", params);
    navigator.clipboard.writeText(link);
    showSuccessToast("Shareable link copied to clipboard!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">BMI Calculator</h2>
      <p className="text-gray-600 mb-4 text-center">
        Calculate your Body Mass Index based on your height and weight
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
            <Label htmlFor="height-imperial" className="flex justify-between">
              Height (inches)
              {errors.height && <span className="text-red-500 text-sm">{errors.height}</span>}
            </Label>
            <Input
              id="height-imperial"
              type="number"
              placeholder="e.g., 70"
              value={height}
              onChange={(e) => {
                setHeight(e.target.value);
                if (e.target.value) setErrors({...errors, height: undefined});
              }}
              className={errors.height ? "border-red-500" : ""}
            />
            <p className="text-sm text-gray-500">
              For 5'10", enter 70 inches (5×12 + 10)
            </p>
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
            <Label htmlFor="height-metric" className="flex justify-between">
              Height (cm)
              {errors.height && <span className="text-red-500 text-sm">{errors.height}</span>}
            </Label>
            <Input
              id="height-metric"
              type="number"
              placeholder="e.g., 175"
              value={height}
              onChange={(e) => {
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
              onChange={(e) => {
                setWeight(e.target.value);
                if (e.target.value) setErrors({...errors, weight: undefined});
              }}
              className={errors.weight ? "border-red-500" : ""}
            />
          </div>
        </TabsContent>
      </Tabs>

      <Button onClick={calculateBMIResult} className="w-full mb-6">
        Calculate BMI
      </Button>

      {bmiResult !== null && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center">
            <h3 className="text-xl font-bold">Your BMI Result</h3>
            <p className="text-3xl font-bold my-2">{bmiResult.toFixed(1)}</p>
            <p className={`text-lg font-medium ${bmiCategoryColor}`}>
              {bmiCategory}
            </p>
            {userName && <p className="text-sm mt-2">Results for: {userName}</p>}
          </div>

          <div className="mt-6 space-y-2">
            <h4 className="font-medium">BMI Categories:</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li className="flex justify-between">
                <span>Underweight</span>
                <span>Less than 18.5</span>
              </li>
              <li className="flex justify-between">
                <span>Normal weight</span>
                <span>18.5 - 24.9</span>
              </li>
              <li className="flex justify-between">
                <span>Overweight</span>
                <span>25 - 29.9</span>
              </li>
              <li className="flex justify-between">
                <span>Obesity (Class 1)</span>
                <span>30 - 34.9</span>
              </li>
              <li className="flex justify-between">
                <span>Obesity (Class 2)</span>
                <span>35 - 39.9</span>
              </li>
              <li className="flex justify-between">
                <span>Extreme Obesity (Class 3)</span>
                <span>40 or higher</span>
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">
              Reference: U.S. National Institutes of Health (NIH)
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
  );
};

export default BMICalculator;
