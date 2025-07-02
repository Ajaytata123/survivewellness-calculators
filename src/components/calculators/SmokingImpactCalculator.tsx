
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

interface SmokingImpactCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const SmokingImpactCalculator: React.FC<SmokingImpactCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [cigarettesPerDay, setCigarettesPerDay] = useState<string>("");
  const [yearsSmoked, setYearsSmoked] = useState<string>("");
  const [pricePerPack, setPricePerPack] = useState<string>("10");
  const [currentAge, setCurrentAge] = useState<string>("");

  const [smokingImpact, setSmokingImpact] = useState<{
    packYears: number;
    totalCost: number;
    yearsLost: number;
    healthRisk: string;
    recommendations: string[];
  } | null>(null);

  const calculateSmokingImpact = () => {
    if (!cigarettesPerDay || !yearsSmoked || !pricePerPack || !currentAge) {
      showErrorToast("Please fill in all required fields");
      return;
    }

    const cigarettesDaily = parseInt(cigarettesPerDay);
    const smokingYears = parseInt(yearsSmoked);
    const packPrice = parseFloat(pricePerPack);
    const age = parseInt(currentAge);

    if (isNaN(cigarettesDaily) || isNaN(smokingYears) || isNaN(packPrice) || isNaN(age)) {
      showErrorToast("Please enter valid numbers");
      return;
    }

    // Calculate pack-years (packs per day × years smoked)
    const packsPerDay = cigarettesDaily / 20;
    const packYears = packsPerDay * smokingYears;

    // Calculate total cost
    const totalPacks = packsPerDay * smokingYears * 365;
    const totalCost = totalPacks * packPrice;

    // Estimate years of life lost (rough calculation: 11 minutes per cigarette)
    const totalCigarettes = cigarettesDaily * smokingYears * 365;
    const minutesLost = totalCigarettes * 11;
    const yearsLost = minutesLost / (365 * 24 * 60);

    // Determine health risk level
    let healthRisk: string;
    let recommendations: string[] = [];

    if (packYears < 10) {
      healthRisk = "Moderate Risk";
      recommendations = [
        "Quit smoking immediately to prevent further damage",
        "Consider nicotine replacement therapy",
        "Consult with a healthcare provider",
        "Exercise regularly to improve lung function"
      ];
    } else if (packYears < 30) {
      healthRisk = "High Risk";
      recommendations = [
        "Urgent: Quit smoking immediately",
        "Get regular health screenings",
        "Consider smoking cessation programs",
        "Monitor lung health closely"
      ];
    } else {
      healthRisk = "Very High Risk";
      recommendations = [
        "Immediate medical consultation required",
        "Comprehensive smoking cessation program",
        "Regular cancer screenings",
        "Pulmonary function tests"
      ];
    }

    setSmokingImpact({
      packYears: parseFloat(packYears.toFixed(1)),
      totalCost: Math.round(totalCost),
      yearsLost: parseFloat(yearsLost.toFixed(1)),
      healthRisk,
      recommendations
    });

    showSuccessToast("Smoking impact calculated!");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Smoking Impact Calculator</h2>
        <p className="text-gray-600 mb-4 text-center">
          Calculate the health and financial impact of smoking on your life
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
              <Label htmlFor="cigarettesPerDay" className="block text-left">Cigarettes per Day</Label>
              <Input
                id="cigarettesPerDay"
                type="number"
                placeholder="e.g., 20"
                value={cigarettesPerDay}
                onChange={(e) => setCigarettesPerDay(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsSmoked" className="block text-left">Years Smoked</Label>
              <Input
                id="yearsSmoked"
                type="number"
                placeholder="e.g., 10"
                value={yearsSmoked}
                onChange={(e) => setYearsSmoked(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerPack" className="block text-left">Price per Pack ($)</Label>
              <Input
                id="pricePerPack"
                type="number"
                step="0.01"
                placeholder="e.g., 10.00"
                value={pricePerPack}
                onChange={(e) => setPricePerPack(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentAge" className="block text-left">Current Age</Label>
              <Input
                id="currentAge"
                type="number"
                placeholder="e.g., 35"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button onClick={calculateSmokingImpact} className="w-full mb-6">
          Calculate Smoking Impact
        </Button>

        {smokingImpact && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Your Smoking Impact</h3>
              {userName && <p className="text-sm mt-2">Results for: {userName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-md text-center">
                <p className="text-sm text-red-800">Pack-Years</p>
                <p className="text-lg font-bold text-red-900">{smokingImpact.packYears}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-md text-center">
                <p className="text-sm text-yellow-800">Health Risk</p>
                <p className="text-lg font-bold text-yellow-900">{smokingImpact.healthRisk}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-md text-center">
                <p className="text-sm text-green-800">Total Cost</p>
                <p className="text-lg font-bold text-green-900">${smokingImpact.totalCost.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-md text-center">
                <p className="text-sm text-purple-800">Years Lost</p>
                <p className="text-lg font-bold text-purple-900">{smokingImpact.yearsLost}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md">
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {smokingImpact.recommendations.map((rec, index) => (
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

      <IntroSection calculatorId="smoking" title="" description="" />
    </div>
  );
};

export default SmokingImpactCalculator;
