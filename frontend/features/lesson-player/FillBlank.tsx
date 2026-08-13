"use client";

import React from "react";
import { clsx } from "clsx";

interface FillBlankProps {
  options?: any[];
  selectedWord: string | null;
  onSelectWord: (word: string) => void;
  disabled?: boolean;
}

export const FillBlank: React.FC<FillBlankProps> = ({
  options = [],
  selectedWord,
  onSelectWord,
  disabled = false,
}) => {
  // Normalize options array
  const normalizedOptions = (options || []).map((opt, idx) => {
    if (typeof opt === "string") {
      return { id: idx, text: opt };
    }
    return { id: opt.id || idx, text: opt.text || String(opt) };
  });

  const hasOptions = normalizedOptions.length > 0;

  return (
    <div className="w-full max-w-xl mx-auto my-6 space-y-6">
      {/* Option Pills if available */}
      {hasOptions ? (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {normalizedOptions.map((opt) => {
            const isSelected = selectedWord === opt.text;
            return (
              <button
                key={opt.id}
                type="button"
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
      ) : null}

      {/* Input Box as primary or fallback text input */}
      <div className="w-full">
        <input
          type="text"
          value={selectedWord || ""}
          onChange={(e) => onSelectWord(e.target.value)}
          disabled={disabled}
          placeholder="Type or select the missing word..."
          className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-extrabold text-xl text-gray-800 dark:text-slate-100 focus:border-duo-blue focus:outline-none transition-colors"
        />
      </div>
    </div>
  );
};
