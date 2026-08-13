"use client";

import React, { useState } from "react";
import { clsx } from "clsx";

interface MatchPairsProps {
  pairs: { [key: string]: string }; // e.g. { "Bonjour": "Hello", "Merci": "Thank you" }
  onComplete: (userMapping: { [key: string]: string }) => void;
  disabled?: boolean;
}

export const MatchPairs: React.FC<MatchPairsProps> = ({
  pairs,
  onComplete,
  disabled = false,
}) => {
  const leftWords = Object.keys(pairs);
  const rightWords = Object.values(pairs).sort();

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [errorPair, setErrorPair] = useState<boolean>(false);

  const handleLeftClick = (word: string) => {
    if (disabled || matched.includes(word)) return;
    setSelectedLeft(word);
    if (selectedRight) {
      checkMatch(word, selectedRight);
    }
  };

  const handleRightClick = (word: string) => {
    if (disabled || matched.includes(word)) return;
    setSelectedRight(word);
    if (selectedLeft) {
      checkMatch(selectedLeft, word);
    }
  };

  const checkMatch = (left: string, right: string) => {
    if (pairs[left] === right) {
      // Correct Match
      const newMatched = [...matched, left, right];
      setMatched(newMatched);
      setSelectedLeft(null);
      setSelectedRight(null);
      setErrorPair(false);

      if (newMatched.length === leftWords.length * 2) {
        onComplete(pairs);
      }
    } else {
      // Incorrect match animation
      setErrorPair(true);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setErrorPair(false);
      }, 700);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-xl mx-auto my-6">
      {/* Left Column */}
      <div className="space-y-3">
        {leftWords.map((word) => {
          const isMatched = matched.includes(word);
          const isSelected = selectedLeft === word;
          return (
            <button
              key={word}
              disabled={disabled || isMatched}
              onClick={() => handleLeftClick(word)}
              className={clsx(
                "w-full p-4 rounded-2xl border-2 font-bold text-center transition-all select-none",
                isMatched
                  ? "bg-gray-100 dark:bg-slate-800/40 border-gray-200 text-gray-300 shadow-none cursor-default"
                  : isSelected
                  ? errorPair
                    ? "bg-red-50 border-duo-red text-duo-red animate-shake"
                    : "bg-sky-50 dark:bg-slate-800 border-duo-blue text-duo-blue shadow-duo-blue"
                  : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-800 dark:text-slate-100 shadow-duo-gray hover:bg-gray-50"
              )}
            >
              {word}
            </button>
          );
        })}
      </div>

      {/* Right Column */}
      <div className="space-y-3">
        {rightWords.map((word) => {
          const isMatched = matched.includes(word);
          const isSelected = selectedRight === word;
          return (
            <button
              key={word}
              disabled={disabled || isMatched}
              onClick={() => handleRightClick(word)}
              className={clsx(
                "w-full p-4 rounded-2xl border-2 font-bold text-center transition-all select-none",
                isMatched
                  ? "bg-gray-100 dark:bg-slate-800/40 border-gray-200 text-gray-300 shadow-none cursor-default"
                  : isSelected
                  ? errorPair
                    ? "bg-red-50 border-duo-red text-duo-red animate-shake"
                    : "bg-sky-50 dark:bg-slate-800 border-duo-blue text-duo-blue shadow-duo-blue"
                  : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-800 dark:text-slate-100 shadow-duo-gray hover:bg-gray-50"
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
