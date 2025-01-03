import { debounce, throttle } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

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
    const contentLength = useMemo(() => content?.length || 0, [content]);

    // Memoize progress calculation
    const progress = useMemo(() => {
        if (!contentLength) return "0.00";
        return ((currentOffset / contentLength) * 100).toFixed(2);
    }, [currentOffset, contentLength]);

    // Throttle scroll event handling to reduce calculations
    const handleScroll = useCallback(
        throttle(() => {
            if (!containerRef.current || !contentLength) return;

            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            const progress = scrollTop / (scrollHeight - clientHeight);
            const newOffset = Math.round(progress * contentLength);

            if (Math.abs(newOffset - currentOffset) > 50) {
                onPositionChange(newOffset);
            }
        }, 100, { leading: true, trailing: true }),
        [contentLength, currentOffset, onPositionChange]
    );

    // Debounce scroll position updates
    const updateScrollPosition = useCallback(
        debounce(() => {
            if (!containerRef.current || !contentLength) return;

            const { scrollHeight, clientHeight } = containerRef.current;
            const progress = currentOffset / contentLength;
            const targetScroll = Math.round(progress * (scrollHeight - clientHeight));

            if (Math.abs(containerRef.current.scrollTop - targetScroll) > 10) {
                containerRef.current.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });
            }
        }, 100),
        [currentOffset, contentLength]
    );

    useEffect(() => {
        updateScrollPosition();
        return () => {
            updateScrollPosition.cancel();
            handleScroll.cancel();
        };
    }, [currentOffset, content, updateScrollPosition, handleScroll]);

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
                <div className="p-4 sm:p-6">
                    <pre
                        className="whitespace-pre-wrap font-sans leading-relaxed m-0 text-justify hyphens-auto break-words"
                        style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
                    >
                        {content}
                    </pre>
                </div>
            </div>

            <div className="
                min-h-[2.5rem] px-2 sm:px-4 py-2
                bg-white dark:bg-gray-800
                border-t border-gray-200 dark:border-gray-700
                shadow-sm dark:shadow-gray-900/20
                rounded-b-md
                flex flex-wrap items-center justify-between gap-2
            ">
                <div className="flex items-center gap-2 sm:gap-3 order-1">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Progress
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-200 tabular-nums">
                            {progress}%
                        </span>
                    </div>
                </div>

                <div className="flex-1 min-w-[100px] max-w-[12rem] h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden order-3 sm:order-2">
                    <div
                        className="h-full rounded-full transition-all duration-200 bg-gray-400 dark:bg-gray-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
