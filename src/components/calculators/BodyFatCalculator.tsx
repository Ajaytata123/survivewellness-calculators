
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { calculateBodyFat } from "@/utils/calculationUtils";
import { BodyFatCalcProps, UnitSystem } from "@/types/calculatorTypes";
import { downloadResultsAsCSV, copyResultsToClipboard } from "@/utils/downloadUtils";
import { showSuccessToast, showErrorToast, showCopyToast, showDownloadToast } from "@/utils/notificationUtils";

const BodyFatCalculator: React.FC<BodyFatCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [waist, setWaist] = useState<string>("");
  const [neck, setNeck] = useState<string>("");
  const [hip, setHip] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [bodyFatResult, setBodyFatResult] = useState<number | null>(null);
  const [bodyFatCategory, setBodyFatCategory] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const calculateBodyFatResult = () => {
    if (!height || !waist || !neck || (gender === "female" && !hip)) {
      showErrorToast("Please fill in all required fields.");
      return;
    }

    const heightValue = parseFloat(height);
    const waistValue = parseFloat(waist);
    const neckValue = parseFloat(neck);
    const hipValue = gender === "female" ? parseFloat(hip) : undefined;

    if (
      isNaN(heightValue) ||
      isNaN(waistValue) ||
      isNaN(neckValue) ||
      (gender === "female" && isNaN(hipValue as number)) ||
      heightValue <= 0 ||
      waistValue <= 0 ||
      neckValue <= 0 ||
      (gender === "female" && (hipValue as number) <= 0)
    ) {
      showErrorToast("Please enter valid measurements.");
      return;
    }

    const bodyFat = calculateBodyFat(
      gender,
      waistValue,
      neckValue,
      heightValue,
      unitSystem === "metric",
      hipValue
    );

    setBodyFatResult(bodyFat);
    setBodyFatCategory(getBodyFatCategory(bodyFat, gender));
    showSuccessToast("Body fat calculated successfully!");
  };

  const getBodyFatCategory = (bodyFat: number, gender: string): string => {
    if (gender === "male") {
      if (bodyFat < 6) return "Essential Fat";
      if (bodyFat < 14) return "Athletic";
      if (bodyFat < 18) return "Fitness";
      if (bodyFat < 25) return "Average";
      return "Obese";
    } else {
      if (bodyFat < 16) return "Essential Fat";
      if (bodyFat < 21) return "Athletic";
      if (bodyFat < 25) return "Fitness";
      if (bodyFat < 32) return "Average";
      return "Obese";
    }
  };

  const handleUnitChange = (value: string) => {
    onUnitSystemChange(value as UnitSystem);
    // Reset fields when changing units
    setHeight("");
    setWeight("");
    setWaist("");
    setNeck("");
    setHip("");
    setBodyFatResult(null);
    setBodyFatCategory("");
  };

  const downloadResults = () => {
    if (bodyFatResult === null) {
      showErrorToast("Please calculate your body fat first.");
      return;
    }

    const results = {
      title: "Body Fat Percentage Calculator",
      results: {
        "Body Fat Percentage": `${bodyFatResult}%`,
        "Category": bodyFatCategory,
        "Height": `${height} ${unitSystem === "metric" ? "cm" : "inches"}`,
        "Waist": `${waist} ${unitSystem === "metric" ? "cm" : "inches"}`,
        "Neck": `${neck} ${unitSystem === "metric" ? "cm" : "inches"}`,
        ...(gender === "female" ? {"Hip": `${hip} ${unitSystem === "metric" ? "cm" : "inches"}`} : {}),
        "Gender": gender
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || "User"
    };

    downloadResultsAsCSV(results, "Body-Fat-Calculator");
    showDownloadToast();
  };

  const copyResults = () => {
    if (bodyFatResult === null) {
      showErrorToast("Please calculate your body fat first.");
      return;
    }

    const results = {
      title: "Body Fat Percentage Calculator",
      results: {
        "Body Fat Percentage": `${bodyFatResult}%`,
        "Category": bodyFatCategory,
        "Height": `${height} ${unitSystem === "metric" ? "cm" : "inches"}`,
        "Waist": `${waist} ${unitSystem === "metric" ? "cm" : "inches"}`,
        "Neck": `${neck} ${unitSystem === "metric" ? "cm" : "inches"}`,
        ...(gender === "female" ? {"Hip": `${hip} ${unitSystem === "metric" ? "cm" : "inches"}`} : {}),
        "Gender": gender
      },
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || "User"
    };

    copyResultsToClipboard(results);
    showCopyToast();
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Body Fat Calculator</h2>
      <p className="text-gray-600 mb-4 text-center">
        Calculate your body fat percentage using the U.S. Navy Method
      </p>

      <div className="mb-6">
        <Label htmlFor="userName">Your Name (Optional)</Label>
        <Input
          id="userName"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="mt-1"
        />
      </div>

      <Tabs
        defaultValue={unitSystem}
        onValueChange={handleUnitChange}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="imperial">Imperial (US)</TabsTrigger>
          <TabsTrigger value="metric">Metric</TabsTrigger>
        </TabsList>

        <TabsContent value="imperial" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="height-imperial">Height (inches)</Label>
            <Input
              id="height-imperial"
              type="number"
              placeholder="e.g., 70"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="neck-imperial">Neck Circumference (inches)</Label>
            <Input
              id="neck-imperial"
              type="number"
              placeholder="e.g., 15"
              value={neck}
              onChange={(e) => setNeck(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="waist-imperial">Waist Circumference (inches)</Label>
            <Input
              id="waist-imperial"
              type="number"
              placeholder="e.g., 34"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Measure around your navel
            </p>
          </div>

          {gender === "female" && (
            <div className="space-y-2">
              <Label htmlFor="hip-imperial">Hip Circumference (inches)</Label>
              <Input
                id="hip-imperial"
                type="number"
                placeholder="e.g., 40"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Measure at the widest point
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="metric" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="height-metric">Height (cm)</Label>
            <Input
              id="height-metric"
              type="number"
              placeholder="e.g., 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="neck-metric">Neck Circumference (cm)</Label>
            <Input
              id="neck-metric"
              type="number"
              placeholder="e.g., 38"
              value={neck}
              onChange={(e) => setNeck(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="waist-metric">Waist Circumference (cm)</Label>
            <Input
              id="waist-metric"
              type="number"
              placeholder="e.g., 85"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Measure around your navel
            </p>
          </div>

          {gender === "female" && (
            <div className="space-y-2">
              <Label htmlFor="hip-metric">Hip Circumference (cm)</Label>
              <Input
                id="hip-metric"
                type="number"
                placeholder="e.g., 100"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Measure at the widest point
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup
            value={gender}
            onValueChange={(value) => setGender(value as "male" | "female")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male-bf" />
              <Label htmlFor="male-bf">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female-bf" />
              <Label htmlFor="female-bf">Female</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <Button onClick={calculateBodyFatResult} className="w-full mb-6">
        Calculate Body Fat
      </Button>

      {bodyFatResult !== null && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Your Body Fat Result</h3>
            <p className="text-3xl font-bold my-2">{bodyFatResult}%</p>
            <p className="text-lg font-medium text-wellness-blue">{bodyFatCategory}</p>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Body Fat Categories ({gender === "male" ? "Men" : "Women"}):</h4>
            {gender === "male" ? (
              <ul className="text-sm space-y-1 text-gray-700">
                <li className="flex justify-between">
                  <span>Essential Fat</span>
                  <span>2-5%</span>
                </li>
                <li className="flex justify-between">
                  <span>Athletic</span>
                  <span>6-13%</span>
                </li>
                <li className="flex justify-between">
                  <span>Fitness</span>
                  <span>14-17%</span>
                </li>
                <li className="flex justify-between">
                  <span>Average</span>
                  <span>18-24%</span>
                </li>
                <li className="flex justify-between">
                  <span>Obese</span>
                  <span>25%+</span>
                </li>
              </ul>
            ) : (
              <ul className="text-sm space-y-1 text-gray-700">
                <li className="flex justify-between">
                  <span>Essential Fat</span>
                  <span>10-15%</span>
                </li>
                <li className="flex justify-between">
                  <span>Athletic</span>
                  <span>16-20%</span>
                </li>
                <li className="flex justify-between">
                  <span>Fitness</span>
                  <span>21-24%</span>
                </li>
                <li className="flex justify-between">
                  <span>Average</span>
                  <span>25-31%</span>
                </li>
                <li className="flex justify-between">
                  <span>Obese</span>
                  <span>32%+</span>
                </li>
              </ul>
            )}
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">
              Based on the U.S. Navy Method
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyResults}>
                Copy Results
              </Button>
              <Button variant="outline" size="sm" onClick={downloadResults}>
                Download CSV
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BodyFatCalculator;
