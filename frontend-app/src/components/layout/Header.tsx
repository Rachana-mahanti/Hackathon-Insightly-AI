import React from 'react';
import { FileText, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface HeaderProps {
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-gradient-to-r from-blue-600/5 to-purple-600/5 backdrop-blur-sm border-b border-gray-200/80 dark:border-gray-800/80">
      <button
        onClick={onHomeClick}
        className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
      >
        <div className="relative">
          <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Insightly AI
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Annual Report Analysis Platform
          </p>
        </div>
      </button>
      
      <div className="flex items-center space-x-6">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>
        
        <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center space-x-2">
          <span className="hidden md:inline">Powered by</span>
          <span>LTIMindtree</span>
        </div>
      </div>
    </header>
  );
};