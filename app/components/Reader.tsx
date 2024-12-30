/**
 * Reader Component
 * 
 * A versatile text reader component that handles all content display and navigation.
 * Features include:
 * - Page/scroll mode switching
 * - Font size adjustment
 * - Content chunking and display
 * - Page navigation in paged mode
 * - Smooth scrolling with progress indicator in scroll mode
 * - Dark mode support
 * - Responsive design
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TextContentProps } from '../types';
import { calculateScrollProgress, getPageContent, getChunkedContent, calculateLinesPerPage, calculateTotalPages } from '../lib/reader';

interface ReaderProps extends Omit<TextContentProps, 'fontSize'> {
  onPositionChange: (position: number) => void;  // Callback for position changes
  defaultFontSize?: number;     // Initial font size
  defaultIsPaged?: boolean;     // Initial paged mode state
}

export const Reader: React.FC<ReaderProps> = ({
  content,
  onPositionChange,
  isDarkMode,
  defaultFontSize = 16,
  defaultIsPaged = false,
}) => {
  // Refs for DOM elements
  const contentRef = useRef<HTMLPreElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const readerRef = useRef<HTMLDivElement>(null);
  
  // State for content display and navigation
  const [displayContent, setDisplayContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontSize, setFontSize] = useState(defaultFontSize);
  const [isPaged, setIsPaged] = useState(defaultIsPaged);
  const [windowHeight, setWindowHeight] = useState(0);

  // Constants
  const CHUNK_SIZE = 50000;
  const MIN_FONT_SIZE = 12;
  const MAX_FONT_SIZE = 24;
  const HEADER_HEIGHT = 180; // Height of the header area
  const FOOTER_HEIGHT = 100; // Height of the footer area

  // Calculate available height for the reader
  const updateWindowHeight = useCallback(() => {
    if (readerRef.current) {
      const windowHeight = window.innerHeight;
      const availableHeight = windowHeight - HEADER_HEIGHT - FOOTER_HEIGHT;
      setWindowHeight(availableHeight);
    }
  }, []);

  // Initialize window height
  useEffect(() => {
    updateWindowHeight();
    window.addEventListener('resize', updateWindowHeight);
    return () => window.removeEventListener('resize', updateWindowHeight);
  }, [updateWindowHeight]);

  // Update content display based on mode and position
  useEffect(() => {
    if (!content) return;

    if (isPaged) {
      const linesPerPage = calculateLinesPerPage(windowHeight - 100, fontSize);
      setTotalPages(calculateTotalPages(content, linesPerPage));
      const pageContent = getPageContent(content, currentPage, linesPerPage);
      setDisplayContent(pageContent);
      onPositionChange(currentPage);
    } else {
      const chunkContent = getChunkedContent(content, currentChunk, CHUNK_SIZE);
      setDisplayContent(chunkContent);
      if (containerRef.current) {
        onPositionChange(containerRef.current.scrollTop);
      }
    }
  }, [content, currentChunk, isPaged, currentPage, fontSize, windowHeight, onPositionChange]);

  // Reset position when switching modes
  useEffect(() => {
    setCurrentPage(1);
    setCurrentChunk(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [isPaged]);

  const handleScroll = () => {
    if (!isPaged && containerRef.current) {
      const progress = calculateScrollProgress(containerRef.current);
      setScrollProgress(progress);

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const totalChunks = Math.ceil(content.length / CHUNK_SIZE);
      const newChunk = Math.floor((scrollTop / (scrollHeight - clientHeight)) * totalChunks);
      
      if (newChunk !== currentChunk) {
        setCurrentChunk(newChunk);
      }
      onPositionChange(scrollTop);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isPaged) {
      e.preventDefault();
      if (e.deltaY > 0 && currentPage < totalPages) {
        setCurrentPage(prev => prev + 1);
      } else if (e.deltaY < 0 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    }
  };

  const adjustFontSize = (delta: number) => {
    setFontSize(prev => {
      const newSize = prev + delta;
      return Math.min(Math.max(newSize, MIN_FONT_SIZE), MAX_FONT_SIZE);
    });
  };

  return (
    <div 
      ref={readerRef}
      className="relative flex-1"
      style={{ minHeight: `${windowHeight}px` }}
    >
      <div className="sticky top-0 z-10 flex justify-between items-center gap-4 mb-4 p-4 bg-inherit">
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

      <div
        ref={containerRef}
        className={`
          relative bg-white rounded-lg shadow-lg p-8 prose max-w-none
          ${isDarkMode ? 'dark:bg-gray-800 dark:text-white' : ''}
          ${isPaged 
            ? 'overflow-hidden' 
            : 'overflow-auto'
          }
        `}
        style={{ 
          fontSize: `${fontSize}px`,
          height: `${windowHeight - 100}px`, // Adjust for the control bar
        }}
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
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
