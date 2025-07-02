import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UnitSystem } from "@/types/calculatorTypes";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import IntroSection from "@/components/calculator/IntroSection";

interface OsteoporosisRiskCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const OsteoporosisRiskCalculator: React.FC<OsteoporosisRiskCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("female");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [familyHistory, setFamilyHistory] = useState<"yes" | "no">("no");
  const [smoking, setSmoking] = useState<"yes" | "no">("no");
  const [alcohol, setAlcohol] = useState<"low" | "moderate" | "high">("low");
  const [calciumIntake, setCalciumIntake] = useState<"low" | "moderate" | "high">("moderate");
  const [physicalActivity, setPhysicalActivity] = useState<"low" | "moderate" | "high">("moderate");

  const [riskResult, setRiskResult] = useState<{
    riskLevel: string;
    recommendations: string[];
  } | null>(null);

  const calculateRisk = () => {
    if (!age || !weight || !height) {
      showErrorToast("Please fill in all required fields");
      return;
    }

    const ageValue = parseInt(age);
    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);

    if (isNaN(ageValue) || isNaN(weightValue) || isNaN(heightValue)) {
      showErrorToast("Please enter valid numbers");
      return;
    }

    let riskScore = 0;

    // Age scoring
    if (ageValue >= 65) riskScore += 3;
    else if (ageValue >= 50) riskScore += 2;
    else riskScore += 1;

    // Gender scoring (women are at higher risk)
    if (gender === "female") riskScore += 2;

    // Family history
    if (familyHistory === "yes") riskScore += 1;

    // Smoking
    if (smoking === "yes") riskScore += 1;

    // Alcohol consumption
    if (alcohol === "high") riskScore += 1;

    // Calcium intake
    if (calciumIntake === "low") riskScore += 1;

    // Physical activity
    if (physicalActivity === "low") riskScore += 1;

    let riskLevel: string;
    let recommendations: string[] = [];

    if (riskScore <= 2) {
      riskLevel = "Low Risk";
      recommendations = [
        "Maintain a healthy lifestyle",
        "Ensure adequate calcium and vitamin D intake",
        "Engage in regular weight-bearing exercise"
      ];
    } else if (riskScore <= 4) {
      riskLevel = "Moderate Risk";
      recommendations = [
        "Consider bone density screening",
        "Increase calcium and vitamin D intake",
        "Consult with a healthcare provider",
        "Engage in regular weight-bearing exercise"
      ];
    } else {
      riskLevel = "High Risk";
      recommendations = [
        "Consult with a healthcare provider",
        "Undergo bone density testing",
        "Consider medical treatments",
        "Implement lifestyle changes"
      ];
    }

    setRiskResult({
      riskLevel,
      recommendations
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Osteoporosis Risk Assessment</h2>
        <p className="text-gray-600 mb-4 text-center">
          Evaluate your risk factors for osteoporosis and bone fractures
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age" className="block text-left">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g., 60"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="block text-left">Gender</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight" className="block text-left">Weight ({unitSystem === "metric" ? "kg" : "lbs"})</Label>
              <Input
                id="weight"
                type="number"
                placeholder={unitSystem === "metric" ? "e.g., 70" : "e.g., 150"}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="block text-left">Height ({unitSystem === "metric" ? "cm" : "inches"})</Label>
              <Input
                id="height"
                type="number"
                placeholder={unitSystem === "metric" ? "e.g., 170" : "e.g., 67"}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="block text-left">Family History of Osteoporosis</Label>
            <RadioGroup
              value={familyHistory}
              onValueChange={(value) => setFamilyHistory(value as "yes" | "no")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no-history" />
                <Label htmlFor="no-history">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes-history" />
                <Label htmlFor="yes-history">Yes</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="block text-left">Smoking</Label>
            <RadioGroup
              value={smoking}
              onValueChange={(value) => setSmoking(value as "yes" | "no")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no-smoking" />
                <Label htmlFor="no-smoking">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes-smoking" />
                <Label htmlFor="yes-smoking">Yes</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="block text-left">Alcohol Consumption</Label>
            <RadioGroup
              value={alcohol}
              onValueChange={(value) => setAlcohol(value as "low" | "moderate" | "high")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low-alcohol" />
                <Label htmlFor="low-alcohol">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="moderate-alcohol" />
                <Label htmlFor="moderate-alcohol">Moderate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high-alcohol" />
                <Label htmlFor="high-alcohol">High</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="block text-left">Calcium Intake</Label>
            <RadioGroup
              value={calciumIntake}
              onValueChange={(value) => setCalciumIntake(value as "low" | "moderate" | "high")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low-calcium" />
                <Label htmlFor="low-calcium">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="moderate-calcium" />
                <Label htmlFor="moderate-calcium">Moderate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high-calcium" />
                <Label htmlFor="high-calcium">High</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="block text-left">Physical Activity</Label>
            <RadioGroup
              value={physicalActivity}
              onValueChange={(value) => setPhysicalActivity(value as "low" | "moderate" | "high")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low-activity" />
                <Label htmlFor="low-activity">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="moderate-activity" />
                <Label htmlFor="moderate-activity">Moderate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high-activity" />
                <Label htmlFor="high-activity">High</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button onClick={calculateRisk} className="w-full mb-6">
          Assess Osteoporosis Risk
        </Button>

        {riskResult && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Your Risk Assessment</h3>
              {userName && <p className="text-sm mt-2">Results for: {userName}</p>}
            </div>

            <div className="bg-wellness-softPurple p-3 rounded-md text-center mb-4">
              <p className="text-sm text-gray-700">Risk Level</p>
              <p className="text-lg font-bold text-wellness-purple">{riskResult.riskLevel}</p>
            </div>

            <div className="bg-white p-4 rounded-md">
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {riskResult.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="text-wellness-green mr-2">✓</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 text-center text-sm text-wellness-purple">
              <p>Thank you for using Survive<span className="lowercase">w</span>ellness!</p>
            </div>
          </div>
        )}
      </Card>

      <IntroSection calculatorId="osteoporosis" title="" description="" />
    </div>
  );
};

export default OsteoporosisRiskCalculator;
