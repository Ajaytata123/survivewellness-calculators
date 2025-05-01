
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Download, Share } from "lucide-react";
import { downloadResultsAsCSV, copyResultsToClipboard, shareResults } from "@/utils/downloadUtils";
import { showSuccessToast } from "@/utils/notificationUtils";
import { calculateBMR, calculateCalorieNeeds } from "@/utils/calculationUtils";
import { MealPlannerCalcProps } from "@/types/calculatorTypes";

const MealPlannerCalculator: React.FC<MealPlannerCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("moderate");
  const [goal, setGoal] = useState<string>("maintain");
  const [mealCount, setMealCount] = useState<string>("3");
  const [dietType, setDietType] = useState<string>("balanced");
  const [mealPlanResult, setMealPlanResult] = useState<{
    dailyCalories: number;
    meals: {
      name: string;
      caloriePct: number;
      calorieAmount: number;
      proteinGrams: number;
      carbsGrams: number;
      fatGrams: number;
      recommendations: string[];
    }[];
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleUnitChange = (value: string) => {
    onUnitSystemChange(value as "imperial" | "metric");
    setWeight("");
    setHeight("");
  };

  const generateMealPlan = () => {
    if (!age || !weight || !height) {
      showSuccessToast("Please fill in all required fields");
      return;
    }

    const ageValue = parseInt(age);
    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);

    if (isNaN(ageValue) || isNaN(weightValue) || isNaN(heightValue)) {
      showSuccessToast("Please enter valid values");
      return;
    }

    const isMetric = unitSystem === "metric";
    
    // Calculate BMR
    const bmr = calculateBMR(weightValue, heightValue, ageValue, gender, isMetric);
    
    // Calculate daily calorie needs based on activity level
    let tdee = calculateCalorieNeeds(bmr, activityLevel);
    
    // Adjust based on goal
    let dailyCalories: number;
    let proteinMultiplier: number;
    let carbMultiplier: number;
    let fatMultiplier: number;
    
    switch (goal) {
      case "lose":
        dailyCalories = tdee * 0.8; // 20% deficit
        proteinMultiplier = 0.35; // Higher protein for weight loss
        carbMultiplier = 0.35;
        fatMultiplier = 0.3;
        break;
      case "maintain":
        dailyCalories = tdee;
        proteinMultiplier = 0.3;
        carbMultiplier = 0.4;
        fatMultiplier = 0.3;
        break;
      case "gain":
        dailyCalories = tdee * 1.1; // 10% surplus
        proteinMultiplier = 0.25;
        carbMultiplier = 0.45;
        fatMultiplier = 0.3;
        break;
      case "gainMuscle":
        dailyCalories = tdee * 1.15; // 15% surplus
        proteinMultiplier = 0.3;
        carbMultiplier = 0.45;
        fatMultiplier = 0.25;
        break;
      default:
        dailyCalories = tdee;
        proteinMultiplier = 0.3;
        carbMultiplier = 0.4;
        fatMultiplier = 0.3;
    }
    
    // Adjust based on diet type
    switch (dietType) {
      case "lowCarb":
        carbMultiplier = 0.2;
        fatMultiplier = 0.5;
        proteinMultiplier = 0.3;
        break;
      case "highProtein":
        proteinMultiplier = 0.4;
        carbMultiplier = 0.3;
        fatMultiplier = 0.3;
        break;
      case "keto":
        carbMultiplier = 0.05;
        fatMultiplier = 0.7;
        proteinMultiplier = 0.25;
        break;
      case "balanced":
      default:
        // Use default values set above
        break;
    }
    
    // Calculate meal distribution
    const meals = [];
    const mealCountValue = parseInt(mealCount);
    
    // Define meal names and distribution percentages
    let mealDistribution: {name: string, percent: number}[];
    
    switch (mealCountValue) {
      case 2:
        mealDistribution = [
          { name: "Breakfast", percent: 0.4 },
          { name: "Dinner", percent: 0.6 }
        ];
        break;
      case 3:
        mealDistribution = [
          { name: "Breakfast", percent: 0.3 },
          { name: "Lunch", percent: 0.35 },
          { name: "Dinner", percent: 0.35 }
        ];
        break;
      case 4:
        mealDistribution = [
          { name: "Breakfast", percent: 0.25 },
          { name: "Lunch", percent: 0.3 },
          { name: "Snack", percent: 0.15 },
          { name: "Dinner", percent: 0.3 }
        ];
        break;
      case 5:
        mealDistribution = [
          { name: "Breakfast", percent: 0.2 },
          { name: "Morning Snack", percent: 0.1 },
          { name: "Lunch", percent: 0.3 },
          { name: "Afternoon Snack", percent: 0.1 },
          { name: "Dinner", percent: 0.3 }
        ];
        break;
      case 6:
        mealDistribution = [
          { name: "Breakfast", percent: 0.2 },
          { name: "Morning Snack", percent: 0.1 },
          { name: "Lunch", percent: 0.25 },
          { name: "Afternoon Snack", percent: 0.1 },
          { name: "Dinner", percent: 0.25 },
          { name: "Evening Snack", percent: 0.1 }
        ];
        break;
      default:
        mealDistribution = [
          { name: "Breakfast", percent: 0.3 },
          { name: "Lunch", percent: 0.35 },
          { name: "Dinner", percent: 0.35 }
        ];
    }
    
    // Generate meal recommendations based on diet type
    const generateRecommendations = (mealName: string, dietType: string) => {
      const recommendations: string[] = [];
      
      // Base recommendations by meal type
      if (mealName.toLowerCase().includes("breakfast")) {
        switch (dietType) {
          case "lowCarb":
            recommendations.push("Eggs with avocado and vegetables");
            recommendations.push("Greek yogurt with nuts and berries");
            break;
          case "highProtein":
            recommendations.push("Protein smoothie with Greek yogurt and protein powder");
            recommendations.push("Egg white omelet with lean turkey");
            break;
          case "keto":
            recommendations.push("Bacon and eggs with avocado");
            recommendations.push("Keto coffee with butter and MCT oil");
            break;
          default:
            recommendations.push("Whole grain oatmeal with fruits and nuts");
            recommendations.push("Whole wheat toast with eggs and vegetables");
        }
      } else if (mealName.toLowerCase().includes("lunch")) {
        switch (dietType) {
          case "lowCarb":
            recommendations.push("Grilled chicken salad with olive oil dressing");
            recommendations.push("Lettuce wraps with tuna or chicken");
            break;
          case "highProtein":
            recommendations.push("Chicken breast with quinoa and vegetables");
            recommendations.push("Tuna salad with cottage cheese");
            break;
          case "keto":
            recommendations.push("Bunless burger with cheese and avocado");
            recommendations.push("Caesar salad with chicken (no croutons)");
            break;
          default:
            recommendations.push("Sandwich on whole grain bread with lean protein");
            recommendations.push("Grain bowl with vegetables and lean protein");
        }
      } else if (mealName.toLowerCase().includes("dinner")) {
        switch (dietType) {
          case "lowCarb":
            recommendations.push("Grilled fish with roasted vegetables");
            recommendations.push("Zucchini noodles with meat sauce");
            break;
          case "highProtein":
            recommendations.push("Lean steak with sweet potato and broccoli");
            recommendations.push("Salmon with quinoa and asparagus");
            break;
          case "keto":
            recommendations.push("Steak with butter and low-carb vegetables");
            recommendations.push("Baked salmon with cream sauce and spinach");
            break;
          default:
            recommendations.push("Baked fish or chicken with brown rice and vegetables");
            recommendations.push("Whole wheat pasta with lean protein and vegetables");
        }
      } else if (mealName.toLowerCase().includes("snack")) {
        switch (dietType) {
          case "lowCarb":
            recommendations.push("Celery sticks with almond butter");
            recommendations.push("Cheese and nuts");
            break;
          case "highProtein":
            recommendations.push("Protein shake or bar");
            recommendations.push("Greek yogurt with protein powder");
            break;
          case "keto":
            recommendations.push("Cheese crisps or pork rinds");
            recommendations.push("Avocado with salt and pepper");
            break;
          default:
            recommendations.push("Fruit with yogurt or nut butter");
            recommendations.push("Whole grain crackers with hummus");
        }
      }
      
      return recommendations;
    };
    
    // Calculate macros for each meal
    for (const meal of mealDistribution) {
      const mealCalories = dailyCalories * meal.percent;
      const mealProtein = (dailyCalories * proteinMultiplier * meal.percent) / 4; // 4 calories per gram of protein
      const mealCarbs = (dailyCalories * carbMultiplier * meal.percent) / 4; // 4 calories per gram of carbs
      const mealFat = (dailyCalories * fatMultiplier * meal.percent) / 9; // 9 calories per gram of fat
      
      meals.push({
        name: meal.name,
        caloriePct: meal.percent * 100,
        calorieAmount: Math.round(mealCalories),
        proteinGrams: Math.round(mealProtein),
        carbsGrams: Math.round(mealCarbs),
        fatGrams: Math.round(mealFat),
        recommendations: generateRecommendations(meal.name, dietType)
      });
    }
    
    setMealPlanResult({
      dailyCalories: Math.round(dailyCalories),
      meals
    });
  };

  const handleCopy = () => {
    if (!mealPlanResult) return;
    
    const mealsData: Record<string, string> = {};
    mealPlanResult.meals.forEach((meal, index) => {
      mealsData[`Meal ${index + 1}: ${meal.name}`] = 
        `${meal.calorieAmount} cal, P: ${meal.proteinGrams}g, C: ${meal.carbsGrams}g, F: ${meal.fatGrams}g`;
    });
    
    const results = {
      title: "Meal Planner",
      results: {
        "Daily Calories": mealPlanResult.dailyCalories.toString(),
        "Diet Type": dietType === "lowCarb" 
          ? "Low Carb" 
          : dietType === "highProtein" 
            ? "High Protein" 
            : dietType === "keto" 
              ? "Keto" 
              : "Balanced",
        "Goal": goal === "lose" 
          ? "Weight Loss" 
          : goal === "gain" 
            ? "Weight Gain" 
            : goal === "gainMuscle" 
              ? "Muscle Gain" 
              : "Maintenance",
        ...mealsData
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
    if (!mealPlanResult) return;
    
    const mealsData: Record<string, string> = {};
    mealPlanResult.meals.forEach((meal, index) => {
      mealsData[`Meal ${index + 1}: ${meal.name}`] = 
        `${meal.calorieAmount} cal, P: ${meal.proteinGrams}g, C: ${meal.carbsGrams}g, F: ${meal.fatGrams}g`;
    });
    
    const results = {
      title: "Meal Planner",
      results: {
        "Daily Calories": mealPlanResult.dailyCalories.toString(),
        "Diet Type": dietType === "lowCarb" 
          ? "Low Carb" 
          : dietType === "highProtein" 
            ? "High Protein" 
            : dietType === "keto" 
              ? "Keto" 
              : "Balanced",
        "Goal": goal === "lose" 
          ? "Weight Loss" 
          : goal === "gain" 
            ? "Weight Gain" 
            : goal === "gainMuscle" 
              ? "Muscle Gain" 
              : "Maintenance",
        ...mealsData
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    shareResults(results);
  };

  const handleDownload = () => {
    if (!mealPlanResult) return;
    
    const mealsData: Record<string, string> = {};
    mealPlanResult.meals.forEach((meal, index) => {
      mealsData[`Meal ${index + 1}: ${meal.name}`] = 
        `${meal.calorieAmount} cal, P: ${meal.proteinGrams}g, C: ${meal.carbsGrams}g, F: ${meal.fatGrams}g`;
    });
    
    const results = {
      title: "Meal Planner",
      results: {
        "Daily Calories": mealPlanResult.dailyCalories.toString(),
        "Diet Type": dietType === "lowCarb" 
          ? "Low Carb" 
          : dietType === "highProtein" 
            ? "High Protein" 
            : dietType === "keto" 
              ? "Keto" 
              : "Balanced",
        "Goal": goal === "lose" 
          ? "Weight Loss" 
          : goal === "gain" 
            ? "Weight Gain" 
            : goal === "gainMuscle" 
              ? "Muscle Gain" 
              : "Maintenance",
        ...mealsData
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    downloadResultsAsCSV(results, "Meal-Planner");
    showSuccessToast("Results downloaded successfully!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Meal Planner</h2>
      <p className="text-gray-600 mb-6 text-center">
        Create a personalized meal plan based on your nutritional needs
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
        
        <div className="space-y-2">
          <Label htmlFor="activityLevel">Activity Level</Label>
          <Select value={activityLevel} onValueChange={setActivityLevel}>
            <SelectTrigger id="activityLevel">
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
              <SelectItem value="light">Lightly Active (light exercise 1-3 days/week)</SelectItem>
              <SelectItem value="moderate">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
              <SelectItem value="active">Very Active (hard exercise 6-7 days/week)</SelectItem>
              <SelectItem value="veryActive">Extremely Active (very hard exercise, physical job)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="goal">Goal</Label>
          <Select value={goal} onValueChange={setGoal}>
            <SelectTrigger id="goal">
              <SelectValue placeholder="Select your goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lose">Weight Loss</SelectItem>
              <SelectItem value="maintain">Maintenance</SelectItem>
              <SelectItem value="gain">Weight Gain</SelectItem>
              <SelectItem value="gainMuscle">Muscle Gain</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mealCount">Meals Per Day</Label>
          <Select value={mealCount} onValueChange={setMealCount}>
            <SelectTrigger id="mealCount">
              <SelectValue placeholder="Select number of meals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 Meals</SelectItem>
              <SelectItem value="3">3 Meals</SelectItem>
              <SelectItem value="4">4 Meals (3 meals + snack)</SelectItem>
              <SelectItem value="5">5 Meals (3 meals + 2 snacks)</SelectItem>
              <SelectItem value="6">6 Meals (3 meals + 3 snacks)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dietType">Diet Type</Label>
          <Select value={dietType} onValueChange={setDietType}>
            <SelectTrigger id="dietType">
              <SelectValue placeholder="Select diet type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="balanced">Balanced</SelectItem>
              <SelectItem value="lowCarb">Low Carb</SelectItem>
              <SelectItem value="highProtein">High Protein</SelectItem>
              <SelectItem value="keto">Ketogenic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button onClick={generateMealPlan} className="w-full mb-6">
        Generate Meal Plan
      </Button>
      
      {mealPlanResult && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Your Personalized Meal Plan</h3>
            {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
            <div className="bg-wellness-green text-white py-2 px-4 rounded-md inline-block mt-2">
              <span className="font-bold">{mealPlanResult.dailyCalories}</span> calories per day
            </div>
          </div>
          
          <div className="space-y-4 mt-4">
            {mealPlanResult.meals.map((meal, index) => (
              <div key={index} className="bg-white p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-lg">{meal.name}</h4>
                  <span className="text-sm bg-wellness-softGreen py-1 px-2 rounded">
                    {meal.calorieAmount} cal ({meal.caloriePct.toFixed(0)}%)
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-wellness-softBlue p-2 rounded text-center">
                    <p className="text-xs text-gray-600">Protein</p>
                    <p className="font-bold">{meal.proteinGrams}g</p>
                  </div>
                  <div className="bg-wellness-softGreen p-2 rounded text-center">
                    <p className="text-xs text-gray-600">Carbs</p>
                    <p className="font-bold">{meal.carbsGrams}g</p>
                  </div>
                  <div className="bg-wellness-softOrange p-2 rounded text-center">
                    <p className="text-xs text-gray-600">Fat</p>
                    <p className="font-bold">{meal.fatGrams}g</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Suggestions:</p>
                  <ul className="text-sm list-disc pl-5">
                    {meal.recommendations.map((rec, recIndex) => (
                      <li key={recIndex}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
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
              This meal plan is based on your personal needs and the latest nutritional guidelines.
              Always consult with a dietitian for personalized advice.
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

export default MealPlannerCalculator;
