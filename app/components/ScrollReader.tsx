import React, { useCallback, useEffect, useRef, useState } from 'react';

interface ScrollReaderProps {
    content: string;
    currentOffset: number;
    onPositionChange: (offset: number) => void;
    fontSize: number;
    isDarkMode: boolean;
}

export const ScrollReader: React.FC<ScrollReaderProps> = ({
    content,
    currentOffset,
    onPositionChange,
    fontSize,
    isDarkMode,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isAutoScrolling, setIsAutoScrolling] = useState(false);

    // Handle scroll events
    const handleScroll = useCallback(() => {
        if (!containerRef.current || !content) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const progress = scrollTop / (scrollHeight - clientHeight);
        setScrollProgress(progress);

        // Calculate offset based on scroll position
        const newOffset = Math.round(progress * content.length);
        if (Math.abs(newOffset - currentOffset) > 50) {
            onPositionChange(newOffset);
        }
    }, [content, currentOffset, onPositionChange]);

    // Update scroll position when offset changes
    useEffect(() => {
        if (!containerRef.current || !content) return;

        const { scrollHeight, clientHeight } = containerRef.current;
        const progress = currentOffset / content.length;
        const targetScroll = progress * (scrollHeight - clientHeight);

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
                className={`
          h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg
          overflow-y-auto
          scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent
        `}
                onScroll={handleScroll}
            >
                <div className="p-8">
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
                        className="w-full bg-blue-500 rounded-full transition-all duration-200"
                        style={{ height: `${scrollProgress * 100}%` }}
                    />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {Math.round(scrollProgress * 100)}%
                </span>
            </div>
        </div>
    );
}; 