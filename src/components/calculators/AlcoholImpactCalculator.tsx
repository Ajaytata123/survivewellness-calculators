
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnitSystem } from "@/types/calculatorTypes";
import { downloadResultsAsCSV, copyResultsToClipboard, createShareableLink } from "@/utils/downloadUtils";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { Check, Copy, Share } from "lucide-react";

interface AlcoholImpactCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const AlcoholImpactCalculator: React.FC<AlcoholImpactCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [drinksPerWeek, setDrinksPerWeek] = useState<string>("0");
  const [drinkingYears, setDrinkingYears] = useState<string>("0");
  const [drinkCost, setDrinkCost] = useState<string>("5");
  const [copied, setCopied] = useState(false);
  
  const [alcoholImpact, setAlcoholImpact] = useState<{
    caloriesPerYear: number;
    caloriesPerWeekAvg: number;
    liverImpact: string;
    healthRisk: string;
    financialCost: number;
    financialCostLifetime: number;
    lifetimeDrinks: number;
    equivalentCaloriesFoodItems: string[];
    weightGainPerYear: number;
  } | null>(null);

  const handleUnitChange = (value: string) => {
    onUnitSystemChange(value as UnitSystem);
    setWeight("");
  };

  const calculateAlcoholImpact = () => {
    if (!validateInputs()) {
      showErrorToast("Please enter all required information");
      return;
    }
    
    const drinks = parseInt(drinksPerWeek);
    const years = parseInt(drinkingYears);
    const cost = parseFloat(drinkCost);
    const weightValue = parseFloat(weight);
    
    // Convert weight to kg if imperial
    const weightInKg = unitSystem === "imperial" ? weightValue * 0.453592 : weightValue;
    
    // Calculate lifetime drinks
    const lifetimeDrinks = drinks * 52 * years;
    
    // Calculate calories
    // Average standard drink has ~150 calories
    const caloriesPerDrink = 150;
    const caloriesPerWeek = drinks * caloriesPerDrink;
    const caloriesPerYear = caloriesPerWeek * 52;
    
    // Calculate annual weight gain potential (3,500 calories = 1 pound of weight)
    // For metric, convert to kg (1 kg = 2.20462 pounds)
    const weightGainPoundsPerYear = caloriesPerYear / 3500;
    const weightGainPerYear = unitSystem === "imperial" 
      ? parseFloat(weightGainPoundsPerYear.toFixed(1))
      : parseFloat((weightGainPoundsPerYear / 2.20462).toFixed(1));
    
    // Determine health risk based on gender and drinks per week
    let healthRisk = "";
    if (gender === "male") {
      if (drinks <= 7) {
        healthRisk = "Low";
      } else if (drinks <= 14) {
        healthRisk = "Moderate";
      } else if (drinks <= 21) {
        healthRisk = "High";
      } else {
        healthRisk = "Severe";
      }
    } else { // female
      if (drinks <= 4) {
        healthRisk = "Low";
      } else if (drinks <= 7) {
        healthRisk = "Moderate";
      } else if (drinks <= 14) {
        healthRisk = "High";
      } else {
        healthRisk = "Severe";
      }
    }
    
    // Determine liver impact based on lifetime drinks
    let liverImpact = "";
    if (lifetimeDrinks < 520) { // 10 drinks per week for 1 year
      liverImpact = "Minimal";
    } else if (lifetimeDrinks < 2080) { // 10 drinks per week for 4 years
      liverImpact = "Mild";
    } else if (lifetimeDrinks < 5200) { // 10 drinks per week for 10 years
      liverImpact = "Moderate";
    } else if (lifetimeDrinks < 10400) { // 10 drinks per week for 20 years
      liverImpact = "Significant";
    } else {
      liverImpact = "Severe";
    }
    
    // Calculate financial cost
    const financialCostPerYear = drinks * 52 * cost;
    const financialCostLifetime = financialCostPerYear * years;
    
    // Equivalent food items for visualizing calories
    // An average slice of pizza is about 300 calories
    const pizzaSlices = Math.round(caloriesPerYear / 300);
    // An average chocolate bar is about 250 calories
    const chocolateBars = Math.round(caloriesPerYear / 250);
    // A hamburger is about 550 calories
    const hamburgers = Math.round(caloriesPerYear / 550);
    
    const equivalentCaloriesFoodItems = [
      `${pizzaSlices} slices of pizza`,
      `${chocolateBars} chocolate bars`,
      `${hamburgers} hamburgers`
    ];
    
    setAlcoholImpact({
      caloriesPerYear,
      caloriesPerWeekAvg: caloriesPerWeek,
      liverImpact,
      healthRisk,
      financialCost: parseFloat(financialCostPerYear.toFixed(2)),
      financialCostLifetime: parseFloat(financialCostLifetime.toFixed(2)),
      lifetimeDrinks,
      equivalentCaloriesFoodItems,
      weightGainPerYear
    });
  };

  const validateInputs = (): boolean => {
    if (!weight || !drinksPerWeek || !drinkingYears || !drinkCost || !age) {
      return false;
    }
    
    const weightVal = parseFloat(weight);
    const drinksVal = parseInt(drinksPerWeek);
    const yearsVal = parseInt(drinkingYears);
    const costVal = parseFloat(drinkCost);
    const ageVal = parseInt(age);
    
    if (isNaN(weightVal) || isNaN(drinksVal) || isNaN(yearsVal) || isNaN(costVal) || isNaN(ageVal)) {
      return false;
    }
    
    if (weightVal <= 0 || drinksVal < 0 || yearsVal < 0 || costVal <= 0 || ageVal <= 0) {
      return false;
    }
    
    // Ensuring drinking years doesn't exceed age - 12 (assuming legal drinking age as minimum)
    if (yearsVal > (ageVal - 12)) {
      showErrorToast("Drinking years cannot exceed your age minus 12");
      return false;
    }
    
    return true;
  };

  const getImpactColor = (level: string): string => {
    switch (level) {
      case "Minimal": return "text-green-500";
      case "Low": return "text-green-500";
      case "Mild": return "text-green-600";
      case "Moderate": return "text-yellow-500";
      case "High": return "text-yellow-500";
      case "Significant": return "text-orange-500";
      case "Severe": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const downloadResults = () => {
    if (!alcoholImpact) return;

    const results = {
      title: "Alcohol Impact Calculator",
      results: {
        "Weekly Consumption": `${drinksPerWeek} standard drinks`,
        "Years of Consumption": `${drinkingYears} years`,
        "Total Lifetime Drinks": alcoholImpact.lifetimeDrinks.toString(),
        "Calories Per Week": `${alcoholImpact.caloriesPerWeekAvg} calories`,
        "Calories Per Year": `${alcoholImpact.caloriesPerYear} calories`,
        "Potential Weight Gain": `${alcoholImpact.weightGainPerYear} ${unitSystem === "imperial" ? "lbs" : "kg"}/year`,
        "Health Risk Level": alcoholImpact.healthRisk,
        "Liver Impact": alcoholImpact.liverImpact,
        "Financial Cost Yearly": `$${alcoholImpact.financialCost}`,
        "Financial Cost Lifetime": `$${alcoholImpact.financialCostLifetime}`,
        "Weight": `${weight} ${unitSystem === "imperial" ? "lbs" : "kg"}`,
        "Gender": gender
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined,
    };

    downloadResultsAsCSV(results, "Alcohol-Impact-Calculator");
    showSuccessToast("Results downloaded successfully!");
  };

  const copyResults = () => {
    if (!alcoholImpact) return;

    const results = {
      title: "Alcohol Impact Calculator",
      results: {
        "Weekly Consumption": `${drinksPerWeek} standard drinks`,
        "Years of Consumption": `${drinkingYears} years`,
        "Total Lifetime Drinks": alcoholImpact.lifetimeDrinks.toString(),
        "Calories Per Week": `${alcoholImpact.caloriesPerWeekAvg} calories`,
        "Calories Per Year": `${alcoholImpact.caloriesPerYear} calories`,
        "Potential Weight Gain": `${alcoholImpact.weightGainPerYear} ${unitSystem === "imperial" ? "lbs" : "kg"}/year`,
        "Health Risk Level": alcoholImpact.healthRisk,
        "Liver Impact": alcoholImpact.liverImpact,
        "Financial Cost Yearly": `$${alcoholImpact.financialCost}`,
        "Financial Cost Lifetime": `$${alcoholImpact.financialCostLifetime}`,
        "Weight": `${weight} ${unitSystem === "imperial" ? "lbs" : "kg"}`,
        "Gender": gender
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
    if (!alcoholImpact) return;
    
    const params = {
      drinks: drinksPerWeek,
      years: drinkingYears,
      gender,
      age,
      weight,
      system: unitSystem,
      cost: drinkCost,
      name: userName || ""
    };
    
    const link = createShareableLink("alcohol", params);
    navigator.clipboard.writeText(link);
    showSuccessToast("Shareable link copied to clipboard!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Alcohol Impact Calculator</h2>
      <p className="text-gray-600 mb-4 text-center">
        Estimate the health and financial impact of alcohol consumption
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

        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            min="18"
            placeholder="e.g., 35"
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
              <RadioGroupItem value="male" id="male-alcohol" />
              <Label htmlFor="male-alcohol">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female-alcohol" />
              <Label htmlFor="female-alcohol">Female</Label>
            </div>
          </RadioGroup>
        </div>

        <Tabs defaultValue={unitSystem} onValueChange={handleUnitChange} className="mb-0">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="imperial">Imperial (US)</TabsTrigger>
            <TabsTrigger value="metric">Metric</TabsTrigger>
          </TabsList>

          <TabsContent value="imperial" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight-imperial">Weight (lbs)</Label>
              <Input
                id="weight-imperial"
                type="number"
                placeholder="e.g., 160"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="metric" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight-metric">Weight (kg)</Label>
              <Input
                id="weight-metric"
                type="number"
                placeholder="e.g., 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <Label htmlFor="drinksPerWeek">Standard Drinks Per Week</Label>
          <Input
            id="drinksPerWeek"
            type="number"
            min="0"
            placeholder="e.g., 7"
            value={drinksPerWeek}
            onChange={(e) => setDrinksPerWeek(e.target.value)}
          />
          <p className="text-sm text-gray-500">
            One standard drink: 12oz beer (5%), 5oz wine (12%), or 1.5oz liquor (40%)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="drinkingYears">Years of Drinking</Label>
          <Input
            id="drinkingYears"
            type="number"
            min="0"
            placeholder="e.g., 10"
            value={drinkingYears}
            onChange={(e) => setDrinkingYears(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="drinkCost">Average Cost Per Drink ($)</Label>
          <Input
            id="drinkCost"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g., 5.00"
            value={drinkCost}
            onChange={(e) => setDrinkCost(e.target.value)}
          />
        </div>
      </div>

      <Button onClick={calculateAlcoholImpact} className="w-full mb-6">
        Calculate Impact
      </Button>

      {alcoholImpact && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-3">
            <h3 className="text-xl font-bold">Alcohol Impact Results</h3>
            {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white p-3 rounded-md shadow-sm text-center">
              <p className="text-sm text-gray-700">Health Risk</p>
              <p className={`font-bold ${getImpactColor(alcoholImpact.healthRisk)}`}>
                {alcoholImpact.healthRisk}
              </p>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm text-center">
              <p className="text-sm text-gray-700">Liver Impact</p>
              <p className={`font-bold ${getImpactColor(alcoholImpact.liverImpact)}`}>
                {alcoholImpact.liverImpact}
              </p>
            </div>
          </div>
          
          <div className="space-y-4 mb-4">
            <div className="bg-wellness-softBlue p-3 rounded-md">
              <h4 className="font-medium mb-2">Caloric Impact</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <p className="text-sm">Weekly calories:</p>
                  <p className="font-medium">{alcoholImpact.caloriesPerWeekAvg}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">Yearly calories:</p>
                  <p className="font-medium">{alcoholImpact.caloriesPerYear}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">Potential weight gain:</p>
                  <p className="font-medium">
                    {alcoholImpact.weightGainPerYear} {unitSystem === "imperial" ? "lbs" : "kg"}/year
                  </p>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                <p>Yearly caloric equivalent to:</p>
                <ul className="list-disc ml-5 mt-1">
                  {alcoholImpact.equivalentCaloriesFoodItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-wellness-softGreen p-3 rounded-md">
              <h4 className="font-medium mb-2">Financial Impact</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <p className="text-sm">Yearly cost:</p>
                  <p className="font-medium">${alcoholImpact.financialCost}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">Lifetime cost:</p>
                  <p className="font-medium">${alcoholImpact.financialCostLifetime}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">Total drinks consumed:</p>
                  <p className="font-medium">{alcoholImpact.lifetimeDrinks}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-md shadow-sm mb-4">
            <h4 className="font-medium mb-2">What These Results Mean</h4>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Health Risk:</span> Based on {gender === "male" ? "male" : "female"} guidelines 
                ({gender === "male" ? "≤14" : "≤7"} drinks per week is moderate).
              </p>
              <p>
                <span className="font-medium">Liver Impact:</span> Based on total lifetime alcohol exposure.
              </p>
              <p>
                <span className="font-medium">Weight Impact:</span> Extra calories from alcohol may contribute to weight gain if not offset 
                by reduced food intake or increased exercise.
              </p>
            </div>
          </div>

          <div className="mt-4">
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
            <p>
              This calculator provides estimates for educational purposes only and is not a diagnostic tool. 
              If you're concerned about your alcohol consumption, please consult a healthcare provider.
            </p>
            <p className="mt-2">
              Thank you for using Survive<span className="lowercase">w</span>ellness!
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AlcoholImpactCalculator;
