import React, { useCallback, useEffect, useRef, useState } from 'react';

interface PagedReaderProps {
    content: string;
    currentOffset: number;
    onPositionChange: (offset: number) => void;
    fontSize: number;
    charsPerPage?: number;
}

export const PagedReader: React.FC<PagedReaderProps> = ({
    content,
    currentOffset,
    onPositionChange,
    fontSize,
    charsPerPage = 500,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pages, setPages] = useState<string[]>([]);
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
    const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

    // Calculate progress with 2 decimal places
    const getProgress = () => {
        if (!content) return "0.00";
        return ((currentPage / totalPages) * 100).toFixed(2);
    };

    // Split content into pages more robustly
    useEffect(() => {
        if (!content) {
            setPages([]);
            return;
        }

        const splitContent: string[] = [];
        let currentChunk = '';
        let charCount = 0;
        const paragraphs = content.split(/\n+/);

        // Try to keep paragraphs together when possible
        for (const paragraph of paragraphs) {
            if (currentChunk && (charCount + paragraph.length > charsPerPage)) {
                splitContent.push(currentChunk.trim());
                currentChunk = '';
                charCount = 0;
            }

            if (paragraph.length > charsPerPage) {
                // If paragraph is too long, split by words
                const words = paragraph.split(/(\s+)/);
                for (const word of words) {
                    if (charCount + word.length > charsPerPage) {
                        splitContent.push(currentChunk.trim());
                        currentChunk = word;
                        charCount = word.length;
                    } else {
                        currentChunk += word;
                        charCount += word.length;
                    }
                }
            } else {
                currentChunk += paragraph + '\n';
                charCount += paragraph.length + 1;
            }
        }

        if (currentChunk) {
            splitContent.push(currentChunk.trim());
        }

        setPages(splitContent);
        setTotalPages(splitContent.length);
    }, [content, charsPerPage]);

    // Update current page based on offset
    useEffect(() => {
        if (!content) return;
        const newPage = Math.floor(currentOffset / charsPerPage) + 1;
        setCurrentPage(Math.min(newPage, totalPages));
    }, [currentOffset, charsPerPage, totalPages, content]);

    // Handle page navigation
    const navigatePage = useCallback((direction: 'next' | 'prev') => {
        if (!content || pages.length === 0) return;

        const targetPage = direction === 'next'
            ? Math.min(currentPage + 1, totalPages)
            : Math.max(currentPage - 1, 1);

        if (targetPage !== currentPage) {
            const newOffset = (targetPage - 1) * charsPerPage;
            onPositionChange(newOffset);

            // Reset scroll position when changing pages
            if (containerRef.current) {
                containerRef.current.scrollTop = 0;
            }
        }
    }, [content, currentPage, totalPages, charsPerPage, onPositionChange, pages.length]);

    // Handle touch events for swipe navigation
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const deltaX = touchStart.x - touchEnd.x;
        const deltaY = touchStart.y - touchEnd.y;

        // Only handle horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                navigatePage('next');
            } else {
                navigatePage('prev');
            }
        }

        setTouchStart(null);
        setTouchEnd(null);
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    navigatePage('next');
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    navigatePage('prev');
                    break;
                case 'Home':
                    e.preventDefault();
                    onPositionChange(0);
                    break;
                case 'End':
                    e.preventDefault();
                    onPositionChange((totalPages - 1) * charsPerPage);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigatePage, onPositionChange, totalPages, charsPerPage]);

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
                    bg-white dark:bg-gray-900 
                    text-gray-900 dark:text-gray-100
                    shadow-sm dark:shadow-gray-950/50
                    scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 
                    dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500 
                    scrollbar-track-transparent
                "
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="p-4 sm:p-6">
                    <pre
                        className="whitespace-pre-wrap font-sans leading-relaxed m-0 text-justify hyphens-auto break-words"
                        style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
                    >
                        {pages[currentPage - 1] || ''}
                    </pre>
                </div>
            </div>

            <div className="
                min-h-[2.5rem] px-2 sm:px-4 py-2
                bg-white dark:bg-gray-900 
                text-gray-900 dark:text-gray-100
                border-t border-gray-200 dark:border-gray-800
                shadow-sm dark:shadow-gray-950/50
                rounded-b-md
                flex items-stretch gap-2
            ">
                <button
                    onClick={() => navigatePage('prev')}
                    disabled={currentPage <= 1}
                    className="
                        flex-1 rounded-md transition-all duration-200
                        flex items-center justify-center
                        text-gray-700 dark:text-gray-300 
                        hover:bg-gray-100 hover:text-gray-900
                        dark:hover:bg-gray-800 dark:hover:text-gray-100
                        disabled:bg-transparent
                        disabled:text-gray-300 dark:disabled:text-gray-700
                        disabled:hover:bg-transparent
                        disabled:cursor-not-allowed
                    "
                    aria-label="Previous page"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex items-center gap-2 sm:gap-3 justify-center min-w-[150px] px-2">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Page
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                            {currentPage}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-600">
                            /
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-600">
                            {totalPages}
                        </span>
                    </div>

                    <div className="hidden sm:block h-4 w-px bg-gray-200 dark:bg-gray-700" />

                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 tabular-nums">
                        {getProgress()}%
                    </span>
                </div>

                <button
                    onClick={() => navigatePage('next')}
                    disabled={currentPage >= totalPages}
                    className="
                        flex-1 rounded-md transition-all duration-200
                        flex items-center justify-center
                        text-gray-700 dark:text-gray-300 
                        hover:bg-gray-100 hover:text-gray-900
                        dark:hover:bg-gray-800 dark:hover:text-gray-100
                        disabled:bg-transparent
                        disabled:text-gray-300 dark:disabled:text-gray-700
                        disabled:hover:bg-transparent
                        disabled:cursor-not-allowed
                    "
                    aria-label="Next page"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
