
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  className, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div 
        className={cn(
          'animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 shadow-lg',
          sizeClasses[size]
        )}
        style={{
          animationDuration: '1s'
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
