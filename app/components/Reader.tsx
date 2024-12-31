/**
 * Reader Component
 * 
 * A versatile text reader component that handles content display and navigation.
 * Supports both paged and scroll modes with position tracking.
 */

import React, { useCallback, useState } from 'react';
import { PagedReader } from './PagedReader';
import { ScrollReader } from './ScrollReader';

interface ReaderProps {
  content: string;
  currentOffset: number;
  onPositionChange: (offset: number) => void;
  isDarkMode: boolean;
  defaultFontSize?: number;
  defaultIsPaged?: boolean;
}

export const Reader: React.FC<ReaderProps> = ({
  content,
  currentOffset,
  onPositionChange,
  isDarkMode,
  defaultFontSize = 16,
  defaultIsPaged = false,
}) => {
  const [fontSize, setFontSize] = useState(defaultFontSize);
  const [isPaged, setIsPaged] = useState(defaultIsPaged);

  const MIN_FONT_SIZE = 12;
  const MAX_FONT_SIZE = 24;

  const adjustFontSize = useCallback((delta: number) => {
    setFontSize(prev => Math.min(Math.max(prev + delta, MIN_FONT_SIZE), MAX_FONT_SIZE));
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Controls Bar - fixed height */}
      <div className="h-12 flex justify-between items-center gap-4 bg-inherit p-2 rounded-lg mb-2">
        <button
          onClick={() => setIsPaged(!isPaged)}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
        >
          {isPaged ? 'Switch to Scroll Mode' : 'Switch to Page Mode'}
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => adjustFontSize(-1)}
            className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={fontSize <= MIN_FONT_SIZE}
          >
            A-
          </button>
          <span className="min-w-[3ch] text-center">{fontSize}</span>
          <button
            onClick={() => adjustFontSize(1)}
            className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={fontSize >= MAX_FONT_SIZE}
          >
            A+
          </button>
        </div>
      </div>

      {/* Reader Content - takes remaining height */}
      <div className="flex-1 min-h-0">
        {isPaged ? (
          <PagedReader
            content={content}
            currentOffset={currentOffset}
            onPositionChange={onPositionChange}
            fontSize={fontSize}
            isDarkMode={isDarkMode}
          />
        ) : (
          <ScrollReader
            content={content}
            currentOffset={currentOffset}
            onPositionChange={onPositionChange}
            fontSize={fontSize}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
};
