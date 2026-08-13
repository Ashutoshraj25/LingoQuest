"use client";

import React from "react";
import { Mascot } from "@/components/ui/Mascot";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <Mascot mood="excited" size={120} speechBubble="Loading your language quest..." />
      <div className="mt-4 w-48 h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-duo-green animate-pulse rounded-full w-2/3" />
      </div>
    </div>
  );
}
