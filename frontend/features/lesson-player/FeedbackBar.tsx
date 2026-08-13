"use client";

import React from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FeedbackBarProps {
  status: "idle" | "correct" | "incorrect";
  correctAnswer?: string;
  explanation?: string;
  onCheck: () => void;
  onContinue: () => void;
  canCheck: boolean;
}

export const FeedbackBar: React.FC<FeedbackBarProps> = ({
  status,
  correctAnswer,
  explanation,
  onCheck,
  onContinue,
  canCheck,
}) => {
  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 p-6 border-t-2 transition-all duration-300 z-40 ${
        status === "correct"
          ? "bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
          : status === "incorrect"
          ? "bg-rose-100 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200"
          : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800"
      }`}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {status === "idle" && (
          <div className="hidden sm:block text-sm text-gray-400 font-semibold">
            Select or type an answer to continue
          </div>
        )}

        {status === "correct" && (
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 fill-emerald-100" />
            <div>
              <h4 className="text-xl font-extrabold font-['Fredoka']">You are correct!</h4>
              {explanation ? (
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 max-w-md">{explanation}</p>
              ) : (
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Awesome job!</p>
              )}
            </div>
          </div>
        )}

        {status === "incorrect" && (
          <div className="flex items-center gap-3">
            <XCircle className="w-10 h-10 text-rose-600 fill-rose-100" />
            <div>
              <h4 className="text-xl font-extrabold font-['Fredoka']">Correct answer:</h4>
              <p className="text-sm font-bold text-rose-700 dark:text-rose-300 mb-1">{correctAnswer}</p>
              {explanation && (
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 max-w-md flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 inline" /> {explanation}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        {status === "idle" ? (
          <Button
            variant={canCheck ? "green" : "ghost"}
            size="lg"
            disabled={!canCheck}
            onClick={onCheck}
            className="w-full sm:w-auto"
          >
            CHECK
          </Button>
        ) : status === "correct" ? (
          <Button variant="green" size="lg" onClick={onContinue} className="w-full sm:w-auto">
            CONTINUE
          </Button>
        ) : (
          <Button variant="red" size="lg" onClick={onContinue} className="w-full sm:w-auto">
            GOT IT
          </Button>
        )}
      </div>
    </footer>
  );
};
