import React from 'react';
import { FileText, Trash2, Loader } from 'lucide-react';
import { PDFDocument } from '../../types';

interface DocumentListProps {
  documents: PDFDocument[];
  currentDocumentId?: string;
  onDocumentSelect: (document: PDFDocument) => void;
  onDocumentDelete: (documentId: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  currentDocumentId,
  onDocumentSelect,
  onDocumentDelete,
}) => {
  const [loadingDocId, setLoadingDocId] = React.useState<string | null>(null);

  const handleDocumentClick = async (doc: PDFDocument) => {
    if (loadingDocId || doc.id === currentDocumentId) return;
    setLoadingDocId(doc.id);
    try {
      await onDocumentSelect(doc);
    } finally {
      setLoadingDocId(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
        Recent Documents
      </h3>
      
      {documents.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          No documents uploaded yet
        </p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => {
            const isLoading = loadingDocId === doc.id;
            const isSelected = doc.id === currentDocumentId;
            
            return (
              <button
                key={doc.id}
                onClick={() => handleDocumentClick(doc)}
                disabled={isLoading || isSelected}
                className={`w-full group relative flex items-center justify-between p-3 rounded-lg 
                  transition-all duration-200 cursor-pointer disabled:cursor-default
                  ${isSelected
                    ? 'bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }
                  ${isLoading ? 'animate-pulse' : ''}
                `}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {isLoading ? (
                    <Loader className="h-5 w-5 text-blue-500 animate-spin" />
                  ) : (
                    <FileText 
                      className={`h-5 w-5 flex-shrink-0 transition-colors
                        ${isSelected
                          ? 'text-blue-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                    />
                  )}
                  <div className="min-w-0 text-left">
                    <p className={`text-sm font-medium truncate transition-colors
                      ${isSelected
                        ? 'text-blue-700 dark:text-blue-400'
                        : 'text-gray-900 dark:text-gray-100 group-hover:text-gray-700'
                      }`}
                    >
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(doc.timestamp)}
                    </p>
                  </div>
                </div>
                
                {!isLoading && !isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDocumentDelete(doc.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full 
                      hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Delete document"
                  >
                    <Trash2 className="h-4 w-4 text-gray-500 dark:text-gray-400 hover:text-red-500" />
                  </button>
                )}

                {isLoading && (
                  <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Loading document...</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentList;