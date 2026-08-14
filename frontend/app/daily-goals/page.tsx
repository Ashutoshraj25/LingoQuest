"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Target, Flame, Check, Gem, Zap } from "lucide-react";
import { api } from "@/lib/api";

export default function DailyGoalsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.getDailyGoals()
      .then((res) => setData(res))
      .catch(() => {
        setData({
          daily_goal_xp: 50,
          current_today_xp: 35,
          quests: [
            { id: 1, title: "Earn 50 XP", description: "Maintain your daily learning streak.", target_amount: 50, current_progress: 35, reward_xp: 30, reward_gems: 20, completed: false, claimed: false },
            { id: 2, title: "Complete 2 Lessons", description: "Finish 2 path lessons today.", target_amount: 2, current_progress: 1, reward_xp: 40, reward_gems: 25, completed: false, claimed: false },
            { id: 3, title: "Master 100% Accuracy", description: "Complete a lesson with 0 mistakes.", target_amount: 1, current_progress: 1, reward_xp: 50, reward_gems: 30, completed: true, claimed: false },
          ],
        });
      });
  }, []);

  const quests = data?.quests || [];

  const handleClaim = (id: number) => {
    api.claimQuest(id)
      .then(() => {
        setData((prev: any) => ({
          ...prev,
          quests: prev.quests.map((q: any) => (q.id === id ? { ...q, claimed: true } : q)),
        }));
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
              Daily Goals & Quests
            </h1>
            <p className="text-gray-500 font-semibold text-sm">
              Complete daily quests to keep your streak alive and earn rewards!
            </p>
          </div>
          <Target className="w-12 h-12 text-duo-orange" />
        </div>

        {/* Main XP Goal Progress Banner */}
        <Card className="mb-8 p-6 bg-orange-50 dark:bg-slate-800/80 border-duo-orange">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 fill-duo-orange text-duo-orange animate-bounce" />
              <div>
                <h3 className="text-xl font-extrabold font-['Fredoka']">Today's XP Goal</h3>
                <p className="text-xs text-gray-500 font-semibold">Earn {data?.daily_goal_xp || 50} XP to extend streak</p>
              </div>
            </div>
            <span className="text-2xl font-black text-duo-orange">
              {data?.current_today_xp || 35} / {data?.daily_goal_xp || 50} XP
            </span>
          </div>
          <ProgressBar progress={Math.round(((data?.current_today_xp || 35) / (data?.daily_goal_xp || 50)) * 100)} color="orange" height="h-4" />
        </Card>

        {/* Quests List */}
        <h3 className="text-xl font-extrabold font-['Fredoka'] mb-4 text-gray-800 dark:text-slate-100">
          Active Daily Missions
        </h3>
        <div className="space-y-4">
          {quests.map((q: any) => {
            const pct = Math.round((q.current_progress / q.target_amount) * 100);
            return (
              <Card key={q.id} className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-extrabold text-base font-['Fredoka'] text-gray-800 dark:text-slate-100">
                      {q.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs font-bold">
                      <span className="text-duo-yellow flex items-center gap-1">
                        <Zap className="w-4 h-4 fill-duo-yellow" /> +{q.reward_xp} XP
                      </span>
                      <span className="text-duo-blue flex items-center gap-1">
                        <Gem className="w-4 h-4 fill-duo-blue" /> +{q.reward_gems} Gems
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 font-semibold mb-3">{q.description}</p>
                  <ProgressBar progress={pct} color="green" height="h-2.5" />
                </div>

                {q.completed && !q.claimed && (
                  <Button variant="yellow" size="sm" onClick={() => handleClaim(q.id)} className="w-full sm:w-auto">
                    CLAIM REWARD
                  </Button>
                )}

                {q.claimed && (
                  <span className="px-4 py-2 bg-emerald-100 text-emerald-700 font-extrabold text-xs rounded-xl flex items-center gap-1">
                    <Check className="w-4 h-4" /> CLAIMED
                  </span>
                )}
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
