
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDays, Copy, Share } from "lucide-react";
import { UnitSystem } from "@/types/calculatorTypes";
import { downloadResultsAsCSV, copyResultsToClipboard, shareResults } from "@/utils/downloadUtils";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";

interface MenstrualCycleCalculatorProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const MenstrualCycleCalculator: React.FC<MenstrualCycleCalculatorProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [lastPeriodDate, setLastPeriodDate] = useState<string>("");
  const [cycleLength, setCycleLength] = useState<string>("28");
  const [periodLength, setPeriodLength] = useState<string>("5");
  const [cycleResult, setCycleResult] = useState<{
    nextPeriod: string;
    ovulation: string;
    fertileWindow: string;
    nextThreePeriods: string[];
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const calculateCycle = () => {
    if (!lastPeriodDate) {
      showErrorToast("Please enter your last period start date");
      return;
    }
    
    const cycleLengthNum = parseInt(cycleLength || "28");
    const periodLengthNum = parseInt(periodLength || "5");
    
    if (cycleLengthNum < 21 || cycleLengthNum > 35) {
      showErrorToast("Please enter a cycle length between 21 and 35 days");
      return;
    }
    
    if (periodLengthNum < 2 || periodLengthNum > 10) {
      showErrorToast("Please enter a period length between 2 and 10 days");
      return;
    }
    
    const lastPeriod = new Date(lastPeriodDate);
    
    // Calculate next period date
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(nextPeriod.getDate() + cycleLengthNum);
    
    // Calculate ovulation date (typically 14 days before next period)
    const ovulation = new Date(nextPeriod);
    ovulation.setDate(ovulation.getDate() - 14);
    
    // Calculate fertile window (typically 5 days before and 1 day after ovulation)
    const fertileStart = new Date(ovulation);
    fertileStart.setDate(fertileStart.getDate() - 5);
    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(fertileEnd.getDate() + 1);
    
    // Calculate next three periods
    const nextPeriods = [];
    let periodDate = new Date(lastPeriod);
    
    for (let i = 0; i < 3; i++) {
      periodDate.setDate(periodDate.getDate() + cycleLengthNum);
      nextPeriods.push(new Date(periodDate).toLocaleDateString());
    }
    
    setCycleResult({
      nextPeriod: nextPeriod.toLocaleDateString(),
      ovulation: ovulation.toLocaleDateString(),
      fertileWindow: `${fertileStart.toLocaleDateString()} - ${fertileEnd.toLocaleDateString()}`,
      nextThreePeriods: nextPeriods
    });
  };

  const handleCopy = () => {
    if (!cycleResult) return;
    
    const results = {
      title: "Menstrual Cycle Calculator",
      results: {
        "Last Period Start Date": new Date(lastPeriodDate).toLocaleDateString(),
        "Cycle Length": `${cycleLength} days`,
        "Period Length": `${periodLength} days`,
        "Next Period Date": cycleResult.nextPeriod,
        "Ovulation Date": cycleResult.ovulation,
        "Fertile Window": cycleResult.fertileWindow,
        "Next Three Periods": cycleResult.nextThreePeriods.join(", ")
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
    if (!cycleResult) return;
    
    const results = {
      title: "Menstrual Cycle Calculator",
      results: {
        "Last Period Start Date": new Date(lastPeriodDate).toLocaleDateString(),
        "Cycle Length": `${cycleLength} days`,
        "Period Length": `${periodLength} days`,
        "Next Period Date": cycleResult.nextPeriod,
        "Ovulation Date": cycleResult.ovulation,
        "Fertile Window": cycleResult.fertileWindow,
        "Next Three Periods": cycleResult.nextThreePeriods.join(", ")
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    shareResults(results);
  };

  const handleDownload = () => {
    if (!cycleResult) return;
    
    const results = {
      title: "Menstrual Cycle Calculator",
      results: {
        "Last Period Start Date": new Date(lastPeriodDate).toLocaleDateString(),
        "Cycle Length": `${cycleLength} days`,
        "Period Length": `${periodLength} days`,
        "Next Period Date": cycleResult.nextPeriod,
        "Ovulation Date": cycleResult.ovulation,
        "Fertile Window": cycleResult.fertileWindow,
        "Next Three Periods": cycleResult.nextThreePeriods.join(", ")
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    downloadResultsAsCSV(results, "Menstrual-Cycle-Calculator");
    showSuccessToast("Results downloaded successfully!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Menstrual Cycle Calculator</h2>
      <p className="text-gray-600 mb-6 text-center">
        Track your menstrual cycle, ovulation, and fertile window
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
          <Label htmlFor="lastPeriodDate">First Day of Last Period</Label>
          <div className="relative">
            <Input
              id="lastPeriodDate"
              type="date"
              value={lastPeriodDate}
              onChange={(e) => setLastPeriodDate(e.target.value)}
              className="pl-10"
            />
            <CalendarDays className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cycleLength">Average Cycle Length (days)</Label>
            <Input
              id="cycleLength"
              type="number"
              placeholder="e.g., 28"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              min={21}
              max={35}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="periodLength">Average Period Length (days)</Label>
            <Input
              id="periodLength"
              type="number"
              placeholder="e.g., 5"
              value={periodLength}
              onChange={(e) => setPeriodLength(e.target.value)}
              min={2}
              max={10}
            />
          </div>
        </div>
      </div>
      
      <Button onClick={calculateCycle} className="w-full mb-6">
        Calculate Cycle
      </Button>
      
      {cycleResult && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-3">
            <h3 className="text-xl font-bold">Your Menstrual Cycle</h3>
            {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="bg-wellness-softPink p-3 rounded-md">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-wellness-pink" />
                <p className="text-sm text-gray-700">Next Period</p>
              </div>
              <p className="font-bold text-lg mt-1">{cycleResult.nextPeriod}</p>
            </div>
            
            <div className="bg-wellness-softPurple p-3 rounded-md">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-wellness-purple" />
                <p className="text-sm text-gray-700">Ovulation Day</p>
              </div>
              <p className="font-bold text-lg mt-1">{cycleResult.ovulation}</p>
            </div>
          </div>
          
          <div className="bg-wellness-softBlue p-4 rounded-md mb-4">
            <h4 className="font-medium mb-2 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-wellness-blue" />
              Fertile Window
            </h4>
            <p className="font-medium">{cycleResult.fertileWindow}</p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm mb-4">
            <h4 className="font-medium mb-2">Next Three Periods</h4>
            <ul className="space-y-2">
              {cycleResult.nextThreePeriods.map((date, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>Cycle {index + 1}</span>
                  <span className="font-medium">{date}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center">
                <Copy className="h-4 w-4 mr-1" />
                {copied ? "Copied!" : "Copy Results"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center">
                <Share className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                Download CSV
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-wellness-purple">
            <p>
              This calculator provides estimates based on regular cycles. 
              Actual cycles may vary due to many factors. Please consult with 
              a healthcare provider for personalized advice.
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

export default MenstrualCycleCalculator;
