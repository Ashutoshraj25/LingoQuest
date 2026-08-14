"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Dumbbell,
  Trophy,
  Target,
  ShoppingBag,
  User,
  BarChart3,
  Award,
  Settings,
  Sparkles,
} from "lucide-react";
import { clsx } from "clsx";

export const navItems = [
  { label: "Learn", href: "/", icon: BookOpen, color: "text-duo-green" },
  { label: "Practice", href: "/practice", icon: Dumbbell, color: "text-duo-blue" },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy, color: "text-duo-yellow" },
  { label: "Quests", href: "/daily-goals", icon: Target, color: "text-duo-orange" },
  { label: "Shop", href: "/shop", icon: ShoppingBag, color: "text-duo-purple" },
  { label: "Profile", href: "/profile", icon: User, color: "text-duo-blue" },
  { label: "Stats", href: "/statistics", icon: BarChart3, color: "text-duo-green" },
  { label: "Showcase", href: "/achievements", icon: Award, color: "text-duo-yellow" },
  { label: "Settings", href: "/settings", icon: Settings, color: "text-gray-500" },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 fixed left-0 top-0 bottom-0 bg-white dark:bg-slate-900 border-r-2 border-gray-200 dark:border-slate-800 p-4 flex flex-col justify-between z-40 hidden lg:flex">
      <div>
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-duo-green flex items-center justify-center text-white shadow-duo-green font-extrabold text-xl">
            L
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-duo-green font-['Fredoka']">
            LingoQuest
          </span>
        </Link>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all duration-150 border-2",
                  isActive
                    ? "bg-sky-50 dark:bg-slate-800 border-duo-blue text-duo-blue shadow-sm"
                    : "border-transparent text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/60"
                )}
              >
                <Icon className={clsx("w-6 h-6", isActive ? "text-duo-blue" : item.color)} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Super Card */}
      <div className="p-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl text-white shadow-duo-yellow cursor-pointer hover:opacity-95 transition-all">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
          <span className="font-extrabold text-sm uppercase">LingoQuest Plus</span>
        </div>
        <p className="text-xs font-semibold text-amber-100">Unlimited Hearts & Zero Ads</p>
      </div>
    </aside>
  );
};
