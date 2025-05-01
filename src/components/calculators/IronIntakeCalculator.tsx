
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Share, Download } from "lucide-react";
import { downloadResultsAsCSV, copyResultsToClipboard, shareResults } from "@/utils/downloadUtils";
import { showSuccessToast } from "@/utils/notificationUtils";
import { IronIntakeCalcProps } from "@/types/calculatorTypes";

const IronIntakeCalculator: React.FC<IronIntakeCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [age, setAge] = useState<string>("30");
  const [gender, setGender] = useState<"female" | "male">("female");
  const [isPregnant, setIsPregnant] = useState<"yes" | "no">("no");
  const [isBreastfeeding, setIsBreastfeeding] = useState<"yes" | "no">("no");
  const [hasPeriods, setHasPeriods] = useState<"yes" | "no">("yes");
  const [heavyPeriods, setHeavyPeriods] = useState<"yes" | "no">("no");
  const [dietType, setDietType] = useState<"omnivore" | "vegetarian" | "vegan">("omnivore");
  const [intakeItems, setIntakeItems] = useState<{id: string, name: string, amount: string, ironContent: number}[]>([
    { id: "1", name: "", amount: "0", ironContent: 0 }
  ]);
  const [ironIntakeResult, setIronIntakeResult] = useState<{
    dailyNeed: number;
    currentIntake: number;
    deficitOrSurplus: number;
    recommendations: string[];
    foodSuggestions: {
      name: string;
      ironContent: number;
      servingSize: string;
    }[];
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const calculateIronIntake = () => {
    if (!age) {
      showSuccessToast("Please enter your age");
      return;
    }
    
    const currentAge = parseInt(age);
    if (isNaN(currentAge) || currentAge < 1 || currentAge > 100) {
      showSuccessToast("Please enter a valid age");
      return;
    }
    
    // Calculate recommended daily iron intake based on age, gender and special conditions
    let dailyNeed = 0;
    
    if (gender === "female") {
      if (currentAge <= 8) {
        dailyNeed = 10;
      } else if (currentAge <= 13) {
        dailyNeed = 8;
      } else if (currentAge <= 18) {
        dailyNeed = 15;
      } else if (currentAge <= 50) {
        dailyNeed = 18;
      } else {
        dailyNeed = 8;
      }
      
      // Adjustments for pregnancy, breastfeeding, and menstruation
      if (isPregnant === "yes") {
        dailyNeed = 27; // Pregnant women need more iron
      } else if (isBreastfeeding === "yes") {
        dailyNeed = 9; // Breastfeeding women need slightly more
      }
      
      if (hasPeriods === "yes" && currentAge > 18 && currentAge <= 50) {
        if (heavyPeriods === "yes") {
          dailyNeed += 5; // Heavy periods can cause more iron loss
        }
      }
      
    } else { // male
      if (currentAge <= 8) {
        dailyNeed = 10;
      } else if (currentAge <= 13) {
        dailyNeed = 8;
      } else if (currentAge <= 18) {
        dailyNeed = 11;
      } else {
        dailyNeed = 8;
      }
    }
    
    // Adjustment for diet type
    if (dietType === "vegetarian") {
      dailyNeed *= 1.3; // Vegetarians may need 1.3x more iron due to lower absorption of non-heme iron
    } else if (dietType === "vegan") {
      dailyNeed *= 1.8; // Vegans may need 1.8x more iron due to only consuming non-heme iron
    }
    
    // Round to nearest whole number
    dailyNeed = Math.round(dailyNeed);
    
    // Calculate current intake from reported foods
    let currentIntake = 0;
    intakeItems.forEach(item => {
      if (item.name && !isNaN(parseFloat(item.amount)) && item.ironContent > 0) {
        currentIntake += parseFloat(item.amount) * item.ironContent;
      }
    });
    
    // Calculate deficit or surplus
    const deficitOrSurplus = currentIntake - dailyNeed;
    
    // Generate recommendations and food suggestions
    const { recommendations, foodSuggestions } = generateRecommendations(
      deficitOrSurplus, 
      gender, 
      dietType, 
      currentAge, 
      isPregnant === "yes",
      isBreastfeeding === "yes"
    );
    
    setIronIntakeResult({
      dailyNeed,
      currentIntake: Math.round(currentIntake * 10) / 10,
      deficitOrSurplus: Math.round(deficitOrSurplus * 10) / 10,
      recommendations,
      foodSuggestions
    });
  };

  const generateRecommendations = (
    deficitOrSurplus: number,
    gender: string,
    dietType: string,
    age: number,
    isPregnant: boolean,
    isBreastfeeding: boolean
  ): { 
    recommendations: string[], 
    foodSuggestions: { name: string, ironContent: number, servingSize: string }[] 
  } => {
    const recommendations: string[] = [];
    let foodSuggestions: { name: string, ironContent: number, servingSize: string }[] = [];
    
    // Basic recommendations for everyone
    recommendations.push("Consume vitamin C-rich foods alongside iron-rich foods to enhance absorption");
    recommendations.push("Avoid drinking tea or coffee with meals as they can inhibit iron absorption");
    
    // Deficit-based recommendations
    if (deficitOrSurplus < -5) {
      recommendations.push("Your iron intake appears to be significantly below recommendations");
      recommendations.push("Consider discussing iron supplementation with your healthcare provider");
    } else if (deficitOrSurplus < 0) {
      recommendations.push("Your iron intake is slightly below recommendations");
      recommendations.push("Try to incorporate more iron-rich foods in your diet");
    } else if (deficitOrSurplus > 10) {
      recommendations.push("Your iron intake appears to be well above recommendations");
      recommendations.push("Unless directed by a healthcare provider, avoid additional iron supplementation");
    } else {
      recommendations.push("Your iron intake meets or exceeds the recommended daily amount");
    }
    
    // Special population recommendations
    if (isPregnant) {
      recommendations.push("As a pregnant woman, your iron needs are significantly higher");
      recommendations.push("Prenatal vitamins containing iron are typically recommended during pregnancy");
    }
    
    if (isBreastfeeding) {
      recommendations.push("Continue to maintain adequate iron intake during breastfeeding");
    }
    
    if (gender === "female" && age > 18 && age <= 50) {
      recommendations.push("Women of reproductive age should monitor iron status regularly due to menstrual blood loss");
    }
    
    // Diet-specific recommendations
    if (dietType === "vegetarian" || dietType === "vegan") {
      recommendations.push("Plant-based iron is less easily absorbed than animal sources (non-heme vs heme iron)");
      recommendations.push("Consider soaking, sprouting, or fermenting grains and legumes to improve iron absorption");
    }
    
    // Food suggestions based on diet type
    if (deficitOrSurplus < 0) {
      if (dietType === "omnivore") {
        foodSuggestions = [
          { name: "Beef liver", ironContent: 6.5, servingSize: "3 oz (85g)" },
          { name: "Oysters", ironContent: 8.0, servingSize: "3 oz (85g)" },
          { name: "Beef (lean)", ironContent: 3.0, servingSize: "3 oz (85g)" },
          { name: "Chicken liver", ironContent: 11.0, servingSize: "3 oz (85g)" },
          { name: "Dark turkey meat", ironContent: 2.0, servingSize: "3 oz (85g)" }
        ];
      } else if (dietType === "vegetarian") {
        foodSuggestions = [
          { name: "Eggs (especially yolks)", ironContent: 1.2, servingSize: "2 large" },
          { name: "Fortified breakfast cereals", ironContent: 18.0, servingSize: "1 cup" },
          { name: "Spinach (cooked)", ironContent: 3.2, servingSize: "1/2 cup" },
          { name: "Lentils (cooked)", ironContent: 3.3, servingSize: "1/2 cup" },
          { name: "Tofu", ironContent: 3.4, servingSize: "1/2 cup" }
        ];
      } else { // vegan
        foodSuggestions = [
          { name: "Fortified breakfast cereals", ironContent: 18.0, servingSize: "1 cup" },
          { name: "Beans (white, cooked)", ironContent: 3.3, servingSize: "1/2 cup" },
          { name: "Spinach (cooked)", ironContent: 3.2, servingSize: "1/2 cup" },
          { name: "Tofu", ironContent: 3.4, servingSize: "1/2 cup" },
          { name: "Quinoa (cooked)", ironContent: 1.5, servingSize: "1/2 cup" },
          { name: "Pumpkin seeds", ironContent: 4.2, servingSize: "1 oz (28g)" }
        ];
      }
    }
    
    return { recommendations, foodSuggestions };
  };

  const addIntakeItem = () => {
    setIntakeItems([...intakeItems, { 
      id: Date.now().toString(), 
      name: "", 
      amount: "0", 
      ironContent: 0 
    }]);
  };

  const removeIntakeItem = (id: string) => {
    if (intakeItems.length > 1) {
      setIntakeItems(intakeItems.filter(item =>
        item.id !== id));
    }
  };

  const updateIntakeItem = (id: string, field: string, value: string) => {
    setIntakeItems(intakeItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleCopy = () => {
    if (!ironIntakeResult) return;
    
    const results = {
      title: "Iron Intake Calculator",
      results: {
        "Daily Iron Need": `${ironIntakeResult.dailyNeed} mg`,
        "Current Iron Intake": `${ironIntakeResult.currentIntake} mg`,
        "Deficit/Surplus": `${ironIntakeResult.deficitOrSurplus} mg`,
        "Diet Type": dietType === "omnivore" 
          ? "Omnivore" 
          : dietType === "vegetarian" 
            ? "Vegetarian" 
            : "Vegan"
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
    if (!ironIntakeResult) return;
    
    const results = {
      title: "Iron Intake Calculator",
      results: {
        "Daily Iron Need": `${ironIntakeResult.dailyNeed} mg`,
        "Current Iron Intake": `${ironIntakeResult.currentIntake} mg`,
        "Deficit/Surplus": `${ironIntakeResult.deficitOrSurplus} mg`,
        "Diet Type": dietType === "omnivore" 
          ? "Omnivore" 
          : dietType === "vegetarian" 
            ? "Vegetarian" 
            : "Vegan"
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    shareResults(results);
  };

  const handleDownload = () => {
    if (!ironIntakeResult) return;
    
    const results = {
      title: "Iron Intake Calculator",
      results: {
        "Daily Iron Need": `${ironIntakeResult.dailyNeed} mg`,
        "Current Iron Intake": `${ironIntakeResult.currentIntake} mg`,
        "Deficit/Surplus": `${ironIntakeResult.deficitOrSurplus} mg`,
        "Diet Type": dietType === "omnivore" 
          ? "Omnivore" 
          : dietType === "vegetarian" 
            ? "Vegetarian" 
            : "Vegan"
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    downloadResultsAsCSV(results, "Iron-Intake-Calculator");
    showSuccessToast("Results downloaded successfully!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Iron Intake Calculator</h2>
      <p className="text-gray-600 mb-6 text-center">
        Calculate your recommended iron intake and track your current consumption
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
          <Select value={age} onValueChange={setAge}>
            <SelectTrigger id="age">
              <SelectValue placeholder="Select your age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">1-8 years</SelectItem>
              <SelectItem value="10">9-13 years</SelectItem>
              <SelectItem value="16">14-18 years</SelectItem>
              <SelectItem value="30">19-50 years</SelectItem>
              <SelectItem value="60">51+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup
            value={gender}
            onValueChange={(value) => {
              setGender(value as "female" | "male");
              if (value === "male") {
                setIsPregnant("no");
                setIsBreastfeeding("no");
                setHasPeriods("no");
                setHeavyPeriods("no");
              }
            }}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
          </RadioGroup>
        </div>
        
        {gender === "female" && parseInt(age) >= 14 && parseInt(age) <= 50 && (
          <>
            <div className="space-y-2">
              <Label>Are you pregnant?</Label>
              <RadioGroup
                value={isPregnant}
                onValueChange={(value) => {
                  setIsPregnant(value as "yes" | "no");
                  if (value === "yes") {
                    setIsBreastfeeding("no");
                    setHasPeriods("no");
                    setHeavyPeriods("no");
                  }
                }}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="pregnant-yes" />
                  <Label htmlFor="pregnant-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="pregnant-no" />
                  <Label htmlFor="pregnant-no">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            {isPregnant === "no" && (
              <div className="space-y-2">
                <Label>Are you breastfeeding?</Label>
                <RadioGroup
                  value={isBreastfeeding}
                  onValueChange={(value) => {
                    setIsBreastfeeding(value as "yes" | "no");
                    if (value === "yes") {
                      setHasPeriods("no");
                      setHeavyPeriods("no");
                    }
                  }}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="breastfeeding-yes" />
                    <Label htmlFor="breastfeeding-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="breastfeeding-no" />
                    <Label htmlFor="breastfeeding-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            
            {isPregnant === "no" && isBreastfeeding === "no" && (
              <>
                <div className="space-y-2">
                  <Label>Do you have menstrual periods?</Label>
                  <RadioGroup
                    value={hasPeriods}
                    onValueChange={(value) => {
                      setHasPeriods(value as "yes" | "no");
                      if (value === "no") {
                        setHeavyPeriods("no");
                      }
                    }}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="periods-yes" />
                      <Label htmlFor="periods-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="periods-no" />
                      <Label htmlFor="periods-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {hasPeriods === "yes" && (
                  <div className="space-y-2">
                    <Label>Do you experience heavy periods?</Label>
                    <RadioGroup
                      value={heavyPeriods}
                      onValueChange={(value) => setHeavyPeriods(value as "yes" | "no")}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="heavy-yes" />
                        <Label htmlFor="heavy-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="heavy-no" />
                        <Label htmlFor="heavy-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </>
            )}
          </>
        )}
        
        <div className="space-y-2">
          <Label>Diet Type</Label>
          <RadioGroup
            value={dietType}
            onValueChange={(value) => setDietType(value as "omnivore" | "vegetarian" | "vegan")}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="omnivore" id="omnivore" />
              <Label htmlFor="omnivore">Omnivore (includes meat)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="vegetarian" id="vegetarian" />
              <Label htmlFor="vegetarian">Vegetarian (no meat, but dairy/eggs)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="vegan" id="vegan" />
              <Label htmlFor="vegan">Vegan (plant-based only)</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-3">
          <Label>Daily Iron Consumption</Label>
          <p className="text-sm text-gray-600">
            Add foods you consume on a typical day and estimate their iron content
          </p>
          
          {intakeItems.map((item, index) => (
            <div key={item.id} className="grid grid-cols-8 gap-2 items-center">
              <Input
                className="col-span-3"
                placeholder="Food name"
                value={item.name}
                onChange={(e) => updateIntakeItem(item.id, "name", e.target.value)}
              />
              <Input
                className="col-span-2"
                type="number"
                placeholder="Servings"
                value={item.amount}
                onChange={(e) => updateIntakeItem(item.id, "amount", e.target.value)}
              />
              <Input
                className="col-span-2"
                type="number"
                placeholder="mg iron"
                value={item.ironContent === 0 ? "" : item.ironContent.toString()}
                onChange={(e) => updateIntakeItem(item.id, "ironContent", e.target.value)}
              />
              <Button
                variant="ghost"
                size="sm"
                className="col-span-1"
                onClick={() => removeIntakeItem(item.id)}
                disabled={intakeItems.length === 1}
              >
                &times;
              </Button>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addIntakeItem}
            className="mt-2"
          >
            Add Food Item
          </Button>
        </div>
      </div>
      
      <Button onClick={calculateIronIntake} className="w-full mb-6">
        Calculate Iron Needs
      </Button>
      
      {ironIntakeResult && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Iron Intake Results</h3>
            {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
          </div>
          
          <div className="space-y-4">
            <div className="bg-wellness-softBlue p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <p>Daily Iron Need:</p>
                <p className="font-bold">{ironIntakeResult.dailyNeed} mg</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Current Iron Intake:</p>
                <p className="font-bold">{ironIntakeResult.currentIntake} mg</p>
              </div>
              <div className="h-1 bg-gray-200 rounded-full mb-2">
                <div
                  className={`h-1 rounded-full ${
                    ironIntakeResult.deficitOrSurplus >= 0 ? "bg-wellness-green" : "bg-wellness-orange"
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(0, (ironIntakeResult.currentIntake / ironIntakeResult.dailyNeed) * 100))}%`
                  }}
                />
              </div>
              <div className="flex justify-between">
                <p>Deficit/Surplus:</p>
                <p className={`font-bold ${ironIntakeResult.deficitOrSurplus >= 0 ? "text-wellness-green" : "text-wellness-orange"}`}>
                  {ironIntakeResult.deficitOrSurplus > 0 ? "+" : ""}{ironIntakeResult.deficitOrSurplus} mg
                </p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="font-medium mb-2">Recommendations</p>
              <ul className="space-y-1 list-disc pl-5">
                {ironIntakeResult.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm">{rec}</li>
                ))}
              </ul>
            </div>
            
            {ironIntakeResult.foodSuggestions.length > 0 && (
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="font-medium mb-2">Iron-Rich Food Suggestions</p>
                <div className="space-y-2">
                  {ironIntakeResult.foodSuggestions.map((food, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div>
                        <span className="font-medium">{food.name}</span>
                        <span className="text-gray-500"> ({food.servingSize})</span>
                      </div>
                      <span className="text-wellness-blue">{food.ironContent} mg</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              This calculator uses recommended dietary allowances (RDAs) from the National Institutes of Health.
              Individual needs may vary based on health conditions.
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

export default IronIntakeCalculator;
