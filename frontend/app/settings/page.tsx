"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { Settings, Volume2, Bell, Globe, Check } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const INDIAN_LANGUAGES = [
  { code: "hi", name: "Hindi", flag: "🇮🇳", native: "हिन्दी" },
  { code: "mr", name: "Marathi", flag: "🇮🇳", native: "मराठी" },
  { code: "bn", name: "Bengali", flag: "🇮🇳", native: "বাংলা" },
  { code: "ta", name: "Tamil", flag: "🇮🇳", native: "தமிழ்" },
  { code: "te", name: "Telugu", flag: "🇮🇳", native: "తెలుగు" },
];

export default function SettingsPage() {
  const { user, isGuest, updateUserSession } = useAuth();
  const [sound, setSound] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(user.language_to_learn || "Hindi");
  const [isUpdatingLang, setIsUpdatingLang] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (user?.language_to_learn) {
      setSelectedLanguage(user.language_to_learn);
    }
  }, [user]);

  const handleLanguageChange = (langName: string) => {
    setIsUpdatingLang(true);
    setSelectedLanguage(langName);
    updateUserSession({ language_to_learn: langName });

    if (!isGuest) {
      api.switchLanguage(langName)
        .then(() => {})
        .catch(() => {});
    }

    setSuccessMsg(`Active learning language set to ${langName}!`);
    setTimeout(() => setSuccessMsg(""), 3500);
    setIsUpdatingLang(false);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-slate-900 flex flex-col">
      <Sidebar />
      <Navbar user={user} />

      <main className="lg:pl-64 pt-16 lg:data-[header-hidden=true]:pt-4 transition-[padding] duration-250 ease-in-out h-screen overflow-y-auto no-scrollbar scroll-smooth max-w-3xl mx-auto p-4 sm:p-6 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-1 flex items-center gap-2">
            <Settings className="w-8 h-8 text-duo-purple" />
            <span>Account Settings</span>
          </h1>
          <p className="text-gray-500 font-semibold text-sm">
            Customize preferences, switch learning course, and toggle theme.
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-duo-green text-duo-green font-extrabold text-sm flex items-center gap-2 animate-in fade-in">
            <Check className="w-5 h-5 text-duo-green" /> {successMsg}
          </div>
        )}

        <div className="space-y-6">
          {/* Active Learning Course */}
          <Card className="p-6 border-2 border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-duo-blue" />
              <h2 className="font-extrabold text-lg text-gray-800 dark:text-slate-100 font-['Fredoka']">
                Active Learning Language
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INDIAN_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.name)}
                  disabled={isUpdatingLang}
                  className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between font-extrabold text-sm transition-all ${
                    selectedLanguage.toLowerCase() === lang.name.toLowerCase()
                      ? "border-duo-green bg-emerald-50 dark:bg-emerald-950/40 text-duo-green shadow-sm"
                      : "border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <div>{lang.name}</div>
                      <div className="text-xs text-gray-400 font-semibold">{lang.native}</div>
                    </div>
                  </div>
                  {selectedLanguage.toLowerCase() === lang.name.toLowerCase() && (
                    <Check className="w-5 h-5 text-duo-green" />
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Sound & Notifications */}
          <Card className="p-6 space-y-4 border-2 border-gray-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-6 h-6 text-duo-orange" />
                <div>
                  <h3 className="font-extrabold text-sm text-gray-800 dark:text-slate-100">Sound Effects</h3>
                  <p className="text-xs font-semibold text-gray-400">Play audio for correct and incorrect answers</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={sound}
                onChange={() => setSound(!sound)}
                className="w-5 h-5 accent-duo-green cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-duo-yellow" />
                <div>
                  <h3 className="font-extrabold text-sm text-gray-800 dark:text-slate-100">Daily Reminders</h3>
                  <p className="text-xs font-semibold text-gray-400">Receive reminders to maintain daily streak</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className="w-5 h-5 accent-duo-green cursor-pointer"
              />
            </div>
          </Card>

          {/* Theme Toggle */}
          <Card className="p-6 flex items-center justify-between border-2 border-gray-200 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-sm text-gray-800 dark:text-slate-100">Appearance Theme</h3>
              <p className="text-xs font-semibold text-gray-400">Switch between Light and Dark mode</p>
            </div>
            <ThemeToggle />
          </Card>
        </div>
      </main>
    </div>
  );
}
