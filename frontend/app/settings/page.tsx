"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Settings, Moon, Volume2, Bell, Shield, Globe, Check } from "lucide-react";
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
  const { user } = useAuth();
  const [sound, setSound] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("Hindi");
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
    api.switchLanguage(langName)
      .then((updatedUser) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        setSuccessMsg(`Active learning language set to ${langName}!`);
        setTimeout(() => setSuccessMsg(""), 3500);
      })
      .catch((err) => {
        console.error("Language update error:", err);
      })
      .finally(() => setIsUpdatingLang(false));
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-slate-900 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className="lg:pl-64 pt-16 h-screen overflow-y-auto no-scrollbar scroll-smooth max-w-3xl mx-auto p-4 sm:p-6 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-1">
            Settings
          </h1>
          <p className="text-gray-500 font-semibold text-sm">
            Manage your preferences, learning language, and application appearance.
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-duo-green text-duo-green font-extrabold text-sm flex items-center gap-3">
            <Check className="w-5 h-5" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Active Learning Language */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-duo-blue" />
              <div>
                <h3 className="text-xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100">
                  Target Language
                </h3>
                <p className="text-xs text-gray-400 font-semibold">
                  Choose the Indian language you are currently practicing
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INDIAN_LANGUAGES.map((lang) => {
                const isSelected = selectedLanguage.toLowerCase() === lang.name.toLowerCase();
                return (
                  <button
                    key={lang.code}
                    disabled={isUpdatingLang}
                    onClick={() => handleLanguageChange(lang.name)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border-2 font-extrabold text-sm transition-all text-left ${
                      isSelected
                        ? "border-duo-green bg-emerald-50/50 dark:bg-emerald-950/30 text-duo-green"
                        : "border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <div>{lang.name}</div>
                        <div className="text-xs text-gray-400 font-bold">{lang.native}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-duo-green" />}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Preferences */}
          <Card className="p-6">
            <h3 className="text-xl font-extrabold font-['Fredoka'] mb-4 text-gray-800 dark:text-slate-100">
              Appearance & Sound
            </h3>

            <div className="space-y-4">
              {/* Dark Mode Animated Toggle */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-duo-purple" />
                  <div>
                    <span className="font-bold text-gray-800 dark:text-slate-100">Theme Appearance</span>
                    <p className="text-xs text-gray-400 font-semibold">Switch between light and dark mode</p>
                  </div>
                </div>
                <ThemeToggle />
              </div>

              {/* Sound Effects */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-duo-blue" />
                  <div>
                    <span className="font-bold text-gray-800 dark:text-slate-100">Sound Effects</span>
                    <p className="text-xs text-gray-400 font-semibold">Play audio on correct/incorrect answers</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={sound}
                  onChange={() => setSound(!sound)}
                  className="w-5 h-5 accent-duo-green rounded cursor-pointer"
                />
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-duo-orange" />
                  <div>
                    <span className="font-bold text-gray-800 dark:text-slate-100">Daily Reminders</span>
                    <p className="text-xs text-gray-400 font-semibold">Get notified to keep your streak alive</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  className="w-5 h-5 accent-duo-green rounded cursor-pointer"
                />
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
