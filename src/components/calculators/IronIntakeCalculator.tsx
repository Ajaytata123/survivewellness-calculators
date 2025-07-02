import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UnitSystem } from "@/types/calculatorTypes";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import IntroSection from "@/components/calculator/IntroSection";

interface IronIntakeCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const IronIntakeCalculator: React.FC<IronIntakeCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [pregnancyStatus, setPregnancyStatus] = useState<"notPregnant" | "pregnant" | "lactating">("notPregnant");
  const [dietType, setDietType] = useState<"omnivorous" | "vegetarian" | "vegan">("omnivorous");
  
  const [ironIntakeResult, setIronIntakeResult] = useState<{
    recommendedIntake: number;
    foodSources: string[];
    tips: string[];
  } | null>(null);

  const calculateIronIntake = () => {
    if (!age) {
      showErrorToast("Please fill in all required fields");
      return;
    }

    const ageNum = parseInt(age);

    if (isNaN(ageNum)) {
      showErrorToast("Please enter a valid age");
      return;
    }

    let recommendedIntake: number;
    let foodSources: string[] = [];
    let tips: string[] = [];

    // RDA values in mg/day
    if (gender === "male") {
      if (ageNum >= 19) {
        recommendedIntake = 8;
      } else {
        recommendedIntake = 11;
      }
    } else {
      if (pregnancyStatus === "pregnant") {
        recommendedIntake = 27;
        foodSources = [
          "Lean red meat",
          "Poultry",
          "Fortified cereals",
          "Beans",
          "Spinach"
        ];
        tips = [
          "Take iron supplements as prescribed",
          "Combine iron-rich foods with vitamin C",
          "Avoid caffeine with meals",
          "Consult with your healthcare provider"
        ];
      } else if (pregnancyStatus === "lactating") {
        recommendedIntake = 9;
        foodSources = [
          "Lean red meat",
          "Poultry",
          "Fortified cereals",
          "Beans",
          "Spinach"
        ];
        tips = [
          "Continue iron supplementation if needed",
          "Eat a balanced diet",
          "Monitor iron levels",
          "Stay hydrated"
        ];
      } else {
        if (ageNum >= 51) {
          recommendedIntake = 8;
        } else if (ageNum >= 19) {
          recommendedIntake = 18;
        } else {
          recommendedIntake = 15;
        }
      }
    }

    // Adjustments for diet type
    if (dietType === "vegetarian" || dietType === "vegan") {
      recommendedIntake = recommendedIntake * 1.8; // Non-heme iron is less bioavailable
      foodSources = [
        "Fortified cereals",
        "Beans",
        "Lentils",
        "Spinach",
        "Tofu"
      ];
      tips = [
        "Combine iron-rich foods with vitamin C",
        "Avoid tannins (tea, coffee) with meals",
        "Consider iron supplements",
        "Monitor iron levels regularly"
      ];
    }

    setIronIntakeResult({
      recommendedIntake: Math.round(recommendedIntake),
      foodSources,
      tips
    });

    showSuccessToast("Iron intake assessment completed!");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Iron Intake Assessment</h2>
        <p className="text-gray-600 mb-4 text-center">
          Calculate your daily iron needs and assess whether you're getting adequate iron from your diet
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
                placeholder="e.g., 30"
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

          {gender === "female" && (
            <div className="space-y-2">
              <Label className="block text-left">Pregnancy Status</Label>
              <RadioGroup
                value={pregnancyStatus}
                onValueChange={(value) => setPregnancyStatus(value as "notPregnant" | "pregnant" | "lactating")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="notPregnant" id="notPregnant" />
                  <Label htmlFor="notPregnant">Not Pregnant</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pregnant" id="pregnant" />
                  <Label htmlFor="pregnant">Pregnant</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lactating" id="lactating" />
                  <Label htmlFor="lactating">Lactating</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="space-y-2">
            <Label className="block text-left">Diet Type</Label>
            <Select value={dietType} onValueChange={(value) => setDietType(value as "omnivorous" | "vegetarian" | "vegan")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="omnivorous">Omnivorous</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculateIronIntake} className="w-full mb-6">
          Assess Iron Intake
        </Button>

        {ironIntakeResult && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Your Iron Intake Assessment</h3>
              {userName && <p className="text-sm mt-2">Assessment for: {userName}</p>}
            </div>

            <div className="bg-wellness-softPurple p-4 rounded-md mb-4 text-center">
              <p className="text-sm text-gray-700">Recommended Daily Intake</p>
              <p className="text-2xl font-bold text-wellness-purple">{ironIntakeResult.recommendedIntake} mg</p>
            </div>

            {ironIntakeResult.foodSources.length > 0 && (
              <div className="bg-white p-4 rounded-md mb-4">
                <h4 className="font-medium mb-2">Good Food Sources</h4>
                <ul className="space-y-1">
                  {ironIntakeResult.foodSources.map((source, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="text-wellness-blue mr-2">•</span>
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white p-4 rounded-md">
              <h4 className="font-medium mb-2">Important Tips</h4>
              <ul className="space-y-1">
                {ironIntakeResult.tips.map((tip, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="text-wellness-green mr-2">✓</span>
                    {tip}
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

      <IntroSection calculatorId="iron" title="" description="" />
    </div>
  );
};

export default IronIntakeCalculator;
