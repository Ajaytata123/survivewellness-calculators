
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { UnitSystem } from "@/types/calculatorTypes";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import IntroSection from "@/components/calculator/IntroSection";
import { format, addDays, addMonths } from "date-fns";

interface PeriodCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const PeriodCalculator: React.FC<PeriodCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>(undefined);
  const [cycleLength, setCycleLength] = useState<string>("28");
  const [periodLength, setPeriodLength] = useState<string>("5");
  const [predictions, setPredictions] = useState<{
    nextPeriod: Date;
    ovulation: Date;
    fertileDays: { start: Date; end: Date };
    nextThreePeriods: Date[];
  } | null>(null);

  const calculatePeriodPredictions = () => {
    if (!lastPeriodDate) {
      showErrorToast("Please select your last period date");
      return;
    }

    const cycleLengthNum = parseInt(cycleLength);
    const periodLengthNum = parseInt(periodLength);

    if (isNaN(cycleLengthNum) || cycleLengthNum < 21 || cycleLengthNum > 35) {
      showErrorToast("Please enter a valid cycle length between 21-35 days");
      return;
    }

    if (isNaN(periodLengthNum) || periodLengthNum < 3 || periodLengthNum > 8) {
      showErrorToast("Please enter a valid period length between 3-8 days");
      return;
    }

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

    showSuccessToast("Period predictions calculated!");
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

          <div className="space-y-2">
            <Label className="block text-left">Last Period Start Date</Label>
            <Calendar
              mode="single"
              selected={lastPeriodDate}
              onSelect={setLastPeriodDate}
              className="rounded-md border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cycleLength" className="block text-left">Cycle Length (days)</Label>
              <Input
                id="cycleLength"
                type="number"
                placeholder="e.g., 28"
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
              />
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
              />
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
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Your Period Predictions</h3>
              {userName && <p className="text-sm mt-2">Predictions for: {userName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-pink-100 p-3 rounded-md">
                <p className="text-sm font-medium text-pink-800">Next Period</p>
                <p className="text-lg font-bold text-pink-900">
                  {format(predictions.nextPeriod, "MMM dd, yyyy")}
                </p>
              </div>

              <div className="bg-purple-100 p-3 rounded-md">
                <p className="text-sm font-medium text-purple-800">Ovulation</p>
                <p className="text-lg font-bold text-purple-900">
                  {format(predictions.ovulation, "MMM dd, yyyy")}
                </p>
              </div>
            </div>

            <div className="bg-blue-100 p-3 rounded-md mb-4">
              <p className="text-sm font-medium text-blue-800">Fertile Window</p>
              <p className="text-lg font-bold text-blue-900">
                {format(predictions.fertileDays.start, "MMM dd")} - {format(predictions.fertileDays.end, "MMM dd, yyyy")}
              </p>
            </div>

            <div className="bg-white p-3 rounded-md">
              <h4 className="font-medium mb-2">Next 3 Periods:</h4>
              <ul className="space-y-1">
                {predictions.nextThreePeriods.map((date, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-medium">Period {index + 1}:</span> {format(date, "MMM dd, yyyy")}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 text-sm text-gray-600">
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
