
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Share } from "lucide-react";
import { UnitSystem } from "@/types/calculatorTypes";
import { downloadResultsAsCSV, copyResultsToClipboard, createShareableLink } from "@/utils/downloadUtils";
import { showSuccessToast } from "@/utils/notificationUtils";
import { MacroResult } from "../hooks/useMacroCalculator";

interface MacroCalculatorResultsProps {
  macroResult: MacroResult;
  userName: string;
  height: string;
  weight: string;
  age: string;
  gender: "male" | "female";
  activity: string;
  goal: string;
  unitSystem: UnitSystem;
  copied: boolean;
  onCopiedChange: (copied: boolean) => void;
}

const MacroCalculatorResults: React.FC<MacroCalculatorResultsProps> = ({
  macroResult,
  userName,
  height,
  weight,
  age,
  gender,
  activity,
  goal,
  unitSystem,
  copied,
  onCopiedChange
}) => {
  const downloadResults = () => {
    const results = {
      title: "Macronutrient Calculator",
      results: {
        "Total Calories": `${macroResult.calories} kcal/day`,
        "Protein": `${macroResult.protein} g/day`,
        "Carbohydrates": `${macroResult.carbs} g/day`,
        "Fat": `${macroResult.fat} g/day`,
        "Height": `${height} ${unitSystem === "metric" ? "cm" : "inches"}`,
        "Weight": `${weight} ${unitSystem === "metric" ? "kg" : "pounds"}`,
        "Age": age,
        "Gender": gender,
        "Activity Level": activity,
        "Diet Goal": goal,
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined,
    };

    downloadResultsAsCSV(results, "Macronutrient-Calculator");
    showSuccessToast("Results downloaded successfully!");
  };

  const copyResults = () => {
    const results = {
      title: "Macronutrient Calculator",
      results: {
        "Total Calories": `${macroResult.calories} kcal/day`,
        "Protein": `${macroResult.protein} g/day`,
        "Carbohydrates": `${macroResult.carbs} g/day`,
        "Fat": `${macroResult.fat} g/day`,
        "Height": `${height} ${unitSystem === "metric" ? "cm" : "inches"}`,
        "Weight": `${weight} ${unitSystem === "metric" ? "kg" : "pounds"}`,
        "Age": age,
        "Gender": gender,
        "Activity Level": activity,
        "Diet Goal": goal,
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || undefined,
    };

    copyResultsToClipboard(results);
    onCopiedChange(true);
    showSuccessToast("Results copied to clipboard!");
    setTimeout(() => onCopiedChange(false), 2000);
  };

  const shareLink = () => {
    const params = {
      height,
      weight,
      age,
      gender,
      activity,
      goal,
      system: unitSystem,
      name: userName || ""
    };
    const link = createShareableLink("macro", params);
    navigator.clipboard.writeText(link);
    showSuccessToast("Shareable link copied to clipboard!");
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <div className="text-center">
        <h3 className="text-xl font-bold">Your Macronutrient Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
          <div className="bg-white p-2 rounded shadow-sm">
            <span className="text-gray-500 text-xs">Calories</span>
            <p className="text-lg font-bold text-wellness-purple">{macroResult.calories}</p>
            <span className="text-xs">kcal/day</span>
          </div>
          <div className="bg-white p-2 rounded shadow-sm">
            <span className="text-gray-500 text-xs">Protein</span>
            <p className="text-lg font-bold text-wellness-blue">{macroResult.protein}g</p>
          </div>
          <div className="bg-white p-2 rounded shadow-sm">
            <span className="text-gray-500 text-xs">Carbs</span>
            <p className="text-lg font-bold text-wellness-green">{macroResult.carbs}g</p>
          </div>
          <div className="bg-white p-2 rounded shadow-sm">
            <span className="text-gray-500 text-xs">Fat</span>
            <p className="text-lg font-bold text-wellness-orange">{macroResult.fat}g</p>
          </div>
        </div>
        {userName && <p className="text-sm mt-2">Results for: {userName}</p>}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <Button variant="outline" size="sm" onClick={copyResults} className="flex items-center">
          {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
          {copied ? "Copied!" : "Copy Results"}
        </Button>
        <Button variant="outline" size="sm" onClick={shareLink} className="flex items-center">
          <Share className="h-4 w-4 mr-1" />
          Share Link
        </Button>
        <Button variant="outline" size="sm" onClick={downloadResults}>
          Download CSV
        </Button>
      </div>
      <div className="pt-4 text-center text-sm text-wellness-purple">
        <span>
          Results based on U.S.{unitSystem === "imperial" ? " (NIH Standards)" : " or Indian standards"}
        </span>
        <br />
        <span className="text-wellness-green">
          Generated by: survive<span className="lowercase">w</span>ellness
        </span>
      </div>
      <div className="mt-3 text-center text-sm text-wellness-purple">
        Thank you for using Survive<span className="lowercase">w</span>ellness!
      </div>
    </div>
  );
};

export default MacroCalculatorResults;
