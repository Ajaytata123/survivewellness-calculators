
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

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Pregnancy Weight Calculator</h2>
        <p className="text-gray-600 mb-4 text-center">
          Calculate healthy weight gain during pregnancy based on your pre-pregnancy BMI
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

          <Tabs defaultValue={unitSystem} onValueChange={handleUnitChange} className="mb-0">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="imperial">Imperial (US)</TabsTrigger>
              <TabsTrigger value="metric">Metric</TabsTrigger>
            </TabsList>

            <TabsContent value="imperial" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight-imperial">Pre-Pregnancy Weight (lbs)</Label>
                <Input
                  id="weight-imperial"
                  type="number"
                  placeholder="e.g., 150"
                  value={prePregnancyWeight}
                  onChange={(e) => setPrePregnancyWeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height-imperial">Height (inches)</Label>
                <Input
                  id="height-imperial"
                  type="number"
                  placeholder="e.g., 65"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  For 5'5", enter 65 inches (5×12 + 5)
                </p>
              </div>
            </TabsContent>

            <TabsContent value="metric" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight-metric">Pre-Pregnancy Weight (kg)</Label>
                <Input
                  id="weight-metric"
                  type="number"
                  placeholder="e.g., 68"
                  value={prePregnancyWeight}
                  onChange={(e) => setPrePregnancyWeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height-metric">Height (cm)</Label>
                <Input
                  id="height-metric"
                  type="number"
                  placeholder="e.g., 165"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label>Multiple Pregnancy</Label>
            <RadioGroup
              value={isMultiples ? "yes" : "no"}
              onValueChange={(value) => setIsMultiples(value === "yes")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="single" />
                <Label htmlFor="single">Single</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="twins" />
                <Label htmlFor="twins">Twins or more</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button onClick={calculateRecommendedWeightGain} className="w-full mb-6">
          Calculate Recommended Weight Gain
        </Button>

        {weightGainResult && prePregnancyBMI !== null && (
          <div id="pregnancy-weight-results" className="results-container">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-center mb-3">
                <h3 className="text-xl font-bold">Your Pregnancy Weight Gain</h3>
                {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
                <div className="bg-wellness-softPink inline-block px-4 py-1 rounded-full">
                  <p className="text-pink-800 font-medium">
                    {isMultiples ? "Multiple Pregnancy" : "Single Pregnancy"}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-sm text-gray-700">Pre-Pregnancy BMI</p>
                  <p className="font-bold text-lg">{prePregnancyBMI}</p>
                  <p className="text-sm text-wellness-blue">{getBMICategory(prePregnancyBMI)}</p>
                </div>
                <div className="bg-wellness-softPurple p-3 rounded-md">
                  <p className="text-sm text-gray-700">Recommended Weight Gain</p>
                  <p className="font-bold text-lg">
                    {weightGainResult.recommended} {unitSystem === "imperial" ? "lbs" : "kg"}
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                <h4 className="font-medium mb-2">Healthy Weight Gain Range</h4>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Minimum</p>
                  <p className="text-sm text-gray-600">Target</p>
                  <p className="text-sm text-gray-600">Maximum</p>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2 mb-1 relative">
                  <div 
                    className="h-2 bg-wellness-purple rounded-full"
                    style={{ 
                      width: '100%',
                    }}
                  ></div>
                  <div
                    className="absolute h-6 w-6 bg-wellness-purple rounded-full flex items-center justify-center text-white text-xs -top-2"
                    style={{
                      left: `${((weightGainResult.recommended - weightGainResult.min) / (weightGainResult.max - weightGainResult.min)) * 100}%`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    ✓
                  </div>
                </div>
                <div className="flex justify-between text-sm mt-4">
                  <p className="font-medium">
                    {weightGainResult.min} {unitSystem === "imperial" ? "lbs" : "kg"}
                  </p>
                  <p className="font-medium">
                    {weightGainResult.recommended} {unitSystem === "imperial" ? "lbs" : "kg"}
                  </p>
                  <p className="font-medium">
                    {weightGainResult.max} {unitSystem === "imperial" ? "lbs" : "kg"}
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                <h4 className="font-medium mb-2">Trimester Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm">First Trimester</p>
                    <p className="font-medium">{weightGainResult.trimesterBreakdown.first}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm">Second Trimester</p>
                    <p className="font-medium">{weightGainResult.trimesterBreakdown.second}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm">Third Trimester</p>
                    <p className="font-medium">{weightGainResult.trimesterBreakdown.third}</p>
                  </div>
                </div>
              </div>

              <ResultActions
                title="Pregnancy Weight Calculator"
                results={{
                  "Pre-Pregnancy Weight": `${prePregnancyWeight} ${unitSystem === "imperial" ? "lbs" : "kg"}`,
                  "Height": `${height} ${unitSystem === "imperial" ? "inches" : "cm"}`,
                  "Pre-Pregnancy BMI": prePregnancyBMI.toString(),
                  "BMI Category": getBMICategory(prePregnancyBMI),
                  "Multiple Pregnancy": isMultiples ? "Yes" : "No",
                  "Recommended Weight Gain": `${weightGainResult.recommended} ${unitSystem === "imperial" ? "lbs" : "kg"}`,
                  "Weight Gain Range": `${weightGainResult.min}-${weightGainResult.max} ${unitSystem === "imperial" ? "lbs" : "kg"}`,
                  "First Trimester": weightGainResult.trimesterBreakdown.first,
                  "Second Trimester": weightGainResult.trimesterBreakdown.second,
                  "Third Trimester": weightGainResult.trimesterBreakdown.third
                }}
                fileName="Pregnancy-Weight-Calculator"
                userName={userName}
                unitSystem={unitSystem}
                referenceText="This calculator provides general guidelines based on recommendations from the American College of Obstetricians and Gynecologists (ACOG). Always consult with your healthcare provider for personalized advice."
              />
              
              <KnowMoreButton 
                calculatorName="Pregnancy Weight Calculator"
                calculatorId="pregnancyweight"
              />
            </div>
          </div>
        )}
      </Card>

      <IntroSection calculatorId="pregnancyweight" title="" description="" />
    </div>
  );
};

export default PregnancyWeightCalculator;
