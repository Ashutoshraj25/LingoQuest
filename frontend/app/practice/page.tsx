"use client";

import React from "react";
import Link from "next/link";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dumbbell, RefreshCw, Zap, Timer, Heart } from "lucide-react";

export default function PracticeHubPage() {
  const practiceModes = [
    {
      title: "Weak Skills",
      description: "Focus on words & phrases you struggled with recently.",
      xp: "+20 XP",
      icon: Dumbbell,
      color: "bg-duo-green",
      borderColor: "border-duo-green",
    },
    {
      title: "Mistakes Review",
      description: "Review incorrect answers from your previous lessons.",
      xp: "+15 XP",
      icon: RefreshCw,
      color: "bg-duo-blue",
      borderColor: "border-duo-blue",
    },
    {
      title: "Timed Challenge",
      description: "Race against the clock to earn maximum bonus XP!",
      xp: "+40 XP",
      icon: Timer,
      color: "bg-duo-orange",
      borderColor: "border-duo-orange",
    },
    {
      title: "Heart Refill Practice",
      description: "Complete a quick review session to earn +1 Heart.",
      xp: "+10 XP",
      icon: Heart,
      color: "bg-duo-red",
      borderColor: "border-duo-red",
    },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-slate-900 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className="lg:pl-64 pt-16 h-screen overflow-y-auto no-scrollbar scroll-smooth max-w-4xl mx-auto p-4 sm:p-6 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-2">
            Practice Hub
          </h1>
          <p className="text-gray-500 font-semibold">
            Sharpen your skills, review past mistakes, and earn extra XP!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {practiceModes.map((mode, idx) => {
            const Icon = mode.icon;
            return (
              <Card key={idx} hoverable className={`border-2 ${mode.borderColor} flex flex-col justify-between`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-4 rounded-2xl ${mode.color} text-white shadow-sm`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100">
                        {mode.title}
                      </h3>
                      <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-600 font-bold text-xs rounded-full">
                        {mode.xp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 font-semibold mt-1">{mode.description}</p>
                  </div>
                </div>

                <Link href="/lesson/1">
                  <Button variant="white" size="full">
                    START PRACTICE
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
