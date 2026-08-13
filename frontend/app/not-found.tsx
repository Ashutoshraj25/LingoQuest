"use client";

import React from "react";
import Link from "next/link";
import { Mascot } from "@/components/ui/Mascot";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <Mascot mood="thinking" size={140} speechBubble="Oops! Page not found." />

      <h1 className="text-4xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mt-4 mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-sm font-semibold text-gray-500 max-w-sm mb-8">
        The page you are looking for doesn't exist or has been moved. Let's get you back on track!
      </p>

      <Link href="/">
        <Button variant="green" size="lg">
          BACK TO DASHBOARD
        </Button>
      </Link>
    </div>
  );
}
