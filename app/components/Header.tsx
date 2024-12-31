/**
 * Header Component
 * 
 * The main header component for the novel reader.
 * Contains dark mode toggle and mobile menu button.
 */

import React from 'react';

interface HeaderProps {
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onDarkModeToggle,
  onMenuClick,
  isSidebarOpen,
}) => {
  return (
    <header className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? '←' : '→'}
        </button>
        <h1 className="text-2xl font-bold">Novel Reader</h1>
      </div>

      <button
        onClick={onDarkModeToggle}
        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? '🌞' : '🌙'}
      </button>
    </header>
  );
};
