import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { UnitSystem } from "@/types/calculatorTypes";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import IntroSection from "@/components/calculator/IntroSection";

interface BreastCancerRiskCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const BreastCancerRiskCalculator: React.FC<BreastCancerRiskCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [firstPeriodAge, setFirstPeriodAge] = useState<string>("");
  const [firstBirthAge, setFirstBirthAge] = useState<string>("0");
  const [hasChildren, setHasChildren] = useState<boolean>(false);
  const [familyHistory, setFamilyHistory] = useState<string>("none");
  const [previousBiopsies, setPreviousBiopsies] = useState<string>("0");
  const [biopsyAtypicalHyperplasia, setBiopsyAtypicalHyperplasia] = useState<boolean>(false);
  const [race, setRace] = useState<string>("white");
  
  const [riskResult, setRiskResult] = useState<{
    fiveYearRisk: number;
    lifetimeRisk: number;
    averageFiveYearRisk: number;
    averageLifetimeRisk: number;
    riskLevel: string;
    recommendations: string[];
  } | null>(null);

  const calculateBreastCancerRisk = () => {
    if (!age || !firstPeriodAge || (!hasChildren && firstBirthAge === "0")) {
      showErrorToast("Please fill in all required fields");
      return;
    }

    const ageNum = parseInt(age);
    const firstPeriodAgeNum = parseInt(firstPeriodAge);
    const firstBirthAgeNum = parseInt(firstBirthAge);

    if (isNaN(ageNum) || isNaN(firstPeriodAgeNum) || (hasChildren && isNaN(firstBirthAgeNum))) {
      showErrorToast("Please enter valid numbers");
      return;
    }

    // This is a simplified risk calculation model based on Gail Model factors
    // For a real application, a more comprehensive model should be used
    
    // Base risk factors
    let riskScore = 0;
    
    // Age factor (higher risk with increasing age)
    if (ageNum < 30) riskScore += 0;
    else if (ageNum < 40) riskScore += 1;
    else if (ageNum < 50) riskScore += 2;
    else if (ageNum < 60) riskScore += 3;
    else if (ageNum < 70) riskScore += 4;
    else riskScore += 5;
    
    // Early menstruation factor
    if (firstPeriodAgeNum < 12) riskScore += 1;
    
    // First birth age factor
    if (hasChildren) {
      if (firstBirthAgeNum > 30) riskScore += 1.5;
      else if (firstBirthAgeNum > 20) riskScore += 0.5;
    } else {
      riskScore += 1; // No children is a risk factor
    }
    
    // Family history factor
    if (familyHistory === "first") riskScore += 2;
    else if (familyHistory === "multiple") riskScore += 3;
    
    // Previous biopsies factor
    const biopsiesNum = parseInt(previousBiopsies);
    if (biopsiesNum === 1) riskScore += 1;
    else if (biopsiesNum >= 2) riskScore += 1.5;
    
    // Atypical hyperplasia factor
    if (biopsyAtypicalHyperplasia) riskScore += 1.5;
    
    // Race/ethnicity factor (simplified)
    if (race === "african") riskScore += 0.5;
    
    // Calculate risk percentages (simplified model)
    // In a real application, these would be based on validated statistical models
    const fiveYearRisk = Math.min(((riskScore / 15) * 8) + 1.2, 20);
    const lifetimeRisk = Math.min(((riskScore / 15) * 25) + 8, 60);
    
    // Average risk values for comparison
    const averageFiveYearRisk = 1.3;
    const averageLifetimeRisk = 12.5;
    
    // Determine risk level
    let riskLevel: string;
    let recommendations: string[] = [];
    
    if (fiveYearRisk < 1.7) {
      riskLevel = "Average Risk";
      recommendations = [
        "Annual mammogram starting at age 40",
        "Clinical breast exam every 1-3 years in your 20s and 30s, annually after 40",
        "Breast self-awareness",
        "Maintain healthy lifestyle with regular exercise",
        "Limit alcohol consumption"
      ];
    } else if (fiveYearRisk < 3) {
      riskLevel = "Moderately Increased Risk";
      recommendations = [
        "Annual mammogram starting at age 40",
        "Consider adding breast MRI if other risk factors present",
        "Clinical breast exam every 6-12 months",
        "Consider risk-reducing medications (discuss with doctor)",
        "Maintain healthy weight and exercise regularly",
        "Limit alcohol consumption"
      ];
    } else {
      riskLevel = "High Risk";
      recommendations = [
        "Annual mammogram starting at age 30",
        "Annual breast MRI starting at age 30",
        "Clinical breast exam every 6 months",
        "Consider genetic counseling and testing",
        "Discuss risk-reducing medications with doctor",
        "Consider preventive surgery options in extreme cases",
        "Maintain healthy lifestyle with regular exercise",
        "Limit alcohol consumption"
      ];
    }
    
    setRiskResult({
      fiveYearRisk: parseFloat(fiveYearRisk.toFixed(1)),
      lifetimeRisk: parseFloat(lifetimeRisk.toFixed(1)),
      averageFiveYearRisk,
      averageLifetimeRisk,
      riskLevel,
      recommendations
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Breast Cancer Risk Assessment</h2>
        <p className="text-gray-600 mb-4 text-center">
          Evaluate your risk factors for breast cancer based on personal and family history
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
              <Label htmlFor="age">Current Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g., 45"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstPeriodAge">Age at First Period</Label>
              <Input
                id="firstPeriodAge"
                type="number"
                placeholder="e.g., 13"
                value={firstPeriodAge}
                onChange={(e) => setFirstPeriodAge(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasChildren" 
                checked={hasChildren}
                onCheckedChange={(checked) => setHasChildren(checked as boolean)}
              />
              <Label htmlFor="hasChildren">Have you given birth?</Label>
            </div>
          </div>

          {hasChildren && (
            <div className="space-y-2">
              <Label htmlFor="firstBirthAge">Age at First Birth</Label>
              <Input
                id="firstBirthAge"
                type="number"
                placeholder="e.g., 28"
                value={firstBirthAge}
                onChange={(e) => setFirstBirthAge(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Family History of Breast Cancer</Label>
            <RadioGroup
              value={familyHistory}
              onValueChange={setFamilyHistory}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">None</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="first" id="first" />
                <Label htmlFor="first">First-degree relative (mother, sister, daughter)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiple" id="multiple" />
                <Label htmlFor="multiple">Multiple affected relatives</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="previousBiopsies">Number of Previous Breast Biopsies</Label>
            <Input
              id="previousBiopsies"
              type="number"
              placeholder="e.g., 0"
              value={previousBiopsies}
              onChange={(e) => setPreviousBiopsies(e.target.value)}
            />
          </div>

          {parseInt(previousBiopsies) > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="biopsyAtypicalHyperplasia" 
                  checked={biopsyAtypicalHyperplasia}
                  onCheckedChange={(checked) => setBiopsyAtypicalHyperplasia(checked as boolean)}
                />
                <Label htmlFor="biopsyAtypicalHyperplasia">
                  Has any biopsy shown atypical hyperplasia?
                </Label>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Race/Ethnicity</Label>
            <RadioGroup
              value={race}
              onValueChange={setRace}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="white" id="white" />
                <Label htmlFor="white">White</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="african" id="african" />
                <Label htmlFor="african">African American</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hispanic" id="hispanic" />
                <Label htmlFor="hispanic">Hispanic</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asian" id="asian" />
                <Label htmlFor="asian">Asian/Pacific Islander</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button onClick={calculateBreastCancerRisk} className="w-full mb-6">
          Calculate Risk
        </Button>

        {riskResult && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Your Breast Cancer Risk Assessment</h3>
              {userName && <p className="text-sm mt-2">Results for: {userName}</p>}
            </div>

            <div className="bg-wellness-softPink p-4 rounded-md mb-4 text-center">
              <h4 className="font-medium mb-2">Risk Level</h4>
              <p className="text-xl font-bold text-wellness-pink">{riskResult.riskLevel}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-3 rounded-md">
                <div className="text-center">
                  <p className="text-sm text-gray-700">Your 5-Year Risk</p>
                  <p className="text-lg font-bold">{riskResult.fiveYearRisk}%</p>
                  <p className="text-xs text-gray-500">
                    Average: {riskResult.averageFiveYearRisk}%
                  </p>
                </div>
              </div>
              <div className="bg-white p-3 rounded-md">
                <div className="text-center">
                  <p className="text-sm text-gray-700">Your Lifetime Risk</p>
                  <p className="text-lg font-bold">{riskResult.lifetimeRisk}%</p>
                  <p className="text-xs text-gray-500">
                    Average: {riskResult.averageLifetimeRisk}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md">
              <h4 className="font-medium mb-3">Recommendations</h4>
              <div className="space-y-2">
                {riskResult.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-wellness-pink mr-2">•</span>
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-wellness-purple">
              <p className="font-medium">Important Note</p>
              <p>This is a simplified risk assessment tool and should not replace professional medical advice.</p>
              <p>Please consult with your healthcare provider for a comprehensive risk assessment.</p>
            </div>
          </div>
        )}
      </Card>

      <IntroSection calculatorId="breastcancer" title="" description="" />
    </div>
  );
};

export default BreastCancerRiskCalculator;
