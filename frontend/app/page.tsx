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
import { Flame, Trophy, Sparkles, Dumbbell } from "lucide-react";
import { api } from "@/lib/api";
import { clearAuthSession, getStoredToken, getStoredUser } from "@/lib/auth";
import { FirstLanguageModal } from "@/components/auth/FirstLanguageModal";

export default function DashboardPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const fetchDashboard = useCallback((userId: number) => {
    api.getDashboard(userId)
      .then((data) => {
        setDashboardData(data);
        if (!data?.user?.language_to_learn) {
          setShowLanguageModal(true);
        }
      })
      .catch((err) => {
        if (err instanceof Error && /401|403|404/.test(err.message)) {
          clearAuthSession();
          router.replace("/auth/login");
          return;
        }
        console.warn("Fallback dashboard data:", err);
      });
  }, [router]);

  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();
    if (!token || !storedUser) {
      clearAuthSession();
      router.replace("/auth/login");
      return;
    }

    setIsCheckingAuth(false);
    fetchDashboard(storedUser.id);
  }, [router, fetchDashboard]);

  if (isCheckingAuth) {
    return null;
  }

  const user = dashboardData?.user || {
    username: "AshutoshExplorer",
    full_name: "Ashutosh Raj",
    streak: 5,
    streak_count: 5,
    xp: 1240,
    hearts: 5,
    gems: 450,
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Ashutosh",
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
    if (dashboardData?.user) {
      fetchDashboard(dashboardData.user.id);
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Sidebar />
      <Navbar user={user} onLanguageChange={() => fetchDashboard(user.id)} />

      <FirstLanguageModal
        isOpen={showLanguageModal}
        onSelectLanguage={handleLanguageModalSelect}
      />

      <main className="md:pl-64 pt-16 flex flex-col lg:flex-row">
        {/* Central Learning Path */}
        <div className="flex-1 max-w-2xl mx-auto px-4 py-8">
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
                    <LessonNode
                      key={skill.id}
                      id={skill.id}
                      title={skill.title}
                      completedLessons={skill.completed_lessons}
                      totalLessons={skill.total_lessons}
                      isUnlocked={skill.is_unlocked}
                      isCompleted={skill.is_completed}
                      colorHex={unit.color_hex}
                      xOffset={xOffset}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar Widget */}
        <div className="w-full lg:w-80 p-6 space-y-6">
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
            <Link href="/practice">
              <Button variant="purple" className="w-full text-xs py-2.5 uppercase font-black tracking-wide">
                Start Practice Mode
              </Button>
            </Link>
          </Card>

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
                  <span className="text-duo-green font-extrabold">You (Ashutosh)</span>
                </div>
                <span className="font-extrabold text-duo-green">4,250 XP</span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
