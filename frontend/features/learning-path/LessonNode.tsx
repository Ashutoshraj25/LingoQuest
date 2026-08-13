"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Lock, Star, Play, Check } from "lucide-react";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Button } from "@/components/ui/Button";

interface LessonNodeProps {
  id: number;
  title: string;
  order?: number;
  completedLessons: number;
  totalLessons: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  colorHex?: string;
  xOffset?: number;
  offsetPercentage?: number; // Zigzag horizontal offset -50 to 50
}

export const LessonNode: React.FC<LessonNodeProps> = ({
  id,
  title,
  order = 1,
  completedLessons,
  totalLessons,
  isUnlocked,
  isCompleted,
  colorHex = "#58CC02",
  xOffset,
  offsetPercentage = 0,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const offset = xOffset !== undefined ? xOffset : offsetPercentage;

  return (
    <div
      className="relative flex flex-col items-center my-3"
      style={{ transform: `translateX(${offset}px)` }}
    >
      {/* Node Button */}
      <button
        onClick={() => isUnlocked && setShowPopover(!showPopover)}
        disabled={!isUnlocked}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center font-extrabold transition-all duration-200 shadow-md ${
          isCompleted
            ? "bg-duo-yellow text-white hover:brightness-105 active:scale-95 border-b-4 border-amber-600"
            : isUnlocked
            ? "bg-duo-green text-white hover:brightness-105 active:scale-95 border-b-4 border-emerald-700"
            : "bg-gray-200 dark:bg-slate-800 text-gray-400 border-b-4 border-gray-300 dark:border-slate-700 cursor-not-allowed"
        }`}
      >
        {isCompleted ? (
          <Check className="w-9 h-9 stroke-[3]" />
        ) : isUnlocked ? (
          <Star className="w-9 h-9 fill-current" />
        ) : (
          <Lock className="w-7 h-7 text-gray-400 dark:text-slate-600" />
        )}
      </button>

      {/* Popover Card on Click */}
      <AnimatePresence>
        {showPopover && isUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-24 z-40 w-64 bg-duo-green text-white rounded-2xl p-4 shadow-2xl border-2 border-emerald-400 text-center"
          >
            <h4 className="font-extrabold text-lg mb-1">{title}</h4>
            <p className="text-xs font-semibold text-emerald-100 mb-3">
              Lesson {completedLessons} of {totalLessons}
            </p>
            <Link href={`/lesson/${id}`}>
              <Button
                variant="white"
                className="w-full text-duo-green bg-white hover:bg-emerald-50 text-xs font-black uppercase tracking-wider py-2.5 shadow-md"
              >
                Start +15 XP
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
