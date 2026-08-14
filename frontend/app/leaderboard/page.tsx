"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trophy, Crown, Flame, UserPlus } from "lucide-react";
import { api } from "@/lib/api";

export default function LeaderboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.getLeaderboard()
      .then((res) => setData(res))
      .catch(() => {
        setData({
          league: "Gold League",
          current_user_rank: 2,
          rankings: [
            { rank: 1, username: "Sam J.", xp: 5100, avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Sam", is_user: false },
            { rank: 2, username: "AlexExplorer", xp: 4250, avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex", is_user: true },
            { rank: 3, username: "Taylor K.", xp: 4200, avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Taylor", is_user: false },
            { rank: 4, username: "Jordan P.", xp: 3800, avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Jordan", is_user: false },
            { rank: 5, username: "Morgan S.", xp: 3150, avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Morgan", is_user: false },
          ],
        });
      });
  }, []);

  const rankings = data?.rankings || [];
  const top3 = rankings.slice(0, 3);
  const rest = rankings.slice(3);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Sidebar />
      <Navbar />

      <main className="lg:pl-64 pt-16 max-w-4xl mx-auto p-4 sm:p-6 overflow-x-hidden">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-1">
              {data?.league || "Gold League"}
            </h1>
            <p className="text-gray-500 font-semibold text-sm">
              Top 3 move up to Diamond League next week!
            </p>
          </div>
          <Button variant="blue" size="sm">
            <UserPlus className="w-4 h-4 mr-2 inline" />
            Invite Friends
          </Button>
        </div>

        {/* Top 3 Podium Visual */}
        {top3.length >= 3 && (
          <div className="flex items-end justify-center gap-4 my-10 max-w-md mx-auto">
            {/* 2nd Place */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-16 h-16 rounded-full border-4 border-slate-300 overflow-hidden mb-2 shadow-md relative">
                <img src={top3[1].avatar_url} alt={top3[1].username} className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-sm text-gray-800 dark:text-slate-200">{top3[1].username}</span>
              <span className="text-xs font-bold text-gray-400">{top3[1].xp} XP</span>
              <div className="w-full h-28 bg-slate-200 dark:bg-slate-800 rounded-t-2xl flex items-center justify-center font-extrabold text-2xl text-slate-500 mt-2 shadow-inner">
                2
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center flex-1 -mt-6">
              <Crown className="w-8 h-8 fill-duo-yellow text-duo-yellow mb-1 animate-bounce" />
              <div className="w-20 h-20 rounded-full border-4 border-duo-yellow overflow-hidden mb-2 shadow-xl relative">
                <img src={top3[0].avatar_url} alt={top3[0].username} className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-base text-gray-800 dark:text-slate-200">{top3[0].username}</span>
              <span className="text-xs font-extrabold text-duo-yellow">{top3[0].xp} XP</span>
              <div className="w-full h-36 bg-amber-300 dark:bg-amber-600/60 rounded-t-2xl flex items-center justify-center font-extrabold text-3xl text-amber-800 mt-2 shadow-lg">
                1
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-16 h-16 rounded-full border-4 border-amber-600 overflow-hidden mb-2 shadow-md relative">
                <img src={top3[2].avatar_url} alt={top3[2].username} className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-sm text-gray-800 dark:text-slate-200">{top3[2].username}</span>
              <span className="text-xs font-bold text-gray-400">{top3[2].xp} XP</span>
              <div className="w-full h-24 bg-amber-200 dark:bg-amber-900/40 rounded-t-2xl flex items-center justify-center font-extrabold text-2xl text-amber-700 mt-2 shadow-inner">
                3
              </div>
            </div>
          </div>
        )}

        {/* Full Rankings List */}
        <Card className="divide-y divide-gray-100 dark:divide-slate-800 p-0 overflow-hidden">
          {rankings.map((user: any, idx: number) => (
            <div
              key={idx}
              className={`p-4 flex items-center justify-between transition-colors ${
                user.is_user ? "bg-sky-50 dark:bg-slate-800/80 font-bold" : "hover:bg-gray-50 dark:hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-6 font-extrabold text-lg text-center ${user.rank <= 3 ? "text-duo-yellow" : "text-gray-400"}`}>
                  {user.rank}
                </span>
                <img src={user.avatar_url} alt={user.username} className="w-10 h-10 rounded-full border border-gray-200" />
                <span className="font-extrabold text-gray-800 dark:text-slate-100">
                  {user.username} {user.is_user && "(You)"}
                </span>
              </div>
              <span className="font-extrabold text-duo-blue">{user.xp} XP</span>
            </div>
          ))}
        </Card>
      </main>
    </div>
  );
}
