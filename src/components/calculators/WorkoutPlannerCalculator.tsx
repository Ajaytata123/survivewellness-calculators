
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
import ResultActions from "@/components/calculator/ResultActions";

interface WorkoutPlannerCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const WorkoutPlannerCalculator: React.FC<WorkoutPlannerCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [fitnessGoal, setFitnessGoal] = useState<string>("general");
  const [experienceLevel, setExperienceLevel] = useState<string>("beginner");
  const [availableTime, setAvailableTime] = useState<string>("30");
  const [workoutDays, setWorkoutDays] = useState<string>("3");
  const [equipment, setEquipment] = useState<string>("bodyweight");
  
  const [workoutPlan, setWorkoutPlan] = useState<{
    plan: string[];
    tips: string[];
  } | null>(null);

  const generateWorkoutPlan = () => {
    if (!fitnessGoal || !experienceLevel || !availableTime || !workoutDays) {
      showErrorToast("Please fill in all required fields");
      return;
    }

    let plan: string[] = [];
    let tips: string[] = [];

    // Generate plan based on goals and experience
    if (fitnessGoal === "weightLoss") {
      plan = [
        "Day 1: Full Body Circuit Training (30-45 min)",
        "Day 2: Cardio - Running/Walking (30-40 min)",
        "Day 3: Upper Body Strength + Core (30-40 min)",
        "Day 4: Rest or Light Yoga",
        "Day 5: Lower Body Strength (30-40 min)",
        "Day 6: HIIT Cardio (20-30 min)",
        "Day 7: Rest"
      ];
      tips = [
        "Focus on compound movements",
        "Include cardio 3-4 times per week",
        "Maintain a caloric deficit",
        "Stay hydrated"
      ];
    } else if (fitnessGoal === "muscleGain") {
      plan = [
        "Day 1: Chest, Shoulders, Triceps",
        "Day 2: Back, Biceps",
        "Day 3: Legs, Glutes",
        "Day 4: Rest",
        "Day 5: Push Day (Chest, Shoulders, Triceps)",
        "Day 6: Pull Day (Back, Biceps)",
        "Day 7: Legs, Core"
      ];
      tips = [
        "Progressive overload is key",
        "Rest 48-72 hours between muscle groups",
        "Eat in a caloric surplus",
        "Get adequate protein (1.6-2.2g per kg bodyweight)"
      ];
    } else {
      plan = [
        "Day 1: Full Body Strength Training",
        "Day 2: Cardio + Flexibility",
        "Day 3: Upper Body Focus",
        "Day 4: Active Recovery",
        "Day 5: Lower Body Focus",
        "Day 6: Mixed Cardio",
        "Day 7: Rest"
      ];
      tips = [
        "Balance strength and cardio",
        "Include flexibility work",
        "Listen to your body",
        "Stay consistent"
      ];
    }

    setWorkoutPlan({ plan, tips });
    showSuccessToast("Workout plan generated!");
  };

  const prepareResults = () => {
    if (!workoutPlan) return {};
    
    const results: Record<string, string | number> = {
      "Fitness Goal": fitnessGoal,
      "Experience Level": experienceLevel,
      "Available Time": `${availableTime} minutes`,
      "Workout Days": `${workoutDays} days per week`,
      "Equipment": equipment,
    };

    workoutPlan.plan.forEach((day, index) => {
      results[`Day ${index + 1}`] = day;
    });

    workoutPlan.tips.forEach((tip, index) => {
      results[`Tip ${index + 1}`] = tip;
    });

    return results;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Workout Planner</h2>
        <p className="text-gray-600 mb-4 text-center">
          Create a personalized workout plan based on your goals and preferences
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
            <Label className="block text-left">Fitness Goal</Label>
            <Select value={fitnessGoal} onValueChange={setFitnessGoal}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weightLoss">Weight Loss</SelectItem>
                <SelectItem value="muscleGain">Muscle Gain</SelectItem>
                <SelectItem value="general">General Fitness</SelectItem>
                <SelectItem value="endurance">Endurance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="block text-left">Experience Level</Label>
            <RadioGroup
              value={experienceLevel}
              onValueChange={setExperienceLevel}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner" className="block text-left">Beginner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate" className="block text-left">Intermediate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced" className="block text-left">Advanced</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="block text-left">Available Time (minutes per workout)</Label>
              <Select value={availableTime} onValueChange={setAvailableTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="block text-left">Workout Days per Week</Label>
              <Select value={workoutDays} onValueChange={setWorkoutDays}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 days</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="4">4 days</SelectItem>
                  <SelectItem value="5">5 days</SelectItem>
                  <SelectItem value="6">6 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="block text-left">Available Equipment</Label>
            <Select value={equipment} onValueChange={setEquipment}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bodyweight">Bodyweight Only</SelectItem>
                <SelectItem value="dumbbells">Dumbbells</SelectItem>
                <SelectItem value="gym">Full Gym Access</SelectItem>
                <SelectItem value="home">Home Gym Setup</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={generateWorkoutPlan} className="w-full mb-6">
          Generate Workout Plan
        </Button>

        {workoutPlan && (
          <div className="results-container bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200 shadow-sm">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Your Personalized Workout Plan</h3>
              {userName && <p className="text-sm mt-2 text-gray-600">Plan for: {userName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-semibold mb-3 text-violet-700">Weekly Schedule</h4>
                <div className="space-y-2">
                  {workoutPlan.plan.map((day, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-violet-600 mr-2 mt-1">•</span>
                      <span className="text-sm text-gray-700">{day}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-semibold mb-3 text-green-700">Important Tips</h4>
                <div className="space-y-2">
                  {workoutPlan.tips.map((tip, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">✓</span>
                      <span className="text-sm text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <ResultActions
              title="Workout Planner"
              results={prepareResults()}
              fileName="Workout-Plan"
              userName={userName}
              unitSystem={unitSystem}
            />
          </div>
        )}
      </Card>

      <IntroSection calculatorId="workout" title="" description="" />
    </div>
  );
};

export default WorkoutPlannerCalculator;
