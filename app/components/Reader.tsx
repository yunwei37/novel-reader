/**
 * Reader Component
 * 
 * A versatile text reader component that handles content display and navigation.
 * Supports both paged and scroll modes with position tracking.
 */

import React, { useState } from 'react';
import { PagedReader } from './PagedReader';
import { ScrollReader } from './ScrollReader';
import { ReaderMenu } from './reader/ReaderMenu';

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
        onFontSizeChange={setFontSize}
        isPaged={isPaged}
        onModeToggle={() => setIsPaged(!isPaged)}
        content={content}
        currentPosition={currentOffset}
        onPositionChange={onPositionChange}
      />
    </div>
  );
};
