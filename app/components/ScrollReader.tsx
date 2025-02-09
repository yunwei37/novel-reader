import { debounce, throttle } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ScrollProgress } from './reader/ScrollProgress';
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
    const isUserScrolling = useRef(false);
    const lastUserScrollTime = useRef(0);
    const lastKnownOffset = useRef(currentOffset);
    const SCROLL_COOLDOWN = 2000; // 2 seconds cooldown after user scrolling

    // Memoize progress calculation
    const progress = useMemo(() => {
        if (!contentLength) return "0.00";
        return ((currentOffset / contentLength) * 100).toFixed(2);
    }, [currentOffset, contentLength]);

    const handleScrollThrottled = useMemo(
        () => throttle((scrollTop: number, scrollHeight: number, clientHeight: number) => {
            if (!contentLength) return;
            const progress = scrollTop / (scrollHeight - clientHeight);
            const newOffset = Math.round(progress * contentLength);
            if (Math.abs(newOffset - currentOffset) > 100) {
                lastUserScrollTime.current = Date.now();
                lastKnownOffset.current = newOffset;
                onPositionChange(newOffset);
            }
        }, 250, { leading: true, trailing: true }),
        [contentLength, currentOffset, onPositionChange]
    );

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;
        isUserScrolling.current = true;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        handleScrollThrottled(scrollTop, scrollHeight, clientHeight);
    }, [handleScrollThrottled]);

    const updateScrollPositionDebounced = useMemo(
        () => debounce((container: HTMLDivElement, force: boolean = false) => {
            if (!contentLength) return;
            if (!force && isUserScrolling.current) return;

            // Don't auto-adjust if user has scrolled recently and it's not a forced update
            const timeSinceLastScroll = Date.now() - lastUserScrollTime.current;
            if (!force && timeSinceLastScroll < SCROLL_COOLDOWN) return;

            const { scrollHeight, clientHeight } = container;
            const progress = currentOffset / contentLength;
            const targetScroll = Math.round(progress * (scrollHeight - clientHeight));

            // Only adjust if forced or the difference is significant
            const viewportHeight = clientHeight * 2;
            if (force || Math.abs(container.scrollTop - targetScroll) > viewportHeight) {
                container.scrollTo({
                    top: targetScroll,
                    behavior: force ? 'auto' : 'smooth'
                });
            }
        }, 250),
        [currentOffset, contentLength, SCROLL_COOLDOWN]
    );

    const updateScrollPosition = useCallback((force: boolean = false) => {
        if (!containerRef.current) return;
        updateScrollPositionDebounced(containerRef.current, force);
    }, [updateScrollPositionDebounced]);

    // Handle scroll start and end
    const handleScrollStart = useCallback(() => {
        isUserScrolling.current = true;
    }, []);

    const handleScrollEndDebounced = useMemo(
        () => debounce(() => {
            isUserScrolling.current = false;
        }, 1000), // Increased debounce time to 1 second
        []
    );

    const handleScrollEnd = useCallback(() => {
        handleScrollEndDebounced();
    }, [handleScrollEndDebounced]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('touchstart', handleScrollStart);
            container.addEventListener('mousedown', handleScrollStart);
            container.addEventListener('touchend', handleScrollEnd);
            container.addEventListener('mouseup', handleScrollEnd);
        }

        return () => {
            if (container) {
                container.removeEventListener('touchstart', handleScrollStart);
                container.removeEventListener('mousedown', handleScrollStart);
                container.removeEventListener('touchend', handleScrollEnd);
                container.removeEventListener('mouseup', handleScrollEnd);
            }
            handleScrollThrottled.cancel();
            updateScrollPositionDebounced.cancel();
            handleScrollEndDebounced.cancel();
        };
    }, [handleScrollStart, handleScrollEnd, handleScrollThrottled, updateScrollPositionDebounced, handleScrollEndDebounced]);

    // Add effect to handle external currentOffset changes
    useEffect(() => {
        // If the offset changed from outside (not by user scrolling)
        if (currentOffset !== lastKnownOffset.current) {
            lastKnownOffset.current = currentOffset;
            updateScrollPosition(true); // Force update
        } else {
            // Normal scroll position sync
            const timeSinceLastScroll = Date.now() - lastUserScrollTime.current;
            if (timeSinceLastScroll >= SCROLL_COOLDOWN) {
                updateScrollPosition(false);
            }
        }
    }, [currentOffset, updateScrollPosition, SCROLL_COOLDOWN]);

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
            <ScrollProgress progress={progress} />

        </div>
    );
};
