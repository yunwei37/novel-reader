/**
 * Header Component
 * 
 * The main header component for the novel reader.
 * Contains dark mode toggle and mobile menu button.
 */

import React from 'react';

interface HeaderProps {
  onSettingsClick?: () => void;
  onBackClick?: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({
  onSettingsClick,
  onBackClick,
  title,
}) => {
  return (
    <header className="flex justify-between items-center h-14 px-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="
              p-2 rounded-lg transition-colors
              text-gray-600 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-700
            "
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        )}
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {onSettingsClick && (
          <button
            onClick={onSettingsClick}
            className="
              p-2 rounded-lg transition-colors
              text-gray-600 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-700
            "
            aria-label="Settings"
          >
            <span className="text-xl">⚙️</span>
          </button>
        )}
      </div>
    </header>
  );
};
