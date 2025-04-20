import React, { useState, useRef, useEffect } from 'react';
import { Message as MessageType, PDFDocument } from '../../types';
import Message from './Message';
import MessageInput from './MessageInput';
import SuggestedQuestions from '../sidebar/SuggestedQuestions';
import DocumentList from '../sidebar/DocumentList';
import { askQuestion } from '../../services/api';
import { FileSearch, Loader, Menu, AlertCircle } from 'lucide-react';
import { getCurrentPDF, updatePDFMessages, deletePDFDocument, getPDFDocuments, setCurrentPDF } from '../../services/storage';

const ChatInterface: React.FC = () => {
  const [currentDocument, setCurrentDocument] = useState<PDFDocument | null>(() => {
    const pdf = getCurrentPDF();
    if (!pdf?.text) return null;
    return pdf;
  });
  
  const [messages, setMessages] = useState<MessageType[]>(() => currentDocument?.messages || [{
    id: '1',
    content: "I've analyzed your annual report. What would you like to know about it?",
    sender: 'ai',
    timestamp: new Date(),
  }]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (currentDocument?.id && messages) {
      updatePDFMessages(currentDocument.id, messages);
    }
  }, [messages, currentDocument]);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleDocumentSelect = async (document: PDFDocument) => {
    try {
      setIsLoadingDocument(true);
      setError(null);

      if (!document.text) {
        throw new Error('Document text is missing. Please try uploading the file again.');
      }
      
      setCurrentDocument(document);
      setCurrentPDF(document);
      setMessages(document.messages || [{
        id: '1',
        content: "I've analyzed your annual report. What would you like to know about it?",
        sender: 'ai',
        timestamp: new Date(),
      }]);
      setShowSidebar(false);

      // Scroll chat into view with a slight delay to ensure smooth transition
      setTimeout(() => {
        chatContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        scrollToBottom('auto');
      }, 100);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load document');
    } finally {
      setIsLoadingDocument(false);
    }
  };

  const handleDocumentDelete = (documentId: string) => {
    deletePDFDocument(documentId);
    if (currentDocument?.id === documentId) {
      setCurrentDocument(null);
      setMessages([{
        id: '1',
        content: "I've analyzed your annual report. What would you like to know about it?",
        sender: 'ai',
        timestamp: new Date(),
      }]);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentDocument?.text) {
      setError('No document selected or document text is missing. Please upload or select a valid PDF.');
      return;
    }

    if (isLoading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const userMessage: MessageType = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    setShowSidebar(false);
    
    try {
      const response = await askQuestion(content);
      
      const aiMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        sender: 'ai',
        timestamp: new Date(),
        metrics: response.metrics,
        citations: response.citations,
        context: response.context,
        confidence: response.confidence,
        charts: response.charts,
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      const aiMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: `I apologize, but I'm having trouble processing your question. ${errorMessage}. Please try again in a moment.`,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="flex h-full relative">
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 
          dark:border-gray-700 transform transition-transform duration-300 z-50
          ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="h-full overflow-y-auto p-4 space-y-6">
          <DocumentList
            documents={getPDFDocuments()}
            currentDocumentId={currentDocument?.id}
            onDocumentSelect={handleDocumentSelect}
            onDocumentDelete={handleDocumentDelete}
          />
          <SuggestedQuestions onQuestionClick={handleSendMessage} />
        </div>
      </aside>

      <div ref={chatContainerRef} className="flex-1 flex flex-col overflow-hidden relative">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="md:hidden absolute top-2 left-2 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md z-10"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex items-center space-x-2 p-4 rounded-lg bg-white dark:bg-gray-800 animate-pulse">
              <Loader className="h-5 w-5 text-blue-500 animate-spin" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Insightly AI is thinking...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <MessageInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading || isLoadingDocument}
            disabled={!currentDocument?.text}
            placeholder={
              !currentDocument
                ? "Please upload or select a PDF first"
                : !currentDocument.text
                ? "Document text is missing. Please try uploading again"
                : "Ask a question about the report..."
            }
          />
          
          <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400 flex items-center justify-center">
            <FileSearch className="h-3 w-3 mr-1" />
            <span>Ask about revenue trends, risks, or key metrics in the report</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;