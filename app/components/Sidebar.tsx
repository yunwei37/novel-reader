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

import React, { useEffect, useState } from 'react';
import { loadFromStorage, saveToStorage } from '../lib/reader';
import { Bookmark } from '../types';

interface SidebarProps {
  currentPosition: number;
  onBookmarkSelect: (position: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Bookmarks
        </h2>
        <button
          onClick={addBookmark}
          className="
            px-3 py-1 rounded-lg shadow-sm transition-colors
            bg-gray-100 dark:bg-gray-700
            hover:bg-gray-200 dark:hover:bg-gray-600
            text-gray-700 dark:text-gray-100
          "
        >
          Add Bookmark
        </button>
      </div>

      {bookmarks.length > 0 ? (
        <div className="space-y-2">
          {bookmarks.map((bookmark, index) => (
            <div
              key={index}
              className="
                relative group block w-full text-left px-4 py-3 rounded
                transition-colors duration-200 border
                bg-white dark:bg-gray-800
                hover:bg-gray-50 dark:hover:bg-gray-700
                text-gray-900 dark:text-gray-100
                border-gray-200 dark:border-gray-700
              "
            >
              <button
                onClick={() => onBookmarkSelect(bookmark.position)}
                className="w-full text-left"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-gray-200">
                    Position {Math.round(bookmark.position)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(bookmark.timestamp).toLocaleString()}
                  </span>
                </div>
              </button>

              <button
                onClick={() => removeBookmark(index)}
                className="
                  absolute right-2 top-1/2 -translate-y-1/2
                  opacity-0 group-hover:opacity-100
                  p-1 rounded-full
                  text-gray-400 dark:text-gray-400
                  hover:bg-gray-100 dark:hover:bg-gray-600
                  hover:text-gray-600 dark:hover:text-gray-200
                  transition-all duration-200
                "
                aria-label="Remove bookmark"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-4 text-gray-500 dark:text-gray-400">
          No bookmarks yet
        </p>
      )}
    </aside>
  );
};
