
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IdealWeightCalcProps, UnitSystem } from "@/types/calculatorTypes";
import { downloadResultsAsCSV, copyResultsToClipboard, createShareableLink } from "@/utils/downloadUtils";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { Check, Copy, Share } from "lucide-react";

const IdealWeightCalculator: React.FC<IdealWeightCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  // Imperial units
  const [heightFeet, setHeightFeet] = useState<string>("");
  const [heightInches, setHeightInches] = useState<string>("");
  const [heightTotalInches, setHeightTotalInches] = useState<string>("");
  const [useDirectInches, setUseDirectInches] = useState<boolean>(false);
  
  // Metric units
  const [heightCm, setHeightCm] = useState<string>("");
  const [heightMetersCm, setHeightMetersCm] = useState<{ meters: string, cm: string }>({ meters: "", cm: "" });
  const [useDirectCm, setUseDirectCm] = useState<boolean>(true);
  
  const [userName, setUserName] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [errors, setErrors] = useState<{height?: string}>({});
  const [idealWeightResult, setIdealWeightResult] = useState<number | null>(null);
  const [idealWeightRange, setIdealWeightRange] = useState<{min: number, max: number} | null>(null);
  const [copied, setCopied] = useState(false);

  const validateInputs = (): boolean => {
    const newErrors: {height?: string} = {};
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
    
    setErrors(newErrors);
    return isValid;
  };

  // Function to calculate ideal weight using various formulas
  const calculateIdealWeightResult = () => {
    if (!validateInputs()) return;

    let heightValue: number;

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

    if (isNaN(heightValue) || heightValue <= 0) {
      showErrorToast("Please enter a valid height value.");
      return;
    }

    let idealWeight: number;
    let minWeight: number;
    let maxWeight: number;

    // Convert height to meters for metric calculations or keep in inches for imperial
    const heightInMeters = unitSystem === "metric" ? heightValue / 100 : heightValue / 39.37;
    const heightInInches = unitSystem === "metric" ? heightValue / 2.54 : heightValue;

    // Calculate ideal weight based on gender using Modified Devine Formula
    if (gender === "male") {
      // For males: IBW = 50 kg + 2.3 kg for each inch over 5 feet
      idealWeight = unitSystem === "metric" 
        ? 50 + 0.91 * (heightValue - 152.4) // height in cm
        : 50 + 2.3 * (heightValue - 60); // height in inches
        
      // BMI range 18.5-24.9 for healthy weight
      minWeight = 18.5 * (heightInMeters * heightInMeters);
      maxWeight = 24.9 * (heightInMeters * heightInMeters);
    } else {
      // For females: IBW = 45.5 kg + 2.3 kg for each inch over 5 feet
      idealWeight = unitSystem === "metric"
        ? 45.5 + 0.91 * (heightValue - 152.4) // height in cm
        : 45.5 + 2.3 * (heightValue - 60); // height in inches
        
      // BMI range 18.5-24.9 for healthy weight
      minWeight = 18.5 * (heightInMeters * heightInMeters);
      maxWeight = 24.9 * (heightInMeters * heightInMeters);
    }

    // Convert to pounds if using imperial
    if (unitSystem === "imperial") {
      idealWeight = idealWeight * 2.20462;
      minWeight = minWeight * 2.20462;
      maxWeight = maxWeight * 2.20462;
    }

    // Round to one decimal place
    setIdealWeightResult(Math.round(idealWeight * 10) / 10);
    setIdealWeightRange({
      min: Math.round(minWeight * 10) / 10,
      max: Math.round(maxWeight * 10) / 10
    });
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
    setIdealWeightResult(null);
    setIdealWeightRange(null);
    setErrors({});
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

  const downloadResults = () => {
    if (idealWeightResult === null || idealWeightRange === null) return;

    const heightDisplay = getHeightDisplayValue();

    const results = {
      title: "Ideal Weight Calculator",
      results: {
        "Ideal Weight": `${idealWeightResult} ${unitSystem === "metric" ? "kg" : "lbs"}`,
        "Healthy Weight Range": `${idealWeightRange.min} - ${idealWeightRange.max} ${unitSystem === "metric" ? "kg" : "lbs"}`,
        "Height": heightDisplay,
        "Gender": gender,
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined,
      source: "Generated by: Survivewellness",
      moreInfo: "For more calculators please visit our dedicated calculators section: https://survivewellness.com/tools-calculators/"
    };

    downloadResultsAsCSV(results, "Ideal-Weight-Calculator");
    showSuccessToast("Results downloaded successfully!");
  };

  const copyResults = () => {
    if (idealWeightResult === null || idealWeightRange === null) return;

    const heightDisplay = getHeightDisplayValue();

    const results = {
      title: "Ideal Weight Calculator",
      results: {
        "Ideal Weight": `${idealWeightResult} ${unitSystem === "metric" ? "kg" : "lbs"}`,
        "Healthy Weight Range": `${idealWeightRange.min} - ${idealWeightRange.max} ${unitSystem === "metric" ? "kg" : "lbs"}`,
        "Height": heightDisplay,
        "Gender": gender,
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
    if (idealWeightResult === null) return;
    
    const params = {
      height: unitSystem === "imperial" 
        ? (useDirectInches ? heightTotalInches : `${heightFeet}-${heightInches}`)
        : (useDirectCm ? heightCm : `${heightMetersCm.meters}-${heightMetersCm.cm}`),
      gender,
      system: unitSystem,
      name: userName || ""
    };
    
    const link = createShareableLink("idealweight", params);
    navigator.clipboard.writeText(link);
    showSuccessToast("Shareable link copied to clipboard!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Ideal Weight Calculator</h2>
      <p className="text-gray-600 mb-4 text-center">
        Calculate your ideal weight based on height and gender
      </p>

      <div className="bg-wellness-softGreen/30 p-4 rounded-md mb-6">
        <h3 className="font-medium mb-1">What is Ideal Weight?</h3>
        <p className="text-sm text-gray-600">
          Ideal body weight is an estimate of what you should weigh based on your height and gender. This calculator uses evidence-based formulas to provide a recommended weight range for optimal health.
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
        </TabsContent>
      </Tabs>

      <div className="space-y-4 mb-6">
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

      <Button onClick={calculateIdealWeightResult} className="w-full mb-6 bg-wellness-purple hover:bg-wellness-purple/90">
        Calculate Ideal Weight
      </Button>

      {idealWeightResult !== null && idealWeightRange !== null && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md animate-fade-in">
          <div className="text-center">
            <h3 className="text-xl font-bold dark:text-white">Your Ideal Weight</h3>
            <p className="text-3xl font-bold my-2 result-highlight">
              {idealWeightResult} {unitSystem === "metric" ? "kg" : "lbs"}
            </p>
            <div className="bg-wellness-softGreen p-3 rounded-md inline-block">
              <p className="text-sm font-medium">Healthy Weight Range:</p>
              <p className="text-lg font-bold">
                {idealWeightRange.min} - {idealWeightRange.max} {unitSystem === "metric" ? "kg" : "lbs"}
              </p>
            </div>
            {userName && <p className="text-sm mt-2 dark:text-gray-300">Results for: {userName}</p>}
          </div>

          <div className="mt-6 space-y-2">
            <h4 className="font-medium dark:text-white">About This Calculation:</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              This calculator uses the Modified Devine Formula, one of the most widely accepted methods 
              to calculate ideal body weight. It's also cross-referenced with healthy BMI ranges (18.5-24.9) 
              as defined by health organizations.
            </p>
            <p className="text-sm text-gray-700 mt-2 dark:text-gray-300">
              Remember that ideal weight varies based on body composition, muscle mass, and other individual factors.
            </p>
          </div>

          <div className="mt-6 bg-wellness-softGreen/20 p-4 rounded-md">
            <Button id="ideal-weight-learn-more" variant="outline" size="sm" className="w-full border-wellness-green text-wellness-green hover:bg-wellness-green/10 dark:text-wellness-green dark:border-wellness-green">
              Know more about Ideal Weight
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

export default IdealWeightCalculator;
