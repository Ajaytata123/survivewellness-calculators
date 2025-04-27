import { CalculatorInfo } from "@/types/calculator";

export const calculators: CalculatorInfo[] = [
  // Body Composition
  { 
    id: "bmi", 
    name: "BMI Calculator", 
    icon: "Body", 
    color: "wellness-purple", 
    category: "body",
    url: "https://survivewellness.com/tools-calculators/#bmi"
  },
  { 
    id: "bmr", 
    name: "BMR & Calories", 
    icon: "Activity", 
    color: "wellness-blue", 
    category: "body",
    url: "https://survivewellness.com/tools-calculators/#bmr"
  },
  { 
    id: "bodyfat", 
    name: "Body Fat", 
    icon: "Weight", 
    color: "wellness-green", 
    category: "body",
    url: "https://survivewellness.com/tools-calculators/#bodyfat"
  },
  { 
    id: "idealweight", 
    name: "Ideal Weight", 
    icon: "Weight", 
    color: "wellness-orange", 
    category: "body",
    url: "https://survivewellness.com/tools-calculators/#idealweight"
  },
  
  // Fitness & Exercise
  { 
    id: "heartrate", 
    name: "Heart Rate Zones", 
    icon: "Heart", 
    color: "wellness-red", 
    category: "fitness",
    url: "https://survivewellness.com/tools-calculators/#heartrate"
  },
  { 
    id: "vo2max", 
    name: "VO2 Max", 
    icon: "Activity", 
    color: "wellness-blue", 
    category: "fitness",
    url: "https://survivewellness.com/tools-calculators/#vo2max"
  },
  { 
    id: "workout", 
    name: "Workout Planner", 
    icon: "Fitness", 
    color: "wellness-green", 
    category: "fitness",
    url: "https://survivewellness.com/tools-calculators/#workout"
  },
  { 
    id: "steps", 
    name: "Step Counter", 
    icon: "Activity", 
    color: "wellness-purple", 
    category: "fitness",
    url: "https://survivewellness.com/tools-calculators/#steps"
  },
  
  // Nutrition & Diet
  { 
    id: "macro", 
    name: "Macronutrients", 
    icon: "Nutrition", 
    color: "wellness-green", 
    category: "nutrition",
    url: "https://survivewellness.com/tools-calculators/#macro"
  },
  { 
    id: "water", 
    name: "Water Intake", 
    icon: "Nutrition", 
    color: "wellness-blue", 
    category: "nutrition",
    url: "https://survivewellness.com/tools-calculators/#water"
  },
  { 
    id: "fasting", 
    name: "Intermittent Fasting", 
    icon: "Nutrition", 
    color: "wellness-orange", 
    category: "nutrition",
    url: "https://survivewellness.com/tools-calculators/#fasting"
  },
  { 
    id: "calories", 
    name: "Calorie Tracker", 
    icon: "Calculator", 
    color: "wellness-purple", 
    category: "nutrition",
    url: "https://survivewellness.com/tools-calculators/#calories"
  },
  
  // Wellness & Lifestyle
  { 
    id: "pregnancy", 
    name: "Pregnancy Weight", 
    icon: "Weight", 
    color: "wellness-pink", 
    category: "wellness",
    url: "https://survivewellness.com/tools-calculators/#pregnancy"
  },
  { 
    id: "alcohol", 
    name: "Alcohol Impact", 
    icon: "Activity", 
    color: "wellness-red", 
    category: "wellness",
    url: "https://survivewellness.com/tools-calculators/#alcohol"
  },
  { 
    id: "smoking", 
    name: "Smoking Impact", 
    icon: "Activity", 
    color: "wellness-orange", 
    category: "wellness",
    url: "https://survivewellness.com/tools-calculators/#smoking"
  },
  { 
    id: "stress", 
    name: "Stress & Anxiety", 
    icon: "Heart", 
    color: "wellness-purple", 
    category: "wellness",
    url: "https://survivewellness.com/tools-calculators/#stress"
  },
];
