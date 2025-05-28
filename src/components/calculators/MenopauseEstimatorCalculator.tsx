import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import IntroSection from "@/components/calculator/IntroSection";

interface MenopauseEstimatorCalcProps {
  unitSystem: any;
  onUnitSystemChange: (system: any) => void;
}

const MenopauseEstimatorCalculator: React.FC<MenopauseEstimatorCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [hasSymptoms, setHasSymptoms] = useState<"yes" | "no">("no");
  const [irregularPeriods, setIrregularPeriods] = useState<"yes" | "no">("no");
  const [familyHistory, setFamilyHistory] = useState<"yes" | "no">("no");
  
  const [estimationResult, setEstimationResult] = useState<{
    likelyTimeline: string;
    recommendations: string[];
  } | null>(null);

  const estimateMenopauseTimeline = () => {
    if (!age) {
      showErrorToast("Please enter your age");
      return;
    }

    const ageNum = parseInt(age);

    if (isNaN(ageNum)) {
      showErrorToast("Please enter a valid age");
      return;
    }

    let likelyTimeline: string;
    let recommendations: string[] = [];

    // Base estimation on age
    if (ageNum < 40) {
      likelyTimeline = "Unlikely to be in menopause";
      recommendations = [
        "Continue regular health check-ups",
        "Monitor menstrual cycle for changes",
        "Consult with a healthcare provider if concerned"
      ];
    } else if (ageNum >= 40 && ageNum < 45) {
      likelyTimeline = "Possibly in perimenopause";
      recommendations = [
        "Monitor for menopause symptoms",
        "Consider hormone level testing",
        "Discuss family history with doctor"
      ];
    } else if (ageNum >= 45 && ageNum < 55) {
      if (hasSymptoms === "yes" || irregularPeriods === "yes") {
        likelyTimeline = "Likely in perimenopause or menopause";
        recommendations = [
          "Consult with a healthcare provider",
          "Discuss symptom management options",
          "Consider hormone replacement therapy"
        ];
      } else {
        likelyTimeline = "Possibly in perimenopause";
        recommendations = [
          "Continue monitoring for symptoms",
          "Maintain a healthy lifestyle",
          "Consider regular check-ups"
        ];
      }
    } else {
      likelyTimeline = "Likely in menopause";
      recommendations = [
        "Consult with a healthcare provider",
        "Discuss long-term health management",
        "Consider bone density screening"
      ];
    }

    // Adjust based on family history
    if (familyHistory === "yes") {
      recommendations.push("Discuss family history with your healthcare provider");
    }

    setEstimationResult({
      likelyTimeline,
      recommendations
    });

    showSuccessToast("Menopause timeline estimated!");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Menopause Estimator</h2>
        <p className="text-gray-600 mb-4 text-center">
          Estimate your likely menopause timeline based on your age and symptoms
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
              placeholder="e.g., 48"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Experiencing Menopause Symptoms?</Label>
            <RadioGroup
              value={hasSymptoms}
              onValueChange={(value) => setHasSymptoms(value as "yes" | "no")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no-symptoms" />
                <Label htmlFor="no-symptoms">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes-symptoms" />
                <Label htmlFor="yes-symptoms">Yes</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Irregular Periods?</Label>
            <RadioGroup
              value={irregularPeriods}
              onValueChange={(value) => setIrregularPeriods(value as "yes" | "no")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no-irregular" />
                <Label htmlFor="no-irregular">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes-irregular" />
                <Label htmlFor="yes-irregular">Yes</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Family History of Early Menopause?</Label>
            <RadioGroup
              value={familyHistory}
              onValueChange={(value) => setFamilyHistory(value as "yes" | "no")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no-history" />
                <Label htmlFor="no-history">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes-history" />
                <Label htmlFor="yes-history">Yes</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button onClick={estimateMenopauseTimeline} className="w-full mb-6">
          Estimate Menopause Timeline
        </Button>

        {estimationResult && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Your Menopause Estimation</h3>
              {userName && <p className="text-sm mt-2">Estimation for: {userName}</p>}
            </div>

            <div className="bg-wellness-softPurple p-4 rounded-md mb-4 text-center">
              <p className="text-sm text-gray-700">Likely Timeline</p>
              <p className="text-lg font-bold text-wellness-purple">{estimationResult.likelyTimeline}</p>
            </div>

            <div className="bg-white p-4 rounded-md">
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {estimationResult.recommendations.map((rec, index) => (
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

      <IntroSection calculatorId="menopause" title="" description="" />
    </div>
  );
};

export default MenopauseEstimatorCalculator;
