
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

  const handleCopyResults = () => {
    const resultsData = prepareResults();
    copyResultsToClipboard(resultsData);
  };

  const handleShareResults = () => {
    const resultsData = prepareResults();
    shareResults(resultsData);
  };

  const handleDownloadResults = () => {
    const resultsData = prepareResults();
    downloadResultsAsCSV(resultsData, fileName);
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="mt-4 mb-2">
        {referenceText && (
          <p className="text-gray-600 dark:text-gray-400 mb-3">{referenceText}</p>
        )}
        <div className="flex flex-wrap gap-3 justify-start">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-[#e6f7ff] text-[#0ea5e9] border-[#0ea5e9] hover:bg-[#d1edff]"
            onClick={handleCopyResults}
          >
            <Copy className="h-4 w-4" />
            Copy Results
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-[#eee6ff] text-[#8b5cf6] border-[#8b5cf6] hover:bg-[#e2d9f5]"
            onClick={handleShareResults}
          >
            <Share className="h-4 w-4" />
            Share Link
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-[#e6fff0] text-[#10b981] border-[#10b981] hover:bg-[#d1f7e4]"
            onClick={handleDownloadResults}
          >
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-purple-500 dark:text-purple-400 font-medium mb-1">Thank you for using Survivewellness!</p>
        <p className="text-sm text-gray-500">For more calculators please visit our dedicated calculators section</p>
      </div>
    </div>
  );
};

export default ResultActions;
