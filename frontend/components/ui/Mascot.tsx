import React from "react";
import { motion } from "framer-motion";

interface MascotProps {
  mood?: "happy" | "excited" | "sad" | "cheering" | "thinking";
  size?: number;
  speechBubble?: string;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = "happy",
  size = 120,
  speechBubble,
}) => {
  return (
    <div className="flex flex-col items-center justify-center relative my-2">
      {speechBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="mb-3 px-4 py-2 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl shadow-md text-sm font-bold text-gray-800 dark:text-slate-100 max-w-xs text-center relative"
        >
          {speechBubble}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white dark:border-t-slate-800" />
        </motion.div>
      )}

      <motion.div
        animate={
          mood === "excited" || mood === "cheering"
            ? { y: [0, -8, 0], rotate: [0, 2, -2, 0] }
            : { y: [0, -4, 0] }
        }
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        style={{ width: size, height: size }}
        className="relative"
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          {/* Owl Body */}
          <circle cx="100" cy="105" r="75" fill="#58CC02" />
          {/* Belly Patch */}
          <ellipse cx="100" cy="125" rx="45" ry="40" fill="#89E219" />

          {/* Feather details on belly */}
          <path d="M 85 115 Q 100 125 115 115" stroke="#46A302" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 90 132 Q 100 140 110 132" stroke="#46A302" strokeWidth="4" strokeLinecap="round" fill="none" />

          {/* Eyes */}
          {mood === "sad" ? (
            <>
              <circle cx="70" cy="85" r="22" fill="white" />
              <circle cx="130" cy="85" r="22" fill="white" />
              <path d="M 60 90 Q 70 80 80 90" stroke="#4B4B4B" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 120 90 Q 130 80 140 90" stroke="#4B4B4B" strokeWidth="4" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <circle cx="70" cy="85" r="24" fill="white" />
              <circle cx="130" cy="85" r="24" fill="white" />
              <circle cx="74" cy="85" r="11" fill="#4B4B4B" />
              <circle cx="126" cy="85" r="11" fill="#4B4B4B" />
              <circle cx="77" cy="81" r="4" fill="white" />
              <circle cx="129" cy="81" r="4" fill="white" />
            </>
          )}

          {/* Beak */}
          <polygon points="90,95 110,95 100,112" fill="#FF9600" />

          {/* Feet */}
          <ellipse cx="75" cy="180" rx="14" ry="7" fill="#FF9600" />
          <ellipse cx="125" cy="180" rx="14" ry="7" fill="#FF9600" />

          {/* Wings */}
          {mood === "cheering" ? (
            <>
              <path d="M 25 90 Q 10 60 30 70 Z" fill="#46A302" />
              <path d="M 175 90 Q 190 60 170 70 Z" fill="#46A302" />
            </>
          ) : (
            <>
              <ellipse cx="30" cy="115" rx="14" ry="30" fill="#46A302" transform="rotate(15 30 115)" />
              <ellipse cx="170" cy="115" rx="14" ry="30" fill="#46A302" transform="rotate(-15 170 115)" />
            </>
          )}
        </svg>
      </motion.div>
    </div>
  );
};
