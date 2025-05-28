import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UnitSystem } from "@/types/calculatorTypes";
import { downloadResultsAsCSV, copyResultsToClipboard, createShareableLink } from "@/utils/downloadUtils";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { Check, Copy, Share, Plus, Minus } from "lucide-react";
import IntroSection from "@/components/calculator/IntroSection";

interface CalorieTrackerCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
}

interface ActivityEntry {
  id: string;
  name: string;
  calories: number;
}

const CalorieTrackerCalculator: React.FC<CalorieTrackerCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>([]);
  const [newFood, setNewFood] = useState<{name: string, calories: string}>({name: "", calories: ""});
  const [newActivity, setNewActivity] = useState<{name: string, calories: string}>({name: "", calories: ""});
  const [dailyGoal, setDailyGoal] = useState<string>("2000");
  const [copied, setCopied] = useState(false);
  
  // Common food calorie presets
  const foodPresets = [
    { name: "Apple", calories: 95 },
    { name: "Banana", calories: 105 },
    { name: "Chicken Breast (3oz)", calories: 165 },
    { name: "Egg", calories: 70 },
    { name: "Greek Yogurt (1 cup)", calories: 130 },
    { name: "Rice (1 cup, cooked)", calories: 205 },
    { name: "Bread (1 slice)", calories: 80 },
    { name: "Butter (1 tbsp)", calories: 100 },
    { name: "Salmon (3oz)", calories: 175 },
    { name: "Avocado (half)", calories: 160 }
  ];
  
  // Common activity calorie presets
  const activityPresets = [
    { name: "Walking (30 min)", calories: 100 },
    { name: "Jogging (30 min)", calories: 300 },
    { name: "Cycling (30 min)", calories: 200 },
    { name: "Swimming (30 min)", calories: 250 },
    { name: "Weight Training (30 min)", calories: 150 },
    { name: "Yoga (30 min)", calories: 120 },
    { name: "Hiking (30 min)", calories: 180 },
    { name: "Dancing (30 min)", calories: 170 },
    { name: "Housework (30 min)", calories: 90 },
    { name: "Gardening (30 min)", calories: 135 }
  ];

  const addFoodEntry = () => {
    if (!newFood.name.trim() || !newFood.calories.trim()) {
      showErrorToast("Please enter both food name and calories");
      return;
    }
    
    const calories = parseInt(newFood.calories);
    if (isNaN(calories) || calories <= 0) {
      showErrorToast("Please enter valid calories");
      return;
    }
    
    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      name: newFood.name,
      calories: calories
    };
    
    setFoodEntries(prev => [...prev, newEntry]);
    setNewFood({name: "", calories: ""});
  };

  const addActivityEntry = () => {
    if (!newActivity.name.trim() || !newActivity.calories.trim()) {
      showErrorToast("Please enter both activity name and calories");
      return;
    }
    
    const calories = parseInt(newActivity.calories);
    if (isNaN(calories) || calories <= 0) {
      showErrorToast("Please enter valid calories");
      return;
    }
    
    const newEntry: ActivityEntry = {
      id: Date.now().toString(),
      name: newActivity.name,
      calories: calories
    };
    
    setActivityEntries(prev => [...prev, newEntry]);
    setNewActivity({name: "", calories: ""});
  };

  const removeFoodEntry = (id: string) => {
    setFoodEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const removeActivityEntry = (id: string) => {
    setActivityEntries(prev => prev.filter(entry => entry.id !== id));
  };
  
  const addFoodPreset = (preset: {name: string, calories: number}) => {
    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      name: preset.name,
      calories: preset.calories
    };
    
    setFoodEntries(prev => [...prev, newEntry]);
    showSuccessToast(`Added ${preset.name}`);
  };
  
  const addActivityPreset = (preset: {name: string, calories: number}) => {
    const newEntry: ActivityEntry = {
      id: Date.now().toString(),
      name: preset.name,
      calories: preset.calories
    };
    
    setActivityEntries(prev => [...prev, newEntry]);
    showSuccessToast(`Added ${preset.name}`);
  };

  const getTotalFoodCalories = (): number => {
    return foodEntries.reduce((total, entry) => total + entry.calories, 0);
  };

  const getTotalActivityCalories = (): number => {
    return activityEntries.reduce((total, entry) => total + entry.calories, 0);
  };

  const getNetCalories = (): number => {
    return getTotalFoodCalories() - getTotalActivityCalories();
  };
  
  const getCalorieStatus = (): string => {
    const netCalories = getNetCalories();
    const goal = parseInt(dailyGoal);
    
    if (isNaN(goal) || goal <= 0) return "Set a valid goal";
    
    const diff = netCalories - goal;
    
    if (Math.abs(diff) <= 50) return "On Target";
    if (diff < 0) return `${Math.abs(diff)} Under Goal`;
    return `${diff} Over Goal`;
  };
  
  const getCalorieStatusColor = (): string => {
    const netCalories = getNetCalories();
    const goal = parseInt(dailyGoal);
    
    if (isNaN(goal) || goal <= 0) return "text-gray-500";
    
    const diff = netCalories - goal;
    
    if (Math.abs(diff) <= 50) return "text-wellness-green";
    if (diff < 0) return "text-wellness-blue";
    return "text-wellness-red";
  };

  const downloadResults = () => {
    const results = {
      title: "Calorie Tracker",
      results: {
        "Daily Calorie Goal": dailyGoal,
        "Calories Consumed": getTotalFoodCalories().toString(),
        "Calories Burned": getTotalActivityCalories().toString(),
        "Net Calories": getNetCalories().toString(),
        "Status": getCalorieStatus()
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined,
    };

    downloadResultsAsCSV(results, "Calorie-Tracker");
    showSuccessToast("Results downloaded successfully!");
  };

  const copyResults = () => {
    const results = {
      title: "Calorie Tracker",
      results: {
        "Daily Calorie Goal": dailyGoal,
        "Calories Consumed": getTotalFoodCalories().toString(),
        "Calories Burned": getTotalActivityCalories().toString(),
        "Net Calories": getNetCalories().toString(),
        "Status": getCalorieStatus()
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined,
    };

    copyResultsToClipboard(results);
    setCopied(true);
    showSuccessToast("Results copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = () => {
    // Create a simplified version for sharing
    const params = {
      goal: dailyGoal,
      consumed: getTotalFoodCalories().toString(),
      burned: getTotalActivityCalories().toString(),
      name: userName || ""
    };
    
    const link = createShareableLink("calories", params);
    navigator.clipboard.writeText(link);
    showSuccessToast("Shareable link copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Calorie Tracker</h2>
        <p className="text-gray-600 mb-4 text-center">
          Track your daily food intake and activities to manage your calories
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
            <Label htmlFor="dailyGoal">Daily Calorie Goal</Label>
            <Input
              id="dailyGoal"
              type="number"
              placeholder="e.g., 2000"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Food Entries Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Food Consumed</h3>
            
            <div className="flex space-x-2 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Food name"
                  value={newFood.name}
                  onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                />
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  placeholder="Calories"
                  value={newFood.calories}
                  onChange={(e) => setNewFood({...newFood, calories: e.target.value})}
                />
              </div>
              <Button onClick={addFoodEntry} size="sm" className="px-3">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Common Foods:</p>
              <div className="flex flex-wrap gap-2">
                {foodPresets.slice(0, 5).map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => addFoodPreset(preset)}
                    className="text-xs bg-wellness-softBlue hover:bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-md p-2 h-[250px] overflow-y-auto space-y-2">
              {foodEntries.length === 0 ? (
                <p className="text-gray-500 text-sm text-center italic py-2">No food entries yet</p>
              ) : (
                foodEntries.map((entry) => (
                  <div key={entry.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{entry.name}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm">{entry.calories} cal</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0" 
                        onClick={() => removeFoodEntry(entry.id)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="bg-wellness-softPurple p-3 rounded-md text-center">
              <p className="text-sm text-gray-700">Total Calories Consumed</p>
              <p className="font-bold text-lg">{getTotalFoodCalories()}</p>
            </div>
          </div>

          {/* Activities Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Activities & Exercise</h3>
            
            <div className="flex space-x-2 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Activity name"
                  value={newActivity.name}
                  onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                />
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  placeholder="Calories"
                  value={newActivity.calories}
                  onChange={(e) => setNewActivity({...newActivity, calories: e.target.value})}
                />
              </div>
              <Button onClick={addActivityEntry} size="sm" className="px-3">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Common Activities:</p>
              <div className="flex flex-wrap gap-2">
                {activityPresets.slice(0, 5).map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => addActivityPreset(preset)}
                    className="text-xs bg-wellness-softGreen hover:bg-green-100 text-green-700 px-2 py-1 rounded"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-md p-2 h-[250px] overflow-y-auto space-y-2">
              {activityEntries.length === 0 ? (
                <p className="text-gray-500 text-sm text-center italic py-2">No activity entries yet</p>
              ) : (
                activityEntries.map((entry) => (
                  <div key={entry.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{entry.name}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm">{entry.calories} cal</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0" 
                        onClick={() => removeActivityEntry(entry.id)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="bg-wellness-softGreen p-3 rounded-md text-center">
              <p className="text-sm text-gray-700">Total Calories Burned</p>
              <p className="font-bold text-lg">{getTotalActivityCalories()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <div className="text-center">
            <h3 className="text-xl font-bold">Daily Summary</h3>
            {userName && <p className="text-sm mb-2">Tracking for: {userName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-wellness-softPurple p-3 rounded-md text-center">
              <p className="text-sm text-gray-700">Consumed</p>
              <p className="font-bold">{getTotalFoodCalories()} cal</p>
            </div>
            <div className="bg-wellness-softGreen p-3 rounded-md text-center">
              <p className="text-sm text-gray-700">Burned</p>
              <p className="font-bold">{getTotalActivityCalories()} cal</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="font-medium">Daily Goal:</p>
              <p>{dailyGoal} cal</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">Net Calories:</p>
              <p>{getNetCalories()} cal</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">Status:</p>
              <p className={`font-bold ${getCalorieStatusColor()}`}>{getCalorieStatus()}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={copyResults} className="flex items-center">
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied!" : "Copy Results"}
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
        </div>

        <div className="text-center text-sm text-wellness-purple">
          <p>
            Remember that calorie tracking is just one aspect of a healthy lifestyle.
          </p>
          <p className="mt-2">
            Thank you for using Survive<span className="lowercase">w</span>ellness!
          </p>
        </div>
      </Card>

      <IntroSection calculatorId="calories" title="" description="" />
    </div>
  );
};

export default CalorieTrackerCalculator;
