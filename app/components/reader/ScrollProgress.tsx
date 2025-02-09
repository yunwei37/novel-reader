import React from 'react';

interface ScrollProgressProps {
    progress: string;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({ progress }) => {
    return (
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
    );
}; 