
import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Copy, Share, Info, AlertCircle } from "lucide-react";
import { UnitSystem } from "@/types/calculatorTypes";
import { downloadResultsAsCSV, copyResultsToClipboard, shareResults } from "@/utils/downloadUtils";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, differenceInDays, isWithinInterval } from "date-fns";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface MenstrualCycleCalculatorProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

// Calendar day types for styling
type DayType = "period" | "fertile" | "ovulation" | "normal";

// Custom styling for calendar days
const dayClassNames: Record<DayType, string> = {
  period: "bg-wellness-pink text-white hover:bg-wellness-pink",
  fertile: "bg-wellness-softBlue text-wellness-blue hover:bg-wellness-softBlue",
  ovulation: "bg-wellness-purple text-white hover:bg-wellness-purple",
  normal: ""
};

const MenstrualCycleCalculator: React.FC<MenstrualCycleCalculatorProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>(undefined);
  const [cycleLength, setCycleLength] = useState<string>("28");
  const [periodLength, setPeriodLength] = useState<string>("5");
  const [cycleResult, setCycleResult] = useState<{
    nextPeriod: Date;
    ovulation: Date;
    fertileStart: Date;
    fertileEnd: Date;
    nextThreePeriods: Date[];
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

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
    
    // Calculate next period date
    const nextPeriod = addDays(lastPeriodDate, cycleLengthNum);
    
    // Calculate ovulation date (typically 14 days before next period)
    const ovulation = addDays(nextPeriod, -14);
    
    // Calculate fertile window (typically 5 days before and 1 day after ovulation)
    const fertileStart = addDays(ovulation, -5);
    const fertileEnd = addDays(ovulation, 1);
    
    // Calculate next three periods
    const nextPeriods = [];
    let periodDate = lastPeriodDate;
    
    for (let i = 0; i < 3; i++) {
      periodDate = addDays(periodDate, cycleLengthNum);
      nextPeriods.push(periodDate);
    }
    
    setCycleResult({
      nextPeriod,
      ovulation,
      fertileStart,
      fertileEnd,
      nextThreePeriods: nextPeriods
    });

    // Set calendar month to show the next period
    setCalendarMonth(nextPeriod);
  };

  // Function to determine day type for calendar styling
  const getDayType = (date: Date): DayType => {
    if (!cycleResult || !lastPeriodDate) return "normal";

    // Check if date is within period
    const isInFirstPeriod = isWithinInterval(date, {
      start: lastPeriodDate,
      end: addDays(lastPeriodDate, parseInt(periodLength) - 1)
    });

    if (isInFirstPeriod) return "period";

    // Check for subsequent periods
    for (const periodStart of cycleResult.nextThreePeriods) {
      const isInPeriod = isWithinInterval(date, {
        start: periodStart,
        end: addDays(periodStart, parseInt(periodLength) - 1)
      });
      if (isInPeriod) return "period";
    }

    // Check if date is ovulation day
    if (cycleResult.ovulation.toDateString() === date.toDateString()) {
      return "ovulation";
    }

    // Check if date is in fertile window
    const isInFertileWindow = isWithinInterval(date, {
      start: cycleResult.fertileStart,
      end: cycleResult.fertileEnd
    });

    if (isInFertileWindow) return "fertile";

    return "normal";
  };

  const handleCopy = () => {
    if (!cycleResult || !lastPeriodDate) return;
    
    const results = {
      title: "Menstrual Cycle Calculator",
      results: {
        "Last Period Start Date": format(lastPeriodDate, "PP"),
        "Cycle Length": `${cycleLength} days`,
        "Period Length": `${periodLength} days`,
        "Next Period Date": format(cycleResult.nextPeriod, "PP"),
        "Ovulation Date": format(cycleResult.ovulation, "PP"),
        "Fertile Window": `${format(cycleResult.fertileStart, "PP")} - ${format(cycleResult.fertileEnd, "PP")}`,
        "Next Three Periods": cycleResult.nextThreePeriods.map(d => format(d, "PP")).join(", ")
      },
      date: format(new Date(), "PP"),
      unitSystem,
      userName: userName || undefined
    };
    
    copyResultsToClipboard(results);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!cycleResult || !lastPeriodDate) return;
    
    const results = {
      title: "Menstrual Cycle Calculator",
      results: {
        "Last Period Start Date": format(lastPeriodDate, "PP"),
        "Cycle Length": `${cycleLength} days`,
        "Period Length": `${periodLength} days`,
        "Next Period Date": format(cycleResult.nextPeriod, "PP"),
        "Ovulation Date": format(cycleResult.ovulation, "PP"),
        "Fertile Window": `${format(cycleResult.fertileStart, "PP")} - ${format(cycleResult.fertileEnd, "PP")}`,
        "Next Three Periods": cycleResult.nextThreePeriods.map(d => format(d, "PP")).join(", ")
      },
      date: format(new Date(), "PP"),
      unitSystem,
      userName: userName || undefined
    };
    
    shareResults(results);
  };

  const handleDownload = () => {
    if (!cycleResult || !lastPeriodDate) return;
    
    const results = {
      title: "Menstrual Cycle Calculator",
      results: {
        "Last Period Start Date": format(lastPeriodDate, "PP"),
        "Cycle Length": `${cycleLength} days`,
        "Period Length": `${periodLength} days`,
        "Next Period Date": format(cycleResult.nextPeriod, "PP"),
        "Ovulation Date": format(cycleResult.ovulation, "PP"),
        "Fertile Window": `${format(cycleResult.fertileStart, "PP")} - ${format(cycleResult.fertileEnd, "PP")}`,
        "Next Three Periods": cycleResult.nextThreePeriods.map(d => format(d, "PP")).join(", ")
      },
      date: format(new Date(), "PP"),
      unitSystem,
      userName: userName || undefined
    };
    
    downloadResultsAsCSV(results, "Menstrual-Cycle-Calculator");
    showSuccessToast("Results downloaded successfully!");
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-1 text-wellness-purple">Menstrual Cycle Calculator</h2>
          <p className="text-gray-600 text-sm">
            Track your menstrual cycle, ovulation, and fertile window
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              <Info className="h-4 w-4 mr-1" />
              About
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" id="cycle-calculator-info">
            <div className="space-y-2">
              <h4 className="font-medium">About Menstrual Cycle Calculator</h4>
              <p className="text-sm text-gray-600">
                This calculator helps you track your menstrual cycle, predict your next periods, 
                identify your fertile window, and determine your ovulation date.
              </p>
              <p className="text-sm text-gray-600">
                Understanding your cycle can help with family planning, managing symptoms, 
                and maintaining overall reproductive health.
              </p>
              <Button variant="link" size="sm" className="p-0 h-auto text-wellness-purple">Know More</Button>
            </div>
          </PopoverContent>
        </Popover>
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
          <Label htmlFor="lastPeriodDate">First Day of Last Period</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {lastPeriodDate ? format(lastPeriodDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={lastPeriodDate}
                onSelect={setLastPeriodDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
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
      
      {cycleResult && lastPeriodDate && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-3">
            <h3 className="text-xl font-bold text-wellness-purple">Your Menstrual Cycle</h3>
            {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="bg-wellness-softPink p-3 rounded-md">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-wellness-pink" />
                <p className="text-sm text-gray-700">Next Period</p>
              </div>
              <p className="font-bold text-lg mt-1">{format(cycleResult.nextPeriod, "PPP")}</p>
            </div>
            
            <div className="bg-wellness-softPurple p-3 rounded-md">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-wellness-purple" />
                <p className="text-sm text-gray-700">Ovulation Day</p>
              </div>
              <p className="font-bold text-lg mt-1">{format(cycleResult.ovulation, "PPP")}</p>
            </div>
          </div>
          
          <div className="bg-wellness-softBlue p-4 rounded-md mb-4">
            <h4 className="font-medium mb-2 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-wellness-blue" />
              Fertile Window
            </h4>
            <p className="font-medium">
              {format(cycleResult.fertileStart, "PPP")} - {format(cycleResult.fertileEnd, "PPP")}
            </p>
          </div>
          
          {/* Calendar visualization */}
          <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium mb-2">Calendar View</h4>
            <Calendar
              mode="single"
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              selected={lastPeriodDate}
              className="p-2 border rounded-md w-full"
              modifiers={{
                period: (date) => getDayType(date) === "period",
                ovulation: (date) => getDayType(date) === "ovulation",
                fertile: (date) => getDayType(date) === "fertile"
              }}
              modifiersClassNames={{
                period: "bg-wellness-pink text-white hover:bg-wellness-pink",
                ovulation: "bg-wellness-purple text-white hover:bg-wellness-purple",
                fertile: "bg-wellness-softBlue text-wellness-blue hover:bg-wellness-softBlue"
              }}
            />
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-wellness-pink mr-1"></span>
                <span>Period</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-wellness-purple mr-1"></span>
                <span>Ovulation</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-wellness-softBlue mr-1"></span>
                <span>Fertile Window</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm mb-4">
            <h4 className="font-medium mb-2">Next Three Periods</h4>
            <ul className="space-y-2">
              {cycleResult.nextThreePeriods.map((date, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>Cycle {index + 1}</span>
                  <span className="font-medium">{format(date, "PPP")}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Accordion type="single" collapsible className="bg-white rounded-lg shadow-sm mb-4">
            <AccordionItem value="fertility-window">
              <AccordionTrigger className="px-4 py-2">
                <div className="flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  <span>Understanding Your Fertility Window</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 text-sm text-gray-600">
                <p>
                  Your fertility window is the time during your menstrual cycle when pregnancy is possible. 
                  This window includes the day of ovulation and the five days before it. Sperm can survive 
                  in the female reproductive tract for up to 5 days, which is why the days before ovulation 
                  are included in your fertile window.
                </p>
                <p className="mt-2">
                  The egg released during ovulation lives for only about 24 hours, so the day of ovulation 
                  and the days immediately before it are when you're most likely to conceive.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
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
          
          <div className="mt-6 text-center text-sm text-gray-500 bg-wellness-softPurple/20 p-3 rounded-md">
            <div className="flex items-center justify-center mb-2">
              <AlertCircle className="h-4 w-4 mr-1 text-wellness-purple" />
              <span className="font-medium text-wellness-purple">Important note</span>
            </div>
            <p>
              This calculator provides estimates based on regular cycles. 
              Actual cycles may vary due to many factors. Please consult with 
              a healthcare provider for personalized advice.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default MenstrualCycleCalculator;
