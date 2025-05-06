
import React from 'react';
import { CalculatorInfo } from '@/types/calculator';

interface CalculatorCardProps {
  calculatorInfo: CalculatorInfo;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({ calculatorInfo }) => {
  // This is a placeholder component that will be replaced with actual calculator content
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className={`w-3 h-3 rounded-full bg-${calculatorInfo.color} mr-3`}></div>
        <h2 className="text-2xl font-bold">{calculatorInfo.name}</h2>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        This calculator is currently in development. Please check back soon!
      </p>
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p className="text-center">Calculator content will be displayed here</p>
      </div>
    </div>
  );
};

export default CalculatorCard;
