import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { OvulationCalcProps } from "@/types/calculatorTypes";
import IntroSection from "@/components/calculator/IntroSection";
import ResultActions from "@/components/calculator/ResultActions";
import KnowMoreButton from "@/components/calculator/KnowMoreButton";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { DatePicker } from "@/components/ui/date-picker";

type CalendarDate = Date | undefined;

interface PeriodDay {
  date: Date;
  type: 'period' | 'ovulation' | 'fertile';
}

const OvulationCalculator: React.FC<OvulationCalcProps> = ({ unitSystem }) => {
  const [userName, setUserName] = useState<string>("");
  const [lastPeriodDate, setLastPeriodDate] = useState<CalendarDate>(undefined);
  const [cycleLength, setCycleLength] = useState<string>("28");
  const [regularCycle, setRegularCycle] = useState<"yes" | "no">("yes");
  const [periodDays, setPeriodDays] = useState<PeriodDay[]>([]);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [ovulationResult, setOvulationResult] = useState<{
    cycleLength: number;
    fertileWindowStart: Date;
    fertileWindowEnd: Date;
    ovulationDate: Date;
    nextPeriodDate: Date;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!lastPeriodDate) {
      newErrors.lastPeriodDate = "Please select your last period start date";
    }
    
    if (!cycleLength) {
      newErrors.cycleLength = "Cycle length is required";
    } else {
      const cycleLengthValue = parseInt(cycleLength);
      if (isNaN(cycleLengthValue) || cycleLengthValue < 21 || cycleLengthValue > 45) {
        newErrors.cycleLength = "Please enter a valid cycle length between 21 and 45 days";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateOvulation = () => {
    if (!validateForm()) {
      showErrorToast("Please fill in all required fields correctly");
      return;
    }

    if (!lastPeriodDate) {
      showErrorToast("Please select your last period start date");
      return;
    }

    const cycleVal = parseInt(cycleLength);
    
    // Calculate ovulation day (typically cycle length - 14 days from the period start)
    const ovulationDay = addDays(lastPeriodDate, cycleVal - 14);
    
    // Calculate fertile window (5 days before ovulation through 1 day after)
    const fertileStart = addDays(ovulationDay, -5);
    const fertileEnd = addDays(ovulationDay, 1);
    
    // Calculate next period start date
    const nextPeriod = addDays(lastPeriodDate, cycleVal);
    
    setOvulationResult({
      cycleLength: cycleVal,
      fertileWindowStart: fertileStart,
      fertileWindowEnd: fertileEnd,
      ovulationDate: ovulationDay,
      nextPeriodDate: nextPeriod
    });

    // Calculate calendar days
    const resultDays: PeriodDay[] = [];

    // Period days (assuming 5 days)
    for (let day = 0; day < 5; day++) {
      resultDays.push({
        date: addDays(lastPeriodDate, day),
        type: 'period'
      });
    }
    
    // Next period
    for (let day = 0; day < 5; day++) {
      resultDays.push({
        date: addDays(nextPeriod, day),
        type: 'period'
      });
    }
    
    // Ovulation day
    resultDays.push({
      date: ovulationDay,
      type: 'ovulation'
    });
    
    // Fertile window
    for (let day = -5; day <= 1; day++) {
      if (day !== 0) { // Skip ovulation day (already added)
        resultDays.push({
          date: addDays(ovulationDay, day),
          type: 'fertile'
        });
      }
    }
    
    setPeriodDays(resultDays);
    setCalendarMonth(lastPeriodDate);
    showSuccessToast("Ovulation calculated successfully!");
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('ovulation-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
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

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Ovulation Calculator</h2>
      
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
        
        <DatePicker
          date={lastPeriodDate}
          onDateChange={setLastPeriodDate}
          label="First Day of Last Period"
          placeholder="Select date"
          id="lastPeriod"
          error={errors.lastPeriodDate}
        />
        
        <div className="space-y-2">
          <Label htmlFor="cycleLength">Average Cycle Length (days)</Label>
          <Select value={cycleLength} onValueChange={setCycleLength}>
            <SelectTrigger id="cycleLength" className={errors.cycleLength ? "input-error" : ""}>
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
          {errors.cycleLength && <p className="error-message">{errors.cycleLength}</p>}
          <p className="text-xs text-gray-500 dark:text-gray-400">
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
            <p className="text-sm text-red-500 dark:text-red-400">
              Note: These calculations may be less accurate if your cycles are irregular
            </p>
          )}
        </div>
      </div>
      
      <Button onClick={calculateOvulation} className="w-full mb-6">
        Calculate
      </Button>
      
      {ovulationResult && (
        <div id="ovulation-results" className="results-container">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Ovulation Results</h3>
            {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
          </div>
          
          <div className="space-y-4">
            <div className="bg-wellness-softPink dark:bg-wellness-softPink/30 p-3 rounded-md">
              <p className="text-sm text-gray-700 dark:text-gray-300">Fertile Window</p>
              <p className="font-bold text-lg">
                {format(ovulationResult.fertileWindowStart, "MMM d")} - {format(ovulationResult.fertileWindowEnd, "MMM d, yyyy")}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                These are your most fertile days when pregnancy is most likely
              </p>
            </div>
            
            <div className="result-highlight p-3 rounded-md">
              <p className="text-sm text-gray-700 dark:text-gray-300">Estimated Ovulation Date</p>
              <p className="font-bold text-lg text-wellness-purple dark:text-wellness-purple/90">
                {format(ovulationResult.ovulationDate, "MMMM d, yyyy")}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This is when an egg is likely released and can be fertilized
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-700 dark:text-gray-300">Cycle Length</p>
                <p className="font-bold text-lg">{ovulationResult.cycleLength} days</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-700 dark:text-gray-300">Next Period Expected</p>
                <p className="font-bold text-lg">{format(ovulationResult.nextPeriodDate, "MMMM d, yyyy")}</p>
              </div>
            </div>
          </div>

          <div className="mb-6 mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg">
            <Calendar
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              modifiers={modifiers}
              modifiersClassNames={{
                period: "rdp-day_period",
                ovulation: "rdp-day_ovulation",
                fertile: "rdp-day_fertile",
              }}
              showOutsideDays={false}
              className="w-full"
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
            title="Ovulation Calculator"
            results={{
              "Last Period Date": lastPeriodDate ? format(lastPeriodDate, "MMM d, yyyy") : "",
              "Cycle Length": `${ovulationResult.cycleLength.toString()} days`,
              "Regular Cycle": regularCycle === "yes" ? "Yes" : "No",
              "Fertile Window": `${format(ovulationResult.fertileWindowStart, "MMM d")} to ${format(ovulationResult.fertileWindowEnd, "MMM d, yyyy")}`,
              "Expected Ovulation Date": format(ovulationResult.ovulationDate, "MMM d, yyyy"),
              "Next Period Date": format(ovulationResult.nextPeriodDate, "MMM d, yyyy")
            }}
            fileName="Ovulation-Calculator"
            userName={userName}
            unitSystem={unitSystem}
          />
          
          <KnowMoreButton 
            calculatorName="Ovulation Calculator"
            calculatorId="ovulation"
          />

          <div className="intro-section mt-6">
            <h4 className="text-base font-medium text-wellness-blue mb-2">Understanding Your Fertility Window</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Your fertility window is the time during your menstrual cycle when pregnancy is possible. This window includes the day of ovulation and the five days before it.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Sperm can survive in the female reproductive tract for up to 5 days, which is why the days before ovulation are included in your fertile window.
            </p>
          </div>
          
          <p className="disclaimer-text">
            This calculator provides estimates based on average cycle patterns.
            Individual cycles may vary, especially if you have irregular periods.
          </p>
          
          <p className="thank-you-text">
            Thank you for using SurviveWellness!
          </p>
        </div>
      )}
      
      <IntroSection calculatorId="ovulation" title="" description="" />
    </Card>
  );
};

export default OvulationCalculator;
