
import React from 'react';
import InfoSectionFactory from './InfoSectionFactory';

interface IntroSectionProps {
  title: string;
  description: string;
  calculatorId?: string;
}

const IntroSection: React.FC<IntroSectionProps> = ({ calculatorId }) => {
  // If calculatorId is provided, use the factory to get the specific info
  if (calculatorId) {
    return <InfoSectionFactory calculatorId={calculatorId} />;
  }
  
  // Return null if no calculatorId is provided
  return null;
};

export default IntroSection;
