/**
 * Header Component
 * 
 * The main header component for the novel reader application.
 * Contains the title, dark mode toggle, and font size controls.
 * 
 * Features:
 * - Dark mode toggle
 * - Font size adjustment
 * - Responsive design with mobile menu button
 */

import React from 'react';
import { DarkModeProps } from '../types';

interface HeaderProps extends DarkModeProps {
  fontSize: number;              // Current font size
  onFontSizeChange: (size: number) => void;  // Callback for font size changes
  onMenuClick?: () => void;     // Callback for mobile menu button
  isMobile?: boolean;           // Whether we're in mobile view
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  fontSize,
  onDarkModeToggle,
  onFontSizeChange,
  onMenuClick,
  isMobile = false,
  className = '',
}) => {
  return (
    <header className={`flex justify-between items-center flex-wrap gap-4 ${className}`}>
      <div className="flex items-center gap-4">
        {isMobile && (
          <button
            onClick={onMenuClick}
            className="
              p-2 rounded-lg
              transition-colors duration-200
              focus:outline-none focus:ring-2
              bg-gray-200 hover:bg-gray-300
              dark:bg-gray-700 dark:hover:bg-gray-600
              dark:text-gray-200
            "
            aria-label="Toggle menu"
          >
            ☰
          </button>
        )}
        <h1 className="text-2xl font-bold">Novel Reader</h1>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={onDarkModeToggle}
          className="
            px-4 py-2 rounded-lg
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2
            dark:focus:ring-offset-gray-800
            bg-blue-500 hover:bg-blue-600 text-white
          "
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? '🌞 Light' : '🌙 Dark'}
        </button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onFontSizeChange(Math.max(12, fontSize - 2))}
            className="
              px-3 py-1 rounded
              transition-colors duration-200
              focus:outline-none focus:ring-2
              bg-gray-200 hover:bg-gray-300
              dark:bg-gray-700 dark:hover:bg-gray-600
              dark:text-gray-200
            "
            aria-label="Decrease font size"
          >
            A-
          </button>
          <span className="text-sm font-medium min-w-[2rem] text-center">
            {fontSize}
          </span>
          <button
            onClick={() => onFontSizeChange(Math.min(24, fontSize + 2))}
            className="
              px-3 py-1 rounded
              transition-colors duration-200
              focus:outline-none focus:ring-2
              bg-gray-200 hover:bg-gray-300
              dark:bg-gray-700 dark:hover:bg-gray-600
              dark:text-gray-200
            "
            aria-label="Increase font size"
          >
            A+
          </button>
        </div>
      </div>
    </header>
  );
};
