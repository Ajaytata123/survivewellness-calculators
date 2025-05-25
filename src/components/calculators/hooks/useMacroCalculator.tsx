
import { useState } from "react";
import { UnitSystem } from "@/types/calculatorTypes";
import { calculateMacros } from "@/utils/calculationUtils";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";

export interface MacroResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FormErrors {
  height?: string;
  weight?: string;
  age?: string;
}

export const useMacroCalculator = (unitSystem: UnitSystem, onUnitSystemChange: (system: UnitSystem) => void) => {
  const [userName, setUserName] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activity, setActivity] = useState<string>("moderate");
  const [goal, setGoal] = useState<string>("maintain");
  const [errors, setErrors] = useState<FormErrors>({});
  const [macroResult, setMacroResult] = useState<MacroResult | null>(null);
  const [copied, setCopied] = useState(false);

  const validateInputs = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    if (!height.trim() || Number(height) <= 0) {
      newErrors.height = "Please enter your height";
      isValid = false;
    }
    if (!weight.trim() || Number(weight) <= 0) {
      newErrors.weight = "Please enter your weight";
      isValid = false;
    }
    if (!age.trim() || Number(age) <= 0) {
      newErrors.age = "Please enter your age";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleUnitChange = (value: string) => {
    onUnitSystemChange(value as UnitSystem);
    setHeight("");
    setWeight("");
    setAge("");
    setMacroResult(null);
    setErrors({});
  };

  const calculateMacroResults = () => {
    if (!validateInputs()) {
      showErrorToast("Please fill out all required fields.");
      return;
    }

    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);
    const ageValue = parseInt(age);

    if (isNaN(heightValue) || isNaN(weightValue) || isNaN(ageValue) || heightValue <= 0 || weightValue <= 0 || ageValue <= 0) {
      showErrorToast("Please input valid height, weight, and age.");
      return;
    }

    const result = calculateMacros(
      weightValue, heightValue, ageValue, gender, activity, goal, unitSystem === "metric"
    );
    setMacroResult(result);
  };

  const clearError = (field: keyof FormErrors) => {
    setErrors({ ...errors, [field]: undefined });
  };

  return {
    // State
    userName,
    height,
    weight,
    age,
    gender,
    activity,
    goal,
    errors,
    macroResult,
    copied,
    
    // Setters
    setUserName,
    setHeight,
    setWeight,
    setAge,
    setGender,
    setActivity,
    setGoal,
    setCopied,
    
    // Actions
    handleUnitChange,
    calculateMacroResults,
    clearError
  };
};
