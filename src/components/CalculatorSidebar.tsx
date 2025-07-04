
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { calculators } from '@/data/calculatorData';
import { CalculatorInfo } from "@/types/calculator";
import { getIconComponent } from '@/utils/iconUtils';

interface CalculatorSidebarProps {
  selectedCalculator: string;
  onCalculatorSelect: (calculatorId: string) => void;
  onClose?: () => void;
}

const CalculatorSidebar: React.FC<CalculatorSidebarProps> = ({ 
  selectedCalculator, 
  onCalculatorSelect,
  onClose 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'body': true,
    'fitness': true,
    'nutrition': true,
    'wellness': true,
    'women': true
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const filteredCalculators = calculators.filter(calc =>
    calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    calc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = Object.entries(
    filteredCalculators.reduce((acc: Record<string, CalculatorInfo[]>, calc) => {
      if (!acc[calc.category]) {
        acc[calc.category] = [];
      }
      acc[calc.category].push(calc);
      return acc;
    }, {})
  );

  const getCategoryInfo = (category: string): { name: string; colorClass: string; iconClass: string; highlightClass: string } => {
    switch (category) {
      case 'body':
        return {
          name: 'Body Composition',
          colorClass: 'text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100',
          iconClass: 'text-purple-600',
          highlightClass: ''
        };
      case 'fitness':
        return {
          name: 'Fitness & Exercise',
          colorClass: 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100',
          iconClass: 'text-blue-600',
          highlightClass: ''
        };
      case 'nutrition':
        return {
          name: 'Nutrition & Diet',
          colorClass: 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100',
          iconClass: 'text-green-600',
          highlightClass: ''
        };
      case 'wellness':
        return {
          name: 'Wellness & Lifestyle',
          colorClass: 'text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100',
          iconClass: 'text-orange-600',
          highlightClass: ''
        };
      case 'women':
        return {
          name: 'Women\'s Health',
          colorClass: 'text-pink-700 bg-pink-50 border-pink-200 hover:bg-pink-100',
          iconClass: 'text-pink-600',
          highlightClass: ''
        };
      default:
        return {
          name: category,
          colorClass: 'text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100',
          iconClass: 'text-gray-600',
          highlightClass: ''
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'body':
        return getIconComponent('Scale');
      case 'fitness':
        return getIconComponent('Activity');
      case 'nutrition':
        return getIconComponent('Utensils');
      case 'wellness':
        return getIconComponent('Heart');
      case 'women':
        return getIconComponent('Heart');
      default:
        return getIconComponent('Calculator');
    }
  };

  // Custom calculator name mapping - Updated to change "Menstrual Cycle" to "Period Calculator"
  const getCalculatorDisplayName = (calc: CalculatorInfo): string => {
    if (calc.id === 'menstrual-cycle') {
      return 'Period Calculator';
    }
    // Also handle if the calculator name is "Menstrual Cycle Calculator" or "Menstrual Cycle"
    if (calc.name === 'Menstrual Cycle Calculator' || calc.name === 'Menstrual Cycle') {
      return 'Period Calculator';
    }
    return calc.name;
  };

  const handleCalculatorClick = (calculatorId: string) => {
    // Prevent scroll to top by not triggering page navigation
    onCalculatorSelect(calculatorId);
    onClose?.();
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Search section */}
      <div className="p-3 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search calculators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all text-sm h-9"
          />
        </div>
      </div>

      {/* Categories - Optimized for better space usage */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {filteredCategories.map(([category, calculators]) => {
            const isExpanded = expandedCategories[category];
            const categoryInfo = getCategoryInfo(category);
            const CategoryIcon = getCategoryIcon(category);
            
            return (
              <div key={category} className="space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-between p-2 h-auto font-medium text-left border rounded-lg transition-all duration-200 ${categoryInfo.colorClass}`}
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center space-x-2">
                    <CategoryIcon className={`h-3.5 w-3.5 ${categoryInfo.iconClass}`} />
                    <span className="text-xs font-semibold">{categoryInfo.name}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
                  )}
                </Button>
                
                {isExpanded && (
                  <div className="ml-1 space-y-0.5 border-l-2 border-gray-100 pl-2">
                    {calculators.map((calc) => {
                      const CalculatorIcon = getIconComponent(calc.icon);
                      return (
                        <Button
                          key={calc.id}
                          variant="ghost"
                          className={`w-full justify-start p-2 text-left text-xs h-auto transition-all duration-200 rounded-md ${
                            selectedCalculator === calc.id
                              ? 'bg-blue-50 text-blue-700 shadow-sm hover:bg-blue-100 border border-blue-200'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                          }`}
                          onClick={() => handleCalculatorClick(calc.id)}
                        >
                          <div className="flex items-center space-x-2">
                            <CalculatorIcon className={`w-3.5 h-3.5 ${
                              selectedCalculator === calc.id ? 'text-blue-600' : 'text-purple-500'
                            }`} />
                            <span className="font-medium">{getCalculatorDisplayName(calc)}</span>
                          </div>
                        </Button>
                      );
                    })}
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
