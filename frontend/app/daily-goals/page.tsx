"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Target, Check, Gem, Zap } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { DEMO_DAILY_GOALS } from "@/lib/demoData";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";

export default function DailyGoalsPage() {
  const { user, isGuest } = useAuth();
  const [data, setData] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!isGuest) {
      api.getDailyGoals()
        .then((res) => setData(res))
        .catch(() => setData(FALLBACK_GOALS));
    } else {
      setData(FALLBACK_GOALS);
    }
  }, [isGuest]);

  const FALLBACK_GOALS = {
    daily_goal_xp: 50,
    current_today_xp: 35,
    quests: DEMO_DAILY_GOALS.map((q) => ({
      id: q.id,
      title: q.title,
      description: "Complete daily practice to claim rewards.",
      target_amount: q.max_progress,
      current_progress: q.progress,
      reward_xp: 30,
      reward_gems: q.reward_gems,
      completed: q.completed,
      claimed: false,
    })),
  };

  const activeData = data || FALLBACK_GOALS;
  const quests = activeData.quests || [];

  const handleClaim = (id: number) => {
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }
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
      <Navbar user={user} />

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        actionText="claim daily quest rewards and save streak progress"
        returnUrl="/daily-goals"
      />

      <main className="lg:pl-64 pt-16 lg:data-[header-hidden=true]:pt-4 transition-[padding] duration-250 ease-in-out h-screen overflow-y-auto no-scrollbar scroll-smooth max-w-4xl mx-auto p-4 sm:p-6 w-full">
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

        {/* Daily XP Target Meter */}
        <Card className="p-6 mb-8 border-2 border-gray-200 dark:border-slate-800 bg-orange-50/40 dark:bg-slate-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="font-extrabold text-sm text-gray-800 dark:text-slate-100">Daily XP Target</span>
            <span className="font-black text-sm text-duo-orange">
              {activeData.current_today_xp} / {activeData.daily_goal_xp} XP
            </span>
          </div>
          <ProgressBar
            value={Math.round((activeData.current_today_xp / activeData.daily_goal_xp) * 100)}
            max={100}
            colorHex="#FF9600"
            height="h-4"
          />
        </Card>

        {/* Quest List */}
        <div className="space-y-4">
          {quests.map((quest: any) => {
            const pct = Math.round((quest.current_progress / quest.target_amount) * 100);
            return (
              <Card key={quest.id} className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-gray-200 dark:border-slate-800">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-slate-800 text-duo-orange flex items-center justify-center font-black text-xl shrink-0">
                    🎯
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-gray-800 dark:text-slate-100 font-['Fredoka']">{quest.title}</h3>
                    <p className="text-xs font-semibold text-gray-400">{quest.description}</p>
                    <div className="w-48 mt-2">
                      <ProgressBar value={pct} max={100} colorHex="#FF9600" height="h-2" />
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto shrink-0">
                  {quest.claimed ? (
                    <div className="flex items-center justify-center gap-1 text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-duo-green">
                      <Check className="w-4 h-4 text-duo-green" /> Claimed
                    </div>
                  ) : quest.completed ? (
                    <Button variant="green" size="sm" onClick={() => handleClaim(quest.id)} className="w-full">
                      Claim +{quest.reward_gems} Gems
                    </Button>
                  ) : (
                    <Button variant="white" size="sm" disabled className="w-full">
                      {quest.current_progress}/{quest.target_amount}
                    </Button>
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
