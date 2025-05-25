
import React from "react";
import { Card } from "@/components/ui/card";
import { MacroCalcProps } from "@/types/calculatorTypes";
import IntroSection from "@/components/calculator/IntroSection";
import { useMacroCalculator } from "./hooks/useMacroCalculator";
import MacroCalculatorForm from "./components/MacroCalculatorForm";
import MacroCalculatorResults from "./components/MacroCalculatorResults";

const MacroCalculator: React.FC<MacroCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const {
    userName,
    height,
    weight,
    age,
    gender,
    activity,
    goal,
    errors,
    macroResult,
    copied,
    setUserName,
    setHeight,
    setWeight,
    setAge,
    setGender,
    setActivity,
    setGoal,
    setCopied,
    handleUnitChange,
    calculateMacroResults,
    clearError
  } = useMacroCalculator(unitSystem, onUnitSystemChange);

  console.log('MacroCalculator rendering, about to show IntroSection');

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Macronutrient Calculator</h2>
        <p className="text-gray-600 mb-4 text-center">
          Determine daily calories and macros for your goals
        </p>

        <MacroCalculatorForm
          unitSystem={unitSystem}
          userName={userName}
          height={height}
          weight={weight}
          age={age}
          gender={gender}
          activity={activity}
          goal={goal}
          errors={errors}
          onUserNameChange={setUserName}
          onHeightChange={setHeight}
          onWeightChange={setWeight}
          onAgeChange={setAge}
          onGenderChange={setGender}
          onActivityChange={setActivity}
          onGoalChange={setGoal}
          onUnitChange={handleUnitChange}
          onCalculate={calculateMacroResults}
          onClearError={clearError}
        />

        {macroResult && (
          <MacroCalculatorResults
            macroResult={macroResult}
            userName={userName}
            height={height}
            weight={weight}
            age={age}
            gender={gender}
            activity={activity}
            goal={goal}
            unitSystem={unitSystem}
            copied={copied}
            onCopiedChange={setCopied}
          />
        )}
      </Card>

      {/* Info section displayed as a separate card */}
      <IntroSection calculatorId="macro" title="" description="" />
    </div>
  );
};

export default MacroCalculator;
