/**
 * Sidebar Component
 * 
 * A navigation sidebar that manages bookmarks.
 * Features:
 * - Add/remove bookmarks
 * - Bookmark navigation
 * - Dark mode support
 * - Responsive design
 */

import React, { useState, useEffect } from 'react';
import { Bookmark } from '../types';
import { loadFromStorage, saveToStorage } from '../lib/reader';

interface SidebarProps {
  isDarkMode: boolean;         // Whether dark mode is enabled
  currentPosition: number;     // Current reading position
  onBookmarkSelect: (position: number) => void;  // Callback for bookmark selection
}

export const Sidebar: React.FC<SidebarProps> = ({
  isDarkMode,
  currentPosition,
  onBookmarkSelect,
}) => {
  // State for bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Load bookmarks from storage
  useEffect(() => {
    const savedBookmarks = loadFromStorage<Bookmark[]>('bookmarks', []);
    setBookmarks(savedBookmarks);
  }, []);

  // Save bookmarks to storage
  useEffect(() => {
    saveToStorage('bookmarks', bookmarks);
  }, [bookmarks]);

  const addBookmark = () => {
    const newBookmark: Bookmark = {
      position: currentPosition,
      chapter: 0, // deprecated
      timestamp: Date.now()
    };
    setBookmarks(prev => [...prev, newBookmark]);
  };

  const removeBookmark = (index: number) => {
    setBookmarks(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <aside className="w-full space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Bookmarks</h2>
        <button
          onClick={addBookmark}
          className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
        >
          Add Bookmark
        </button>
      </div>

      {bookmarks.length > 0 ? (
        <div className="space-y-2">
          {bookmarks.map((bookmark, index) => (
            <div
              key={index}
              className={`
                relative group
                block w-full text-left px-4 py-3 rounded
                transition-colors duration-200
                hover:bg-gray-100
                ${isDarkMode 
                  ? 'dark:hover:bg-gray-800 dark:text-gray-200' 
                  : 'text-gray-700'
                }
                border border-gray-200 dark:border-gray-700
              `}
            >
              <button
                onClick={() => onBookmarkSelect(bookmark.position)}
                className="w-full text-left"
              >
                <div className="flex flex-col">
                  <span className="font-medium">
                    Position {Math.round(bookmark.position)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(bookmark.timestamp).toLocaleString()}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => removeBookmark(index)}
                className={`
                  absolute right-2 top-1/2 -translate-y-1/2
                  opacity-0 group-hover:opacity-100
                  p-1 rounded-full
                  hover:bg-red-100 dark:hover:bg-red-900
                  text-red-500 dark:text-red-400
                  transition-opacity duration-200
                `}
                aria-label="Remove bookmark"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No bookmarks yet
        </p>
      )}
    </aside>
  );
};
