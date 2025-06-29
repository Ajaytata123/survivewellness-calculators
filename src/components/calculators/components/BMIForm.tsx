
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeightInputField } from "@/components/ui/height-input-field";
import { UnitSystem } from "@/types/calculatorTypes";

interface BMIFormProps {
  unitSystem: UnitSystem;
  height: string;
  weight: string;
  userName: string;
  errors: {
    height?: string;
    weight?: string;
  };
  onHeightChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onUserNameChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  onCalculate: () => void;
}

const BMIForm: React.FC<BMIFormProps> = ({
  unitSystem,
  height,
  weight,
  userName,
  errors,
  onHeightChange,
  onWeightChange,
  onUserNameChange,
  onUnitChange,
  onCalculate,
}) => {
  return (
    <>
      <div className="mb-6">
        <Label htmlFor="userName">Your Name (optional)</Label>
        <Input
          id="userName"
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => onUserNameChange(e.target.value)}
          className="mt-1"
        />
      </div>

      <Tabs
        defaultValue={unitSystem}
        onValueChange={onUnitChange}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="imperial">Imperial (US)</TabsTrigger>
          <TabsTrigger value="metric">Metric</TabsTrigger>
        </TabsList>

        <TabsContent value="imperial" className="space-y-4">
          <HeightInputField 
            unitSystem="imperial"
            height={height}
            setHeight={onHeightChange}
            error={errors.height}
          />

          <div className="space-y-2">
            <Label htmlFor="weight-imperial">Weight (pounds)</Label>
            <Input
              id="weight-imperial"
              type="number"
              placeholder="e.g., 160"
              value={weight}
              onChange={(e) => onWeightChange(e.target.value)}
              className={errors.weight ? "border-red-500" : ""}
            />
            {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
          </div>
        </TabsContent>

        <TabsContent value="metric" className="space-y-4">
          <HeightInputField 
            unitSystem="metric"
            height={height}
            setHeight={onHeightChange}
            error={errors.height}
          />

          <div className="space-y-2">
            <Label htmlFor="weight-metric">Weight (kg)</Label>
            <Input
              id="weight-metric"
              type="number"
              placeholder="e.g., 70"
              value={weight}
              onChange={(e) => onWeightChange(e.target.value)}
              className={errors.weight ? "border-red-500" : ""}
            />
            {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
          </div>
        </TabsContent>
      </Tabs>

      <Button onClick={onCalculate} className="w-full mb-6">
        Calculate BMI
      </Button>
    </>
  );
};

export default BMIForm;
