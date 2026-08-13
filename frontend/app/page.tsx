"use client";

import React, { useEffect, useState } from "react";
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

export default function DashboardPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();
    if (!token || !storedUser) {
      clearAuthSession();
      router.replace("/auth/login");
      return;
    }

    setIsCheckingAuth(false);
    api.getDashboard(storedUser.id)
      .then((data) => setDashboardData(data))
      .catch((err) => {
        if (err instanceof Error && /401|403|404/.test(err.message)) {
          clearAuthSession();
          router.replace("/auth/login");
          return;
        }
        console.warn("Fallback dashboard mock data due to:", err);
      });
  }, [router]);

  if (isCheckingAuth) {
    return null;
  }

  const user = dashboardData?.user || {
    username: "AlexExplorer",
    streak: 5,
    xp: 450,
    hearts: 5,
    gems: 1200,
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
  };

  const units = dashboardData?.units || [
    {
      id: 1,
      order: 1,
      title: "Unit 1: Section 1 - French Basics",
      description: "Form basic sentences, greet people, and introduce yourself in French.",
      color_hex: "#58CC02",
      skills: [
        { id: 1, title: "Greetings", completed_lessons: 4, total_lessons: 4, is_unlocked: true, is_completed: true },
        { id: 2, title: "Basics 1", completed_lessons: 2, total_lessons: 4, is_unlocked: true, is_completed: false },
        { id: 3, title: "Food & Cafe", completed_lessons: 0, total_lessons: 4, is_unlocked: true, is_completed: false },
        { id: 4, title: "People & Family", completed_lessons: 0, total_lessons: 4, is_unlocked: false, is_completed: false },
      ],
    },
    {
      id: 2,
      order: 2,
      title: "Unit 2: Daily Routine & Food",
      description: "Order food at a bistro, talk about drinks and daily habits.",
      color_hex: "#CE82FF",
      skills: [
        { id: 5, title: "Breakfast Nouns", completed_lessons: 0, total_lessons: 4, is_unlocked: false, is_completed: false },
        { id: 6, title: "Phrases 2", completed_lessons: 0, total_lessons: 4, is_unlocked: false, is_completed: false },
      ],
    },
  ];

  // Zigzag offsets for lesson nodes
  const offsets = [0, 45, 75, 45, 0, -45, -75, -45];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Sidebar />
      <Navbar user={user} />

      <main className="md:pl-64 pt-16 flex flex-col lg:flex-row">
        {/* Central Path Area */}
        <div className="flex-1 max-w-2xl mx-auto px-4 py-8">
          {units.map((unit: any) => (
            <div key={unit.id} className="mb-12">
              <UnitHeader
                unitNumber={unit.order}
                title={unit.title}
                description={unit.description}
                colorHex={unit.color_hex}
              />

              {/* Path Lesson Nodes */}
              <div className="flex flex-col items-center py-4 relative">
                {unit.skills.map((skill: any, idx: number) => (
                  <LessonNode
                    key={skill.id}
                    id={skill.id}
                    title={skill.title}
                    order={idx + 1}
                    completedLessons={skill.completed_lessons}
                    totalLessons={skill.total_lessons}
                    isUnlocked={skill.is_unlocked}
                    isCompleted={skill.is_completed}
                    offsetPercentage={offsets[idx % offsets.length]}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar Widgets */}
        <div className="w-full lg:w-80 p-6 space-y-6 border-l-2 border-gray-100 dark:border-slate-800">
          {/* Daily Goal Widget */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-sm uppercase text-gray-400">Daily Goal</span>
              <Flame className="w-5 h-5 text-duo-orange" />
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xl font-extrabold text-gray-800 dark:text-slate-100">35 / 50 XP</span>
              <span className="text-xs font-bold text-duo-green">70%</span>
            </div>
            <ProgressBar progress={70} color="orange" height="h-3" />
            <p className="text-xs text-gray-400 mt-3 font-semibold">
              Complete 1 more lesson to reach your daily goal!
            </p>
          </Card>

          {/* Practice Hub Quick Action */}
          <Card hoverable className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/80 border-duo-blue">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-duo-blue rounded-xl text-white">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-gray-800 dark:text-slate-100 font-['Fredoka']">Practice Hub</h4>
                <p className="text-xs text-gray-500 font-semibold">Review mistakes & weak skills</p>
              </div>
            </div>
            <Link href="/practice">
              <Button variant="blue" size="full">PRACTICE NOW</Button>
            </Link>
          </Card>

          {/* Leaderboard Preview */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-extrabold text-base font-['Fredoka']">Gold League</h4>
              <Link href="/leaderboard" className="text-xs font-bold text-duo-blue hover:underline">
                VIEW ALL
              </Link>
            </div>
            <div className="space-y-3 text-sm font-bold">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-duo-yellow font-black">1</span>
                  <span>Sam J.</span>
                </div>
                <span className="text-gray-400">5,100 XP</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-sky-50 dark:bg-slate-800 rounded-xl border border-duo-blue">
                <div className="flex items-center gap-3">
                  <span className="text-duo-blue font-black">2</span>
                  <span>{user.username} (You)</span>
                </div>
                <span className="text-duo-blue font-black">4,250 XP</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-amber-700 font-black">3</span>
                  <span>Taylor K.</span>
                </div>
                <span className="text-gray-400">4,200 XP</span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
