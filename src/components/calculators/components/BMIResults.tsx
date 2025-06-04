
import React from "react";
import { UnitSystem } from "@/types/calculatorTypes";
import ResultActions from "@/components/calculator/ResultActions";

interface BMIResultsProps {
  bmi: number;
  category: string;
  userName: string;
  height: string;
  weight: string;
  unitSystem: UnitSystem;
}

const BMIResults: React.FC<BMIResultsProps> = ({
  bmi,
  category,
  userName,
  height,
  weight,
  unitSystem,
}) => {
  const prepareResults = () => {
    return {
      "BMI Value": bmi.toFixed(1),
      "BMI Category": category,
      "Height": `${height} ${unitSystem === "metric" ? "cm" : "inches"}`,
      "Weight": `${weight} ${unitSystem === "metric" ? "kg" : "pounds"}`
    };
  };

  return (
    <div className="results-container bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <div className="text-center mb-3">
        <h3 className="text-xl font-bold">Your BMI Results</h3>
        {userName && <p className="text-sm mb-2">Results for: {userName}</p>}
      </div>
      
      <div className="result-highlight rounded-md text-center p-4 bg-wellness-softPurple dark:bg-wellness-softPurple/30 mb-4">
        <div className="flex justify-around items-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your BMI</p>
            <p className="text-3xl font-bold text-wellness-purple dark:text-wellness-purple/90">
              {bmi.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
            <p className="text-xl font-bold">{category}</p>
          </div>
        </div>
      </div>
      
      <ResultActions
        title="BMI Calculator"
        results={prepareResults()}
        fileName="BMI-Calculator"
        userName={userName}
        unitSystem={unitSystem}
      />
    </div>
  );
};

export default BMIResults;
