import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { calculatorData } from '@/data/calculatorData';

const CalculatorSidebar: React.FC<{
  selectedCalculator: string | null;
  onCalculatorSelect: (calculatorId: string) => void;
  onClose?: () => void;
}> = ({ selectedCalculator, onCalculatorSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Initialize categories to expanded if a calculator within is selected
    const initialExpandedCategories: Record<string, boolean> = {};
    calculatorData.forEach(calc => {
      if (selectedCalculator === calc.id) {
        initialExpandedCategories[calc.category] = true;
      }
    });
    setExpandedCategories(initialExpandedCategories);
  }, [selectedCalculator]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const filteredCalculators = calculatorData.filter(calc =>
    calc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = Object.entries(
    filteredCalculators.reduce((acc: Record<string, any[]>, calc) => {
      if (!acc[calc.category]) {
        acc[calc.category] = [];
      }
      acc[calc.category].push(calc);
      return acc;
    }, {})
  );

  const getCategoryColorClass = (category: string): string => {
    switch (category) {
      case 'Body Composition':
        return 'text-violet-600 border-violet-200 bg-violet-50';
      case 'Fitness & Exercise':
        return 'text-blue-600 border-blue-200 bg-blue-50';
      case 'Nutrition & Diet':
        return 'text-green-600 border-green-200 bg-green-50';
      case 'Wellness & Lifestyle':
        return 'text-orange-600 border-orange-200 bg-orange-50';
      case 'Women\'s Health':
        return 'text-pink-600 border-pink-200 bg-pink-50';
      default:
        return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Search section */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-wellness-softPurple to-wellness-softBlue">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search calculators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm border-white/30 focus:bg-white focus:border-wellness-purple transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        <style dangerouslySetInnerHTML={{
          __html: `
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f5f9;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }
          `
        }} />
        <div className="p-2 space-y-2 custom-scrollbar">
          {filteredCategories.map(([category, calculators]) => {
            const isExpanded = expandedCategories[category];
            const colorClass = getCategoryColorClass(category);
            
            return (
              <div key={category} className="space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-between p-3 h-auto font-medium text-left border rounded-lg transition-all duration-200 hover:shadow-sm ${colorClass}`}
                  onClick={() => toggleCategory(category)}
                >
                  <span className="text-sm font-semibold">{category}</span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  )}
                </Button>
                
                {isExpanded && (
                  <div className="ml-2 space-y-1 border-l-2 border-gray-100 pl-3">
                    {calculators.map((calc) => (
                      <Button
                        key={calc.id}
                        variant="ghost"
                        className={`w-full justify-start p-2 text-left text-sm h-auto transition-all duration-200 rounded-md ${
                          selectedCalculator === calc.id
                            ? 'bg-wellness-purple text-white shadow-md hover:bg-wellness-purple/90'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-wellness-purple'
                        }`}
                        onClick={() => {
                          onCalculatorSelect(calc.id);
                          onClose?.();
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            selectedCalculator === calc.id ? 'bg-white' : 'bg-wellness-purple/30'
                          }`} />
                          <span className="font-medium">{calc.name}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalculatorSidebar;
