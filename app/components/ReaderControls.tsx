import React from 'react';

interface ReaderControlsProps {
    isPaged: boolean;
    onModeToggle: () => void;
    fontSize: number;
    onFontSizeChange: (delta: number) => void;
    minFontSize: number;
    maxFontSize: number;
}

export const ReaderControls: React.FC<ReaderControlsProps> = ({
    isPaged,
    onModeToggle,
    fontSize,
    onFontSizeChange,
    minFontSize,
    maxFontSize,
}) => {
    return (
        <div className="
            min-h-[3rem] flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg mb-2
            bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
            border border-gray-200 dark:border-gray-700
            shadow-sm
        ">
            <button
                onClick={onModeToggle}
                className="
                    px-3 py-1.5 rounded-lg shadow-sm transition-colors
                    bg-gray-100 dark:bg-gray-700
                    hover:bg-gray-200 dark:hover:bg-gray-600
                    text-gray-700 dark:text-gray-100
                    text-sm sm:text-base
                    flex-shrink-0
                "
            >
                {isPaged ? 'Switch to Scroll' : 'Switch to Page'}
            </button>
            <div className="flex items-center gap-2 flex-shrink-0">
                <button
                    onClick={() => onFontSizeChange(-1)}
                    disabled={fontSize <= minFontSize}
                    className="
                        px-2 py-1 rounded transition-colors
                        bg-gray-100 dark:bg-gray-700
                        hover:bg-gray-200 dark:hover:bg-gray-600
                        text-gray-700 dark:text-gray-100
                        disabled:opacity-50 disabled:cursor-not-allowed
                        text-sm sm:text-base
                    "
                >
                    A-
                </button>
                <span className="min-w-[2.5ch] text-center text-gray-700 dark:text-gray-300 text-sm sm:text-base tabular-nums">
                    {fontSize}
                </span>
                <button
                    onClick={() => onFontSizeChange(1)}
                    disabled={fontSize >= maxFontSize}
                    className="
                        px-2 py-1 rounded transition-colors
                        bg-gray-100 dark:bg-gray-700
                        hover:bg-gray-200 dark:hover:bg-gray-600
                        text-gray-700 dark:text-gray-100
                        disabled:opacity-50 disabled:cursor-not-allowed
                        text-sm sm:text-base
                    "
                >
                    A+
                </button>
            </div>
        </div>
    );
}; 