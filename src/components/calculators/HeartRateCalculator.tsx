import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HeartRateCalcProps } from "@/types/calculatorTypes";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { Copy, Share, Download } from "lucide-react";
import { downloadResultsAsCSV, copyResultsToClipboard, shareResults } from "@/utils/downloadUtils";
import IntroSection from "@/components/calculator/IntroSection";

const HeartRateCalculator: React.FC<HeartRateCalcProps> = ({ unitSystem }) => {
  const [age, setAge] = useState<string>("");
  const [restingHr, setRestingHr] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [errors, setErrors] = useState<{age?: string}>({});
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
    const newErrors: {age?: string} = {};
    let isValid = true;
    
    if (!age.trim()) {
      newErrors.age = "Please enter your age";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const calculateHeartRateZones = () => {
    if (!validateInputs()) return;

    const ageValue = parseInt(age);
    const restingHrValue = restingHr ? parseInt(restingHr) : undefined;

    if (isNaN(ageValue) || ageValue <= 0 || ageValue > 120) {
      showErrorToast("Please enter a valid age between 1 and 120.");
      return;
    }

    if (restingHrValue !== undefined && (isNaN(restingHrValue) || restingHrValue <= 0 || restingHrValue > 200)) {
      showErrorToast("Please enter a valid resting heart rate between 1 and 200.");
      return;
    }

    const calculatedMaxHr = Math.round(208 - (0.7 * ageValue));
    const hrReserve = restingHrValue !== undefined ? calculatedMaxHr - restingHrValue : undefined;
    
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

  const prepareResults = () => {
    return {
      title: "Heart Rate Zones Calculator",
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || "User",
      results: {
        "Maximum Heart Rate": `${maxHr} bpm`,
        "Recovery Zone (50-60%)": `${hrZones?.recovery.min}-${hrZones?.recovery.max} bpm`,
        "Aerobic Zone (60-70%)": `${hrZones?.aerobic.min}-${hrZones?.aerobic.max} bpm`,
        "Tempo Zone (70-80%)": `${hrZones?.tempo.min}-${hrZones?.tempo.max} bpm`,
        "Threshold Zone (80-90%)": `${hrZones?.threshold.min}-${hrZones?.threshold.max} bpm`,
        "Anaerobic Zone (90-95%)": `${hrZones?.anaerobic.min}-${hrZones?.anaerobic.max} bpm`,
        "Maximal Zone (95-100%)": `${hrZones?.maximal.min}-${hrZones?.maximal.max} bpm`,
        "Age": age,
        "Resting Heart Rate": restingHr ? `${restingHr} bpm` : "Not provided",
      }
    };
  };

  const handleCopyResults = () => {
    if (!maxHr || !hrZones) return;
    const resultsData = prepareResults();
    copyResultsToClipboard(resultsData);
  };

  const handleShareResults = () => {
    if (!maxHr || !hrZones) return;
    const resultsData = prepareResults();
    shareResults(resultsData);
  };

  const handleDownloadResults = () => {
    if (!maxHr || !hrZones) return;
    const resultsData = prepareResults();
    downloadResultsAsCSV(resultsData, "Heart-Rate-Zones");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Heart Rate Zone Calculator</h2>
        <p className="text-gray-600 mb-4 text-center">
          Calculate your training heart rate zones based on your age
        </p>

        <div className="bg-wellness-softBlue/30 p-4 rounded-md mb-6">
          <h3 className="font-medium mb-1">What are Heart Rate Zones?</h3>
          <p className="text-sm text-gray-600">
            Heart rate zones are ranges that define the intensity of your workout based on your maximum heart rate. Training in different zones helps optimize cardiovascular fitness, endurance, and fat burning.
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
            <Label htmlFor="age" className="flex justify-between">
              Age
              {errors.age && <span className="text-red-500 text-sm">{errors.age}</span>}
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="e.g., 35"
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                if (e.target.value) setErrors({...errors, age: undefined});
              }}
              className={errors.age ? "border-red-500" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="restingHr" className="flex justify-between">
              Resting Heart Rate (optional)
            </Label>
            <Input
              id="restingHr"
              type="number"
              placeholder="e.g., 60 bpm"
              value={restingHr}
              onChange={(e) => setRestingHr(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              For more accurate zones, measure your resting heart rate in the morning before getting out of bed.
            </p>
          </div>
        </div>

        <Button onClick={calculateHeartRateZones} className="w-full mb-6 bg-wellness-blue hover:bg-wellness-blue/90">
          Calculate Heart Rate Zones
        </Button>

        {maxHr && hrZones && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md animate-fade-in">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold dark:text-white">Your Heart Rate Zones</h3>
              <p className="text-3xl font-bold my-2 result-highlight">Max HR: {maxHr} bpm</p>
              {userName && <p className="text-sm dark:text-gray-300">Results for: {userName}</p>}
            </div>

            <div className="grid gap-2 mb-4">
              <div className="bg-red-100 p-3 rounded-md">
                <p className="text-sm font-medium">Zone 5: Maximal (95-100%)</p>
                <p className="text-lg font-bold">{hrZones.maximal.min}-{hrZones.maximal.max} bpm</p>
                <p className="text-xs text-gray-600">Maximum effort, sprints, very short intervals</p>
              </div>
              
              <div className="bg-orange-100 p-3 rounded-md">
                <p className="text-sm font-medium">Zone 4: Anaerobic (90-95%)</p>
                <p className="text-lg font-bold">{hrZones.anaerobic.min}-{hrZones.anaerobic.max} bpm</p>
                <p className="text-xs text-gray-600">High intensity intervals, speed development</p>
              </div>
              
              <div className="bg-yellow-100 p-3 rounded-md">
                <p className="text-sm font-medium">Zone 3: Threshold (80-90%)</p>
                <p className="text-lg font-bold">{hrZones.threshold.min}-{hrZones.threshold.max} bpm</p>
                <p className="text-xs text-gray-600">Improve lactate threshold, race pace</p>
              </div>
              
              <div className="bg-green-100 p-3 rounded-md">
                <p className="text-sm font-medium">Zone 2: Tempo (70-80%)</p>
                <p className="text-lg font-bold">{hrZones.tempo.min}-{hrZones.tempo.max} bpm</p>
                <p className="text-xs text-gray-600">Improve endurance and efficiency</p>
              </div>
              
              <div className="bg-blue-100 p-3 rounded-md">
                <p className="text-sm font-medium">Zone 1: Aerobic (60-70%)</p>
                <p className="text-lg font-bold">{hrZones.aerobic.min}-{hrZones.aerobic.max} bpm</p>
                <p className="text-xs text-gray-600">Improves basic endurance and fat burning</p>
              </div>
              
              <div className="bg-purple-100 p-3 rounded-md">
                <p className="text-sm font-medium">Recovery (50-60%)</p>
                <p className="text-lg font-bold">{hrZones.recovery.min}-{hrZones.recovery.max} bmp</p>
                <p className="text-xs text-gray-600">Active recovery, warm up, cool down</p>
              </div>
            </div>

            <div className="mt-6 bg-wellness-softBlue/20 p-4 rounded-md">
              <Button id="heart-rate-learn-more" variant="outline" size="sm" className="w-full border-wellness-blue text-wellness-blue hover:bg-wellness-blue/10 dark:text-wellness-blue dark:border-wellness-blue">
                Know more about Heart Rate Zones
              </Button>
            </div>

            <div className="mt-4 mb-2">
              <p className="text-gray-600 dark:text-gray-400 mb-3">Based on the Tanaka formula and Karvonen method</p>
              <div className="flex flex-wrap gap-3 justify-start">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 bg-[#e6f7ff] text-[#0ea5e9] border-[#0ea5e9] hover:bg-[#d1edff]"
                  onClick={handleCopyResults}
                >
                  <Copy className="h-4 w-4" />
                  Copy Results
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 bg-[#eee6ff] text-[#8b5cf6] border-[#8b5cf6] hover:bg-[#e2d9f5]"
                  onClick={handleShareResults}
                >
                  <Share className="h-4 w-4" />
                  Share Link
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 bg-[#e6fff0] text-[#10b981] border-[#10b981] hover:bg-[#d1f7e4]"
                  onClick={handleDownloadResults}
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </Button>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-purple-500 dark:text-purple-400 font-medium mb-1">Thank you for using Survivewellness!</p>
              <p className="text-sm text-gray-500">For more calculators please visit our dedicated calculators section</p>
            </div>
          </div>
        )}
      </Card>

      <IntroSection calculatorId="heartrate" title="" description="" />
    </div>
  );
};

export default HeartRateCalculator;
