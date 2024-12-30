/**
 * Reader Component
 * 
 * A versatile text reader component that supports both paged and scrolling modes.
 * Features include:
 * - Page navigation in paged mode
 * - Smooth scrolling with progress indicator in scroll mode
 * - Customizable font size
 * - Dark mode support
 * - Responsive design
 */

import React, { useRef, useEffect, useState } from 'react';
import { TextContentProps, NavigationProps } from '../types';
import { calculateScrollProgress } from '../lib/reader';

interface ReaderProps extends TextContentProps, NavigationProps {
  displayContent: string;        // The currently visible portion of content
  isPaged: boolean;             // Whether to use paged mode
  onScroll: () => void;         // Callback for scroll events
}

export const Reader: React.FC<ReaderProps> = ({
  content,
  displayContent,
  fontSize,
  isPaged,
  currentPage,
  totalPages,
  onPageChange,
  onScroll,
  isDarkMode,
}) => {
  // Refs for DOM elements
  const contentRef = useRef<HTMLPreElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for scroll progress
  const [scrollProgress, setScrollProgress] = useState(0);

  // Reset scroll position when switching pages in paged mode
  useEffect(() => {
    if (isPaged && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [currentPage, isPaged]);

  /**
   * Handles scroll events in scroll mode
   * Updates the scroll progress and triggers the onScroll callback
   */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isPaged && containerRef.current) {
      setScrollProgress(calculateScrollProgress(containerRef.current));
      onScroll();
    }
  };

  /**
   * Handles wheel events in paged mode
   * Prevents default scrolling and implements page navigation
   */
  const handleWheel = (e: React.WheelEvent) => {
    if (isPaged) {
      e.preventDefault();
      if (e.deltaY > 0 && currentPage < totalPages) {
        onPageChange(currentPage + 1);
      } else if (e.deltaY < 0 && currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-200px)] flex-1">
      <div
        ref={containerRef}
        className={`
          relative bg-white rounded-lg shadow-lg p-8 prose max-w-none
          ${isDarkMode ? 'dark:bg-gray-800 dark:text-white' : ''}
          ${isPaged 
            ? 'h-[calc(100vh-300px)] overflow-hidden' 
            : 'min-h-[calc(100vh-300px)] max-h-[calc(100vh-200px)] overflow-auto'
          }
        `}
        style={{ fontSize: `${fontSize}px` }}
        onWheel={handleWheel}
        onScroll={handleScroll}
      >
        <pre
          ref={contentRef}
          className="whitespace-pre-wrap font-sans leading-relaxed m-0 px-4 text-justify hyphens-auto break-words"
        >
          {displayContent || content}
        </pre>

        {isPaged && (
          <div className={`
            absolute bottom-0 left-0 right-0 flex justify-between items-center p-4 
            ${isDarkMode 
              ? 'bg-gray-800 border-t border-gray-700' 
              : 'bg-white border-t border-gray-200'
            }
          `}>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
              aria-label="Previous page"
            >
              ← Previous
            </button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {!isPaged && (
        <>
          <div className={`
            fixed right-4 top-1/2 -translate-y-1/2 w-2 h-32 rounded-full
            ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}
          `}>
            <div
              className="w-full bg-blue-500 rounded-full transition-all duration-200"
              style={{ height: `${scrollProgress * 100}%` }}
            />
          </div>
          <div className={`
            absolute right-8 top-1/2 -translate-y-1/2 text-sm
            ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
          `}>
            {Math.round(scrollProgress * 100)}%
          </div>
        </>
      )}
    </div>
  );
};
