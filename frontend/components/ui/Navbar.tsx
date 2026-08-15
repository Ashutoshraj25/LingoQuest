"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  Heart,
  Gem,
  ChevronDown,
  User,
  Settings,
  BarChart2,
  Trophy,
  LogOut,
  Menu,
  X,
  BookOpen,
  Dumbbell,
  Target,
  ShoppingBag,
  BarChart3,
  Award,
  Sparkles,
} from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface NavbarProps {
  user?: {
    full_name?: string;
    username?: string;
    streak?: number;
    streak_count?: number;
    xp?: number;
    hearts?: number;
    gems?: number;
    avatar_url?: string;
    language_to_learn?: string;
  };
  onLanguageChange?: () => void;
}

const INDIAN_LANGUAGES = [
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", flag: "🇮🇳" },
  { code: "te", name: "Telugu", flag: "🇮🇳" },
];

const drawerNavItems = [
  { label: "Learn", href: "/", icon: BookOpen, color: "text-duo-green" },
  { label: "Practice", href: "/practice", icon: Dumbbell, color: "text-duo-blue" },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy, color: "text-duo-yellow" },
  { label: "Quests", href: "/daily-goals", icon: Target, color: "text-duo-orange" },
  { label: "Shop", href: "/shop", icon: ShoppingBag, color: "text-duo-purple" },
  { label: "Profile", href: "/profile", icon: User, color: "text-duo-blue" },
  { label: "Statistics", href: "/statistics", icon: BarChart3, color: "text-duo-green" },
  { label: "Showcase", href: "/achievements", icon: Award, color: "text-duo-yellow" },
  { label: "Settings", href: "/settings", icon: Settings, color: "text-gray-500" },
];

export const Navbar: React.FC<NavbarProps> = ({ user: propUser, onLanguageChange }) => {
  const pathname = usePathname();
  const { user: authUser, isAuthenticated, logout } = useAuth();
  
  const user = propUser || authUser;

  const [selectedLang, setSelectedLang] = useState(
    INDIAN_LANGUAGES.find((l) => l.name === user.language_to_learn) || INDIAN_LANGUAGES[0]
  );
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (user.language_to_learn) {
      const match = INDIAN_LANGUAGES.find((l) => l.name.toLowerCase() === user.language_to_learn?.toLowerCase());
      if (match) setSelectedLang(match);
    }
  }, [user.language_to_learn]);

  // Handle ESC key press & body scroll locking for drawer accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
        setIsLangOpen(false);
        setProfileDropdownOpen(false);
      }
    };

    if (isDrawerOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const handleLanguageSelect = (lang: typeof INDIAN_LANGUAGES[0]) => {
    setSelectedLang(lang);
    setIsLangOpen(false);

    api.switchLanguage(lang.name)
      .then((updatedUser) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        if (onLanguageChange) {
          onLanguageChange();
        } else {
          window.location.reload();
        }
      })
      .catch((err) => {
        console.error("Language switch error:", err);
        window.location.reload();
      });
  };

  const streakValue = (user as any).streak_count || (user as any).streak || 5;
  const xpValue = (user as any).xp || 1240;

  return (
    <>
      <header className="h-16 fixed top-0 right-0 left-0 lg:left-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b-2 border-gray-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between z-30 transition-colors duration-300">
        {/* Left Section: Hamburger Button, Theme Toggle & Language Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hamburger Menu Button (<1024px) */}
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="lg:hidden p-2 rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-duo-green min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={isDrawerOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isDrawerOpen}
            aria-controls="mobile-navigation-drawer"
          >
            {isDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* ThemeToggle on Mobile (beside hamburger menu) */}
          <div className="lg:hidden">
            <ThemeToggle />
          </div>

          {/* Indian Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all font-extrabold text-xs sm:text-sm min-h-[44px]"
            >
              <span className="text-xl">{selectedLang.flag}</span>
              <span className="inline font-extrabold uppercase tracking-wide">
                {selectedLang.name}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {isLangOpen && (
              <div className="absolute top-12 left-0 w-48 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl p-2 z-50 max-h-64 overflow-y-auto space-y-1">
                {INDIAN_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang)}
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

          {/* ThemeToggle on Desktop (beside language selector and before streak, gems, hearts) */}
          <div className="hidden lg:flex items-center ml-1">
            <ThemeToggle />
          </div>
        </div>

        {/* Right Section: Gamification Counters or Auth CTAs */}
        <div className="flex items-center gap-2 sm:gap-4 font-extrabold text-sm sm:text-base">
          {isAuthenticated ? (
            <>
              {/* Streak */}
              <Link href="/daily-goals" className="flex items-center gap-1 sm:gap-1.5 text-duo-orange hover:opacity-80 transition-all min-h-[44px] px-1">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-duo-orange text-duo-orange animate-bounce" />
                <span>{streakValue}</span>
              </Link>

              {/* Gems */}
              <Link href="/shop" className="flex items-center gap-1 sm:gap-1.5 text-duo-blue hover:opacity-80 transition-all min-h-[44px] px-1">
                <Gem className="w-5 h-5 sm:w-6 sm:h-6 fill-duo-blue text-duo-blue" />
                <span>{user.gems || 450}</span>
              </Link>

              {/* Hearts */}
              <Link href="/hearts" className="flex items-center gap-1 sm:gap-1.5 text-duo-red hover:opacity-80 transition-all min-h-[44px] px-1">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-duo-red text-duo-red" />
                <span>{user.hearts || 5}</span>
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-duo-green overflow-hidden hover:scale-105 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-duo-green"
                  aria-label="User Profile Options"
                >
                  <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute top-12 right-0 w-52 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl p-2 z-50 space-y-1">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-700">
                      <p className="font-extrabold text-sm text-gray-800 dark:text-slate-100 truncate">{user.full_name}</p>
                      <p className="text-xs font-semibold text-gray-400 truncate">@{user.username}</p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <User className="w-4 h-4 text-duo-blue" /> Profile
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-500" /> Settings
                    </Link>

                    <Link
                      href="/statistics"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <BarChart2 className="w-4 h-4 text-duo-purple" /> Statistics
                    </Link>

                    <Link
                      href="/achievements"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Trophy className="w-4 h-4 text-duo-yellow" /> Achievements
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <button className="px-3.5 py-2 rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs font-extrabold uppercase tracking-wide text-gray-700 dark:text-slate-200 transition-all">
                  Log In
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="px-4 py-2 rounded-xl bg-duo-green text-white hover:bg-emerald-600 font-extrabold text-xs uppercase tracking-wide shadow-duo-green transition-all">
                  Create Account
                </button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* ========================================================= */}
      {/* MOBILE & TABLET SLIDE-IN NAVIGATION DRAWER (<1024px) */}
      {/* ========================================================= */}

      {/* Backdrop Blur Overlay */}
      <div
        className={clsx(
          "fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-In Navigation Drawer */}
      <aside
        id="mobile-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className={clsx(
          "fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-slate-900 border-r-2 border-gray-200 dark:border-slate-800 z-50 flex flex-col justify-between p-4 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto",
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="space-y-4">
          {/* Drawer Top Header: Logo + Close Button */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
            <Link
              href="/"
              onClick={() => setIsDrawerOpen(false)}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-2xl bg-duo-green flex items-center justify-center text-white shadow-duo-green font-extrabold text-lg">
                L
              </div>
              <span className="font-extrabold text-xl tracking-tight text-duo-green font-['Fredoka']">
                LingoQuest
              </span>
            </Link>

            <button
              ref={closeButtonRef}
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-duo-green"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Profile Card Banner */}
          <div className="p-3.5 bg-sky-50/80 dark:bg-slate-800/80 rounded-2xl border-2 border-sky-100 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-12 h-12 rounded-full border-2 border-duo-green object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-sm text-gray-800 dark:text-slate-100 truncate">
                  {user.full_name}
                </p>
                <p className="text-xs font-semibold text-gray-400 truncate">
                  @{user.username}
                </p>
                <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-xs font-extrabold text-duo-blue border border-gray-200 dark:border-slate-600">
                  <span>{selectedLang.flag}</span>
                  <span>{selectedLang.name}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid inside Drawer */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-sky-100 dark:border-slate-700 text-center font-extrabold text-xs">
              <div className="flex flex-col items-center">
                <Flame className="w-4 h-4 text-duo-orange mb-0.5 fill-duo-orange" />
                <span className="text-gray-700 dark:text-slate-200">{streakValue}</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Streak</span>
              </div>

              <div className="flex flex-col items-center">
                <Trophy className="w-4 h-4 text-duo-yellow mb-0.5" />
                <span className="text-gray-700 dark:text-slate-200">{xpValue}</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">XP</span>
              </div>

              <div className="flex flex-col items-center">
                <Gem className="w-4 h-4 text-duo-blue mb-0.5 fill-duo-blue" />
                <span className="text-gray-700 dark:text-slate-200">{user.gems || 450}</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Gems</span>
              </div>

              <div className="flex flex-col items-center">
                <Heart className="w-4 h-4 text-duo-red mb-0.5 fill-duo-red" />
                <span className="text-gray-700 dark:text-slate-200">{user.hearts || 5}</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Hearts</span>
              </div>
            </div>
          </div>

          {/* Drawer Navigation List */}
          <nav className="space-y-1">
            {drawerNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsDrawerOpen(false)}
                  className={clsx(
                    "flex items-center gap-4 px-4 py-3 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all duration-150 border-2 min-h-[44px]",
                    isActive
                      ? "bg-sky-50 dark:bg-slate-800 border-duo-blue text-duo-blue shadow-sm"
                      : "border-transparent text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/60"
                  )}
                >
                  <Icon className={clsx("w-5 h-5", isActive ? "text-duo-blue" : item.color)} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Drawer Logout Button */}
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold uppercase tracking-wider text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all border-2 border-transparent hover:border-rose-200 dark:hover:border-rose-900/40 text-left min-h-[44px]"
            >
              <LogOut className="w-5 h-5 text-rose-500" />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Drawer Footer Card */}
        <div className="mt-4 p-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl text-white shadow-duo-yellow cursor-pointer hover:opacity-95 transition-all">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span className="font-extrabold text-xs uppercase">LingoQuest Plus</span>
          </div>
          <p className="text-[11px] font-semibold text-amber-100">Unlimited Hearts & Zero Ads</p>
        </div>
      </aside>
    </>
  );
};
