"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, Shield, Lock, Save, Camera } from "lucide-react";
import { api } from "@/lib/api";

const AVATARS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Ashutosh",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Rahul",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Priya",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Neha",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Amit",
];

const LANGUAGES = ["Hindi", "English", "Bengali", "Tamil", "Telugu", "Marathi", "Kannada", "Malayalam", "Gujarati", "Punjabi"];

export default function EditProfilePage() {
  const [fullName, setFullName] = useState("Ashutosh Raj");
  const [username, setUsername] = useState("ashutosh_raj");
  const [email, setEmail] = useState("ashutosh@example.com");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [learningLang, setLearningLang] = useState("Hindi");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api.getUserProfile()
      .then((u) => {
        setFullName(u.full_name || "Ashutosh Raj");
        setUsername(u.username || "ashutosh_raj");
        setEmail(u.email || "ashutosh@example.com");
        setSelectedAvatar(u.avatar_url || AVATARS[0]);
        setLearningLang(u.language_to_learn || "Hindi");
      })
      .catch(() => {});
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Profile updated successfully!");
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Sidebar />
      <Navbar />

      <main className="md:pl-64 pt-16 max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-1">
            Edit Profile
          </h1>
          <p className="text-gray-500 font-semibold text-sm">
            Update your personal details, avatar, learning language, and password.
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-2xl border border-emerald-200">
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Picker */}
          <Card className="p-6">
            <h3 className="text-xl font-extrabold font-['Fredoka'] mb-4 text-gray-800 dark:text-slate-100 flex items-center gap-2">
              <Camera className="w-5 h-5 text-duo-blue" /> Choose Avatar
            </h3>
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(url)}
                  className={`w-16 h-16 rounded-full border-4 overflow-hidden transition-all ${
                    selectedAvatar === url ? "border-duo-green scale-110 shadow-lg" : "border-gray-200 opacity-60"
                  }`}
                >
                  <img src={url} alt="Avatar" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </Card>

          {/* Personal Details */}
          <Card className="p-6 space-y-4">
            <h3 className="text-xl font-extrabold font-['Fredoka'] mb-2 text-gray-800 dark:text-slate-100 flex items-center gap-2">
              <User className="w-5 h-5 text-duo-green" /> Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-duo-blue outline-none dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-duo-blue outline-none dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-duo-blue outline-none dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Target Learning Language</label>
              <select
                value={learningLang}
                onChange={(e) => setLearningLang(e.target.value)}
                className="w-full p-3 font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-duo-blue outline-none dark:text-slate-100"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </Card>

          {/* Change Password */}
          <Card className="p-6 space-y-4">
            <h3 className="text-xl font-extrabold font-['Fredoka'] mb-2 text-gray-800 dark:text-slate-100 flex items-center gap-2">
              <Lock className="w-5 h-5 text-duo-orange" /> Security & Password
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">New Password</label>
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-duo-blue outline-none dark:text-slate-100"
              />
            </div>
          </Card>

          <Button variant="green" size="lg" type="submit" className="w-full sm:w-auto">
            <Save className="w-5 h-5 mr-2 inline" /> SAVE CHANGES
          </Button>
        </form>
      </main>
    </div>
  );
}
