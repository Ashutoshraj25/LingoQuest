"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Flame, Zap, Trophy, Heart, Calendar, Share2, UserPlus, MapPin, Globe, Edit3 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";

export default function ProfilePage() {
  const { user, isGuest } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!isGuest && user?.id) {
      api.getUserProfile()
        .then((res) => setProfileData(res))
        .catch(() => {});
    }
  }, [isGuest, user?.id]);

  const activeUser = profileData || user;

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-slate-900 flex flex-col">
      <Sidebar />
      <Navbar user={activeUser} />

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        actionText="edit your profile and customize settings"
        returnUrl="/profile/edit"
      />

      <main className="lg:pl-64 pt-20 sm:pt-24 h-screen overflow-y-auto no-scrollbar scroll-smooth max-w-4xl mx-auto px-4 sm:px-6 pb-12 w-full">
        {/* User Profile Header Card */}
        <Card className="mb-8 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-24 h-24 rounded-full border-4 border-duo-green overflow-hidden shadow-lg">
              <img src={activeUser.avatar_url} alt={activeUser.full_name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100">
                {activeUser.full_name}
              </h1>
              <p className="text-sm font-bold text-gray-400">@{activeUser.username}</p>
              <div className="flex items-center gap-4 mt-3 text-xs font-extrabold text-gray-500 flex-wrap justify-center sm:justify-start">
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4 text-duo-blue" /> Native: {activeUser.native_language || "English"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-duo-orange" /> {activeUser.country || "India"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-duo-purple" /> Joined Aug 2026
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isGuest ? (
              <Button
                variant="green"
                size="sm"
                onClick={() => setShowAuthModal(true)}
              >
                <Edit3 className="w-4 h-4 mr-2 inline" /> Edit Profile
              </Button>
            ) : (
              <Link href="/profile/edit">
                <Button variant="green" size="sm">
                  <Edit3 className="w-4 h-4 mr-2 inline" /> Edit Profile
                </Button>
              </Link>
            )}

            <Button
              variant="white"
              size="sm"
              onClick={() => {
                if (isGuest) {
                  setShowAuthModal(true);
                } else if (navigator.share) {
                  navigator.share({ title: "LingoQuest Profile", url: window.location.href });
                }
              }}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Overview Statistics Cards */}
        <h2 className="text-xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-4">
          Statistics Overview
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 border-2 border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-2 text-duo-orange">
              <Flame className="w-6 h-6 fill-duo-orange" />
              <span className="text-xs font-black uppercase">Day Streak</span>
            </div>
            <p className="text-2xl font-black text-gray-800 dark:text-slate-100">
              {activeUser.streak_count || activeUser.streak || 21}
            </p>
          </Card>

          <Card className="p-4 border-2 border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-2 text-duo-yellow">
              <Zap className="w-6 h-6 fill-duo-yellow text-duo-yellow" />
              <span className="text-xs font-black uppercase">Total XP</span>
            </div>
            <p className="text-2xl font-black text-gray-800 dark:text-slate-100">
              {activeUser.xp || 2350}
            </p>
          </Card>

          <Card className="p-4 border-2 border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-2 text-duo-purple">
              <Trophy className="w-6 h-6 text-duo-purple" />
              <span className="text-xs font-black uppercase">Current League</span>
            </div>
            <p className="text-2xl font-black text-gray-800 dark:text-slate-100">
              {activeUser.league || "Gold"}
            </p>
          </Card>

          <Card className="p-4 border-2 border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-2 text-duo-red">
              <Heart className="w-6 h-6 fill-duo-red text-duo-red" />
              <span className="text-xs font-black uppercase">Hearts</span>
            </div>
            <p className="text-2xl font-black text-gray-800 dark:text-slate-100">
              {activeUser.hearts || 5} / 5
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
