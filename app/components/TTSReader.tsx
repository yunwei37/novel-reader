import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { ScrollProgress } from './reader/ScrollProgress';
import { TTSConfig } from './reader/TTSConfig';
import { TTSManager } from '../lib/TTSManager';
import { useTranslation } from '../contexts/LanguageContext';

interface TTSReaderProps {
    content: string;
    currentOffset: number;
    onPositionChange: (offset: number) => void;
    fontSize: number;
}

const LINES_PER_CHUNK = 2;
const DEFAULT_RATE = 1;

export const TTSReader: React.FC<TTSReaderProps> = ({
    content,
    currentOffset,
    onPositionChange,
    fontSize,
}) => {
    const { t } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(currentOffset);
    const [rate, setRate] = useState(DEFAULT_RATE);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const ttsManager = useRef(new TTSManager());
    const [error, setError] = useState<string | null>(null);

    // Split content into chunks
    const chunks = useMemo(() => {
        const lines = content.split(/\n+/);
        const result: string[] = [];

        for (let i = 0; i < lines.length; i += LINES_PER_CHUNK) {
            const chunk = lines.slice(i, i + LINES_PER_CHUNK).join('\n');
            if (chunk.trim()) {
                result.push(chunk);
            }
        }
        return result;
    }, [content]);

    // Find current chunk based on position
    const currentChunkIndex = useMemo(() => {
        let totalLength = 0;
        for (let i = 0; i < chunks.length; i++) {
            const chunkLength = chunks[i].length + 1; // Add 1 for newline
            totalLength += chunkLength;
            if (currentPosition < totalLength) {
                console.log('Found chunk index:', {
                    index: i,
                    totalLength,
                    currentPosition,
                    chunkLength
                });
                return i;
            }
        }
        return chunks.length - 1;
    }, [chunks, currentPosition]);

    // Calculate start offset for current chunk
    const getChunkStartOffset = useCallback((index: number) => {
        let offset = 0;
        for (let i = 0; i < index; i++) {
            offset += chunks[i].length;
            // Add 1 for the newline character between chunks
            offset += 1;
        }
        console.log('Calculated offset:', {
            index,
            offset,
            chunkLengths: chunks.slice(0, index).map(c => c.length)
        });
        return offset;
    }, [chunks]);

    const playChunk = useCallback((chunkIndex: number) => {
        if (!selectedVoice || chunkIndex >= chunks.length) {
            setError('No voice selected or invalid chunk');
            return;
        }

        const chunk = chunks[chunkIndex];
        const startOffset = getChunkStartOffset(chunkIndex);

        ttsManager.current.speak(
            chunk,
            selectedVoice,
            rate,
            startOffset,
            {
                onBoundary: (position) => {
                    setCurrentPosition(position);
                    onPositionChange(position);
                },
                onEnd: () => {
                    if (chunkIndex < chunks.length - 1) {
                        playChunk(chunkIndex + 1);
                    } else {
                        setIsPlaying(false);
                    }
                },
                onStart: () => {
                    setError(null);
                    setIsPlaying(true);
                },
                onError: () => {
                    setError('Speech synthesis failed. Please try again.');
                    setIsPlaying(false);
                }
            }
        );
    }, [chunks, selectedVoice, rate, onPositionChange, getChunkStartOffset]);

    const togglePlayback = useCallback(() => {
        if (isPlaying) {
            ttsManager.current.stop();
            setIsPlaying(false);
        } else {
            playChunk(currentChunkIndex);
        }
    }, [isPlaying, currentChunkIndex, playChunk]);

    const goToNextChunk = useCallback(() => {
        if (!isPlaying && currentChunkIndex < chunks.length - 1) {
            const nextIndex = currentChunkIndex + 1;
            const newOffset = getChunkStartOffset(nextIndex);
            console.log('Going to next chunk:', {
                nextIndex,
                newOffset,
                currentChunkIndex,
                currentPosition,
                chunkContent: chunks[nextIndex],
                chunkLength: chunks[nextIndex].length
            });

            // Force the position update
            setCurrentPosition(newOffset);
            onPositionChange(newOffset);
        }
    }, [isPlaying, currentChunkIndex, chunks, getChunkStartOffset, onPositionChange, currentPosition]);

    const goToPreviousChunk = useCallback(() => {
        if (!isPlaying && currentChunkIndex > 0) {
            const prevIndex = currentChunkIndex - 1;
            const newOffset = getChunkStartOffset(prevIndex);
            setCurrentPosition(newOffset);
            onPositionChange(newOffset);
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }, [isPlaying, currentChunkIndex, getChunkStartOffset, onPositionChange]);

    // Voice initialization
    useEffect(() => {
        const handleVoicesChanged = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length && !selectedVoice) {
                setSelectedVoice(voices[0]);
            }
        };

        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
        handleVoicesChanged();

        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        };
    }, [selectedVoice]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Add this effect to sync with parent's currentOffset
    useEffect(() => {
        setCurrentPosition(currentOffset);
    }, [currentOffset]);

    const currentChunk = chunks[currentChunkIndex] || '';
    const progress = (currentPosition / content.length) * 100;
    const chunkProgress = ((currentChunkIndex + 1) / chunks.length) * 100;

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-800">
            {error && (
                <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}
            {/* Progress indicators */}
            <div className="px-4 py-2 border-b dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 flex justify-between items-center">
                    <span>{" " + currentChunkIndex + 1 + " / " + chunks.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="mt-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${chunkProgress}%` }}
                    />
                </div>
            </div>

            {/* Content area with current chunk and configuration panel */}
            <div className="flex-1 overflow-hidden flex">
                {/* Current chunk (highlighted) */}
                <div className="w-1/2 p-6 border-r dark:border-gray-700">
                    <div className="h-full flex items-center justify-center">
                        <div className="max-w-xl w-full">
                            <p
                                className="whitespace-pre-line text-center font-sans leading-relaxed 
                                          text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-gray-700/50 
                                          p-4 rounded-lg"
                                style={{ fontSize: `${fontSize}px` }}
                            >
                                {currentChunk}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Configuration panel */}
                <div className="w-1/2 p-6 overflow-y-auto border-l dark:border-gray-700">
                    <TTSConfig
                        rate={rate}
                        onRateChange={setRate}
                        selectedVoice={selectedVoice}
                        onVoiceChange={setSelectedVoice}
                        voices={window.speechSynthesis.getVoices()}
                    />
                </div>
            </div>

            {/* Playback controls */}
            <div className="p-4 border-t dark:border-gray-700">
                <div className="max-w-xl mx-auto">
                    <div className="flex gap-4 mb-4">
                        <button
                            onClick={goToPreviousChunk}
                            disabled={isPlaying || currentChunkIndex === 0}
                            className="flex-1 py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    text-gray-800 font-semibold transition-colors
                                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                                    dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white
                                    dark:focus:ring-offset-gray-800"
                        >
                            {t('tts.previous')}
                        </button>
                        <button
                            onClick={goToNextChunk}
                            disabled={isPlaying || currentChunkIndex === chunks.length - 1}
                            className="flex-1 py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    text-gray-800 font-semibold transition-colors
                                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                                    dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white
                                    dark:focus:ring-offset-gray-800"
                        >
                            {t('tts.next')}
                        </button>
                    </div>
                    <button
                        onClick={togglePlayback}
                        className="w-full py-4 px-6 rounded-lg bg-blue-500 hover:bg-blue-600 
                               text-white font-semibold text-lg transition-colors
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                               dark:focus:ring-offset-gray-800"
                    >
                        {isPlaying ? t('tts.stop') : t('tts.start')}
                    </button>
                    <div className="mt-4">
                        <ScrollProgress progress={progress.toFixed(2)} />
                    </div>
                </div>
            </div>
        </div>
    );
}; 