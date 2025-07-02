
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

interface MenopauseEstimatorCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const MenopauseEstimatorCalculator: React.FC<MenopauseEstimatorCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [currentAge, setCurrentAge] = useState<string>("");
  const [motherMenopauseAge, setMotherMenopauseAge] = useState<string>("");
  const [smokingStatus, setSmokingStatus] = useState<string>("never");
  const [exerciseFrequency, setExerciseFrequency] = useState<string>("regular");
  const [bodyWeight, setBodyWeight] = useState<string>("normal");
  const [stressLevel, setStressLevel] = useState<string>("low");
  const [hadChildren, setHadChildren] = useState<boolean>(true);
  const [currentlyMenstruating, setCurrentlyMenstruating] = useState<boolean>(true);
  
  const [menopauseEstimate, setMenopauseEstimate] = useState<{
    estimatedAge: number;
    ageRange: { min: number; max: number };
    yearsRemaining: number;
    stage: string;
    recommendations: string[];
  } | null>(null);

  const calculateMenopauseEstimate = () => {
    if (!currentAge) {
      showErrorToast("Please enter your current age");
      return;
    }

    const age = parseInt(currentAge);
    const motherAge = motherMenopauseAge ? parseInt(motherMenopauseAge) : 51;

    if (isNaN(age) || age < 18 || age > 70) {
      showErrorToast("Please enter a valid age between 18-70");
      return;
    }

    // Base estimate starts with average menopause age (51) or mother's age if available
    let estimatedAge = motherAge;
    
    // Adjust based on various factors
    if (smokingStatus === "current") estimatedAge -= 2;
    else if (smokingStatus === "former") estimatedAge -= 1;
    
    if (exerciseFrequency === "none") estimatedAge -= 1;
    else if (exerciseFrequency === "high") estimatedAge += 1;
    
    if (bodyWeight === "underweight") estimatedAge -= 1;
    else if (bodyWeight === "overweight") estimatedAge += 1;
    
    if (stressLevel === "high") estimatedAge -= 1;
    
    if (!hadChildren) estimatedAge -= 1;
    
    // Ensure realistic range
    estimatedAge = Math.max(45, Math.min(58, estimatedAge));
    
    const ageRange = {
      min: Math.max(45, estimatedAge - 3),
      max: Math.min(58, estimatedAge + 3)
    };
    
    const yearsRemaining = Math.max(0, estimatedAge - age);
    
    // Determine current stage
    let stage: string;
    if (age < 40) {
      stage = "Reproductive Years";
    } else if (age < 47) {
      stage = "Early Reproductive Transition";
    } else if (age < estimatedAge - 2) {
      stage = "Perimenopause (Early)";
    } else if (age < estimatedAge) {
      stage = "Perimenopause (Late)";
    } else {
      stage = "Menopause";
    }
    
    // Recommendations based on stage and age
    const recommendations = [
      "Maintain regular exercise routine",
      "Eat calcium-rich foods and consider supplements",
      "Practice stress management techniques",
      "Schedule regular health check-ups",
      "Discuss hormone therapy options with your doctor",
      "Monitor bone health with regular screenings"
    ];

    setMenopauseEstimate({
      estimatedAge,
      ageRange,
      yearsRemaining,
      stage,
      recommendations
    });

    showSuccessToast("Menopause estimate calculated!");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Menopause Estimator</h2>
        <p className="text-gray-600 mb-4 text-center">
          Estimate your menopause timeline based on various health factors
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
              <Label htmlFor="currentAge" className="block text-left">Current Age</Label>
              <Input
                id="currentAge"
                type="number"
                placeholder="e.g., 45"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motherMenopauseAge" className="block text-left">Mother's Menopause Age (if known)</Label>
              <Input
                id="motherMenopauseAge"
                type="number"
                placeholder="e.g., 52"
                value={motherMenopauseAge}
                onChange={(e) => setMotherMenopauseAge(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="block text-left">Smoking Status</Label>
            <RadioGroup
              value={smokingStatus}
              onValueChange={setSmokingStatus}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="never" id="never" />
                <Label htmlFor="never">Never smoked</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="former" id="former" />
                <Label htmlFor="former">Former smoker</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="current" id="current" />
                <Label htmlFor="current">Current smoker</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="block text-left">Exercise Frequency</Label>
            <RadioGroup
              value={exerciseFrequency}
              onValueChange={setExerciseFrequency}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">Rarely or never</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">Light exercise (1-2 times/week)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="regular" />
                <Label htmlFor="regular">Regular exercise (3-4 times/week)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high">High intensity (5+ times/week)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="block text-left">Body Weight</Label>
            <RadioGroup
              value={bodyWeight}
              onValueChange={setBodyWeight}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="underweight" id="underweight" />
                <Label htmlFor="underweight">Underweight</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal">Normal weight</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="overweight" id="overweight" />
                <Label htmlFor="overweight">Overweight</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="block text-left">Stress Level</Label>
            <RadioGroup
              value={stressLevel}
              onValueChange={setStressLevel}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low">Low stress</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="moderate" />
                <Label htmlFor="moderate">Moderate stress</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high">High stress</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hadChildren" 
                checked={hadChildren}
                onCheckedChange={(checked) => setHadChildren(checked as boolean)}
              />
              <Label htmlFor="hadChildren">Have you had children?</Label>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="currentlyMenstruating" 
                checked={currentlyMenstruating}
                onCheckedChange={(checked) => setCurrentlyMenstruating(checked as boolean)}
              />
              <Label htmlFor="currentlyMenstruating">Are you currently menstruating regularly?</Label>
            </div>
          </div>
        </div>

        <Button onClick={calculateMenopauseEstimate} className="w-full mb-6">
          Calculate Menopause Estimate
        </Button>

        {menopauseEstimate && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Your Menopause Estimate</h3>
              {userName && <p className="text-sm mt-2">Results for: {userName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-md text-center">
                <p className="text-sm text-purple-800">Estimated Menopause Age</p>
                <p className="text-lg font-bold text-purple-900">{menopauseEstimate.estimatedAge} years</p>
              </div>
              
              <div className="bg-blue-100 p-3 rounded-md text-center">
                <p className="text-sm text-blue-800">Age Range</p>
                <p className="text-lg font-bold text-blue-900">{menopauseEstimate.ageRange.min} - {menopauseEstimate.ageRange.max} years</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-md text-center">
                <p className="text-sm text-green-800">Years Remaining</p>
                <p className="text-lg font-bold text-green-900">{menopauseEstimate.yearsRemaining} years</p>
              </div>
              
              <div className="bg-orange-100 p-3 rounded-md text-center">
                <p className="text-sm text-orange-800">Current Stage</p>
                <p className="text-lg font-bold text-orange-900">{menopauseEstimate.stage}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md">
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {menopauseEstimate.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="text-wellness-purple mr-2">•</span>
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

      <IntroSection calculatorId="menopause" title="" description="" />
    </div>
  );
};

export default MenopauseEstimatorCalculator;
