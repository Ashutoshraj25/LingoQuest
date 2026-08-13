"use client";

import React from "react";
import { clsx } from "clsx";

interface WordBankProps {
  availableWords: string[];
  selectedWords: string[];
  onAddWord: (word: string, index: number) => void;
  onRemoveWord: (index: number) => void;
  disabled?: boolean;
}

export const WordBank: React.FC<WordBankProps> = ({
  availableWords,
  selectedWords,
  onAddWord,
  onRemoveWord,
  disabled = false,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto my-6 space-y-8">
      {/* Target Construction Slot Box */}
      <div className="min-h-[90px] p-4 bg-gray-50 dark:bg-slate-900 border-b-2 border-gray-300 dark:border-slate-800 rounded-2xl flex flex-wrap items-center gap-2">
        {selectedWords.length === 0 ? (
          <span className="text-gray-400 text-sm font-semibold italic">Tap words to construct sentence</span>
        ) : (
          selectedWords.map((word, idx) => (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => onRemoveWord(idx)}
              className="px-4 py-2 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 shadow-duo-gray rounded-xl font-bold text-gray-800 dark:text-slate-100 hover:border-duo-red hover:text-duo-red transition-all transform active:scale-95"
            >
              {word}
            </button>
          ))
        )}
      </div>

      {/* Available Word Chips Bank */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {availableWords.map((word, idx) => {
          // Count occurrences in selected vs available
          const timesUsed = selectedWords.filter((w) => w === word).length;
          const isSelected = timesUsed > 0;

          return (
            <button
              key={idx}
              disabled={disabled || isSelected}
              onClick={() => onAddWord(word, idx)}
              className={clsx(
                "px-4 py-2.5 rounded-xl border-2 font-bold transition-all shadow-duo-gray select-none",
                isSelected
                  ? "bg-gray-200 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-transparent opacity-40 shadow-none cursor-default"
                  : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer active:translate-y-1"
              )}
            >
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
};
