
import React from 'react';
import { Info } from 'lucide-react';

interface IntroSectionTemplateProps {
  title: string;
  calculatorName: string;
  description: string;
}

const IntroSectionTemplate: React.FC<IntroSectionTemplateProps> = ({ 
  title, 
  calculatorName, 
  description 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-wellness-softBlue dark:bg-wellness-softBlue/30 p-2 rounded-full">
          <Info className="h-5 w-5 text-wellness-blue" />
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-wellness-blue dark:text-wellness-blue/90">{title}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntroSectionTemplate;
