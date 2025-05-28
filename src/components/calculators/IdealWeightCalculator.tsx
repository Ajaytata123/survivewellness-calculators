
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UnitSystem } from "@/types/calculatorTypes";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import IntroSection from "@/components/calculator/IntroSection";

interface IdealWeightCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const IdealWeightCalculator: React.FC<IdealWeightCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [height, setHeight] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [userName, setUserName] = useState<string>("");
  const [results, setResults] = useState<{
    robinson: number;
    miller: number;
    devine: number;
    hamwi: number;
    average: number;
  } | null>(null);

  const calculateIdealWeight = () => {
    if (!height) {
      showErrorToast("Please enter your height");
      return;
    }

    const heightValue = parseFloat(height);
    if (isNaN(heightValue) || heightValue <= 0) {
      showErrorToast("Please enter a valid height");
      return;
    }

    // Convert height to inches for calculations
    let heightInInches = heightValue;
    if (unitSystem === "metric") {
      heightInInches = heightValue / 2.54; // Convert cm to inches
    }

    // Calculate using different formulas
    const robinson = gender === "male" ? 
      52 + 1.9 * (heightInInches - 60) : 
      49 + 1.7 * (heightInInches - 60);

    const miller = gender === "male" ?
      56.2 + 1.41 * (heightInInches - 60) :
      53.1 + 1.36 * (heightInInches - 60);

    const devine = gender === "male" ?
      50 + 2.3 * (heightInInches - 60) :
      45.5 + 2.3 * (heightInInches - 60);

    const hamwi = gender === "male" ?
      48 + 2.7 * (heightInInches - 60) :
      45.5 + 2.2 * (heightInInches - 60);

    const average = (robinson + miller + devine + hamwi) / 4;

    // Convert to pounds if using imperial
    if (unitSystem === "imperial") {
      setResults({
        robinson: Math.round(robinson * 2.20462),
        miller: Math.round(miller * 2.20462),
        devine: Math.round(devine * 2.20462),
        hamwi: Math.round(hamwi * 2.20462),
        average: Math.round(average * 2.20462)
      });
    } else {
      setResults({
        robinson: Math.round(robinson),
        miller: Math.round(miller),
        devine: Math.round(devine),
        hamwi: Math.round(hamwi),
        average: Math.round(average)
      });
    }
  };

  const handleUnitChange = (value: string) => {
    onUnitSystemChange(value as UnitSystem);
    setHeight("");
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Ideal Weight Calculator</h2>
        <p className="text-gray-600 mb-4 text-center">
          Calculate your ideal body weight using multiple validated formulas
        </p>

        <div className="mb-6">
          <Label htmlFor="userName">Your Name (optional)</Label>
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
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button onClick={calculateIdealWeight} className="w-full mb-6">
          Calculate Ideal Weight
        </Button>

        {results && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Your Ideal Weight Results</h3>
              {userName && <p className="text-sm mt-2">Results for: {userName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Robinson Formula</p>
                <p className="text-lg font-bold">{results.robinson} {unitSystem === "metric" ? "kg" : "lbs"}</p>
              </div>
              <div className="bg-white p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Miller Formula</p>
                <p className="text-lg font-bold">{results.miller} {unitSystem === "metric" ? "kg" : "lbs"}</p>
              </div>
              <div className="bg-white p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Devine Formula</p>
                <p className="text-lg font-bold">{results.devine} {unitSystem === "metric" ? "kg" : "lbs"}</p>
              </div>
              <div className="bg-white p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Hamwi Formula</p>
                <p className="text-lg font-bold">{results.hamwi} {unitSystem === "metric" ? "kg" : "lbs"}</p>
              </div>
            </div>

            <div className="bg-wellness-softPurple p-4 rounded-md mb-4 text-center">
              <p className="text-sm text-gray-700">Average Ideal Weight</p>
              <p className="text-2xl font-bold text-wellness-purple">{results.average} {unitSystem === "metric" ? "kg" : "lbs"}</p>
            </div>

            <div className="mt-6 text-center text-sm text-wellness-purple">
              <p>Thank you for using Survive<span className="lowercase">w</span>ellness!</p>
            </div>
          </div>
        )}
      </Card>

      <IntroSection calculatorId="idealweight" title="" description="" />
    </div>
  );
};

export default IdealWeightCalculator;
