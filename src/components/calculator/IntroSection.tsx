
import React from 'react';
import { InfoCircle } from 'lucide-react';

interface IntroSectionProps {
  title: string;
  description: string;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ title, description }) => {
  return (
    <div className="intro-section">
      <div className="flex items-start gap-2">
        <InfoCircle className="h-5 w-5 text-wellness-blue mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-base font-medium text-wellness-blue mb-1">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
