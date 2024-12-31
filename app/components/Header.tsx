/**
 * Header Component
 * 
 * The main header component for the novel reader.
 * Contains dark mode toggle and mobile menu button.
 */

import React from 'react';

interface HeaderProps {
  onDarkModeToggle: () => void;
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onDarkModeToggle,
  onMenuClick,
  isSidebarOpen,
}) => {
  return (
    <header className="flex justify-between items-center rounded-md px-4 text-gray-900 dark:text-gray-100">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="
            p-2 rounded-lg transition-colors
            text-gray-600 dark:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-700
            active:bg-gray-200 dark:active:bg-gray-600
          "
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Novel Reader
        </h1>
      </div>

      <button
        onClick={onDarkModeToggle}
        className="
          p-2 rounded-lg transition-colors
          text-gray-600 dark:text-gray-300
          hover:bg-gray-100 dark:hover:bg-gray-700
          active:bg-gray-200 dark:active:bg-gray-600
        "
        aria-label="Toggle dark mode"
      >
        <span className="text-xl">
          {/* Using emoji that will automatically adapt to system theme */}
          🌤️
        </span>
      </button>
    </header>
  );
};
