import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnitSystem } from "@/types/calculatorTypes";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import IntroSection from "@/components/calculator/IntroSection";
import ResultActions from "@/components/calculator/ResultActions";
import KnowMoreButton from "@/components/calculator/KnowMoreButton";

interface PregnancyWeightCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const PregnancyWeightCalculator: React.FC<PregnancyWeightCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [prePregnancyWeight, setPrePregnancyWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [isMultiples, setIsMultiples] = useState<boolean>(false);
  const [prePregnancyBMI, setPrePregnancyBMI] = useState<number | null>(null);
  const [weightGainResult, setWeightGainResult] = useState<{
    recommended: number;
    min: number;
    max: number;
    trimesterBreakdown: {
      first: string;
      second: string;
      third: string;
    };
  } | null>(null);

  const handleUnitChange = (value: string) => {
    onUnitSystemChange(value as UnitSystem);
    setPrePregnancyWeight("");
    setHeight("");
    setPrePregnancyBMI(null);
    setWeightGainResult(null);
  };

  const calculateBMI = (): number | null => {
    if (!prePregnancyWeight || !height) return null;
    
    const weight = parseFloat(prePregnancyWeight);
    const heightVal = parseFloat(height);
    
    if (isNaN(weight) || isNaN(heightVal) || weight <= 0 || heightVal <= 0) {
      return null;
    }
    
    let bmi: number;
    if (unitSystem === "imperial") {
      // Weight in pounds, height in inches
      bmi = (weight / (heightVal * heightVal)) * 703;
    } else {
      // Weight in kg, height in cm, need to convert height to meters
      bmi = weight / ((heightVal / 100) * (heightVal / 100));
    }
    
    return parseFloat(bmi.toFixed(1));
  };

  const calculateRecommendedWeightGain = () => {
    const bmi = calculateBMI();
    if (bmi === null) {
      showErrorToast("Please enter valid height and weight");
      return;
    }
    
    setPrePregnancyBMI(bmi);
    
    let minGain: number;
    let maxGain: number;
    
    if (isMultiples) {
      // Twins or more
      if (bmi < 18.5) {
        minGain = 25;
        maxGain = 45;
      } else if (bmi < 25) {
        minGain = 37;
        maxGain = 54;
      } else if (bmi < 30) {
        minGain = 31;
        maxGain = 50;
      } else {
        minGain = 25;
        maxGain = 42;
      }
    } else {
      // Singleton pregnancy
      if (bmi < 18.5) {
        minGain = 28;
        maxGain = 40;
      } else if (bmi < 25) {
        minGain = 25;
        maxGain = 35;
      } else if (bmi < 30) {
        minGain = 15;
        maxGain = 25;
      } else {
        minGain = 11;
        maxGain = 20;
      }
    }
    
    // If metric, convert pounds to kilograms
    if (unitSystem === "metric") {
      minGain = parseFloat((minGain * 0.453592).toFixed(1));
      maxGain = parseFloat((maxGain * 0.453592).toFixed(1));
    }
    
    // Calculate recommended value as the midpoint
    const recommended = parseFloat(((minGain + maxGain) / 2).toFixed(1));
    
    // Calculate trimester breakdown
    // First trimester is typically 2-4 pounds (less weight gain)
    // Second and third trimesters are when most weight is gained
    let firstTrimester: number;
    let laterTrimesters: number;
    
    if (unitSystem === "imperial") {
      firstTrimester = isMultiples ? 5 : 3;
      laterTrimesters = (recommended - firstTrimester) / 2;
      
      setWeightGainResult({
        recommended,
        min: parseFloat(minGain.toFixed(1)),
        max: parseFloat(maxGain.toFixed(1)),
        trimesterBreakdown: {
          first: `0-${firstTrimester} lbs`,
          second: `${firstTrimester}-${(firstTrimester + laterTrimesters).toFixed(1)} lbs`,
          third: `${(firstTrimester + laterTrimesters).toFixed(1)}-${recommended} lbs`
        }
      });
    } else {
      firstTrimester = isMultiples ? 2.3 : 1.4;
      laterTrimesters = (recommended - firstTrimester) / 2;
      
      setWeightGainResult({
        recommended,
        min: parseFloat(minGain.toFixed(1)),
        max: parseFloat(maxGain.toFixed(1)),
        trimesterBreakdown: {
          first: `0-${firstTrimester.toFixed(1)} kg`,
          second: `${firstTrimester.toFixed(1)}-${(firstTrimester + laterTrimesters).toFixed(1)} kg`,
          third: `${(firstTrimester + laterTrimesters).toFixed(1)}-${recommended} kg`
        }
      });
    }

    showSuccessToast("Weight gain calculated successfully!");
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('pregnancy-weight-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Pregnancy Weight Calculator</h2>
        <p className="text-gray-600 mb-4 text-center">
          Calculate healthy weight gain recommendations during pregnancy
        </p>

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

          <Tabs defaultValue={unitSystem} onValueChange={handleUnitChange} className="mb-6">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="imperial">Imperial (US)</TabsTrigger>
              <TabsTrigger value="metric">Metric</TabsTrigger>
            </TabsList>

            <TabsContent value="imperial" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height-imperial" className="block text-left">Height (inches)</Label>
                  <Input
                    id="height-imperial"
                    type="number"
                    placeholder="e.g., 65"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight-imperial" className="block text-left">Pre-pregnancy Weight (lbs)</Label>
                  <Input
                    id="weight-imperial"
                    type="number"
                    placeholder="e.g., 140"
                    value={prePregnancyWeight}
                    onChange={(e) => setPrePregnancyWeight(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metric" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height-metric" className="block text-left">Height (cm)</Label>
                  <Input
                    id="height-metric"
                    type="number"
                    placeholder="e.g., 165"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight-metric" className="block text-left">Pre-pregnancy Weight (kg)</Label>
                  <Input
                    id="weight-metric"
                    type="number"
                    placeholder="e.g., 63"
                    value={prePregnancyWeight}
                    onChange={(e) => setPrePregnancyWeight(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label className="block text-left">Type of Pregnancy</Label>
            <RadioGroup
              value={isMultiples ? "multiples" : "single"}
              onValueChange={(value) => setIsMultiples(value === "multiples")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single">Single Baby</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiples" id="multiples" />
                <Label htmlFor="multiples">Twins/Multiples</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button onClick={calculateRecommendedWeightGain} className="w-full mb-6">
          Calculate Weight Gain
        </Button>

        {weightGainResult && (
          <div id="pregnancy-weight-results" className="bg-gray-50 p-4 rounded-md">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Weight Gain Recommendations</h3>
              {userName && <p className="text-sm mt-2">Results for: {userName}</p>}
            </div>

            {prePregnancyBMI && (
              <div className="bg-white p-3 rounded-md mb-4 text-center">
                <p className="text-sm text-gray-700">Pre-pregnancy BMI</p>
                <p className="text-lg font-bold">{prePregnancyBMI}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-white p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Minimum</p>
                <p className="text-lg font-bold">{weightGainResult.min} {unitSystem === "imperial" ? "lbs" : "kg"}</p>
              </div>
              <div className="bg-wellness-softPurple p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Recommended</p>
                <p className="text-lg font-bold text-wellness-purple">{weightGainResult.recommended} {unitSystem === "imperial" ? "lbs" : "kg"}</p>
              </div>
              <div className="bg-white p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Maximum</p>
                <p className="text-lg font-bold">{weightGainResult.max} {unitSystem === "imperial" ? "lbs" : "kg"}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md">
              <h4 className="font-medium mb-3">Weight Gain by Trimester</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">First Trimester:</span>
                  <span className="text-sm">{weightGainResult.trimesterBreakdown.first}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Second Trimester:</span>
                  <span className="text-sm">{weightGainResult.trimesterBreakdown.second}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Third Trimester:</span>
                  <span className="text-sm">{weightGainResult.trimesterBreakdown.third}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-wellness-purple">
              <p>Thank you for using Survive<span className="lowercase">w</span>ellness!</p>
            </div>
          </div>
        )}
      </Card>

      <IntroSection calculatorId="pregnancyweight" title="" description="" />
    </div>
  );
};

export default PregnancyWeightCalculator;
