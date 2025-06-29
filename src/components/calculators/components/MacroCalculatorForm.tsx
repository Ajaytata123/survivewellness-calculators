
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UnitSystem } from "@/types/calculatorTypes";
import { FormErrors } from "../hooks/useMacroCalculator";

interface MacroCalculatorFormProps {
  unitSystem: UnitSystem;
  userName: string;
  height: string;
  weight: string;
  age: string;
  gender: "male" | "female";
  activity: string;
  goal: string;
  errors: FormErrors;
  onUserNameChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onGenderChange: (value: "male" | "female") => void;
  onActivityChange: (value: string) => void;
  onGoalChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  onCalculate: () => void;
  onClearError: (field: keyof FormErrors) => void;
}

const MacroCalculatorForm: React.FC<MacroCalculatorFormProps> = ({
  unitSystem,
  userName,
  height,
  weight,
  age,
  gender,
  activity,
  goal,
  errors,
  onUserNameChange,
  onHeightChange,
  onWeightChange,
  onAgeChange,
  onGenderChange,
  onActivityChange,
  onGoalChange,
  onUnitChange,
  onCalculate,
  onClearError
}) => {
  return (
    <>
      <div className="space-y-4 mb-4">
        <Label htmlFor="name" className="text-left block mb-2">Your Name (optional)</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => onUserNameChange(e.target.value)}
        />
      </div>

      <Tabs defaultValue={unitSystem} onValueChange={onUnitChange} className="mb-6">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="imperial">Imperial (US)</TabsTrigger>
          <TabsTrigger value="metric">Metric</TabsTrigger>
        </TabsList>

        <TabsContent value="imperial" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="height-imperial" className="text-left block mb-2 flex justify-between">
              Height (inches)
              {errors.height && <span className="text-red-500 text-sm">{errors.height}</span>}
            </Label>
            <Input
              id="height-imperial"
              type="number"
              placeholder="e.g., 70"
              value={height}
              onChange={e => {
                onHeightChange(e.target.value);
                if (e.target.value) onClearError('height');
              }}
              className={errors.height ? "border-red-500" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight-imperial" className="text-left block mb-2 flex justify-between">
              Weight (pounds)
              {errors.weight && <span className="text-red-500 text-sm">{errors.weight}</span>}
            </Label>
            <Input
              id="weight-imperial"
              type="number"
              placeholder="e.g., 160"
              value={weight}
              onChange={e => {
                onWeightChange(e.target.value);
                if (e.target.value) onClearError('weight');
              }}
              className={errors.weight ? "border-red-500" : ""}
            />
          </div>
        </TabsContent>

        <TabsContent value="metric" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="height-metric" className="text-left block mb-2 flex justify-between">
              Height (cm)
              {errors.height && <span className="text-red-500 text-sm">{errors.height}</span>}
            </Label>
            <Input
              id="height-metric"
              type="number"
              placeholder="e.g., 175"
              value={height}
              onChange={e => {
                onHeightChange(e.target.value);
                if (e.target.value) onClearError('height');
              }}
              className={errors.height ? "border-red-500" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight-metric" className="text-left block mb-2 flex justify-between">
              Weight (kg)
              {errors.weight && <span className="text-red-500 text-sm">{errors.weight}</span>}
            </Label>
            <Input
              id="weight-metric"
              type="number"
              placeholder="e.g., 70"
              value={weight}
              onChange={e => {
                onWeightChange(e.target.value);
                if (e.target.value) onClearError('weight');
              }}
              className={errors.weight ? "border-red-500" : ""}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-2 mb-4">
        <Label htmlFor="age" className="text-left block mb-2 flex justify-between">
          Age
          {errors.age && <span className="text-red-500 text-sm">{errors.age}</span>}
        </Label>
        <Input
          id="age"
          type="number"
          placeholder="e.g., 30"
          value={age}
          onChange={e => {
            onAgeChange(e.target.value);
            if (e.target.value) onClearError('age');
          }}
          className={errors.age ? "border-red-500" : ""}
        />
      </div>

      <div className="space-y-2 mb-4">
        <Label className="text-left block mb-2">Gender</Label>
        <RadioGroup
          value={gender}
          onValueChange={val => onGenderChange(val as "male" | "female")}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male-macro" />
            <Label htmlFor="male-macro">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female-macro" />
            <Label htmlFor="female-macro">Female</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2 mb-4">
        <Label htmlFor="activity" className="text-left block mb-2">Activity Level</Label>
        <select
          id="activity"
          className="block w-full rounded-md border border-input px-3 py-2 bg-background"
          value={activity}
          onChange={e => onActivityChange(e.target.value)}
        >
          <option value="sedentary">Sedentary (little/no exercise)</option>
          <option value="light">Light (1-3 days/week)</option>
          <option value="moderate">Moderate (3-5 days/week)</option>
          <option value="active">Active (6-7 days/week)</option>
          <option value="veryActive">Very Active (physical job/2× training)</option>
        </select>
      </div>

      <div className="space-y-2 mb-6">
        <Label htmlFor="goal" className="text-left block mb-2">Diet Goal</Label>
        <select
          id="goal"
          className="block w-full rounded-md border border-input px-3 py-2 bg-background"
          value={goal}
          onChange={e => onGoalChange(e.target.value)}
        >
          <option value="lose">Lose Weight</option>
          <option value="maintain">Maintain Weight</option>
          <option value="gain">Gain Weight</option>
          <option value="gainMuscle">Gain Muscle</option>
        </select>
      </div>

      <Button onClick={onCalculate} className="w-full mb-6">
        Calculate Macros
      </Button>
    </>
  );
};

export default MacroCalculatorForm;
