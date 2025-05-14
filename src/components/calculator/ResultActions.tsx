
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
}

const ResultActions: React.FC<ResultActionsProps> = ({
  title,
  results,
  fileName,
  userName,
  unitSystem,
  className
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
    <div className={`space-y-4 ${className || ''}`}>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
          onClick={handleCopyResults}
        >
          <Copy className="h-4 w-4" />
          Copy Results
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100"
          onClick={handleShareResults}
        >
          <Share className="h-4 w-4" />
          Share Link
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-green-50 text-green-600 border-green-100 hover:bg-green-100"
          onClick={handleDownloadResults}
        >
          <Download className="h-4 w-4" />
          Download CSV
        </Button>
      </div>
    </div>
  );
};

export default ResultActions;
