
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
  return (
    <a 
      href="#" 
      className="know-more-button"
      id={`know-more-${calculatorId}`}
    >
      Know more about {calculatorName}
      <ExternalLink className="h-4 w-4" />
    </a>
  );
};

export default KnowMoreButton;
