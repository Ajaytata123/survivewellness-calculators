import React from 'react';
import InfoSection from './InfoSection';

interface InfoSectionFactoryProps {
  calculatorId: string;
}

const InfoSectionFactory: React.FC<InfoSectionFactoryProps> = ({ calculatorId }) => {
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
