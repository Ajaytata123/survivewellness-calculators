
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { UnitSystem } from "@/types/calculatorTypes";
import { downloadResultsAsCSV, copyResultsToClipboard, createShareableLink } from "@/utils/downloadUtils";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { Check, Copy, Share } from "lucide-react";

interface WorkoutPlannerCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const WorkoutPlannerCalculator: React.FC<WorkoutPlannerCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [userName, setUserName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [fitnessLevel, setFitnessLevel] = useState<string>("beginner");
  const [goal, setGoal] = useState<string>("strength");
  const [daysPerWeek, setDaysPerWeek] = useState<number>(3);
  const [timePerWorkout, setTimePerWorkout] = useState<number>(30);
  const [copied, setCopied] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<Array<{
    day: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      restTime: string;
    }>;
  }> | null>(null);

  // Function to generate a workout plan based on user inputs
  const generateWorkoutPlan = () => {
    // Create exercise database for different goals
    const exercises = {
      strength: {
        beginner: {
          upper: [
            { name: "Push-ups", sets: 3, reps: "8-10", restTime: "60 sec" },
            { name: "Dumbbell Rows", sets: 3, reps: "10-12", restTime: "60 sec" },
            { name: "Shoulder Press", sets: 2, reps: "8-10", restTime: "60 sec" },
            { name: "Bicep Curls", sets: 2, reps: "10-12", restTime: "45 sec" }
          ],
          lower: [
            { name: "Bodyweight Squats", sets: 3, reps: "12-15", restTime: "60 sec" },
            { name: "Walking Lunges", sets: 2, reps: "10 each leg", restTime: "60 sec" },
            { name: "Glute Bridges", sets: 3, reps: "12-15", restTime: "45 sec" },
            { name: "Calf Raises", sets: 3, reps: "15-20", restTime: "45 sec" }
          ],
          core: [
            { name: "Plank", sets: 3, reps: "20-30 sec", restTime: "45 sec" },
            { name: "Crunches", sets: 3, reps: "12-15", restTime: "45 sec" },
            { name: "Russian Twists", sets: 2, reps: "10 each side", restTime: "45 sec" }
          ],
          cardio: [
            { name: "Brisk Walking", sets: 1, reps: "15-20 min", restTime: "N/A" },
            { name: "Stationary Bike", sets: 1, reps: "10-15 min", restTime: "N/A" },
            { name: "Elliptical", sets: 1, reps: "10-15 min", restTime: "N/A" }
          ]
        },
        intermediate: {
          upper: [
            { name: "Bench Press", sets: 4, reps: "8-10", restTime: "90 sec" },
            { name: "Bent Over Rows", sets: 4, reps: "8-10", restTime: "90 sec" },
            { name: "Overhead Press", sets: 3, reps: "8-10", restTime: "90 sec" },
            { name: "Pull-ups/Lat Pulldowns", sets: 3, reps: "8-10", restTime: "90 sec" },
            { name: "Tricep Dips", sets: 3, reps: "10-12", restTime: "60 sec" }
          ],
          lower: [
            { name: "Barbell Squats", sets: 4, reps: "8-10", restTime: "120 sec" },
            { name: "Deadlifts", sets: 4, reps: "6-8", restTime: "120 sec" },
            { name: "Walking Lunges", sets: 3, reps: "10 each leg", restTime: "90 sec" },
            { name: "Leg Press", sets: 3, reps: "10-12", restTime: "90 sec" }
          ],
          core: [
            { name: "Plank", sets: 3, reps: "45-60 sec", restTime: "60 sec" },
            { name: "Hanging Leg Raises", sets: 3, reps: "10-12", restTime: "60 sec" },
            { name: "Cable Rotations", sets: 3, reps: "12 each side", restTime: "60 sec" }
          ],
          cardio: [
            { name: "HIIT Training", sets: 1, reps: "15-20 min", restTime: "N/A" },
            { name: "Rowing Machine", sets: 1, reps: "15-20 min", restTime: "N/A" },
            { name: "Stair Climber", sets: 1, reps: "10-15 min", restTime: "N/A" }
          ]
        },
        advanced: {
          upper: [
            { name: "Barbell Bench Press", sets: 5, reps: "5-8", restTime: "120 sec" },
            { name: "Weighted Pull-ups", sets: 4, reps: "6-8", restTime: "120 sec" },
            { name: "Military Press", sets: 4, reps: "6-8", restTime: "120 sec" },
            { name: "T-Bar Rows", sets: 4, reps: "8-10", restTime: "90 sec" },
            { name: "Weighted Dips", sets: 3, reps: "8-10", restTime: "90 sec" },
            { name: "Preacher Curls", sets: 3, reps: "8-10", restTime: "90 sec" }
          ],
          lower: [
            { name: "Back Squats", sets: 5, reps: "5-8", restTime: "180 sec" },
            { name: "Romanian Deadlifts", sets: 4, reps: "6-8", restTime: "180 sec" },
            { name: "Front Squats", sets: 3, reps: "8-10", restTime: "120 sec" },
            { name: "Bulgarian Split Squats", sets: 3, reps: "8 each leg", restTime: "120 sec" },
            { name: "Leg Extensions", sets: 3, reps: "10-12", restTime: "90 sec" }
          ],
          core: [
            { name: "Weighted Planks", sets: 3, reps: "60-90 sec", restTime: "60 sec" },
            { name: "Ab Rollouts", sets: 4, reps: "10-12", restTime: "60 sec" },
            { name: "Hanging Windshield Wipers", sets: 3, reps: "8-10 each side", restTime: "60 sec" },
            { name: "Cable Crunches", sets: 3, reps: "12-15", restTime: "60 sec" }
          ],
          cardio: [
            { name: "Sprint Intervals", sets: 1, reps: "20-30 min", restTime: "N/A" },
            { name: "Assault Bike", sets: 1, reps: "15-20 min", restTime: "N/A" },
            { name: "Prowler Push", sets: 5, reps: "30 sec", restTime: "90 sec" }
          ]
        }
      },
      cardio: {
        beginner: {
          cardio: [
            { name: "Brisk Walking", sets: 1, reps: "20-30 min", restTime: "N/A" },
            { name: "Stationary Bike (Low Intensity)", sets: 1, reps: "15-20 min", restTime: "N/A" },
            { name: "Swimming (Leisure)", sets: 1, reps: "15-20 min", restTime: "N/A" },
            { name: "Elliptical (Low Intensity)", sets: 1, reps: "15-20 min", restTime: "N/A" }
          ],
          core: [
            { name: "Plank", sets: 2, reps: "20-30 sec", restTime: "45 sec" },
            { name: "Crunches", sets: 2, reps: "10-12", restTime: "45 sec" }
          ]
        },
        intermediate: {
          cardio: [
            { name: "Jogging", sets: 1, reps: "20-30 min", restTime: "N/A" },
            { name: "Cycling", sets: 1, reps: "25-35 min", restTime: "N/A" },
            { name: "Swimming (Moderate)", sets: 1, reps: "20-30 min", restTime: "N/A" },
            { name: "Elliptical Intervals", sets: 1, reps: "20-25 min", restTime: "N/A" },
            { name: "Stair Climber", sets: 1, reps: "15-20 min", restTime: "N/A" }
          ],
          core: [
            { name: "Plank", sets: 3, reps: "30-45 sec", restTime: "60 sec" },
            { name: "Mountain Climbers", sets: 3, reps: "15-20 each leg", restTime: "60 sec" },
            { name: "Russian Twists", sets: 3, reps: "15 each side", restTime: "60 sec" }
          ]
        },
        advanced: {
          cardio: [
            { name: "Running (Intervals)", sets: 10, reps: "30 sec sprint/90 sec jog", restTime: "N/A" },
            { name: "Cycling (High Intensity)", sets: 1, reps: "30-45 min", restTime: "N/A" },
            { name: "Swimming (Laps)", sets: 1, reps: "30-45 min", restTime: "N/A" },
            { name: "Rowing Machine", sets: 1, reps: "25-30 min", restTime: "N/A" },
            { name: "HIIT Circuit", sets: 5, reps: "4 min work/1 min rest", restTime: "60 sec between sets" }
          ],
          core: [
            { name: "Plank Variations", sets: 4, reps: "45-60 sec", restTime: "60 sec" },
            { name: "Hanging Leg Raises", sets: 4, reps: "12-15", restTime: "60 sec" },
            { name: "Ab Wheel Rollouts", sets: 3, reps: "10-12", restTime: "60 sec" }
          ]
        }
      },
      weightLoss: {
        beginner: {
          cardio: [
            { name: "Brisk Walking", sets: 1, reps: "30 min", restTime: "N/A" },
            { name: "Stationary Bike", sets: 1, reps: "20 min", restTime: "N/A" },
            { name: "Elliptical", sets: 1, reps: "20 min", restTime: "N/A" }
          ],
          circuit: [
            { name: "Bodyweight Squats", sets: 3, reps: "12-15", restTime: "30 sec" },
            { name: "Push-ups (Modified if needed)", sets: 3, reps: "8-10", restTime: "30 sec" },
            { name: "Glute Bridges", sets: 3, reps: "12-15", restTime: "30 sec" },
            { name: "Plank", sets: 3, reps: "20-30 sec", restTime: "30 sec" }
          ]
        },
        intermediate: {
          cardio: [
            { name: "Jogging/Running", sets: 1, reps: "25 min", restTime: "N/A" },
            { name: "HIIT (30:30)", sets: 10, reps: "30 sec work/30 sec rest", restTime: "2 min between rounds" },
            { name: "Rowing Machine", sets: 1, reps: "20 min", restTime: "N/A" }
          ],
          circuit: [
            { name: "Dumbbell Squats", sets: 3, reps: "12-15", restTime: "30 sec" },
            { name: "Push-ups", sets: 3, reps: "10-12", restTime: "30 sec" },
            { name: "Dumbbell Rows", sets: 3, reps: "12 each arm", restTime: "30 sec" },
            { name: "Lunges", sets: 3, reps: "10 each leg", restTime: "30 sec" },
            { name: "Mountain Climbers", sets: 3, reps: "20 total", restTime: "30 sec" }
          ]
        },
        advanced: {
          cardio: [
            { name: "HIIT Sprint Intervals", sets: 8, reps: "30 sec sprint/90 sec rest", restTime: "3 min between rounds" },
            { name: "Circuit Training", sets: 4, reps: "5 min", restTime: "1 min" },
            { name: "Stair Sprints", sets: 10, reps: "20 sec max effort/40 sec rest", restTime: "2 min between rounds" }
          ],
          circuit: [
            { name: "Burpees", sets: 4, reps: "12-15", restTime: "30 sec" },
            { name: "Kettlebell Swings", sets: 4, reps: "15-20", restTime: "30 sec" },
            { name: "Push Press", sets: 4, reps: "12-15", restTime: "30 sec" },
            { name: "Renegade Rows", sets: 4, reps: "10 each arm", restTime: "30 sec" },
            { name: "Jump Squats", sets: 4, reps: "15", restTime: "30 sec" },
            { name: "Battle Ropes", sets: 4, reps: "30 sec", restTime: "30 sec" }
          ]
        }
      },
      flexibility: {
        beginner: {
          warmup: [
            { name: "Light Cardio (Walking/Jogging)", sets: 1, reps: "5 min", restTime: "N/A" },
            { name: "Arm Circles", sets: 2, reps: "10 each direction", restTime: "N/A" },
            { name: "Trunk Rotations", sets: 2, reps: "10 each side", restTime: "N/A" }
          ],
          stretch: [
            { name: "Standing Hamstring Stretch", sets: 2, reps: "30 sec hold each leg", restTime: "15 sec" },
            { name: "Chest Stretch", sets: 2, reps: "30 sec hold", restTime: "15 sec" },
            { name: "Shoulder Stretch", sets: 2, reps: "30 sec hold each arm", restTime: "15 sec" },
            { name: "Quad Stretch", sets: 2, reps: "30 sec hold each leg", restTime: "15 sec" },
            { name: "Cat-Cow Stretch", sets: 1, reps: "10 reps", restTime: "N/A" },
            { name: "Child's Pose", sets: 1, reps: "60 sec hold", restTime: "N/A" }
          ]
        },
        intermediate: {
          warmup: [
            { name: "Dynamic Stretching", sets: 1, reps: "8-10 min", restTime: "N/A" },
            { name: "Sun Salutation", sets: 3, reps: "1 flow", restTime: "30 sec" }
          ],
          stretch: [
            { name: "Forward Fold", sets: 3, reps: "45 sec hold", restTime: "15 sec" },
            { name: "Pigeon Pose", sets: 3, reps: "45 sec hold each side", restTime: "15 sec" },
            { name: "Lizard Pose", sets: 3, reps: "45 sec hold each side", restTime: "15 sec" },
            { name: "Butterfly Stretch", sets: 3, reps: "45 sec hold", restTime: "15 sec" },
            { name: "Cobra to Downward Dog Flow", sets: 3, reps: "5 reps", restTime: "30 sec" }
          ]
        },
        advanced: {
          warmup: [
            { name: "Dynamic Yoga Flow", sets: 1, reps: "10 min", restTime: "N/A" },
            { name: "Joint Mobility Routine", sets: 1, reps: "5 min", restTime: "N/A" }
          ],
          stretch: [
            { name: "Split Training", sets: 4, reps: "60 sec hold each leg", restTime: "30 sec" },
            { name: "Advanced Hamstring Stretch", sets: 4, reps: "60 sec hold each leg", restTime: "30 sec" },
            { name: "Shoulder Opener", sets: 4, reps: "60 sec hold", restTime: "30 sec" },
            { name: "Advanced Hip Opener", sets: 4, reps: "60 sec hold each side", restTime: "30 sec" },
            { name: "Bridge Pose to Wheel Pose", sets: 3, reps: "3 reps with 30 sec hold", restTime: "60 sec" }
          ]
        }
      }
    };

    // Determine workout structure based on days per week
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let plan: Array<{day: string; exercises: Array<{name: string; sets: number; reps: string; restTime: string}>}> = [];
    
    // Calculate total workout minutes per week
    const weeklyMinutes = daysPerWeek * timePerWorkout;
    
    // Create workout based on goal and fitness level
    if (goal === "strength") {
      // Select appropriate exercises based on fitness level
      const levelExercises = exercises.strength[fitnessLevel as keyof typeof exercises.strength];
      
      // Create a split routine based on days per week
      if (daysPerWeek <= 3) {
        // Full body routine for 2-3 days per week
        for (let i = 0; i < daysPerWeek; i++) {
          let dayExercises: Array<{name: string; sets: number; reps: string; restTime: string}> = [];
          // Add 2-3 upper body exercises
          dayExercises = dayExercises.concat(levelExercises.upper.slice(0, 3));
          // Add 2 lower body exercises
          dayExercises = dayExercises.concat(levelExercises.lower.slice(0, 2));
          // Add 1 core exercise
          dayExercises = dayExercises.concat(levelExercises.core.slice(0, 1));
          
          plan.push({
            day: days[i],
            exercises: dayExercises
          });
        }
      } else if (daysPerWeek <= 5) {
        // Push/Pull/Legs split
        const routines = [
          { name: "Push (Chest/Shoulders/Triceps)", exercises: levelExercises.upper.filter(ex => 
            ex.name.includes("Press") || ex.name.includes("Push") || ex.name.includes("Dips")) },
          { name: "Pull (Back/Biceps)", exercises: levelExercises.upper.filter(ex => 
            ex.name.includes("Row") || ex.name.includes("Pull") || ex.name.includes("Curl")) },
          { name: "Legs & Core", exercises: [...levelExercises.lower.slice(0, 3), ...levelExercises.core.slice(0, 2)] },
          { name: "Push (Chest/Shoulders/Triceps)", exercises: levelExercises.upper.filter(ex => 
            ex.name.includes("Press") || ex.name.includes("Push") || ex.name.includes("Dips")) },
          { name: "Pull (Back/Biceps)", exercises: levelExercises.upper.filter(ex => 
            ex.name.includes("Row") || ex.name.includes("Pull") || ex.name.includes("Curl")) }
        ];
        
        for (let i = 0; i < daysPerWeek; i++) {
          plan.push({
            day: days[i],
            exercises: routines[i % routines.length].exercises
          });
        }
      } else {
        // 6-day Push/Pull/Legs split repeated
        const routines = [
          { name: "Push (Chest/Shoulders/Triceps)", exercises: levelExercises.upper.filter(ex => 
            ex.name.includes("Press") || ex.name.includes("Push") || ex.name.includes("Dips")) },
          { name: "Pull (Back/Biceps)", exercises: levelExercises.upper.filter(ex => 
            ex.name.includes("Row") || ex.name.includes("Pull") || ex.name.includes("Curl")) },
          { name: "Legs & Core", exercises: [...levelExercises.lower.slice(0, 3), ...levelExercises.core.slice(0, 2)] },
          { name: "Push (Chest/Shoulders/Triceps)", exercises: levelExercises.upper.filter(ex => 
            ex.name.includes("Press") || ex.name.includes("Push") || ex.name.includes("Dips")).reverse() },
          { name: "Pull (Back/Biceps)", exercises: levelExercises.upper.filter(ex => 
            ex.name.includes("Row") || ex.name.includes("Pull") || ex.name.includes("Curl")).reverse() },
          { name: "Legs & Core", exercises: [...levelExercises.lower.slice(2), ...levelExercises.core.slice(0, 2)] }
        ];
        
        for (let i = 0; i < daysPerWeek; i++) {
          plan.push({
            day: days[i],
            exercises: routines[i % routines.length].exercises
          });
        }
      }
    } else if (goal === "cardio") {
      // Select appropriate exercises based on fitness level
      const levelExercises = exercises.cardio[fitnessLevel as keyof typeof exercises.cardio];
      
      // Create cardio-focused routine
      for (let i = 0; i < daysPerWeek; i++) {
        let dayExercises: Array<{name: string; sets: number; reps: string; restTime: string}> = [];
        
        // Alternate between different cardio exercises
        const cardioIndex = i % levelExercises.cardio.length;
        dayExercises.push(levelExercises.cardio[cardioIndex]);
        
        // Add core exercises every other day
        if (i % 2 === 0) {
          dayExercises = dayExercises.concat(levelExercises.core.slice(0, 2));
        }
        
        plan.push({
          day: days[i],
          exercises: dayExercises
        });
      }
    } else if (goal === "weightLoss") {
      // Select appropriate exercises based on fitness level
      const levelExercises = exercises.weightLoss[fitnessLevel as keyof typeof exercises.weightLoss];
      
      for (let i = 0; i < daysPerWeek; i++) {
        let dayExercises: Array<{name: string; sets: number; reps: string; restTime: string}> = [];
        
        // Alternate between cardio-focused and circuit-focused days
        if (i % 2 === 0) {
          // Cardio day
          const cardioIndex = (Math.floor(i / 2)) % levelExercises.cardio.length;
          dayExercises.push(levelExercises.cardio[cardioIndex]);
          // Add 2 circuit exercises for some resistance training
          dayExercises = dayExercises.concat(levelExercises.circuit.slice(0, 2));
        } else {
          // Circuit day
          dayExercises = dayExercises.concat(levelExercises.circuit);
          // Add short cardio at the end
          dayExercises.push({
            name: "Cardio Cooldown (Your Choice)",
            sets: 1, 
            reps: "10 min",
            restTime: "N/A"
          });
        }
        
        plan.push({
          day: days[i],
          exercises: dayExercises
        });
      }
    } else if (goal === "flexibility") {
      // Select appropriate exercises based on fitness level
      const levelExercises = exercises.flexibility[fitnessLevel as keyof typeof exercises.flexibility];
      
      for (let i = 0; i < daysPerWeek; i++) {
        let dayExercises: Array<{name: string; sets: number; reps: string; restTime: string}> = [];
        
        // Always start with warmup
        dayExercises = dayExercises.concat(levelExercises.warmup);
        
        // Add stretching routine
        if (i % 3 === 0) {
          // Focus on upper body stretches
          dayExercises = dayExercises.concat(
            levelExercises.stretch.filter(ex => 
              ex.name.includes("Shoulder") || 
              ex.name.includes("Chest") || 
              ex.name.includes("Arm") ||
              ex.name.includes("Upper"))
          );
        } else if (i % 3 === 1) {
          // Focus on lower body stretches
          dayExercises = dayExercises.concat(
            levelExercises.stretch.filter(ex => 
              ex.name.includes("Hamstring") || 
              ex.name.includes("Split") || 
              ex.name.includes("Leg") ||
              ex.name.includes("Quad"))
          );
        } else {
          // Full body flexibility
          dayExercises = dayExercises.concat(levelExercises.stretch);
        }
        
        plan.push({
          day: days[i],
          exercises: dayExercises
        });
      }
    }
    
    // Set the workout plan
    setWorkoutPlan(plan);
  };

  // Function to estimate calories burned per week based on workout plan
  const estimateCaloriesBurned = (): string => {
    if (!workoutPlan) return "0";
    
    // Base calories burned per minute of workout based on goal and fitness level
    let caloriesPerMinute = 5; // Default baseline
    
    // Adjust based on goal
    switch (goal) {
      case "strength":
        caloriesPerMinute = 7;
        break;
      case "cardio":
        caloriesPerMinute = 10;
        break;
      case "weightLoss":
        caloriesPerMinute = 9;
        break;
      case "flexibility":
        caloriesPerMinute = 4;
        break;
    }
    
    // Adjust based on fitness level
    switch (fitnessLevel) {
      case "beginner":
        caloriesPerMinute *= 0.8;
        break;
      case "intermediate":
        // No adjustment
        break;
      case "advanced":
        caloriesPerMinute *= 1.2;
        break;
    }
    
    // Calculate total weekly calories
    const weeklyCalories = Math.round(daysPerWeek * timePerWorkout * caloriesPerMinute);
    return weeklyCalories.toString();
  };

  const getFitnessLevelLabel = (level: string): string => {
    switch (level) {
      case "beginner": return "Beginner";
      case "intermediate": return "Intermediate";
      case "advanced": return "Advanced";
      default: return "Beginner";
    }
  };

  const getGoalLabel = (goalValue: string): string => {
    switch (goalValue) {
      case "strength": return "Strength & Muscle";
      case "cardio": return "Cardiovascular Fitness";
      case "weightLoss": return "Weight Loss";
      case "flexibility": return "Flexibility & Mobility";
      default: return "Strength & Muscle";
    }
  };

  const downloadResults = () => {
    if (!workoutPlan) return;

    const results = {
      title: "Workout Planner",
      results: {
        "Gender": gender,
        ...(age ? {"Age": age} : {}),
        ...(userName ? {"Name": userName} : {}),
        "Fitness Level": getFitnessLevelLabel(fitnessLevel),
        "Goal": getGoalLabel(goal),
        "Frequency": `${daysPerWeek} days per week`,
        "Weekly Duration": `${daysPerWeek * timePerWorkout} minutes`,
        "Estimated Weekly Calories Burned": `${estimateCaloriesBurned()} calories`
      },
      workoutPlan: workoutPlan,
      date: new Date().toLocaleDateString(),
      unitSystem: unitSystem
    };

    downloadResultsAsCSV(results, "Workout-Planner");
    showSuccessToast("Workout plan downloaded successfully!");
  };

  const copyResults = () => {
    if (!workoutPlan) return;

    const results = {
      title: "Workout Planner",
      results: {
        "Gender": gender,
        ...(age ? {"Age": age} : {}),
        ...(userName ? {"Name": userName} : {}),
        "Fitness Level": getFitnessLevelLabel(fitnessLevel),
        "Goal": getGoalLabel(goal),
        "Frequency": `${daysPerWeek} days per week`,
        "Weekly Duration": `${daysPerWeek * timePerWorkout} minutes`,
        "Estimated Weekly Calories Burned": `${estimateCaloriesBurned()} calories`
      },
      workoutPlan: workoutPlan,
      date: new Date().toLocaleDateString(),
      unitSystem: unitSystem
    };

    copyResultsToClipboard(results);
    setCopied(true);
    showSuccessToast("Workout plan copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = () => {
    if (!workoutPlan) return;
    
    const params = {
      gender,
      age: age || "",
      name: userName || "",
      fitnessLevel,
      goal,
      daysPerWeek: daysPerWeek.toString(),
      timePerWorkout: timePerWorkout.toString()
    };
    
    const link = createShareableLink("workout", params);
    navigator.clipboard.writeText(link);
    showSuccessToast("Shareable link copied to clipboard!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Workout Planner</h2>
      <p className="text-gray-600 mb-4 text-center">
        Create a personalized workout plan based on your goals and preferences
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
            placeholder="e.g., 30"
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
          <Select value={fitnessLevel} onValueChange={setFitnessLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select your fitness level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal">Primary Goal</Label>
          <Select value={goal} onValueChange={setGoal}>
            <SelectTrigger>
              <SelectValue placeholder="Select your primary goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="strength">Strength & Muscle</SelectItem>
              <SelectItem value="cardio">Cardiovascular Fitness</SelectItem>
              <SelectItem value="weightLoss">Weight Loss</SelectItem>
              <SelectItem value="flexibility">Flexibility & Mobility</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="daysPerWeek">Days Per Week</Label>
            <span className="text-sm font-medium">{daysPerWeek}</span>
          </div>
          <Slider
            id="daysPerWeek"
            min={2}
            max={7}
            step={1}
            value={[daysPerWeek]}
            onValueChange={(value) => setDaysPerWeek(value[0])}
            className="py-4"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="timePerWorkout">Minutes Per Workout</Label>
            <span className="text-sm font-medium">{timePerWorkout}</span>
          </div>
          <Slider
            id="timePerWorkout"
            min={15}
            max={90}
            step={5}
            value={[timePerWorkout]}
            onValueChange={(value) => setTimePerWorkout(value[0])}
            className="py-4"
          />
        </div>
      </div>

      <Button onClick={generateWorkoutPlan} className="w-full mb-6">
        Generate Workout Plan
      </Button>

      {workoutPlan && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Your Personalized Workout Plan</h3>
            <p className="text-wellness-blue font-medium mt-1">
              {getGoalLabel(goal)} • {getFitnessLevelLabel(fitnessLevel)} Level
            </p>
            {userName && <p className="text-sm mt-2">Plan for: {userName}</p>}
          </div>

          <div className="space-y-2 mb-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-wellness-softPurple p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Frequency</p>
                <p className="font-bold">{daysPerWeek} days/week</p>
              </div>
              <div className="bg-wellness-softBlue p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Duration</p>
                <p className="font-bold">{timePerWorkout} min/session</p>
              </div>
            </div>
            <div className="bg-wellness-softGreen p-3 rounded-md text-center">
              <p className="text-sm text-gray-700">Est. Weekly Calories Burned</p>
              <p className="font-bold">{estimateCaloriesBurned()} calories</p>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Weekly Schedule:</h4>
            <div className="space-y-4">
              {workoutPlan.map((day, index) => (
                <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                  <h5 className="font-medium border-b border-gray-200 pb-1 mb-2">{day.day}</h5>
                  <ul className="space-y-2">
                    {day.exercises.map((exercise, exIndex) => (
                      <li key={exIndex} className="text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">{exercise.name}</span>
                          <span>
                            {exercise.sets} × {exercise.reps}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Rest: {exercise.restTime}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={copyResults} className="flex items-center">
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied!" : "Copy Plan"}
              </Button>
              <Button variant="outline" size="sm" onClick={shareLink} className="flex items-center">
                <Share className="h-4 w-4 mr-1" />
                Share Link
              </Button>
              <Button variant="outline" size="sm" onClick={downloadResults}>
                Download CSV
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-wellness-purple">
            <p>
              This plan is a general guide. Always consult with a healthcare or fitness 
              professional before starting a new workout regimen.
            </p>
            <p className="mt-2">
              Thank you for using Survive<span className="lowercase">w</span>ellness!
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default WorkoutPlannerCalculator;
