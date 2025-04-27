
// Input validation utility functions

// Age validation (typically 0-120 years)
export const validateAge = (age: number): string | null => {
  if (age < 0) return "Age cannot be negative";
  if (age > 120) return "Please enter a valid age (0-120 years)";
  return null;
};

// Weight validation in kg (typically 0.5-500 kg)
export const validateWeightKg = (weight: number): string | null => {
  if (weight < 0.5) return "Weight must be at least 0.5 kg";
  if (weight > 500) return "Please enter a valid weight (0.5-500 kg)";
  return null;
};

// Weight validation in lbs (typically 1-1100 lbs)
export const validateWeightLbs = (weight: number): string | null => {
  if (weight < 1) return "Weight must be at least 1 lb";
  if (weight > 1100) return "Please enter a valid weight (1-1100 lbs)";
  return null;
};

// Height validation in cm (typically 30-250 cm)
export const validateHeightCm = (height: number): string | null => {
  if (height < 30) return "Height must be at least 30 cm";
  if (height > 250) return "Please enter a valid height (30-250 cm)";
  return null;
};

// Height validation in inches (typically 12-96 inches)
export const validateHeightInches = (height: number): string | null => {
  if (height < 12) return "Height must be at least 12 inches";
  if (height > 96) return "Please enter a valid height (12-96 inches)";
  return null;
};

// Body fat percentage validation (typically 2-70%)
export const validateBodyFat = (bodyFat: number): string | null => {
  if (bodyFat < 2) return "Body fat cannot be less than 2%";
  if (bodyFat > 70) return "Please enter a valid body fat percentage (2-70%)";
  return null;
};

// Heart rate validation (typically 30-220 bpm)
export const validateHeartRate = (heartRate: number): string | null => {
  if (heartRate < 30) return "Heart rate must be at least 30 bpm";
  if (heartRate > 220) return "Please enter a valid heart rate (30-220 bpm)";
  return null;
};

// Step count validation (typically 0-100,000 steps)
export const validateStepCount = (steps: number): string | null => {
  if (steps < 0) return "Step count cannot be negative";
  if (steps > 100000) return "Please enter a valid step count (0-100,000)";
  return null;
};

// Water intake validation (typically 0-10 liters)
export const validateWaterIntake = (water: number): string | null => {
  if (water < 0) return "Water intake cannot be negative";
  if (water > 10) return "Please enter a valid water intake (0-10 liters)";
  return null;
};

// Generic validation function for any input with minimum and maximum values
export const validateRange = (value: number, min: number, max: number, fieldName: string): string | null => {
  if (value < min) return `${fieldName} must be at least ${min}`;
  if (value > max) return `${fieldName} must be no more than ${max}`;
  return null;
};
