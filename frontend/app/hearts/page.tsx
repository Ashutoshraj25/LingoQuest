"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/ui/Mascot";
import { Heart, Dumbbell, Gem, Clock } from "lucide-react";
import { api } from "@/lib/api";

export default function HeartsPage() {
  const [hearts, setHearts] = useState(5);

  const handleRefill = () => {
    api.refillHearts()
      .then((res) => {
        setHearts(res.hearts);
        alert("Hearts fully refilled!");
      })
      .catch(() => {
        setHearts(5);
        alert("Hearts fully refilled!");
      });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Sidebar />
      <Navbar user={{ streak: 5, xp: 450, hearts, gems: 1200, avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex" }} />

      <main className="md:pl-64 pt-16 max-w-2xl mx-auto p-6 text-center">
        <Mascot mood={hearts === 0 ? "sad" : "happy"} size={140} speechBubble={hearts === 0 ? "Oh no! You're out of hearts!" : "Keep your hearts full so you never stop learning!"} />

        <h1 className="text-3xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 my-4">
          Hearts Hub
        </h1>

        <div className="flex items-center justify-center gap-2 mb-8 text-2xl font-black text-duo-red">
          <Heart className="w-10 h-10 fill-duo-red" />
          <span>{hearts} / 5 Hearts Available</span>
        </div>

        <div className="space-y-4 max-w-md mx-auto text-left">
          {/* Practice to Refill */}
          <Card hoverable className="p-5 border-duo-green flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-duo-green text-white rounded-2xl">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base font-['Fredoka']">Practice to Earn Heart</h4>
                <p className="text-xs text-gray-500 font-semibold">Review weak skills and gain +1 Heart</p>
              </div>
            </div>
            <Link href="/practice">
              <Button variant="green" size="sm">PRACTICE</Button>
            </Link>
          </Card>

          {/* Refill with Gems */}
          <Card hoverable className="p-5 border-duo-blue flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-duo-blue text-white rounded-2xl">
                <Gem className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base font-['Fredoka']">Refill Full Hearts</h4>
                <p className="text-xs text-gray-500 font-semibold">Get 5 Hearts for 350 Gems</p>
              </div>
            </div>
            <Button variant="blue" size="sm" onClick={handleRefill}>
              REFILL
            </Button>
          </Card>

          {/* Timer Countdown */}
          <Card className="p-5 bg-gray-50 dark:bg-slate-800 text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500">
              <Clock className="w-4 h-4 text-duo-orange" />
              <span>Next automatic heart in 04:55</span>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
