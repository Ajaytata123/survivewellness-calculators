
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { UnitSystem } from "@/types/calculatorTypes";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import IntroSection from "@/components/calculator/IntroSection";
import { format, addDays } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";
import "@/components/ui/period-calendar-styles.css";

interface PeriodCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

interface PeriodDay {
  date: Date;
  type: 'period' | 'ovulation' | 'fertile';
}

const PeriodCalculator: React.FC<PeriodCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>(undefined);
  const [cycleLength, setCycleLength] = useState<string>("28");
  const [periodLength, setPeriodLength] = useState<string>("5");
  const [periodDays, setPeriodDays] = useState<PeriodDay[]>([]);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [predictions, setPredictions] = useState<{
    nextPeriod: Date;
    ovulation: Date;
    fertileDays: { start: Date; end: Date };
    nextThreePeriods: Date[];
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
      const cycleLengthNum = parseInt(cycleLength);
      if (isNaN(cycleLengthNum) || cycleLengthNum < 21 || cycleLengthNum > 35) {
        newErrors.cycleLength = "Please enter a valid cycle length between 21-35 days";
      }
    }

    if (!periodLength) {
      newErrors.periodLength = "Period length is required";
    } else {
      const periodLengthNum = parseInt(periodLength);
      if (isNaN(periodLengthNum) || periodLengthNum < 3 || periodLengthNum > 8) {
        newErrors.periodLength = "Please enter a valid period length between 3-8 days";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePeriodPredictions = () => {
    if (!validateForm()) {
      showErrorToast("Please fill in all required fields correctly");
      return;
    }

    if (!lastPeriodDate) {
      showErrorToast("Please select your last period date");
      return;
    }

    const cycleLengthNum = parseInt(cycleLength);
    const periodLengthNum = parseInt(periodLength);

    // Calculate next period
    const nextPeriod = addDays(lastPeriodDate, cycleLengthNum);
    
    // Calculate ovulation (typically 14 days before next period)
    const ovulation = addDays(nextPeriod, -14);
    
    // Calculate fertile window (5 days before ovulation + ovulation day)
    const fertileDays = {
      start: addDays(ovulation, -5),
      end: ovulation
    };

    // Calculate next 3 periods
    const nextThreePeriods = [
      nextPeriod,
      addDays(nextPeriod, cycleLengthNum),
      addDays(nextPeriod, cycleLengthNum * 2)
    ];

    setPredictions({
      nextPeriod,
      ovulation,
      fertileDays,
      nextThreePeriods
    });

    // Calculate calendar days
    const resultDays: PeriodDay[] = [];

    // Current period days
    for (let day = 0; day < periodLengthNum; day++) {
      resultDays.push({
        date: addDays(lastPeriodDate, day),
        type: 'period'
      });
    }
    
    // Next period
    for (let day = 0; day < periodLengthNum; day++) {
      resultDays.push({
        date: addDays(nextPeriod, day),
        type: 'period'
      });
    }
    
    // Ovulation day
    resultDays.push({
      date: ovulation,
      type: 'ovulation'
    });
    
    // Fertile window
    for (let day = -5; day <= 0; day++) {
      if (day !== 0) { // Skip ovulation day (already added)
        resultDays.push({
          date: addDays(ovulation, day),
          type: 'fertile'
        });
      }
    }
    
    setPeriodDays(resultDays);
    setCalendarMonth(lastPeriodDate);
    showSuccessToast("Period predictions calculated successfully!");

    // Scroll to results
    setTimeout(() => {
      document.getElementById('period-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Period Calculator</h2>
        <p className="text-gray-600 mb-4 text-center">
          Track your menstrual cycle and predict your next period
        </p>

        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="userName" className="block text-left">Your Name (optional)</Label>
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
            label="Last Period Start Date"
            placeholder="Select date"
            id="lastPeriod"
            error={errors.lastPeriodDate}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cycleLength" className="block text-left">Cycle Length (days)</Label>
              <Input
                id="cycleLength"
                type="number"
                placeholder="e.g., 28"
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
                className={errors.cycleLength ? "border-red-500" : ""}
              />
              {errors.cycleLength && <p className="text-red-500 text-sm">{errors.cycleLength}</p>}
              <p className="text-sm text-gray-500">
                Average cycle is 28 days (21-35 is normal)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodLength" className="block text-left">Period Length (days)</Label>
              <Input
                id="periodLength"
                type="number"
                placeholder="e.g., 5"
                value={periodLength}
                onChange={(e) => setPeriodLength(e.target.value)}
                className={errors.periodLength ? "border-red-500" : ""}
              />
              {errors.periodLength && <p className="text-red-500 text-sm">{errors.periodLength}</p>}
              <p className="text-sm text-gray-500">
                How many days does your period last?
              </p>
            </div>
          </div>
        </div>

        <Button onClick={calculatePeriodPredictions} className="w-full mb-6">
          Calculate Period Predictions
        </Button>

        {predictions && (
          <div id="period-results" className="results-container">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Your Period Predictions</h3>
              {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
            </div>

            <div className="space-y-4">
              <div className="bg-wellness-softPink dark:bg-wellness-softPink/30 p-3 rounded-md">
                <p className="text-sm text-gray-700 dark:text-gray-300">Next Period</p>
                <p className="font-bold text-lg">
                  {format(predictions.nextPeriod, "MMM dd, yyyy")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Expected start date of your next period
                </p>
              </div>

              <div className="result-highlight p-3 rounded-md">
                <p className="text-sm text-gray-700 dark:text-gray-300">Ovulation Date</p>
                <p className="font-bold text-lg text-wellness-purple dark:text-wellness-purple/90">
                  {format(predictions.ovulation, "MMM dd, yyyy")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Estimated ovulation date
                </p>
              </div>

              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-md">
                <p className="text-sm text-gray-700 dark:text-gray-300">Fertile Window</p>
                <p className="font-bold text-lg">
                  {format(predictions.fertileDays.start, "MMM dd")} - {format(predictions.fertileDays.end, "MMM dd, yyyy")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Most fertile days for conception
                </p>
              </div>
            </div>

            <div className="mb-6 mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg border">
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
                className="w-full pointer-events-auto"
              />
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-pink-400 mr-2"></div>
                  <span>Period Days</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-purple-600 mr-2"></div>
                  <span>Ovulation Day</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-400 mr-2"></div>
                  <span>Fertile Window</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-3 rounded-md">
              <h4 className="font-medium mb-2">Next 3 Periods:</h4>
              <ul className="space-y-1">
                {predictions.nextThreePeriods.map((date, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-medium">Period {index + 1}:</span> {format(date, "MMM dd, yyyy")}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium">Important Notes:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>These are estimates based on average cycles</li>
                <li>Actual dates may vary due to stress, illness, or other factors</li>
                <li>Track your cycles for more accurate predictions</li>
                <li>Consult a healthcare provider for irregular cycles</li>
              </ul>
            </div>
            
            <div className="mt-6 text-center text-sm text-wellness-purple">
              <p>Thank you for using Survive<span className="lowercase">w</span>ellness!</p>
            </div>
          </div>
        )}
      </Card>

      <IntroSection calculatorId="period" title="" description="" />
    </div>
  );
};

export default PeriodCalculator;
