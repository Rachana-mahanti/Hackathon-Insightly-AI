import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

interface UploadProgressProps {
  progress: number;
  isComplete: boolean;
  error: string | null;
  fileName: string;
  onReset: () => void;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  progress,
  isComplete,
  error,
  fileName,
  onReset,
}) => {
  // Animate progress from 0 to 100 when upload is complete (for demo purposes)
  useEffect(() => {
    if (isComplete && progress === 100) {
      // Animation already complete
      return;
    }
  }, [isComplete, progress]);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6 transition-all duration-500">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50">
            {error ? (
              <XCircle className="h-6 w-6 text-red-500" />
            ) : isComplete ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <Loader className="h-6 w-6 text-blue-500 animate-spin" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-800 text-sm truncate max-w-[200px]">{fileName}</h3>
            <p className="text-xs text-gray-500">
              {error
                ? 'Upload failed'
                : isComplete
                ? 'Processing complete'
                : 'Uploading...'}
            </p>
          </div>
        </div>
        {(isComplete || error) && (
          <button 
            onClick={onReset}
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            {error ? 'Try again' : 'Upload another'}
          </button>
        )}
      </div>

      {error ? (
        <div className="text-sm text-red-500 mt-2 mb-4">{error}</div>
      ) : (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className={`h-2 rounded-full transition-all duration-300 ease-out ${
              isComplete ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <div className="text-xs text-right text-gray-500">
        {error ? '' : `${progress}% ${isComplete ? 'Completed' : 'Uploaded'}`}
      </div>
    </div>
  );
};

export default UploadProgress;