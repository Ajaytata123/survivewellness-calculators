
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UnitSystem } from "@/types/calculatorTypes";
import { showSuccessToast, showErrorToast } from "@/utils/notificationUtils";
import { Input } from "@/components/ui/input";
import ResultActions from "@/components/calculator/ResultActions";
import IntroSection from "@/components/calculator/IntroSection";

interface StressAnxietyCalcProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
}

// Questions for the stress & anxiety assessment
const questions = [
  {
    id: 1,
    text: "How often have you been upset because of something that happened unexpectedly?",
    category: "perceived stress"
  },
  {
    id: 2,
    text: "How often have you felt nervous and stressed?",
    category: "anxiety symptoms"
  },
  {
    id: 3,
    text: "How often have you felt that you were unable to control the important things in your life?",
    category: "perceived stress"
  },
  {
    id: 4,
    text: "How often have you felt confident about your ability to handle your personal problems?",
    category: "coping ability",
    reverse: true
  },
  {
    id: 5,
    text: "How often have you felt that things were going your way?",
    category: "coping ability",
    reverse: true
  },
  {
    id: 6,
    text: "How often have you found that you could not cope with all the things that you had to do?",
    category: "coping ability"
  },
  {
    id: 7,
    text: "How often have you been able to control irritations in your life?",
    category: "coping ability",
    reverse: true
  },
  {
    id: 8,
    text: "How often have you felt that you were on top of things?",
    category: "perceived control",
    reverse: true
  },
  {
    id: 9,
    text: "How often have you been angered because of things that happened that were outside of your control?",
    category: "perceived control"
  },
  {
    id: 10,
    text: "How often have you felt difficulties were piling up so high that you could not overcome them?",
    category: "perceived stress"
  }
];

const StressAnxietyCalculator: React.FC<StressAnxietyCalcProps> = ({ unitSystem, onUnitSystemChange }) => {
  const [userName, setUserName] = useState<string>("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [resultCalculated, setResultCalculated] = useState<boolean>(false);
  const [stressResult, setStressResult] = useState<{
    score: number;
    level: string;
    recommendations: string[];
    categoryScores: Record<string, { score: number; percentage: number }>;
  } | null>(null);

  const handleAnswer = (questionId: number, value: number) => {
    const questionInfo = questions[questionId - 1];
    const adjustedValue = questionInfo.reverse ? 5 - value : value;
    
    setAnswers(prev => ({ ...prev, [questionId]: adjustedValue }));
  };

  const handleNext = () => {
    const currentQuestionData = questions[currentQuestion];
    if (!answers[currentQuestionData.id]) {
      showErrorToast("Please select an answer before proceeding");
      return;
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    // Check if all questions have been answered
    if (Object.keys(answers).length < questions.length) {
      showErrorToast("Please answer all questions");
      return;
    }
    
    // Calculate total score
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    
    // Calculate category scores
    const categoryScores: Record<string, { score: number; percentage: number }> = {};
    const categoryQuestionCounts: Record<string, number> = {};
    
    questions.forEach(question => {
      const answer = answers[question.id] || 0;
      
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { score: 0, percentage: 0 };
        categoryQuestionCounts[question.category] = 0;
      }
      
      categoryScores[question.category].score += answer;
      categoryQuestionCounts[question.category]++;
    });
    
    // Calculate percentages for each category
    Object.keys(categoryScores).forEach(category => {
      const maxPossibleScore = categoryQuestionCounts[category] * 4;
      categoryScores[category].percentage = 
        Math.round((categoryScores[category].score / maxPossibleScore) * 100);
    });
    
    // Determine stress level
    let stressLevel: string;
    let recommendations: string[] = [];
    
    // Max possible score is 40 (10 questions * 4 points)
    const scorePercentage = (totalScore / 40) * 100;
    
    if (scorePercentage <= 25) {
      stressLevel = "Low";
      recommendations = [
        "Maintain your healthy stress management techniques",
        "Continue regular exercise",
        "Practice gratitude",
        "Engage in activities you enjoy",
        "Consider helping others with their stress management"
      ];
    } else if (scorePercentage <= 50) {
      stressLevel = "Moderate";
      recommendations = [
        "Incorporate more regular relaxation techniques",
        "Consider daily mindfulness meditation",
        "Ensure adequate sleep (7-8 hours)",
        "Make time for enjoyable activities",
        "Practice deep breathing exercises when feeling stressed"
      ];
    } else if (scorePercentage <= 75) {
      stressLevel = "High";
      recommendations = [
        "Consider speaking with a mental health professional",
        "Practice daily stress reduction techniques",
        "Identify and reduce sources of stress where possible",
        "Prioritize physical exercise (30 min/day)",
        "Consider joining a support group"
      ];
    } else {
      stressLevel = "Severe";
      recommendations = [
        "Strongly consider professional mental health support",
        "Implement immediate stress reduction strategies",
        "Evaluate work-life balance and make necessary changes",
        "Practice grounding techniques for moments of overwhelm",
        "Ensure social support is accessible"
      ];
    }
    
    setStressResult({
      score: totalScore,
      level: stressLevel,
      recommendations,
      categoryScores
    });
    
    setResultCalculated(true);
  };

  const resetAssessment = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setResultCalculated(false);
    setStressResult(null);
  };

  const getStressLevelColor = (level: string): string => {
    switch (level) {
      case "Low": return "text-green-500";
      case "Moderate": return "text-yellow-500";
      case "High": return "text-orange-500";
      case "Severe": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  // Render the current question or the results
  const renderContent = () => {
    if (resultCalculated && stressResult) {
      const results = {
        "Overall Score": `${stressResult.score}/40`,
        "Stress Level": stressResult.level,
        ...Object.fromEntries(
          Object.entries(stressResult.categoryScores).map(([category, data]) => [
            category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            `${data.percentage}%`
          ])
        ),
        "Top Recommendation": stressResult.recommendations[0]
      };

      return (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Your Stress Assessment Results</h3>
            {userName && <p className="text-sm mt-2">Results for: {userName}</p>}
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm mb-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">Your Stress Level:</p>
              <p className={`text-lg font-bold ${getStressLevelColor(stressResult.level)}`}>
                {stressResult.level}
              </p>
            </div>
            <p className="text-sm text-gray-700 mt-2">Total Score: {stressResult.score}/40</p>
            
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Stress Level Breakdown:</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    stressResult.level === "Low" ? "bg-green-500" : 
                    stressResult.level === "Moderate" ? "bg-yellow-500" : 
                    stressResult.level === "High" ? "bg-orange-500" : "bg-red-500"
                  }`}
                  style={{ width: `${(stressResult.score / 40) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>Low</span>
                <span>Moderate</span>
                <span>High</span>
                <span>Severe</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {Object.entries(stressResult.categoryScores).map(([category, data]) => {
              const formattedCategory = category
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              
              return (
                <div key={category} className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-sm text-gray-700">{formattedCategory}</p>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                      <div 
                        className={`h-1.5 rounded-full ${
                          data.percentage <= 25 ? "bg-green-500" : 
                          data.percentage <= 50 ? "bg-yellow-500" : 
                          data.percentage <= 75 ? "bg-orange-500" : "bg-red-500"
                        }`}
                        style={{ width: `${data.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{data.percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-wellness-softPurple p-4 rounded-md mb-4">
            <h4 className="font-medium mb-2">Personalized Recommendations:</h4>
            <ul className="list-disc ml-5 space-y-1">
              {stressResult.recommendations.map((recommendation, idx) => (
                <li key={idx} className="text-sm">{recommendation}</li>
              ))}
            </ul>
          </div>

          <ResultActions
            title="Stress & Anxiety Assessment"
            results={results}
            fileName="Stress-Anxiety-Assessment"
            userName={userName}
            unitSystem={unitSystem}
            referenceText="This assessment provides general insights and is not a clinical diagnosis. If you're experiencing severe stress or anxiety, please consult a healthcare professional."
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={resetAssessment}>
              Retake Assessment
            </Button>
          </div>
        </div>
      );
    }

    const question = questions[currentQuestion];
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="userName">Your Name (optional)</Label>
          <Input
            id="userName"
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between text-sm mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-wellness-purple h-2.5 rounded-full"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <h3 className="text-lg font-medium mb-4">{question ? question.text : ''}</h3>

          <RadioGroup
            value={answers[question?.id] ? answers[question.id].toString() : undefined}
            onValueChange={(value) => question && handleAnswer(question.id, parseInt(value))}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="never" />
              <Label htmlFor="never">Never</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="almostNever" />
              <Label htmlFor="almostNever">Almost Never</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="sometimes" />
              <Label htmlFor="sometimes">Sometimes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="fairlyOften" />
              <Label htmlFor="fairlyOften">Fairly Often</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="veryOften" />
              <Label htmlFor="veryOften">Very Often</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            disabled={currentQuestion === 0}
            onClick={handlePrevious}
          >
            Previous
          </Button>
          {currentQuestion < questions.length - 1 ? (
            <Button 
              disabled={!answers[question?.id]}
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Button 
              disabled={!answers[question?.id]}
              onClick={calculateResults}
            >
              Complete Assessment
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Stress & Anxiety Assessment</h2>
        <p className="text-gray-600 mb-4 text-center">
          Evaluate your stress and anxiety levels with personalized recommendations
        </p>

        {renderContent()}
      </Card>

      <IntroSection calculatorId="stress" title="" description="" />
    </div>
  );
};

export default StressAnxietyCalculator;
