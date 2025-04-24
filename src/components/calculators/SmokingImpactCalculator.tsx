
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

interface SmokingImpactCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const SmokingImpactCalculator: React.FC<SmokingImpactCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [cigarettesPerDay, setCigarettesPerDay] = useState<string>("");
  const [smokingYears, setSmokingYears] = useState<string>("");
  const [pricePerPack, setPricePerPack] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [copied, setCopied] = useState(false);
  
  const [smokingImpact, setSmokingImpact] = useState<{
    packYears: number;
    lifeLostDays: number;
    lifeLostYears: number;
    moneyCost: number;
    monthlyMoneyCost: number;
    financialOpportunityCost: number;
    totalCigarettes: number;
    healthRisk: string;
    carbonMonoxide: number;
    tar: number;
  } | null>(null);
  
  const [currency, setCurrency] = useState<string>("$");

  const calculateSmokingImpact = () => {
    if (!validateInputs()) {
      showErrorToast("Please enter all required information");
      return;
    }
    
    const cigarettes = parseInt(cigarettesPerDay);
    const years = parseInt(smokingYears);
    const price = parseFloat(pricePerPack);
    
    // Calculate pack years (packs per day × years smoked)
    const packsPerDay = cigarettes / 20; // Assuming 20 cigarettes per pack
    const packYears = parseFloat((packsPerDay * years).toFixed(1));
    
    // Calculate total cigarettes
    const totalCigarettes = cigarettes * 365 * years;
    
    // Calculate life expectancy impact
    // Estimated 11 minutes of life lost per cigarette
    const lifeLostMinutes = totalCigarettes * 11;
    const lifeLostDays = Math.round(lifeLostMinutes / (60 * 24));
    const lifeLostYears = parseFloat((lifeLostDays / 365).toFixed(1));
    
    // Calculate financial cost
    const dailyCost = packsPerDay * price;
    const monthlyCost = dailyCost * 30.4; // Average days in a month
    const totalCost = dailyCost * 365 * years;
    
    // Calculate opportunity cost (if money was invested with 7% annual return)
    // This is a simplified calculation
    let opportunityCost = 0;
    const monthlyInvestment = monthlyCost;
    const monthsSmoked = years * 12;
    const annualInterestRate = 0.07;
    const monthlyInterestRate = annualInterestRate / 12;
    
    for (let i = 0; i < monthsSmoked; i++) {
      opportunityCost = (opportunityCost + monthlyInvestment) * (1 + monthlyInterestRate);
    }
    
    // Determine health risk
    let healthRisk: string;
    if (packYears < 10) {
      healthRisk = "Moderate";
    } else if (packYears < 20) {
      healthRisk = "High";
    } else if (packYears < 40) {
      healthRisk = "Very High";
    } else {
      healthRisk = "Severe";
    }
    
    // Calculate toxin exposure
    // Average cigarette contains about 10mg of tar and 10mg of carbon monoxide
    const carbonMonoxide = totalCigarettes * 0.01; // in grams
    const tar = totalCigarettes * 0.01; // in grams
    
    setSmokingImpact({
      packYears,
      lifeLostDays,
      lifeLostYears,
      moneyCost: parseFloat(totalCost.toFixed(2)),
      monthlyMoneyCost: parseFloat(monthlyCost.toFixed(2)),
      financialOpportunityCost: parseFloat(opportunityCost.toFixed(2)),
      totalCigarettes,
      healthRisk,
      carbonMonoxide: parseFloat(carbonMonoxide.toFixed(1)),
      tar: parseFloat(tar.toFixed(1))
    });
  };

  const validateInputs = (): boolean => {
    if (!cigarettesPerDay || !smokingYears || !pricePerPack || !age) {
      return false;
    }
    
    const cigarettesVal = parseInt(cigarettesPerDay);
    const yearsVal = parseInt(smokingYears);
    const priceVal = parseFloat(pricePerPack);
    const ageVal = parseInt(age);
    
    if (isNaN(cigarettesVal) || isNaN(yearsVal) || isNaN(priceVal) || isNaN(ageVal)) {
      return false;
    }
    
    if (cigarettesVal <= 0 || cigarettesVal > 100 || yearsVal <= 0 || priceVal <= 0 || ageVal <= 0) {
      return false;
    }
    
    // Ensuring smoking years doesn't exceed age - 10 (assuming minimum smoking age)
    if (yearsVal > (ageVal - 10)) {
      showErrorToast("Smoking years cannot exceed your age minus 10");
      return false;
    }
    
    return true;
  };

  const getHealthRiskColor = (risk: string): string => {
    switch (risk) {
      case "Moderate": return "text-yellow-500";
      case "High": return "text-orange-500";
      case "Very High": return "text-red-500";
      case "Severe": return "text-red-600";
      default: return "text-gray-500";
    }
  };

  const downloadResults = () => {
    if (!smokingImpact) return;

    const results = {
      title: "Smoking Impact Calculator",
      results: {
        "Cigarettes Per Day": cigarettesPerDay,
        "Years Smoked": smokingYears,
        "Pack-Years": smokingImpact.packYears.toString(),
        "Total Cigarettes Smoked": smokingImpact.totalCigarettes.toLocaleString(),
        "Life Expectancy Impact": `${smokingImpact.lifeLostDays.toLocaleString()} days (${smokingImpact.lifeLostYears} years)`,
        "Financial Cost": `${currency}${smokingImpact.moneyCost.toLocaleString()}`,
        "Monthly Cost": `${currency}${smokingImpact.monthlyMoneyCost.toLocaleString()}`,
        "Potential Investment Value": `${currency}${smokingImpact.financialOpportunityCost.toLocaleString()}`,
        "Health Risk Level": smokingImpact.healthRisk,
        "Carbon Monoxide Exposure": `${smokingImpact.carbonMonoxide.toLocaleString()} grams`,
        "Tar Exposure": `${smokingImpact.tar.toLocaleString()} grams`
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined,
    };

    downloadResultsAsCSV(results, "Smoking-Impact-Calculator");
    showSuccessToast("Results downloaded successfully!");
  };

  const copyResults = () => {
    if (!smokingImpact) return;

    const results = {
      title: "Smoking Impact Calculator",
      results: {
        "Cigarettes Per Day": cigarettesPerDay,
        "Years Smoked": smokingYears,
        "Pack-Years": smokingImpact.packYears.toString(),
        "Total Cigarettes Smoked": smokingImpact.totalCigarettes.toLocaleString(),
        "Life Expectancy Impact": `${smokingImpact.lifeLostDays.toLocaleString()} days (${smokingImpact.lifeLostYears} years)`,
        "Financial Cost": `${currency}${smokingImpact.moneyCost.toLocaleString()}`,
        "Monthly Cost": `${currency}${smokingImpact.monthlyMoneyCost.toLocaleString()}`,
        "Potential Investment Value": `${currency}${smokingImpact.financialOpportunityCost.toLocaleString()}`,
        "Health Risk Level": smokingImpact.healthRisk,
        "Carbon Monoxide Exposure": `${smokingImpact.carbonMonoxide.toLocaleString()} grams`,
        "Tar Exposure": `${smokingImpact.tar.toLocaleString()} grams`
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
    if (!smokingImpact) return;
    
    const params = {
      cigarettes: cigarettesPerDay,
      years: smokingYears,
      price: pricePerPack,
      age,
      currency,
      name: userName || ""
    };
    
    const link = createShareableLink("smoking", params);
    navigator.clipboard.writeText(link);
    showSuccessToast("Shareable link copied to clipboard!");
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Smoking Impact Calculator</h2>
      <p className="text-gray-600 mb-4 text-center">
        Estimate the health and financial impact of smoking
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
          <Label htmlFor="age">Your Age</Label>
          <Input
            id="age"
            type="number"
            min="1"
            placeholder="e.g., 35"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cigarettesPerDay">Cigarettes Per Day</Label>
          <Input
            id="cigarettesPerDay"
            type="number"
            min="1"
            max="100"
            placeholder="e.g., 10"
            value={cigarettesPerDay}
            onChange={(e) => setCigarettesPerDay(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="smokingYears">Years of Smoking</Label>
          <Input
            id="smokingYears"
            type="number"
            min="1"
            placeholder="e.g., 10"
            value={smokingYears}
            onChange={(e) => setSmokingYears(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="pricePerPack">Price Per Pack</Label>
            <div className="flex space-x-2">
              <button 
                className={`px-2 rounded ${currency === "$" ? "bg-wellness-purple text-white" : "bg-gray-200"}`}
                onClick={() => handleCurrencyChange("$")}
              >
                $
              </button>
              <button 
                className={`px-2 rounded ${currency === "€" ? "bg-wellness-purple text-white" : "bg-gray-200"}`}
                onClick={() => handleCurrencyChange("€")}
              >
                €
              </button>
              <button 
                className={`px-2 rounded ${currency === "£" ? "bg-wellness-purple text-white" : "bg-gray-200"}`}
                onClick={() => handleCurrencyChange("£")}
              >
                £
              </button>
              <button 
                className={`px-2 rounded ${currency === "¥" ? "bg-wellness-purple text-white" : "bg-gray-200"}`}
                onClick={() => handleCurrencyChange("¥")}
              >
                ¥
              </button>
            </div>
          </div>
          <div className="flex">
            <div className="bg-gray-100 px-3 py-2 rounded-l-md border border-r-0 border-input">
              {currency}
            </div>
            <Input
              id="pricePerPack"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 8.50"
              value={pricePerPack}
              onChange={(e) => setPricePerPack(e.target.value)}
              className="rounded-l-none"
            />
          </div>
        </div>
      </div>

      <Button onClick={calculateSmokingImpact} className="w-full mb-6">
        Calculate Impact
      </Button>

      {smokingImpact && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-3">
            <h3 className="text-xl font-bold">Smoking Impact Results</h3>
            {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-sm text-gray-700">Pack-Years</p>
              <p className="font-bold text-lg">{smokingImpact.packYears}</p>
              <p className="text-xs text-gray-500">
                Medical metric for lifetime exposure
              </p>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-sm text-gray-700">Health Risk</p>
              <p className={`font-bold text-lg ${getHealthRiskColor(smokingImpact.healthRisk)}`}>
                {smokingImpact.healthRisk}
              </p>
            </div>
          </div>
          
          <div className="space-y-4 mb-4">
            <div className="bg-wellness-softRed p-3 rounded-md">
              <h4 className="font-medium mb-2">Health Impact</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <p className="text-sm">Life expectancy reduction:</p>
                  <p className="font-medium">{smokingImpact.lifeLostDays.toLocaleString()} days ({smokingImpact.lifeLostYears} years)</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">Total cigarettes smoked:</p>
                  <p className="font-medium">{smokingImpact.totalCigarettes.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-sm font-medium">Toxin Exposure:</p>
                <div className="flex justify-between">
                  <p className="text-sm">Carbon monoxide:</p>
                  <p className="font-medium">{smokingImpact.carbonMonoxide.toLocaleString()} grams</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">Tar:</p>
                  <p className="font-medium">{smokingImpact.tar.toLocaleString()} grams</p>
                </div>
              </div>
            </div>
            
            <div className="bg-wellness-softGreen p-3 rounded-md">
              <h4 className="font-medium mb-2">Financial Impact</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <p className="text-sm">Total money spent:</p>
                  <p className="font-medium">{currency}{smokingImpact.moneyCost.toLocaleString()}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">Monthly cost:</p>
                  <p className="font-medium">{currency}{smokingImpact.monthlyMoneyCost.toLocaleString()}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">Potential investment value:</p>
                  <p className="font-medium">{currency}{smokingImpact.financialOpportunityCost.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Investment value assumes 7% annual return if the money was invested instead
              </p>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-md shadow-sm mb-4">
            <h4 className="font-medium mb-2">What These Results Mean</h4>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Pack-Years:</span> A clinical measure used by healthcare providers 
                to assess smoking exposure and related health risks.
              </p>
              <p>
                <span className="font-medium">Life Expectancy:</span> Based on research showing that each cigarette 
                reduces life expectancy by approximately 11 minutes.
              </p>
              <p>
                <span className="font-medium">Health Risk:</span> General assessment based on pack-years, with higher 
                values indicating increased risk for smoking-related diseases.
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
              Health risks vary by individual. For smoking cessation support, consult a healthcare provider.
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

export default SmokingImpactCalculator;
