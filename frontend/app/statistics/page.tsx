"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3, TrendingUp, Clock, Target, Calendar } from "lucide-react";
import { api } from "@/lib/api";

export default function StatisticsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.getStatistics()
      .then((data) => setStats(data))
      .catch(() => {
        setStats({
          total_xp: 1240,
          current_streak: 5,
          completed_lessons: 14,
          accuracy_percentage: 96.4,
          learning_time_minutes: 185,
          weekly_xp: [
            { day: "Mon", xp: 450 },
            { day: "Tue", xp: 600 },
            { day: "Wed", xp: 520 },
            { day: "Thu", xp: 800 },
            { day: "Fri", xp: 650 },
            { day: "Sat", xp: 720 },
            { day: "Sun", xp: 510 },
          ],
          heatmap: Array.from({ length: 28 }, (_, i) => ({ date: i + 1, level: (i % 4) + 1 })),
        });
      });
  }, []);

  const weeklyData = stats?.weekly_xp || [];
  const heatmapData = stats?.heatmap || [];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Sidebar />
      <Navbar />

      <main className="lg:pl-64 pt-16 max-w-4xl mx-auto p-4 sm:p-6 overflow-x-hidden">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-1">
            Your Statistics
          </h1>
          <p className="text-gray-500 font-semibold text-sm">
            Track your weekly XP trends, learning speed, and accuracy!
          </p>
        </div>

        {/* Overview Metrics Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-2 text-duo-green mb-1">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-extrabold uppercase">Weekly XP</span>
            </div>
            <span className="text-2xl font-black text-gray-800 dark:text-slate-100">4,250 XP</span>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-duo-blue mb-1">
              <Target className="w-5 h-5" />
              <span className="text-xs font-extrabold uppercase">Accuracy</span>
            </div>
            <span className="text-2xl font-black text-gray-800 dark:text-slate-100">
              {stats?.accuracy_percentage || 96.4}%
            </span>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-duo-purple mb-1">
              <Clock className="w-5 h-5" />
              <span className="text-xs font-extrabold uppercase">Learning Time</span>
            </div>
            <span className="text-2xl font-black text-gray-800 dark:text-slate-100">
              {stats?.learning_time_minutes || 185}m
            </span>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-duo-orange mb-1">
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs font-extrabold uppercase">Lessons</span>
            </div>
            <span className="text-2xl font-black text-gray-800 dark:text-slate-100">
              {stats?.completed_lessons || 14}
            </span>
          </Card>
        </div>

        {/* Recharts Weekly XP Graph */}
        <Card className="mb-8 p-6">
          <h3 className="text-xl font-extrabold font-['Fredoka'] mb-6 text-gray-800 dark:text-slate-100">
            Weekly XP Activity
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#AFAFAF" fontSize={12} tickLine={false} />
                <YAxis stroke="#AFAFAF" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18262F",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                />
                <Bar dataKey="xp" fill="#58CC02" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* GitHub Style Daily Activity Heatmap */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100">
              Streak Activity Calendar
            </h3>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>August 2026</span>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {heatmapData.map((day: any, i: number) => {
              const colors = [
                "bg-gray-100 dark:bg-slate-800",
                "bg-emerald-200 dark:bg-emerald-950",
                "bg-emerald-400 dark:bg-emerald-800",
                "bg-duo-green",
              ];
              const level = day.level || (i % 4);
              return (
                <div
                  key={i}
                  className={`h-10 rounded-xl flex items-center justify-center font-bold text-xs ${colors[level]} text-slate-700 dark:text-slate-200 shadow-sm`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
}
