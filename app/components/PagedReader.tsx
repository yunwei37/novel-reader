import React, { useCallback, useEffect, useRef, useState } from 'react';
import { calculatePageMetrics } from '../lib/reader';

interface PagedReaderProps {
    content: string;
    currentOffset: number;
    onPositionChange: (offset: number) => void;
    fontSize: number;
    isDarkMode: boolean;
}

export const PagedReader: React.FC<PagedReaderProps> = ({
    content,
    currentOffset,
    onPositionChange,
    fontSize,
    isDarkMode,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [displayContent, setDisplayContent] = useState('');
    const CONTENT_PADDING = 32;

    // Calculate content metrics for paging
    const getPageMetrics = useCallback(() => {
        if (!content || !containerRef.current) return null;

        const rect = containerRef.current.getBoundingClientRect();
        const contentHeight = rect.height - (CONTENT_PADDING * 2);
        const contentWidth = rect.width - (CONTENT_PADDING * 2);

        return calculatePageMetrics(contentWidth, contentHeight, fontSize, content);
    }, [content, fontSize]);

    // Get content for current page
    const getCurrentPageContent = useCallback(() => {
        if (!content) return '';

        const metrics = getPageMetrics();
        if (!metrics) return '';

        const startChar = currentOffset;
        const endChar = Math.min(startChar + metrics.charsPerPage, content.length);

        // Find complete word boundaries
        let adjustedStart = startChar;
        while (adjustedStart > 0 && content[adjustedStart - 1] !== ' ' && content[adjustedStart - 1] !== '\n') {
            adjustedStart--;
        }

        let adjustedEnd = endChar;
        while (adjustedEnd < content.length && content[adjustedEnd] !== ' ' && content[adjustedEnd] !== '\n') {
            adjustedEnd++;
        }

        return content.slice(adjustedStart, adjustedEnd);
    }, [content, currentOffset, getPageMetrics]);

    // Update display content and page numbers
    useEffect(() => {
        const newContent = getCurrentPageContent();
        setDisplayContent(newContent);

        const metrics = getPageMetrics();
        if (metrics) {
            setTotalPages(metrics.totalPages);
            setCurrentPage(Math.floor(currentOffset / metrics.charsPerPage) + 1);
        }
    }, [getCurrentPageContent, currentOffset, getPageMetrics]);

    // Handle page navigation
    const navigatePage = useCallback((direction: 'next' | 'prev') => {
        const metrics = getPageMetrics();
        if (!metrics || !content) return;

        const newChar = direction === 'next'
            ? Math.min(currentOffset + metrics.charsPerPage, content.length - 1)
            : Math.max(currentOffset - metrics.charsPerPage, 0);

        onPositionChange(newChar);
    }, [getPageMetrics, content, currentOffset, onPositionChange]);

    // Handle wheel events
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        navigatePage(e.deltaY > 0 ? 'next' : 'prev');
    }, [navigatePage]);

    return (
        <div className="flex-1 flex flex-col min-h-0">
            <div
                ref={containerRef}
                className={`
          flex-1 bg-white rounded-lg shadow-lg overflow-hidden
          ${isDarkMode ? 'dark:bg-gray-800 dark:text-white' : ''}
        `}
                onWheel={handleWheel}
            >
                <div className="h-full p-8">
                    <pre
                        className="whitespace-pre-wrap font-sans leading-relaxed m-0 text-justify hyphens-auto break-words h-full"
                        style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
                    >
                        {displayContent}
                    </pre>
                </div>
            </div>

            <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center p-3">
                    <button
                        onClick={() => navigatePage('prev')}
                        disabled={currentPage <= 1}
                        className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                    >
                        ← Previous
                    </button>
                    <span className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => navigatePage('next')}
                        disabled={currentPage >= totalPages}
                        className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
}; 