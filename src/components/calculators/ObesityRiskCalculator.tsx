
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnitSystem } from "@/types/calculatorTypes";
import { downloadResultsAsCSV, copyResultsToClipboard, shareResults } from "@/utils/downloadUtils";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { Copy, Share } from "lucide-react";

interface ObesityRiskCalculatorProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const ObesityRiskCalculator: React.FC<ObesityRiskCalculatorProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [waistCircumference, setWaistCircumference] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState<string>("");
  const [familyHistory, setFamilyHistory] = useState<boolean>(false);
  const [obesityResult, setObesityResult] = useState<{
    bmi: number;
    bmiCategory: string;
    waistRisk: string;
    overallRisk: string;
    recommendations: string[];
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleUnitChange = (value: string) => {
    onUnitSystemChange(value as UnitSystem);
    setWeight("");
    setHeight("");
    setWaistCircumference("");
    setObesityResult(null);
  };

  const calculateBMI = (): number | null => {
    if (!weight || !height) return null;
    
    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);
    
    if (isNaN(weightValue) || isNaN(heightValue) || weightValue <= 0 || heightValue <= 0) {
      return null;
    }
    
    let bmi: number;
    if (unitSystem === "imperial") {
      // Weight in pounds, height in inches
      bmi = (weightValue / (heightValue * heightValue)) * 703;
    } else {
      // Weight in kg, height in cm, need to convert height to meters
      bmi = weightValue / ((heightValue / 100) * (heightValue / 100));
    }
    
    return parseFloat(bmi.toFixed(1));
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    if (bmi < 35) return "Obesity Class I";
    if (bmi < 40) return "Obesity Class II";
    return "Obesity Class III";
  };

  const getWaistRisk = (waist: number): string => {
    if (unitSystem === "imperial") {
      // Convert inches to cm for assessment
      waist = waist * 2.54;
    }
    
    if (gender === "male") {
      if (waist < 94) return "Low Risk";
      if (waist < 102) return "Increased Risk";
      return "High Risk";
    } else {
      if (waist < 80) return "Low Risk";
      if (waist < 88) return "Increased Risk";
      return "High Risk";
    }
  };

  const getOverallRisk = (bmi: number, waistRisk: string, age: number, familyHistory: boolean): string => {
    let riskScore = 0;
    
    // BMI factor
    if (bmi < 18.5) riskScore += 1; // Underweight has some health risks
    else if (bmi < 25) riskScore += 0; // Normal weight
    else if (bmi < 30) riskScore += 2; // Overweight
    else if (bmi < 35) riskScore += 3; // Obesity Class I
    else if (bmi < 40) riskScore += 4; // Obesity Class II
    else riskScore += 5; // Obesity Class III
    
    // Waist circumference factor
    if (waistRisk === "Low Risk") riskScore += 0;
    else if (waistRisk === "Increased Risk") riskScore += 2;
    else riskScore += 3; // High Risk
    
    // Age factor
    if (age >= 45) riskScore += 1;
    
    // Family history factor
    if (familyHistory) riskScore += 2;
    
    // Determine overall risk
    if (riskScore <= 2) return "Low Risk";
    if (riskScore <= 5) return "Moderate Risk";
    if (riskScore <= 8) return "High Risk";
    return "Very High Risk";
  };

  const getRecommendations = (bmiCategory: string, waistRisk: string, overallRisk: string): string[] => {
    const recommendations: string[] = [];
    
    // General recommendation for everyone
    recommendations.push("Maintain a balanced diet rich in fruits, vegetables, whole grains, and lean proteins.");
    recommendations.push("Engage in regular physical activity (aim for at least 150 minutes of moderate exercise per week).");
    
    // BMI-specific recommendations
    if (bmiCategory === "Underweight") {
      recommendations.push("Consider consulting with a healthcare provider about healthy weight gain strategies.");
    } else if (bmiCategory === "Overweight" || bmiCategory.includes("Obesity")) {
      recommendations.push("Aim for gradual weight loss of 0.5-1 kg (1-2 lbs) per week through a combination of diet and exercise.");
    }
    
    // Waist circumference recommendations
    if (waistRisk !== "Low Risk") {
      recommendations.push("Focus on reducing abdominal fat through aerobic exercises and core-strengthening activities.");
    }
    
    // Risk-level recommendations
    if (overallRisk === "High Risk" || overallRisk === "Very High Risk") {
      recommendations.push("Schedule regular check-ups with your healthcare provider to monitor health markers.");
      recommendations.push("Consider working with a registered dietitian to develop a personalized nutrition plan.");
    }
    
    // Family history recommendation
    if (familyHistory) {
      recommendations.push("Given your family history of obesity-related conditions, maintaining preventive health screenings is particularly important.");
    }
    
    return recommendations;
  };

  const calculateObesityRisk = () => {
    if (!weight || !height || !waistCircumference || !age) {
      showErrorToast("Please fill in all required fields");
      return;
    }
    
    const bmi = calculateBMI();
    if (bmi === null) {
      showErrorToast("Please enter valid height and weight");
      return;
    }
    
    const waistValue = parseFloat(waistCircumference);
    const ageValue = parseInt(age);
    
    if (isNaN(waistValue) || isNaN(ageValue) || waistValue <= 0 || ageValue <= 0) {
      showErrorToast("Please enter valid measurements");
      return;
    }
    
    const bmiCategory = getBMICategory(bmi);
    const waistRisk = getWaistRisk(waistValue);
    const overallRisk = getOverallRisk(bmi, waistRisk, ageValue, familyHistory);
    const recommendations = getRecommendations(bmiCategory, waistRisk, overallRisk);
    
    setObesityResult({
      bmi,
      bmiCategory,
      waistRisk,
      overallRisk,
      recommendations
    });
  };

  const handleCopy = () => {
    if (!obesityResult) return;
    
    const results = {
      title: "Obesity Risk Calculator",
      results: {
        "Weight": `${weight} ${unitSystem === "imperial" ? "lbs" : "kg"}`,
        "Height": `${height} ${unitSystem === "imperial" ? "inches" : "cm"}`,
        "Waist Circumference": `${waistCircumference} ${unitSystem === "imperial" ? "inches" : "cm"}`,
        "Gender": gender === "male" ? "Male" : "Female",
        "Age": age,
        "Family History": familyHistory ? "Yes" : "No",
        "BMI": obesityResult.bmi.toString(),
        "BMI Category": obesityResult.bmiCategory,
        "Waist Risk": obesityResult.waistRisk,
        "Overall Risk": obesityResult.overallRisk
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
    if (!obesityResult) return;
    
    const results = {
      title: "Obesity Risk Calculator",
      results: {
        "Weight": `${weight} ${unitSystem === "imperial" ? "lbs" : "kg"}`,
        "Height": `${height} ${unitSystem === "imperial" ? "inches" : "cm"}`,
        "Waist Circumference": `${waistCircumference} ${unitSystem === "imperial" ? "inches" : "cm"}`,
        "Gender": gender === "male" ? "Male" : "Female",
        "Age": age,
        "Family History": familyHistory ? "Yes" : "No",
        "BMI": obesityResult.bmi.toString(),
        "BMI Category": obesityResult.bmiCategory,
        "Waist Risk": obesityResult.waistRisk,
        "Overall Risk": obesityResult.overallRisk
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    shareResults(results);
  };

  const handleDownload = () => {
    if (!obesityResult) return;
    
    const results = {
      title: "Obesity Risk Calculator",
      results: {
        "Weight": `${weight} ${unitSystem === "imperial" ? "lbs" : "kg"}`,
        "Height": `${height} ${unitSystem === "imperial" ? "inches" : "cm"}`,
        "Waist Circumference": `${waistCircumference} ${unitSystem === "imperial" ? "inches" : "cm"}`,
        "Gender": gender === "male" ? "Male" : "Female",
        "Age": age,
        "Family History": familyHistory ? "Yes" : "No",
        "BMI": obesityResult.bmi.toString(),
        "BMI Category": obesityResult.bmiCategory,
        "Waist Risk": obesityResult.waistRisk,
        "Overall Risk": obesityResult.overallRisk
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    downloadResultsAsCSV(results, "Obesity-Risk-Calculator");
    showSuccessToast("Results downloaded successfully!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Obesity Risk Calculator</h2>
      <p className="text-gray-600 mb-6 text-center">
        Assess your obesity risk based on multiple health factors
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
                placeholder="e.g., 170"
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
            <div className="space-y-2">
              <Label htmlFor="waist-imperial">Waist Circumference (inches)</Label>
              <Input
                id="waist-imperial"
                type="number"
                placeholder="e.g., 36"
                value={waistCircumference}
                onChange={(e) => setWaistCircumference(e.target.value)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="metric" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight-metric">Weight (kg)</Label>
              <Input
                id="weight-metric"
                type="number"
                placeholder="e.g., 75"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height-metric">Height (cm)</Label>
              <Input
                id="height-metric"
                type="number"
                placeholder="e.g., 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waist-metric">Waist Circumference (cm)</Label>
              <Input
                id="waist-metric"
                type="number"
                placeholder="e.g., 90"
                value={waistCircumference}
                onChange={(e) => setWaistCircumference(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>
        
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
          <Label>Family History of Obesity-related Conditions</Label>
          <RadioGroup
            value={familyHistory ? "yes" : "no"}
            onValueChange={(value) => setFamilyHistory(value === "yes")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="history-yes" />
              <Label htmlFor="history-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="history-no" />
              <Label htmlFor="history-no">No</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500">
            Such as type 2 diabetes, heart disease, or high blood pressure
          </p>
        </div>
      </div>
      
      <Button onClick={calculateObesityRisk} className="w-full mb-6">
        Calculate Obesity Risk
      </Button>
      
      {obesityResult && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-3">
            <h3 className="text-xl font-bold">Obesity Risk Assessment</h3>
            {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-sm text-gray-700">BMI</p>
              <p className="font-bold text-lg">{obesityResult.bmi}</p>
              <p className="text-sm text-wellness-blue">{obesityResult.bmiCategory}</p>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-sm text-gray-700">Waist Circumference Risk</p>
              <p className="font-bold text-lg">{obesityResult.waistRisk}</p>
            </div>
          </div>
          
          <div className={`p-3 rounded-md mb-4 ${
            obesityResult.overallRisk === "Low Risk" 
              ? "bg-green-100" 
              : obesityResult.overallRisk === "Moderate Risk"
              ? "bg-yellow-100"
              : "bg-red-100"
          }`}>
            <p className="text-sm text-gray-700">Overall Risk Assessment</p>
            <p className="font-bold text-lg">{obesityResult.overallRisk}</p>
          </div>
          
          <div className="bg-white p-3 rounded-md shadow-sm mb-4">
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="list-disc pl-5 space-y-1">
              {obesityResult.recommendations.map((rec, index) => (
                <li key={index} className="text-sm">{rec}</li>
              ))}
            </ul>
          </div>
          
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center">
                <Copy className="h-4 w-4 mr-1" />
                {copied ? "Copied!" : "Copy Results"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center">
                <Share className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                Download CSV
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-wellness-purple">
            <p>
              This calculator is based on guidelines from the CDC, WHO, and NIH.
              Always consult with healthcare professionals for personalized advice.
            </p>
            <p className="mt-2">
              Thank you for using Survivewellness!
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ObesityRiskCalculator;
