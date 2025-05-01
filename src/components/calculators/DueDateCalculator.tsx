
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Copy, Share, Download } from "lucide-react";
import { downloadResultsAsCSV, copyResultsToClipboard, shareResults } from "@/utils/downloadUtils";
import { showSuccessToast } from "@/utils/notificationUtils";
import { DueDateCalcProps } from "@/types/calculatorTypes";

const DueDateCalculator: React.FC<DueDateCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [calculationMethod, setCalculationMethod] = useState<"lmp" | "conception" | "ivf">("lmp");
  const [lmpDate, setLmpDate] = useState<string>("");
  const [conceptionDate, setConceptionDate] = useState<string>("");
  const [ivfDate, setIvfDate] = useState<string>("");
  const [ivfDay, setIvfDay] = useState<string>("3");
  const [dueDateResult, setDueDateResult] = useState<{
    dueDate: string;
    gestationalAge: { weeks: number; days: number };
    trimester: number;
    milestones: { name: string; date: string; description: string }[];
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const calculateDueDate = () => {
    let calculationDate: Date;
    let dueDate: Date;
    
    // Get today's date
    const today = new Date();
    
    switch (calculationMethod) {
      case "lmp":
        if (!lmpDate) {
          showSuccessToast("Please enter your last menstrual period date");
          return;
        }
        calculationDate = new Date(lmpDate);
        // Add 280 days (40 weeks) to LMP date
        dueDate = new Date(calculationDate);
        dueDate.setDate(calculationDate.getDate() + 280);
        break;
        
      case "conception":
        if (!conceptionDate) {
          showSuccessToast("Please enter your conception date");
          return;
        }
        calculationDate = new Date(conceptionDate);
        // Add 266 days (38 weeks) to conception date
        dueDate = new Date(calculationDate);
        dueDate.setDate(calculationDate.getDate() + 266);
        break;
        
      case "ivf":
        if (!ivfDate) {
          showSuccessToast("Please enter your embryo transfer date");
          return;
        }
        calculationDate = new Date(ivfDate);
        // For day 3 transfer, add 263 days; for day 5 transfer (blastocyst), add 261 days
        const daysToAdd = ivfDay === "3" ? 263 : 261;
        dueDate = new Date(calculationDate);
        dueDate.setDate(calculationDate.getDate() + daysToAdd);
        break;
    }
    
    // Calculate gestational age
    let gestationalAgeStart: Date;
    if (calculationMethod === "lmp") {
      gestationalAgeStart = new Date(lmpDate);
    } else if (calculationMethod === "conception") {
      // For conception, add 14 days to get the equivalent LMP date
      gestationalAgeStart = new Date(conceptionDate);
      gestationalAgeStart.setDate(gestationalAgeStart.getDate() - 14);
    } else {
      // For IVF transfers, gestational age starts from retrieval minus days of development plus 14 days
      gestationalAgeStart = new Date(ivfDate);
      gestationalAgeStart.setDate(gestationalAgeStart.getDate() - parseInt(ivfDay) + 14);
    }
    
    // Calculate the difference in days
    const diffTime = today.getTime() - gestationalAgeStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const gestationalWeeks = Math.floor(diffDays / 7);
    const gestationalDays = diffDays % 7;
    
    // Determine trimester
    let trimester: number;
    if (gestationalWeeks < 13) {
      trimester = 1;
    } else if (gestationalWeeks < 27) {
      trimester = 2;
    } else {
      trimester = 3;
    }
    
    // Calculate pregnancy milestones
    const milestones = calculateMilestones(gestationalAgeStart);
    
    setDueDateResult({
      dueDate: dueDate.toLocaleDateString(),
      gestationalAge: {
        weeks: gestationalWeeks,
        days: gestationalDays
      },
      trimester,
      milestones
    });
  };

  const calculateMilestones = (startDate: Date) => {
    const milestones = [
      { 
        weeks: 8, 
        name: "First Ultrasound", 
        description: "First ultrasound typically scheduled around this time" 
      },
      { 
        weeks: 12, 
        name: "End of First Trimester", 
        description: "Risk of miscarriage decreases significantly" 
      },
      { 
        weeks: 20, 
        name: "Anatomy Scan", 
        description: "Detailed ultrasound to check baby's development" 
      },
      { 
        weeks: 24, 
        name: "Viability", 
        description: "Baby may survive outside the womb with medical assistance" 
      },
      { 
        weeks: 28, 
        name: "Third Trimester Begins", 
        description: "Final stage of pregnancy begins" 
      },
      { 
        weeks: 37, 
        name: "Full Term", 
        description: "Baby is considered full term and could arrive anytime" 
      }
    ];
    
    return milestones.map(milestone => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + (milestone.weeks * 7));
      return {
        name: milestone.name,
        date: date.toLocaleDateString(),
        description: milestone.description
      };
    });
  };

  const handleCopy = () => {
    if (!dueDateResult) return;
    
    const milestoneData: Record<string, string> = {};
    dueDateResult.milestones.forEach(milestone => {
      milestoneData[milestone.name] = milestone.date;
    });
    
    const results = {
      title: "Due Date Calculator",
      results: {
        "Due Date": dueDateResult.dueDate,
        "Current Gestational Age": `${dueDateResult.gestationalAge.weeks} weeks and ${dueDateResult.gestationalAge.days} days`,
        "Trimester": dueDateResult.trimester.toString(),
        ...milestoneData
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
    if (!dueDateResult) return;
    
    const milestoneData: Record<string, string> = {};
    dueDateResult.milestones.forEach(milestone => {
      milestoneData[milestone.name] = milestone.date;
    });
    
    const results = {
      title: "Due Date Calculator",
      results: {
        "Due Date": dueDateResult.dueDate,
        "Current Gestational Age": `${dueDateResult.gestationalAge.weeks} weeks and ${dueDateResult.gestationalAge.days} days`,
        "Trimester": dueDateResult.trimester.toString(),
        ...milestoneData
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    shareResults(results);
  };

  const handleDownload = () => {
    if (!dueDateResult) return;
    
    const milestoneData: Record<string, string> = {};
    dueDateResult.milestones.forEach(milestone => {
      milestoneData[milestone.name] = milestone.date;
    });
    
    const results = {
      title: "Due Date Calculator",
      results: {
        "Due Date": dueDateResult.dueDate,
        "Current Gestational Age": `${dueDateResult.gestationalAge.weeks} weeks and ${dueDateResult.gestationalAge.days} days`,
        "Trimester": dueDateResult.trimester.toString(),
        ...milestoneData
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined
    };
    
    downloadResultsAsCSV(results, "Due-Date-Calculator");
    showSuccessToast("Results downloaded successfully!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Due Date Calculator</h2>
      <p className="text-gray-600 mb-6 text-center">
        Calculate your baby's due date and important pregnancy milestones
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
          <Label>Calculation Method</Label>
          <RadioGroup
            value={calculationMethod}
            onValueChange={(value) => setCalculationMethod(value as "lmp" | "conception" | "ivf")}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lmp" id="lmp" />
              <Label htmlFor="lmp">Last Menstrual Period (LMP)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="conception" id="conception" />
              <Label htmlFor="conception">Conception Date</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ivf" id="ivf" />
              <Label htmlFor="ivf">IVF Transfer Date</Label>
            </div>
          </RadioGroup>
        </div>
        
        {calculationMethod === "lmp" && (
          <div className="space-y-2">
            <Label htmlFor="lmpDate">First day of last period</Label>
            <div className="relative">
              <Input
                id="lmpDate"
                type="date"
                value={lmpDate}
                onChange={(e) => setLmpDate(e.target.value)}
                className="pl-10"
              />
              <CalendarDays className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}
        
        {calculationMethod === "conception" && (
          <div className="space-y-2">
            <Label htmlFor="conceptionDate">Conception date</Label>
            <div className="relative">
              <Input
                id="conceptionDate"
                type="date"
                value={conceptionDate}
                onChange={(e) => setConceptionDate(e.target.value)}
                className="pl-10"
              />
              <CalendarDays className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}
        
        {calculationMethod === "ivf" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="ivfDate">Embryo transfer date</Label>
              <div className="relative">
                <Input
                  id="ivfDate"
                  type="date"
                  value={ivfDate}
                  onChange={(e) => setIvfDate(e.target.value)}
                  className="pl-10"
                />
                <CalendarDays className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Embryo age at transfer</Label>
              <RadioGroup
                value={ivfDay}
                onValueChange={setIvfDay}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="day3" />
                  <Label htmlFor="day3">3-day</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5" id="day5" />
                  <Label htmlFor="day5">5-day (Blastocyst)</Label>
                </div>
              </RadioGroup>
            </div>
          </>
        )}
      </div>
      
      <Button onClick={calculateDueDate} className="w-full mb-6">
        Calculate Due Date
      </Button>
      
      {dueDateResult && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Due Date Results</h3>
            {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
          </div>
          
          <div className="space-y-4">
            <div className="bg-wellness-softPurple p-4 rounded-md">
              <p className="text-sm text-gray-700">Estimated Due Date</p>
              <p className="font-bold text-2xl text-wellness-purple">{dueDateResult.dueDate}</p>
              <p className="text-sm text-gray-600">
                Remember that only about 5% of babies are born on their exact due date
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-700">Current Gestational Age</p>
                <p className="font-bold text-lg">
                  {dueDateResult.gestationalAge.weeks} weeks and {dueDateResult.gestationalAge.days} days
                </p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-700">Current Trimester</p>
                <p className="font-bold text-lg">{dueDateResult.trimester}</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="font-medium mb-2">Pregnancy Milestones</p>
              <div className="space-y-2">
                {dueDateResult.milestones.map((milestone, index) => (
                  <div key={index} className="border-b pb-2 last:border-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{milestone.name}</p>
                      <p className="text-wellness-purple">{milestone.date}</p>
                    </div>
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                  </div>
                ))}
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
              This calculator is based on standard pregnancy timelines.
              Actual due dates may vary, and individual medical advice should always be followed.
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

export default DueDateCalculator;
