
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Share, Download } from "lucide-react";
import { downloadResultsAsCSV, copyResultsToClipboard, shareResults } from "@/utils/downloadUtils";
import { showSuccessToast } from "@/utils/notificationUtils";
import { BreastCancerRiskCalcProps } from "@/types/calculatorTypes";

const BreastCancerRiskCalculator: React.FC<BreastCancerRiskCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [firstPeriodAge, setFirstPeriodAge] = useState<string>("12");
  const [firstBirthAge, setFirstBirthAge] = useState<string>("0");
  const [hasBiopsies, setHasBiopsies] = useState<"yes" | "no">("no");
  const [biopsyCount, setBiopsyCount] = useState<string>("0");
  const [hyperplasia, setHyperplasia] = useState<"yes" | "no" | "unknown">("unknown");
  const [hasRelatives, setHasRelatives] = useState<"yes" | "no">("no");
  const [relativeCount, setRelativeCount] = useState<string>("0");
  const [hasBRCAMutation, setHasBRCAMutation] = useState<"yes" | "no" | "unknown">("unknown");
  const [ethnicity, setEthnicity] = useState<string>("white");
  const [breastDensity, setBreastDensity] = useState<string>("average");
  const [riskResult, setRiskResult] = useState<{
    lifetimeRisk: number;
    fiveYearRisk: number;
    riskCategory: string;
    recommendations: string[];
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const calculateBreastCancerRisk = () => {
    if (!age) {
      showSuccessToast("Please enter your current age");
      return;
    }
    
    const currentAge = parseInt(age);
    if (isNaN(currentAge) || currentAge < 35 || currentAge > 85) {
      showSuccessToast("Please enter a valid age between 35 and 85");
      return;
    }
    
    // Base average lifetime risk for women is about 12.9%
    let baseLifetimeRisk = 12.9;
    let riskMultiplier = 1.0;
    
    // Age factor - risk increases with age
    if (currentAge >= 60) {
      riskMultiplier *= 1.2;
    } else if (currentAge >= 50) {
      riskMultiplier *= 1.1;
    }
    
    // Early menarche factor
    const periodAge = parseInt(firstPeriodAge) || 12;
    if (periodAge < 12) {
      riskMultiplier *= 1.2; // Earlier period associated with higher risk
    }
    
    // First live birth age factor
    const birthAge = parseInt(firstBirthAge) || 0;
    if (birthAge === 0) {
      riskMultiplier *= 1.1; // No children is a slight risk factor
    } else if (birthAge > 30) {
      riskMultiplier *= 1.2; // Later first birth is a risk factor
    }
    
    // Biopsy factor
    if (hasBiopsies === "yes") {
      const biopsyNum = parseInt(biopsyCount) || 0;
      riskMultiplier *= (1 + (biopsyNum * 0.1)); // Each biopsy increases risk
      
      // Atypical hyperplasia is a significant risk factor
      if (hyperplasia === "yes") {
        riskMultiplier *= 1.5;
      }
    }
    
    // Family history factor
    if (hasRelatives === "yes") {
      const relativesNum = parseInt(relativeCount) || 0;
      riskMultiplier *= (1 + (relativesNum * 0.3)); // Each first-degree relative with breast cancer significantly increases risk
    }
    
    // BRCA mutation factor
    if (hasBRCAMutation === "yes") {
      riskMultiplier *= 5.0; // BRCA1/2 mutations dramatically increase risk
    }
    
    // Ethnicity factor
    switch (ethnicity) {
      case "white":
        // Base calculation is already for white women
        break;
      case "black":
        riskMultiplier *= 1.1; // Slightly higher risk
        break;
      case "asian":
        riskMultiplier *= 0.9; // Generally lower risk
        break;
      case "hispanic":
        riskMultiplier *= 0.9; // Generally lower risk
        break;
      case "other":
        // No adjustment
        break;
    }
    
    // Breast density factor
    switch (breastDensity) {
      case "low":
        riskMultiplier *= 0.8;
        break;
      case "average":
        // No adjustment
        break;
      case "high":
        riskMultiplier *= 1.3;
        break;
      case "veryHigh":
        riskMultiplier *= 1.6;
        break;
    }
    
    // Calculate final risk
    let lifetimeRisk = baseLifetimeRisk * riskMultiplier;
    lifetimeRisk = Math.min(100, lifetimeRisk); // Cap at 100%
    
    // Calculate 5-year risk as a proportion of lifetime risk based on age
    let fiveYearRisk = lifetimeRisk * (currentAge >= 60 ? 0.15 : currentAge >= 50 ? 0.1 : 0.05);
    
    // Determine risk category
    let riskCategory: string;
    if (lifetimeRisk >= 30) {
      riskCategory = "Very High";
    } else if (lifetimeRisk >= 20) {
      riskCategory = "High";
    } else if (lifetimeRisk >= 15) {
      riskCategory = "Moderate-High";
    } else if (lifetimeRisk >= 12) {
      riskCategory = "Average";
    } else {
      riskCategory = "Below Average";
    }
    
    // Generate recommendations
    const recommendations = generateRecommendations(currentAge, lifetimeRisk, riskCategory, hasBRCAMutation === "yes");
    
    setRiskResult({
      lifetimeRisk: parseFloat(lifetimeRisk.toFixed(1)),
      fiveYearRisk: parseFloat(fiveYearRisk.toFixed(1)),
      riskCategory,
      recommendations
    });
  };

  const generateRecommendations = (
    age: number,
    lifetimeRisk: number,
    riskCategory: string,
    hasBRCA: boolean
  ): string[] => {
    const recommendations: string[] = [];
    
    // Basic recommendations for everyone
    recommendations.push("Perform monthly breast self-exams to become familiar with your breasts' normal appearance");
    recommendations.push("Maintain a healthy weight and limit alcohol consumption");
    recommendations.push("Stay physically active with regular exercise");
    
    // Age-specific recommendations
    if (age >= 40) {
      recommendations.push("Get annual mammograms as recommended by most health organizations");
    } else if (age >= 35) {
      recommendations.push("Discuss with your doctor when to begin mammogram screening based on your personal risk factors");
    }
    
    // Risk-category specific recommendations
    if (riskCategory === "High" || riskCategory === "Very High" || hasBRCA) {
      recommendations.push("Consider genetic counseling and testing if not already done");
      recommendations.push("Discuss enhanced screening protocols with your doctor, which may include MRI and more frequent mammograms");
      recommendations.push("Talk to your doctor about risk-reducing medications like tamoxifen or raloxifene");
      
      if (hasBRCA) {
        recommendations.push("Consider risk-reducing surgical options in consultation with specialists");
      }
    } else if (riskCategory === "Moderate-High") {
      recommendations.push("Ask your doctor about more frequent screenings or starting screenings at an earlier age");
      recommendations.push("Discuss whether genetic testing would be appropriate for you");
    }
    
    return recommendations;
  };

  const handleCopy = () => {
    if (!riskResult) return;
    
    const results = {
      title: "Breast Cancer Risk Calculator",
      results: {
        "Current Age": age,
        "Lifetime Risk": `${riskResult.lifetimeRisk}%`,
        "5-Year Risk": `${riskResult.fiveYearRisk}%`,
        "Risk Category": riskResult.riskCategory
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    copyResultsToClipboard(results);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!riskResult) return;
    
    const results = {
      title: "Breast Cancer Risk Calculator",
      results: {
        "Current Age": age,
        "Lifetime Risk": `${riskResult.lifetimeRisk}%`,
        "5-Year Risk": `${riskResult.fiveYearRisk}%`,
        "Risk Category": riskResult.riskCategory
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    shareResults(results);
  };

  const handleDownload = () => {
    if (!riskResult) return;
    
    const results = {
      title: "Breast Cancer Risk Calculator",
      results: {
        "Current Age": age,
        "Lifetime Risk": `${riskResult.lifetimeRisk}%`,
        "5-Year Risk": `${riskResult.fiveYearRisk}%`,
        "Risk Category": riskResult.riskCategory
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    downloadResultsAsCSV(results, "Breast-Cancer-Risk");
    showSuccessToast("Results downloaded successfully!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Breast Cancer Risk Calculator</h2>
      <p className="text-gray-600 mb-6 text-center">
        Estimate your risk of developing breast cancer based on personal factors
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
          <Label htmlFor="age">Current Age</Label>
          <Input
            id="age"
            type="number"
            placeholder="Enter your current age (35-85)"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            This calculator is designed for women aged 35 and older
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="firstPeriodAge">Age at First Menstrual Period</Label>
          <Select value={firstPeriodAge} onValueChange={setFirstPeriodAge}>
            <SelectTrigger id="firstPeriodAge">
              <SelectValue placeholder="Select age" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(11)].map((_, i) => (
                <SelectItem key={i} value={(i + 9).toString()}>
                  {i + 9} years
                </SelectItem>
              ))}
              <SelectItem value="20">20+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="firstBirthAge">Age at First Live Birth</Label>
          <Select value={firstBirthAge} onValueChange={setFirstBirthAge}>
            <SelectTrigger id="firstBirthAge">
              <SelectValue placeholder="Select age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">No children</SelectItem>
              {[...Array(9)].map((_, i) => (
                <SelectItem key={i} value={(i + 17).toString()}>
                  {i + 17} years
                </SelectItem>
              ))}
              <SelectItem value="26">26-30 years</SelectItem>
              <SelectItem value="31">31+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Have you had any breast biopsies?</Label>
          <RadioGroup
            value={hasBiopsies}
            onValueChange={(value) => setHasBiopsies(value as "yes" | "no")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="biopsies-yes" />
              <Label htmlFor="biopsies-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="biopsies-no" />
              <Label htmlFor="biopsies-no">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        {hasBiopsies === "yes" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="biopsyCount">Number of Biopsies</Label>
              <Select value={biopsyCount} onValueChange={setBiopsyCount}>
                <SelectTrigger id="biopsyCount">
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n}
                    </SelectItem>
                  ))}
                  <SelectItem value="6">6+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Do you have atypical hyperplasia on any biopsy?</Label>
              <RadioGroup
                value={hyperplasia}
                onValueChange={(value) => setHyperplasia(value as "yes" | "no" | "unknown")}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="hyperplasia-yes" />
                  <Label htmlFor="hyperplasia-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="hyperplasia-no" />
                  <Label htmlFor="hyperplasia-no">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unknown" id="hyperplasia-unknown" />
                  <Label htmlFor="hyperplasia-unknown">I don't know</Label>
                </div>
              </RadioGroup>
            </div>
          </>
        )}
        
        <div className="space-y-2">
          <Label>
            Do you have any first-degree relatives (mother, sister, daughter) with breast cancer?
          </Label>
          <RadioGroup
            value={hasRelatives}
            onValueChange={(value) => setHasRelatives(value as "yes" | "no")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="relatives-yes" />
              <Label htmlFor="relatives-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="relatives-no" />
              <Label htmlFor="relatives-no">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        {hasRelatives === "yes" && (
          <div className="space-y-2">
            <Label htmlFor="relativeCount">How many first-degree relatives?</Label>
            <Select value={relativeCount} onValueChange={setRelativeCount}>
              <SelectTrigger id="relativeCount">
                <SelectValue placeholder="Select number" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n}
                  </SelectItem>
                ))}
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="space-y-2">
          <Label>Have you tested positive for a BRCA1 or BRCA2 gene mutation?</Label>
          <RadioGroup
            value={hasBRCAMutation}
            onValueChange={(value) => setHasBRCAMutation(value as "yes" | "no" | "unknown")}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="brca-yes" />
              <Label htmlFor="brca-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="brca-no" />
              <Label htmlFor="brca-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unknown" id="brca-unknown" />
              <Label htmlFor="brca-unknown">I haven't been tested/Don't know</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ethnicity">Race/Ethnicity</Label>
          <Select value={ethnicity} onValueChange={setEthnicity}>
            <SelectTrigger id="ethnicity">
              <SelectValue placeholder="Select ethnicity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="white">White/Caucasian</SelectItem>
              <SelectItem value="black">Black/African American</SelectItem>
              <SelectItem value="asian">Asian/Pacific Islander</SelectItem>
              <SelectItem value="hispanic">Hispanic/Latina</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="breastDensity">Breast Density (from recent mammogram)</Label>
          <Select value={breastDensity} onValueChange={setBreastDensity}>
            <SelectTrigger id="breastDensity">
              <SelectValue placeholder="Select breast density" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Almost entirely fatty</SelectItem>
              <SelectItem value="average">Scattered fibroglandular densities</SelectItem>
              <SelectItem value="high">Heterogeneously dense</SelectItem>
              <SelectItem value="veryHigh">Extremely dense</SelectItem>
              <SelectItem value="unknown">I don't know</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Higher breast density can make cancer harder to detect on mammograms and is associated with higher cancer risk
          </p>
        </div>
      </div>
      
      <Button onClick={calculateBreastCancerRisk} className="w-full mb-6">
        Calculate Risk
      </Button>
      
      {riskResult && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Breast Cancer Risk Assessment</h3>
            {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
          </div>
          
          <div className="space-y-4">
            <div className={`p-4 rounded-md ${
              riskResult.riskCategory === "Very High" || riskResult.riskCategory === "High"
                ? "bg-wellness-softRed"
                : riskResult.riskCategory === "Moderate-High"
                  ? "bg-wellness-softOrange"
                  : "bg-wellness-softGreen"
            }`}>
              <p className="text-sm text-gray-700">Lifetime Risk</p>
              <p className="font-bold text-2xl">{riskResult.lifetimeRisk}%</p>
              <p className="text-sm text-gray-700">
                Risk Category: <span className="font-medium">{riskResult.riskCategory}</span>
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Average lifetime risk for women is about 13%
              </p>
            </div>
            
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-sm text-gray-700">5-Year Risk</p>
              <p className="font-bold text-lg">{riskResult.fiveYearRisk}%</p>
              <p className="text-xs text-gray-600">
                Chance of developing breast cancer in the next 5 years
              </p>
            </div>
            
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="font-medium mb-2">Recommendations</p>
              <ul className="space-y-1 list-disc pl-5">
                {riskResult.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center gap-1">
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy Results"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-1">
                <Share className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-wellness-purple">
            <p>
              This calculator provides estimates based on key risk factors.
              Individual cases may vary, and this tool does not replace professional medical advice.
            </p>
            <p className="mt-2">
              Based on models from the National Cancer Institute and ACS.
              Thank you for using Survivewellness!
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BreastCancerRiskCalculator;
