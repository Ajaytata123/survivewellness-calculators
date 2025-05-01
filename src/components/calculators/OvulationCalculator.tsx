
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Copy, Share, Download } from "lucide-react";
import { downloadResultsAsCSV, copyResultsToClipboard, shareResults } from "@/utils/downloadUtils";
import { showSuccessToast } from "@/utils/notificationUtils";
import { OvulationCalcProps } from "@/types/calculatorTypes";

const OvulationCalculator: React.FC<OvulationCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [lastPeriodDate, setLastPeriodDate] = useState<string>("");
  const [cycleLength, setCycleLength] = useState<string>("28");
  const [regularCycle, setRegularCycle] = useState<"yes" | "no">("yes");
  const [ovulationResult, setOvulationResult] = useState<{
    cycleLength: number;
    fertileWindowStart: string;
    fertileWindowEnd: string;
    ovulationDate: string;
    nextPeriodDate: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const calculateOvulation = () => {
    if (!lastPeriodDate) {
      showSuccessToast("Please enter your last period start date");
      return;
    }

    const cycleVal = parseInt(cycleLength);
    if (isNaN(cycleVal) || cycleVal < 21 || cycleVal > 45) {
      showSuccessToast("Please enter a valid cycle length between 21 and 45 days");
      return;
    }

    // Parse the last period start date
    const lastPeriod = new Date(lastPeriodDate);
    
    // Calculate ovulation day (typically cycle length - 14 days from the period start)
    const ovulationDay = new Date(lastPeriod);
    ovulationDay.setDate(lastPeriod.getDate() + cycleVal - 14);
    
    // Calculate fertile window (5 days before ovulation through 1 day after)
    const fertileStart = new Date(ovulationDay);
    fertileStart.setDate(ovulationDay.getDate() - 5);
    
    const fertileEnd = new Date(ovulationDay);
    fertileEnd.setDate(ovulationDay.getDate() + 1);
    
    // Calculate next period start date
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(lastPeriod.getDate() + cycleVal);
    
    setOvulationResult({
      cycleLength: cycleVal,
      fertileWindowStart: fertileStart.toLocaleDateString(),
      fertileWindowEnd: fertileEnd.toLocaleDateString(),
      ovulationDate: ovulationDay.toLocaleDateString(),
      nextPeriodDate: nextPeriod.toLocaleDateString()
    });
  };

  const handleCopy = () => {
    if (!ovulationResult) return;
    
    const results = {
      title: "Ovulation Calculator",
      results: {
        "Last Period Date": new Date(lastPeriodDate).toLocaleDateString(),
        "Cycle Length": ovulationResult.cycleLength.toString() + " days",
        "Regular Cycle": regularCycle === "yes" ? "Yes" : "No",
        "Fertile Window": `${ovulationResult.fertileWindowStart} to ${ovulationResult.fertileWindowEnd}`,
        "Expected Ovulation Date": ovulationResult.ovulationDate,
        "Next Period Date": ovulationResult.nextPeriodDate
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
    if (!ovulationResult) return;
    
    const results = {
      title: "Ovulation Calculator",
      results: {
        "Last Period Date": new Date(lastPeriodDate).toLocaleDateString(),
        "Cycle Length": ovulationResult.cycleLength.toString() + " days",
        "Regular Cycle": regularCycle === "yes" ? "Yes" : "No",
        "Fertile Window": `${ovulationResult.fertileWindowStart} to ${ovulationResult.fertileWindowEnd}`,
        "Expected Ovulation Date": ovulationResult.ovulationDate,
        "Next Period Date": ovulationResult.nextPeriodDate
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    shareResults(results);
  };

  const handleDownload = () => {
    if (!ovulationResult) return;
    
    const results = {
      title: "Ovulation Calculator",
      results: {
        "Last Period Date": new Date(lastPeriodDate).toLocaleDateString(),
        "Cycle Length": ovulationResult.cycleLength.toString() + " days",
        "Regular Cycle": regularCycle === "yes" ? "Yes" : "No",
        "Fertile Window": `${ovulationResult.fertileWindowStart} to ${ovulationResult.fertileWindowEnd}`,
        "Expected Ovulation Date": ovulationResult.ovulationDate,
        "Next Period Date": ovulationResult.nextPeriodDate
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    downloadResultsAsCSV(results, "Ovulation-Calculator");
    showSuccessToast("Results downloaded successfully!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Ovulation Calculator</h2>
      <p className="text-gray-600 mb-6 text-center">
        Track your fertility window and ovulation date
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
          <Label htmlFor="lastPeriod">First Day of Last Period</Label>
          <div className="relative">
            <Input
              id="lastPeriod"
              type="date"
              value={lastPeriodDate}
              onChange={(e) => setLastPeriodDate(e.target.value)}
              className="pl-10"
            />
            <CalendarDays className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cycleLength">Average Cycle Length (days)</Label>
          <Select value={cycleLength} onValueChange={setCycleLength}>
            <SelectTrigger id="cycleLength">
              <SelectValue placeholder="Select cycle length" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(25)].map((_, i) => (
                <SelectItem key={i} value={(i + 21).toString()}>
                  {i + 21} days
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">
            A typical cycle length is 28 days, but can range from 21 to 45 days
          </p>
        </div>
        
        <div className="space-y-2">
          <Label>Do you have regular periods?</Label>
          <RadioGroup
            value={regularCycle}
            onValueChange={(value) => setRegularCycle(value as "yes" | "no")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="regular-yes" />
              <Label htmlFor="regular-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="regular-no" />
              <Label htmlFor="regular-no">No</Label>
            </div>
          </RadioGroup>
          {regularCycle === "no" && (
            <p className="text-sm text-wellness-red">
              Note: These calculations may be less accurate if your cycles are irregular
            </p>
          )}
        </div>
      </div>
      
      <Button onClick={calculateOvulation} className="w-full mb-6">
        Calculate
      </Button>
      
      {ovulationResult && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Ovulation Results</h3>
            {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
          </div>
          
          <div className="space-y-4">
            <div className="bg-wellness-softPink p-3 rounded-md">
              <p className="text-sm text-gray-700">Fertile Window</p>
              <p className="font-bold text-lg">
                {ovulationResult.fertileWindowStart} - {ovulationResult.fertileWindowEnd}
              </p>
              <p className="text-sm text-gray-600">
                These are your most fertile days when pregnancy is most likely
              </p>
            </div>
            
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-sm text-gray-700">Estimated Ovulation Date</p>
              <p className="font-bold text-lg text-wellness-pink">{ovulationResult.ovulationDate}</p>
              <p className="text-sm text-gray-600">
                This is when an egg is likely released and can be fertilized
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-700">Cycle Length</p>
                <p className="font-bold text-lg">{ovulationResult.cycleLength} days</p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-700">Next Period Expected</p>
                <p className="font-bold text-lg">{ovulationResult.nextPeriodDate}</p>
              </div>
            </div>
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
              This calculator provides estimates based on average cycle patterns.
              Individual cycles may vary, especially if you have irregular periods.
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

export default OvulationCalculator;
