/**
 * Sidebar Component
 * 
 * A navigation sidebar that displays chapters and bookmarks.
 * Allows users to quickly navigate through the novel.
 * 
 * Features:
 * - Chapter list navigation
 * - Bookmark management
 * - Dark mode support
 * - Responsive design
 */

import React from 'react';
import { Chapter, Bookmark } from '../types';

interface SidebarProps {
  chapters: Chapter[];          // List of chapters
  bookmarks: Bookmark[];        // List of bookmarks
  currentChapter: number;       // Currently selected chapter index
  onChapterSelect: (index: number) => void;  // Callback for chapter selection
  onBookmarkSelect: (position: number, chapter: number) => void;  // Callback for bookmark selection
  isDarkMode?: boolean;         // Whether dark mode is enabled
}

export const Sidebar: React.FC<SidebarProps> = ({
  chapters,
  bookmarks,
  currentChapter,
  onChapterSelect,
  onBookmarkSelect,
  isDarkMode = false,
}) => {
  return (
    <aside className="w-full space-y-6">
      {chapters.length > 1 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Chapters</h2>
          <div className="space-y-2">
            {chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => onChapterSelect(index)}
                className={`
                  block w-full text-left px-4 py-2 rounded
                  transition-colors duration-200
                  ${currentChapter === index
                    ? 'bg-blue-500 text-white'
                    : `hover:bg-gray-100 
                       ${isDarkMode 
                         ? 'dark:hover:bg-gray-800 dark:text-gray-200' 
                         : 'text-gray-700'
                       }`
                  }
                `}
              >
                {chapter.title}
              </button>
            ))}
          </div>
        </section>
      )}

      {bookmarks.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Bookmarks</h2>
          <div className="space-y-2">
            {bookmarks.map((bookmark, index) => (
              <button
                key={index}
                onClick={() => onBookmarkSelect(bookmark.position, bookmark.chapter)}
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
                    {chapters[bookmark.chapter]?.title || `Chapter ${bookmark.chapter + 1}`}
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
