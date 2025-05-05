
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateBMI, getBMICategory } from "@/utils/calculationUtils";
import { BMICalcProps, UnitSystem } from "@/types/calculatorTypes";
import { 
  downloadResultsAsCSV, 
  prepareResultsAsText, 
  copyResultsToClipboard,
  createShareableLink 
} from "@/utils/downloadUtils";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { Check, Copy, Share } from "lucide-react";

const BMICalculator: React.FC<BMICalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  // Imperial units
  const [heightFeet, setHeightFeet] = useState<string>("");
  const [heightInches, setHeightInches] = useState<string>("");
  const [heightTotalInches, setHeightTotalInches] = useState<string>("");
  const [useDirectInches, setUseDirectInches] = useState<boolean>(false);
  
  // Metric units
  const [heightCm, setHeightCm] = useState<string>("");
  const [heightMetersCm, setHeightMetersCm] = useState<{ meters: string, cm: string }>({ meters: "", cm: "" });
  const [useDirectCm, setUseDirectCm] = useState<boolean>(true);
  
  // Common fields
  const [weight, setWeight] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [errors, setErrors] = useState<{height?: string; weight?: string}>({});
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");
  const [bmiCategoryColor, setBmiCategoryColor] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const validateInputs = (): boolean => {
    const newErrors: {height?: string; weight?: string} = {};
    let isValid = true;
    
    // Validate height based on unit system and input method
    if (unitSystem === "imperial") {
      if (useDirectInches) {
        if (!heightTotalInches.trim()) {
          newErrors.height = "Please enter your height";
          isValid = false;
        }
      } else {
        if (!heightFeet.trim() || !heightInches.trim()) {
          newErrors.height = "Please enter your height";
          isValid = false;
        }
      }
    } else { // metric
      if (useDirectCm) {
        if (!heightCm.trim()) {
          newErrors.height = "Please enter your height";
          isValid = false;
        }
      } else {
        if (!heightMetersCm.meters.trim() || !heightMetersCm.cm.trim()) {
          newErrors.height = "Please enter your height";
          isValid = false;
        }
      }
    }
    
    if (!weight.trim()) {
      newErrors.weight = "Please enter your weight";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const calculateBMIResult = () => {
    if (!validateInputs()) return;

    let heightValue: number;
    const weightValue = parseFloat(weight);

    // Calculate height value based on unit system and input method
    if (unitSystem === "imperial") {
      if (useDirectInches) {
        heightValue = parseFloat(heightTotalInches);
      } else {
        heightValue = (parseInt(heightFeet) * 12) + parseInt(heightInches);
      }
    } else { // metric
      if (useDirectCm) {
        heightValue = parseFloat(heightCm);
      } else {
        heightValue = (parseInt(heightMetersCm.meters) * 100) + parseInt(heightMetersCm.cm);
      }
    }

    if (isNaN(heightValue) || isNaN(weightValue) || heightValue <= 0 || weightValue <= 0) {
      showErrorToast("Please enter valid height and weight values.");
      return;
    }

    const bmi = calculateBMI(weightValue, heightValue, unitSystem === "metric");
    const roundedBMI = Math.round(bmi * 10) / 10;
    const { category, color } = getBMICategory(roundedBMI);

    setBmiResult(roundedBMI);
    setBmiCategory(category);
    setBmiCategoryColor(color);
  };

  const handleUnitChange = (value: string) => {
    onUnitSystemChange(value as UnitSystem);
    // Reset fields when changing units
    resetFields();
  };

  const resetFields = () => {
    setHeightFeet("");
    setHeightInches("");
    setHeightTotalInches("");
    setHeightCm("");
    setHeightMetersCm({ meters: "", cm: "" });
    setWeight("");
    setBmiResult(null);
    setErrors({});
  };

  const downloadResults = () => {
    if (bmiResult === null) return;

    const heightDisplay = getHeightDisplayValue();
    
    const results = {
      title: "BMI Calculator",
      results: {
        BMI: bmiResult.toFixed(1),
        Category: bmiCategory,
        Height: heightDisplay,
        Weight: `${weight} ${unitSystem === "metric" ? "kg" : "pounds"}`,
        Gender: gender
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined,
      source: "Generated by: Survivewellness",
      moreInfo: "For more calculators please visit our dedicated calculators section: https://survivewellness.com/tools-calculators/"
    };

    downloadResultsAsCSV(results, "BMI-Calculator");
    showSuccessToast("Results downloaded successfully!");
  };

  const getHeightDisplayValue = () => {
    if (unitSystem === "imperial") {
      if (useDirectInches) {
        return `${heightTotalInches} inches`;
      } else {
        return `${heightFeet}'${heightInches}" (${parseInt(heightFeet) * 12 + parseInt(heightInches)} inches)`;
      }
    } else {
      if (useDirectCm) {
        return `${heightCm} cm`;
      } else {
        return `${heightMetersCm.meters}.${heightMetersCm.cm} m (${parseInt(heightMetersCm.meters) * 100 + parseInt(heightMetersCm.cm)} cm)`;
      }
    }
  };

  const copyResults = () => {
    if (bmiResult === null) return;

    const heightDisplay = getHeightDisplayValue();

    const results = {
      title: "BMI Calculator",
      results: {
        BMI: bmiResult.toFixed(1),
        Category: bmiCategory,
        Height: heightDisplay,
        Weight: `${weight} ${unitSystem === "metric" ? "kg" : "pounds"}`,
        Gender: gender
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined,
      source: "Generated by: Survivewellness",
      moreInfo: "For more calculators please visit our dedicated calculators section: https://survivewellness.com/tools-calculators/"
    };

    copyResultsToClipboard(results);
    setCopied(true);
    showSuccessToast("Results copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = () => {
    if (bmiResult === null) return;
    
    const params = {
      height: unitSystem === "imperial" 
        ? (useDirectInches ? heightTotalInches : `${heightFeet}-${heightInches}`)
        : (useDirectCm ? heightCm : `${heightMetersCm.meters}-${heightMetersCm.cm}`),
      weight,
      system: unitSystem,
      gender,
      name: userName || ""
    };
    
    const link = createShareableLink("bmi", params);
    navigator.clipboard.writeText(link);
    showSuccessToast("Shareable link copied to clipboard!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">BMI Calculator</h2>
      <p className="text-gray-600 mb-4 text-center">
        Calculate your Body Mass Index based on your height and weight
      </p>
      
      <div className="bg-wellness-softBlue/30 p-4 rounded-md mb-6">
        <h3 className="font-medium mb-1">What is BMI?</h3>
        <p className="text-sm text-gray-600">
          Body Mass Index (BMI) is a measure of body fat based on your weight and height. It's a screening tool that can indicate whether you have a healthy weight for your height.
        </p>
      </div>

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
          <div className="flex space-x-4 mt-1">
            <div className={`flex items-center justify-center flex-1 py-2 rounded cursor-pointer border ${gender === "male" ? "bg-wellness-blue/10 border-wellness-blue" : "bg-white border-gray-200"}`}
              onClick={() => setGender("male")}>
              <span>Male</span>
            </div>
            <div className={`flex items-center justify-center flex-1 py-2 rounded cursor-pointer border ${gender === "female" ? "bg-wellness-pink/10 border-wellness-pink" : "bg-white border-gray-200"}`}
              onClick={() => setGender("female")}>
              <span>Female</span>
            </div>
          </div>
        </div>
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
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="height-imperial">Height</Label>
              {errors.height && <span className="text-red-500 text-sm">{errors.height}</span>}
            </div>
            
            <div className="flex items-center mb-2">
              <input 
                type="radio" 
                id="feet-inches" 
                name="imperial-height-type" 
                checked={!useDirectInches}
                onChange={() => setUseDirectInches(false)}
                className="mr-2"
              />
              <Label htmlFor="feet-inches" className="text-sm cursor-pointer">Use feet & inches</Label>
            </div>
            
            {!useDirectInches && (
              <div className="flex space-x-2 mb-3">
                <div className="flex-1">
                  <Label htmlFor="height-feet-imperial" className="text-xs">Feet</Label>
                  <Input
                    id="height-feet-imperial"
                    type="number"
                    min="1"
                    max="8"
                    placeholder="ft"
                    value={heightFeet}
                    onChange={(e) => {
                      setHeightFeet(e.target.value);
                      if (e.target.value) setErrors({...errors, height: undefined});
                    }}
                    className={errors.height ? "border-red-500" : ""}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="height-inches-imperial" className="text-xs">Inches</Label>
                  <Input
                    id="height-inches-imperial"
                    type="number"
                    min="0"
                    max="11"
                    placeholder="in"
                    value={heightInches}
                    onChange={(e) => {
                      setHeightInches(e.target.value);
                      if (e.target.value) setErrors({...errors, height: undefined});
                    }}
                    className={errors.height ? "border-red-500" : ""}
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center mb-2">
              <input 
                type="radio" 
                id="total-inches" 
                name="imperial-height-type" 
                checked={useDirectInches}
                onChange={() => setUseDirectInches(true)}
                className="mr-2"
              />
              <Label htmlFor="total-inches" className="text-sm cursor-pointer">Use total inches</Label>
            </div>
            
            {useDirectInches && (
              <div className="mb-3">
                <Input
                  id="height-total-imperial"
                  type="number"
                  min="1"
                  placeholder="e.g., 70"
                  value={heightTotalInches}
                  onChange={(e) => {
                    setHeightTotalInches(e.target.value);
                    if (e.target.value) setErrors({...errors, height: undefined});
                  }}
                  className={errors.height ? "border-red-500" : ""}
                />
                <p className="text-xs text-gray-500 mt-1">
                  For 5'10", enter 70 inches (5×12 + 10)
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight-imperial" className="flex justify-between">
              Weight (pounds)
              {errors.weight && <span className="text-red-500 text-sm">{errors.weight}</span>}
            </Label>
            <Input
              id="weight-imperial"
              type="number"
              placeholder="e.g., 160"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
                if (e.target.value) setErrors({...errors, weight: undefined});
              }}
              className={errors.weight ? "border-red-500" : ""}
            />
          </div>
        </TabsContent>

        <TabsContent value="metric" className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="height-metric">Height</Label>
              {errors.height && <span className="text-red-500 text-sm">{errors.height}</span>}
            </div>
            
            <div className="flex items-center mb-2">
              <input 
                type="radio" 
                id="meters-cm" 
                name="metric-height-type" 
                checked={!useDirectCm}
                onChange={() => setUseDirectCm(false)}
                className="mr-2"
              />
              <Label htmlFor="meters-cm" className="text-sm cursor-pointer">Use meters & centimeters</Label>
            </div>
            
            {!useDirectCm && (
              <div className="flex space-x-2 mb-3">
                <div className="flex-1">
                  <Label htmlFor="height-meters" className="text-xs">Meters</Label>
                  <Input
                    id="height-meters"
                    type="number"
                    min="0"
                    max="3"
                    placeholder="m"
                    value={heightMetersCm.meters}
                    onChange={(e) => {
                      setHeightMetersCm({...heightMetersCm, meters: e.target.value});
                      if (e.target.value) setErrors({...errors, height: undefined});
                    }}
                    className={errors.height ? "border-red-500" : ""}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="height-cm-part" className="text-xs">Centimeters</Label>
                  <Input
                    id="height-cm-part"
                    type="number"
                    min="0"
                    max="99"
                    placeholder="cm"
                    value={heightMetersCm.cm}
                    onChange={(e) => {
                      setHeightMetersCm({...heightMetersCm, cm: e.target.value});
                      if (e.target.value) setErrors({...errors, height: undefined});
                    }}
                    className={errors.height ? "border-red-500" : ""}
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center mb-2">
              <input 
                type="radio" 
                id="total-cm" 
                name="metric-height-type" 
                checked={useDirectCm}
                onChange={() => setUseDirectCm(true)}
                className="mr-2"
              />
              <Label htmlFor="total-cm" className="text-sm cursor-pointer">Use total centimeters</Label>
            </div>
            
            {useDirectCm && (
              <Input
                id="height-total-cm"
                type="number"
                min="1"
                placeholder="e.g., 175"
                value={heightCm}
                onChange={(e) => {
                  setHeightCm(e.target.value);
                  if (e.target.value) setErrors({...errors, height: undefined});
                }}
                className={errors.height ? "border-red-500" : ""}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight-metric" className="flex justify-between">
              Weight (kg)
              {errors.weight && <span className="text-red-500 text-sm">{errors.weight}</span>}
            </Label>
            <Input
              id="weight-metric"
              type="number"
              placeholder="e.g., 70"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
                if (e.target.value) setErrors({...errors, weight: undefined});
              }}
              className={errors.weight ? "border-red-500" : ""}
            />
          </div>
        </TabsContent>
      </Tabs>

      <Button onClick={calculateBMIResult} className="w-full mb-6 bg-wellness-purple hover:bg-wellness-purple/90">
        Calculate BMI
      </Button>

      {bmiResult !== null && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md animate-fade-in">
          <div className="text-center">
            <h3 className="text-xl font-bold dark:text-white">Your BMI Result</h3>
            <p className="text-3xl font-bold my-2 result-highlight">{bmiResult.toFixed(1)}</p>
            <p className={`text-lg font-medium p-1.5 rounded inline-block ${bmiCategoryColor}`}>
              {bmiCategory}
            </p>
            {userName && <p className="text-sm mt-2 dark:text-gray-300">Results for: {userName}</p>}
          </div>

          <div className="mt-6 space-y-2">
            <h4 className="font-medium dark:text-white">BMI Categories:</h4>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <li className="flex justify-between">
                <span>Underweight</span>
                <span>Less than 18.5</span>
              </li>
              <li className="flex justify-between">
                <span>Normal weight</span>
                <span>18.5 - 24.9</span>
              </li>
              <li className="flex justify-between">
                <span>Overweight</span>
                <span>25 - 29.9</span>
              </li>
              <li className="flex justify-between">
                <span>Obesity (Class 1)</span>
                <span>30 - 34.9</span>
              </li>
              <li className="flex justify-between">
                <span>Obesity (Class 2)</span>
                <span>35 - 39.9</span>
              </li>
              <li className="flex justify-between">
                <span>Extreme Obesity (Class 3)</span>
                <span>40 or higher</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 bg-wellness-softBlue/20 p-4 rounded-md">
            <Button id="bmi-learn-more" variant="outline" size="sm" className="w-full border-wellness-blue text-wellness-blue hover:bg-wellness-blue/10 dark:text-wellness-blue dark:border-wellness-blue">
              Know more about BMI
            </Button>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2 dark:text-gray-400">
              Reference: U.S. National Institutes of Health (NIH)
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={copyResults} className="flex items-center bg-wellness-blue/10 text-wellness-blue hover:bg-wellness-blue/20 border-wellness-blue/50">
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied!" : "Copy Results"}
              </Button>
              <Button variant="outline" size="sm" onClick={shareLink} className="flex items-center bg-wellness-purple/10 text-wellness-purple hover:bg-wellness-purple/20 border-wellness-purple/50">
                <Share className="h-4 w-4 mr-1" />
                Share Link
              </Button>
              <Button variant="outline" size="sm" onClick={downloadResults} className="bg-wellness-green/10 text-wellness-green hover:bg-wellness-green/20 border-wellness-green/50">
                Download CSV
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm font-bold text-wellness-purple dark:text-wellness-pink">
              Thank you for using Survivewellness!
            </p>
            <a href="https://survivewellness.com/tools-calculators/" target="_blank" rel="noopener noreferrer" className="text-xs text-wellness-blue dark:text-wellness-blue hover:underline mt-1 inline-block">
              For more calculators please visit our dedicated calculators section
            </a>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BMICalculator;
