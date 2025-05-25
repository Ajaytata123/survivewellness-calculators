
import React from 'react';
import { Card } from '@/components/ui/card';
import { getIconComponent } from '@/utils/iconUtils';

interface InfoSectionProps {
  title: string;
  description: string;
  iconName?: string;
  benefits?: string[];
  usage?: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ 
  title, 
  description, 
  iconName = "Info",
  benefits = [],
  usage
}) => {
  const IconComponent = getIconComponent(iconName);

  return (
    <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
            <IconComponent className="h-4 w-4 text-blue-600 dark:text-blue-300" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            {description}
          </p>
          
          {benefits.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                Benefits:
              </h4>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {usage && (
            <div>
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                How to use:
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {usage}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default InfoSection;
