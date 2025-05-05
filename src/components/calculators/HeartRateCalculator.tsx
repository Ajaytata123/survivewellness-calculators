
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HeartRateCalcProps } from "@/types/calculatorTypes";
import { downloadResultsAsCSV, copyResultsToClipboard, createShareableLink } from "@/utils/downloadUtils";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { Check, Copy, Share } from "lucide-react";
import IntroSection from "@/components/calculator/IntroSection";
import ResultActions from "@/components/calculator/ResultActions";

const HeartRateCalculator: React.FC<HeartRateCalcProps> = ({ unitSystem }) => {
  const [age, setAge] = useState<string>("");
  const [restingHr, setRestingHr] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [errors, setErrors] = useState<{age?: string; restingHr?: string}>({});
  const [maxHr, setMaxHr] = useState<number | null>(null);
  const [hrZones, setHrZones] = useState<{
    recovery: { min: number; max: number };
    aerobic: { min: number; max: number };
    tempo: { min: number; max: number };
    threshold: { min: number; max: number };
    anaerobic: { min: number; max: number };
    maximal: { min: number; max: number };
  } | null>(null);

  const validateInputs = (): boolean => {
    const newErrors: {age?: string; restingHr?: string} = {};
    let isValid = true;
    
    if (!age.trim()) {
      newErrors.age = "Please enter your age";
      isValid = false;
    } else {
      const ageValue = parseInt(age);
      if (isNaN(ageValue) || ageValue <= 0 || ageValue > 120) {
        newErrors.age = "Please enter a valid age between 1 and 120";
        isValid = false;
      }
    }
    
    if (restingHr.trim()) {
      const restingHrValue = parseInt(restingHr);
      if (isNaN(restingHrValue) || restingHrValue <= 0 || restingHrValue > 200) {
        newErrors.restingHr = "Please enter a valid resting heart rate between 1 and 200";
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const calculateHeartRateZones = () => {
    if (!validateInputs()) {
      return;
    }

    const ageValue = parseInt(age);
    const restingHrValue = restingHr ? parseInt(restingHr) : undefined;

    // Calculate maximum heart rate using the Tanaka formula
    // HRmax = 208 - (0.7 * age)
    const calculatedMaxHr = Math.round(208 - (0.7 * ageValue));
    
    // Calculate heart rate reserve (HRR) if resting heart rate is provided
    const hrReserve = restingHrValue !== undefined ? calculatedMaxHr - restingHrValue : undefined;
    
    // Define heart rate zones
    // Using Karvonen formula if resting HR is available, otherwise percentage of max HR
    const recoveryMin = restingHrValue !== undefined 
      ? Math.round(restingHrValue + (hrReserve! * 0.5))
      : Math.round(calculatedMaxHr * 0.5);
    const recoveryMax = restingHrValue !== undefined 
      ? Math.round(restingHrValue + (hrReserve! * 0.6))
      : Math.round(calculatedMaxHr * 0.6);
      
    const aerobicMin = recoveryMax + 1;
    const aerobicMax = restingHrValue !== undefined 
      ? Math.round(restingHrValue + (hrReserve! * 0.7))
      : Math.round(calculatedMaxHr * 0.7);
      
    const tempoMin = aerobicMax + 1;
    const tempoMax = restingHrValue !== undefined 
      ? Math.round(restingHrValue + (hrReserve! * 0.8))
      : Math.round(calculatedMaxHr * 0.8);
      
    const thresholdMin = tempoMax + 1;
    const thresholdMax = restingHrValue !== undefined 
      ? Math.round(restingHrValue + (hrReserve! * 0.9))
      : Math.round(calculatedMaxHr * 0.9);
      
    const anaerobicMin = thresholdMax + 1;
    const anaerobicMax = restingHrValue !== undefined 
      ? Math.round(restingHrValue + (hrReserve! * 0.95))
      : Math.round(calculatedMaxHr * 0.95);
      
    const maximalMin = anaerobicMax + 1;
    
    setMaxHr(calculatedMaxHr);
    setHrZones({
      recovery: { min: recoveryMin, max: recoveryMax },
      aerobic: { min: aerobicMin, max: aerobicMax },
      tempo: { min: tempoMin, max: tempoMax },
      threshold: { min: thresholdMin, max: thresholdMax },
      anaerobic: { min: anaerobicMin, max: anaerobicMax },
      maximal: { min: maximalMin, max: calculatedMaxHr },
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Heart Rate Zones Calculator</h2>
      
      <IntroSection 
        title="Understanding Heart Rate Zones"
        description="Heart rate zones are personalized ranges that help optimize your workout intensity based on your maximum heart rate. Training in different zones targets different energy systems and provides various benefits from fat burning to improving cardiovascular endurance."
      />
      
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
          <Label htmlFor="age" className="flex justify-between">
            <span>Age</span>
            {errors.age && <span className="text-red-500 text-sm">{errors.age}</span>}
          </Label>
          <Input
            id="age"
            type="number"
            placeholder="e.g., 35"
            value={age}
            onChange={(e) => {
              setAge(e.target.value);
              if (errors.age) setErrors({...errors, age: undefined});
            }}
            className={errors.age ? "border-red-500" : ""}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="restingHr" className="flex justify-between">
            <span>Resting Heart Rate (optional)</span>
            {errors.restingHr && <span className="text-red-500 text-sm">{errors.restingHr}</span>}
          </Label>
          <Input
            id="restingHr"
            type="number"
            placeholder="e.g., 60 bpm"
            value={restingHr}
            onChange={(e) => {
              setRestingHr(e.target.value);
              if (errors.restingHr) setErrors({...errors, restingHr: undefined});
            }}
            className={errors.restingHr ? "border-red-500" : ""}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Your resting heart rate is your heart rate when completely at rest, typically measured in the morning
          </p>
        </div>
      </div>
      
      <Button onClick={calculateHeartRateZones} className="w-full mb-6">
        Calculate Heart Rate Zones
      </Button>
      
      {maxHr && hrZones && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Your Heart Rate Zones</h3>
            {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
          </div>
          
          <div className="mb-4 p-3 bg-white rounded-md shadow-sm">
            <p className="text-sm text-gray-700">Maximum Heart Rate</p>
            <p className="font-bold text-2xl text-wellness-purple">{maxHr} <span className="text-sm">bpm</span></p>
            <p className="text-xs text-gray-500">Based on Tanaka formula: 208 - (0.7 × age)</p>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="grid grid-cols-2 gap-2">
              <div className="zone-card bg-wellness-softGreen p-3 rounded-md">
                <p className="text-sm font-medium">Recovery Zone (50-60%)</p>
                <p className="font-bold">{hrZones.recovery.min}-{hrZones.recovery.max} <span className="text-xs">bpm</span></p>
              </div>
              <div className="zone-card bg-wellness-softBlue p-3 rounded-md">
                <p className="text-sm font-medium">Aerobic Zone (60-70%)</p>
                <p className="font-bold">{hrZones.aerobic.min}-{hrZones.aerobic.max} <span className="text-xs">bpm</span></p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="zone-card bg-wellness-softPurple p-3 rounded-md">
                <p className="text-sm font-medium">Tempo Zone (70-80%)</p>
                <p className="font-bold">{hrZones.tempo.min}-{hrZones.tempo.max} <span className="text-xs">bpm</span></p>
              </div>
              <div className="zone-card bg-wellness-softOrange p-3 rounded-md">
                <p className="text-sm font-medium">Threshold Zone (80-90%)</p>
                <p className="font-bold">{hrZones.threshold.min}-{hrZones.threshold.max} <span className="text-xs">bpm</span></p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="zone-card bg-wellness-softPink p-3 rounded-md">
                <p className="text-sm font-medium">Anaerobic Zone (90-95%)</p>
                <p className="font-bold">{hrZones.anaerobic.min}-{hrZones.anaerobic.max} <span className="text-xs">bpm</span></p>
              </div>
              <div className="zone-card bg-red-100 p-3 rounded-md">
                <p className="text-sm font-medium">Maximal Zone (95-100%)</p>
                <p className="font-bold">{hrZones.maximal.min}-{hrZones.maximal.max} <span className="text-xs">bpm</span></p>
              </div>
            </div>
          </div>
          
          <div className="mb-4 space-y-2">
            <h4 className="font-medium">Training Benefits by Zone:</h4>
            <ul className="text-sm space-y-1">
              <li><span className="font-medium">Recovery (50-60%):</span> Improves recovery, perfect for warm-up and cool-down</li>
              <li><span className="font-medium">Aerobic (60-70%):</span> Builds endurance and improves fat metabolism</li>
              <li><span className="font-medium">Tempo (70-80%):</span> Improves aerobic fitness and efficiency</li>
              <li><span className="font-medium">Threshold (80-90%):</span> Increases lactate threshold and VO2 max</li>
              <li><span className="font-medium">Anaerobic (90-95%):</span> Builds speed and power</li>
              <li><span className="font-medium">Maximal (95-100%):</span> Improves maximum performance, use sparingly</li>
            </ul>
          </div>
          
          <ResultActions
            title="Heart Rate Zones Calculator"
            results={{
              "Maximum Heart Rate": `${maxHr} bpm`,
              "Recovery Zone (50-60%)": `${hrZones.recovery.min}-${hrZones.recovery.max} bpm`,
              "Aerobic Zone (60-70%)": `${hrZones.aerobic.min}-${hrZones.aerobic.max} bpm`,
              "Tempo Zone (70-80%)": `${hrZones.tempo.min}-${hrZones.tempo.max} bpm`,
              "Threshold Zone (80-90%)": `${hrZones.threshold.min}-${hrZones.threshold.max} bpm`,
              "Anaerobic Zone (90-95%)": `${hrZones.anaerobic.min}-${hrZones.anaerobic.max} bpm`,
              "Maximal Zone (95-100%)": `${hrZones.maximal.min}-${hrZones.maximal.max} bpm`,
              "Age": age,
              "Resting Heart Rate": restingHr ? `${restingHr} bpm` : "Not provided"
            }}
            fileName="Heart-Rate-Zones"
            userName={userName}
            unitSystem={unitSystem}
          />
          
          <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-dashed border-gray-200">
            Note: These zones are estimates based on formulas. Individual response to exercise intensity may vary. For most accurate results, consider professional testing.
          </p>
          
          <p className="text-center text-sm text-wellness-purple mt-4">
            Thank you for using SurviveWellness!
          </p>
        </div>
      )}
    </Card>
  );
};

export default HeartRateCalculator;
