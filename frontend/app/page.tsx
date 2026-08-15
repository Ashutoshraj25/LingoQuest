"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { UnitHeader } from "@/features/learning-path/UnitHeader";
import { LessonNode } from "@/features/learning-path/LessonNode";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Trophy, Dumbbell, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { getStoredToken, getStoredUser } from "@/lib/auth";
import { FirstLanguageModal } from "@/components/auth/FirstLanguageModal";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";
import { useAuth } from "@/context/AuthContext";

// Shared Right Panel Widgets Component
const RightPanelWidgets = ({
  user,
  isAuthenticated,
  onAuthRequired,
}: {
  user: any;
  isAuthenticated: boolean;
  onAuthRequired: (action: string) => void;
}) => (
  <>
    {/* Language Progress Card */}
    <Card className="p-5 border-2 border-gray-200 dark:border-slate-800 bg-sky-50/50 dark:bg-slate-800/50 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-duo-blue/10 flex items-center justify-center text-duo-blue font-black text-xl">
          🇮🇳
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-gray-800 dark:text-slate-100">
            {user.language_to_learn || "Hindi"} Course
          </h3>
          <p className="text-xs font-bold text-gray-400">
            Active Learning Path
          </p>
        </div>
      </div>
      <ProgressBar value={45} max={100} colorHex="#1CB0F6" height="h-2.5" />
      <div className="flex justify-between items-center text-xs font-extrabold text-gray-500">
        <span>Path Progress</span>
        <span>45%</span>
      </div>
    </Card>

    {/* Daily Practice Card */}
    <Card className="p-5 border-2 border-gray-200 dark:border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-extrabold text-gray-800 dark:text-slate-100">
          <Dumbbell className="w-5 h-5 text-duo-purple" />
          <span>Daily Practice</span>
        </div>
        <span className="text-xs font-extrabold text-duo-purple bg-duo-purple/10 px-2.5 py-1 rounded-full uppercase">
          +15 XP
        </span>
      </div>
      <p className="text-xs font-semibold text-gray-500 dark:text-slate-400">
        Strengthen your {user.language_to_learn || "Hindi"} vocabulary and grammar skills.
      </p>
      {isAuthenticated ? (
        <Link href="/practice">
          <Button variant="purple" className="w-full text-xs py-2.5 uppercase font-black tracking-wide">
            Start Practice Mode
          </Button>
        </Link>
      ) : (
        <Button
          variant="purple"
          onClick={() => onAuthRequired("start practice mode")}
          className="w-full text-xs py-2.5 uppercase font-black tracking-wide"
        >
          Start Practice Mode
        </Button>
      )}
    </Card>

    {/* Leaderboard Preview Card */}
    <Card className="p-5 border-2 border-gray-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-extrabold text-gray-800 dark:text-slate-100">
          <Trophy className="w-5 h-5 text-duo-yellow" />
          <span>Gold League</span>
        </div>
        <Link href="/leaderboard" className="text-xs font-extrabold text-duo-blue hover:underline">
          View All
        </Link>
      </div>
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-slate-800/80 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="font-black text-duo-yellow">#1</span>
            <span>Aarav Sharma</span>
          </div>
          <span className="font-extrabold text-gray-500">5,100 XP</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-duo-green text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="font-black text-duo-green">#2</span>
            <span className="text-duo-green font-extrabold">You (Visitor)</span>
          </div>
          <span className="font-extrabold text-duo-green">4,250 XP</span>
        </div>
      </div>
    </Card>
  </>
);

export default function DashboardPage() {
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [authModalState, setAuthModalState] = useState<{
    isOpen: boolean;
    actionText: string;
    returnUrl: string;
  }>({
    isOpen: false,
    actionText: "start lessons and save progress",
    returnUrl: "/",
  });

  const token = getStoredToken();
  const storedUser = getStoredUser();
  const activeUser = authUser || storedUser;

  const isAuthenticated = Boolean(token || activeUser);

  const fetchDashboard = useCallback((userId: number) => {
    api.getDashboard(userId)
      .then((data) => {
        setDashboardData(data);
        if (!data?.user?.language_to_learn) {
          setShowLanguageModal(true);
        }
      })
      .catch((err) => {
        console.warn("Fallback dashboard data:", err);
      });
  }, []);

  useEffect(() => {
    if (activeUser?.id) {
      fetchDashboard(activeUser.id);
    }
  }, [activeUser?.id, fetchDashboard]);

  const handleAuthRequired = (actionText: string, returnUrl: string = "/") => {
    setAuthModalState({
      isOpen: true,
      actionText,
      returnUrl,
    });
  };

  // Loading State - Fast Skeleton (<10ms resolution)
  if (authLoading) {
    return (
      <div className="h-screen w-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-duo-green flex items-center justify-center text-white font-extrabold text-2xl font-['Fredoka'] animate-bounce">
            L
          </div>
          <span className="font-extrabold text-xs text-gray-400 font-['Fredoka'] uppercase tracking-wider">
            Loading LingoQuest...
          </span>
        </div>
      </div>
    );
  }

  // User Profile Data (Authenticated or Demo Mode Visitor)
  const user = dashboardData?.user || activeUser || {
    username: "VisitorExplorer",
    full_name: "Demo Visitor",
    streak: 5,
    streak_count: 5,
    xp: 1240,
    hearts: 5,
    gems: 450,
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Visitor",
    language_to_learn: "Hindi",
  };

  const activeLang = user.language_to_learn || "Hindi";

  const units = dashboardData?.units?.length > 0 ? dashboardData.units : [
    {
      id: 1,
      order: 1,
      title: `Unit 1: ${activeLang} Basics & Greetings`,
      description: `Learn essential ${activeLang} greetings, daily vocabulary, and sentence structures.`,
      color_hex: "#58CC02",
      skills: [
        { id: 1, title: `${activeLang} Greetings`, completed_lessons: 4, total_lessons: 4, is_unlocked: true, is_completed: true },
        { id: 2, title: "Pronouns & Verbs", completed_lessons: 2, total_lessons: 4, is_unlocked: true, is_completed: false },
        { id: 3, title: "Family Members", completed_lessons: 0, total_lessons: 4, is_unlocked: true, is_completed: false },
        { id: 4, title: "Numbers 1-10", completed_lessons: 0, total_lessons: 4, is_unlocked: false, is_completed: false },
      ],
    },
    {
      id: 2,
      order: 2,
      title: `Unit 2: ${activeLang} Food & Ordering`,
      description: `Order regional Indian dishes, drinks, and express tastes in ${activeLang}.`,
      color_hex: "#CE82FF",
      skills: [
        { id: 5, title: "Food & Drinks", completed_lessons: 0, total_lessons: 4, is_unlocked: false, is_completed: false },
        { id: 6, title: "Restaurant Phrases", completed_lessons: 0, total_lessons: 4, is_unlocked: false, is_completed: false },
      ],
    },
  ];

  const offsets = [0, 45, 75, 45, 0, -45, -75, -45];

  const handleLanguageModalSelect = (selectedLang: string) => {
    setShowLanguageModal(false);
    if (user?.id && isAuthenticated) {
      fetchDashboard(user.id);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-slate-900 flex flex-col">
      {/* 1. Left Sidebar (Fixed on Desktop) */}
      <Sidebar />

      {/* 2. Top Header (Sticky/Fixed) */}
      <Navbar user={user} onLanguageChange={() => user?.id && isAuthenticated && fetchDashboard(user.id)} />

      <FirstLanguageModal
        isOpen={showLanguageModal}
        onSelectLanguage={handleLanguageModalSelect}
      />

      <AuthPromptModal
        isOpen={authModalState.isOpen}
        onClose={() => setAuthModalState((prev) => ({ ...prev, isOpen: false }))}
        actionText={authModalState.actionText}
        returnUrl={authModalState.returnUrl}
      />

      {/* 3. Main Container */}
      <div className="lg:pl-64 pt-16 h-screen w-full flex flex-col lg:flex-row overflow-hidden">
        {/* Central Learning Path - INDEPENDENTLY SCROLLABLE */}
        <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar scroll-smooth max-w-2xl mx-auto px-4 py-8">
          {/* DEMO MODE TOP BANNER */}
          {!isAuthenticated && (
            <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-duo-green flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-duo-green/20 text-duo-green flex items-center justify-center font-black text-xl shrink-0">
                  <Sparkles className="w-5 h-5 text-duo-green" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-800 dark:text-slate-100 font-['Fredoka']">
                    Demo Mode Preview
                  </h4>
                  <p className="text-xs font-semibold text-gray-500 dark:text-slate-400">
                    Sign in to save your learning progress, earn XP, and unlock all units!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <Link href="/auth/login" className="w-full sm:w-auto">
                  <Button variant="green" className="text-xs uppercase font-extrabold py-2.5 px-4 w-full shadow-duo-green">
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/register" className="w-full sm:w-auto">
                  <Button variant="blue" className="text-xs uppercase font-extrabold py-2.5 px-4 w-full shadow-duo-blue">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {units.map((unit: any) => (
            <div key={unit.id} className="mb-12">
              <UnitHeader
                unitNumber={unit.order}
                title={unit.title}
                description={unit.description}
                colorHex={unit.color_hex}
              />

              <div className="flex flex-col items-center py-6 gap-6">
                {unit.skills.map((skill: any, idx: number) => {
                  const xOffset = offsets[idx % offsets.length];
                  return (
                    <div
                      key={skill.id}
                      onClick={(e) => {
                        if (!isAuthenticated) {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAuthRequired("start a lesson and save progress", `/lesson/${skill.id}`);
                        }
                      }}
                    >
                      <LessonNode
                        id={skill.id}
                        title={skill.title}
                        completedLessons={skill.completed_lessons}
                        totalLessons={skill.total_lessons}
                        isUnlocked={skill.is_unlocked}
                        isCompleted={skill.is_completed}
                        colorHex={unit.color_hex}
                        xOffset={xOffset}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* MOBILE & TABLET RIGHT PANEL (<1024px) - STACKED BELOW LEARNING PATH */}
          <div className="lg:hidden mt-12 space-y-6 pt-8 border-t-2 border-gray-100 dark:border-slate-800 pb-16 w-full">
            <h3 className="font-extrabold text-lg text-gray-800 dark:text-slate-100 font-['Fredoka']">
              Your Progress & Daily Practice
            </h3>
            <RightPanelWidgets
              user={user}
              isAuthenticated={isAuthenticated}
              onAuthRequired={(act) => handleAuthRequired(act, "/practice")}
            />
          </div>
        </main>

        {/* DESKTOP RIGHT SIDEBAR WIDGET (>=1024px) - FIXED ON DESKTOP */}
        <aside className="hidden lg:block w-80 h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar p-6 space-y-6 shrink-0 border-l border-gray-100 dark:border-slate-800">
          <RightPanelWidgets
            user={user}
            isAuthenticated={isAuthenticated}
            onAuthRequired={(act) => handleAuthRequired(act, "/practice")}
          />
        </aside>
      </div>
    </div>
  );
}
