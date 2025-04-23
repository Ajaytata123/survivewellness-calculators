
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnitSystem } from "@/types/calculatorTypes";
import { downloadResultsAsCSV, copyResultsToClipboard } from "@/utils/downloadUtils";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { Check, Copy } from "lucide-react";

interface WorkoutPlannerCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

interface WorkoutPlan {
  days: {
    day: string;
    workout: string;
    exercises: string[];
    duration: string;
    intensity: string;
  }[];
  totalCalories: number;
  weeklyDuration: string;
}

const WorkoutPlannerCalculator: React.FC<WorkoutPlannerCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [fitnessLevel, setFitnessLevel] = useState<string>("beginner");
  const [goal, setGoal] = useState<string>("general");
  const [frequency, setFrequency] = useState<string>("3");
  const [userName, setUserName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [copied, setCopied] = useState(false);

  const getFitnessLevelLabel = (value: string): string => {
    switch (value) {
      case "beginner": return "Beginner (new to fitness)";
      case "intermediate": return "Intermediate (6+ months experience)";
      case "advanced": return "Advanced (2+ years experience)";
      default: return "";
    }
  };

  const getGoalLabel = (value: string): string => {
    switch (value) {
      case "general": return "General Fitness";
      case "weightloss": return "Weight Loss";
      case "muscle": return "Muscle Building";
      case "strength": return "Strength";
      case "endurance": return "Endurance";
      default: return "";
    }
  };

  const generateWorkoutPlan = () => {
    if (!fitnessLevel || !goal || !frequency) {
      showErrorToast("Please fill all required fields");
      return;
    }

    if (age && (isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 120)) {
      showErrorToast("Please enter a valid age between 1 and 120");
      return;
    }

    const frequencyNum = parseInt(frequency);
    const workouts: {
      day: string;
      workout: string;
      exercises: string[];
      duration: string;
      intensity: string;
    }[] = [];
    
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let totalCalories = 0;
    let totalMinutes = 0;
    
    // Custom workout plans based on goals and fitness level
    const generateExercises = (type: string, level: string): string[] => {
      const exerciseLibrary = {
        cardio: {
          beginner: ["Walking", "Slow jogging", "Cycling (light)", "Swimming (easy)", "Elliptical (level 1-2)"],
          intermediate: ["Jogging", "Cycling (moderate)", "Swimming (moderate)", "Elliptical (level 3-5)", "Rowing"],
          advanced: ["Running", "Cycling (intense)", "Swimming (sprints)", "HIIT training", "Stair climbing"]
        },
        strength: {
          beginner: ["Bodyweight squats", "Push-ups (modified)", "Assisted pull-ups", "Dumbbell rows", "Plank"],
          intermediate: ["Barbell squats", "Push-ups", "Pull-ups", "Dumbbell press", "Lunges"],
          advanced: ["Back squats", "Bench press", "Weighted pull-ups", "Deadlifts", "Olympic lifts"]
        },
        flexibility: {
          beginner: ["Static stretching", "Yoga (basic)", "Joint rotations", "Child's pose", "Standing side bend"],
          intermediate: ["Dynamic stretching", "Yoga (intermediate)", "Pilates", "Hip openers", "Spinal twists"],
          advanced: ["Advanced yoga flows", "Deep flexibility work", "PNF stretching", "Split training", "Active mobility"]
        }
      };
      
      let exercises: string[] = [];
      
      if (type === "cardio") {
        exercises = [...exerciseLibrary.cardio[level as keyof typeof exerciseLibrary.cardio]];
        // Select 2-3 exercises randomly
        exercises = exercises.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 2);
      } else if (type === "strength") {
        exercises = [...exerciseLibrary.strength[level as keyof typeof exerciseLibrary.strength]];
        // Select 4-5 exercises randomly
        exercises = exercises.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 4);
      } else if (type === "rest") {
        exercises = ["Active recovery", "Light walking", "Gentle stretching"];
        // Select 2 exercises randomly
        exercises = exercises.sort(() => 0.5 - Math.random()).slice(0, 2);
      } else if (type === "flexibility") {
        exercises = [...exerciseLibrary.flexibility[level as keyof typeof exerciseLibrary.flexibility]];
        // Select 3-4 exercises randomly
        exercises = exercises.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 3);
      }
      
      return exercises;
    };
    
    // Determine workout structure based on goal
    const workoutStructure = {
      general: ["cardio", "strength", "rest", "cardio", "strength", "flexibility", "rest"],
      weightloss: ["cardio", "strength", "cardio", "strength", "cardio", "strength", "rest"],
      muscle: ["strength", "strength", "rest", "strength", "strength", "rest", "rest"],
      strength: ["strength", "cardio", "strength", "rest", "strength", "cardio", "rest"],
      endurance: ["cardio", "cardio", "strength", "cardio", "rest", "cardio", "rest"]
    };
    
    // Get the appropriate structure based on goal
    const structure = workoutStructure[goal as keyof typeof workoutStructure];
    
    // Calculate workout durations based on fitness level
    const getDuration = (type: string, level: string): string => {
      if (type === "rest") return "0";
      
      const durationMap = {
        beginner: { cardio: "20-30", strength: "30-40", flexibility: "15-20" },
        intermediate: { cardio: "30-45", strength: "40-60", flexibility: "20-30" },
        advanced: { cardio: "45-60", strength: "60-90", flexibility: "30-45" }
      };
      
      return durationMap[level as keyof typeof durationMap][type as keyof typeof durationMap.beginner];
    };
    
    // Calculate intensity based on fitness level
    const getIntensity = (type: string, level: string): string => {
      if (type === "rest") return "Low";
      
      const intensityMap = {
        beginner: { cardio: "Low-Moderate", strength: "Low-Moderate", flexibility: "Low" },
        intermediate: { cardio: "Moderate", strength: "Moderate-High", flexibility: "Moderate" },
        advanced: { cardio: "High", strength: "High", flexibility: "Moderate-High" }
      };
      
      return intensityMap[level as keyof typeof intensityMap][type as keyof typeof intensityMap.beginner];
    };

    // Generate workouts based on frequency
    const activeDays = new Set<number>();
    while (activeDays.size < frequencyNum) {
      // Skip Sunday (day 6) unless frequency is 7
      const day = frequencyNum < 7 ? Math.floor(Math.random() * 6) : activeDays.size;
      activeDays.add(day);
    }
    
    // Create the weekly plan
    for (let i = 0; i < 7; i++) {
      if (activeDays.has(i) || frequencyNum === 7) {
        const workoutType = structure[i];
        const duration = getDuration(workoutType, fitnessLevel);
        const exercises = generateExercises(workoutType, fitnessLevel);
        const intensity = getIntensity(workoutType, fitnessLevel);
        
        // Calculate approx. calories - very roughly based on workout type and duration
        const avgDuration = parseInt(duration.split("-")[0]) + parseInt(duration.split("-")[1]);
        const avgDurationMinutes = avgDuration / 2;
        
        let caloriesPerMinute = 0;
        if (workoutType === "cardio") {
          caloriesPerMinute = fitnessLevel === "beginner" ? 6 : fitnessLevel === "intermediate" ? 8 : 10;
        } else if (workoutType === "strength") {
          caloriesPerMinute = fitnessLevel === "beginner" ? 5 : fitnessLevel === "intermediate" ? 7 : 9;  
        } else if (workoutType === "flexibility") {
          caloriesPerMinute = fitnessLevel === "beginner" ? 3 : fitnessLevel === "intermediate" ? 4 : 5;
        }
        
        const workoutCalories = Math.round(avgDurationMinutes * caloriesPerMinute);
        totalCalories += workoutType !== "rest" ? workoutCalories : 0;
        totalMinutes += workoutType !== "rest" ? avgDurationMinutes : 0;
        
        workouts.push({
          day: dayNames[i],
          workout: workoutType === "rest" ? "Rest Day" : `${workoutType.charAt(0).toUpperCase() + workoutType.slice(1)}`,
          exercises: exercises,
          duration: workoutType === "rest" ? "Rest" : `${duration} min`,
          intensity: intensity
        });
      } else {
        workouts.push({
          day: dayNames[i],
          workout: "Rest Day",
          exercises: ["Rest and recovery"],
          duration: "Rest",
          intensity: "Low"
        });
      }
    }

    // Set the complete workout plan
    setWorkoutPlan({
      days: workouts,
      totalCalories: totalCalories,
      weeklyDuration: `${totalMinutes} min`
    });
  };

  const downloadResults = () => {
    if (!workoutPlan) return;

    const results = {
      title: "Workout Planner",
      results: {
        "Fitness Level": getFitnessLevelLabel(fitnessLevel),
        "Goal": getGoalLabel(goal),
        "Frequency": `${frequency} days per week`,
        "Weekly Duration": workoutPlan.weeklyDuration,
        "Estimated Weekly Calories Burned": `${workoutPlan.totalCalories} calories`,
        ...(userName ? {"Name": userName} : {}),
        ...(age ? {"Age": age} : {}),
        "Gender": gender,
      },
      workoutPlan: workoutPlan.days.map(day => ({
        "Day": day.day,
        "Workout": day.workout,
        "Exercises": day.exercises.join(", "),
        "Duration": day.duration,
        "Intensity": day.intensity
      })),
      date: new Date().toLocaleDateString(),
      unitSystem,
    };

    downloadResultsAsCSV(results, "Workout-Planner");
    showSuccessToast("Workout plan downloaded successfully!");
  };

  const copyResults = () => {
    if (!workoutPlan) return;

    const results = {
      title: "Workout Planner",
      results: {
        "Fitness Level": getFitnessLevelLabel(fitnessLevel),
        "Goal": getGoalLabel(goal),
        "Frequency": `${frequency} days per week`,
        "Weekly Duration": workoutPlan.weeklyDuration,
        "Estimated Weekly Calories Burned": `${workoutPlan.totalCalories} calories`,
        ...(userName ? {"Name": userName} : {}),
        ...(age ? {"Age": age} : {}),
        "Gender": gender,
      },
      workoutPlan: workoutPlan.days.map(day => ({
        "Day": day.day,
        "Workout": day.workout,
        "Exercises": day.exercises.join(", "),
        "Duration": day.duration,
        "Intensity": day.intensity
      })),
      date: new Date().toLocaleDateString(),
    };

    copyResultsToClipboard(results);
    setCopied(true);
    showSuccessToast("Workout plan copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Workout Planner</h2>
      <p className="text-gray-600 mb-4 text-center">
        Generate a personalized workout plan based on your goals and experience
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
          <Label htmlFor="age">Age (optional)</Label>
          <Input
            id="age"
            type="number"
            placeholder="e.g., 35"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup
            value={gender}
            onValueChange={(value) => setGender(value as "male" | "female")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male-workout" />
              <Label htmlFor="male-workout">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female-workout" />
              <Label htmlFor="female-workout">Female</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fitnessLevel">Fitness Level</Label>
          <Select
            value={fitnessLevel}
            onValueChange={setFitnessLevel}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your fitness level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">{getFitnessLevelLabel("beginner")}</SelectItem>
              <SelectItem value="intermediate">{getFitnessLevelLabel("intermediate")}</SelectItem>
              <SelectItem value="advanced">{getFitnessLevelLabel("advanced")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal">Primary Goal</Label>
          <Select
            value={goal}
            onValueChange={setGoal}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your primary goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">{getGoalLabel("general")}</SelectItem>
              <SelectItem value="weightloss">{getGoalLabel("weightloss")}</SelectItem>
              <SelectItem value="muscle">{getGoalLabel("muscle")}</SelectItem>
              <SelectItem value="strength">{getGoalLabel("strength")}</SelectItem>
              <SelectItem value="endurance">{getGoalLabel("endurance")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency">Weekly Workout Frequency</Label>
          <Select
            value={frequency}
            onValueChange={setFrequency}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 days per week</SelectItem>
              <SelectItem value="4">4 days per week</SelectItem>
              <SelectItem value="5">5 days per week</SelectItem>
              <SelectItem value="6">6 days per week</SelectItem>
              <SelectItem value="7">7 days per week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={generateWorkoutPlan} className="w-full mb-6">
        Generate Workout Plan
      </Button>

      {workoutPlan && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Your Personalized Workout Plan</h3>
            <p className="text-sm mt-1">
              {`${getGoalLabel(goal)} plan for ${getFitnessLevelLabel(fitnessLevel)} level`}
            </p>
            {userName && <p className="text-sm">Created for: {userName}</p>}
          </div>

          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-wellness-softPurple p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Weekly Duration</p>
                <p className="font-bold text-lg">{workoutPlan.weeklyDuration}</p>
              </div>
              <div className="bg-wellness-softGreen p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Est. Calories Burned</p>
                <p className="font-bold text-lg">{workoutPlan.totalCalories}</p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Weekly Schedule:</h4>
              <div className="space-y-2">
                {workoutPlan.days.map((day, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-md ${
                      day.workout === "Rest Day" 
                        ? "bg-gray-100" 
                        : day.workout === "Cardio" 
                        ? "bg-blue-50" 
                        : day.workout === "Strength" 
                        ? "bg-green-50" 
                        : "bg-purple-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{day.day}</div>
                      <div className="text-sm">{day.workout}</div>
                    </div>
                    
                    {day.workout !== "Rest Day" && (
                      <>
                        <div className="text-xs mt-1">
                          <span className="font-medium">Exercises:</span> {day.exercises.join(", ")}
                        </div>
                        <div className="flex justify-between mt-1 text-xs">
                          <div>Duration: {day.duration}</div>
                          <div>Intensity: {day.intensity}</div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">
                This is a general plan. Adjust based on your specific needs and limitations.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={copyResults} className="flex items-center">
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? "Copied!" : "Copy Plan"}
                </Button>
                <Button variant="outline" size="sm" onClick={downloadResults}>
                  Download CSV
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-wellness-purple">
            <p>Thank you for using Survive<span className="lowercase">w</span>ellness!</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default WorkoutPlannerCalculator;
