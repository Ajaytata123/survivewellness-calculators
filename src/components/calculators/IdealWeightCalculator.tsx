import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IdealWeightCalcProps, UnitSystem } from "@/types/calculatorTypes";
import { downloadResultsAsCSV, copyResultsToClipboard, createShareableLink } from "@/utils/downloadUtils";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { Check, Copy, Share } from "lucide-react";

const IdealWeightCalculator: React.FC<IdealWeightCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [height, setHeight] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [errors, setErrors] = useState<{height?: string}>({});
  const [idealWeightResult, setIdealWeightResult] = useState<number | null>(null);
  const [idealWeightRange, setIdealWeightRange] = useState<{min: number, max: number} | null>(null);
  const [copied, setCopied] = useState(false);

  const validateInputs = (): boolean => {
    const newErrors: {height?: string} = {};
    let isValid = true;
    
    if (!height.trim()) {
      newErrors.height = "Please enter your height";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Function to calculate ideal weight using various formulas
  const calculateIdealWeightResult = () => {
    if (!validateInputs()) return;

    const heightValue = parseFloat(height);

    if (isNaN(heightValue) || heightValue <= 0) {
      showErrorToast("Please enter a valid height value.");
      return;
    }

    let idealWeight: number;
    let minWeight: number;
    let maxWeight: number;

    // Convert height to meters for metric calculations or keep in inches for imperial
    const heightInMeters = unitSystem === "metric" ? heightValue / 100 : heightValue / 39.37;
    const heightInInches = unitSystem === "metric" ? heightValue / 2.54 : heightValue;

    // Calculate ideal weight based on gender using Modified Devine Formula
    if (gender === "male") {
      // For males: IBW = 50 kg + 2.3 kg for each inch over 5 feet
      idealWeight = unitSystem === "metric" 
        ? 50 + 0.91 * (heightValue - 152.4) // height in cm
        : 50 + 2.3 * (heightValue - 60); // height in inches
        
      // BMI range 18.5-24.9 for healthy weight
      minWeight = 18.5 * (heightInMeters * heightInMeters);
      maxWeight = 24.9 * (heightInMeters * heightInMeters);
    } else {
      // For females: IBW = 45.5 kg + 2.3 kg for each inch over 5 feet
      idealWeight = unitSystem === "metric"
        ? 45.5 + 0.91 * (heightValue - 152.4) // height in cm
        : 45.5 + 2.3 * (heightValue - 60); // height in inches
        
      // BMI range 18.5-24.9 for healthy weight
      minWeight = 18.5 * (heightInMeters * heightInMeters);
      maxWeight = 24.9 * (heightInMeters * heightInMeters);
    }

    // Convert to pounds if using imperial
    if (unitSystem === "imperial") {
      idealWeight = idealWeight * 2.20462;
      minWeight = minWeight * 2.20462;
      maxWeight = maxWeight * 2.20462;
    }

    // Round to one decimal place
    setIdealWeightResult(Math.round(idealWeight * 10) / 10);
    setIdealWeightRange({
      min: Math.round(minWeight * 10) / 10,
      max: Math.round(maxWeight * 10) / 10
    });
  };

  const handleUnitChange = (value: string) => {
    onUnitSystemChange(value as UnitSystem);
    // Reset fields when changing units
    setHeight("");
    setIdealWeightResult(null);
    setIdealWeightRange(null);
    setErrors({});
  };

  const downloadResults = () => {
    if (idealWeightResult === null || idealWeightRange === null) return;

    const results = {
      title: "Ideal Weight Calculator",
      results: {
        "Ideal Weight": `${idealWeightResult} ${unitSystem === "metric" ? "kg" : "lbs"}`,
        "Healthy Weight Range": `${idealWeightRange.min} - ${idealWeightRange.max} ${unitSystem === "metric" ? "kg" : "lbs"}`,
        "Height": `${height} ${unitSystem === "metric" ? "cm" : "inches"}`,
        "Gender": gender,
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined,
    };

    downloadResultsAsCSV(results, "Ideal-Weight-Calculator");
    showSuccessToast("Results downloaded successfully!");
  };

  const copyResults = () => {
    if (idealWeightResult === null || idealWeightRange === null) return;

    const results = {
      title: "Ideal Weight Calculator",
      results: {
        "Ideal Weight": `${idealWeightResult} ${unitSystem === "metric" ? "kg" : "lbs"}`,
        "Healthy Weight Range": `${idealWeightRange.min} - ${idealWeightRange.max} ${unitSystem === "metric" ? "kg" : "lbs"}`,
        "Height": `${height} ${unitSystem === "metric" ? "cm" : "inches"}`,
        "Gender": gender,
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
    if (idealWeightResult === null) return;
    
    const params = {
      height,
      gender,
      system: unitSystem,
      name: userName || ""
    };
    
    const link = createShareableLink("idealweight", params);
    navigator.clipboard.writeText(link);
    showSuccessToast("Shareable link copied to clipboard!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Ideal Weight Calculator</h2>
      <p className="text-gray-600 mb-4 text-center">
        Calculate your ideal weight based on height and gender
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
        </TabsContent>
      </Tabs>

      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup
            value={gender}
            onValueChange={(value) => setGender(value as "male" | "female")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male-iw" />
              <Label htmlFor="male-iw">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female-iw" />
              <Label htmlFor="female-iw">Female</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <Button onClick={calculateIdealWeightResult} className="w-full mb-6">
        Calculate Ideal Weight
      </Button>

      {idealWeightResult !== null && idealWeightRange !== null && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center">
            <h3 className="text-xl font-bold">Your Ideal Weight</h3>
            <p className="text-3xl font-bold my-2">
              {idealWeightResult} {unitSystem === "metric" ? "kg" : "lbs"}
            </p>
            <div className="bg-wellness-softGreen p-3 rounded-md inline-block">
              <p className="text-sm font-medium">Healthy Weight Range:</p>
              <p className="text-lg font-bold">
                {idealWeightRange.min} - {idealWeightRange.max} {unitSystem === "metric" ? "kg" : "lbs"}
              </p>
            </div>
            {userName && <p className="text-sm mt-2">Results for: {userName}</p>}
          </div>

          <div className="mt-6 space-y-2">
            <h4 className="font-medium">About This Calculation:</h4>
            <p className="text-sm text-gray-700">
              This calculator uses the Modified Devine Formula, one of the most widely accepted methods 
              to calculate ideal body weight. It's also cross-referenced with healthy BMI ranges (18.5-24.9) 
              as defined by health organizations.
            </p>
            <p className="text-sm text-gray-700 mt-2">
              Remember that ideal weight varies based on body composition, muscle mass, and other individual factors.
            </p>
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

export default IdealWeightCalculator;
