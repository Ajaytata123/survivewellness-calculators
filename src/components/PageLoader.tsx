
import React, { useState, useEffect } from 'react';
import LoadingSpinner from './ui/loading-spinner';

interface PageLoaderProps {
  children: React.ReactNode;
  minLoadTime?: number;
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  children, 
  minLoadTime = 2000 
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
        <div className="text-center space-y-6">
          <LoadingSpinner size="lg" className="mb-6" />
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Loading Health Calculator
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Please wait while we prepare your comprehensive health and wellness calculator...
            </p>
            <div className="flex justify-center space-x-1 mt-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PageLoader;
