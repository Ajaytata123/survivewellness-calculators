
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share, Check } from 'lucide-react';
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
  const [shareSuccess, setShareSuccess] = useState(false);

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
      // Get the current page URL with calculator hash
      const currentUrl = window.location.href;
      
      // Create shareable content with the direct calculator link and tools page
      const shareText = `Check out my ${title} results from Survivewellness!\n\n${Object.entries(results).map(([key, value]) => `${key}: ${value}`).join('\n')}\n\nCalculate yours at: ${currentUrl}\n\nExplore more calculators: https://survivewellness.com/tools-calculators/`;
      
      // Try to copy the share content to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
        setShareSuccess(true);
        showSuccessToast('Calculator link copied and ready to share!');
        console.log('Share content copied to clipboard successfully');
        setTimeout(() => setShareSuccess(false), 3000);
      } else {
        // Fallback method for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setShareSuccess(true);
          showSuccessToast('Calculator link copied and ready to share!');
          console.log('Fallback copy successful');
          setTimeout(() => setShareSuccess(false), 3000);
        } else {
          throw new Error('Fallback copy failed');
        }
      }
    } catch (error) {
      console.error('Error copying share content:', error);
      showErrorToast('Failed to copy share link. Please try again.');
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
              {shareSuccess ? <Check className="h-4 w-4" /> : <Share className="h-4 w-4" />}
              {shareSuccess ? 'Link Copied!' : 'Share Calculator Link'}
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
          
          {shareSuccess && (
            <div className="text-center mb-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm font-medium">
                  ✓ Link copied to clipboard! Share it with your friends and family.
                </p>
                <p className="text-green-600 text-xs mt-1">
                  The link includes your results and access to more calculators.
                </p>
              </div>
            </div>
          )}
          
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
