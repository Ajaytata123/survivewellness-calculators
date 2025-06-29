
import React, { useState, useEffect } from 'react';
import LoadingSpinner from './ui/loading-spinner';

interface PageLoaderProps {
  children: React.ReactNode;
  minLoadTime?: number;
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  children, 
  minLoadTime = 3000 
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minLoadTime);

    return () => clearTimeout(timer);
  }, [minLoadTime]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Loading Calculator
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we prepare your health calculator...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PageLoader;
