"use client";

import React, { useState } from "react";
import { Volume2, Play } from "lucide-react";
import { clsx } from "clsx";

interface ListeningExerciseProps {
  options: { id: number; text: string }[];
  selectedOption: string | null;
  onSelect: (val: string) => void;
  disabled?: boolean;
}

export const ListeningExercise: React.FC<ListeningExerciseProps> = ({
  options,
  selectedOption,
  onSelect,
  disabled = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 1500);
  };

  return (
    <div className="w-full max-w-xl mx-auto my-6 space-y-6">
      {/* Audio Wave Player Button */}
      <button
        onClick={playAudio}
        className={clsx(
          "mx-auto p-6 rounded-3xl bg-duo-blue text-white shadow-duo-blue flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer",
          isPlaying && "animate-pulse"
        )}
      >
        <Volume2 className="w-10 h-10" />
        <span className="font-extrabold text-lg uppercase tracking-wider">
          {isPlaying ? "Playing Audio..." : "Tap to Listen"}
        </span>
      </button>

      {/* Option Cards */}
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.text;
          return (
            <button
              key={opt.id}
              disabled={disabled}
              onClick={() => onSelect(opt.text)}
              className={clsx(
                "p-4 rounded-2xl border-2 font-bold text-lg text-left transition-all shadow-sm select-none",
                isSelected
                  ? "bg-sky-50 dark:bg-slate-800 border-duo-blue text-duo-blue shadow-duo-blue"
                  : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-800 dark:text-slate-100 hover:bg-gray-50"
              )}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};
