/**
 * Reader Component
 * 
 * A versatile text reader component that handles content display and navigation.
 * Supports both paged and scroll modes with position tracking.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TextContentProps, TextPosition } from '../types';
import {
  calculateLinesPerPage,
  calculateTotalPages,
  getPageContent,
  offsetToPage,
  pageToOffset,
  getTextPosition
} from '../lib/reader';

interface ReaderProps extends TextContentProps {
  currentOffset: number;                    // Current character offset in the text
  onPositionChange: (offset: number) => void; // Callback for position changes
  defaultFontSize?: number;                 // Initial font size
  defaultIsPaged?: boolean;                 // Initial paged mode state
}

export const Reader: React.FC<ReaderProps> = ({
  content,
  currentOffset,
  onPositionChange,
  isDarkMode,
  defaultFontSize = 16,
  defaultIsPaged = false,
}) => {
  // Refs for DOM elements
  const contentRef = useRef<HTMLPreElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const readerRef = useRef<HTMLDivElement>(null);
  
  // State for display settings
  const [fontSize, setFontSize] = useState(defaultFontSize);
  const [isPaged, setIsPaged] = useState(defaultIsPaged);
  const [windowHeight, setWindowHeight] = useState(0);

  // State for content display
  const [displayContent, setDisplayContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Constants
  const MIN_FONT_SIZE = 12;
  const MAX_FONT_SIZE = 24;
  const HEADER_HEIGHT = 180;
  const FOOTER_HEIGHT = 100;

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

  // Handle scroll in non-paged mode
  const handleScroll = useCallback(() => {
    if (!isPaged && containerRef.current && content) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const progress = scrollTop / (scrollHeight - clientHeight);
      setScrollProgress(progress);

      // Calculate offset based on scroll position
      const newOffset = Math.round(progress * content.length);
      if (Math.abs(newOffset - currentOffset) > 50) {
        onPositionChange(newOffset);
      }
    }
  }, [isPaged, content, currentOffset, onPositionChange]);

  // Update scroll position when offset changes in scroll mode
  useEffect(() => {
    if (!isPaged && containerRef.current && content) {
      const { scrollHeight, clientHeight } = containerRef.current;
      const progress = currentOffset / content.length;
      const targetScroll = progress * (scrollHeight - clientHeight);
      
      if (Math.abs(containerRef.current.scrollTop - targetScroll) > 10) {
        containerRef.current.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }
    }
  }, [currentOffset, isPaged, content]);

  // Update page when offset changes in paged mode
  useEffect(() => {
    if (isPaged && content) {
      const linesPerPage = calculateLinesPerPage(windowHeight - 100, fontSize);
      const newPage = offsetToPage(currentOffset, content, linesPerPage);
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      }
    }
  }, [currentOffset, isPaged, content, windowHeight, fontSize, currentPage]);

  // Update content display based on mode
  useEffect(() => {
    if (!content) return;

    const linesPerPage = calculateLinesPerPage(windowHeight - 100, fontSize);
    const totalPages = calculateTotalPages(content, linesPerPage);
    setTotalPages(totalPages);

    if (isPaged) {
      const pageContent = getPageContent(content, currentPage, linesPerPage);
      setDisplayContent(pageContent);
    } else {
      setDisplayContent(content);
    }
  }, [content, currentOffset, isPaged, currentPage, fontSize, windowHeight]);

  // Handle wheel events in paged mode
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (isPaged && content) {
      e.preventDefault();
      const linesPerPage = calculateLinesPerPage(windowHeight - 100, fontSize);
      
      if (e.deltaY > 0 && currentPage < totalPages) {
        const newOffset = pageToOffset(currentPage + 1, content, linesPerPage);
        onPositionChange(newOffset);
      } else if (e.deltaY < 0 && currentPage > 1) {
        const newOffset = pageToOffset(currentPage - 1, content, linesPerPage);
        onPositionChange(newOffset);
      }
    }
  }, [isPaged, content, currentPage, totalPages, windowHeight, fontSize, onPositionChange]);

  // Handle font size changes
  const adjustFontSize = useCallback((delta: number) => {
    setFontSize(prev => {
      const newSize = Math.min(Math.max(prev + delta, MIN_FONT_SIZE), MAX_FONT_SIZE);
      return newSize;
    });
  }, []);

  // Handle mode switching
  const togglePageMode = useCallback(() => {
    setIsPaged(prev => !prev);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  return (
    <div 
      ref={readerRef}
      className="relative flex-1"
      style={{ minHeight: `${windowHeight}px` }}
    >
      <div className="sticky top-0 z-10 flex justify-between items-center gap-4 mb-4 p-4 bg-inherit">
        <button
          onClick={togglePageMode}
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
          ${isPaged ? 'overflow-hidden' : 'overflow-auto'}
        `}
        style={{ 
          fontSize: `${fontSize}px`,
          height: `${windowHeight - 100}px`,
        }}
        onWheel={handleWheel}
        onScroll={handleScroll}
      >
        <pre
          ref={contentRef}
          className="whitespace-pre-wrap font-sans leading-relaxed m-0 px-4 text-justify hyphens-auto break-words"
        >
          {displayContent}
        </pre>

        {isPaged && (
          <div className={`
            absolute bottom-0 left-0 right-0 flex justify-between items-center p-4 
            ${isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'}
          `}>
            <button
              onClick={() => {
                if (currentPage > 1) {
                  const linesPerPage = calculateLinesPerPage(windowHeight - 100, fontSize);
                  const newOffset = pageToOffset(currentPage - 1, content, linesPerPage);
                  onPositionChange(newOffset);
                }
              }}
              disabled={currentPage <= 1}
              className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              ← Previous
            </button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => {
                if (currentPage < totalPages) {
                  const linesPerPage = calculateLinesPerPage(windowHeight - 100, fontSize);
                  const newOffset = pageToOffset(currentPage + 1, content, linesPerPage);
                  onPositionChange(newOffset);
                }
              }}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
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
