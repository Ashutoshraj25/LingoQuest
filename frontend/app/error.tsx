"use client";

import React, { useEffect } from "react";
import { Mascot } from "@/components/ui/Mascot";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught exception:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <Mascot mood="sad" size={140} speechBubble="Something went wrong!" />

      <h1 className="text-3xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mt-4 mb-2">
        An Unexpected Error Occurred
      </h1>
      <p className="text-sm font-semibold text-gray-500 max-w-sm mb-8">
        We encountered a temporary issue. Try refreshing the session.
      </p>

      <Button variant="green" size="lg" onClick={() => reset()}>
        TRY AGAIN
      </Button>
    </div>
  );
}
