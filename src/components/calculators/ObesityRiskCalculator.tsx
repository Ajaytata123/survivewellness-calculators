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

interface ObesityRiskCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const ObesityRiskCalculator: React.FC<ObesityRiskCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [waistCircumference, setWaistCircumference] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [familyHistory, setFamilyHistory] = useState<"yes" | "no">("no");
  const [activityLevel, setActivityLevel] = useState<"low" | "moderate" | "high">("moderate");
  
  const [riskResult, setRiskResult] = useState<{
    bmi: number;
    waistRisk: string;
    overallRisk: string;
    recommendations: string[];
  } | null>(null);

  const calculateObesityRisk = () => {
    if (!height || !weight || !waistCircumference || !age) {
      showErrorToast("Please fill in all required fields");
      return;
    }

    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);
    const waistValue = parseFloat(waistCircumference);
    const ageValue = parseInt(age);

    if (isNaN(heightValue) || isNaN(weightValue) || isNaN(waistValue) || isNaN(ageValue)) {
      showErrorToast("Please enter valid numbers");
      return;
    }

    // Calculate BMI
    let bmi: number;
    if (unitSystem === "imperial") {
      bmi = (weightValue / (heightValue * heightValue)) * 703;
    } else {
      bmi = weightValue / ((heightValue / 100) * (heightValue / 100));
    }

    // Assess waist circumference risk
    let waistRisk: string;
    const waistThreshold = unitSystem === "imperial" 
      ? (gender === "male" ? 40 : 35) // inches
      : (gender === "male" ? 102 : 88); // cm

    if (waistValue > waistThreshold) {
      waistRisk = "High Risk";
    } else if (waistValue > waistThreshold * 0.9) {
      waistRisk = "Moderate Risk";
    } else {
      waistRisk = "Low Risk";
    }

    // Calculate overall risk
    let riskScore = 0;
    
    // BMI scoring
    if (bmi >= 30) riskScore += 3;
    else if (bmi >= 25) riskScore += 2;
    else if (bmi >= 18.5) riskScore += 0;
    else riskScore += 1;

    // Waist circumference scoring
    if (waistRisk === "High Risk") riskScore += 2;
    else if (waistRisk === "Moderate Risk") riskScore += 1;

    // Age scoring
    if (ageValue >= 65) riskScore += 2;
    else if (ageValue >= 45) riskScore += 1;

    // Family history
    if (familyHistory === "yes") riskScore += 1;

    // Activity level
    if (activityLevel === "low") riskScore += 1;

    let overallRisk: string;
    let recommendations: string[] = [];

    if (riskScore <= 2) {
      overallRisk = "Low Risk";
      recommendations = [
        "Maintain current healthy lifestyle",
        "Regular physical activity",
        "Balanced nutrition"
      ];
    } else if (riskScore <= 4) {
      overallRisk = "Moderate Risk";
      recommendations = [
        "Increase physical activity",
        "Focus on portion control",
        "Consider consulting a healthcare provider",
        "Monitor weight regularly"
      ];
    } else if (riskScore <= 6) {
      overallRisk = "High Risk";
      recommendations = [
        "Consult with a healthcare provider",
        "Develop a structured weight management plan",
        "Consider nutritional counseling",
        "Regular health screenings"
      ];
    } else {
      overallRisk = "Very High Risk";
      recommendations = [
        "Immediate consultation with healthcare provider",
        "Comprehensive weight management program",
        "Regular medical monitoring",
        "Consider professional support programs"
      ];
    }

    setRiskResult({
      bmi: parseFloat(bmi.toFixed(1)),
      waistRisk,
      overallRisk,
      recommendations
    });
  };

  const handleUnitChange = (value: string) => {
    onUnitSystemChange(value as UnitSystem);
    setHeight("");
    setWeight("");
    setWaistCircumference("");
    setRiskResult(null);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Obesity Risk Assessment</h2>
        <p className="text-gray-600 mb-4 text-center">
          Evaluate your risk factors for obesity-related health complications
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
                    placeholder="e.g., 70"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight-imperial" className="block text-left">Weight (lbs)</Label>
                  <Input
                    id="weight-imperial"
                    type="number"
                    placeholder="e.g., 160"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="waist-imperial" className="block text-left">Waist Circumference (inches)</Label>
                <Input
                  id="waist-imperial"
                  type="number"
                  placeholder="e.g., 32"
                  value={waistCircumference}
                  onChange={(e) => setWaistCircumference(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="metric" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height-metric" className="block text-left">Height (cm)</Label>
                  <Input
                    id="height-metric"
                    type="number"
                    placeholder="e.g., 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight-metric" className="block text-left">Weight (kg)</Label>
                  <Input
                    id="weight-metric"
                    type="number"
                    placeholder="e.g., 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="waist-metric" className="block text-left">Waist Circumference (cm)</Label>
                <Input
                  id="waist-metric"
                  type="number"
                  placeholder="e.g., 80"
                  value={waistCircumference}
                  onChange={(e) => setWaistCircumference(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age" className="block text-left">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g., 35"
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

          <div className="space-y-2">
            <Label className="block text-left">Family History of Obesity</Label>
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
            <Label className="block text-left">Physical Activity Level</Label>
            <RadioGroup
              value={activityLevel}
              onValueChange={(value) => setActivityLevel(value as "low" | "moderate" | "high")}
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

        <Button onClick={calculateObesityRisk} className="w-full mb-6">
          Assess Obesity Risk
        </Button>

        {riskResult && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Your Risk Assessment</h3>
              {userName && <p className="text-sm mt-2">Results for: {userName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-white p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">BMI</p>
                <p className="text-lg font-bold">{riskResult.bmi}</p>
              </div>
              <div className="bg-white p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Waist Risk</p>
                <p className="text-lg font-bold">{riskResult.waistRisk}</p>
              </div>
              <div className="bg-wellness-softPurple p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Overall Risk</p>
                <p className="text-lg font-bold text-wellness-purple">{riskResult.overallRisk}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md">
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {riskResult.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="text-wellness-purple mr-2">•</span>
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

      <IntroSection calculatorId="obesity" title="" description="" />
    </div>
  );
};

export default ObesityRiskCalculator;
