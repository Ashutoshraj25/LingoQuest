"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { clsx } from "clsx";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 opacity-60" />
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        "relative w-14 h-8 rounded-full p-1 border-2 flex items-center cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-duo-green select-none",
        isDark
          ? "bg-slate-900 border-slate-700 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
          : "bg-amber-100 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Sliding Knob with Spring Animation */}
      <motion.div
        className={clsx(
          "w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-colors duration-300",
          isDark ? "bg-indigo-600 text-amber-300" : "bg-amber-400 text-amber-900"
        )}
        animate={{
          x: isDark ? 24 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.div
          animate={{
            rotate: isDark ? 360 : 0,
            scale: [0.8, 1],
          }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          ) : (
            <Sun className="w-3.5 h-3.5 fill-amber-900 text-amber-900" />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  );
};
