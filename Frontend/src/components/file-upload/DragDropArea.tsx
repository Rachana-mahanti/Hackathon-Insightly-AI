import React, { useCallback, useState } from 'react';
import { Upload, FileText } from 'lucide-react';

interface DragDropAreaProps {
  onFileSelected: (file: File | null) => void;
  disabled?: boolean;
}

const DragDropArea: React.FC<DragDropAreaProps> = ({ onFileSelected, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileSelected(file);
    }
  }, [onFileSelected, disabled]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  }, [onFileSelected]);
  
  return (
    <div
      className={`w-full relative rounded-lg border-2 border-dashed p-4 md:p-8 transition-all duration-300 ease-in-out
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => {
        if (!disabled) {
          document.getElementById('file-input')?.click();
        }
      }}
    >
      <input
        id="file-input"
        type="file"
        className="hidden"
        accept=".pdf"
        onChange={handleFileInputChange}
        disabled={disabled}
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        {isDragging ? (
          <FileText className="h-12 w-12 md:h-16 md:w-16 text-blue-500 animate-pulse" />
        ) : (
          <Upload className="h-12 w-12 md:h-16 md:w-16 text-blue-500" />
        )}
        <div className="text-center">
          <p className="text-base md:text-lg font-medium text-gray-700">
            {isDragging ? 'Drop your PDF here' : 'Drag & drop your annual report'}
          </p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            or click to browse (PDF files only)
          </p>
        </div>
      </div>
    </div>
  );
};

export default DragDropArea