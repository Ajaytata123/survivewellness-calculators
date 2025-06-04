
import React from 'react';
import InfoSection from './InfoSection';

interface InfoSectionFactoryProps {
  calculatorId: string;
}

const InfoSectionFactory: React.FC<IntroSectionFactoryProps> = ({ calculatorId }) => {
  const getInfoData = (id: string) => {
    switch (id) {
      case 'bmi':
        return {
          title: "What is BMI (Body Mass Index)?",
          description: "BMI is a simple screening tool that measures body fat based on height and weight. It helps assess whether you're underweight, normal weight, overweight, or obese.",
          iconName: "Scale",
          benefits: [
            "Quick health screening tool",
            "Identifies potential health risks",
            "Tracks weight management progress",
            "Widely accepted medical standard"
          ],
          usage: "Enter your height and weight to get your BMI category and health recommendations."
        };

      case 'idealweight':
        return {
          title: "Understanding Ideal Weight Calculations",
          description: "Ideal weight calculators use validated medical formulas to estimate a healthy weight range based on your height and gender. Different formulas may give slightly different results.",
          iconName: "Scale",
          benefits: [
            "Evidence-based weight targets",
            "Multiple formula comparison", 
            "Gender-specific calculations",
            "Health goal setting support"
          ],
          usage: "Enter your height and gender to get ideal weight estimates from multiple medical formulas."
        };

      case 'obesityrisk':
      case 'obesity':
        return {
          title: "Obesity Risk Assessment",
          description: "Obesity risk assessment helps identify factors that may contribute to weight-related health issues. Understanding your risk profile enables proactive health management.",
          iconName: "AlertTriangle",
          benefits: [
            "Early risk identification",
            "Preventive health planning",
            "Lifestyle modification guidance",
            "Health awareness improvement"
          ],
          usage: "Provide your health information and lifestyle factors to assess your obesity risk profile."
        };

      case 'age':
      case 'agecalculator':
        return {
          title: "Age Calculator Benefits",
          description: "Age calculators provide precise age calculations in various formats, helping with planning, health assessments, and personal milestones tracking.",
          iconName: "Calendar",
          benefits: [
            "Precise age calculations",
            "Multiple date format support",
            "Health milestone tracking",
            "Planning assistance"
          ],
          usage: "Enter your birth date to get detailed age information in years, months, days, and more."
        };
      
      case 'heartrate':
        return {
          title: "Understanding Heart Rate Zones",
          description: "Heart rate zones help optimize your training by targeting specific intensity levels. Each zone provides different fitness benefits and helps you train more effectively.",
          iconName: "Heart",
          benefits: [
            "Optimizes training effectiveness",
            "Prevents overtraining and injury",
            "Improves cardiovascular fitness",
            "Maximizes fat burning potential"
          ],
          usage: "Enter your age and optionally your resting heart rate to get personalized training zones."
        };

      case 'stepcounter':
      case 'step':
        return {
          title: "Step Counter Benefits",
          description: "Step counting helps track daily physical activity and motivates you to reach fitness goals. It's a simple way to monitor your activity level and improve overall health.",
          iconName: "Activity",
          benefits: [
            "Daily activity tracking",
            "Fitness goal motivation",
            "Health improvement monitoring",
            "Simple activity measurement"
          ],
          usage: "Set your daily step goals and track your progress to maintain an active lifestyle."
        };

      case 'macronutrients':
      case 'macro':
        return {
          title: "Macronutrient Planning",
          description: "Macronutrient calculators help determine the optimal balance of carbohydrates, proteins, and fats for your specific goals, whether weight loss, muscle gain, or maintenance.",
          iconName: "Utensils",
          benefits: [
            "Personalized nutrition planning",
            "Goal-specific macro ratios",
            "Improved body composition",
            "Enhanced performance"
          ],
          usage: "Enter your stats and goals to get personalized macronutrient targets for optimal nutrition."
        };

      case 'waterintake':
      case 'water':
        return {
          title: "Daily Water Intake Guidelines",
          description: "Proper hydration is essential for optimal body function. Water intake calculators help determine your daily fluid needs based on various factors.",
          iconName: "Droplet",
          benefits: [
            "Optimal hydration maintenance",
            "Improved physical performance",
            "Better cognitive function",
            "Enhanced overall health"
          ],
          usage: "Enter your weight, activity level, and climate conditions to get personalized hydration recommendations."
        };

      case 'calorietracker':
      case 'calorie':
        return {
          title: "Calorie Tracking Benefits",
          description: "Calorie tracking helps monitor your daily energy intake and expenditure, supporting weight management and nutritional goals.",
          iconName: "Target",
          benefits: [
            "Weight management support",
            "Nutritional awareness",
            "Goal achievement tracking",
            "Healthy habit formation"
          ],
          usage: "Track your daily food intake and physical activities to monitor your caloric balance."
        };

      case 'smokingimpact':
      case 'smoking':
        return {
          title: "Understanding Smoking's Health Impact",
          description: "Smoking impact assessments help visualize the health and financial consequences of smoking, motivating cessation efforts and healthier choices.",
          iconName: "AlertTriangle",
          benefits: [
            "Health risk awareness",
            "Financial impact visualization",
            "Cessation motivation",
            "Long-term health planning"
          ],
          usage: "Enter your smoking habits to understand the health and financial impact on your life."
        };

      case 'stressanxiety':
      case 'stress':
        return {
          title: "Stress and Anxiety Assessment",
          description: "Stress and anxiety assessments help identify your mental health status and provide guidance for managing stress levels effectively.",
          iconName: "Brain",
          benefits: [
            "Mental health awareness",
            "Stress level identification",
            "Coping strategy guidance",
            "Well-being improvement"
          ],
          usage: "Answer questions about your current stress levels and symptoms to get personalized wellness recommendations."
        };

      case 'pregnancyweight':
      case 'pregnancy':
        return {
          title: "Pregnancy Weight Tracking",
          description: "Pregnancy weight gain tracking helps ensure healthy development for both mother and baby by monitoring weight gain within recommended ranges.",
          iconName: "Baby",
          benefits: [
            "Healthy pregnancy monitoring",
            "Risk factor identification",
            "Nutritional guidance",
            "Baby development support"
          ],
          usage: "Enter your pre-pregnancy weight and current week to track healthy weight gain during pregnancy."
        };

      case 'ovulation':
        return {
          title: "Ovulation Tracking",
          description: "Ovulation calculators help predict your most fertile days, supporting family planning efforts and reproductive health awareness.",
          iconName: "Calendar",
          benefits: [
            "Fertility window identification",
            "Family planning support",
            "Reproductive health awareness",
            "Cycle pattern understanding"
          ],
          usage: "Enter your menstrual cycle information to predict your most fertile days."
        };

      case 'period':
      case 'menstrual':
        return {
          title: "Period Tracking Benefits",
          description: "Period tracking helps you understand your menstrual cycle, predict future periods, and monitor reproductive health patterns.",
          iconName: "Calendar",
          benefits: [
            "Cycle prediction accuracy",
            "Health pattern monitoring",
            "PMS preparation",
            "Reproductive health awareness"
          ],
          usage: "Enter your last period date and cycle length to predict future periods and fertile windows."
        };

      case 'menopause':
        return {
          title: "Understanding Menopause Timing",
          description: "Menopause estimators help women understand when they might experience menopause based on various factors including family history, lifestyle, and health indicators.",
          iconName: "User",
          benefits: [
            "Plan for hormonal changes",
            "Prepare for health adjustments",
            "Understand timing variations",
            "Make informed health decisions"
          ],
          usage: "Provide information about your age, menstrual history, and family background to get an estimated menopause timeline."
        };

      case 'duedate':
        return {
          title: "About Due Date Calculations",
          description: "Due date calculators help expectant mothers track their pregnancy timeline and prepare for their baby's arrival. They provide estimated dates based on medical standards.",
          iconName: "Calendar",
          benefits: [
            "Track pregnancy milestones",
            "Plan prenatal appointments",
            "Prepare for delivery",
            "Monitor fetal development stages"
          ],
          usage: "Enter either your last menstrual period date or conception date to get your estimated due date and pregnancy timeline."
        };

      case 'iron':
        return {
          title: "Iron Intake Assessment",
          description: "Iron is essential for oxygen transport and energy production. This calculator helps determine your daily iron needs based on age, gender, diet, and special conditions.",
          iconName: "Utensils",
          benefits: [
            "Prevents iron deficiency anemia",
            "Optimizes energy levels",
            "Supports immune function",
            "Maintains healthy blood cells"
          ],
          usage: "Enter your age, gender, pregnancy status, and diet type to get personalized iron intake recommendations."
        };

      case 'workoutplanner':
      case 'workout':
        return {
          title: "Workout Planning Guide",
          description: "A structured workout plan helps you achieve fitness goals efficiently while preventing injury and burnout. Proper planning ensures balanced training across all fitness components.",
          iconName: "Dumbbell",
          benefits: [
            "Structured fitness progression",
            "Balanced muscle development",
            "Injury prevention",
            "Goal-oriented training"
          ],
          usage: "Set your fitness goals, available time, and experience level to receive a customized workout schedule."
        };

      case 'intermittentfasting':
      case 'fasting':
        return {
          title: "Intermittent Fasting Methods",
          description: "Intermittent fasting involves cycling between eating and fasting periods. Different methods suit different lifestyles and can provide various health benefits.",
          iconName: "Clock",
          benefits: [
            "May support weight management",
            "Simplifies meal planning",
            "Potential metabolic benefits",
            "Flexible eating schedule"
          ],
          usage: "Choose your preferred fasting method and get a personalized schedule with eating and fasting windows."
        };

      case 'mealplanner':
      case 'mealplan':
        return {
          title: "Meal Planning Benefits",
          description: "Meal planning helps ensure balanced nutrition, saves time and money, and supports health goals. It involves preparing nutritious meals in advance.",
          iconName: "ChefHat",
          benefits: [
            "Ensures balanced nutrition",
            "Saves time and money",
            "Reduces food waste",
            "Supports health goals"
          ],
          usage: "Set your dietary preferences, calorie goals, and meal frequency to generate a personalized meal plan."
        };

      case 'alcoholimpact':
      case 'alcohol':
        return {
          title: "Understanding Alcohol's Health Impact",
          description: "Alcohol consumption affects your body in various ways. Understanding these impacts helps make informed decisions about drinking habits and health.",
          iconName: "AlertTriangle",
          benefits: [
            "Awareness of health risks",
            "Informed consumption decisions",
            "Understanding safe limits",
            "Motivation for healthier choices"
          ],
          usage: "Enter your drinking patterns and personal information to assess potential health impacts and get recommendations."
        };

      case 'breastcancer':
        return {
          title: "Breast Cancer Risk Assessment",
          description: "Risk assessment tools help identify factors that may increase breast cancer risk. Early awareness enables proactive health measures and screening.",
          iconName: "Heart",
          benefits: [
            "Early risk identification",
            "Informed screening decisions",
            "Lifestyle modification guidance",
            "Peace of mind through awareness"
          ],
          usage: "Answer questions about family history, lifestyle factors, and health history to assess your breast cancer risk profile."
        };

      case 'osteoporosis':
        return {
          title: "Osteoporosis Risk Evaluation",
          description: "Osteoporosis risk assessment helps identify factors that may lead to bone density loss. Early detection enables preventive measures and treatment.",
          iconName: "Bone",
          benefits: [
            "Early risk detection",
            "Prevention strategy planning",
            "Bone health awareness",
            "Treatment timing optimization"
          ],
          usage: "Provide information about age, gender, lifestyle, and health history to evaluate your osteoporosis risk factors."
        };

      case 'bmr':
        return {
          title: "Basal Metabolic Rate (BMR)",
          description: "BMR represents the number of calories your body burns while at rest. Understanding your BMR helps in creating effective diet and exercise plans.",
          iconName: "Activity",
          benefits: [
            "Accurate calorie planning",
            "Weight management support",
            "Metabolism understanding",
            "Personalized nutrition goals"
          ],
          usage: "Enter your age, gender, height, and weight to calculate your daily caloric needs."
        };

      case 'bodyfat':
        return {
          title: "Body Fat Percentage Calculator",
          description: "Body fat percentage provides a more accurate picture of your health than weight alone. It helps assess fitness progress and health risks.",
          iconName: "Activity",
          benefits: [
            "More accurate than BMI",
            "Tracks fitness progress",
            "Health risk assessment",
            "Body composition insights"
          ],
          usage: "Take body measurements and enter your details to estimate body fat percentage using validated formulas."
        };

      case 'vo2max':
        return {
          title: "VO2 Max Assessment",
          description: "VO2 Max measures your cardiovascular fitness and aerobic capacity. It's the gold standard for measuring cardiorespiratory fitness.",
          iconName: "Heart",
          benefits: [
            "Cardiovascular fitness assessment",
            "Training intensity guidance",
            "Health risk evaluation",
            "Performance tracking"
          ],
          usage: "Complete the step test or enter your exercise data to estimate your VO2 Max and fitness level."
        };

      default:
        return null;
    }
  };

  const infoData = getInfoData(calculatorId);
  
  if (!infoData) {
    return null;
  }

  return <InfoSection {...infoData} />;
};

export default InfoSectionFactory;
