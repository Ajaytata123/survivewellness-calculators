
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CalculatorLink {
  id: string;
  name: string;
  category: string;
  path: string;
}

const calculatorLinks: CalculatorLink[] = [
  // Fitness & Body Composition
  { id: 'bmi', name: 'BMI Calculator', category: 'Fitness', path: '/#bmi' },
  { id: 'bmr', name: 'BMR Calculator', category: 'Fitness', path: '/#bmr' },
  { id: 'bodyfat', name: 'Body Fat Calculator', category: 'Fitness', path: '/#bodyfat' },
  { id: 'idealweight', name: 'Ideal Weight Calculator', category: 'Fitness', path: '/#idealweight' },
  { id: 'vo2max', name: 'VO2 Max Calculator', category: 'Fitness', path: '/#vo2max' },
  { id: 'heartrate', name: 'Heart Rate Calculator', category: 'Fitness', path: '/#heartrate' },
  
  // Nutrition & Diet
  { id: 'macro', name: 'Macro Calculator', category: 'Nutrition', path: '/#macro' },
  { id: 'macronutrient', name: 'Macronutrient Calculator', category: 'Nutrition', path: '/#macronutrient' },
  { id: 'waterintake', name: 'Water Intake Calculator', category: 'Nutrition', path: '/#waterintake' },
  { id: 'calorietracker', name: 'Calorie Tracker', category: 'Nutrition', path: '/#calorietracker' },
  { id: 'ironintake', name: 'Iron Intake Calculator', category: 'Nutrition', path: '/#ironintake' },
  { id: 'mealplan', name: 'Meal Planner', category: 'Nutrition', path: '/#mealplan' },
  
  // Lifestyle & Wellness
  { id: 'intermittentfasting', name: 'Intermittent Fasting Calculator', category: 'Lifestyle', path: '/#intermittentfasting' },
  { id: 'workoutplanner', name: 'Workout Planner', category: 'Lifestyle', path: '/#workoutplanner' },
  { id: 'stepcounter', name: 'Step Counter Calculator', category: 'Lifestyle', path: '/#stepcounter' },
  { id: 'stressanxiety', name: 'Stress & Anxiety Calculator', category: 'Mental Health', path: '/#stressanxiety' },
  
  // Women's Health
  { id: 'menstrualcycle', name: 'Menstrual Cycle Calculator', category: 'Women\'s Health', path: '/#menstrualcycle' },
  { id: 'ovulation', name: 'Ovulation Calculator', category: 'Women\'s Health', path: '/#ovulation' },
  { id: 'period', name: 'Period Calculator', category: 'Women\'s Health', path: '/#period' },
  { id: 'duedate', name: 'Due Date Calculator', category: 'Women\'s Health', path: '/#duedate' },
  { id: 'pregnancyweight', name: 'Pregnancy Weight Calculator', category: 'Women\'s Health', path: '/#pregnancyweight' },
  { id: 'menopause', name: 'Menopause Calculator', category: 'Women\'s Health', path: '/#menopause' },
  { id: 'menopauseestimator', name: 'Menopause Estimator', category: 'Women\'s Health', path: '/#menopauseestimator' },
  
  // Health Risk Assessment
  { id: 'breastcancerrisk', name: 'Breast Cancer Risk Calculator', category: 'Health Risk', path: '/#breastcancerrisk' },
  { id: 'obesityrisk', name: 'Obesity Risk Calculator', category: 'Health Risk', path: '/#obesityrisk' },
  { id: 'osteoporosisrisk', name: 'Osteoporosis Risk Calculator', category: 'Health Risk', path: '/#osteoporosisrisk' },
  
  // Lifestyle Impact
  { id: 'smokingimpact', name: 'Smoking Impact Calculator', category: 'Lifestyle Impact', path: '/#smokingimpact' },
  { id: 'alcoholimpact', name: 'Alcohol Impact Calculator', category: 'Lifestyle Impact', path: '/#alcoholimpact' },
  
  // General
  { id: 'age', name: 'Age Calculator', category: 'General', path: '/#age' }
];

const CalculatorNavigation: React.FC = () => {
  const categories = [...new Set(calculatorLinks.map(calc => calc.category))];

  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Health & Wellness Calculators</h2>
        <p className="text-gray-600">Navigate to any calculator using the buttons below</p>
      </div>

      {categories.map(category => (
        <Card key={category} className="p-4">
          <h3 className="text-lg font-semibold mb-3 text-purple-700">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {calculatorLinks
              .filter(calc => calc.category === category)
              .map(calc => (
                <Button
                  key={calc.id}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto py-2 px-3"
                  onClick={() => handleNavigate(calc.path)}
                >
                  {calc.name}
                </Button>
              ))}
          </div>
        </Card>
      ))}

      <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <h4 className="font-semibold text-purple-800 mb-2">Custom Domain Integration</h4>
        <p className="text-sm text-purple-700 mb-2">
          To hide Netlify/Lovable branding and use custom domains:
        </p>
        <ul className="text-xs text-purple-600 space-y-1 ml-4 list-disc">
          <li>Set up a custom domain in your deployment settings</li>
          <li>Use CNAME records to point your domain to the deployment</li>
          <li>Enable SSL/TLS certificates for secure connections</li>
          <li>Configure proper redirects for SEO optimization</li>
        </ul>
      </div>
    </div>
  );
};

export default CalculatorNavigation;
