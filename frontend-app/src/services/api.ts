import { DocumentInsight, PDFDocument } from '../types';
import { getCurrentPDF, savePDFDocument } from './storage';

const API_BASE_URL = 'https://5b4a092e-8a8a-480b-b1fa-828e953a2732-00-l2ws0gwwlzby.worf.replit.dev';
const API_TIMEOUT = 30000; // 30 seconds timeout

export const checkPDFStatus = () => {
  const currentPDF = getCurrentPDF();
  return {
    isValid: !!currentPDF,
    data: currentPDF
  };
};

export const uploadPDF = async (file: File, onProgress: (progress: number) => void): Promise<boolean> => {
  const pdfDocument: PDFDocument = {
    id: crypto.randomUUID(),
    name: file.name,
    lastModified: file.lastModified,
    size: file.size,
    timestamp: Date.now(),
    expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
    messages: [{
      id: '1',
      content: "I've analyzed your annual report. What would you like to know about it?",
      sender: 'ai',
      timestamp: new Date(),
    }],
  };
  
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.text) {
      pdfDocument.text = data.text;
      savePDFDocument(pdfDocument);
      onProgress(100);
      return true;
    } else {
      throw new Error('Response missing text content');
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Network error occurred. Please check your internet connection and try again.');
    }
    throw error;
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const timeoutPromise = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Request timed out')), ms)
    )
  ]);
};

export const askQuestion = async (question: string, retries = 3): Promise<DocumentInsight> => {
  const currentPDF = getCurrentPDF();
  if (!currentPDF) {
    throw new Error('No PDF selected. Please upload or select a PDF first.');
  }

  if (!currentPDF.text) {
    throw new Error('PDF text not found. Please try uploading the file again.');
  }

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (!question || typeof question !== 'string') {
        throw new Error('Question must be a valid string');
      }

      const trimmedQuestion = question.trim();
      if (trimmedQuestion.length === 0) {
        throw new Error('Question cannot be empty');
      }

      if (trimmedQuestion.length > 1000) {
        throw new Error('Question is too long. Maximum length is 1000 characters.');
      }

      const payload = {
        question: trimmedQuestion,
        context: currentPDF.text
      };

      const response = await timeoutPromise(
        fetch(`${API_BASE_URL}/ask`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors',
          credentials: 'same-origin',
          body: JSON.stringify(payload)
        }),
        API_TIMEOUT
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }

      const responseData = await response.json();

      if (!responseData || typeof responseData !== 'object') {
        throw new Error('Invalid response format from server');
      }

      return {
        answer: responseData.answer || '',
        metrics: Array.isArray(responseData.metrics) ? responseData.metrics : [],
        citations: Array.isArray(responseData.citations) ? responseData.citations : [],
        context: responseData.context || null,
        confidence: typeof responseData.confidence === 'number' ? responseData.confidence : null,
        charts: Array.isArray(responseData.charts) ? responseData.charts : []
      };
    } catch (error) {
      lastError = error as Error;
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error occurred. Please check your internet connection and try again.');
      }
      
      if (error.message === 'Request timed out') {
        throw new Error('The request took too long to complete. Please try again.');
      }
      
      if (attempt < retries - 1) {
        await delay(1000 * (attempt + 1)); // Exponential backoff
        continue;
      }
    }
  }

  throw new Error(`Failed to get answer after ${retries} attempts: ${lastError?.message}`);
};