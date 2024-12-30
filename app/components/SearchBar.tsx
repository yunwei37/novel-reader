/**
 * SearchBar Component
 * 
 * A search interface component that provides text search functionality
 * and bookmark creation for the novel reader.
 * 
 * Features:
 * - Text search with instant feedback
 * - Bookmark creation
 * - Dark mode support
 */

import React from 'react';
import { SearchProps, CommonComponentProps } from '../types';

interface SearchBarProps extends SearchProps, CommonComponentProps {
  onBookmark: () => void;        // Callback for bookmark creation
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearch,
  onBookmark,
  isDarkMode = false,
  className = '',
}) => {
  /**
   * Handles the form submission
   * Prevents default form behavior and triggers search
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search in text..."
        className={`
          flex-1 px-3 py-2 rounded border transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${isDarkMode 
            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
            : 'bg-white border-gray-300 text-black placeholder-gray-500'
          }
        `}
      />
      <button
        type="submit"
        className="
          px-4 py-2 rounded bg-blue-500 text-white
          hover:bg-blue-600 transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
        aria-label="Search"
      >
        Search
      </button>
      <button
        type="button"
        onClick={onBookmark}
        className="
          px-4 py-2 rounded bg-gray-200 text-gray-700
          hover:bg-gray-300 transition-colors
          dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
          focus:outline-none focus:ring-2 focus:ring-gray-500
        "
        aria-label="Add bookmark"
      >
        Bookmark
      </button>
    </form>
  );
};
