import React from "react";
import { clsx } from "clsx";

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: "green" | "blue" | "orange" | "yellow";
  height?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = "green",
  height = "h-4",
  className,
}) => {
  const colorMap = {
    green: "bg-duo-green",
    blue: "bg-duo-blue",
    orange: "bg-duo-orange",
    yellow: "bg-duo-yellow",
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={clsx("w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden relative", height, className)}>
      <div
        className={clsx("h-full transition-all duration-500 ease-out rounded-full relative", colorMap[color])}
        style={{ width: `${clampedProgress}%` }}
      >
        {/* Shine highlight */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-white opacity-30 rounded-full" />
      </div>
    </div>
  );
};
