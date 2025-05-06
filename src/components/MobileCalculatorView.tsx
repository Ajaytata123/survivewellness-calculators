import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CalculatorInfo } from '@/types/calculator';
import Breadcrumb from './calculator/Breadcrumb';
import CalculatorDisplay from './CalculatorDisplay';
import { UnitSystem } from '@/types/calculatorTypes';

interface MobileCalculatorViewProps {
  calculators: CalculatorInfo[];
  activeCalculator: string;
  onCalculatorSelect: (calculatorId: string) => void;
}

export const MobileCalculatorView: React.FC<MobileCalculatorViewProps> = ({
  calculators,
  activeCalculator,
  onCalculatorSelect,
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryList, setShowCategoryList] = useState(true);
  const [filteredCalculators, setFilteredCalculators] = useState<CalculatorInfo[]>(calculators);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("imperial");

  const activeCalcInfo = calculators.find(calc => calc.id === activeCalculator);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCalculators(calculators);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = calculators.filter(calc => 
        calc.name.toLowerCase().includes(query) || 
        calc.category.toLowerCase().includes(query)
      );
      setFilteredCalculators(filtered);
    }
  }, [searchQuery, calculators]);

  useEffect(() => {
    if (activeCalculator) {
      setShowCategoryList(false);
    }
  }, [activeCalculator]);

  const handleCalculatorSelect = (calculatorId: string) => {
    onCalculatorSelect(calculatorId);
    setShowSearch(false);
    setShowCategoryList(false);
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  const handleUnitSystemChange = (system: UnitSystem) => {
    setUnitSystem(system);
  };

  const groupCalculatorsByCategory = () => {
    const grouped: Record<string, CalculatorInfo[]> = {};
    
    calculators.forEach(calc => {
      if (!grouped[calc.category]) {
        grouped[calc.category] = [];
      }
      grouped[calc.category].push(calc);
    });
    
    return grouped;
  };

  const groupedCalculators = groupCalculatorsByCategory();

  return (
    <div className="mobile-calculator-view">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">
            {showSearch ? 'Search Calculators' : 'Calculators'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearchToggle}
            aria-label={showSearch ? 'Close search' : 'Search calculators'}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {showSearch && (
          <div className="px-4 pb-4">
            <Input
              type="text"
              placeholder="Search calculators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
        )}

        {activeCalcInfo && !showSearch && (
          <div className="pb-3 px-4 space-y-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowCategoryList(true)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-4" />
              <span className="font-medium">{activeCalcInfo.name}</span>
            </div>
            <Breadcrumb 
              calculators={calculators}
              activeCalculator={activeCalculator}
              onCalculatorSelect={onCalculatorSelect}
            />
          </div>
        )}
      </div>

      <div id="calculator-content" className="p-4">
        {showCategoryList ? (
          <div className="space-y-6">
            {showSearch ? (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Search Results
                </h3>
                {filteredCalculators.length > 0 ? (
                  <ul className="space-y-2">
                    {filteredCalculators.map((calculator) => (
                      <li key={calculator.id}>
                        <button
                          className="w-full flex items-center p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={() => handleCalculatorSelect(calculator.id)}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-2 bg-${calculator.color}-500`}
                          ></span>
                          <span>{calculator.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No calculators found matching "{searchQuery}"
                  </p>
                )}
              </div>
            ) : (
              Object.entries(groupedCalculators).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 capitalize">
                    {category === 'body' ? 'Body Composition' :
                     category === 'fitness' ? 'Fitness & Exercise' :
                     category === 'nutrition' ? 'Nutrition & Diet' :
                     category === 'wellness' ? 'Wellness & Lifestyle' :
                     category === 'women' ? 'Women\'s Health' : category}
                  </h3>
                  <ul className="space-y-2">
                    {items.map((calculator) => (
                      <li key={calculator.id}>
                        <button
                          className="w-full flex items-center p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={() => handleCalculatorSelect(calculator.id)}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-2 bg-${calculator.color}-500`}
                          ></span>
                          <span>{calculator.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        ) : (
          activeCalcInfo && (
            <div className="calculator-card">
              <CalculatorDisplay 
                activeCalculator={activeCalculator} 
                unitSystem={unitSystem} 
                onUnitSystemChange={handleUnitSystemChange} 
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MobileCalculatorView;
