/**
 * Reader Component
 * 
 * A versatile text reader component that handles content display and navigation.
 * Supports both paged and scroll modes with position tracking.
 */

import React, { useEffect, useState } from 'react';
import { detectChapters, loadFromStorage, saveToStorage } from '../lib/reader';
import { Bookmark, Chapter } from '../types';
import { PagedReader } from './PagedReader';
import { ReaderMenu } from './ReaderMenu';
import { ScrollReader } from './ScrollReader';

interface ReaderProps {
  content: string;
  currentOffset: number;
  onPositionChange: (offset: number) => void;
  defaultFontSize?: number;
  defaultIsPaged?: boolean;
}

export const Reader: React.FC<ReaderProps> = ({
  content,
  currentOffset,
  onPositionChange,
  defaultFontSize = 16,
  defaultIsPaged = false,
}) => {
  const [fontSize, setFontSize] = useState(defaultFontSize);
  const [isPaged, setIsPaged] = useState(defaultIsPaged);
  const [showMenu, setShowMenu] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const MIN_FONT_SIZE = 12;
  const MAX_FONT_SIZE = 24;

  // Detect chapters when content changes
  useEffect(() => {
    if (content) {
      setChapters(detectChapters(content));
    }
  }, [content]);

  // Load bookmarks from storage
  useEffect(() => {
    const savedBookmarks = loadFromStorage<Bookmark[]>('bookmarks', []);
    setBookmarks(savedBookmarks);
  }, []);

  // Save bookmarks to storage
  useEffect(() => {
    saveToStorage('bookmarks', bookmarks);
  }, [bookmarks]);

  const handleBookmarkAdd = () => {
    const newBookmark: Bookmark = {
      offset: currentOffset,
      timestamp: Date.now()
    };
    setBookmarks(prev => [...prev, newBookmark]);
  };

  const handleBookmarkRemove = (index: number) => {
    setBookmarks(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Menu Button */}
      <div className="sticky top-0 z-20">
        <button
          onClick={() => setShowMenu(true)}
          className="absolute top-2 right-2 p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm
            hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Reader Content */}
      <div className="flex-1 min-h-0">
        {isPaged ? (
          <PagedReader
            content={content}
            currentOffset={currentOffset}
            onPositionChange={onPositionChange}
            fontSize={fontSize}
          />
        ) : (
          <ScrollReader
            content={content}
            currentOffset={currentOffset}
            onPositionChange={onPositionChange}
            fontSize={fontSize}
          />
        )}
      </div>

      {/* Menu */}
      <ReaderMenu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        fontSize={fontSize}
        onFontSizeChange={(size) => setFontSize(size)}
        isPaged={isPaged}
        onModeToggle={() => setIsPaged(!isPaged)}
        currentPosition={currentOffset}
        bookmarks={bookmarks}
        onBookmarkAdd={handleBookmarkAdd}
        onBookmarkRemove={handleBookmarkRemove}
        onBookmarkSelect={onPositionChange}
        chapters={chapters}
        onChapterSelect={onPositionChange}
      />
    </div>
  );
};
