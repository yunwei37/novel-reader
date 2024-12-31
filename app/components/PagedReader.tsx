import React, { useCallback, useEffect, useRef, useState } from 'react';

interface PagedReaderProps {
    content: string;
    currentOffset: number;
    onPositionChange: (offset: number) => void;
    fontSize: number;
}

export const PagedReader: React.FC<PagedReaderProps> = ({
    content,
    currentOffset,
    onPositionChange,
    fontSize,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pages, setPages] = useState<string[]>([]);
    const CHARS_PER_PAGE = 500;

    // Split content into pages
    useEffect(() => {
        if (!content) {
            setPages([]);
            return;
        }

        const splitContent: string[] = [];
        let currentChunk = '';
        let charCount = 0;
        const words = content.split(/(\s+)/);

        for (const word of words) {
            if (charCount + word.length > CHARS_PER_PAGE) {
                splitContent.push(currentChunk);
                currentChunk = word;
                charCount = word.length;
            } else {
                currentChunk += word;
                charCount += word.length;
            }
        }

        if (currentChunk) {
            splitContent.push(currentChunk);
        }

        setPages(splitContent);
        setTotalPages(splitContent.length);
    }, [content]);

    // Update current page based on offset
    useEffect(() => {
        if (!content) return;
        const newPage = Math.floor(currentOffset / CHARS_PER_PAGE) + 1;
        setCurrentPage(Math.min(newPage, totalPages));
    }, [currentOffset, CHARS_PER_PAGE, totalPages, content]);

    // Handle page navigation
    const navigatePage = useCallback((direction: 'next' | 'prev') => {
        if (!content || pages.length === 0) return;

        const targetPage = direction === 'next'
            ? Math.min(currentPage + 1, totalPages)
            : Math.max(currentPage - 1, 1);

        const newOffset = (targetPage - 1) * CHARS_PER_PAGE;
        onPositionChange(newOffset);

        // Reset scroll position when changing pages
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    }, [content, currentPage, totalPages, CHARS_PER_PAGE, onPositionChange, pages.length]);

    // Handle wheel events for page navigation
    const handleWheel = useCallback((e: React.WheelEvent) => {
        const isScrolledToBottom = containerRef.current &&
            containerRef.current.scrollHeight - containerRef.current.scrollTop <= containerRef.current.clientHeight + 1;
        const isScrolledToTop = containerRef.current && containerRef.current.scrollTop === 0;

        // Only navigate pages if we're at the top/bottom of the current page content
        if ((e.deltaY > 0 && isScrolledToBottom) || (e.deltaY < 0 && isScrolledToTop)) {
            e.preventDefault();
            navigatePage(e.deltaY > 0 ? 'next' : 'prev');
        }
    }, [navigatePage]);

    return (
        <div className="h-full flex flex-col">
            <div
                ref={containerRef}
                className="
                    flex-1 rounded-t-md overflow-y-auto min-h-0
                    bg-white dark:bg-gray-800 
                    text-gray-900 dark:text-gray-100
                    shadow-sm dark:shadow-gray-900/20
                    scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 
                    dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500 
                    scrollbar-track-transparent
                "
                onWheel={handleWheel}
            >
                <div className="p-6">
                    <pre
                        className="whitespace-pre-wrap font-sans leading-relaxed m-0 text-justify hyphens-auto break-words"
                        style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
                    >
                        {pages[currentPage - 1] || ''}
                    </pre>
                </div>
            </div>

            <div className="
                h-10 px-4 flex items-center justify-between gap-4
                bg-white dark:bg-gray-800 
                text-gray-900 dark:text-gray-100
                border-t border-gray-200 dark:border-gray-700
                shadow-sm dark:shadow-gray-900/20
                rounded-b-md
            ">
                <button
                    onClick={() => navigatePage('prev')}
                    disabled={currentPage <= 1}
                    className="
                        w-7 h-7 rounded-md transition-all duration-200
                        flex items-center justify-center
                        text-gray-600 dark:text-gray-300 
                        hover:bg-gray-100 dark:hover:bg-gray-700
                        disabled:text-gray-300 dark:disabled:text-gray-700
                        disabled:cursor-not-allowed
                    "
                    aria-label="Previous page"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Page
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                            {currentPage}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">/</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                            {totalPages}
                        </span>
                    </div>

                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />

                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {Math.round((currentPage / totalPages) * 100)}%
                    </span>
                </div>

                <button
                    onClick={() => navigatePage('next')}
                    disabled={currentPage >= totalPages}
                    className="
                        w-7 h-7 rounded-md transition-all duration-200
                        flex items-center justify-center
                        text-gray-600 dark:text-gray-300 
                        hover:bg-gray-100 dark:hover:bg-gray-700
                        disabled:text-gray-300 dark:disabled:text-gray-700
                        disabled:cursor-not-allowed
                    "
                    aria-label="Next page"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}; 