"use client";

import React from "react";
import { clsx } from "clsx";
import { Volume2 } from "lucide-react";

interface Option {
  id: number;
  text: string;
  translation?: string;
}

interface MultipleChoiceProps {
  options: Option[];
  selectedOption: string | null;
  onSelect: (optionText: string) => void;
  disabled?: boolean;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  options,
  selectedOption,
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mx-auto my-6">
      {options.map((option) => {
        const isSelected = selectedOption === option.text;
        return (
          <button
            key={option.id}
            disabled={disabled}
            onClick={() => onSelect(option.text)}
            className={clsx(
              "p-5 rounded-2xl border-2 text-left font-bold transition-all duration-150 flex items-center justify-between shadow-sm cursor-pointer select-none",
              isSelected
                ? "bg-sky-50 dark:bg-slate-800 border-duo-blue shadow-duo-blue text-duo-blue"
                : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 shadow-duo-gray text-gray-700 dark:text-slate-200"
            )}
          >
            <div>
              <span className="text-lg block font-bold">{option.text}</span>
              {option.translation && (
                <span className="text-xs text-gray-400 font-medium">{option.translation}</span>
              )}
            </div>
            <Volume2 className="w-5 h-5 text-gray-400 hover:text-duo-blue" />
          </button>
        );
      })}
    </div>
  );
};
