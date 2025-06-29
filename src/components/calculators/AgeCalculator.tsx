
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UnitSystem } from "@/types/calculatorTypes";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import IntroSection from "@/components/calculator/IntroSection";

interface AgeCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const AgeCalculator: React.FC<AgeCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [birthDate, setBirthDate] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [results, setResults] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
    nextBirthday: string;
  } | null>(null);

  const calculateAge = () => {
    if (!birthDate) {
      showErrorToast("Please enter your birth date");
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();

    if (birth > today) {
      showErrorToast("Birth date cannot be in the future");
      return;
    }

    // Calculate age
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total days
    const timeDiff = today.getTime() - birth.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    const totalHours = Math.floor(timeDiff / (1000 * 3600));
    const totalMinutes = Math.floor(timeDiff / (1000 * 60));

    // Calculate next birthday
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 3600 * 24));

    setResults({
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      nextBirthday: `${daysToNextBirthday} days`
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Age Calculator</h2>
        <p className="text-gray-600 mb-4 text-center">
          Calculate your exact age and important milestones
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
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculateAge} className="w-full mb-6">
          Calculate Age
        </Button>

        {results && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Your Age Details</h3>
              {userName && <p className="text-sm mt-2">Results for: {userName}</p>}
            </div>

            <div className="bg-wellness-softPurple p-4 rounded-md mb-4 text-center">
              <p className="text-sm text-gray-700">Your Age</p>
              <p className="text-2xl font-bold text-wellness-purple">
                {results.years} years, {results.months} months, {results.days} days
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Total Days</p>
                <p className="text-lg font-bold">{results.totalDays.toLocaleString()}</p>
              </div>
              <div className="bg-white p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Total Hours</p>
                <p className="text-lg font-bold">{results.totalHours.toLocaleString()}</p>
              </div>
              <div className="bg-white p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Total Minutes</p>
                <p className="text-lg font-bold">{results.totalMinutes.toLocaleString()}</p>
              </div>
              <div className="bg-white p-3 rounded-md text-center">
                <p className="text-sm text-gray-700">Next Birthday</p>
                <p className="text-lg font-bold">{results.nextBirthday}</p>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-wellness-purple">
              <p>Thank you for using Survive<span className="lowercase">w</span>ellness!</p>
            </div>
          </div>
        )}
      </Card>

      <IntroSection calculatorId="age" title="" description="" />
    </div>
  );
};

export default AgeCalculator;
