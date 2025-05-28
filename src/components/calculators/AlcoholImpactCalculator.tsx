
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

interface AlcoholImpactCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const AlcoholImpactCalculator: React.FC<AlcoholImpactCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState<string>("");
  const [drinksPerWeek, setDrinksPerWeek] = useState<string>("");
  const [drinkType, setDrinkType] = useState<string>("beer");
  
  const [impactResult, setImpactResult] = useState<{
    weeklyCalories: number;
    yearlyCalories: number;
    riskLevel: string;
    healthImpacts: string[];
    recommendations: string[];
  } | null>(null);

  const calculateAlcoholImpact = () => {
    if (!age || !weight || !drinksPerWeek) {
      showErrorToast("Please fill in all required fields");
      return;
    }

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const drinksNum = parseInt(drinksPerWeek);

    if (isNaN(ageNum) || isNaN(weightNum) || isNaN(drinksNum)) {
      showErrorToast("Please enter valid numbers");
      return;
    }

    // Calories per drink type (approximate)
    const drinkCalories = {
      beer: 150,
      wine: 125,
      spirits: 100,
      cocktail: 200
    };

    const caloriesPerDrink = drinkCalories[drinkType as keyof typeof drinkCalories];
    const weeklyCalories = drinksNum * caloriesPerDrink;
    const yearlyCalories = weeklyCalories * 52;

    // Risk assessment
    let riskLevel: string;
    let healthImpacts: string[] = [];
    let recommendations: string[] = [];

    // CDC guidelines: moderate drinking = up to 1 drink/day for women, 2 for men
    const weeklyLimit = gender === "female" ? 7 : 14;

    if (drinksNum === 0) {
      riskLevel = "No Risk";
      recommendations = [
        "Continue abstaining from alcohol",
        "Maintain your healthy lifestyle",
        "Consider the long-term health benefits"
      ];
    } else if (drinksNum <= weeklyLimit) {
      riskLevel = "Low Risk";
      healthImpacts = [
        "Minimal impact on liver function",
        "Low cardiovascular risk",
        "Moderate caloric intake from alcohol"
      ];
      recommendations = [
        "Stay within current consumption levels",
        "Drink plenty of water",
        "Avoid drinking on consecutive days"
      ];
    } else if (drinksNum <= weeklyLimit * 2) {
      riskLevel = "Moderate Risk";
      healthImpacts = [
        "Increased liver workload",
        "Higher cardiovascular disease risk",
        "Potential sleep quality issues",
        "Significant caloric intake"
      ];
      recommendations = [
        "Consider reducing consumption",
        "Have alcohol-free days each week",
        "Monitor your liver health",
        "Stay hydrated"
      ];
    } else {
      riskLevel = "High Risk";
      healthImpacts = [
        "Significant liver damage risk",
        "High cardiovascular disease risk",
        "Increased cancer risk",
        "Mental health impacts",
        "Weight gain from excess calories"
      ];
      recommendations = [
        "Strongly consider reducing intake",
        "Consult with healthcare provider",
        "Consider alcohol counseling",
        "Focus on alcohol-free activities"
      ];
    }

    setImpactResult({
      weeklyCalories,
      yearlyCalories,
      riskLevel,
      healthImpacts,
      recommendations
    });

    showSuccessToast("Impact assessment completed!");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Alcohol Impact Assessment</h2>
        <p className="text-gray-600 mb-4 text-center">
          Understand how alcohol consumption affects your health and fitness goals
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g., 30"
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
            <Label htmlFor="weight">Weight ({unitSystem === "metric" ? "kg" : "lbs"})</Label>
            <Input
              id="weight"
              type="number"
              placeholder={unitSystem === "metric" ? "e.g., 70" : "e.g., 154"}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="drinksPerWeek">Drinks per Week</Label>
            <Input
              id="drinksPerWeek"
              type="number"
              placeholder="e.g., 5"
              value={drinksPerWeek}
              onChange={(e) => setDrinksPerWeek(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Primary Drink Type</Label>
            <Select value={drinkType} onValueChange={setDrinkType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beer">Beer (12 oz)</SelectItem>
                <SelectItem value="wine">Wine (5 oz)</SelectItem>
                <SelectItem value="spirits">Spirits (1.5 oz)</SelectItem>
                <SelectItem value="cocktail">Cocktails/Mixed drinks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculateAlcoholImpact} className="w-full mb-6">
          Assess Alcohol Impact
        </Button>

        {impactResult && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Your Alcohol Impact Assessment</h3>
              {userName && <p className="text-sm mt-2">Assessment for: {userName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-white p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Weekly Calories</p>
                <p className="text-lg font-bold">{impactResult.weeklyCalories}</p>
              </div>
              <div className="bg-white p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Yearly Calories</p>
                <p className="text-lg font-bold">{impactResult.yearlyCalories.toLocaleString()}</p>
              </div>
              <div className="bg-wellness-softPurple p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Risk Level</p>
                <p className="text-lg font-bold text-wellness-purple">{impactResult.riskLevel}</p>
              </div>
            </div>

            {impactResult.healthImpacts.length > 0 && (
              <div className="bg-white p-4 rounded-md mb-4">
                <h4 className="font-medium mb-2">Health Impacts</h4>
                <ul className="space-y-1">
                  {impactResult.healthImpacts.map((impact, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="text-wellness-orange mr-2">•</span>
                      {impact}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white p-4 rounded-md">
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {impactResult.recommendations.map((rec, index) => (
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

      <IntroSection calculatorId="alcohol" title="" description="" />
    </div>
  );
};

export default AlcoholImpactCalculator;
