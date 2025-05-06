
import React from 'react';
import { CalculatorInfo } from '@/types/calculator';
import CalculatorDisplay from '@/components/CalculatorDisplay';
import { useState } from 'react';
import { UnitSystem } from '@/types/calculatorTypes';

interface CalculatorCardProps {
  calculatorInfo: CalculatorInfo;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({ calculatorInfo }) => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("imperial");
  
  const handleUnitSystemChange = (system: UnitSystem) => {
    setUnitSystem(system);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className={`w-3 h-3 rounded-full bg-${calculatorInfo.color}-500 mr-3`}></div>
        <h2 className="text-2xl font-bold">{calculatorInfo.name}</h2>
      </div>
      <CalculatorDisplay 
        activeCalculator={calculatorInfo.id} 
        unitSystem={unitSystem} 
        onUnitSystemChange={handleUnitSystemChange} 
      />
    </div>
  );
};

export default CalculatorCard;
