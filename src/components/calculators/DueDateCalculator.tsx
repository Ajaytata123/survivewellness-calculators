import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { addDays, format, addWeeks, subDays } from "date-fns";
import { DueDateCalcProps } from "@/types/calculatorTypes";
import IntroSection from "@/components/calculator/IntroSection";
import ResultActions from "@/components/calculator/ResultActions";
import KnowMoreButton from "@/components/calculator/KnowMoreButton";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { DatePicker } from "@/components/ui/date-picker";

type CalendarDate = Date | undefined;

interface TrimesterDay {
  date: Date;
  trimester: 1 | 2 | 3;
}

const DueDateCalculator: React.FC<DueDateCalcProps> = ({ unitSystem }) => {
  const [userName, setUserName] = useState<string>("");
  const [calculationType, setCalculationType] = useState<"lmp" | "conception">("lmp");
  const [lmpDate, setLmpDate] = useState<CalendarDate>(undefined);
  const [conceptionDate, setConceptionDate] = useState<CalendarDate>(undefined);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [pregnancyCalendar, setPregnancyCalendar] = useState<TrimesterDay[]>([]);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (calculationType === "lmp" && !lmpDate) {
      newErrors.lmpDate = "Last menstrual period date is required";
    }

    if (calculationType === "conception" && !conceptionDate) {
      newErrors.conceptionDate = "Conception date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDueDate = () => {
    if (!validateForm()) {
      showErrorToast("Please fill all required fields");
      return;
    }

    let calculatedDueDate: Date;
    let pregnancyStart: Date;

    if (calculationType === "lmp" && lmpDate) {
      // Due date is typically 280 days (40 weeks) after the first day of the last menstrual period
      calculatedDueDate = addDays(lmpDate, 280);
      pregnancyStart = lmpDate;
    } else if (calculationType === "conception" && conceptionDate) {
      // Due date is typically 266 days (38 weeks) after conception
      calculatedDueDate = addDays(conceptionDate, 266);
      // LMP is approximately 14 days before conception
      pregnancyStart = subDays(conceptionDate, 14);
    } else {
      showErrorToast("Please provide a valid date");
      return;
    }

    // Calculate pregnancy calendar
    const trimesters: TrimesterDay[] = [];
    
    // First trimester: weeks 0-13
    for (let week = 0; week < 14; week++) {
      for (let day = 0; day < 7; day++) {
        trimesters.push({
          date: addDays(pregnancyStart, week * 7 + day),
          trimester: 1
        });
      }
    }
    
    // Second trimester: weeks 14-27
    for (let week = 14; week < 28; week++) {
      for (let day = 0; day < 7; day++) {
        trimesters.push({
          date: addDays(pregnancyStart, week * 7 + day),
          trimester: 2
        });
      }
    }
    
    // Third trimester: weeks 28-40+
    for (let week = 28; week < 42; week++) {
      for (let day = 0; day < 7; day++) {
        trimesters.push({
          date: addDays(pregnancyStart, week * 7 + day),
          trimester: 3
        });
      }
    }
    
    setDueDate(calculatedDueDate);
    setPregnancyCalendar(trimesters);
    setCalendarMonth(calculationType === "lmp" ? lmpDate : conceptionDate || new Date());
    showSuccessToast("Due date calculated successfully!");
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('duedate-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const modifiers = {
    trimester1: (date: Date) => 
      pregnancyCalendar.some(day => 
        day.trimester === 1 && day.date.toDateString() === date.toDateString()
      ),
    trimester2: (date: Date) => 
      pregnancyCalendar.some(day => 
        day.trimester === 2 && day.date.toDateString() === date.toDateString()
      ),
    trimester3: (date: Date) => 
      pregnancyCalendar.some(day => 
        day.trimester === 3 && day.date.toDateString() === date.toDateString()
      ),
    dueDate: (date: Date) => 
      dueDate?.toDateString() === date.toDateString()
  };

  const modifiersClassNames = {
    trimester1: "bg-wellness-softPink text-wellness-pink",
    trimester2: "bg-wellness-softPurple text-wellness-purple",
    trimester3: "bg-wellness-softOrange text-wellness-orange",
    dueDate: "bg-wellness-pink text-white font-bold"
  };

  const calculateCurrentWeek = (): number | null => {
    if (!dueDate) return null;
    
    const dueDateTimestamp = dueDate.getTime();
    const today = new Date().getTime();
    const conceptionTimestamp = calculationType === "lmp" && lmpDate
      ? lmpDate.getTime()
      : conceptionDate
        ? conceptionDate.getTime() - (14 * 24 * 60 * 60 * 1000) // 14 days before conception
        : 0;
    
    if (conceptionTimestamp === 0) return null;
    
    const totalDaysPregnant = (today - conceptionTimestamp) / (24 * 60 * 60 * 1000);
    const weeksPregnant = Math.floor(totalDaysPregnant / 7);
    
    return Math.max(0, Math.min(weeksPregnant, 40));
  };

  const currentWeek = calculateCurrentWeek();

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Due Date Calculator</h2>
      
      <IntroSection 
        title="What is a Due Date Calculator?"
        description="This calculator helps expectant mothers estimate their baby's due date based either on the first day of their last menstrual period (LMP) or their conception date. It also provides a pregnancy calendar showing your three trimesters."
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
          <Label>Calculation Method</Label>
          <RadioGroup
            value={calculationType}
            onValueChange={(value) => {
              setCalculationType(value as "lmp" | "conception");
              setErrors({});
            }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <RadioGroupItem value="lmp" id="method-lmp" />
              <div>
                <Label htmlFor="method-lmp">Last Menstrual Period</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">If you know when your last period started</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <RadioGroupItem value="conception" id="method-conception" />
              <div>
                <Label htmlFor="method-conception">Conception Date</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">If you know your ovulation date</p>
              </div>
            </div>
          </RadioGroup>
        </div>

        {calculationType === "lmp" ? (
          <DatePicker
            date={lmpDate}
            onDateChange={setLmpDate}
            label="First Day of Last Menstrual Period"
            placeholder="Select date"
            id="lmpDate"
            error={errors.lmpDate}
          />
        ) : (
          <DatePicker
            date={conceptionDate}
            onDateChange={setConceptionDate}
            label="Conception Date"
            placeholder="Select date"
            id="conceptionDate"
            error={errors.conceptionDate}
          />
        )}
      </div>

      <Button onClick={calculateDueDate} className="w-full mb-6">
        Calculate Due Date
      </Button>

      {dueDate && (
        <div id="duedate-results" className="results-container">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold">Your Pregnancy Timeline</h3>
            {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
            
            <div className="result-highlight p-6 mt-4 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">Estimated Due Date</p>
              <p className="text-3xl font-bold text-wellness-pink dark:text-wellness-pink/90">
                {format(dueDate, "MMMM d, yyyy")}
              </p>
              
              {currentWeek !== null && (
                <>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Current Week</p>
                  <div className="text-2xl font-bold">
                    {currentWeek} {currentWeek === 1 ? "week" : "weeks"}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-2">
                    <div 
                      className="h-4 rounded-full bg-wellness-purple" 
                      style={{ width: `${Math.min(100, (currentWeek / 40) * 100)}%` }}
                    />
                  </div>
                  <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                    {Math.max(0, 40 - currentWeek)} weeks remaining
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2">Trimester Breakdown</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-wellness-softPink/30 dark:bg-wellness-softPink/20 rounded-md">
                  <p className="text-sm font-medium">First Trimester</p>
                  <p className="font-bold">
                    Weeks 1-13<br/>
                    {calculationType === "lmp" && lmpDate
                      ? `${format(lmpDate, "MMM d")} - ${format(addWeeks(lmpDate, 13), "MMM d")}`
                      : conceptionDate
                        ? `${format(subDays(conceptionDate, 14), "MMM d")} - ${format(addWeeks(subDays(conceptionDate, 14), 13), "MMM d")}`
                        : ""
                    }
                  </p>
                </div>
                <div className="p-3 bg-wellness-softPurple/30 dark:bg-wellness-softPurple/20 rounded-md">
                  <p className="text-sm font-medium">Second Trimester</p>
                  <p className="font-bold">
                    Weeks 14-27<br/>
                    {calculationType === "lmp" && lmpDate
                      ? `${format(addWeeks(lmpDate, 14), "MMM d")} - ${format(addWeeks(lmpDate, 27), "MMM d")}`
                      : conceptionDate
                        ? `${format(addWeeks(subDays(conceptionDate, 14), 14), "MMM d")} - ${format(addWeeks(subDays(conceptionDate, 14), 27), "MMM d")}`
                        : ""
                    }
                  </p>
                </div>
                <div className="p-3 bg-wellness-softOrange/30 dark:bg-wellness-softOrange/20 rounded-md">
                  <p className="text-sm font-medium">Third Trimester</p>
                  <p className="font-bold">
                    Weeks 28-40<br/>
                    {calculationType === "lmp" && lmpDate
                      ? `${format(addWeeks(lmpDate, 28), "MMM d")} - ${format(dueDate, "MMM d")}`
                      : conceptionDate
                        ? `${format(addWeeks(subDays(conceptionDate, 14), 28), "MMM d")} - ${format(dueDate, "MMM d")}`
                        : ""
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Pregnancy Calendar</h4>
            <Calendar
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              showOutsideDays={false}
              className="w-full"
            />
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-wellness-softPink mr-2"></div>
                <span>First Trimester</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-wellness-softPurple mr-2"></div>
                <span>Second Trimester</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-wellness-softOrange mr-2"></div>
                <span>Third Trimester</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-wellness-pink mr-2"></div>
                <span>Due Date</span>
              </div>
            </div>
          </div>

          <ResultActions
            title="Due Date Calculator"
            results={{
              "Estimated Due Date": format(dueDate, "MMMM d, yyyy"),
              "Calculation Method": calculationType === "lmp" ? "Last Menstrual Period" : "Conception Date",
              ...(calculationType === "lmp"
                ? { "Last Menstrual Period": lmpDate ? format(lmpDate, "MMMM d, yyyy") : "" }
                : { "Conception Date": conceptionDate ? format(conceptionDate, "MMMM d, yyyy") : "" }
              ),
              "First Trimester": calculationType === "lmp" && lmpDate
                ? `${format(lmpDate, "MMM d")} - ${format(addWeeks(lmpDate, 13), "MMM d")}`
                : conceptionDate
                  ? `${format(subDays(conceptionDate, 14), "MMM d")} - ${format(addWeeks(subDays(conceptionDate, 14), 13), "MMM d")}`
                  : "",
              "Second Trimester": calculationType === "lmp" && lmpDate
                ? `${format(addWeeks(lmpDate, 14), "MMM d")} - ${format(addWeeks(lmpDate, 27), "MMM d")}`
                : conceptionDate
                  ? `${format(addWeeks(subDays(conceptionDate, 14), 14), "MMM d")} - ${format(addWeeks(subDays(conceptionDate, 14), 27), "MMM d")}`
                  : "",
              "Third Trimester": calculationType === "lmp" && lmpDate
                ? `${format(addWeeks(lmpDate, 28), "MMM d")} - ${format(dueDate, "MMM d")}`
                : conceptionDate
                  ? `${format(addWeeks(subDays(conceptionDate, 14), 28), "MMM d")} - ${format(dueDate, "MMM d")}`
                  : ""
            }}
            fileName="Due-Date-Calculator"
            userName={userName}
            unitSystem={unitSystem}
          />
          
          <KnowMoreButton 
            calculatorName="Due Date Calculator"
            calculatorId="duedate"
          />
          
          <p className="disclaimer-text">
            This calculator provides an estimate based on standard pregnancy durations. Individual pregnancies may vary, and your healthcare provider may adjust your due date based on ultrasound measurements or other factors.
          </p>
          
          <p className="thank-you-text">
            Thank you for using SurviveWellness!
          </p>
        </div>
      )}
    </Card>
  );
};

export default DueDateCalculator;
