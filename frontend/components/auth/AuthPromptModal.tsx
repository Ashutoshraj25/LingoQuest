"use client";

import React from "react";
import Link from "next/link";
import { Mascot } from "@/components/ui/Mascot";
import { Button } from "@/components/ui/Button";
import { X, Lock, Sparkles } from "lucide-react";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  actionText?: string;
  returnUrl?: string;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
  title = "Save Your Progress!",
  actionText = "start lessons, save progress, and earn XP",
  returnUrl = "/",
}) => {
  if (!isOpen) return null;

  const loginHref = returnUrl && returnUrl !== "/" 
    ? `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}` 
    : "/auth/login";

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mascot & Lock Icon */}
        <div className="flex flex-col items-center justify-center pt-2">
          <Mascot
            mood="happy"
            size={110}
            speechBubble="Sign in to save your progress and continue learning!"
          />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold font-['Fredoka'] text-gray-900 dark:text-slate-100 mb-1 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-duo-yellow fill-duo-yellow" />
            <span>{title}</span>
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-slate-400 max-w-xs mx-auto">
            Please log in or create a free account to {actionText}.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Link href={loginHref} onClick={onClose} className="block w-full">
            <Button
              variant="green"
              className="w-full uppercase font-black tracking-wide text-xs py-3.5 shadow-duo-green"
            >
              Log In
            </Button>
          </Link>

          <Link href="/auth/register" onClick={onClose} className="block w-full">
            <Button
              variant="blue"
              className="w-full uppercase font-black tracking-wide text-xs py-3.5 shadow-duo-blue"
            >
              Create Account
            </Button>
          </Link>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-extrabold text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors uppercase tracking-wider"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
