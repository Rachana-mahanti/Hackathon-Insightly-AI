import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/file-upload';
import { ChatInterface } from './components/chat';
import { Header } from './components/layout';
import { checkPDFStatus } from './services/api';
import { FileText } from 'lucide-react';
import { PDFDocument } from './types';
import { getCurrentPDF, getPDFDocuments } from './services/storage';

function App() {
  const [fileProcessed, setFileProcessed] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<PDFDocument[]>(() => getPDFDocuments());
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);

  useEffect(() => {
    const { isValid, data } = checkPDFStatus();
    if (isValid && data) {
      setFileProcessed(true);
      setUploadHistory(getPDFDocuments());
    }
  }, []);

  const handleProcessingComplete = (fileName: string) => {
    setFileProcessed(true);
    setUploadHistory(getPDFDocuments());
  };

  const handleHomeClick = () => {
    setFileProcessed(false);
  };

  const handleDocumentSelect = async (document: PDFDocument) => {
    try {
      setIsLoadingDocument(true);
      if (!document.text) {
        throw new Error('Document text is missing. Please try uploading the file again.');
      }
      setFileProcessed(true);
    } catch (error) {
      console.error('Error selecting document:', error);
    } finally {
      setIsLoadingDocument(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header onHomeClick={handleHomeClick} />
      
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 relative w-full">
          <div
            className={`transition-all duration-500 ease-in-out ${
              fileProcessed ? 'hidden' : 'block'
            }`}
          >
            {!fileProcessed && (
              <div className="container mx-auto px-4 py-6 md:py-8 min-h-[calc(100vh-4rem)] overflow-y-auto">
                <div className="max-w-2xl mx-auto space-y-6">
                  <FileUpload onProcessingComplete={handleProcessingComplete} />
                  
                  {uploadHistory.length > 0 && (
                    <div className="mt-8">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Previously Uploaded Reports
                      </h2>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-y-auto max-h-[40vh] md:max-h-60">
                        {uploadHistory.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => handleDocumentSelect(doc)}
                            disabled={isLoadingDocument}
                            className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 
                              dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                          >
                            <FileText className="h-5 w-5 flex-shrink-0 text-blue-500" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                {doc.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(doc.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            className={`transition-all duration-500 ease-in-out ${
              fileProcessed ? 'block' : 'hidden'
            }`}
          >
            {fileProcessed && <ChatInterface />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;