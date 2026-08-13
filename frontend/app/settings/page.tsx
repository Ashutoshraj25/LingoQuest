"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Settings, Moon, Volume2, Bell, Shield, LogOut } from "lucide-react";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [sound, setSound] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Sidebar />
      <Navbar />

      <main className="md:pl-64 pt-16 max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-1">
            Settings
          </h1>
          <p className="text-gray-500 font-semibold text-sm">
            Manage your preferences, appearance, and audio experience.
          </p>
        </div>

        <div className="space-y-6">
          {/* Preferences */}
          <Card className="p-6">
            <h3 className="text-xl font-extrabold font-['Fredoka'] mb-4 text-gray-800 dark:text-slate-100">
              Appearance & Sound
            </h3>

            <div className="space-y-4">
              {/* Dark Mode */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-duo-purple" />
                  <div>
                    <span className="font-bold text-gray-800 dark:text-slate-100">Dark Mode</span>
                    <p className="text-xs text-gray-400 font-semibold">Switch to dark theme for night study</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  className="w-6 h-6 rounded border-gray-300 text-duo-blue focus:ring-duo-blue cursor-pointer"
                />
              </div>

              {/* Sound FX */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-duo-green" />
                  <div>
                    <span className="font-bold text-gray-800 dark:text-slate-100">Sound FX</span>
                    <p className="text-xs text-gray-400 font-semibold">Play audio cues for correct/incorrect answers</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={sound}
                  onChange={() => setSound(!sound)}
                  className="w-6 h-6 rounded border-gray-300 text-duo-blue focus:ring-duo-blue cursor-pointer"
                />
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-duo-orange" />
                  <div>
                    <span className="font-bold text-gray-800 dark:text-slate-100">Streak Reminders</span>
                    <p className="text-xs text-gray-400 font-semibold">Receive daily practice notifications</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  className="w-6 h-6 rounded border-gray-300 text-duo-blue focus:ring-duo-blue cursor-pointer"
                />
              </div>
            </div>
          </Card>

          {/* Danger zone / Logout */}
          <Card className="p-6 border-rose-200 dark:border-rose-950">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-base text-rose-600 font-['Fredoka']">Account Session</h4>
                <p className="text-xs text-gray-400 font-semibold">Log out of your current session</p>
              </div>
              <Button variant="red" size="sm">
                <LogOut className="w-4 h-4 mr-2 inline" /> LOG OUT
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
