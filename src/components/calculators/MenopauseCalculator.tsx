
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Share, Download } from "lucide-react";
import { downloadResultsAsCSV, copyResultsToClipboard, shareResults } from "@/utils/downloadUtils";
import { showSuccessToast } from "@/utils/notificationUtils";
import { MenopauseCalcProps } from "@/types/calculatorTypes";

const MenopauseCalculator: React.FC<MenopauseCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [motherAge, setMotherAge] = useState<string>("");
  const [smokingStatus, setSmokingStatus] = useState<"never" | "former" | "current">("never");
  const [riskFactors, setRiskFactors] = useState<{
    surgery: boolean;
    chemotherapy: boolean;
    autoimmune: boolean;
    earlyPeriod: boolean;
    familyHistory: boolean;
  }>({
    surgery: false,
    chemotherapy: false,
    autoimmune: false,
    earlyPeriod: false,
    familyHistory: false
  });
  const [symptoms, setSymptoms] = useState<{
    hotFlashes: boolean;
    irregularPeriods: boolean;
    moodChanges: boolean;
    sleepIssues: boolean;
    vaginalDryness: boolean;
  }>({
    hotFlashes: false,
    irregularPeriods: false,
    moodChanges: false,
    sleepIssues: false,
    vaginalDryness: false
  });
  const [menopauseResult, setMenopauseResult] = useState<{
    estimatedAge: number;
    riskLevel: string;
    earlyMenopauseRisk: boolean;
    estimatedYear: number;
    recommendations: string[];
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const calculateMenopause = () => {
    if (!age) {
      showSuccessToast("Please enter your current age");
      return;
    }
    
    const currentAge = parseInt(age);
    if (isNaN(currentAge) || currentAge < 18 || currentAge > 65) {
      showSuccessToast("Please enter a valid age between 18 and 65");
      return;
    }
    
    // Base estimated menopause age - average is around 51
    let estimatedAge = 51;
    
    // Adjust based on mother's age at menopause if provided
    if (motherAge && !isNaN(parseInt(motherAge))) {
      const motherMenopauseAge = parseInt(motherAge);
      if (motherMenopauseAge >= 40 && motherMenopauseAge <= 60) {
        // Mother's age has a strong influence (weighted 40%)
        estimatedAge = estimatedAge * 0.6 + motherMenopauseAge * 0.4;
      }
    }
    
    // Adjust for smoking status
    if (smokingStatus === "current") {
      estimatedAge -= 2; // Smokers typically experience menopause 1-2 years earlier
    } else if (smokingStatus === "former") {
      estimatedAge -= 1; // Former smokers may have slight decrease
    }
    
    // Adjust for risk factors
    let riskPoints = 0;
    if (riskFactors.surgery) riskPoints += 2; // Ovarian surgery is a strong factor
    if (riskFactors.chemotherapy) riskPoints += 2; // Chemotherapy can induce early menopause
    if (riskFactors.autoimmune) riskPoints += 1; // Autoimmune conditions can affect timing
    if (riskFactors.earlyPeriod) riskPoints -= 0.5; // Earlier periods may correlate with later menopause
    if (riskFactors.familyHistory) riskPoints += 1; // Family history of early menopause
    
    estimatedAge -= riskPoints;
    
    // Calculate how many years from now
    const yearsFromNow = Math.max(0, estimatedAge - currentAge);
    const currentYear = new Date().getFullYear();
    const estimatedYear = currentYear + yearsFromNow;
    
    // Determine risk level
    let riskLevel = "Average";
    if (riskPoints >= 3) {
      riskLevel = "High";
    } else if (riskPoints >= 1) {
      riskLevel = "Moderate";
    }
    
    // Determine if at risk for early menopause (before 45)
    const earlyMenopauseRisk = estimatedAge < 45;
    
    // Generate recommendations
    const recommendations = generateRecommendations(
      currentAge, 
      estimatedAge, 
      riskLevel, 
      earlyMenopauseRisk,
      symptoms
    );
    
    setMenopauseResult({
      estimatedAge: Math.round(estimatedAge),
      riskLevel,
      earlyMenopauseRisk,
      estimatedYear: Math.round(estimatedYear),
      recommendations
    });
  };

  const generateRecommendations = (
    currentAge: number,
    estimatedAge: number,
    riskLevel: string,
    earlyMenopauseRisk: boolean,
    symptoms: {
      hotFlashes: boolean;
      irregularPeriods: boolean;
      moodChanges: boolean;
      sleepIssues: boolean;
      vaginalDryness: boolean;
    }
  ): string[] => {
    const recommendations: string[] = [];
    
    // General recommendations
    recommendations.push("Schedule regular check-ups with your healthcare provider to monitor hormone levels and general health");
    recommendations.push("Maintain a balanced diet rich in calcium and vitamin D to support bone health");
    recommendations.push("Engage in regular weight-bearing exercise to maintain bone density and overall health");
    
    // Age-specific recommendations
    if (currentAge < 40) {
      recommendations.push("Consider discussing family planning options with your healthcare provider if pregnancy is desired");
    } else if (currentAge >= 40 && currentAge < 45) {
      recommendations.push("Consider bone density testing to establish a baseline for monitoring bone health");
      recommendations.push("Discuss perimenopause symptoms with your healthcare provider");
    } else if (currentAge >= 45) {
      recommendations.push("Ask your healthcare provider about hormone testing to assess menopausal status");
    }
    
    // Risk-level specific recommendations
    if (riskLevel === "High" || earlyMenopauseRisk) {
      recommendations.push("Consider consultation with a reproductive endocrinologist to discuss options");
      recommendations.push("Ask about hormone replacement therapy (HRT) options and their risks/benefits");
    }
    
    // Symptom-specific recommendations
    if (symptoms.hotFlashes) {
      recommendations.push("For hot flashes, try layering clothing, avoiding triggers like spicy food and alcohol, and exploring cooling products");
    }
    
    if (symptoms.irregularPeriods) {
      recommendations.push("Track your menstrual cycle to help identify patterns and discuss changes with your healthcare provider");
    }
    
    if (symptoms.moodChanges) {
      recommendations.push("Practice stress reduction techniques like mindfulness, yoga, or meditation to help manage mood changes");
    }
    
    if (symptoms.sleepIssues) {
      recommendations.push("Establish a consistent sleep schedule and create a cool, comfortable sleeping environment");
    }
    
    if (symptoms.vaginalDryness) {
      recommendations.push("Discuss vaginal moisturizers or lubricants with your healthcare provider for comfort");
    }
    
    return recommendations;
  };

  const handleRiskFactorChange = (factor: keyof typeof riskFactors, checked: boolean) => {
    setRiskFactors(prev => ({ ...prev, [factor]: checked }));
  };

  const handleSymptomChange = (symptom: keyof typeof symptoms, checked: boolean) => {
    setSymptoms(prev => ({ ...prev, [symptom]: checked }));
  };

  const handleCopy = () => {
    if (!menopauseResult) return;
    
    const results = {
      title: "Menopause Estimator",
      results: {
        "Current Age": age,
        "Mother's Menopause Age": motherAge || "Not provided",
        "Smoking Status": smokingStatus === "never" ? "Never smoked" : smokingStatus === "former" ? "Former smoker" : "Current smoker",
        "Risk Level": menopauseResult.riskLevel,
        "Estimated Menopause Age": menopauseResult.estimatedAge.toString(),
        "Estimated Year": menopauseResult.estimatedYear.toString(),
        "Early Menopause Risk": menopauseResult.earlyMenopauseRisk ? "Yes" : "No"
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
    if (!menopauseResult) return;
    
    const results = {
      title: "Menopause Estimator",
      results: {
        "Current Age": age,
        "Mother's Menopause Age": motherAge || "Not provided",
        "Smoking Status": smokingStatus === "never" ? "Never smoked" : smokingStatus === "former" ? "Former smoker" : "Current smoker",
        "Risk Level": menopauseResult.riskLevel,
        "Estimated Menopause Age": menopauseResult.estimatedAge.toString(),
        "Estimated Year": menopauseResult.estimatedYear.toString(),
        "Early Menopause Risk": menopauseResult.earlyMenopauseRisk ? "Yes" : "No"
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    shareResults(results);
  };

  const handleDownload = () => {
    if (!menopauseResult) return;
    
    const results = {
      title: "Menopause Estimator",
      results: {
        "Current Age": age,
        "Mother's Menopause Age": motherAge || "Not provided",
        "Smoking Status": smokingStatus === "never" ? "Never smoked" : smokingStatus === "former" ? "Former smoker" : "Current smoker",
        "Risk Level": menopauseResult.riskLevel,
        "Estimated Menopause Age": menopauseResult.estimatedAge.toString(),
        "Estimated Year": menopauseResult.estimatedYear.toString(),
        "Early Menopause Risk": menopauseResult.earlyMenopauseRisk ? "Yes" : "No"
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    downloadResultsAsCSV(results, "Menopause-Estimator");
    showSuccessToast("Results downloaded successfully!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Menopause Estimator</h2>
      <p className="text-gray-600 mb-6 text-center">
        Estimate when you may experience menopause based on personal factors
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
          <Label htmlFor="age">Your Current Age</Label>
          <Input
            id="age"
            type="number"
            placeholder="e.g., 42"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="motherAge">
            Your Mother's Age at Menopause (if known)
          </Label>
          <Input
            id="motherAge"
            type="number"
            placeholder="Leave blank if unknown"
            value={motherAge}
            onChange={(e) => setMotherAge(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Genetics play a significant role in determining menopause timing
          </p>
        </div>
        
        <div className="space-y-2">
          <Label>Smoking Status</Label>
          <RadioGroup
            value={smokingStatus}
            onValueChange={(value) => setSmokingStatus(value as "never" | "former" | "current")}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="never" id="never" />
              <Label htmlFor="never">Never Smoked</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="former" id="former" />
              <Label htmlFor="former">Former Smoker</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="current" id="current" />
              <Label htmlFor="current">Current Smoker</Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-gray-500">
            Smoking can lead to earlier onset of menopause by 1-2 years on average
          </p>
        </div>
        
        <div className="space-y-2">
          <Label>Risk Factors (check all that apply)</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="surgery" 
                checked={riskFactors.surgery}
                onCheckedChange={(checked) => handleRiskFactorChange("surgery", !!checked)}
              />
              <Label htmlFor="surgery">Previous ovarian surgery</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="chemotherapy" 
                checked={riskFactors.chemotherapy}
                onCheckedChange={(checked) => handleRiskFactorChange("chemotherapy", !!checked)}
              />
              <Label htmlFor="chemotherapy">History of chemotherapy</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="autoimmune" 
                checked={riskFactors.autoimmune}
                onCheckedChange={(checked) => handleRiskFactorChange("autoimmune", !!checked)}
              />
              <Label htmlFor="autoimmune">Autoimmune disorders</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="earlyPeriod" 
                checked={riskFactors.earlyPeriod}
                onCheckedChange={(checked) => handleRiskFactorChange("earlyPeriod", !!checked)}
              />
              <Label htmlFor="earlyPeriod">First period before age 11</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="familyHistory" 
                checked={riskFactors.familyHistory}
                onCheckedChange={(checked) => handleRiskFactorChange("familyHistory", !!checked)}
              />
              <Label htmlFor="familyHistory">Family history of early menopause</Label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Current Symptoms (check all that apply)</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hotFlashes" 
                checked={symptoms.hotFlashes}
                onCheckedChange={(checked) => handleSymptomChange("hotFlashes", !!checked)}
              />
              <Label htmlFor="hotFlashes">Hot flashes or night sweats</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="irregularPeriods" 
                checked={symptoms.irregularPeriods}
                onCheckedChange={(checked) => handleSymptomChange("irregularPeriods", !!checked)}
              />
              <Label htmlFor="irregularPeriods">Irregular periods</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="moodChanges" 
                checked={symptoms.moodChanges}
                onCheckedChange={(checked) => handleSymptomChange("moodChanges", !!checked)}
              />
              <Label htmlFor="moodChanges">Mood changes or irritability</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sleepIssues" 
                checked={symptoms.sleepIssues}
                onCheckedChange={(checked) => handleSymptomChange("sleepIssues", !!checked)}
              />
              <Label htmlFor="sleepIssues">Sleep problems</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="vaginalDryness" 
                checked={symptoms.vaginalDryness}
                onCheckedChange={(checked) => handleSymptomChange("vaginalDryness", !!checked)}
              />
              <Label htmlFor="vaginalDryness">Vaginal dryness</Label>
            </div>
          </div>
        </div>
      </div>
      
      <Button onClick={calculateMenopause} className="w-full mb-6">
        Estimate Menopause Age
      </Button>
      
      {menopauseResult && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Menopause Estimate</h3>
            {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
          </div>
          
          <div className="space-y-4">
            <div className="bg-wellness-softPink p-4 rounded-md">
              <p className="text-sm text-gray-700">Estimated Menopause Age</p>
              <p className="font-bold text-2xl text-wellness-pink">Around age {menopauseResult.estimatedAge}</p>
              <p className="text-sm text-gray-600">
                Approximately in the year {menopauseResult.estimatedYear}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-700">Risk Level</p>
                <p className={`font-bold text-lg ${
                  menopauseResult.riskLevel === "High" 
                    ? "text-wellness-red" 
                    : menopauseResult.riskLevel === "Moderate"
                      ? "text-wellness-orange"
                      : "text-wellness-green"
                }`}>
                  {menopauseResult.riskLevel}
                </p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-700">Early Menopause Risk</p>
                <p className={`font-bold text-lg ${
                  menopauseResult.earlyMenopauseRisk ? "text-wellness-red" : "text-wellness-green"
                }`}>
                  {menopauseResult.earlyMenopauseRisk ? "Elevated" : "Low"}
                </p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="font-medium mb-2">Recommendations</p>
              <ul className="space-y-2 list-disc pl-5">
                {menopauseResult.recommendations.map((rec, index) => (
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
              This calculator provides estimates based on population trends.
              Individual experiences may vary significantly. Always consult with a healthcare provider.
            </p>
            <p className="mt-2">
              Based on data from the North American Menopause Society and NIH.
              Thank you for using Survivewellness!
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default MenopauseCalculator;
