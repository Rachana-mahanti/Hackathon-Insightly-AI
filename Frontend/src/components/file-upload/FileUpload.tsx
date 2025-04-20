import React, { useState, useEffect } from 'react';
import DragDropArea from './DragDropArea';
import UploadProgress from './UploadProgress';
import { useFileUpload } from '../../hooks/useFileUpload';
import { FileText, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onProcessingComplete: (fileName: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onProcessingComplete }) => {
  const { uploadState, handleFileChange, handleUpload, resetUpload } = useFileUpload();
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  useEffect(() => {
    if (uploadState.file && !uploadState.isUploading && !uploadState.isProcessed && !uploadState.error) {
      handleUpload();
    }
  }, [uploadState.file]);

  useEffect(() => {
    if (uploadState.isProcessed && uploadState.file) {
      setShowSuccessAnimation(true);
      const timer = setTimeout(() => {
        setShowSuccessAnimation(false);
        onProcessingComplete(uploadState.file!.name);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [uploadState.isProcessed, uploadState.file, onProcessingComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto transition-all duration-500">
      {showSuccessAnimation ? (
        <div className="flex flex-col items-center justify-center space-y-6 py-16 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">PDF Processed Successfully!</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Your report is ready for analysis</p>
          </div>
        </div>
      ) : uploadState.file ? (
        <div className="transition-all duration-300 transform">
          <UploadProgress
            progress={uploadState.progress}
            isComplete={uploadState.isProcessed}
            error={uploadState.error}
            fileName={uploadState.file.name}
            onReset={resetUpload}
          />
          
          {uploadState.isUploading && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">Analyzing document with AI...</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">This may take a moment depending on the file size</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Upload Annual Report</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Drag and drop your PDF file to get started with AI analysis
            </p>
          </div>
          
          <DragDropArea onFileSelected={handleFileChange} />
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start space-x-3">
            <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-300">Why upload an annual report?</p>
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                Our AI will analyze the document and allow you to ask questions about the company's performance, risks, and outlook.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;