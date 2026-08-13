"use client";

import React, { useState } from "react";
import { X, Heart } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";

interface ExerciseHeaderProps {
  currentStep: number;
  totalSteps: number;
  hearts: number;
  onExit: () => void;
}

export const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
  currentStep,
  totalSteps,
  hearts,
  onExit,
}) => {
  const [showExitModal, setShowExitModal] = useState(false);
  const progressPct = Math.round((currentStep / totalSteps) * 100);

  return (
    <>
      <header className="w-full max-w-4xl mx-auto px-4 py-6 flex items-center gap-4">
        {/* Exit Close Button */}
        <button
          onClick={() => setShowExitModal(true)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
        >
          <X className="w-7 h-7 stroke-[3]" />
        </button>

        {/* Lesson Progress Bar */}
        <div className="flex-1">
          <ProgressBar progress={progressPct} height="h-3.5" color="green" />
        </div>

        {/* Hearts counter */}
        <div className="flex items-center gap-1.5 text-duo-red font-extrabold text-lg">
          <Heart className="w-6 h-6 fill-duo-red" />
          <span>{hearts}</span>
        </div>
      </header>

      {/* Exit Confirmation Dialog */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-xl font-extrabold font-['Fredoka'] mb-2">Are you sure you want to quit?</h3>
            <p className="text-sm text-gray-500 mb-6">You will lose your lesson progress for this session.</p>
            <div className="space-y-3">
              <Button variant="red" size="full" onClick={onExit}>
                QUIT LESSON
              </Button>
              <Button variant="white" size="full" onClick={() => setShowExitModal(false)}>
                KEEP LEARNING
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
