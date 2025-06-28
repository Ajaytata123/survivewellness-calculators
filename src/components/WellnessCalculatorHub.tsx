
import React, { useState, useEffect } from "react";
import CalculatorSidebar from "./CalculatorSidebar";
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
      setSearchQuery("");
    }
    
    // Update URL hash for iframe compatibility
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${calculatorId}`);
    }
  };

  const handleUnitSystemChange = (system: UnitSystem) => {
    setUnitSystem(system);
  };

  useEffect(() => {
    // Handle initial load and external button clicks (for iframe integration)
    const initializeCalculator = () => {
      const hash = window.location.hash.substring(1);
      if (hash && calculators.some(calc => calc.id === hash)) {
        setActiveCalculator(hash);
      }
    };

    // Initialize on mount
    initializeCalculator();

    // Handle external button clicks for iframe integration
    const handleCalculatorButtonClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const buttonId = target.id;
      
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
        window.location.hash = buttonToCalculatorMap[buttonId];
      }
    };

    // Add event listeners with error handling for iframe integration
    const addEventListeners = () => {
      try {
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
      } catch (error) {
        console.log('External button integration not available');
      }
    };

    // Delay to ensure DOM is ready
    setTimeout(addEventListeners, 100);

    // Listen for hash changes
    const handleHashChange = () => {
      initializeCalculator();
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      
      // Cleanup event listeners
      try {
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
      } catch (error) {
        // Ignore cleanup errors
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Optimized for iframe */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-gray-100">
        <div className="text-center py-6 px-4 max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800 font-['Poppins']">
            SurviveWellness Calculator Hub
          </h1>
          <p className="text-gray-600 text-base md:text-lg font-['Poppins'] max-w-2xl mx-auto leading-relaxed">
            Explore our comprehensive collection of professional health and wellness calculators
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
