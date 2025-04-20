import React from 'react';
import { motion } from 'framer-motion';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { TrendingUp, AlertTriangle, FileText, BarChart } from 'lucide-react';
import { SuggestedQuestion } from '../../types';

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
}

const questions: SuggestedQuestion[] = [
  {
    id: '1',
    text: 'What is the revenue trend over the past 3 years?',
    category: 'financial',
    icon: 'TrendingUp',
  },
  {
    id: '2',
    text: 'What are the major financial risks?',
    category: 'risks',
    icon: 'AlertTriangle',
  },
  {
    id: '3',
    text: 'Can you summarize the executive summary?',
    category: 'overview',
    icon: 'FileText',
  },
  {
    id: '4',
    text: 'What are the key performance metrics?',
    category: 'metrics',
    icon: 'BarChart',
  },
];

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'TrendingUp':
      return <TrendingUp className="w-4 h-4" />;
    case 'AlertTriangle':
      return <AlertTriangle className="w-4 h-4" />;
    case 'FileText':
      return <FileText className="w-4 h-4" />;
    case 'BarChart':
      return <BarChart className="w-4 h-4" />;
    default:
      return null;
  }
};

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onQuestionClick }) => {
  return (
    <div className="w-full max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Suggested Questions
        </h3>
      </div>

      <ScrollArea.Root className="h-[calc(100vh-280px)] overflow-hidden">
        <ScrollArea.Viewport className="w-full h-full">
          <div className="p-2">
            {questions.map((question, index) => (
              <motion.button
                key={question.id}
                className="w-full p-3 mb-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-start space-x-3"
                onClick={() => onQuestionClick(question.text)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-blue-500 dark:text-blue-400 mt-1">
                  {getIcon(question.icon)}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {question.text}
                </span>
              </motion.button>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 bg-gray-100 dark:bg-gray-700 transition-colors duration-150 ease-out hover:bg-gray-200 dark:hover:bg-gray-600"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-gray-300 dark:bg-gray-500 rounded-lg relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
};

export default SuggestedQuestions;