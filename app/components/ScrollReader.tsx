import { debounce, throttle } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ScrollProgress } from './reader/ScrollProgress';
import { SHA256 } from 'crypto-js';

interface ScrollReaderProps {
    content: string;
    currentOffset: number;
    onPositionChange: (offset: number) => void;
    fontSize: number;
}

interface ChunkInfo {
    id: string;
    startOffset: number;
    endOffset: number;
    content: string;
}

interface CachedChunks {
    hash: string;
    chunks: ChunkInfo[];
    timestamp: number;
}

const CACHE_KEY = 'reader_chunks_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const getContentHash = (content: string): string => {
    return SHA256(content).toString();
};

const getCachedChunks = (contentHash: string): ChunkInfo[] | null => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const parsedCache: CachedChunks = JSON.parse(cached);
        if (parsedCache.hash !== contentHash) return null;
        if (Date.now() - parsedCache.timestamp > CACHE_DURATION) return null;

        return parsedCache.chunks;
    } catch (error) {
        console.warn('Error reading chunks cache:', error);
        return null;
    }
};

const setCachedChunks = (contentHash: string, chunks: ChunkInfo[]) => {
    try {
        const cacheData: CachedChunks = {
            hash: contentHash,
            chunks,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
        console.warn('Error saving chunks cache:', error);
    }
};

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
    const SCROLL_COOLDOWN = 2000;
    const CHUNK_SIZE = 1000; // Characters per chunk

    // Create chunks from content
    const chunks = useMemo((): ChunkInfo[] => {
        if (!content) return [];
        
        const contentHash = getContentHash(content);
        const cachedChunks = getCachedChunks(contentHash);
        if (cachedChunks) return cachedChunks;
        
        const newChunks: ChunkInfo[] = [];
        let currentPosition = 0;
        
        while (currentPosition < content.length) {
            let endPosition = currentPosition + CHUNK_SIZE;
            if (endPosition < content.length) {
                while (endPosition < content.length && 
                       content[endPosition] !== '\n' && 
                       content[endPosition] !== '.') {
                    endPosition++;
                }
                endPosition++;
            } else {
                endPosition = content.length;
            }

            newChunks.push({
                id: `chunk-${currentPosition}`,
                startOffset: currentPosition,
                endOffset: endPosition,
                content: content.slice(currentPosition, endPosition)
            });

            currentPosition = endPosition;
        }
        
        // Cache the new chunks
        setCachedChunks(contentHash, newChunks);
        return newChunks;
    }, [content]);

    // Find the active chunk based on currentOffset
    const activeChunkId = useMemo(() => {
        const activeChunk = chunks.find(chunk => 
            currentOffset >= chunk.startOffset && 
            currentOffset <= chunk.endOffset
        );
        return activeChunk?.id;
    }, [chunks, currentOffset]);

    // Scroll to chunk if needed
    useEffect(() => {
        if (!containerRef.current || !activeChunkId) return;
        
        const element = document.getElementById(activeChunkId);
        if (element && !isUserScrolling.current) {
            const timeSinceLastScroll = Date.now() - lastUserScrollTime.current;
            if (timeSinceLastScroll >= SCROLL_COOLDOWN) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [activeChunkId, SCROLL_COOLDOWN]);

    // Modified scroll handler to work with chunks
    const handleScrollThrottled = useMemo(
        () => throttle(() => {
            if (!containerRef.current || !chunks.length) return;

            // Find the most visible chunk
            const container = containerRef.current;
            const containerTop = container.scrollTop;
            const containerBottom = containerTop + container.clientHeight;

            let mostVisibleChunk: ChunkInfo | null = null;
            let maxVisibleHeight = 0;

            chunks.forEach(chunk => {
                const element = document.getElementById(chunk.id);
                if (!element) return;

                const rect = element.getBoundingClientRect();
                const elementTop = element.offsetTop;
                const elementBottom = elementTop + rect.height;

                // Calculate visible height of this chunk
                const visibleTop = Math.max(containerTop, elementTop);
                const visibleBottom = Math.min(containerBottom, elementBottom);
                const visibleHeight = Math.max(0, visibleBottom - visibleTop);

                if (visibleHeight > maxVisibleHeight) {
                    maxVisibleHeight = visibleHeight;
                    mostVisibleChunk = chunk;
                }
            });

            if (mostVisibleChunk) {
                const mostVisibleChunkNotNull = mostVisibleChunk as ChunkInfo;
                const newOffset = mostVisibleChunkNotNull.startOffset;
                if (Math.abs(newOffset - currentOffset) > 100) {
                    lastUserScrollTime.current = Date.now();
                    lastKnownOffset.current = newOffset;
                    onPositionChange(newOffset);
                }
            }
        }, 250, { leading: true, trailing: true }),
        [chunks, currentOffset, onPositionChange]
    );

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;
        isUserScrolling.current = true;
        handleScrollThrottled();
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
                    {chunks.map(chunk => (
                        <p
                            key={chunk.id}
                            id={chunk.id}
                            className="whitespace-pre-wrap font-sans leading-relaxed m-0 text-justify hyphens-auto break-words"
                            style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
                        >
                            {chunk.content}
                        </p>
                    ))}
                </div>
            </div>
            <ScrollProgress progress={((currentOffset / contentLength) * 100).toFixed(2)} />
        </div>
    );
};
