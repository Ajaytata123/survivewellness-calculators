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

interface IntermittentFastingCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const IntermittentFastingCalculator: React.FC<IntermittentFastingCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [fastingMethod, setFastingMethod] = useState<string>("16:8");
  const [goal, setGoal] = useState<string>("weightLoss");
  const [lifestyle, setLifestyle] = useState<string>("moderate");
  const [startTime, setStartTime] = useState<string>("12:00");
  
  const [fastingPlan, setFastingPlan] = useState<{
    method: string;
    fastingWindow: string;
    eatingWindow: string;
    tips: string[];
    schedule: string[];
  } | null>(null);

  const generateFastingPlan = () => {
    if (!fastingMethod || !goal || !lifestyle) {
      showErrorToast("Please fill in all required fields");
      return;
    }

    let method = fastingMethod;
    let fastingWindow = "";
    let eatingWindow = "";
    let tips: string[] = [];
    let schedule: string[] = [];

    switch (fastingMethod) {
      case "16:8":
        fastingWindow = "16 hours";
        eatingWindow = "8 hours";
        tips = [
          "Start eating at 12:00 PM, stop at 8:00 PM",
          "Drink water, black coffee, or plain tea during fasting",
          "Eat nutrient-dense meals during eating window",
          "Listen to your body and adjust as needed"
        ];
        schedule = [
          "12:00 PM - First meal (break fast)",
          "3:00 PM - Snack (optional)",
          "6:00 PM - Second meal",
          "8:00 PM - Last meal/snack",
          "8:00 PM - 12:00 PM next day: Fasting period"
        ];
        break;
      case "18:6":
        fastingWindow = "18 hours";
        eatingWindow = "6 hours";
        tips = [
          "More advanced fasting protocol",
          "Start eating at 1:00 PM, stop at 7:00 PM",
          "Focus on protein and healthy fats",
          "Stay hydrated during longer fasting period"
        ];
        schedule = [
          "1:00 PM - First meal (break fast)",
          "4:00 PM - Second meal",
          "7:00 PM - Last meal",
          "7:00 PM - 1:00 PM next day: Fasting period"
        ];
        break;
      case "20:4":
        fastingWindow = "20 hours";
        eatingWindow = "4 hours";
        tips = [
          "Advanced fasting method",
          "One large meal or two smaller meals",
          "Focus on nutrient density",
          "Consider electrolyte supplementation"
        ];
        schedule = [
          "4:00 PM - First meal",
          "7:00 PM - Second meal (optional)",
          "8:00 PM - Eating window closes",
          "8:00 PM - 4:00 PM next day: Fasting period"
        ];
        break;
      case "5:2":
        fastingWindow = "2 days per week";
        eatingWindow = "5 days normal eating";
        tips = [
          "Eat normally 5 days, restrict to 500-600 calories 2 days",
          "Choose non-consecutive fasting days",
          "Focus on protein and vegetables on fasting days",
          "Stay hydrated throughout the week"
        ];
        schedule = [
          "Monday: Normal eating",
          "Tuesday: Fasting day (500-600 calories)",
          "Wednesday: Normal eating",
          "Thursday: Normal eating",
          "Friday: Fasting day (500-600 calories)",
          "Saturday: Normal eating",
          "Sunday: Normal eating"
        ];
        break;
    }

    setFastingPlan({
      method,
      fastingWindow,
      eatingWindow,
      tips,
      schedule
    });

    showSuccessToast("Fasting plan generated!");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Intermittent Fasting Planner</h2>
        <p className="text-gray-600 mb-4 text-center">
          Create a personalized intermittent fasting schedule based on your goals and lifestyle
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

          <div className="space-y-2">
            <Label className="block text-left">Fasting Method</Label>
            <Select value={fastingMethod} onValueChange={setFastingMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:8">16:8 Method (Beginner)</SelectItem>
                <SelectItem value="18:6">18:6 Method (Intermediate)</SelectItem>
                <SelectItem value="20:4">20:4 Method (Advanced)</SelectItem>
                <SelectItem value="5:2">5:2 Method (Weekly)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="block text-left">Primary Goal</Label>
            <RadioGroup
              value={goal}
              onValueChange={setGoal}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weightLoss" id="weightLoss" />
                <Label htmlFor="weightLoss">Weight Loss</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="health" id="health" />
                <Label htmlFor="health">General Health</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lifestyle" id="lifestyle" />
                <Label htmlFor="lifestyle">Lifestyle</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="block text-left">Lifestyle</Label>
            <Select value={lifestyle} onValueChange={setLifestyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary</SelectItem>
                <SelectItem value="moderate">Moderately Active</SelectItem>
                <SelectItem value="active">Very Active</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime" className="block text-left">Preferred Eating Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={generateFastingPlan} className="w-full mb-6">
          Generate Fasting Plan
        </Button>

        {fastingPlan && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Your Intermittent Fasting Plan</h3>
              {userName && <p className="text-sm mt-2">Plan for: {userName}</p>}
            </div>

            <div className="bg-wellness-softPurple p-4 rounded-md mb-4 text-center">
              <h4 className="font-medium mb-2">{fastingPlan.method} Method</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-700">Fasting Window</p>
                  <p className="font-bold">{fastingPlan.fastingWindow}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-700">Eating Window</p>
                  <p className="font-bold">{fastingPlan.eatingWindow}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md mb-4">
              <h4 className="font-medium mb-3">Daily Schedule</h4>
              <div className="space-y-2">
                {fastingPlan.schedule.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-wellness-purple mr-2">•</span>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-md">
              <h4 className="font-medium mb-3">Important Tips</h4>
              <div className="space-y-2">
                {fastingPlan.tips.map((tip, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-wellness-green mr-2">✓</span>
                    <span className="text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-wellness-purple">
              <p>Thank you for using Survive<span className="lowercase">w</span>ellness!</p>
            </div>
          </div>
        )}
      </Card>

      <IntroSection calculatorId="fasting" title="" description="" />
    </div>
  );
};

export default IntermittentFastingCalculator;
