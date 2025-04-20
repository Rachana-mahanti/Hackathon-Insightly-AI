export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  charts?: ChartData[];
  metrics?: Metric[];
  citations?: Citation[];
  context?: string;
  confidence?: number;
}

export interface ChartData {
  type: 'line' | 'bar' | 'area';
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
      fill?: boolean;
    }[];
  };
}

export interface FileUploadState {
  file: File | null;
  isUploading: boolean;
  progress: number;
  isProcessed: boolean;
  error: string | null;
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  category: 'financial' | 'risks' | 'overview' | 'metrics';
  icon: string;
}

export interface DocumentSummary {
  title: string;
  year: string;
  company: string;
  keyMetrics: {
    label: string;
    value: string;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
  }[];
}

export interface Metric {
  value: number | string;
  unit?: string;
  context?: string;
  trend?: 'up' | 'down' | 'neutral';
  previousValue?: number | string;
  changePercentage?: number;
  timeframe?: {
    start?: string;
    end?: string;
  };
}

export interface Citation {
  page: number;
  section?: string;
  text: string;
  relevance: number;
  context?: string;
  timeframe?: {
    start?: string;
    end?: string;
  };
}

export interface DocumentInsight {
  answer: string;
  metrics?: Metric[];
  citations?: Citation[];
  context?: string;
  confidence?: number;
  charts?: ChartData[];
}

export interface PDFDocument {
  id: string;
  name: string;
  lastModified: number;
  size: number;
  timestamp: number;
  expiresAt: number;
  text?: string;
  messages: Message[];
}