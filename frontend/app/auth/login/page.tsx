"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/ui/Mascot";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState("ashutosh@example.com");
  const [password, setPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await login({ email, password, remember_me: rememberMe });
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await googleLogin({
        email: "ashutosh@example.com",
        full_name: "Ashutosh Raj",
        google_id: "google_ashutosh_1029384756",
        avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Ashutosh"
      });
    } catch (err: any) {
      setError("Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo Branding */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-duo-green flex items-center justify-center text-white shadow-duo-green font-extrabold text-2xl">
            L
          </div>
          <span className="font-extrabold text-3xl tracking-tight text-duo-green font-['Fredoka']">
            LingoQuest
          </span>
        </div>

        <Mascot mood="excited" size={110} speechBubble="Welcome Back! Ready to learn?" />

        <Card className="p-8 mt-6 text-left shadow-lg">
          <h2 className="text-2xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-2">
            Log in to your account
          </h2>
          <p className="text-xs text-gray-500 font-semibold mb-6">
            Continue your streak and master new languages!
          </p>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-600 font-bold text-xs rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 font-extrabold text-sm hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all mb-4 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>CONTINUE WITH GOOGLE</span>
          </button>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-slate-700" /></div>
            <span className="relative bg-white dark:bg-slate-900 px-3 text-xs font-bold text-gray-400 uppercase">OR CONTINUE WITH EMAIL</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ashutosh@example.com"
                className="w-full p-3 font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-duo-blue outline-none transition-all dark:text-slate-100"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase text-gray-500">Password</label>
                <Link href="/auth/forgot-password" className="text-xs font-bold text-duo-blue hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full p-3 font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-duo-blue outline-none transition-all dark:text-slate-100"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-duo-blue focus:ring-duo-blue"
                />
                <span className="text-xs font-bold text-gray-500">Remember Me</span>
              </label>
            </div>

            <Button variant="green" size="full" type="submit" disabled={loading}>
              {loading ? "LOGGING IN..." : "LOG IN"}
            </Button>
          </form>

          <p className="text-center text-xs font-bold text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-duo-blue hover:underline">
              CREATE ACCOUNT
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
