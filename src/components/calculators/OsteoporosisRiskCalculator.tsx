import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Share, Download } from "lucide-react";
import { downloadResultsAsCSV, copyResultsToClipboard, shareResults } from "@/utils/downloadUtils";
import { showSuccessToast } from "@/utils/notificationUtils";
import { OsteoporosisRiskCalcProps } from "@/types/calculatorTypes";

const OsteoporosisRiskCalculator: React.FC<OsteoporosisRiskCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"female" | "male">("female");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [menopause, setMenopause] = useState<"yes" | "no" | "na">("na");
  const [earlyMenopause, setEarlyMenopause] = useState<"yes" | "no" | "na">("na");
  const [fractureHistory, setFractureHistory] = useState<"yes" | "no">("no");
  const [parentalFracture, setParentalFracture] = useState<"yes" | "no" | "unknown">("no");
  const [smoking, setSmoking] = useState<"current" | "former" | "never">("never");
  const [alcohol, setAlcohol] = useState<"none" | "moderate" | "heavy">("none");
  const [glucocorticoids, setGlucocorticoids] = useState<"yes" | "no">("no");
  const [rheumatoidArthritis, setRheumatoidArthritis] = useState<"yes" | "no">("no");
  const [calcium, setCalcium] = useState<"adequate" | "low">("adequate");
  const [vitaminD, setVitaminD] = useState<"adequate" | "low" | "unknown">("adequate");
  const [exercise, setExercise] = useState<"regular" | "occasional" | "sedentary">("occasional");
  const [osteoporosisResult, setOsteoporosisResult] = useState<{
    riskScore: number;
    riskCategory: string;
    recommendations: string[];
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleUnitChange = (value: string) => {
    onUnitSystemChange(value as "imperial" | "metric");
    setWeight("");
    setHeight("");
  };

  const calculateOsteoporosisRisk = () => {
    if (!age || !weight || !height) {
      showSuccessToast("Please fill in all required fields");
      return;
    }
    
    const currentAge = parseInt(age);
    const currentWeight = parseFloat(weight);
    const currentHeight = parseFloat(height);
    
    if (isNaN(currentAge) || isNaN(currentWeight) || isNaN(currentHeight) ||
        currentAge < 20 || currentAge > 100 || currentWeight <= 0 || currentHeight <= 0) {
      showSuccessToast("Please enter valid values");
      return;
    }
    
    // Calculate BMI
    let bmi: number;
    if (unitSystem === "metric") {
      bmi = currentWeight / ((currentHeight / 100) ** 2);
    } else {
      bmi = (currentWeight / (currentHeight ** 2)) * 703;
    }
    
    let riskScore = 0;
    
    // Age is a significant factor
    if (currentAge >= 75) {
      riskScore += 5;
    } else if (currentAge >= 65) {
      riskScore += 4;
    } else if (currentAge >= 55) {
      riskScore += 3;
    } else if (currentAge >= 45) {
      riskScore += 2;
    } else if (currentAge >= 35) {
      riskScore += 1;
    }
    
    // Gender factor
    if (gender === "female") {
      riskScore += 1;
      
      // Menopause factors (only for women)
      if (menopause === "yes") {
        riskScore += 1;
        
        if (earlyMenopause === "yes") {
          riskScore += 2; // Early menopause is a significant risk factor
        }
      }
    }
    
    // Low BMI increases risk
    if (bmi < 18.5) {
      riskScore += 2;
    } else if (bmi < 22) {
      riskScore += 1;
    }
    
    // Previous fracture history is a major risk factor
    if (fractureHistory === "yes") {
      riskScore += 4;
    }
    
    // Parental history of hip fracture
    if (parentalFracture === "yes") {
      riskScore += 2;
    }
    
    // Smoking status
    if (smoking === "current") {
      riskScore += 2;
    } else if (smoking === "former") {
      riskScore += 1;
    }
    
    // Alcohol consumption
    if (alcohol === "heavy") {
      riskScore += 2;
    } else if (alcohol === "moderate") {
      riskScore += 1;
    }
    
    // Glucocorticoid use
    if (glucocorticoids === "yes") {
      riskScore += 3;
    }
    
    // Rheumatoid arthritis
    if (rheumatoidArthritis === "yes") {
      riskScore += 2;
    }
    
    // Calcium and Vitamin D status
    if (calcium === "low") {
      riskScore += 1;
    }
    
    if (vitaminD === "low") {
      riskScore += 1;
    }
    
    // Physical activity level
    if (exercise === "sedentary") {
      riskScore += 1;
    } else if (exercise === "regular") {
      riskScore -= 1;
    }
    
    // Determine risk category
    let riskCategory: string;
    if (riskScore >= 15) {
      riskCategory = "Very High Risk";
    } else if (riskScore >= 10) {
      riskCategory = "High Risk";
    } else if (riskScore >= 6) {
      riskCategory = "Moderate Risk";
    } else if (riskScore >= 3) {
      riskCategory = "Slightly Elevated Risk";
    } else {
      riskCategory = "Low Risk";
    }
    
    // Generate recommendations
    const recommendations = generateRecommendations(currentAge, gender, riskScore, riskCategory);
    
    setOsteoporosisResult({
      riskScore,
      riskCategory,
      recommendations
    });
  };

  const generateRecommendations = (
    age: number,
    gender: "female" | "male",
    riskScore: number,
    riskCategory: string
  ): string[] => {
    const recommendations: string[] = [];
    
    // Basic recommendations for everyone
    recommendations.push("Ensure adequate calcium intake (1000-1200mg daily) through diet or supplements");
    recommendations.push("Get sufficient vitamin D (600-800 IU daily) through sunlight exposure or supplements");
    recommendations.push("Engage in weight-bearing exercises and resistance training to strengthen bones");
    
    // Age-specific recommendations
    if (gender === "female" && age >= 65) {
      recommendations.push("Consider bone density testing (DXA scan) as recommended for all women 65+");
    } else if (gender === "male" && age >= 70) {
      recommendations.push("Consider bone density testing (DXA scan) as recommended for all men 70+");
    } else if (riskCategory === "Moderate Risk" || riskCategory === "High Risk" || riskCategory === "Very High Risk") {
      recommendations.push("Discuss early bone density testing with your healthcare provider");
    }
    
    // Risk-level specific recommendations
    if (riskCategory === "High Risk" || riskCategory === "Very High Risk") {
      recommendations.push("Consult with a specialist about osteoporosis prevention and treatment options");
      recommendations.push("Discuss prescription medications that may help prevent bone loss");
      recommendations.push("Consider fall prevention strategies in your home environment");
    } else if (riskCategory === "Moderate Risk") {
      recommendations.push("Follow up with your healthcare provider for personalized prevention strategies");
      recommendations.push("Consider increasing calcium and vitamin D intake above the standard recommendations");
    }
    
    // Lifestyle recommendations
    if (smoking === "current") {
      recommendations.push("Quit smoking to reduce further bone density loss");
    }
    
    if (alcohol === "moderate" || alcohol === "heavy") {
      recommendations.push("Limit alcohol consumption to reduce risk of falls and bone loss");
    }
    
    if (exercise === "sedentary" || exercise === "occasional") {
      recommendations.push("Increase your physical activity level with weight-bearing exercises like walking, hiking, or dancing");
    }
    
    if (calcium === "low") {
      recommendations.push("Increase consumption of calcium-rich foods like dairy products, leafy greens, and fortified foods");
    }
    
    if (vitaminD === "low") {
      recommendations.push("Consider vitamin D supplementation and brief, safe sun exposure");
    }
    
    return recommendations;
  };

  const handleCopy = () => {
    if (!osteoporosisResult) return;
    
    const results = {
      title: "Osteoporosis Risk Calculator",
      results: {
        "Age": age,
        "Gender": gender === "female" ? "Female" : "Male",
        "BMI": unitSystem === "metric" 
          ? (parseFloat(weight) / ((parseFloat(height) / 100) ** 2)).toFixed(1)
          : ((parseFloat(weight) / (parseFloat(height) ** 2)) * 703).toFixed(1),
        "Risk Score": osteoporosisResult.riskScore.toString(),
        "Risk Category": osteoporosisResult.riskCategory
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
    if (!osteoporosisResult) return;
    
    const results = {
      title: "Osteoporosis Risk Calculator",
      results: {
        "Age": age,
        "Gender": gender === "female" ? "Female" : "Male",
        "BMI": unitSystem === "metric" 
          ? (parseFloat(weight) / ((parseFloat(height) / 100) ** 2)).toFixed(1)
          : ((parseFloat(weight) / (parseFloat(height) ** 2)) * 703).toFixed(1),
        "Risk Score": osteoporosisResult.riskScore.toString(),
        "Risk Category": osteoporosisResult.riskCategory
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    shareResults(results);
  };

  const handleDownload = () => {
    if (!osteoporosisResult) return;
    
    const results = {
      title: "Osteoporosis Risk Calculator",
      results: {
        "Age": age,
        "Gender": gender === "female" ? "Female" : "Male",
        "BMI": unitSystem === "metric" 
          ? (parseFloat(weight) / ((parseFloat(height) / 100) ** 2)).toFixed(1)
          : ((parseFloat(weight) / (parseFloat(height) ** 2)) * 703).toFixed(1),
        "Risk Score": osteoporosisResult.riskScore.toString(),
        "Risk Category": osteoporosisResult.riskCategory
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    downloadResultsAsCSV(results, "Osteoporosis-Risk");
    showSuccessToast("Results downloaded successfully!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Osteoporosis Risk Calculator</h2>
      <p className="text-gray-600 mb-6 text-center">
        Assess your risk of developing osteoporosis based on health factors
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
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup
            value={gender}
            onValueChange={(value) => {
              setGender(value as "female" | "male");
              // Reset menopause values if changing to male
              if (value === "male") {
                setMenopause("na");
                setEarlyMenopause("na");
              } else {
                setMenopause("no");
                setEarlyMenopause("no");
              }
            }}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Tabs defaultValue={unitSystem} onValueChange={handleUnitChange} className="w-full">
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
                placeholder="e.g., 150"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height-imperial">Height (inches)</Label>
              <Input
                id="height-imperial"
                type="number"
                placeholder="e.g., 68"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                For 5'8", enter 68 inches (5×12 + 8)
              </p>
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
            <div className="space-y-2">
              <Label htmlFor="height-metric">Height (cm)</Label>
              <Input
                id="height-metric"
                type="number"
                placeholder="e.g., 170"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        {gender === "female" && (
          <>
            <div className="space-y-2">
              <Label>Are you post-menopausal?</Label>
              <RadioGroup
                value={menopause}
                onValueChange={(value) => setMenopause(value as "yes" | "no" | "na")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="menopause-yes" />
                  <Label htmlFor="menopause-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="menopause-no" />
                  <Label htmlFor="menopause-no">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            {menopause === "yes" && (
              <div className="space-y-2">
                <Label>Did you experience early menopause (before age 45)?</Label>
                <RadioGroup
                  value={earlyMenopause}
                  onValueChange={(value) => setEarlyMenopause(value as "yes" | "no" | "na")}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="early-yes" />
                    <Label htmlFor="early-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="early-no" />
                    <Label htmlFor="early-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </>
        )}
        
        <div className="space-y-2">
          <Label>Have you ever had a fracture as an adult from minor trauma?</Label>
          <RadioGroup
            value={fractureHistory}
            onValueChange={(value) => setFractureHistory(value as "yes" | "no")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="fracture-yes" />
              <Label htmlFor="fracture-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="fracture-no" />
              <Label htmlFor="fracture-no">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label>Did either of your parents have a hip fracture?</Label>
          <RadioGroup
            value={parentalFracture}
            onValueChange={(value) => setParentalFracture(value as "yes" | "no" | "unknown")}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="parental-yes" />
              <Label htmlFor="parental-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="parental-no" />
              <Label htmlFor="parental-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unknown" id="parental-unknown" />
              <Label htmlFor="parental-unknown">I don't know</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label>Smoking Status</Label>
          <RadioGroup
            value={smoking}
            onValueChange={(value) => setSmoking(value as "current" | "former" | "never")}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="current" id="smoking-current" />
              <Label htmlFor="smoking-current">Current smoker</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="former" id="smoking-former" />
              <Label htmlFor="smoking-former">Former smoker</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="never" id="smoking-never" />
              <Label htmlFor="smoking-never">Never smoked</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label>Alcohol Consumption</Label>
          <RadioGroup
            value={alcohol}
            onValueChange={(value) => setAlcohol(value as "none" | "moderate" | "heavy")}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="alcohol-none" />
              <Label htmlFor="alcohol-none">None/Rarely</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="alcohol-moderate" />
              <Label htmlFor="alcohol-moderate">Moderate (≤7 drinks/week)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="heavy" id="alcohol-heavy" />
              <Label htmlFor="alcohol-heavy">Heavy (&gt;7 drinks/week)</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label>Have you taken oral glucocorticoids (prednisone, etc.) for more than 3 months?</Label>
          <RadioGroup
            value={glucocorticoids}
            onValueChange={(value) => setGlucocorticoids(value as "yes" | "no")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="glucocorticoids-yes" />
              <Label htmlFor="glucocorticoids-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="glucocorticoids-no" />
              <Label htmlFor="glucocorticoids-no">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label>Do you have rheumatoid arthritis?</Label>
          <RadioGroup
            value={rheumatoidArthritis}
            onValueChange={(value) => setRheumatoidArthritis(value as "yes" | "no")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="arthritis-yes" />
              <Label htmlFor="arthritis-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="arthritis-no" />
              <Label htmlFor="arthritis-no">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label>Calcium Intake</Label>
          <RadioGroup
            value={calcium}
            onValueChange={(value) => setCalcium(value as "adequate" | "low")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="adequate" id="calcium-adequate" />
              <Label htmlFor="calcium-adequate">Adequate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="calcium-low" />
              <Label htmlFor="calcium-low">Low</Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-gray-500">
            Adults need 1000-1200 mg daily (dairy products, green leafy vegetables, fortified foods)
          </p>
        </div>
        
        <div className="space-y-2">
          <Label>Vitamin D Status</Label>
          <RadioGroup
            value={vitaminD}
            onValueChange={(value) => setVitaminD(value as "adequate" | "low" | "unknown")}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="adequate" id="vitaminD-adequate" />
              <Label htmlFor="vitaminD-adequate">Adequate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="vitaminD-low" />
              <Label htmlFor="vitaminD-low">Low/Deficient</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unknown" id="vitaminD-unknown" />
              <Label htmlFor="vitaminD-unknown">I don't know</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label>Physical Activity Level</Label>
          <RadioGroup
            value={exercise}
            onValueChange={(value) => setExercise(value as "regular" | "occasional" | "sedentary")}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="regular" id="exercise-regular" />
              <Label htmlFor="exercise-regular">Regular (3+ times/week)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="occasional" id="exercise-occasional" />
              <Label htmlFor="exercise-occasional">Occasional (1-2 times/week)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sedentary" id="exercise-sedentary" />
              <Label htmlFor="exercise-sedentary">Sedentary (rarely exercise)</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      <Button onClick={calculateOsteoporosisRisk} className="w-full mb-6">
        Calculate Risk
      </Button>
      
      {osteoporosisResult && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Osteoporosis Risk Assessment</h3>
            {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
          </div>
          
          <div className="space-y-4">
            <div className={`p-4 rounded-md ${
              osteoporosisResult.riskCategory === "Very High Risk" || osteoporosisResult.riskCategory === "High Risk"
                ? "bg-wellness-softRed"
                : osteoporosisResult.riskCategory === "Moderate Risk"
                  ? "bg-wellness-softOrange"
                  : "bg-wellness-softGreen"
            }`}>
              <p className="text-sm text-gray-700">Risk Category</p>
              <p className="font-bold text-2xl">{osteoporosisResult.riskCategory}</p>
              <p className="text-sm text-gray-700">
                Score: <span className="font-medium">{osteoporosisResult.riskScore}</span> out of 25
              </p>
            </div>
            
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="font-medium mb-2">Recommendations</p>
              <ul className="space-y-1 list-disc pl-5">
                {osteoporosisResult.recommendations.map((rec, index) => (
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
              This calculator provides an estimate based on known risk factors.
              For accurate bone density measurement, a DXA scan is recommended.
            </p>
            <p className="mt-2">
              Based on guidance from the National Osteoporosis Foundation and WHO.
              Thank you for using Survivewellness!
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default OsteoporosisRiskCalculator;
