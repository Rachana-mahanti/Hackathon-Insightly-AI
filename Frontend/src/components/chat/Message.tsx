import React from 'react';
import { User, Bot, TrendingUp, BookOpen } from 'lucide-react';
import { Message as MessageType, Citation } from '../../types';
import ChartContainer from '../charts/ChartContainer';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isAI = message.sender === 'ai';
  
  const renderCitation = (citation: Citation) => (
    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
      <div className="flex items-center gap-1 mb-1">
        <BookOpen className="h-3 w-3" />
        <span className="font-medium">
          Page {citation.page}{citation.section ? ` - ${citation.section}` : ''}
        </span>
      </div>
      <p className="italic">{citation.text}</p>
    </div>
  );

  const renderMetrics = () => {
    if (!message.metrics?.length) return null;
    
    return (
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
        {message.metrics.map((metric, index) => (
          <div 
            key={index}
            className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded"
          >
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <div>
              <div className="font-medium text-sm">
                {metric.value}
                {metric.unit && <span className="text-gray-600 dark:text-gray-400 ml-1">{metric.unit}</span>}
              </div>
              {metric.changePercentage && (
                <div className={`text-xs ${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {metric.changePercentage > 0 ? '+' : ''}{metric.changePercentage}% from {metric.previousValue}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div 
      className={`flex items-start space-x-3 p-4 rounded-lg animate-fade-in-up ${
        isAI ? 'bg-white dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/30'
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isAI ? 'bg-purple-100 dark:bg-purple-900' : 'bg-blue-100 dark:bg-blue-900'
      }`}>
        {isAI ? 
          <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" /> : 
          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        }
      </div>
      
      <div className="flex-1">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {isAI ? 'Insightly AI' : 'You'}
          </span>
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit'
            })}
          </span>
          {message.confidence && (
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
              {Math.round(message.confidence * 100)}% confidence
            </span>
          )}
        </div>
        
        <div className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm">
          {message.content}
        </div>

        {renderMetrics()}

        {message.citations?.map((citation, index) => (
          <div key={index}>{renderCitation(citation)}</div>
        ))}

        {message.charts && message.charts.length > 0 && (
          <div className="mt-4 space-y-4">
            {message.charts.map((chart, index) => (
              <ChartContainer key={index} chart={chart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;