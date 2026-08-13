"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Zap, Target, Flame, RotateCcw } from "lucide-react";
import { Mascot } from "@/components/ui/Mascot";
import { Button } from "@/components/ui/Button";

interface LessonCompleteViewProps {
  xpEarned: number;
  accuracy: number;
  comboMax: number;
  onContinue: () => void;
}

export const LessonCompleteView: React.FC<LessonCompleteViewProps> = ({
  xpEarned = 25,
  accuracy = 98,
  comboMax = 12,
  onContinue,
}) => {
  useEffect(() => {
    // Launch Confetti Burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full"
      >
        <Mascot mood="cheering" size={140} speechBubble="Lesson Complete! You're unstoppable!" />

        <h1 className="text-3xl font-extrabold text-duo-yellow font-['Fredoka'] mt-4 mb-8">
          Lesson Complete!
        </h1>

        {/* Stats Grid Cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {/* XP Card */}
          <div className="p-4 bg-amber-50 dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-700 rounded-2xl">
            <span className="text-xs font-extrabold text-amber-500 uppercase">TOTAL XP</span>
            <div className="flex items-center justify-center gap-1 mt-2 text-2xl font-black text-amber-600">
              <Zap className="w-6 h-6 fill-amber-500 text-amber-500" />
              <span>+{xpEarned}</span>
            </div>
          </div>

          {/* Accuracy Card */}
          <div className="p-4 bg-emerald-50 dark:bg-slate-800 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl">
            <span className="text-xs font-extrabold text-emerald-500 uppercase">ACCURACY</span>
            <div className="flex items-center justify-center gap-1 mt-2 text-2xl font-black text-emerald-600">
              <Target className="w-6 h-6 text-emerald-500" />
              <span>{accuracy}%</span>
            </div>
          </div>

          {/* Combo Card */}
          <div className="p-4 bg-orange-50 dark:bg-slate-800 border-2 border-orange-300 dark:border-orange-700 rounded-2xl">
            <span className="text-xs font-extrabold text-orange-500 uppercase">COMBO</span>
            <div className="flex items-center justify-center gap-1 mt-2 text-2xl font-black text-orange-600">
              <Flame className="w-6 h-6 fill-orange-500 text-orange-500" />
              <span>{comboMax}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button variant="green" size="full" onClick={onContinue}>
            CONTINUE
          </Button>
          <Button variant="white" size="full" onClick={onContinue}>
            <RotateCcw className="w-5 h-5 mr-2 inline" />
            REVIEW LESSON
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
