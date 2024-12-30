/**
 * Sidebar Component
 * 
 * A navigation sidebar that displays bookmarks.
 * Allows users to quickly navigate through saved positions.
 * 
 * Features:
 * - Bookmark management
 * - Dark mode support
 * - Responsive design
 */

import React from 'react';
import { Bookmark } from '../types';

interface SidebarProps {
  bookmarks: Bookmark[];        // List of bookmarks
  onBookmarkSelect: (position: number) => void;  // Callback for bookmark selection
  isDarkMode?: boolean;         // Whether dark mode is enabled
  isPaged?: boolean;           // Whether the reader is in paged mode
}

export const Sidebar: React.FC<SidebarProps> = ({
  bookmarks,
  onBookmarkSelect,
  isDarkMode = false,
  isPaged = false,
}) => {
  return (
    <aside className="w-full space-y-6">
      {bookmarks.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Bookmarks</h2>
          <div className="space-y-2">
            {bookmarks.map((bookmark, index) => (
              <button
                key={index}
                onClick={() => onBookmarkSelect(bookmark.position)}
                className={`
                  block w-full text-left px-4 py-2 rounded
                  transition-colors duration-200
                  hover:bg-gray-100
                  ${isDarkMode 
                    ? 'dark:hover:bg-gray-800 dark:text-gray-200' 
                    : 'text-gray-700'
                  }
                `}
              >
                <div className="flex flex-col">
                  <span className="font-medium">
                    {isPaged ? `Page ${bookmark.position}` : `Position ${Math.round(bookmark.position)}`}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(bookmark.timestamp).toLocaleString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </aside>
  );
};
