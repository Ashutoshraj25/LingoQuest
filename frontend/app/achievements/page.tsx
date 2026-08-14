"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Trophy, Flame, Zap, Award, Lock, Check } from "lucide-react";
import { api } from "@/lib/api";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    api.getAchievements()
      .then((res) => setAchievements(res))
      .catch(() => {
        setAchievements([
          { id: 1, title: "Wildfire", description: "Reach a 7-day streak", current_progress: 5, max_progress: 7, is_unlocked: false, claimed: false, gem_reward: 100 },
          { id: 2, title: "Sage", description: "Earn 1,000 XP in your course", current_progress: 1000, max_progress: 1000, is_unlocked: true, claimed: true, gem_reward: 150 },
          { id: 3, title: "Sharpshooter", description: "Complete 5 lessons with 100% accuracy", current_progress: 4, max_progress: 5, is_unlocked: false, claimed: false, gem_reward: 75 },
          { id: 4, title: "Legend", description: "Unlock 12 skills across all units", current_progress: 12, max_progress: 12, is_unlocked: true, claimed: false, gem_reward: 200 },
        ]);
      });
  }, []);

  const handleClaim = (id: number) => {
    api.claimAchievement(id)
      .then(() => {
        setAchievements((prev) =>
          prev.map((a) => (a.id === id ? { ...a, claimed: true } : a))
        );
      })
      .catch(() => {});
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-slate-900 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className="lg:pl-64 pt-16 h-screen overflow-y-auto no-scrollbar scroll-smooth max-w-4xl mx-auto p-4 sm:p-6 w-full">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-1">
              Gold Trophy Showcase
            </h1>
            <p className="text-gray-500 font-semibold text-sm">
              Unlock badges as you hit major milestones!
            </p>
          </div>
          <Trophy className="w-12 h-12 text-duo-yellow fill-duo-yellow" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((ach) => {
            const pct = Math.round((ach.current_progress / ach.max_progress) * 100);
            return (
              <Card key={ach.id} className="flex flex-col justify-between p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md ${
                      ach.is_unlocked ? "bg-duo-yellow shadow-duo-yellow" : "bg-gray-200 dark:bg-slate-800 text-gray-400"
                    }`}
                  >
                    {ach.is_unlocked ? <Award className="w-8 h-8" /> : <Lock className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100">
                        {ach.title}
                      </h3>
                      <span className="text-xs font-extrabold text-duo-blue">+{ach.gem_reward} Gems</span>
                    </div>
                    <p className="text-xs text-gray-500 font-semibold mt-1">{ach.description}</p>
                  </div>
                </div>

                {/* Progress bar and button */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold text-gray-400">
                    <span>Progress</span>
                    <span>{ach.current_progress} / {ach.max_progress}</span>
                  </div>
                  <ProgressBar progress={pct} color={ach.is_unlocked ? "yellow" : "blue"} height="h-3" />

                  {ach.is_unlocked && !ach.claimed && (
                    <Button variant="yellow" size="full" onClick={() => handleClaim(ach.id)}>
                      CLAIM {ach.gem_reward} GEMS
                    </Button>
                  )}

                  {ach.claimed && (
                    <div className="py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-center font-extrabold text-xs text-emerald-600 flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" /> CLAIMED
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
