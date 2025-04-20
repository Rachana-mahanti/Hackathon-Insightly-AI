import { PDFDocument, Message } from '../types';

const STORAGE_KEYS = {
  CURRENT_PDF: 'insightly_current_pdf',
  PDF_DOCUMENTS: 'insightly_pdf_documents',
};

export const getCurrentPDF = (): PDFDocument | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_PDF);
    if (!data) return null;
    
    const pdf = JSON.parse(data);
    if (!pdf.text) {
      console.warn('PDF document found but missing text content');
      return null;
    }
    
    return pdf;
  } catch (error) {
    console.error('Error retrieving current PDF:', error);
    return null;
  }
};

export const setCurrentPDF = (pdf: PDFDocument | null): void => {
  try {
    if (pdf) {
      if (!pdf.text) {
        throw new Error('Cannot set current PDF without text content');
      }
      localStorage.setItem(STORAGE_KEYS.CURRENT_PDF, JSON.stringify(pdf));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_PDF);
    }
  } catch (error) {
    console.error('Error setting current PDF:', error);
    throw error;
  }
};

export const getPDFDocuments = (): PDFDocument[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PDF_DOCUMENTS);
    if (!data) return [];
    
    const documents = JSON.parse(data);
    return documents.filter(doc => doc.text); // Only return documents with text content
  } catch (error) {
    console.error('Error retrieving PDF documents:', error);
    return [];
  }
};

export const savePDFDocument = (pdf: PDFDocument): void => {
  try {
    if (!pdf.text) {
      throw new Error('Cannot save PDF document without text content');
    }

    const documents = getPDFDocuments();
    const existingIndex = documents.findIndex(doc => doc.id === pdf.id);
    
    if (existingIndex >= 0) {
      documents[existingIndex] = pdf;
    } else {
      documents.unshift(pdf);
    }
    
    localStorage.setItem(STORAGE_KEYS.PDF_DOCUMENTS, JSON.stringify(documents));
    setCurrentPDF(pdf);
  } catch (error) {
    console.error('Error saving PDF document:', error);
    throw error;
  }
};

export const updatePDFMessages = (pdfId: string, messages: Message[]): void => {
  try {
    const documents = getPDFDocuments();
    const documentIndex = documents.findIndex(doc => doc.id === pdfId);
    
    if (documentIndex >= 0) {
      documents[documentIndex].messages = messages;
      localStorage.setItem(STORAGE_KEYS.PDF_DOCUMENTS, JSON.stringify(documents));
      
      const currentPDF = getCurrentPDF();
      if (currentPDF?.id === pdfId) {
        setCurrentPDF({ ...currentPDF, messages });
      }
    }
  } catch (error) {
    console.error('Error updating PDF messages:', error);
    throw error;
  }
};

export const deletePDFDocument = (pdfId: string): void => {
  try {
    const documents = getPDFDocuments().filter(doc => doc.id !== pdfId);
    localStorage.setItem(STORAGE_KEYS.PDF_DOCUMENTS, JSON.stringify(documents));
    
    const currentPDF = getCurrentPDF();
    if (currentPDF?.id === pdfId) {
      setCurrentPDF(null);
    }
  } catch (error) {
    console.error('Error deleting PDF document:', error);
    throw error;
  }
};

export const cleanupExpiredDocuments = (): void => {
  try {
    const now = Date.now();
    const documents = getPDFDocuments().filter(doc => doc.expiresAt > now);
    localStorage.setItem(STORAGE_KEYS.PDF_DOCUMENTS, JSON.stringify(documents));
    
    const currentPDF = getCurrentPDF();
    if (currentPDF?.expiresAt && currentPDF.expiresAt <= now) {
      setCurrentPDF(null);
    }
  } catch (error) {
    console.error('Error cleaning up expired documents:', error);
  }
};