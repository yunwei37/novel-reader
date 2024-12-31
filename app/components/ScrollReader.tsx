import React, { useCallback, useEffect, useRef } from 'react';

interface ScrollReaderProps {
    content: string;
    currentOffset: number;
    onPositionChange: (offset: number) => void;
    fontSize: number;
}

export const ScrollReader: React.FC<ScrollReaderProps> = ({
    content,
    currentOffset,
    onPositionChange,
    fontSize,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate progress with 2 decimal places
    const getProgress = () => {
        if (!content) return "0.00";
        return ((currentOffset / content.length) * 100).toFixed(2);
    };

    // Handle scroll events
    const handleScroll = useCallback(() => {
        if (!containerRef.current || !content) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const progress = scrollTop / (scrollHeight - clientHeight);
        const newOffset = Math.round(progress * content.length);

        if (Math.abs(newOffset - currentOffset) > 50) {
            onPositionChange(newOffset);
        }
    }, [content, currentOffset, onPositionChange]);

    // Update scroll position when offset changes externally
    useEffect(() => {
        if (!containerRef.current || !content) return;

        const { scrollHeight, clientHeight } = containerRef.current;
        const progress = currentOffset / content.length;
        const targetScroll = Math.round(progress * (scrollHeight - clientHeight));

        if (Math.abs(containerRef.current.scrollTop - targetScroll) > 10) {
            containerRef.current.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
        }
    }, [currentOffset, content]);

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
                onScroll={handleScroll}
            >
                <div className="p-6">
                    <pre
                        className="whitespace-pre-wrap font-sans leading-relaxed m-0 text-justify hyphens-auto break-words"
                        style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
                    >
                        {content}
                    </pre>
                </div>
            </div>

            <div className="
                h-10 px-4
                bg-white dark:bg-gray-800
                border-t border-gray-200 dark:border-gray-700
                shadow-sm dark:shadow-gray-900/20
                rounded-b-md
                flex items-center justify-between
            ">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Progress
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-200 tabular-nums">
                            {getProgress()}%
                        </span>
                    </div>
                </div>

                <div className="w-48 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-200 bg-gray-400 dark:bg-gray-500"
                        style={{ width: `${(currentOffset / content.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}; 