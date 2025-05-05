
import React from 'react';
import { Info } from 'lucide-react';

interface IntroSectionProps {
  title: string;
  description: string;
}

const IntroSection: React.FC<IntroSectionProps> = ({ title, description }) => {
  return (
    <div className="intro-section mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
      <div className="flex items-start gap-2">
        <Info className="h-5 w-5 text-wellness-blue mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-base font-medium text-wellness-blue mb-1">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
