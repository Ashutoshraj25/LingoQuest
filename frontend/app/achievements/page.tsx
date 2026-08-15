"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Trophy, Award, Lock, Check } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { DEMO_ACHIEVEMENTS } from "@/lib/demoData";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";

export default function AchievementsPage() {
  const { user, isGuest, updateUserSession } = useAuth();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!isGuest) {
      api.getAchievements()
        .then((res) => setAchievements(res))
        .catch(() => setAchievements(DEMO_ACHIEVEMENTS_FALLBACK));
    } else {
      setAchievements(DEMO_ACHIEVEMENTS_FALLBACK);
    }
  }, [isGuest]);

  const DEMO_ACHIEVEMENTS_FALLBACK = DEMO_ACHIEVEMENTS.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    current_progress: a.progress,
    max_progress: a.max_progress,
    is_unlocked: a.unlocked,
    claimed: a.unlocked && a.id !== 4,
    gem_reward: a.reward_gems,
  }));

  const handleClaim = (id: number, gemReward: number = 50) => {
    if (isGuest) {
      setAchievements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, claimed: true } : a))
      );
      updateUserSession({ gems: (user.gems || 650) + gemReward });
      alert(`Claimed +${gemReward} Gems!`);
      return;
    }
    api.claimAchievement(id)
      .then(() => {
        setAchievements((prev) =>
          prev.map((a) => (a.id === id ? { ...a, claimed: true } : a))
        );
        updateUserSession({ gems: (user.gems || 650) + gemReward });
      })
      .catch(() => {});
  };

  const list = achievements.length > 0 ? achievements : DEMO_ACHIEVEMENTS_FALLBACK;

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-slate-900 flex flex-col">
      <Sidebar />
      <Navbar user={user} />

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Create a free account to save your progress forever"
        actionText="claim achievement rewards and track progress"
        returnUrl="/achievements"
      />

      <main className="lg:pl-64 pt-20 sm:pt-24 h-screen overflow-y-auto no-scrollbar scroll-smooth max-w-4xl mx-auto px-4 sm:px-6 pb-12 w-full">
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
          {list.map((ach) => {
            const pct = Math.round((ach.current_progress / ach.max_progress) * 100);
            return (
              <Card key={ach.id} className="flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black ${
                      ach.is_unlocked ? "bg-amber-100 text-duo-yellow border-2 border-duo-yellow" : "bg-gray-100 text-gray-400"
                    }`}>
                      {ach.is_unlocked ? <Award className="w-8 h-8 text-duo-yellow" /> : <Lock className="w-6 h-6 text-gray-400" />}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-gray-800 dark:text-slate-100 font-['Fredoka']">
                        {ach.title}
                      </h3>
                      <p className="text-xs font-semibold text-gray-500">{ach.description}</p>
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs font-black text-gray-500">
                      <span>Progress</span>
                      <span>{ach.current_progress} / {ach.max_progress}</span>
                    </div>
                    <ProgressBar value={pct} max={100} colorHex={ach.is_unlocked ? "#FFC800" : "#E5E7EB"} height="h-3" />
                  </div>
                </div>

                <div>
                  {ach.claimed ? (
                    <div className="flex items-center justify-center gap-2 text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-duo-green">
                      <Check className="w-4 h-4 text-duo-green" /> Claimed (+{ach.gem_reward} Gems)
                    </div>
                  ) : ach.is_unlocked ? (
                    <Button variant="green" size="full" onClick={() => handleClaim(ach.id, ach.gem_reward)}>
                      Claim +{ach.gem_reward} Gems
                    </Button>
                  ) : (
                    <Button variant="white" size="full" disabled>
                      Locked
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
