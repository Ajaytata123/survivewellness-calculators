
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Calendar } from "lucide-react";
import { format, addDays } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { BaseCalcProps } from "@/types/calculatorTypes";
import IntroSection from "@/components/calculator/IntroSection";
import ResultActions from "@/components/calculator/ResultActions";
import KnowMoreButton from "@/components/calculator/KnowMoreButton";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";

type CalendarDate = Date | undefined;

interface PeriodDay {
  date: Date;
  type: 'period' | 'ovulation' | 'fertile';
}

const PeriodCalculator: React.FC<BaseCalcProps> = ({ unitSystem }) => {
  const [userName, setUserName] = useState<string>("");
  const [lastPeriodDate, setLastPeriodDate] = useState<CalendarDate>(undefined);
  const [cycleLength, setCycleLength] = useState<string>("28");
  const [periodLength, setPeriodLength] = useState<string>("5");
  const [periodDays, setPeriodDays] = useState<PeriodDay[]>([]);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Reset errors when inputs change
  useEffect(() => {
    setErrors({});
  }, [lastPeriodDate, cycleLength, periodLength]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!lastPeriodDate) {
      newErrors.lastPeriodDate = "Last period date is required";
    }
    
    if (!cycleLength) {
      newErrors.cycleLength = "Cycle length is required";
    } else {
      const cycleDays = parseInt(cycleLength);
      if (isNaN(cycleDays) || cycleDays < 21 || cycleDays > 35) {
        newErrors.cycleLength = "Cycle length must be between 21-35 days";
      }
    }
    
    if (!periodLength) {
      newErrors.periodLength = "Period length is required";
    } else {
      const days = parseInt(periodLength);
      if (isNaN(days) || days < 2 || days > 10) {
        newErrors.periodLength = "Period length must be between 2-10 days";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePeriodCalendar = () => {
    if (!validateForm()) {
      showErrorToast("Please fill in all required fields correctly");
      return;
    }

    if (!lastPeriodDate) {
      showErrorToast("Please select your last period start date");
      return;
    }

    const cycleDays = parseInt(cycleLength);
    const periodDays = parseInt(periodLength);
    const resultDays: PeriodDay[] = [];

    // Calculate 6 cycles
    for (let i = 0; i < 6; i++) {
      // Period days
      const cycleStartDate = addDays(lastPeriodDate, i * cycleDays);
      
      for (let day = 0; day < periodDays; day++) {
        resultDays.push({
          date: addDays(cycleStartDate, day),
          type: 'period'
        });
      }
      
      // Ovulation day (typically cycle length - 14)
      const ovulationDate = addDays(cycleStartDate, cycleDays - 14);
      resultDays.push({
        date: ovulationDate,
        type: 'ovulation'
      });
      
      // Fertile window (typically 5 days before ovulation and the ovulation day)
      for (let day = 5; day > 0; day--) {
        resultDays.push({
          date: addDays(ovulationDate, -day),
          type: 'fertile'
        });
      }
    }

    setPeriodDays(resultDays);
    setCalendarMonth(lastPeriodDate);
    showSuccessToast("Period calendar calculated successfully!");
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('period-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const getDayClassName = (date: Date): string | undefined => {
    const matchingDay = periodDays.find(
      (day) => day.date.toDateString() === date.toDateString()
    );
    
    if (matchingDay) {
      return `rdp-day_${matchingDay.type}`;
    }
    
    return undefined;
  };

  const modifiers = {
    period: (date: Date) => 
      periodDays.some(day => 
        day.type === 'period' && day.date.toDateString() === date.toDateString()
      ),
    ovulation: (date: Date) => 
      periodDays.some(day => 
        day.type === 'ovulation' && day.date.toDateString() === date.toDateString()
      ),
    fertile: (date: Date) => 
      periodDays.some(day => 
        day.type === 'fertile' && day.date.toDateString() === date.toDateString()
      )
  };

  const NextPeriodInfo = () => {
    if (!lastPeriodDate || !cycleLength) return null;
    
    const cycleDays = parseInt(cycleLength);
    const nextPeriod = addDays(lastPeriodDate, cycleDays);
    const nextNextPeriod = addDays(lastPeriodDate, cycleDays * 2);
    const ovulationDate = addDays(lastPeriodDate, cycleDays - 14);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Next Period</p>
          <p className="text-lg font-bold text-wellness-pink dark:text-wellness-pink/90">
            {format(nextPeriod, "MMM d, yyyy")}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {Math.max(0, Math.floor((nextPeriod.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days from now
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Ovulation Day</p>
          <p className="text-lg font-bold text-wellness-purple dark:text-wellness-purple/90">
            {format(ovulationDate, "MMM d, yyyy")}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {Math.max(0, Math.floor((ovulationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days from now
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Period Calculator</h2>
      
      <IntroSection 
        title="What is a menstrual cycle?"
        description="The menstrual cycle is the monthly hormonal cycle a female's body goes through to prepare for pregnancy. Your cycle starts on the first day of your period and continues to the first day of your next period. Understanding your cycle can help you predict your fertile window and next period."
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
          <Label htmlFor="lastPeriod" className="flex justify-between">
            <span>First Day of Last Period</span>
            {errors.lastPeriodDate && <span className="text-red-500 text-sm">{errors.lastPeriodDate}</span>}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="lastPeriod"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !lastPeriodDate && "text-muted-foreground",
                  errors.lastPeriodDate && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {lastPeriodDate ? format(lastPeriodDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
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
            <Label htmlFor="cycleLength" className="flex justify-between">
              <span>Cycle Length (days)</span>
              {errors.cycleLength && <span className="text-red-500 text-sm">{errors.cycleLength}</span>}
            </Label>
            <Input
              id="cycleLength"
              type="number"
              min="21"
              max="35"
              placeholder="e.g., 28"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              className={errors.cycleLength ? "border-red-500" : ""}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Average is 28 days (21-35 days is normal)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="periodLength" className="flex justify-between">
              <span>Period Length (days)</span>
              {errors.periodLength && <span className="text-red-500 text-sm">{errors.periodLength}</span>}
            </Label>
            <Input
              id="periodLength"
              type="number"
              min="2"
              max="10"
              placeholder="e.g., 5"
              value={periodLength}
              onChange={(e) => setPeriodLength(e.target.value)}
              className={errors.periodLength ? "border-red-500" : ""}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Average is 5 days (2-10 days is normal)
            </p>
          </div>
        </div>
      </div>
      
      <Button onClick={calculatePeriodCalendar} className="w-full mb-6">
        Calculate Period Calendar
      </Button>
      
      {periodDays.length > 0 && (
        <div id="period-results" className="results-container">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Your Period Calendar</h3>
            {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
          </div>
          
          <NextPeriodInfo />
          
          <div className="mb-6 mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg">
            <CalendarComponent
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              modifiers={modifiers}
              modifiersClassNames={{
                period: "rdp-day_period",
                ovulation: "rdp-day_ovulation",
                fertile: "rdp-day_fertile",
              }}
              showOutsideDays={false}
              className="w-full pointer-events-auto"
            />
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-wellness-pink mr-2"></div>
                <span>Period Days</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-wellness-purple mr-2"></div>
                <span>Ovulation Day</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-wellness-softBlue mr-2"></div>
                <span>Fertile Window</span>
              </div>
            </div>
          </div>

          <ResultActions
            title="Period Calculator"
            results={{
              "Last Period Date": lastPeriodDate ? format(lastPeriodDate, "MMM d, yyyy") : "",
              "Cycle Length": `${cycleLength} days`,
              "Period Length": `${periodLength} days`,
              "Next Period": lastPeriodDate ? format(addDays(lastPeriodDate, parseInt(cycleLength)), "MMM d, yyyy") : "",
              "Next Ovulation": lastPeriodDate ? format(addDays(lastPeriodDate, parseInt(cycleLength) - 14), "MMM d, yyyy") : ""
            }}
            fileName="Period-Calculator"
            userName={userName}
            unitSystem={unitSystem}
          />
          
          <KnowMoreButton 
            calculatorName="Period Calculator"
            calculatorId="period"
          />
          
          <p className="disclaimer-text text-xs text-gray-500 mt-4 pt-4 border-t border-dashed border-gray-200">
            This calculator provides estimates based on the information you provided. Individual cycles may vary, and many factors can affect your period. Consult a healthcare provider for medical advice.
          </p>
          
          <p className="thank-you-text text-sm text-center text-wellness-blue mt-4">
            Thank you for using SurviveWellness!
          </p>
        </div>
      )}
    </Card>
  );
};

export default PeriodCalculator;
