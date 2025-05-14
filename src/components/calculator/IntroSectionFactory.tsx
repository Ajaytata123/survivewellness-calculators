
import React from 'react';

interface IntroSectionFactoryProps {
  calculatorId: string;
}

const IntroSectionFactory: React.FC<IntroSectionFactoryProps> = ({ calculatorId }) => {
  // Return null for all calculators - removing intro sections
  return null;
};

export default IntroSectionFactory;
