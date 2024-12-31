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

  const MIN_FONT_SIZE = 12;
  const MAX_FONT_SIZE = 24;

  const adjustFontSize = useCallback((delta: number) => {
    setFontSize(prev => Math.min(Math.max(prev + delta, MIN_FONT_SIZE), MAX_FONT_SIZE));
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Controls Bar */}
      <div className="min-h-[3rem] flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg mb-2">
        <button
          onClick={() => setIsPaged(!isPaged)}
          className="
            px-3 py-1.5 rounded-lg shadow-sm transition-colors
            bg-gray-100 dark:bg-gray-700
            hover:bg-gray-200 dark:hover:bg-gray-600
            text-gray-700 dark:text-gray-100
            text-sm sm:text-base
            flex-shrink-0
          "
        >
          {isPaged ? 'Switch to Scroll' : 'Switch to Page'}
        </button>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => adjustFontSize(-1)}
            disabled={fontSize <= MIN_FONT_SIZE}
            className="
              px-2 py-1 rounded transition-colors
              bg-gray-100 dark:bg-gray-700
              hover:bg-gray-200 dark:hover:bg-gray-600
              text-gray-700 dark:text-gray-100
              disabled:opacity-50 disabled:cursor-not-allowed
              text-sm sm:text-base
            "
          >
            A-
          </button>
          <span className="min-w-[2.5ch] text-center text-gray-700 dark:text-gray-300 text-sm sm:text-base tabular-nums">
            {fontSize}
          </span>
          <button
            onClick={() => adjustFontSize(1)}
            disabled={fontSize >= MAX_FONT_SIZE}
            className="
              px-2 py-1 rounded transition-colors
              bg-gray-100 dark:bg-gray-700
              hover:bg-gray-200 dark:hover:bg-gray-600
              text-gray-700 dark:text-gray-100
              disabled:opacity-50 disabled:cursor-not-allowed
              text-sm sm:text-base
            "
          >
            A+
          </button>
        </div>
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
    </div>
  );
};
