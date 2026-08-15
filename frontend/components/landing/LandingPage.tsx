"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Mascot } from "@/components/ui/Mascot";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import {
  Sparkles,
  Flame,
  Trophy,
  Dumbbell,
  BookOpen,
  ArrowRight,
  Zap,
  Globe2,
  CheckCircle2,
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const router = useRouter();
  const { guestLogin } = useAuth();
  const [isGuestLoading, setIsGuestLoading] = React.useState(false);

  useEffect(() => {
    // Prefetch authentication routes for instant transition
    router.prefetch("/auth/login");
    router.prefetch("/auth/register");
  }, [router]);

  const handleGuestDemo = async () => {
    setIsGuestLoading(true);
    try {
      await guestLogin();
    } catch (err) {
      console.error("Guest login failed:", err);
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col font-['Nunito'] transition-colors duration-300">
      {/* 1. Header Navigation Bar */}
      <header className="h-20 border-b-2 border-gray-100 dark:border-slate-800 px-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-duo-green flex items-center justify-center text-white shadow-duo-green font-extrabold text-2xl font-['Fredoka']">
            L
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-duo-green font-['Fredoka']">
            LingoQuest
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          <Link href="/auth/login">
            <Button
              variant="white"
              className="text-xs sm:text-sm font-extrabold uppercase py-2.5 px-4 sm:px-6"
            >
              Log In
            </Button>
          </Link>
          <Link href="/auth/register" className="hidden sm:block">
            <Button
              variant="green"
              className="text-xs sm:text-sm font-extrabold uppercase py-2.5 px-5"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 pt-8 pb-16 w-full flex flex-col items-center justify-center text-center">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 my-auto w-full">
          {/* Hero Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-slate-800 border-2 border-sky-200 dark:border-slate-700 text-duo-blue font-extrabold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-duo-yellow animate-pulse" />
              <span>Learn 5 Major Indian Languages Playfully</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-['Fredoka'] leading-tight text-gray-900 dark:text-slate-100">
              The free, fun & effective way to learn <span className="text-duo-green">Indian languages!</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 font-semibold leading-relaxed">
              Master <strong>Hindi</strong>, <strong>Marathi</strong>, <strong>Bengali</strong>, <strong>Tamil</strong> & <strong>Telugu</strong> with interactive micro-lessons, streak challenges, and real-time audio exercises.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 max-w-md mx-auto lg:mx-0">
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button
                  variant="green"
                  size="lg"
                  className="w-full uppercase font-black tracking-wide text-sm py-4 px-8 shadow-duo-green"
                >
                  Create Account <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Button>
              </Link>

              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button
                  variant="blue"
                  size="lg"
                  className="w-full uppercase font-black tracking-wide text-sm py-4 px-8 shadow-duo-blue"
                >
                  I Already Have An Account
                </Button>
              </Link>
            </div>

            {/* Fast Guest Demo Option */}
            <div className="pt-2">
              <button
                onClick={handleGuestDemo}
                disabled={isGuestLoading}
                className="inline-flex items-center gap-2 text-xs font-extrabold text-duo-purple hover:underline cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-duo-purple text-duo-purple" />
                <span>{isGuestLoading ? "Entering Instant Demo..." : "Instant Guest Demo (No Login Needed)"}</span>
              </button>
            </div>
          </div>

          {/* Hero Right Graphic */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="relative z-10 p-8 rounded-3xl bg-emerald-50/60 dark:bg-slate-800/60 border-4 border-duo-green/30 shadow-2xl flex flex-col items-center text-center max-w-md">
              <Mascot mood="happy" size={160} speechBubble="Namaste! Ready to speak Indian languages with confidence?" />
              
              {/* Flag Badge Row */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                {[
                  { name: "Hindi", flag: "🇮🇳" },
                  { name: "Marathi", flag: "🇮🇳" },
                  { name: "Bengali", flag: "🇮🇳" },
                  { name: "Tamil", flag: "🇮🇳" },
                  { name: "Telugu", flag: "🇮🇳" },
                ].map((lang) => (
                  <div
                    key={lang.name}
                    className="px-3 py-1 rounded-xl bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 text-xs font-extrabold text-gray-700 dark:text-slate-200 shadow-sm flex items-center gap-1.5"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left">
          <Card className="p-6 border-2 border-duo-green/30 hover:border-duo-green transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-duo-green flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg font-['Fredoka'] mb-1 text-gray-900 dark:text-slate-100">
              100% Unlocked Path
            </h3>
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400">
              Units 1 to 5 are fully unlocked with distinct exercises tailored for every language.
            </p>
          </Card>

          <Card className="p-6 border-2 border-duo-orange/30 hover:border-duo-orange transition-all">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-duo-orange flex items-center justify-center mb-4">
              <Flame className="w-6 h-6 fill-duo-orange" />
            </div>
            <h3 className="font-extrabold text-lg font-['Fredoka'] mb-1 text-gray-900 dark:text-slate-100">
              Daily Streaks & XP
            </h3>
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400">
              Maintain your daily streak, earn XP rewards, and level up your proficiency.
            </p>
          </Card>

          <Card className="p-6 border-2 border-duo-purple/30 hover:border-duo-purple transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-duo-purple flex items-center justify-center mb-4">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg font-['Fredoka'] mb-1 text-gray-900 dark:text-slate-100">
              Practice Hub
            </h3>
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400">
              Review weak skills, past mistakes, and timed challenges to boost accuracy.
            </p>
          </Card>

          <Card className="p-6 border-2 border-duo-yellow/30 hover:border-duo-yellow transition-all">
            <div className="w-12 h-12 rounded-2xl bg-yellow-100 dark:bg-yellow-950/60 text-duo-yellow flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg font-['Fredoka'] mb-1 text-gray-900 dark:text-slate-100">
              Gold Leagues
            </h3>
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400">
              Compete with language learners on global leaderboards and claim trophies.
            </p>
          </Card>
        </div>
      </main>

      {/* 4. Footer */}
      <footer className="border-t border-gray-100 dark:border-slate-800 py-6 px-6 text-center text-xs font-bold text-gray-400">
        <p>© 2026 LingoQuest. The Gamified Language Learning Platform.</p>
      </footer>
    </div>
  );
};
