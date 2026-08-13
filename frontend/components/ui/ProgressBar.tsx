import React from "react";
import { clsx } from "clsx";

interface ProgressBarProps {
  progress?: number; // 0 to 100
  value?: number;
  max?: number;
  color?: "green" | "blue" | "orange" | "yellow";
  colorHex?: string;
  height?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  value = 45,
  max = 100,
  color = "blue",
  colorHex,
  height = "h-3",
  className,
}) => {
  const percentage = progress !== undefined ? progress : Math.round((value / max) * 100);
  const clampedProgress = Math.min(100, Math.max(0, percentage));

  const colorMap = {
    green: "bg-duo-green",
    blue: "bg-duo-blue",
    orange: "bg-duo-orange",
    yellow: "bg-duo-yellow",
  };

  return (
    <div
      className={clsx(
        "w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden border border-gray-300 dark:border-slate-600",
        height,
        className
      )}
    >
      <div
        className={clsx("h-full transition-all duration-500 rounded-full", !colorHex && colorMap[color])}
        style={{
          width: `${clampedProgress}%`,
          backgroundColor: colorHex || undefined,
        }}
      />
    </div>
  );
};
