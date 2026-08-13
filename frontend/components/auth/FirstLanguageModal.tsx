"use client";

import React from "react";
import { Sparkles, Globe, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

const INDIAN_LANGUAGES = [
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳", desc: "Master Devanagari script, daily greetings & conversation." },
  { code: "mr", name: "Marathi", native: "मराठी", flag: "🇮🇳", desc: "Learn authentic Maharashtrian Marathi, Namaskar & culture." },
  { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇮🇳", desc: "Explore sweet Bengali phrases, Nomoshkar & literature." },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳", desc: "Discover classical Tamil, Vanakkam & South Indian culture." },
  { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳", desc: "Learn sweet Telugu vocabulary, Namaskaram & Andhra traditions." },
];

interface FirstLanguageModalProps {
  isOpen: boolean;
  onSelectLanguage: (langName: string) => void;
}

export const FirstLanguageModal: React.FC<FirstLanguageModalProps> = ({ isOpen, onSelectLanguage }) => {
  if (!isOpen) return null;

  const handleSelect = (langName: string) => {
    api.switchLanguage(langName)
      .then(() => {
        onSelectLanguage(langName);
      })
      .catch((err) => {
        console.error("Error setting language:", err);
        onSelectLanguage(langName);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border-4 border-duo-green rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 transform transition-all">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-duo-green/10 text-duo-green rounded-2xl flex items-center justify-center mx-auto mb-2 border-2 border-duo-green/30">
            <Globe className="w-10 h-10 animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-slate-100 tracking-tight">
            Welcome to LingoQuest! 🇮🇳
          </h2>
          <p className="text-sm sm:text-base font-bold text-gray-500 dark:text-slate-400">
            Select the Indian language you want to learn first:
          </p>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {INDIAN_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.name)}
              className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-gray-200 dark:border-slate-800 hover:border-duo-green dark:hover:border-duo-green bg-white dark:bg-slate-800/80 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all text-left group shadow-sm"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl sm:text-4xl">{lang.flag}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base sm:text-lg text-gray-800 dark:text-slate-100">
                      {lang.name}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300">
                      {lang.native}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-gray-400 dark:text-slate-400 line-clamp-1">
                    {lang.desc}
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-700 group-hover:bg-duo-green text-gray-400 group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>

        <div className="text-center pt-2">
          <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
            You can switch learning languages anytime from top menu or settings
          </p>
        </div>
      </div>
    </div>
  );
};
