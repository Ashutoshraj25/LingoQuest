"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/ui/Mascot";
import { Heart, Dumbbell, Gem } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";

export default function HeartsPage() {
  const { user, isGuest } = useAuth();
  const [hearts, setHearts] = useState(user.hearts || 5);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleRefill = () => {
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }
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
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-slate-900 flex flex-col">
      <Sidebar />
      <Navbar user={{ ...user, hearts }} />

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        actionText="refill hearts and save progress"
        returnUrl="/hearts"
      />

      <main className="lg:pl-64 pt-20 sm:pt-24 h-screen overflow-y-auto no-scrollbar scroll-smooth max-w-2xl mx-auto px-4 sm:px-6 pb-12 text-center w-full">
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
                <h4 className="font-extrabold text-base font-['Fredoka']">Refill All Hearts</h4>
                <p className="text-xs text-gray-500 font-semibold">Instantly restore to 5 Hearts for 150 Gems</p>
              </div>
            </div>
            <Button variant="blue" size="sm" onClick={handleRefill}>
              REFILL
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
