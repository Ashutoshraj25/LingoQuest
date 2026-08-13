"use client";

import React from "react";

interface TypeAnswerProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const TypeAnswer: React.FC<TypeAnswerProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto my-6">
      <textarea
        rows={4}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type in English..."
        className="w-full p-4 text-lg font-bold bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-duo-blue transition-all resize-none dark:text-slate-100"
      />
    </div>
  );
};
