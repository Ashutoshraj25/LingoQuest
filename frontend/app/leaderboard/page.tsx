"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trophy, Crown, Flame, UserPlus } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { DEMO_LEADERBOARD } from "@/lib/demoData";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";

export default function LeaderboardPage() {
  const { user, isGuest } = useAuth();
  const [data, setData] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    api.getLeaderboard()
      .then((res) => setData(res))
      .catch(() => {
        setData({
          league: "Gold League",
          current_user_rank: 2,
          rankings: DEMO_LEADERBOARD.map((item) => ({
            rank: item.rank,
            username: item.name,
            xp: item.xp,
            avatar_url: item.avatar,
            is_user: item.isCurrent,
          })),
        });
      });
  }, []);

  const rankings = data?.rankings?.length > 0 ? data.rankings : DEMO_LEADERBOARD.map((item) => ({
    rank: item.rank,
    username: item.name,
    xp: item.xp,
    avatar_url: item.avatar,
    is_user: item.isCurrent,
  }));

  const top3 = rankings.slice(0, 3);
  const rest = rankings.slice(3);

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-slate-900 flex flex-col">
      <Sidebar />
      <Navbar user={user} />

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        actionText="compete in leagues and invite friends"
        returnUrl="/leaderboard"
      />

      <main className="lg:pl-64 pt-16 h-screen overflow-y-auto no-scrollbar scroll-smooth max-w-4xl mx-auto p-4 sm:p-6 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-1">
              {data?.league || "Gold League"}
            </h1>
            <p className="text-gray-500 font-semibold text-sm">
              Top 3 move up to Diamond League next week!
            </p>
          </div>
          <Button
            variant="blue"
            size="sm"
            onClick={() => {
              if (isGuest) setShowAuthModal(true);
            }}
          >
            <UserPlus className="w-4 h-4 mr-2 inline" />
            Invite Friends
          </Button>
        </div>

        {/* Top 3 Podium Visual */}
        {top3.length >= 3 && (
          <div className="flex items-end justify-center gap-4 my-10 max-w-md mx-auto">
            {/* 2nd Place */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-16 h-16 rounded-full border-4 border-gray-300 overflow-hidden mb-2 shadow-md relative">
                <img src={top3[1]?.avatar_url} alt={top3[1]?.username} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 right-0 bg-gray-300 text-gray-800 font-black text-xs px-1.5 py-0.5 rounded-full">2</span>
              </div>
              <p className="font-extrabold text-xs text-gray-700 dark:text-slate-200 truncate max-w-[90px]">{top3[1]?.username}</p>
              <p className="font-bold text-xs text-duo-yellow">{top3[1]?.xp} XP</p>
              <div className="w-full h-24 bg-gray-100 dark:bg-slate-800 rounded-t-2xl mt-2 border-t-4 border-gray-300 flex items-center justify-center font-black text-gray-400 text-2xl">
                2
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center flex-1">
              <Crown className="w-8 h-8 text-duo-yellow fill-duo-yellow mb-1 animate-bounce" />
              <div className="w-20 h-20 rounded-full border-4 border-duo-yellow overflow-hidden mb-2 shadow-lg relative">
                <img src={top3[0]?.avatar_url} alt={top3[0]?.username} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 right-0 bg-duo-yellow text-white font-black text-xs px-1.5 py-0.5 rounded-full">1</span>
              </div>
              <p className="font-extrabold text-xs text-gray-800 dark:text-slate-100 truncate max-w-[100px]">{top3[0]?.username}</p>
              <p className="font-extrabold text-xs text-duo-yellow">{top3[0]?.xp} XP</p>
              <div className="w-full h-32 bg-amber-50 dark:bg-slate-800/80 rounded-t-2xl mt-2 border-t-4 border-duo-yellow flex items-center justify-center font-black text-duo-yellow text-3xl shadow-md">
                1
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-16 h-16 rounded-full border-4 border-amber-600 overflow-hidden mb-2 shadow-md relative">
                <img src={top3[2]?.avatar_url} alt={top3[2]?.username} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 right-0 bg-amber-600 text-white font-black text-xs px-1.5 py-0.5 rounded-full">3</span>
              </div>
              <p className="font-extrabold text-xs text-gray-700 dark:text-slate-200 truncate max-w-[90px]">{top3[2]?.username}</p>
              <p className="font-bold text-xs text-duo-yellow">{top3[2]?.xp} XP</p>
              <div className="w-full h-20 bg-amber-900/10 dark:bg-slate-800 rounded-t-2xl mt-2 border-t-4 border-amber-600 flex items-center justify-center font-black text-amber-700 text-xl">
                3
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard List */}
        <Card className="p-4 space-y-2 border-2 border-gray-200 dark:border-slate-800">
          {rest.map((item: any, idx: number) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-3.5 rounded-2xl font-bold text-sm transition-all ${
                item.is_user
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-2 border-duo-green text-duo-green"
                  : "bg-gray-50 dark:bg-slate-800/60 text-gray-700 dark:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="font-black text-base w-6 text-center text-gray-400">#{item.rank}</span>
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-slate-700">
                  <img src={item.avatar_url} alt={item.username} className="w-full h-full object-cover" />
                </div>
                <span>{item.username}</span>
              </div>
              <div className="flex items-center gap-1 font-extrabold">
                <Flame className="w-4 h-4 text-duo-orange fill-duo-orange" />
                <span>{item.xp} XP</span>
              </div>
            </div>
          ))}
        </Card>
      </main>
    </div>
  );
}
