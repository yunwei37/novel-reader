import React, { useState } from 'react';

interface ProgressSliderProps {
    progress: number;
    onProgressChange: (progress: number) => void;
}

export const ProgressSlider: React.FC<ProgressSliderProps> = ({
    progress,
    onProgressChange,
}) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleSliderChange = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const position = (x - rect.left) / rect.width;
        const newProgress = Math.max(0, Math.min(1, position));
        onProgressChange(newProgress);
    };

    const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        setIsDragging(true);
        handleSliderChange(e);
    };

    const handleDragMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (isDragging) {
            handleSliderChange(e);
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const progressPercent = Math.round(progress * 100);

    return (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Beginning</span>
                    <span>{progressPercent}%</span>
                    <span>End</span>
                </div>
                <div
                    className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer touch-none"
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                >
                    {/* Progress bar */}
                    <div
                        className="absolute h-full bg-blue-500 rounded-full transition-all duration-100"
                        style={{ width: `${progressPercent}%` }}
                    />
                    {/* Handle */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-md -ml-2 
              hover:scale-110 hover:bg-blue-600 active:scale-95
              transition-all duration-200"
                        style={{ left: `${progressPercent}%` }}
                    />
                </div>
            </div>
        </div>
    );
}; 