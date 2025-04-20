import { useState } from 'react';
import { FileUploadState } from '../types';
import { uploadPDF } from '../services/api';

export const useFileUpload = () => {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    file: null,
    isUploading: false,
    progress: 0,
    isProcessed: false,
    error: null,
  });

  const resetUpload = () => {
    setUploadState({
      file: null,
      isUploading: false,
      progress: 0,
      isProcessed: false,
      error: null,
    });
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    
    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      setUploadState({
        ...uploadState,
        error: 'Please upload a PDF file',
      });
      return;
    }

    setUploadState({
      ...uploadState,
      file,
      error: null,
    });
  };

  const handleUpload = async () => {
    if (!uploadState.file) return;

    setUploadState({
      ...uploadState,
      isUploading: true,
      progress: 0,
      error: null,
    });

    try {
      await uploadPDF(uploadState.file, (progress) => {
        setUploadState((prev) => ({
          ...prev,
          progress,
        }));
      });

      setUploadState((prev) => ({
        ...prev,
        isUploading: false,
        isProcessed: true,
      }));
    } catch (error) {
      setUploadState((prev) => ({
        ...prev,
        isUploading: false,
        error: error instanceof Error ? error.message : 'Failed to upload file',
      }));
    }
  };

  return {
    uploadState,
    handleFileChange,
    handleUpload,
    resetUpload,
  };
};