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
  order: number;
  completedLessons: number;
  totalLessons: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  offsetPercentage?: number; // Zigzag horizontal offset -50 to 50
}

export const LessonNode: React.FC<LessonNodeProps> = ({
  id,
  title,
  completedLessons,
  totalLessons,
  isUnlocked,
  isCompleted,
  offsetPercentage = 0,
}) => {
  const [showPopover, setShowPopover] = useState(false);

  const progressPct = Math.round((completedLessons / totalLessons) * 100);
  const isActive = isUnlocked && !isCompleted;

  return (
    <div
      className="relative flex flex-col items-center my-6"
      style={{ transform: `translateX(${offsetPercentage}px)` }}
    >
      {/* Node Button */}
      <button
        onClick={() => isUnlocked && setShowPopover(!showPopover)}
        className="relative group focus:outline-none"
      >
        <ProgressRing progress={progressPct} radius={44} stroke={7} color="#58CC02">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 shadow-duo ${
              isCompleted
                ? "bg-duo-yellow shadow-duo-yellow text-white"
                : isActive
                ? "bg-duo-green shadow-duo-green text-white active-node-pulse"
                : "bg-gray-200 dark:bg-slate-800 text-gray-400 border-2 border-gray-300 dark:border-slate-700"
            }`}
          >
            {isCompleted ? (
              <Crown className="w-8 h-8 fill-white" />
            ) : isActive ? (
              <Star className="w-8 h-8 fill-white" />
            ) : (
              <Lock className="w-6 h-6" />
            )}
          </div>
        </ProgressRing>
      </button>

      {/* Popover Card */}
      <AnimatePresence>
        {showPopover && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="absolute z-50 top-24 w-64 p-4 bg-duo-green rounded-3xl text-white shadow-xl text-center"
          >
            <div className="font-extrabold text-lg mb-1">{title}</div>
            <p className="text-xs text-white/90 font-semibold mb-4">
              Lesson {completedLessons + 1} of {totalLessons} • +25 XP
            </p>

            <Link href={`/lesson/${id}`}>
              <Button variant="white" size="full">
                <Play className="w-5 h-5 fill-duo-green text-duo-green inline mr-2" />
                START +25 XP
              </Button>
            </Link>

            {/* Triangle pointer */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-duo-green" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
