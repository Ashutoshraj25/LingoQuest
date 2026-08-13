"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/ui/Mascot";
import { api } from "@/lib/api";
import { getPostAuthRedirect, getStoredToken, persistAuthSession } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [redirectTo, setRedirectTo] = useState("/");
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "ashutosh@example.com",
      password: "password123",
      rememberMe: true,
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextRedirect = getPostAuthRedirect(params.get("redirectTo"));
    if (getStoredToken()) {
      router.replace(nextRedirect);
      return;
    }

    setRedirectTo(nextRedirect);
  }, [router]);

  const handleGuestLogin = async () => {
    setFormError(null);
    setLoading(true);
    try {
      const response = await api.guestLogin();
      persistAuthSession(response.access_token, response.user);
      router.push(redirectTo);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to start a guest session right now.";
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemoAccount = () => {
    setValue("email", "ashutosh@example.com");
    setValue("password", "password123");
    setValue("rememberMe", true);
    setFormError(null);
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginFormValues | undefined;
        if (field) {
          setError(field, { type: "manual", message: issue.message });
        }
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.login({
        email: parsed.data.email,
        password: parsed.data.password,
        remember_me: parsed.data.rememberMe,
      });
      persistAuthSession(response.access_token, response.user);
      router.push(redirectTo);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to log in right now.";
      setFormError(message);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-duo-green flex items-center justify-center text-white shadow-duo-green font-extrabold text-2xl">
            L
          </div>
          <span className="font-extrabold text-3xl tracking-tight text-duo-green font-['Fredoka']">
            LingoQuest
          </span>
        </div>

        <Mascot mood="excited" size={110} speechBubble="Welcome back! Ready to learn?" />

        <Card className="p-8 mt-6 text-left shadow-lg">
          <h2 className="text-2xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-2">
            Log in to your account
          </h2>
          <p className="text-xs text-gray-500 font-semibold mb-6">
            Continue your streak and master new languages!
          </p>

          <div className="mb-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-left">
            <p className="text-xs font-extrabold uppercase text-sky-700">Demo Account</p>
            <p className="mt-1 text-sm font-bold text-slate-700">Email: `ashutosh@example.com`</p>
            <p className="text-sm font-bold text-slate-700">Password: `password123`</p>
            <button
              type="button"
              onClick={handleUseDemoAccount}
              className="mt-2 text-xs font-extrabold text-duo-blue hover:underline"
            >
              USE DEMO CREDENTIALS
            </button>
          </div>

          {formError && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-600 font-bold text-xs rounded-xl border border-rose-200">
              {formError}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase text-gray-500 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full p-3 font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-duo-blue outline-none transition-all dark:text-slate-100"
                {...register("email")}
              />
              {errors.email && <p className="mt-1 text-xs font-bold text-rose-600">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-xs font-bold uppercase text-gray-500">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-xs font-bold text-duo-blue hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-duo-blue outline-none transition-all dark:text-slate-100"
                {...register("password")}
              />
              {errors.password && <p className="mt-1 text-xs font-bold text-rose-600">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-duo-blue focus:ring-duo-blue"
                  {...register("rememberMe")}
                />
                <span className="text-xs font-bold text-gray-500">Remember Me</span>
              </label>
            </div>

            <Button variant="green" size="full" type="submit" disabled={loading}>
              {loading ? "LOGGING IN..." : "LOG IN"}
            </Button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-slate-700" />
            </div>
            <span className="relative bg-white dark:bg-slate-900 px-3 text-xs font-bold text-gray-400 uppercase">OR</span>
          </div>

          <Button variant="blue" size="full" onClick={handleGuestLogin} disabled={loading}>
            CONTINUE AS GUEST
          </Button>

          <p className="text-center text-xs font-bold text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link href={`/auth/register?redirectTo=${encodeURIComponent(redirectTo)}`} className="text-duo-blue hover:underline">
              CREATE ACCOUNT
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
