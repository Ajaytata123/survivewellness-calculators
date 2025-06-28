
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Download, Share } from 'lucide-react';
import { ResultForDownload, UnitSystem } from '@/types/calculatorTypes';
import { 
  shareResults, 
  downloadResultsAsCSV, 
  copyResultsToClipboard 
} from '@/utils/downloadUtils';

interface ResultActionsProps {
  title: string;
  results: Record<string, string | number>;
  fileName: string;
  userName?: string;
  unitSystem: UnitSystem;
  className?: string;
  referenceText?: string;
}

const ResultActions: React.FC<ResultActionsProps> = ({
  title,
  results,
  fileName,
  userName,
  unitSystem,
  className,
  referenceText
}) => {
  const prepareResults = (): ResultForDownload => {
    return {
      title,
      date: new Date().toLocaleDateString(),
      unitSystem,
      userName: userName || 'User',
      results
    };
  };

  const handleCopyResults = async () => {
    try {
      const resultsData = prepareResults();
      await copyResultsToClipboard(resultsData);
      console.log('Results copied successfully');
    } catch (error) {
      console.error('Error copying results:', error);
    }
  };

  const handleShareResults = async () => {
    try {
      const resultsData = prepareResults();
      await shareResults(resultsData);
      console.log('Results shared successfully');
    } catch (error) {
      console.error('Error sharing results:', error);
    }
  };

  const handleDownloadResults = () => {
    try {
      const resultsData = prepareResults();
      downloadResultsAsCSV(resultsData, fileName);
      console.log('Results downloaded successfully');
    } catch (error) {
      console.error('Error downloading results:', error);
    }
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="mt-4 mb-2">
        {referenceText && (
          <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm italic bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            {referenceText}
          </p>
        )}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border-blue-300 hover:from-blue-100 hover:to-cyan-100 hover:border-blue-400 shadow-sm hover:shadow-md transition-all duration-200 touch-manipulation"
            onClick={handleCopyResults}
            type="button"
          >
            <Copy className="h-4 w-4" />
            Copy Results
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-600 border-purple-300 hover:from-purple-100 hover:to-violet-100 hover:border-purple-400 shadow-sm hover:shadow-md transition-all duration-200 touch-manipulation"
            onClick={handleShareResults}
            type="button"
          >
            <Share className="h-4 w-4" />
            Share Link
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 border-green-300 hover:from-green-100 hover:to-emerald-100 hover:border-green-400 shadow-sm hover:shadow-md transition-all duration-200 touch-manipulation"
            onClick={handleDownloadResults}
            type="button"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </div>
      </div>
      
      <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-4">
        <p className="text-purple-600 dark:text-purple-400 font-semibold mb-1">Thank you for using Survivewellness!</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">For more calculators please visit our dedicated calculators section</p>
      </div>
    </div>
  );
};

export default ResultActions;
