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
        <div className="h-full relative">
            <div
                ref={containerRef}
                className="
                    h-full rounded-lg overflow-y-auto
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

            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="w-2 h-32 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                        className="w-full rounded-full transition-all duration-200 bg-gray-400 dark:bg-gray-500"
                        style={{ height: `${(currentOffset / content.length) * 100}%` }}
                    />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {Math.round((currentOffset / content.length) * 100)}%
                </span>
            </div>
        </div>
    );
}; 