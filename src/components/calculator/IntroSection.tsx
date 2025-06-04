
import React from 'react';
import InfoSectionFactory from './InfoSectionFactory';

interface IntroSectionProps {
  title: string;
  description: string;
  calculatorId?: string;
}

const IntroSection: React.FC<IntroSectionProps> = ({ calculatorId }) => {
  console.log('IntroSection rendering with calculatorId:', calculatorId);
  
  // Always render intro sections for both mobile and desktop
  if (calculatorId) {
    return <InfoSectionFactory calculatorId={calculatorId} />;
  }
  
  // Return null if no calculatorId is provided
  return null;
};

export default IntroSection;
