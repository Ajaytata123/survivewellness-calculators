
import { CalculatorInfo } from "@/types/calculator";

export const calculators: CalculatorInfo[] = [
  // Body Composition
  { 
    id: "bmi", 
    name: "BMI Calculator", 
    icon: "Body", 
    color: "wellness-purple", 
    category: "body",
    url: "#bmi"
  },
  { 
    id: "bmr", 
    name: "BMR & Calories", 
    icon: "Activity", 
    color: "wellness-blue", 
    category: "body",
    url: "#bmr"
  },
  { 
    id: "bodyfat", 
    name: "Body Fat", 
    icon: "Weight", 
    color: "wellness-green", 
    category: "body",
    url: "#bodyfat"
  },
  { 
    id: "idealweight", 
    name: "Ideal Weight", 
    icon: "Weight", 
    color: "wellness-orange", 
    category: "body",
    url: "#idealweight"
  },
  {
    id: "obesity",
    name: "Obesity Risk",
    icon: "Scale",
    color: "wellness-red",
    category: "body",
    url: "#obesity"
  },
  {
    id: "age",
    name: "Age Calculator",
    icon: "CalendarDays",
    color: "wellness-blue",
    category: "body",
    url: "#age"
  },
  
  // Fitness & Exercise
  { 
    id: "heartrate", 
    name: "Heart Rate Zones", 
    icon: "Heart", 
    color: "wellness-red", 
    category: "fitness",
    url: "#heartrate"
  },
  { 
    id: "vo2max", 
    name: "VO2 Max", 
    icon: "Activity", 
    color: "wellness-blue", 
    category: "fitness",
    url: "#vo2max"
  },
  { 
    id: "workout", 
    name: "Workout Planner", 
    icon: "Dumbbell", 
    color: "wellness-green", 
    category: "fitness",
    url: "#workout"
  },
  { 
    id: "steps", 
    name: "Step Counter", 
    icon: "Activity", 
    color: "wellness-purple", 
    category: "fitness",
    url: "#steps"
  },
  
  // Nutrition & Diet
  { 
    id: "macro", 
    name: "Macronutrients", 
    icon: "Utensils", 
    color: "wellness-green", 
    category: "nutrition",
    url: "#macro"
  },
  { 
    id: "water", 
    name: "Water Intake", 
    icon: "Droplets", 
    color: "wellness-blue", 
    category: "nutrition",
    url: "#water"
  },
  { 
    id: "fasting", 
    name: "Intermittent Fasting", 
    icon: "Clock", 
    color: "wellness-orange", 
    category: "nutrition",
    url: "#fasting"
  },
  { 
    id: "calories", 
    name: "Calorie Tracker", 
    icon: "Calculator", 
    color: "wellness-purple", 
    category: "nutrition",
    url: "#calories"
  },
  {
    id: "mealplan",
    name: "Meal Planner",
    icon: "Utensils",
    color: "wellness-green",
    category: "nutrition",
    url: "#mealplan"
  },
  
  // Wellness & Lifestyle
  { 
    id: "pregnancy", 
    name: "Pregnancy Weight", 
    icon: "Weight", 
    color: "wellness-pink", 
    category: "wellness",
    url: "#pregnancy"
  },
  { 
    id: "alcohol", 
    name: "Alcohol Impact", 
    icon: "Wine", 
    color: "wellness-red", 
    category: "wellness",
    url: "#alcohol"
  },
  { 
    id: "smoking", 
    name: "Smoking Impact", 
    icon: "Cigarette", 
    color: "wellness-orange", 
    category: "wellness",
    url: "#smoking"
  },
  { 
    id: "stress", 
    name: "Stress & Anxiety", 
    icon: "HeartPulse", 
    color: "wellness-purple", 
    category: "wellness",
    url: "#stress"
  },
  
  // Women's Health
  {
    id: "ovulation",
    name: "Ovulation Calculator",
    icon: "CalendarDays",
    color: "wellness-pink",
    category: "women",
    url: "#ovulation"
  },
  {
    id: "duedate",
    name: "Due Date Calculator",
    icon: "Baby",
    color: "wellness-purple",
    category: "women",
    url: "#duedate"
  },
  {
    id: "menstrual",
    name: "Menstrual Cycle",
    icon: "Calendar",
    color: "wellness-red",
    category: "women",
    url: "#menstrual"
  },
  {
    id: "menopause",
    name: "Menopause Estimator",
    icon: "CalendarDays",
    color: "wellness-orange",
    category: "women",
    url: "#menopause"
  },
  {
    id: "breastcancer",
    name: "Breast Cancer Risk",
    icon: "HeartPulse",
    color: "wellness-pink",
    category: "women",
    url: "#breastcancer"
  },
  {
    id: "osteoporosis",
    name: "Osteoporosis Risk",
    icon: "Activity",
    color: "wellness-blue",
    category: "women",
    url: "#osteoporosis"
  },
  {
    id: "iron",
    name: "Iron Intake",
    icon: "Utensils",
    color: "wellness-green",
    category: "women",
    url: "#iron"
  },
];
