import React from 'react';
import InfoSection from './InfoSection';

interface InfoSectionFactoryProps {
  calculatorId: string;
}

const InfoSectionFactory: React.FC<InfoSectionFactoryProps> = ({ calculatorId }) => {
  console.log('InfoSectionFactory rendering for calculatorId:', calculatorId);
  
  const getCalculatorInfo = () => {
    switch (calculatorId) {
      case 'bmi':
        return {
          title: "What is BMI (Body Mass Index)?",
          description: "BMI is a simple screening tool that measures body fat based on height and weight. It helps assess whether you're underweight, normal weight, overweight, or obese.",
          iconName: "Scale",
          benefits: [
            "Quick health assessment tool",
            "Helps identify potential health risks",
            "Widely used by healthcare professionals",
            "Easy to calculate and understand"
          ],
          usage: "Enter your height and weight to get your BMI score and health category classification."
        };

      case 'bmr':
        return {
          title: "What is BMR (Basal Metabolic Rate)?",
          description: "BMR represents the number of calories your body burns at rest to maintain basic physiological functions like breathing, circulation, and cell production.",
          iconName: "Zap",
          benefits: [
            "Understand your baseline calorie needs",
            "Plan effective weight management",
            "Optimize nutrition and fitness goals",
            "Make informed dietary decisions"
          ],
          usage: "Input your age, gender, height, and weight to calculate your daily caloric needs for various activity levels."
        };

      case 'bodyfat':
        return {
          title: "What is Body Fat Percentage?",
          description: "Body fat percentage indicates the proportion of your body weight that consists of fat tissue. It's a more accurate health indicator than BMI alone.",
          iconName: "Target",
          benefits: [
            "Better body composition assessment",
            "More accurate than BMI for athletes",
            "Helps track fitness progress",
            "Identifies health risk levels"
          ],
          usage: "Provide your measurements to estimate body fat percentage using scientifically validated formulas."
        };

      case 'idealweight':
        return {
          title: "What is Ideal Body Weight?",
          description: "Ideal body weight is an estimate of the healthy weight range for your height, calculated using established medical formulas to promote optimal health.",
          iconName: "Target",
          benefits: [
            "Set realistic weight goals",
            "Understand healthy weight ranges",
            "Guide weight loss or gain plans",
            "Medical dosage calculations"
          ],
          usage: "Enter your height and gender to calculate your ideal weight range using multiple validated formulas."
        };

      case 'obesity':
        return {
          title: "What is Obesity Risk Assessment?",
          description: "This assessment evaluates your risk of obesity-related health complications based on multiple factors including BMI, waist circumference, and lifestyle factors.",
          iconName: "AlertTriangle",
          benefits: [
            "Early health risk identification",
            "Comprehensive risk evaluation",
            "Motivation for lifestyle changes",
            "Preventive health planning"
          ],
          usage: "Complete the assessment with your measurements and lifestyle information to get a comprehensive obesity risk profile."
        };

      case 'age':
        return {
          title: "What is Age Calculator?",
          description: "Calculate your exact age in years, months, days, and even hours. Also provides insights into life stages and important milestones.",
          iconName: "Calendar",
          benefits: [
            "Precise age calculation",
            "Track important milestones",
            "Plan age-specific health screenings",
            "Understand life stage transitions"
          ],
          usage: "Enter your birth date to get detailed age information and relevant health recommendations for your age group."
        };

      case 'heartrate':
        return {
          title: "What are Heart Rate Training Zones?",
          description: "Heart rate zones are specific ranges that help optimize your cardiovascular training by targeting different intensities for various fitness goals.",
          iconName: "Heart",
          benefits: [
            "Optimize workout intensity",
            "Improve cardiovascular fitness",
            "Burn fat more effectively",
            "Prevent overtraining"
          ],
          usage: "Enter your age and resting heart rate to calculate personalized training zones for different workout intensities."
        };

      case 'vo2max':
        return {
          title: "What is VO2 Max?",
          description: "VO2 Max measures your body's maximum oxygen consumption during exercise, indicating your cardiovascular fitness and endurance capacity.",
          iconName: "Activity",
          benefits: [
            "Measure cardiovascular fitness",
            "Track endurance improvements",
            "Set appropriate training intensity",
            "Compare fitness levels"
          ],
          usage: "Complete a fitness test or enter your performance data to estimate your VO2 Max and fitness level."
        };

      case 'steps':
        return {
          title: "What is Step Counter & Activity Tracker?",
          description: "Track your daily steps and physical activity to maintain an active lifestyle and achieve your fitness goals.",
          iconName: "Footprints",
          benefits: [
            "Monitor daily activity levels",
            "Set and track step goals",
            "Encourage active lifestyle",
            "Improve overall health"
          ],
          usage: "Set your daily step goal and track your progress throughout the day to maintain an active lifestyle."
        };

      case 'workout':
        return {
          title: "What is Workout Planning?",
          description: "Create structured, goal-oriented workout plans tailored to your fitness level, available time, and equipment to maximize training effectiveness and achieve your fitness goals.",
          iconName: "Dumbbell",
          benefits: [
            "Structured exercise routine for better results",
            "Goal-specific training programs",
            "Efficient use of workout time",
            "Balanced muscle development",
            "Progressive difficulty adjustment"
          ],
          usage: "Specify your fitness goals, experience level, available time, and equipment to generate a customized workout plan with exercises and scheduling."
        };

      case 'macro':
        return {
          title: "What are Macronutrients?",
          description: "Macronutrients (proteins, carbohydrates, and fats) are the main nutrients your body needs in large amounts for energy, growth, and bodily functions.",
          iconName: "Utensils",
          benefits: [
            "Optimize nutrition for goals",
            "Balance protein, carbs, and fats",
            "Support muscle growth",
            "Improve body composition"
          ],
          usage: "Enter your details and goals to calculate optimal daily intake of proteins, carbohydrates, and fats."
        };

      case 'water':
        return {
          title: "What is Daily Water Intake?",
          description: "Proper hydration is essential for optimal body function. Calculate your personalized daily water needs based on your body weight and activity level.",
          iconName: "Droplet",
          benefits: [
            "Maintain proper hydration",
            "Improve physical performance",
            "Support metabolic function",
            "Enhance cognitive function"
          ],
          usage: "Enter your weight and activity level to determine your optimal daily water intake requirements."
        };

      case 'fasting':
        return {
          title: "What is Intermittent Fasting?",
          description: "Intermittent fasting involves cycling between periods of eating and fasting. Find the right fasting schedule that fits your lifestyle and health goals.",
          iconName: "Clock",
          benefits: [
            "Support for weight management goals",
            "Improved metabolic health markers",
            "Enhanced mental clarity and focus",
            "Simplified meal planning and timing",
            "Potential longevity benefits"
          ],
          usage: "Choose your preferred fasting method and lifestyle factors to get a personalized schedule with eating and fasting windows, plus helpful tips."
        };

      case 'calories':
        return {
          title: "What is Calorie Tracking?",
          description: "Track your daily caloric intake and expenditure to maintain, lose, or gain weight according to your health and fitness goals.",
          iconName: "Calculator",
          benefits: [
            "Achieve weight goals",
            "Improve nutritional awareness",
            "Balance energy intake",
            "Support healthy eating habits"
          ],
          usage: "Log your food intake and activities to monitor your daily caloric balance and progress toward your goals."
        };

      case 'mealplan':
        return {
          title: "What is Meal Planning?",
          description: "Create balanced, nutritious meal plans tailored to your dietary preferences, health goals, and lifestyle requirements for optimal nutrition and convenience.",
          iconName: "ChefHat",
          benefits: [
            "Balanced nutrition planning for optimal health",
            "Time and money savings through organization",
            "Reduced food waste and better budgeting",
            "Consistent healthy eating habits",
            "Customized to dietary restrictions and preferences"
          ],
          usage: "Specify your dietary preferences, calorie goals, and restrictions to generate personalized meal plans with recipes and shopping lists."
        };

      case 'pregnancy':
        return {
          title: "What is Pregnancy Weight Tracking?",
          description: "Monitor healthy weight gain during pregnancy based on your pre-pregnancy BMI and current trimester for optimal maternal and fetal health.",
          iconName: "Baby",
          benefits: [
            "Ensure healthy pregnancy weight gain",
            "Monitor fetal development support",
            "Reduce pregnancy complications",
            "Postpartum health preparation"
          ],
          usage: "Enter your pre-pregnancy weight and current pregnancy details to track healthy weight gain recommendations."
        };

      case 'alcohol':
        return {
          title: "What is Alcohol Impact Assessment?",
          description: "Understand how alcohol consumption affects your health, fitness goals, and overall well-being with personalized insights based on your drinking patterns.",
          iconName: "Wine",
          benefits: [
            "Health impact awareness and education",
            "Caloric impact understanding for weight goals",
            "Fitness goal alignment and planning",
            "Informed consumption decision making",
            "Risk level assessment for health"
          ],
          usage: "Enter your alcohol consumption patterns, demographics, and preferences to receive insights on health impacts and personalized recommendations."
        };

      case 'smoking':
        return {
          title: "What is Smoking Impact Assessment?",
          description: "Evaluate the health and financial impact of smoking, plus get motivation and resources to support your quit journey.",
          iconName: "Cigarette",
          benefits: [
            "Health risk awareness",
            "Financial impact calculation",
            "Quit motivation support",
            "Recovery timeline insights"
          ],
          usage: "Provide your smoking history to see personalized health and financial impacts, plus recovery benefits."
        };

      case 'stress':
        return {
          title: "What is Stress & Anxiety Assessment?",
          description: "Evaluate your stress and anxiety levels with scientifically validated tools and receive personalized coping strategies.",
          iconName: "Brain",
          benefits: [
            "Mental health awareness",
            "Stress level evaluation",
            "Coping strategy recommendations",
            "Professional guidance indicators"
          ],
          usage: "Complete the assessment questionnaire to evaluate your stress levels and receive personalized recommendations."
        };

      case 'ovulation':
        return {
          title: "What is Ovulation Tracking?",
          description: "Track your fertility window and ovulation patterns to understand your menstrual cycle for family planning or health monitoring.",
          iconName: "Heart",
          benefits: [
            "Fertility window identification",
            "Family planning support",
            "Cycle pattern understanding",
            "Health monitoring tool"
          ],
          usage: "Enter your cycle information to predict ovulation dates and identify your most fertile days."
        };

      case 'duedate':
        return {
          title: "What is Due Date Calculation?",
          description: "Calculate your estimated due date and track pregnancy milestones based on your last menstrual period or conception date.",
          iconName: "Calendar",
          benefits: [
            "Pregnancy timeline planning",
            "Milestone tracking",
            "Healthcare appointment scheduling",
            "Preparation planning"
          ],
          usage: "Enter your last menstrual period or conception date to calculate your estimated due date and pregnancy timeline."
        };

      case 'menstrual':
      case 'period':
        return {
          title: "What is Period Tracking?",
          description: "Track your menstrual cycle patterns, predict future periods, and monitor your reproductive health with detailed cycle insights.",
          iconName: "Calendar",
          benefits: [
            "Cycle pattern recognition",
            "Period prediction",
            "Health monitoring",
            "Symptom tracking support"
          ],
          usage: "Enter your last period date and cycle length to predict future periods and track your menstrual health."
        };

      case 'menopause':
        return {
          title: "What is Menopause Estimation?",
          description: "Estimate your menopause timeline and understand the hormonal changes that occur during perimenopause and menopause to better prepare for this life transition.",
          iconName: "Calendar",
          benefits: [
            "Transition timeline understanding",
            "Symptom preparation",
            "Health planning",
            "Treatment timing insights"
          ],
          usage: "Enter your age, menstrual history, and family history to get an estimated menopause timeline with health recommendations."
        };

      case 'breastcancer':
        return {
          title: "What is Breast Cancer Risk Assessment?",
          description: "Evaluate your breast cancer risk factors using established medical criteria to understand your risk level and make informed decisions about screening and prevention.",
          iconName: "Shield",
          benefits: [
            "Early risk identification for prevention",
            "Informed screening schedule planning",
            "Lifestyle modification guidance",
            "Peace of mind through awareness",
            "Healthcare discussion preparation"
          ],
          usage: "Complete the risk assessment questionnaire with your personal and family history to receive a comprehensive risk evaluation and recommendations."
        };

      case 'osteoporosis':
        return {
          title: "What is Osteoporosis Risk Assessment?",
          description: "Assess your risk of developing osteoporosis and bone fractures based on lifestyle factors, medical history, and demographics to promote bone health.",
          iconName: "Bone",
          benefits: [
            "Early bone health awareness",
            "Prevention strategy development",
            "Screening schedule optimization",
            "Lifestyle modification guidance",
            "Fracture risk understanding"
          ],
          usage: "Enter your age, gender, lifestyle factors, and medical history to evaluate your osteoporosis risk and receive bone health recommendations."
        };

      case 'iron':
        return {
          title: "What is Iron Intake Assessment?",
          description: "Calculate your daily iron needs and assess whether you're getting adequate iron from your diet to prevent iron deficiency and maintain optimal health.",
          iconName: "Apple",
          benefits: [
            "Prevent iron deficiency anemia",
            "Optimize energy and cognitive function",
            "Support immune system health",
            "Maintain healthy pregnancy outcomes",
            "Improve athletic performance"
          ],
          usage: "Enter your demographics, diet information, and lifestyle factors to calculate your iron needs and receive dietary recommendations."
        };

      default:
        return {
          title: "Calculator Information",
          description: "This calculator provides helpful insights for your health and wellness journey.",
          iconName: "Info",
          benefits: [],
          usage: "Use this calculator to get personalized recommendations based on your input."
        };
    }
  };

  const info = getCalculatorInfo();
  
  return (
    <InfoSection
      title={info.title}
      description={info.description}
      iconName={info.iconName}
      benefits={info.benefits}
      usage={info.usage}
    />
  );
};

export default InfoSectionFactory;
