"use client";

import React from "react";
import Link from "next/link";
import { Mascot } from "@/components/ui/Mascot";
import { Button } from "@/components/ui/Button";
import { X, Sparkles, CheckCircle2 } from "lucide-react";

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
  title = "Create a free account to save your progress forever",
  actionText = "save progress forever and sync across devices",
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

        {/* Mascot */}
        <div className="flex flex-col items-center justify-center pt-2">
          <Mascot
            mood="happy"
            size={110}
            speechBubble="Create a free account to save your progress forever!"
          />
        </div>

        <div>
          <h2 className="text-xl font-extrabold font-['Fredoka'] text-gray-900 dark:text-slate-100 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-duo-yellow fill-duo-yellow shrink-0" />
            <span>{title}</span>
          </h2>
          
          <p className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-3">
            Create a free account or Log In to:
          </p>

          <div className="bg-sky-50/70 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-sky-200 dark:border-slate-700 text-left space-y-2 text-xs font-bold text-gray-700 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-duo-green shrink-0" />
              <span>Save XP & permanent progress forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-duo-green shrink-0" />
              <span>Save Hearts & maintain 21+ day streaks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-duo-green shrink-0" />
              <span>Sync learning progress across all devices</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-duo-green shrink-0" />
              <span>Compete in Gold League & earn badges</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Continue as Guest, Log In, Create Account */}
        <div className="space-y-2.5 pt-1">
          <Button
            variant="white"
            onClick={onClose}
            className="w-full uppercase font-extrabold text-xs py-3 border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            Continue as Guest
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Link href={loginHref} onClick={onClose} className="block w-full">
              <Button
                variant="blue"
                className="w-full uppercase font-black tracking-wide text-xs py-3 shadow-duo-blue"
              >
                Log In
              </Button>
            </Link>

            <Link href="/auth/register" onClick={onClose} className="block w-full">
              <Button
                variant="green"
                className="w-full uppercase font-black tracking-wide text-xs py-3 shadow-duo-green"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
