
import React, { useState, useEffect } from "react";
import { CalculatorSidebar } from "./CalculatorSidebar";
import CalculatorDisplay from "./CalculatorDisplay";
import { calculators } from "@/data/calculatorData";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileCalculatorView } from "./MobileCalculatorView";
import { DesktopLayout } from "./calculator/DesktopLayout";
import { UnitSystem } from "@/types/calculatorTypes";

const WellnessCalculatorHub: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<string>("bmi");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("imperial");
  const isMobile = useIsMobile();

  const handleCalculatorSelect = (calculatorId: string) => {
    setActiveCalculator(calculatorId);
    if (isMobile) {
      // For mobile, reset search when a calculator is selected
      setSearchQuery("");
    }
    
    // Always scroll to top when calculator is selected
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Also scroll the main content area to top for desktop
      if (!isMobile) {
        const mainContent = document.querySelector('.calculator-display-area');
        if (mainContent) {
          mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }, 100);
  };

  const handleUnitSystemChange = (system: UnitSystem) => {
    setUnitSystem(system);
  };

  useEffect(() => {
    // Get calculator from URL hash if present
    const hash = window.location.hash.substring(1);
    if (hash && calculators.some(calc => calc.id === hash)) {
      setActiveCalculator(hash);
    }

    // Listen for calculator button clicks for iframe integration
    const handleCalculatorButtonClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const buttonId = target.id;
      
      // Map button IDs to calculator IDs
      const buttonToCalculatorMap: { [key: string]: string } = {
        'SurviveWellnessBMI': 'bmi',
        'SurviveWellnessBMR': 'bmr',
        'SurviveWellnessBodyFat': 'bodyfat',
        'SurviveWellnessIdealWeight': 'idealweight',
        'SurviveWellnessObesityRisk': 'obesity',
        'SurviveWellnessAge': 'age',
        'SurviveWellnessHeartRate': 'heartrate',
        'SurviveWellnessVO2Max': 'vo2max',
        'SurviveWellnessWorkout': 'workout',
        'SurviveWellnessSteps': 'steps',
        'SurviveWellnessMacro': 'macro',
        'SurviveWellnessWater': 'water',
        'SurviveWellnessFasting': 'fasting',
        'SurviveWellnessCalories': 'calories',
        'SurviveWellnessMealPlan': 'mealplan',
        'SurviveWellnessPregnancy': 'pregnancy',
        'SurviveWellnessAlcohol': 'alcohol',
        'SurviveWellnessSmoking': 'smoking',
        'SurviveWellnessStress': 'stress',
        'SurviveWellnessOvulation': 'ovulation',
        'SurviveWellnessDueDate': 'duedate',
        'SurviveWellnessPeriod': 'menstrual',
        'SurviveWellnessMenopause': 'menopause',
        'SurviveWellnessBreastCancer': 'breastcancer',
        'SurviveWellnessOsteoporosis': 'osteoporosis',
        'SurviveWellnessIron': 'iron'
      };

      if (buttonToCalculatorMap[buttonId]) {
        setActiveCalculator(buttonToCalculatorMap[buttonId]);
        // Update URL hash
        window.location.hash = buttonToCalculatorMap[buttonId];
      }
    };

    // Add event listeners for all calculator buttons
    Object.keys({
      'SurviveWellnessBMI': 'bmi',
      'SurviveWellnessBMR': 'bmr',
      'SurviveWellnessBodyFat': 'bodyfat',
      'SurviveWellnessIdealWeight': 'idealweight',
      'SurviveWellnessObesityRisk': 'obesity',
      'SurviveWellnessAge': 'age',
      'SurviveWellnessHeartRate': 'heartrate',
      'SurviveWellnessVO2Max': 'vo2max',
      'SurviveWellnessWorkout': 'workout',
      'SurviveWellnessSteps': 'steps',
      'SurviveWellnessMacro': 'macro',
      'SurviveWellnessWater': 'water',
      'SurviveWellnessFasting': 'fasting',
      'SurviveWellnessCalories': 'calories',
      'SurviveWellnessMealPlan': 'mealplan',
      'SurviveWellnessPregnancy': 'pregnancy',
      'SurviveWellnessAlcohol': 'alcohol',
      'SurviveWellnessSmoking': 'smoking',
      'SurviveWellnessStress': 'stress',
      'SurviveWellnessOvulation': 'ovulation',
      'SurviveWellnessDueDate': 'duedate',
      'SurviveWellnessPeriod': 'menstrual',
      'SurviveWellnessMenopause': 'menopause',
      'SurviveWellnessBreastCancer': 'breastcancer',
      'SurviveWellnessOsteoporosis': 'osteoporosis',
      'SurviveWellnessIron': 'iron'
    }).forEach(buttonId => {
      const button = document.getElementById(buttonId);
      if (button) {
        button.addEventListener('click', handleCalculatorButtonClick);
      }
    });

    // Cleanup event listeners
    return () => {
      Object.keys({
        'SurviveWellnessBMI': 'bmi',
        'SurviveWellnessBMR': 'bmr',
        'SurviveWellnessBodyFat': 'bodyfat',
        'SurviveWellnessIdealWeight': 'idealweight',
        'SurviveWellnessObesityRisk': 'obesity',
        'SurviveWellnessAge': 'age',
        'SurviveWellnessHeartRate': 'heartrate',
        'SurviveWellnessVO2Max': 'vo2max',
        'SurviveWellnessWorkout': 'workout',
        'SurviveWellnessSteps': 'steps',
        'SurviveWellnessMacro': 'macro',
        'SurviveWellnessWater': 'water',
        'SurviveWellnessFasting': 'fasting',
        'SurviveWellnessCalories': 'calories',
        'SurviveWellnessMealPlan': 'mealplan',
        'SurviveWellnessPregnancy': 'pregnancy',
        'SurviveWellnessAlcohol': 'alcohol',
        'SurviveWellnessSmoking': 'smoking',
        'SurviveWellnessStress': 'stress',
        'SurviveWellnessOvulation': 'ovulation',
        'SurviveWellnessDueDate': 'duedate',
        'SurviveWellnessPeriod': 'menstrual',
        'SurviveWellnessMenopause': 'menopause',
        'SurviveWellnessBreastCancer': 'breastcancer',
        'SurviveWellnessOsteoporosis': 'osteoporosis',
        'SurviveWellnessIron': 'iron'
      }).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
          button.removeEventListener('click', handleCalculatorButtonClick);
        }
      });
    };
  }, []);

  // Update hash when calculator changes
  useEffect(() => {
    if (activeCalculator) {
      window.location.hash = activeCalculator;
    }
  }, [activeCalculator]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-gray-100">
        <div className="text-center py-8 px-4 max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-3 text-gray-800 font-['Poppins']">
            SurviveWellness Calculator Hub
          </h1>
          <p className="text-gray-600 text-lg font-['Poppins'] max-w-2xl mx-auto leading-relaxed">
            Explore our comprehensive collection of professional health and wellness calculators to track your fitness progress and make informed decisions
          </p>
        </div>
      </div>
      
      {isMobile ? (
        <MobileCalculatorView
          calculators={calculators}
          activeCalculator={activeCalculator}
          onCalculatorSelect={handleCalculatorSelect}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          unitSystem={unitSystem}
          onUnitSystemChange={handleUnitSystemChange}
        />
      ) : (
        <DesktopLayout
          calculators={calculators}
          activeCalculator={activeCalculator}
          onCalculatorSelect={handleCalculatorSelect}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          unitSystem={unitSystem}
          onUnitSystemChange={handleUnitSystemChange}
        />
      )}
    </div>
  );
};

export default WellnessCalculatorHub;
