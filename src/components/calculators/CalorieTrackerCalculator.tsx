import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UnitSystem } from "@/types/calculatorTypes";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { Plus, Minus, Utensils, Activity } from "lucide-react";
import IntroSection from "@/components/calculator/IntroSection";
import ResultActions from "@/components/calculator/ResultActions";

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
  
  // Expanded US-based food calorie presets
  const foodPresets = [
    // Fruits
    { name: "Apple", calories: 95 },
    { name: "Banana", calories: 105 },
    { name: "Orange", calories: 85 },
    { name: "Grapes (1 cup)", calories: 104 },
    { name: "Strawberries (1 cup)", calories: 49 },
    { name: "Blueberries (1 cup)", calories: 84 },
    
    // Proteins
    { name: "Chicken Breast (3oz)", calories: 165 },
    { name: "Ground Beef (3oz)", calories: 230 },
    { name: "Salmon (3oz)", calories: 175 },
    { name: "Egg", calories: 70 },
    { name: "Turkey Sandwich", calories: 320 },
    { name: "Tuna (3oz)", calories: 150 },
    
    // Dairy
    { name: "Greek Yogurt (1 cup)", calories: 130 },
    { name: "Cheddar Cheese (1 slice)", calories: 113 },
    { name: "American Cheese (1 slice)", calories: 104 },
    { name: "Milk (1 cup)", calories: 149 },
    { name: "Cottage Cheese (1/2 cup)", calories: 110 },
    
    // Grains & Carbs
    { name: "Rice (1 cup, cooked)", calories: 205 },
    { name: "Bread (1 slice)", calories: 80 },
    { name: "Oatmeal (1 cup)", calories: 154 },
    { name: "Pasta (1 cup)", calories: 220 },
    { name: "Quinoa (1 cup)", calories: 222 },
    { name: "Bagel", calories: 289 },
    
    // Vegetables
    { name: "Broccoli (1 cup)", calories: 25 },
    { name: "Carrots (1 cup)", calories: 52 },
    { name: "Spinach (1 cup)", calories: 7 },
    { name: "Sweet Potato", calories: 112 },
    { name: "Bell Pepper (1 cup)", calories: 30 },
    { name: "Cucumber (1 cup)", calories: 16 },
    
    // Fast Food & American Classics
    { name: "Cheeseburger", calories: 535 },
    { name: "Big Mac", calories: 563 },
    { name: "Pizza Slice", calories: 285 },
    { name: "French Fries (medium)", calories: 365 },
    { name: "Hot Dog", calories: 290 },
    { name: "Burrito", calories: 450 },
    
    // Snacks & Others
    { name: "Avocado (half)", calories: 160 },
    { name: "Peanut Butter (2 tbsp)", calories: 188 },
    { name: "Almonds (1 oz)", calories: 164 },
    { name: "Granola Bar", calories: 140 },
    { name: "Potato Chips (1 oz)", calories: 152 },
    { name: "Cookie", calories: 142 }
  ];
  
  // Common activity calorie presets
  const activityPresets = [
    { name: "Walking (30 min)", calories: 100 },
    { name: "Jogging (30 min)", calories: 300 },
    { name: "Cycling (30 min)", calories: 200 },
    { name: "Swimming (30 min)", calories: 250 },
    { name: "Weight Training (30 min)", calories: 150 },
    { name: "Yoga (30 min)", calories: 120 },
    { name: "Dancing (30 min)", calories: 170 },
    { name: "Housework (30 min)", calories: 90 }
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
    showSuccessToast(`Added ${newFood.name}`);
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
    showSuccessToast(`Added ${newActivity.name}`);
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
    
    if (Math.abs(diff) <= 50) return "text-green-600";
    if (diff < 0) return "text-blue-600";
    return "text-red-600";
  };

  const prepareResults = () => {
    const results: Record<string, string | number> = {
      "Daily Calorie Goal": dailyGoal,
      "Calories Consumed": getTotalFoodCalories(),
      "Calories Burned": getTotalActivityCalories(),
      "Net Calories": getNetCalories(),
      "Status": getCalorieStatus()
    };

    foodEntries.forEach((entry, index) => {
      results[`Food ${index + 1}`] = `${entry.name} - ${entry.calories} cal`;
    });

    activityEntries.forEach((entry, index) => {
      results[`Activity ${index + 1}`] = `${entry.name} - ${entry.calories} cal`;
    });

    return results;
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">Calorie Tracker</CardTitle>
          <p className="text-green-100 text-center">
            Track your daily food intake and activities to manage your calories
          </p>
        </CardHeader>
        <CardContent className="p-6">
          {/* User Info Section */}
          <Card className="mb-6 border-green-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-700">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userName" className="text-green-700 font-medium">Your Name (optional)</Label>
                  <Input
                    id="userName"
                    type="text"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="border-green-200 focus:border-green-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dailyGoal" className="text-green-700 font-medium">Daily Calorie Goal</Label>
                  <Input
                    id="dailyGoal"
                    type="number"
                    placeholder="e.g., 2000"
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(e.target.value)}
                    className="border-green-200 focus:border-green-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Food Intake Section */}
            <Card className="border-orange-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-200">
                <CardTitle className="text-lg text-orange-700 flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Food Consumed
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {/* Add Food Form */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Food name"
                      value={newFood.name}
                      onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                      className="flex-1 border-orange-200 focus:border-orange-400"
                    />
                    <Input
                      type="number"
                      placeholder="Calories"
                      value={newFood.calories}
                      onChange={(e) => setNewFood({...newFood, calories: e.target.value})}
                      className="w-24 border-orange-200 focus:border-orange-400"
                    />
                    <Button onClick={addFoodEntry} className="bg-orange-500 hover:bg-orange-600 px-3">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Food Presets - Show more options */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Quick Add Popular Foods:</p>
                    <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                      {foodPresets.slice(0, 12).map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => addFoodPreset(preset)}
                          className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 px-2 py-1 rounded-full transition-colors"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Food Entries List */}
                <div className="bg-orange-50 rounded-lg p-3 h-[200px] overflow-y-auto border border-orange-200">
                  {foodEntries.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center italic py-4">No food entries yet</p>
                  ) : (
                    <div className="space-y-2">
                      {foodEntries.map((entry) => (
                        <div key={entry.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm border border-orange-100">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{entry.name}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-orange-600">{entry.calories} cal</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50" 
                              onClick={() => removeFoodEntry(entry.id)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Food Total */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg text-center shadow-sm">
                  <p className="text-sm font-medium">Total Calories Consumed</p>
                  <p className="text-xl font-bold">{getTotalFoodCalories()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Activities Section */}
            <Card className="border-blue-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
                <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activities & Exercise
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {/* Add Activity Form */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Activity name"
                      value={newActivity.name}
                      onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                      className="flex-1 border-blue-200 focus:border-blue-400"
                    />
                    <Input
                      type="number"
                      placeholder="Calories"
                      value={newActivity.calories}
                      onChange={(e) => setNewActivity({...newActivity, calories: e.target.value})}
                      className="w-24 border-blue-200 focus:border-blue-400"
                    />
                    <Button onClick={addActivityEntry} className="bg-blue-500 hover:bg-blue-600 px-3">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Activity Presets */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Quick Add:</p>
                    <div className="flex flex-wrap gap-1">
                      {activityPresets.slice(0, 4).map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => addActivityPreset(preset)}
                          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-full transition-colors"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Activity Entries List */}
                <div className="bg-blue-50 rounded-lg p-3 h-[200px] overflow-y-auto border border-blue-200">
                  {activityEntries.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center italic py-4">No activity entries yet</p>
                  ) : (
                    <div className="space-y-2">
                      {activityEntries.map((entry) => (
                        <div key={entry.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm border border-blue-100">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{entry.name}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-blue-600">{entry.calories} cal</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50" 
                              onClick={() => removeActivityEntry(entry.id)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Activity Total */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-lg text-center shadow-sm">
                  <p className="text-sm font-medium">Total Calories Burned</p>
                  <p className="text-xl font-bold">{getTotalActivityCalories()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Summary */}
          {(foodEntries.length > 0 || activityEntries.length > 0) && (
            <Card className="border-purple-200 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
                <CardTitle className="text-xl text-center">Daily Summary</CardTitle>
                {userName && <p className="text-purple-100 text-center">Tracking for: {userName}</p>}
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Consumed</p>
                      <p className="text-2xl font-bold text-orange-600">{getTotalFoodCalories()}</p>
                      <p className="text-xs text-gray-500">calories</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Burned</p>
                      <p className="text-2xl font-bold text-blue-600">{getTotalActivityCalories()}</p>
                      <p className="text-xs text-gray-500">calories</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Net Total</p>
                      <p className="text-2xl font-bold text-purple-600">{getNetCalories()}</p>
                      <p className="text-xs text-gray-500">calories</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-lg font-semibold text-gray-800">Daily Goal: {dailyGoal} cal</p>
                      <p className="text-sm text-gray-600">Net Calories: {getNetCalories()} cal</p>
                    </div>
                    <div className="text-center sm:text-right">
                      <p className="text-sm text-gray-600">Status:</p>
                      <p className={`text-lg font-bold ${getCalorieStatusColor()}`}>{getCalorieStatus()}</p>
                    </div>
                  </div>
                </div>

                <ResultActions
                  title="Calorie Tracker"
                  results={prepareResults()}
                  fileName="Calorie-Tracker"
                  userName={userName}
                  unitSystem={unitSystem}
                  referenceText="Remember that calorie tracking is just one aspect of a healthy lifestyle. Focus on balanced nutrition and regular physical activity."
                />
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <IntroSection calculatorId="calories" title="" description="" />
    </div>
  );
};

export default CalorieTrackerCalculator;
