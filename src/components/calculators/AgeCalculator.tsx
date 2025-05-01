
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Copy, Share } from "lucide-react";
import { downloadResultsAsCSV, copyResultsToClipboard, shareResults } from "@/utils/downloadUtils";
import { showSuccessToast } from "@/utils/notificationUtils";
import { UnitSystem } from "@/types/calculatorTypes";

interface AgeCalculatorProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

const AgeCalculator: React.FC<AgeCalculatorProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [birthDate, setBirthDate] = useState<string>("");
  const [referenceDate, setReferenceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [userName, setUserName] = useState<string>("");
  const [ageResult, setAgeResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    nextBirthday: string;
    daysUntilNextBirthday: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const calculateAge = () => {
    if (!birthDate) {
      showSuccessToast("Please enter your birth date");
      return;
    }

    const birth = new Date(birthDate);
    const reference = referenceDate ? new Date(referenceDate) : new Date();
    
    // Validate dates
    if (isNaN(birth.getTime()) || isNaN(reference.getTime())) {
      showSuccessToast("Please enter valid dates");
      return;
    }
    
    // Calculate years, months, days
    let years = reference.getFullYear() - birth.getFullYear();
    let months = reference.getMonth() - birth.getMonth();
    let days = reference.getDate() - birth.getDate();
    
    // Adjust if days or months are negative
    if (days < 0) {
      months--;
      // Get last day of previous month from reference date
      const lastMonth = new Date(reference.getFullYear(), reference.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // Calculate total days
    const diffTime = Math.abs(reference.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate next birthday
    const nextBirthdayYear = reference.getFullYear() + (reference > new Date(reference.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
    const nextBirthday = new Date(nextBirthdayYear, birth.getMonth(), birth.getDate());
    
    // Calculate days until next birthday
    const diffTimeNextBday = Math.abs(nextBirthday.getTime() - reference.getTime());
    const daysUntilNextBirthday = Math.floor(diffTimeNextBday / (1000 * 60 * 60 * 24));
    
    setAgeResult({
      years,
      months,
      days,
      totalDays,
      nextBirthday: nextBirthday.toLocaleDateString(),
      daysUntilNextBirthday
    });
  };

  const handleCopy = () => {
    if (!ageResult) return;
    
    const results = {
      title: "Age Calculator",
      results: {
        "Birth Date": new Date(birthDate).toLocaleDateString(),
        "Reference Date": new Date(referenceDate).toLocaleDateString(),
        "Age": `${ageResult.years} years, ${ageResult.months} months, ${ageResult.days} days`,
        "Total Days": ageResult.totalDays.toString(),
        "Next Birthday": ageResult.nextBirthday,
        "Days Until Next Birthday": ageResult.daysUntilNextBirthday.toString()
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
    if (!ageResult) return;
    
    const results = {
      title: "Age Calculator",
      results: {
        "Birth Date": new Date(birthDate).toLocaleDateString(),
        "Reference Date": new Date(referenceDate).toLocaleDateString(),
        "Age": `${ageResult.years} years, ${ageResult.months} months, ${ageResult.days} days`,
        "Total Days": ageResult.totalDays.toString(),
        "Next Birthday": ageResult.nextBirthday,
        "Days Until Next Birthday": ageResult.daysUntilNextBirthday.toString()
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    shareResults(results);
  };

  const handleDownload = () => {
    if (!ageResult) return;
    
    const results = {
      title: "Age Calculator",
      results: {
        "Birth Date": new Date(birthDate).toLocaleDateString(),
        "Reference Date": new Date(referenceDate).toLocaleDateString(),
        "Age": `${ageResult.years} years, ${ageResult.months} months, ${ageResult.days} days`,
        "Total Days": ageResult.totalDays.toString(),
        "Next Birthday": ageResult.nextBirthday,
        "Days Until Next Birthday": ageResult.daysUntilNextBirthday.toString()
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    downloadResultsAsCSV(results, "Age-Calculator");
    showSuccessToast("Results downloaded successfully!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Age Calculator</h2>
      <p className="text-gray-600 mb-6 text-center">
        Calculate your exact age in years, months, and days
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
          <div className="relative">
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="pl-10"
            />
            <CalendarDays className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="referenceDate">Reference Date (default: today)</Label>
          <div className="relative">
            <Input
              id="referenceDate"
              type="date"
              value={referenceDate}
              onChange={(e) => setReferenceDate(e.target.value)}
              className="pl-10"
            />
            <CalendarDays className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      <Button onClick={calculateAge} className="w-full mb-6">
        Calculate Age
      </Button>
      
      {ageResult && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-3">
            <h3 className="text-xl font-bold">Your Age Results</h3>
            {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-sm text-gray-700">Years</p>
              <p className="font-bold text-2xl">{ageResult.years}</p>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-sm text-gray-700">Months</p>
              <p className="font-bold text-2xl">{ageResult.months}</p>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-sm text-gray-700">Days</p>
              <p className="font-bold text-2xl">{ageResult.days}</p>
            </div>
          </div>
          
          <div className="bg-wellness-softBlue p-4 rounded-md mb-4">
            <p className="text-sm text-gray-700">Total Days</p>
            <p className="font-bold text-xl">{ageResult.totalDays.toLocaleString()} days</p>
          </div>
          
          <div className="bg-wellness-softPurple p-4 rounded-md mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-700">Next Birthday</p>
                <p className="font-medium">{ageResult.nextBirthday}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-700">Days Remaining</p>
                <p className="font-bold">{ageResult.daysUntilNextBirthday}</p>
              </div>
            </div>
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
              This calculator provides precise age calculations between two dates.
              Thank you for using Survivewellness!
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AgeCalculator;
