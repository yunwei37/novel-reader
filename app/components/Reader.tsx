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
import { TextContentProps } from '../types';
import { calculateScrollProgress, getPageContent, getChunkedContent, calculateLinesPerPage, calculateTotalPages } from '../lib/reader';

interface ReaderProps extends TextContentProps {
  isPaged: boolean;             // Whether to use paged mode
  onPositionChange: (position: number) => void;  // Callback for position changes
}

export const Reader: React.FC<ReaderProps> = ({
  content,
  fontSize,
  isPaged,
  onPositionChange,
  isDarkMode,
}) => {
  // Refs for DOM elements
  const contentRef = useRef<HTMLPreElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for content display and navigation
  const [displayContent, setDisplayContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Constants
  const CHUNK_SIZE = 50000;

  // Update content display based on mode and position
  useEffect(() => {
    if (!content) return;

    if (isPaged) {
      const linesPerPage = calculateLinesPerPage(window.innerHeight, fontSize);
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
  }, [content, currentChunk, isPaged, currentPage, fontSize, onPositionChange]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isPaged && content) {
        const linesPerPage = calculateLinesPerPage(window.innerHeight, fontSize);
        setTotalPages(calculateTotalPages(content, linesPerPage));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isPaged, content, fontSize]);

  // Reset position when switching modes
  useEffect(() => {
    setCurrentPage(1);
    setCurrentChunk(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [isPaged]);

  /**
   * Handles scroll events in scroll mode
   * Updates the scroll progress and current chunk
   */
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

  /**
   * Handles wheel events in paged mode
   * Prevents default scrolling and implements page navigation
   */
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
