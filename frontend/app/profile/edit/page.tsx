"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, Save, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";

const AVATARS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=GuestLearner",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Ashutosh",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Rahul",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Priya",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Neha",
];

const LANGUAGES = ["Hindi", "English", "Bengali", "Tamil", "Telugu", "Marathi", "Kannada", "Malayalam", "Gujarati", "Punjabi"];

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isGuest, updateUserSession } = useAuth();
  const [fullName, setFullName] = useState(user.full_name || "Guest Learner");
  const [username, setUsername] = useState(user.username || "guest_learner");
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar_url || AVATARS[0]);
  const [learningLang, setLearningLang] = useState(user.language_to_learn || "Hindi");
  const [message, setMessage] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    setFullName(user.full_name || "Guest Learner");
    setUsername(user.username || "guest_learner");
    setSelectedAvatar(user.avatar_url || AVATARS[0]);
    setLearningLang(user.language_to_learn || "Hindi");
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserSession({
      full_name: fullName,
      username,
      avatar_url: selectedAvatar,
      language_to_learn: learningLang,
    });

    if (!isGuest) {
      api.updateProfile({
        full_name: fullName,
        username,
        avatar_url: selectedAvatar,
        language_to_learn: learningLang,
      }).catch(() => {});
    }

    setMessage("Profile updated successfully!");
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-slate-900 flex flex-col">
      <Sidebar />
      <Navbar user={user} />

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Create a free account to save your progress forever"
        actionText="save your profile edits and account data permanently"
        returnUrl="/profile"
      />

      <main className="lg:pl-64 pt-20 sm:pt-24 h-screen overflow-y-auto no-scrollbar scroll-smooth max-w-3xl mx-auto px-4 sm:px-6 pb-12 w-full">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-1">
              Edit Profile
            </h1>
            <p className="text-gray-500 font-semibold text-sm">
              Update your personal details, avatar, and learning language.
            </p>
          </div>
          {isGuest && (
            <Button
              variant="blue"
              size="sm"
              onClick={() => setShowAuthModal(true)}
            >
              <Sparkles className="w-4 h-4 mr-2 inline text-duo-yellow fill-duo-yellow" />
              Save Permanently
            </Button>
          )}
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-duo-green text-duo-green font-extrabold text-sm flex items-center gap-2">
            ✓ {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Selector */}
          <Card className="p-6 border-2 border-gray-200 dark:border-slate-800">
            <h2 className="font-extrabold text-lg font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-4">
              Choose Avatar
            </h2>
            <div className="flex items-center gap-4 flex-wrap">
              {AVATARS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedAvatar(url)}
                  className={`w-16 h-16 rounded-full border-4 overflow-hidden transition-all ${
                    selectedAvatar === url ? "border-duo-green scale-110 shadow-md" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img src={url} alt="Avatar" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </Card>

          {/* User Information */}
          <Card className="p-6 space-y-4 border-2 border-gray-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-black uppercase text-gray-500 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3.5 rounded-2xl border-2 border-gray-200 dark:border-slate-700 dark:bg-slate-800 font-extrabold text-sm focus:border-duo-blue focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-gray-500 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3.5 rounded-2xl border-2 border-gray-200 dark:border-slate-700 dark:bg-slate-800 font-extrabold text-sm focus:border-duo-blue focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-gray-500 mb-1">Learning Language</label>
              <select
                value={learningLang}
                onChange={(e) => setLearningLang(e.target.value)}
                className="w-full p-3.5 rounded-2xl border-2 border-gray-200 dark:border-slate-700 dark:bg-slate-800 font-extrabold text-sm focus:border-duo-blue focus:outline-none"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </Card>

          <Button variant="green" size="full" type="submit">
            <Save className="w-5 h-5 mr-2 inline" /> Save Changes
          </Button>
        </form>
      </main>
    </div>
  );
}
