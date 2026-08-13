"use client";

import React from "react";
import { clsx } from "clsx";

interface FillBlankProps {
  options: { id: number; text: string }[];
  selectedWord: string | null;
  onSelectWord: (word: string) => void;
  disabled?: boolean;
}

export const FillBlank: React.FC<FillBlankProps> = ({
  options,
  selectedWord,
  onSelectWord,
  disabled = false,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto my-6 space-y-6">
      <div className="flex items-center justify-center gap-3">
        {options.map((opt) => {
          const isSelected = selectedWord === opt.text;
          return (
            <button
              key={opt.id}
              disabled={disabled}
              onClick={() => onSelectWord(opt.text)}
              className={clsx(
                "px-6 py-3 rounded-2xl border-2 font-bold text-lg transition-all shadow-duo-gray select-none",
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
