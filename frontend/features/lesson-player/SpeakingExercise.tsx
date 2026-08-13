"use client";

import React, { useState } from "react";
import { Mic, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";

interface SpeakingExerciseProps {
  targetPhrase: string;
  onComplete: () => void;
  disabled?: boolean;
}

export const SpeakingExercise: React.FC<SpeakingExerciseProps> = ({
  targetPhrase,
  onComplete,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const startRecording = () => {
    if (disabled || isSuccess) return;
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setIsSuccess(true);
      onComplete();
    }, 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto my-6 text-center space-y-6">
      <div className="p-6 bg-sky-50 dark:bg-slate-800 rounded-3xl border-2 border-duo-blue">
        <span className="text-xs font-extrabold uppercase text-duo-blue">Speak this sentence out loud</span>
        <h3 className="text-2xl font-black text-gray-800 dark:text-slate-100 my-2">{targetPhrase}</h3>
      </div>

      <button
        disabled={disabled || isSuccess}
        onClick={startRecording}
        className={clsx(
          "w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white shadow-xl transition-all cursor-pointer",
          isSuccess
            ? "bg-emerald-500 shadow-emerald-500"
            : isRecording
            ? "bg-duo-red shadow-duo-red animate-ping"
            : "bg-duo-blue shadow-duo-blue hover:scale-105"
        )}
      >
        {isSuccess ? <CheckCircle2 className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
      </button>

      <p className="text-xs font-bold text-gray-400">
        {isRecording ? "Listening to your voice..." : isSuccess ? "Great pronunciation!" : "Tap microphone and speak"}
      </p>
    </div>
  );
};
