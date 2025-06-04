import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { BMICalcProps } from "@/types/calculatorTypes";
import { calculateBMI, getBMICategory } from "@/utils/calculationUtils";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import IntroSectionTemplate from "@/components/calculator/IntroSectionTemplate";
import IntroSection from "@/components/calculator/IntroSection";
import BMIForm from "./components/BMIForm";
import BMIResults from "./components/BMIResults";

const BMICalculator: React.FC<BMICalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [bmiColor, setBmiColor] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  
  const [errors, setErrors] = useState<{
    height?: string;
    weight?: string;
  }>({});

  const calculateBMIResult = () => {
    // Clear previous errors
    const newErrors: {height?: string; weight?: string} = {};
    let hasErrors = false;

    if (!height || parseFloat(height) <= 0) {
      newErrors.height = "Please enter a valid height";
      hasErrors = true;
    }

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
      setCategory(bmiCategoryResult.category);
      setBmiColor(bmiCategoryResult.color);
      
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
    setBmiColor("");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Body Mass Index (BMI) Calculator</h2>
        
        <IntroSectionTemplate
          title="What is BMI?"
          calculatorName="BMI"
          description="Body Mass Index (BMI) is a calculation of your body size based on your height and weight. It is a quick and simple way to estimate your overall body composition and risk factors for certain health conditions. The BMI measurement is commonly used to categorize people as underweight, normal weight, overweight or obese."
        />

        <BMIForm
          unitSystem={unitSystem}
          height={height}
          weight={weight}
          userName={userName}
          errors={errors}
          onHeightChange={setHeight}
          onWeightChange={setWeight}
          onUserNameChange={setUserName}
          onUnitChange={handleUnitChange}
          onCalculate={calculateBMIResult}
        />

        {bmi !== null && (
          <BMIResults
            bmi={bmi}
            category={category}
            userName={userName}
            height={height}
            weight={weight}
            unitSystem={unitSystem}
          />
        )}
      </Card>

      {/* This IntroSection will show the detailed info section */}
      <IntroSection calculatorId="bmi" title="" description="" />
    </div>
  );
};

export default BMICalculator;
