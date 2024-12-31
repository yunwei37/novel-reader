/**
 * Reader Component
 * 
 * A versatile text reader component that handles content display and navigation.
 * Supports both paged and scroll modes with position tracking.
 */

import React, { useCallback, useState } from 'react';
import { PagedReader } from './PagedReader';
import { ReaderControls } from './ReaderControls';
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
  const [showControls, setShowControls] = useState(false);

  const MIN_FONT_SIZE = 12;
  const MAX_FONT_SIZE = 24;

  const adjustFontSize = useCallback((delta: number) => {
    setFontSize(prev => Math.min(Math.max(prev + delta, MIN_FONT_SIZE), MAX_FONT_SIZE));
  }, []);

  return (
    <div className="h-full flex flex-col relative">
      {/* Controls Bar */}
      <div className={`
        absolute top-0 left-0 right-12 z-10 m-2
        transform transition-all duration-300 ease-in-out
        ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
      `}>
        <ReaderControls
          isPaged={isPaged}
          onModeToggle={() => setIsPaged(!isPaged)}
          fontSize={fontSize}
          onFontSizeChange={adjustFontSize}
          minFontSize={MIN_FONT_SIZE}
          maxFontSize={MAX_FONT_SIZE}
        />
      </div>

      {/* Toggle Button */}
      <div className="absolute top-2 right-2 z-20">
        <button
          onClick={() => setShowControls(prev => !prev)}
          className={`
            p-2 rounded-lg
            bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
            border border-gray-200 dark:border-gray-700
            text-gray-700 dark:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition-colors shadow-sm
          `}
          aria-label="Toggle controls"
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${showControls ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>

      {/* Reader Content */}
      <div className={`
        flex-1 min-h-0 transition-[padding] duration-300
        ${showControls ? 'pt-16' : ''}
      `}>
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
