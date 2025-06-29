
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnitSystem } from "@/types/calculatorTypes";

interface HeightInputProps {
  unitSystem: UnitSystem;
  height: string;
  onHeightChange: (height: string) => void;
  id?: string;
  error?: string;
}

export const HeightInput: React.FC<HeightInputProps> = ({
  unitSystem,
  height,
  onHeightChange,
  id = "height",
  error
}) => {
  const [inputType, setInputType] = useState<'single' | 'dual'>('single');
  const [feet, setFeet] = useState<string>('');
  const [inches, setInches] = useState<string>('');
  const [cm, setCm] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(!!error);
  const [errorMessage, setErrorMessage] = useState<string>(error || '');

  // Initialize values based on input height
  useEffect(() => {
    if (height && unitSystem === 'imperial' && inputType === 'dual') {
      const totalInches = parseFloat(height);
      const feetValue = Math.floor(totalInches / 12);
      const inchesValue = Math.round(totalInches % 12);
      setFeet(feetValue.toString());
      setInches(inchesValue.toString());
    } else if (height && unitSystem === 'metric' && inputType === 'dual') {
      // For metric, we'll convert the cm to feet/cm for display
      const totalCm = parseFloat(height);
      const feetValue = Math.floor(totalCm / 30.48);
      const cmValue = Math.round(totalCm % 30.48);
      setFeet(feetValue.toString());
      setCm(cmValue.toString());
    }
  }, [unitSystem, inputType, height]);

  // Update error status when external error prop changes
  useEffect(() => {
    setHasError(!!error);
    setErrorMessage(error || '');
  }, [error]);

  const validateAndUpdateHeight = () => {
    setHasError(false);
    setErrorMessage('');
    
    if (unitSystem === 'imperial') {
      if (inputType === 'single') {
        const heightValue = parseFloat(height);
        if (isNaN(heightValue) || heightValue <= 0) {
          setHasError(true);
          setErrorMessage('Please enter a valid height');
          return false;
        }
      } else {
        const feetValue = parseFloat(feet);
        const inchesValue = parseFloat(inches);
        if (isNaN(feetValue) || isNaN(inchesValue) || feetValue < 0 || inchesValue < 0) {
          setHasError(true);
          setErrorMessage('Please enter valid feet and inches');
          return false;
        }
        const totalInches = (feetValue * 12) + inchesValue;
        onHeightChange(totalInches.toString());
      }
    } else {
      if (inputType === 'single') {
        const heightValue = parseFloat(height);
        if (isNaN(heightValue) || heightValue <= 0) {
          setHasError(true);
          setErrorMessage('Please enter a valid height');
          return false;
        }
      } else {
        const feetValue = parseFloat(feet);
        const cmValue = parseFloat(cm);
        if (isNaN(feetValue) || isNaN(cmValue) || feetValue < 0 || cmValue < 0) {
          setHasError(true);
          setErrorMessage('Please enter valid feet and centimeters');
          return false;
        }
        const totalCm = (feetValue * 30.48) + cmValue;
        onHeightChange(totalCm.toString());
      }
    }
    return true;
  };

  const handleFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeet(e.target.value);
    const feetValue = parseFloat(e.target.value) || 0;
    const inchesValue = parseFloat(inches) || 0;
    const cmValue = parseFloat(cm) || 0;
    
    if (unitSystem === 'imperial') {
      const totalInches = (feetValue * 12) + inchesValue;
      onHeightChange(totalInches.toString());
    } else {
      const totalCm = (feetValue * 30.48) + cmValue;
      onHeightChange(Math.round(totalCm).toString());
    }
  };

  const handleInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInches(e.target.value);
    const feetValue = parseFloat(feet) || 0;
    const inchesValue = parseFloat(e.target.value) || 0;
    
    const totalInches = (feetValue * 12) + inchesValue;
    onHeightChange(totalInches.toString());
  };

  const handleCmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCm(e.target.value);
    const feetValue = parseFloat(feet) || 0;
    const cmValue = parseFloat(e.target.value) || 0;
    
    const totalCm = (feetValue * 30.48) + cmValue;
    onHeightChange(Math.round(totalCm).toString());
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onHeightChange(e.target.value);
  };

  const handleInputTypeChange = (value: string) => {
    setInputType(value as 'single' | 'dual');
    // Reset errors when changing input type
    setHasError(false);
    setErrorMessage('');
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Height</Label>

      <RadioGroup
        value={inputType}
        onValueChange={handleInputTypeChange}
        className="grid grid-cols-2 gap-2 mb-2"
      >
        <div className={`bg-gray-100 dark:bg-gray-800 rounded-md p-3 flex items-center space-x-2 ${inputType === 'single' ? 'ring-2 ring-wellness-purple' : ''}`}>
          <RadioGroupItem value="single" id={`${id}-single`} />
          <Label htmlFor={`${id}-single`} className="cursor-pointer">
            {unitSystem === 'imperial' ? 'Inches' : 'Centimeters'}
          </Label>
        </div>
        <div className={`bg-gray-100 dark:bg-gray-800 rounded-md p-3 flex items-center space-x-2 ${inputType === 'dual' ? 'ring-2 ring-wellness-purple' : ''}`}>
          <RadioGroupItem value="dual" id={`${id}-dual`} />
          <Label htmlFor={`${id}-dual`} className="cursor-pointer">
            {unitSystem === 'imperial' ? 'Feet & Inches' : 'Feet & Centimeters'}
          </Label>
        </div>
      </RadioGroup>

      {inputType === 'single' ? (
        <Input
          id={id}
          type="number"
          value={height}
          onChange={handleHeightChange}
          placeholder={unitSystem === 'imperial' ? 'e.g., 70' : 'e.g., 178'}
          className={hasError ? 'border-red-500' : ''}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor={`${id}-feet`}>Feet</Label>
            <Input
              id={`${id}-feet`}
              type="number"
              value={feet}
              onChange={handleFeetChange}
              placeholder="e.g., 5"
              className={hasError ? 'border-red-500' : ''}
            />
          </div>
          <div>
            <Label htmlFor={`${id}-secondary`}>
              {unitSystem === 'imperial' ? 'Inches' : 'Centimeters'}
            </Label>
            <Input
              id={`${id}-secondary`}
              type="number"
              value={unitSystem === 'imperial' ? inches : cm}
              onChange={unitSystem === 'imperial' ? handleInchesChange : handleCmChange}
              placeholder={unitSystem === 'imperial' ? 'e.g., 10' : 'e.g., 15'}
              className={hasError ? 'border-red-500' : ''}
            />
          </div>
        </div>
      )}

      {hasError && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}

      {unitSystem === 'imperial' ? (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {inputType === 'single' 
            ? "Enter height in total inches" 
            : "For 5'10\", enter 5 feet and 10 inches"}
        </p>
      ) : (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {inputType === 'single' 
            ? "Enter height in centimeters" 
            : "For 5 feet and 10 cm, enter accordingly"}
        </p>
      )}
    </div>
  );
};
