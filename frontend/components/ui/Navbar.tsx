"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Flame, Heart, Gem, Globe, ChevronDown } from "lucide-react";

interface NavbarProps {
  user?: {
    full_name?: string;
    username?: string;
    streak: number;
    xp: number;
    hearts: number;
    gems: number;
    avatar_url: string;
    language_to_learn?: string;
  };
}

const INDIAN_LANGUAGES = [
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "bn", name: "Bengali", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", flag: "🇮🇳" },
  { code: "te", name: "Telugu", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", flag: "🇮🇳" },
];

export const Navbar: React.FC<NavbarProps> = ({
  user = {
    full_name: "Ashutosh Raj",
    username: "ashutosh_raj",
    streak: 5,
    xp: 1240,
    hearts: 5,
    gems: 450,
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Ashutosh",
    language_to_learn: "Hindi",
  },
}) => {
  const [selectedLang, setSelectedLang] = useState(
    INDIAN_LANGUAGES.find((l) => l.name === user.language_to_learn) || INDIAN_LANGUAGES[0]
  );
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="h-16 fixed top-0 right-0 left-0 md:left-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b-2 border-gray-200 dark:border-slate-800 px-6 flex items-center justify-between z-30">
      {/* Indian Language Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all font-extrabold text-sm"
        >
          <span className="text-xl">{selectedLang.flag}</span>
          <span className="hidden sm:inline font-extrabold uppercase tracking-wide">
            {selectedLang.name}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {isOpen && (
          <div className="absolute top-12 left-0 w-48 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl p-2 z-50 max-h-64 overflow-y-auto space-y-1">
            {INDIAN_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setSelectedLang(lang);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  selectedLang.code === lang.code
                    ? "bg-sky-50 dark:bg-slate-700 text-duo-blue"
                    : "hover:bg-gray-100 dark:hover:bg-slate-700/50"
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Gamification Counters */}
      <div className="flex items-center gap-4 sm:gap-6 font-extrabold text-sm sm:text-base">
        {/* Streak */}
        <Link href="/daily-goals" className="flex items-center gap-1.5 text-duo-orange hover:opacity-80 transition-all">
          <Flame className="w-6 h-6 fill-duo-orange text-duo-orange animate-bounce" />
          <span>{user.streak}</span>
        </Link>

        {/* Gems */}
        <Link href="/shop" className="flex items-center gap-1.5 text-duo-blue hover:opacity-80 transition-all">
          <Gem className="w-6 h-6 fill-duo-blue text-duo-blue" />
          <span>{user.gems}</span>
        </Link>

        {/* Hearts */}
        <Link href="/hearts" className="flex items-center gap-1.5 text-duo-red hover:opacity-80 transition-all">
          <Heart className="w-6 h-6 fill-duo-red text-duo-red" />
          <span>{user.hearts}</span>
        </Link>

        {/* User Profile Avatar */}
        <Link href="/profile" className="w-9 h-9 rounded-full border-2 border-duo-green overflow-hidden hover:scale-105 transition-all">
          <img src={user.avatar_url} alt="Ashutosh Raj" className="w-full h-full object-cover" />
        </Link>
      </div>
    </header>
  );
};
