
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { calculators } from '@/data/calculatorData';
import { CalculatorInfo } from "@/types/calculator";
import { getIconComponent } from '@/utils/iconUtils';

interface CalculatorSidebarProps {
  activeCalculator: string;
  onCalculatorSelect: (calculatorId: string) => void;
  calculators: CalculatorInfo[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  highlightedCategory?: string;
  onCategoryHighlight?: (category: string | undefined) => void;
  onClose?: () => void;
}

const CalculatorSidebar: React.FC<CalculatorSidebarProps> = ({ 
  activeCalculator, 
  onCalculatorSelect, 
  calculators: calculatorList,
  searchQuery,
  setSearchQuery,
  highlightedCategory,
  onCategoryHighlight,
  onClose 
}) => {
  // Initialize all categories as expanded by default
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

  const filteredCalculators = calculatorList.filter(calc =>
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
    const isHighlighted = highlightedCategory === category;
    
    switch (category) {
      case 'body':
        return {
          name: 'Body Composition',
          colorClass: `text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100 ${isHighlighted ? 'ring-2 ring-purple-400 bg-purple-100' : ''}`,
          iconClass: 'text-purple-600',
          highlightClass: isHighlighted ? 'ring-2 ring-purple-400' : ''
        };
      case 'fitness':
        return {
          name: 'Fitness & Exercise',
          colorClass: `text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100 ${isHighlighted ? 'ring-2 ring-blue-400 bg-blue-100' : ''}`,
          iconClass: 'text-blue-600',
          highlightClass: isHighlighted ? 'ring-2 ring-blue-400' : ''
        };
      case 'nutrition':
        return {
          name: 'Nutrition & Diet',
          colorClass: `text-green-700 bg-green-50 border-green-200 hover:bg-green-100 ${isHighlighted ? 'ring-2 ring-green-400 bg-green-100' : ''}`,
          iconClass: 'text-green-600',
          highlightClass: isHighlighted ? 'ring-2 ring-green-400' : ''
        };
      case 'wellness':
        return {
          name: 'Wellness & Lifestyle',
          colorClass: `text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100 ${isHighlighted ? 'ring-2 ring-orange-400 bg-orange-100' : ''}`,
          iconClass: 'text-orange-600',
          highlightClass: isHighlighted ? 'ring-2 ring-orange-400' : ''
        };
      case 'women':
        return {
          name: 'Women\'s Health',
          colorClass: `text-pink-700 bg-pink-50 border-pink-200 hover:bg-pink-100 ${isHighlighted ? 'ring-2 ring-pink-400 bg-pink-100' : ''}`,
          iconClass: 'text-pink-600',
          highlightClass: isHighlighted ? 'ring-2 ring-pink-400' : ''
        };
      default:
        return {
          name: category,
          colorClass: `text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100 ${isHighlighted ? 'ring-2 ring-gray-400 bg-gray-100' : ''}`,
          iconClass: 'text-gray-600',
          highlightClass: isHighlighted ? 'ring-2 ring-gray-400' : ''
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

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Search section */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search calculators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-2">
          {filteredCategories.map(([category, calculators]) => {
            const isExpanded = expandedCategories[category];
            const categoryInfo = getCategoryInfo(category);
            const CategoryIcon = getCategoryIcon(category);
            
            return (
              <div key={category} className="space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-between p-3 h-auto font-medium text-left border rounded-lg transition-all duration-200 ${categoryInfo.colorClass}`}
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center space-x-2">
                    <CategoryIcon className={`h-4 w-4 ${categoryInfo.iconClass}`} />
                    <span className="text-sm font-semibold">{categoryInfo.name}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  )}
                </Button>
                
                {isExpanded && (
                  <div className="ml-2 space-y-1 border-l-2 border-gray-100 pl-3">
                    {calculators.map((calc) => {
                      const CalculatorIcon = getIconComponent(calc.icon);
                      return (
                        <Button
                          key={calc.id}
                          variant="ghost"
                          className={`w-full justify-start p-3 text-left text-sm h-auto transition-all duration-200 rounded-md ${
                            activeCalculator === calc.id
                              ? 'bg-blue-100 text-blue-800 shadow-sm hover:bg-blue-150 border border-blue-200'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                          }`}
                          onClick={() => {
                            onCalculatorSelect(calc.id);
                            onClose?.();
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <CalculatorIcon className={`w-4 h-4 ${
                              activeCalculator === calc.id ? 'text-blue-600' : 'text-purple-500'
                            }`} />
                            <span className="font-medium">{calc.name}</span>
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
