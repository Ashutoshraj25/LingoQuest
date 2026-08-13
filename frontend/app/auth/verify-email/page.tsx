"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/ui/Mascot";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerified(true);
    setTimeout(() => router.push("/"), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-duo-green flex items-center justify-center text-white font-extrabold text-2xl">
            L
          </div>
          <span className="font-extrabold text-3xl tracking-tight text-duo-green font-['Fredoka']">
            LingoQuest
          </span>
        </div>

        <Mascot mood="excited" size={110} speechBubble="Verify your email address!" />

        <Card className="p-8 mt-6 text-left shadow-lg">
          <h2 className="text-2xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-2">
            Verify Email OTP
          </h2>
          <p className="text-xs text-gray-500 font-semibold mb-6">
            Enter the 6-digit verification code sent to your email.
          </p>

          {verified ? (
            <div className="p-4 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-2xl text-center border border-emerald-200">
              Email Verified Successfully! Redirecting to Dashboard...
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">6-Digit Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full p-3 font-bold text-center tracking-widest text-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-duo-blue outline-none dark:text-slate-100"
                />
              </div>

              <Button variant="green" size="full" type="submit">
                VERIFY & CONTINUE
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
