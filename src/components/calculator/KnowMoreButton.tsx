
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface KnowMoreButtonProps {
  calculatorName: string;
  calculatorId: string;
}

export const KnowMoreButton: React.FC<KnowMoreButtonProps> = ({ 
  calculatorName, 
  calculatorId 
}) => {
  // Display "Period" instead of "Menstrual Cycle" if applicable
  const displayName = calculatorId === 'menstrualCycle' ? 'Period Calculator' : calculatorName;
  
  return (
    <a 
      href="#" 
      className="know-more-button"
      id={`know-more-${calculatorId}`}
      data-calculator={calculatorId}
    >
      Know more about {displayName}
      <ExternalLink className="h-4 w-4" />
    </a>
  );
};

export default KnowMoreButton;
