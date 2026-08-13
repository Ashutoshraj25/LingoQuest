"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Flame, Zap, Trophy, Heart, Calendar, Share2, UserPlus, MapPin, Globe } from "lucide-react";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    api.getUserProfile()
      .then((res) => setProfile(res))
      .catch(() => {
        setProfile({
          full_name: "Ashutosh Raj",
          username: "ashutosh_raj",
          avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Ashutosh",
          native_language: "English",
          language_to_learn: "Hindi",
          country: "India",
          xp: 1240,
          streak: 5,
          level: 12,
          hearts: 5,
        });
      });
  }, []);

  const user = profile || {
    full_name: "Ashutosh Raj",
    username: "ashutosh_raj",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Ashutosh",
    native_language: "English",
    language_to_learn: "Hindi",
    country: "India",
    xp: 1240,
    streak: 5,
    level: 12,
    hearts: 5,
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Sidebar />
      <Navbar user={user} />

      <main className="md:pl-64 pt-16 max-w-4xl mx-auto p-6">
        {/* User Profile Header Card */}
        <Card className="mb-8 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-24 h-24 rounded-full border-4 border-duo-green overflow-hidden shadow-lg">
              <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100">
                {user.full_name}
              </h1>
              <p className="text-sm font-semibold text-gray-400 mt-1">
                @{user.username} • Level {user.level || 12} Learner
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-gray-400 font-bold">
                <span className="flex items-center gap-1"><Globe className="w-4 h-4 text-duo-blue" /> Native: {user.native_language}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-duo-orange" /> {user.country}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="blue" size="sm">
              <UserPlus className="w-4 h-4 mr-2 inline" />
              Add Friend
            </Button>
            <Button variant="white" size="sm">
              <Share2 className="w-4 h-4 mr-2 inline" />
              Share
            </Button>
          </div>
        </Card>

        {/* Statistics Grid */}
        <h2 className="text-2xl font-extrabold font-['Fredoka'] mb-4 text-gray-800 dark:text-slate-100">
          Statistics Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="flex items-center gap-4">
            <Flame className="w-8 h-8 fill-duo-orange text-duo-orange" />
            <div>
              <span className="text-2xl font-black text-gray-800 dark:text-slate-100">{user.streak || 5}</span>
              <p className="text-xs font-bold text-gray-400">Day Streak</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <Zap className="w-8 h-8 fill-duo-yellow text-duo-yellow" />
            <div>
              <span className="text-2xl font-black text-gray-800 dark:text-slate-100">{user.xp || 1240}</span>
              <p className="text-xs font-bold text-gray-400">Total XP</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <Trophy className="w-8 h-8 fill-duo-yellow text-duo-yellow" />
            <div>
              <span className="text-2xl font-black text-gray-800 dark:text-slate-100">Gold</span>
              <p className="text-xs font-bold text-gray-400">Current League</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <Heart className="w-8 h-8 fill-duo-red text-duo-red" />
            <div>
              <span className="text-2xl font-black text-gray-800 dark:text-slate-100">{user.hearts || 5} / 5</span>
              <p className="text-xs font-bold text-gray-400">Hearts</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
