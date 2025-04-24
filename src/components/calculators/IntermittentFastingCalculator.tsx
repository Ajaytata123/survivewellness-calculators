
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UnitSystem } from "@/types/calculatorTypes";
import { downloadResultsAsCSV, copyResultsToClipboard, createShareableLink } from "@/utils/downloadUtils";
import { showSuccessToast } from "@/utils/notificationUtils";
import { Check, Copy, Share } from "lucide-react";

interface IntermittentFastingCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

type FastingMethod = "16:8" | "18:6" | "20:4" | "5:2" | "custom";

interface FastingSchedule {
  fastingHours: number;
  eatingHours: number;
  startTime: string;
  endTime: string;
  days: string[];
  notes: string;
}

const IntermittentFastingCalculator: React.FC<IntermittentFastingCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [fastingMethod, setFastingMethod] = useState<FastingMethod>("16:8");
  const [customFastingHours, setCustomFastingHours] = useState<string>("16");
  const [startTime, setStartTime] = useState<string>("20:00");
  const [fastingSchedule, setFastingSchedule] = useState<FastingSchedule | null>(null);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [copied, setCopied] = useState(false);
  const [showCustomFields, setShowCustomFields] = useState(false);

  // Days for 5:2 method
  const [fastingDays, setFastingDays] = useState<string[]>(["Monday", "Thursday"]);
  
  const availableDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const toggleFastingDay = (day: string) => {
    if (fastingDays.includes(day)) {
      setFastingDays(prev => prev.filter(d => d !== day));
    } else {
      if (fastingDays.length < 2) {
        setFastingDays(prev => [...prev, day]);
      } else {
        showSuccessToast("You can only select 2 fasting days for the 5:2 method");
      }
    }
  };

  const calculateSchedule = () => {
    let fastingHours: number;
    let eatingHours: number;
    let days: string[];
    let notes: string = "";

    switch (fastingMethod) {
      case "16:8":
        fastingHours = 16;
        eatingHours = 8;
        days = ["Every day"];
        notes = "Fast for 16 hours, eat during an 8-hour window";
        break;
      case "18:6":
        fastingHours = 18;
        eatingHours = 6;
        days = ["Every day"];
        notes = "Fast for 18 hours, eat during a 6-hour window";
        break;
      case "20:4":
        fastingHours = 20;
        eatingHours = 4;
        days = ["Every day"];
        notes = "Fast for 20 hours, eat during a 4-hour window (sometimes called 'Warrior Diet')";
        break;
      case "5:2":
        fastingHours = 24;
        eatingHours = 0; // Not really applicable
        days = fastingDays;
        notes = "Fast for 24 hours on 2 non-consecutive days, eat normally on the other 5 days";
        break;
      case "custom":
        fastingHours = parseInt(customFastingHours);
        if (isNaN(fastingHours) || fastingHours <= 0 || fastingHours >= 24) {
          fastingHours = 16; // Default to 16 if invalid
        }
        eatingHours = 24 - fastingHours;
        days = ["Every day"];
        notes = `Custom schedule with ${fastingHours} hours fasting, ${eatingHours} hours eating window`;
        break;
      default:
        fastingHours = 16;
        eatingHours = 8;
        days = ["Every day"];
        notes = "Default 16:8 method";
    }

    // Calculate end time based on start time
    const [startHour, startMinute] = startTime.split(':').map(Number);
    
    let endHour, endMinute;
    
    if (fastingMethod !== "5:2") {
      // For daily fasting methods
      endHour = (startHour + fastingHours) % 24;
      endMinute = startMinute;
    } else {
      // For 5:2, the start and end times are the same (24 hour fast)
      endHour = startHour;
      endMinute = startMinute;
    }
    
    const formattedEndHour = endHour < 10 ? `0${endHour}` : `${endHour}`;
    const formattedEndMinute = endMinute < 10 ? `0${endMinute}` : `${endMinute}`;
    const endTimeFormatted = `${formattedEndHour}:${formattedEndMinute}`;

    // Calculate eating window start time (which is the fasting end time)
    let eatingStartHour, eatingStartMinute;
    let eatingEndHour, eatingEndMinute;

    if (fastingMethod !== "5:2") {
      eatingStartHour = endHour;
      eatingStartMinute = endMinute;
      eatingEndHour = (eatingStartHour + eatingHours) % 24;
      eatingEndMinute = eatingStartMinute;
    } else {
      // For 5:2, we set the eating window to "Not applicable"
      eatingStartHour = -1;
      eatingStartMinute = -1;
      eatingEndHour = -1;
      eatingEndMinute = -1;
    }

    const schedule: FastingSchedule = {
      fastingHours,
      eatingHours,
      startTime,
      endTime: endTimeFormatted,
      days,
      notes
    };

    setFastingSchedule(schedule);
  };

  const getMethodLabel = (method: FastingMethod): string => {
    switch (method) {
      case "16:8": return "16:8 Method (Leangains)";
      case "18:6": return "18:6 Method";
      case "20:4": return "20:4 Method (Warrior Diet)";
      case "5:2": return "5:2 Method (Twice-Weekly Fasting)";
      case "custom": return "Custom Schedule";
      default: return "Unknown Method";
    }
  };

  const formatTimeAMPM = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
  };

  const downloadResults = () => {
    if (!fastingSchedule) return;

    // Create fasting days string
    let fastingDaysText = "";
    if (fastingMethod === "5:2") {
      fastingDaysText = fastingDays.join(", ");
    } else {
      fastingDaysText = "Daily";
    }

    let eatingWindowText = "";
    if (fastingMethod === "5:2") {
      eatingWindowText = "Not applicable for 5:2 method";
    } else {
      eatingWindowText = `${formatTimeAMPM(fastingSchedule.endTime)} to ${formatTimeAMPM(startTime)}`;
    }

    const results = {
      title: "Intermittent Fasting Schedule",
      results: {
        "Fasting Method": getMethodLabel(fastingMethod),
        "Fasting Hours": fastingSchedule.fastingHours.toString(),
        "Eating Hours": fastingSchedule.eatingHours.toString(),
        "Fasting Window": `${formatTimeAMPM(startTime)} to ${formatTimeAMPM(fastingSchedule.endTime)}`,
        "Eating Window": eatingWindowText,
        "Fasting Days": fastingDaysText,
        "Notes": fastingSchedule.notes,
        "Gender": gender
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined,
    };

    downloadResultsAsCSV(results, "Intermittent-Fasting-Schedule");
    showSuccessToast("Schedule downloaded successfully!");
  };

  const copyResults = () => {
    if (!fastingSchedule) return;

    // Create fasting days string
    let fastingDaysText = "";
    if (fastingMethod === "5:2") {
      fastingDaysText = fastingDays.join(", ");
    } else {
      fastingDaysText = "Daily";
    }

    let eatingWindowText = "";
    if (fastingMethod === "5:2") {
      eatingWindowText = "Not applicable for 5:2 method";
    } else {
      eatingWindowText = `${formatTimeAMPM(fastingSchedule.endTime)} to ${formatTimeAMPM(startTime)}`;
    }

    const results = {
      title: "Intermittent Fasting Schedule",
      results: {
        "Fasting Method": getMethodLabel(fastingMethod),
        "Fasting Hours": fastingSchedule.fastingHours.toString(),
        "Eating Hours": fastingSchedule.eatingHours.toString(),
        "Fasting Window": `${formatTimeAMPM(startTime)} to ${formatTimeAMPM(fastingSchedule.endTime)}`,
        "Eating Window": eatingWindowText,
        "Fasting Days": fastingDaysText,
        "Notes": fastingSchedule.notes,
        "Gender": gender
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined,
    };

    copyResultsToClipboard(results);
    setCopied(true);
    showSuccessToast("Schedule copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = () => {
    if (!fastingSchedule) return;
    
    const params = {
      method: fastingMethod,
      startTime,
      customHours: customFastingHours,
      days: fastingDays.join(","),
      gender,
      name: userName || ""
    };
    
    const link = createShareableLink("fasting", params);
    navigator.clipboard.writeText(link);
    showSuccessToast("Shareable link copied to clipboard!");
  };

  const handleFastingMethodChange = (value: string) => {
    const method = value as FastingMethod;
    setFastingMethod(method);
    setShowCustomFields(method === "custom");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Intermittent Fasting Timer</h2>
      <p className="text-gray-600 mb-4 text-center">
        Create your personalized intermittent fasting schedule
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
          <Label>Gender</Label>
          <RadioGroup
            value={gender}
            onValueChange={(value) => setGender(value as "male" | "female")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male-if" />
              <Label htmlFor="male-if">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female-if" />
              <Label htmlFor="female-if">Female</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fastingMethod">Fasting Method</Label>
          <Select value={fastingMethod} onValueChange={handleFastingMethodChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select fasting method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16:8">16:8 Method (Leangains)</SelectItem>
              <SelectItem value="18:6">18:6 Method</SelectItem>
              <SelectItem value="20:4">20:4 Method (Warrior Diet)</SelectItem>
              <SelectItem value="5:2">5:2 Method (Twice-Weekly Fasting)</SelectItem>
              <SelectItem value="custom">Custom Schedule</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showCustomFields && (
          <div className="space-y-2">
            <Label htmlFor="customFastingHours">Custom Fasting Hours</Label>
            <Input
              id="customFastingHours"
              type="number"
              min="1"
              max="23"
              placeholder="e.g., 16"
              value={customFastingHours}
              onChange={(e) => setCustomFastingHours(e.target.value)}
            />
          </div>
        )}

        {fastingMethod === "5:2" ? (
          <div className="space-y-2">
            <Label>Fasting Days (Select 2)</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableDays.map((day) => (
                <div 
                  key={day} 
                  className={`p-2 rounded-md cursor-pointer border ${
                    fastingDays.includes(day) ? 'bg-wellness-softPurple border-wellness-purple' : 'bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => toggleFastingDay(day)}
                >
                  <p className="text-sm text-center">{day}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="startTime">Start Fasting Time</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <p className="text-sm text-gray-500">
            {fastingMethod === "5:2" 
              ? "Time to start your 24-hour fast on fasting days" 
              : "Typically after dinner (e.g., 8:00 PM)"}
          </p>
        </div>
      </div>

      <Button onClick={calculateSchedule} className="w-full mb-6">
        Calculate Fasting Schedule
      </Button>

      {fastingSchedule && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Your Fasting Schedule</h3>
            <p className="text-wellness-blue font-medium mt-1">
              {getMethodLabel(fastingMethod)}
            </p>
            {userName && <p className="text-sm mt-2">Schedule for: {userName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-wellness-softPurple p-3 rounded-md text-center">
              <p className="text-sm text-gray-700">Fasting Window</p>
              <p className="font-bold">{formatTimeAMPM(startTime)} - {formatTimeAMPM(fastingSchedule.endTime)}</p>
              <p className="text-xs">{fastingSchedule.fastingHours} hours</p>
            </div>
            
            <div className="bg-wellness-softGreen p-3 rounded-md text-center">
              <p className="text-sm text-gray-700">Eating Window</p>
              {fastingMethod === "5:2" ? (
                <p className="font-bold">Not applicable</p>
              ) : (
                <>
                  <p className="font-bold">{formatTimeAMPM(fastingSchedule.endTime)} - {formatTimeAMPM(startTime)}</p>
                  <p className="text-xs">{fastingSchedule.eatingHours} hours</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h4 className="font-medium mb-2">Fasting Days:</h4>
              {fastingMethod === "5:2" ? (
                <p>{fastingDays.join(", ")}</p>
              ) : (
                <p>Daily</p>
              )}
            </div>
            
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h4 className="font-medium mb-2">Notes:</h4>
              <p className="text-sm">{fastingSchedule.notes}</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <h4 className="font-medium">Benefits of {fastingMethod} Fasting:</h4>
            <ul className="list-disc ml-5 text-sm space-y-1">
              {fastingMethod === "16:8" && (
                <>
                  <li>Good starting protocol for beginners</li>
                  <li>May help with weight management</li>
                  <li>Potential benefits for metabolic health</li>
                  <li>Relatively easy to maintain long-term</li>
                </>
              )}
              {fastingMethod === "18:6" && (
                <>
                  <li>May enhance fat burning</li>
                  <li>Potentially greater benefits for insulin sensitivity</li>
                  <li>Good balance between effectiveness and sustainability</li>
                  <li>May increase autophagy (cellular cleaning)</li>
                </>
              )}
              {fastingMethod === "20:4" && (
                <>
                  <li>Maximum daily fat burning potential</li>
                  <li>May significantly enhance autophagy</li>
                  <li>One large satisfying meal per day</li>
                  <li>Minimizes time spent thinking about food</li>
                </>
              )}
              {fastingMethod === "5:2" && (
                <>
                  <li>Flexibility on non-fasting days</li>
                  <li>May improve metabolic health markers</li>
                  <li>Only two difficult days per week</li>
                  <li>May be easier to fit into social schedules</li>
                </>
              )}
              {fastingMethod === "custom" && (
                <>
                  <li>Tailored to your personal schedule</li>
                  <li>Adaptable to your lifestyle</li>
                  <li>Can be modified as needed</li>
                  <li>May be easier to maintain long-term</li>
                </>
              )}
            </ul>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={copyResults} className="flex items-center">
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied!" : "Copy Schedule"}
              </Button>
              <Button variant="outline" size="sm" onClick={shareLink} className="flex items-center">
                <Share className="h-4 w-4 mr-1" />
                Share Link
              </Button>
              <Button variant="outline" size="sm" onClick={downloadResults}>
                Download CSV
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-wellness-purple">
            <p>
              Always consult with a healthcare professional before starting an intermittent fasting regimen, 
              especially if you have any medical conditions.
            </p>
            <p className="mt-2">
              Thank you for using Survive<span className="lowercase">w</span>ellness!
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default IntermittentFastingCalculator;
