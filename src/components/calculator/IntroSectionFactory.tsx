
import React from 'react';
import IntroSection from './IntroSection';

interface IntroSectionFactoryProps {
  calculatorId: string;
}

const IntroSectionFactory: React.FC<IntroSectionFactoryProps> = ({ calculatorId }) => {
  // Using a map to store all calculator introductions
  const introductions: Record<string, { title: string; description: string }> = {
    // Body Composition
    'bmi': {
      title: 'What is BMI?',
      description: 'Body Mass Index (BMI) is a measure of body fat based on height and weight that applies to adult men and women. It's used to screen for weight categories that may lead to health problems, though it doesn't diagnose the body fatness or health of an individual.'
    },
    'bodyFat': {
      title: 'What is Body Fat?',
      description: 'Body fat percentage is the portion of your body weight that is composed of fat. It\'s an important measure of fitness and health that goes beyond what a scale or BMI calculation can tell you, as it distinguishes between fat mass and lean mass (muscles, bones, organs, etc).'
    },
    'obesityRisk': {
      title: 'What is Obesity Risk?',
      description: 'Obesity risk assessment evaluates your likelihood of developing obesity-related health complications based on various factors including BMI, waist circumference, and other health indicators. Early identification of risk can help prevent serious health conditions.'
    },
    'age': {
      title: 'What is Age Calculator?',
      description: 'The Age Calculator computes your exact age in years, months, and days based on your date of birth. It can also determine the time span between any two dates, helping you track precise time periods or plan for important events.'
    },
    'idealWeight': {
      title: 'What is Ideal Weight?',
      description: 'The Ideal Weight calculator estimates a healthy weight range based on your height, gender, and body frame. It uses several formulas including BMI, Hamwi, Devine, and Robinson to provide a comprehensive weight range recommendation.'
    },
    
    // Fitness & Exercise
    'vo2Max': {
      title: 'What is VO2 Max?',
      description: 'VO2 Max is the maximum rate of oxygen consumption measured during incremental exercise. It\'s widely accepted as the gold standard for measuring cardiovascular fitness and aerobic endurance. A higher VO2 Max indicates better aerobic fitness.'
    },
    'workoutPlanner': {
      title: 'What is Workout Planner?',
      description: 'A Workout Planner helps you organize and optimize your exercise routine based on your goals, fitness level, and available time. A well-structured workout plan ensures balanced training across different muscle groups and fitness components.'
    },
    'stepCounter': {
      title: 'What is Step Counter?',
      description: 'The Step Counter calculator helps you track and analyze your daily walking activity. It converts your steps into distance, calories burned, and other health metrics, helping you monitor your physical activity levels and progress toward fitness goals.'
    },
    'heartRate': {
      title: 'What is Heart Rate?',
      description: 'The Heart Rate calculator helps you determine your target heart rate zones for exercise based on your age and resting heart rate. Training in the appropriate heart rate zone optimizes workout effectiveness and safety.'
    },
    
    // Nutrition & Diet 
    'macronutrients': {
      title: 'What is Macronutrients?',
      description: 'Macronutrients are the nutrients your body needs in large amounts: proteins, carbohydrates, and fats. The Macronutrient calculator helps determine the optimal balance of these nutrients based on your body composition, activity level, and health goals.'
    },
    'waterIntake': {
      title: 'What is Water Intake?',
      description: 'The Water Intake calculator estimates how much water you should drink daily based on your weight, activity level, and climate. Proper hydration is essential for numerous bodily functions including digestion, circulation, and temperature regulation.'
    },
    'intermittentFasting': {
      title: 'What is Intermittent Fasting?',
      description: 'Intermittent fasting is an eating pattern that cycles between periods of eating and fasting. This calculator helps you plan fasting schedules like 16/8, 5:2, or other protocols, and estimates potential health benefits based on your personal data.'
    },
    'calorieTracker': {
      title: 'What is Calorie Tracker?',
      description: 'The Calorie Tracker helps you monitor your daily caloric intake and expenditure. It calculates your calorie needs based on your age, gender, weight, height, and activity level, helping you maintain, lose, or gain weight effectively.'
    },
    'mealPlanner': {
      title: 'What is Meal Planner?',
      description: 'A Meal Planner helps you organize your daily or weekly food intake based on your nutritional goals, preferences, and dietary restrictions. Proper meal planning ensures balanced nutrition while helping you avoid unhealthy food choices.'
    },
    'bmr': {
      title: 'What is BMR?',
      description: 'Basal Metabolic Rate (BMR) is the number of calories your body needs to maintain basic physiological functions at rest. Knowing your BMR helps you determine your total daily calorie needs and create effective nutrition plans.'
    },
    'macro': {
      title: 'What is Macro Calculator?',
      description: 'The Macro Calculator determines your ideal intake of proteins, carbohydrates, and fats based on your weight, activity level, and fitness goals. Tracking macros can be more effective than counting calories for body composition goals.'
    },
    
    // Wellness & Lifestyle
    'pregnancyWeight': {
      title: 'What is Pregnancy Weight?',
      description: 'The Pregnancy Weight calculator helps expectant mothers track healthy weight gain throughout pregnancy based on pre-pregnancy BMI, trimester, and other factors. Maintaining appropriate weight gain is important for both maternal and fetal health.'
    },
    'alcoholImpact': {
      title: 'What is Alcohol Impact?',
      description: 'The Alcohol Impact calculator estimates how alcohol consumption affects your body, including blood alcohol content, calorie intake, and potential health impacts. It can help you make informed decisions about responsible drinking.'
    },
    'smokingImpact': {
      title: 'What is Smoking Impact?',
      description: 'The Smoking Impact calculator quantifies the health, financial, and lifestyle consequences of smoking. It shows the benefits of quitting at different timeframes and can be a powerful motivator for smoking cessation.'
    },
    'stressAnxiety': {
      title: 'What is Stress & Anxiety?',
      description: 'The Stress & Anxiety calculator helps you assess your current stress levels and provides insights into potential impacts on your physical and mental health. It can suggest personalized stress management techniques based on your results.'
    },
    
    // Women's Health
    'menopause': {
      title: 'What is Menopause Estimator?',
      description: 'The Menopause Estimator helps predict the timing of perimenopause and menopause based on various factors including age, family history, and current symptoms. It can help women prepare for this natural transition in life.'
    },
    'breastCancer': {
      title: 'What is Breast Cancer Risk?',
      description: 'The Breast Cancer Risk calculator assesses your likelihood of developing breast cancer based on personal and family medical history, genetic factors, and lifestyle choices. Early risk assessment can guide screening decisions and preventive strategies.'
    },
    'osteoporosis': {
      title: 'What is Osteoporosis Risk?',
      description: 'The Osteoporosis Risk calculator evaluates your risk of developing low bone density and fractures based on factors like age, gender, family history, and lifestyle. Early identification allows for preventive measures to maintain bone health.'
    },
    'ironIntake': {
      title: 'What is Iron Intake?',
      description: 'The Iron Intake calculator estimates your daily iron requirements based on age, gender, and specific conditions like pregnancy or heavy menstruation. Adequate iron is essential for preventing anemia and maintaining energy levels.'
    },
    'menstrualCycle': {
      title: 'What is Period Calculator?',
      description: 'The Period Calculator helps track and predict your menstrual cycles, fertile windows, and ovulation dates. Regular tracking can help identify cycle irregularities and is useful for both family planning and monitoring reproductive health.'
    },
    'ovulation': {
      title: 'What is Ovulation Calculator?',
      description: 'The Ovulation Calculator predicts your most fertile days based on your menstrual cycle length and last period date. Understanding your ovulation pattern is essential for natural family planning, whether trying to conceive or avoid pregnancy.'
    },
    'dueDate': {
      title: 'What is Due Date Calculator?',
      description: 'The Due Date Calculator estimates your pregnancy due date based on your last menstrual period or conception date. It also provides important pregnancy milestones and trimester information to help you track your pregnancy journey.'
    }
  };

  // Find the introduction for this calculator
  const intro = introductions[calculatorId];
  
  // If no introduction found, return null
  if (!intro) return null;
  
  return (
    <IntroSection title={intro.title} description={intro.description} />
  );
};

export default IntroSectionFactory;
