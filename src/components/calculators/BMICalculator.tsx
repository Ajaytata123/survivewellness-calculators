
// Add the BMICalculator with the required changes
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BMICalcProps } from "@/types/calculatorTypes";
import { calculateBMI } from "@/utils/calculationUtils";
import { getBMICategory } from "@/utils/calculationUtils";
import { validateWeight } from "@/utils/validationUtils";
import { showErrorToast } from "@/utils/notificationUtils";
import IntroSectionTemplate from "@/components/calculator/IntroSectionTemplate";
import { HeightInputField } from "@/components/ui/height-input-field";
import ResultActions from "@/components/calculator/ResultActions";

// Add the BMI Calculator with required changes
const BMICalculator: React.FC<BMICalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  
  const [errors, setErrors] = useState<{
    height?: string;
    weight?: string;
  }>({});

  const calculateBMIResult = () => {
    // Clear previous errors
    const newErrors: {height?: string; weight?: string} = {};
    let hasErrors = false;

    // Validate height
    if (!height || parseFloat(height) <= 0) {
      newErrors.height = "Please enter a valid height";
      hasErrors = true;
    }

    // Validate weight
    if (!weight || parseFloat(weight) <= 0) {
      newErrors.weight = "Please enter a valid weight";
      hasErrors = true;
    }

    setErrors(newErrors);
    
    if (hasErrors) {
      showErrorToast("Please fill in all required fields correctly");
      return;
    }

    try {
      const heightValue = parseFloat(height);
      const weightValue = parseFloat(weight);
      
      const bmiValue = calculateBMI(heightValue, weightValue, unitSystem === "metric");
      const bmiCategoryResult = getBMICategory(bmiValue);
      
      setBmi(bmiValue);
      setCategory(bmiCategoryResult.category); // Fixed: Only using the category string from the result
      
    } catch (error) {
      console.error("Error calculating BMI:", error);
      showErrorToast("Error calculating BMI. Please check your inputs.");
    }
  };

  const handleUnitChange = (value: string) => {
    onUnitSystemChange(value === "metric" ? "metric" : "imperial");
    setHeight("");
    setWeight("");
    setBmi(null);
    setCategory("");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Body Mass Index (BMI) Calculator</h2>
      
      <IntroSectionTemplate
        title="What is BMI?"
        calculatorName="BMI"
        description="Body Mass Index (BMI) is a calculation of your body size based on your height and weight. It is a quick and simple way to estimate your overall body composition and risk factors for certain health conditions. The BMI measurement is commonly used to categorize people as underweight, normal weight, overweight or obese."
      />

      <div className="mb-6">
        <Label htmlFor="userName">Your Name (optional)</Label>
        <Input
          id="userName"
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="mt-1"
        />
      </div>

      <Tabs
        defaultValue={unitSystem}
        onValueChange={handleUnitChange}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="imperial">Imperial (US)</TabsTrigger>
          <TabsTrigger value="metric">Metric</TabsTrigger>
        </TabsList>

        <TabsContent value="imperial" className="space-y-4">
          <HeightInputField 
            unitSystem="imperial"
            height={height}
            setHeight={setHeight}
            error={errors.height}
          />

          <div className="space-y-2">
            <Label htmlFor="weight-imperial">Weight (pounds)</Label>
            <Input
              id="weight-imperial"
              type="number"
              placeholder="e.g., 160"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className={errors.weight ? "border-red-500" : ""}
            />
            {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
          </div>
        </TabsContent>

        <TabsContent value="metric" className="space-y-4">
          <HeightInputField 
            unitSystem="metric"
            height={height}
            setHeight={setHeight}
            error={errors.height}
          />

          <div className="space-y-2">
            <Label htmlFor="weight-metric">Weight (kg)</Label>
            <Input
              id="weight-metric"
              type="number"
              placeholder="e.g., 70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className={errors.weight ? "border-red-500" : ""}
            />
            {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
          </div>
        </TabsContent>
      </Tabs>

      <Button onClick={calculateBMIResult} className="w-full mb-6">
        Calculate BMI
      </Button>

      {bmi !== null && (
        <div className="results-container bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="text-center mb-3">
            <h3 className="text-xl font-bold">Your BMI Results</h3>
            {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
          </div>
          
          <div className="result-highlight rounded-md text-center p-4 bg-wellness-softPurple dark:bg-wellness-softPurple/30 mb-4">
            <div className="flex justify-around items-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your BMI</p>
                <p className="text-3xl font-bold text-wellness-purple dark:text-wellness-purple/90">
                  {bmi.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                <p className="text-xl font-bold">{category}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <ResultActions
              title="BMI Calculator"
              results={{
                "BMI Value": bmi.toFixed(1),
                "BMI Category": category,
                "Height": `${height} ${unitSystem === "metric" ? "cm" : "inches"}`,
                "Weight": `${weight} ${unitSystem === "metric" ? "kg" : "pounds"}`
              }}
              fileName="BMI-Calculator"
              userName={userName}
              unitSystem={unitSystem}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default BMICalculator;
