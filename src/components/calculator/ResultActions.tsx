
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share } from 'lucide-react';
import { ResultForDownload, UnitSystem } from '@/types/calculatorTypes';
import { 
  downloadResultsAsCSV
} from '@/utils/downloadUtils';
import { showSuccessToast, showErrorToast } from '@/utils/notificationUtils';

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

  const handleShareResults = async () => {
    try {
      const resultsData = prepareResults();
      
      // Create shareable link with current URL
      const currentUrl = window.location.href;
      const shareText = `Check out my ${resultsData.title} results from Survivewellness!\n\n${Object.entries(resultsData.results).map(([key, value]) => `${key}: ${value}`).join('\n')}\n\nCalculate yours at: ${currentUrl}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareText);
      showSuccessToast('Results link copied and ready to share!');
      
      console.log('Share link copied to clipboard successfully');
    } catch (error) {
      console.error('Error copying share link:', error);
      // Fallback method for older browsers
      try {
        const resultsData = prepareResults();
        const currentUrl = window.location.href;
        const shareText = `Check out my ${resultsData.title} results from Survivewellness!\n\n${Object.entries(resultsData.results).map(([key, value]) => `${key}: ${value}`).join('\n')}\n\nCalculate yours at: ${currentUrl}`;
        
        // Create temporary textarea for fallback copy
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        showSuccessToast('Results link copied and ready to share!');
      } catch (fallbackError) {
        showErrorToast('Failed to copy share link. Please try again.');
      }
    }
  };

  const handleDownloadResults = () => {
    try {
      const resultsData = prepareResults();
      downloadResultsAsCSV(resultsData, fileName);
      showSuccessToast('Results downloaded successfully!');
      console.log('Results downloaded successfully');
    } catch (error) {
      console.error('Error downloading results:', error);
      showErrorToast('Failed to download results. Please try again.');
    }
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="mt-6 mb-4">
        {referenceText && (
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
            <p className="text-blue-800 text-sm font-medium leading-relaxed">
              {referenceText}
            </p>
          </div>
        )}
        
        <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-violet-200 shadow-lg">
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-purple-300 hover:from-purple-100 hover:to-violet-100 hover:border-purple-400 hover:text-purple-800 shadow-sm hover:shadow-md transition-all duration-300 touch-manipulation font-medium"
              onClick={handleShareResults}
              type="button"
            >
              <Share className="h-4 w-4" />
              Share Results
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-300 hover:from-green-100 hover:to-emerald-100 hover:border-green-400 hover:text-green-800 shadow-sm hover:shadow-md transition-all duration-300 touch-manipulation font-medium"
              onClick={handleDownloadResults}
              type="button"
            >
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
          </div>
          
          <div className="text-center border-t border-violet-200 pt-4">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-violet-100">
              <p className="text-purple-700 font-bold mb-1 text-lg">Thank you for using Survivewellness!</p>
              <p className="text-sm text-gray-600">For more calculators please visit our dedicated calculators section</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultActions;
