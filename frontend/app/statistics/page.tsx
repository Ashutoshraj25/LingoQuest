"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Clock, Target, Calendar } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { DEMO_STATISTICS } from "@/lib/demoData";

export default function StatisticsPage() {
  const { user, isGuest } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!isGuest) {
      api.getStatistics()
        .then((data) => setStats(data))
        .catch(() => setStats(FALLBACK_STATS));
    } else {
      setStats(FALLBACK_STATS);
    }
  }, [isGuest]);

  const FALLBACK_STATS = {
    total_xp: DEMO_STATISTICS.total_xp,
    current_streak: DEMO_STATISTICS.streak_days,
    completed_lessons: DEMO_STATISTICS.lessons_completed,
    accuracy_percentage: DEMO_STATISTICS.accuracy_percentage,
    learning_time_minutes: DEMO_STATISTICS.time_spent_minutes,
    weekly_xp: DEMO_STATISTICS.weekly_xp,
    heatmap: Array.from({ length: 28 }, (_, i) => ({ date: i + 1, level: (i % 4) + 1 })),
  };

  const activeStats = stats || FALLBACK_STATS;
  const weeklyData = activeStats.weekly_xp || [];
  const heatmapData = activeStats.heatmap || [];

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-slate-900 flex flex-col">
      <Sidebar />
      <Navbar user={user} />

      <main className="lg:pl-64 pt-16 lg:data-[header-hidden=true]:pt-4 transition-[padding] duration-250 ease-in-out h-screen overflow-y-auto no-scrollbar scroll-smooth max-w-4xl mx-auto p-4 sm:p-6 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-1">
            Learning Analytics & Insights
          </h1>
          <p className="text-gray-500 font-semibold text-sm">
            Track your weekly XP trends, learning speed, and accuracy!
          </p>
        </div>

        {/* Overview Metrics Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 border-2 border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-duo-green mb-1">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-black uppercase">Accuracy</span>
            </div>
            <p className="text-2xl font-black text-gray-800 dark:text-slate-100">
              {activeStats.accuracy_percentage}%
            </p>
          </Card>

          <Card className="p-4 border-2 border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-duo-blue mb-1">
              <Clock className="w-5 h-5" />
              <span className="text-xs font-black uppercase">Time Spent</span>
            </div>
            <p className="text-2xl font-black text-gray-800 dark:text-slate-100">
              {activeStats.learning_time_minutes} min
            </p>
          </Card>

          <Card className="p-4 border-2 border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-duo-purple mb-1">
              <Target className="w-5 h-5" />
              <span className="text-xs font-black uppercase">Lessons</span>
            </div>
            <p className="text-2xl font-black text-gray-800 dark:text-slate-100">
              {activeStats.completed_lessons}
            </p>
          </Card>

          <Card className="p-4 border-2 border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-duo-orange mb-1">
              <Calendar className="w-5 h-5" />
              <span className="text-xs font-black uppercase">Streak</span>
            </div>
            <p className="text-2xl font-black text-gray-800 dark:text-slate-100">
              {activeStats.current_streak} days
            </p>
          </Card>
        </div>

        {/* Recharts Weekly XP Chart */}
        <Card className="p-6 mb-8 border-2 border-gray-200 dark:border-slate-800">
          <h3 className="font-extrabold text-lg font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-6">
            Weekly XP Earned
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1E293B", borderRadius: "12px", border: "none", color: "#FFF" }}
                />
                <Bar dataKey="xp" fill="#58CC02" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Activity Heatmap Grid */}
        <Card className="p-6 border-2 border-gray-200 dark:border-slate-800">
          <h3 className="font-extrabold text-lg font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-4">
            Practice Consistency Grid (Last 28 Days)
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {heatmapData.map((item: any, i: number) => {
              const bgColors = ["bg-gray-100 dark:bg-slate-800", "bg-emerald-200", "bg-emerald-400", "bg-duo-green"];
              return (
                <div
                  key={i}
                  className={`h-10 rounded-xl ${bgColors[item.level % bgColors.length]} flex items-center justify-center font-bold text-xs`}
                  title={`Day ${item.date}: Practice completed`}
                >
                  {item.date}
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
}
