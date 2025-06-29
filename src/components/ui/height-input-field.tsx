
import React from 'react';
import { HeightInput } from '@/components/ui/height-input';
import { UnitSystem } from '@/types/calculatorTypes';

interface HeightInputFieldProps {
  unitSystem: UnitSystem;
  height: string;
  setHeight: (height: string) => void;
  error?: string;
}

export const HeightInputField: React.FC<HeightInputFieldProps> = ({
  unitSystem,
  height,
  setHeight,
  error
}) => {
  return (
    <div className="space-y-2">
      <HeightInput
        unitSystem={unitSystem}
        height={height}
        onHeightChange={setHeight}
        error={error}
      />
    </div>
  );
};
