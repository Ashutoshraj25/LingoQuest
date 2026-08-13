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
import { Zap } from "lucide-react";

const INDIAN_LANGUAGES = ["Hindi", "English", "Bengali", "Tamil", "Telugu", "Marathi", "Kannada", "Malayalam", "Gujarati", "Punjabi"];
const COUNTRIES = ["India", "United States", "United Kingdom", "Canada", "Australia", "UAE", "Singapore"];

const registerSchema = z
  .object({
    full_name: z.string().trim().min(2, "Full name is required."),
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters.")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
    email: z.string().trim().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirm_password: z.string().min(8, "Please confirm your password."),
    native_language: z.string().min(1, "Select your native language."),
    language_to_learn: z.string().min(1, "Select a language to learn."),
    country: z.string().min(1, "Select your country."),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        code: "custom",
        path: ["confirm_password"],
        message: "Passwords do not match.",
      });
    }
    if (data.native_language === data.language_to_learn) {
      ctx.addIssue({
        code: "custom",
        path: ["language_to_learn"],
        message: "Choose a different language to learn.",
      });
    }
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [redirectTo, setRedirectTo] = useState("/");
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      native_language: "English",
      language_to_learn: "Hindi",
      country: "India",
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

  const handleGuestSignIn = async () => {
    setLoading(true);
    try {
      const response = await api.guestLogin();
      persistAuthSession(response.access_token, response.user);
      router.push(redirectTo);
    } catch (error) {
      setFormError("Guest login failed.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterFormValues | undefined;
        if (field) {
          setError(field, { type: "manual", message: issue.message });
        }
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.register(parsed.data);
      persistAuthSession(response.access_token, response.user);
      router.push(redirectTo);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create your account right now.";
      setFormError(message);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 py-12">
      <div className="max-w-xl w-full text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-duo-green flex items-center justify-center text-white shadow-duo-green font-extrabold text-2xl">
            L
          </div>
          <span className="font-extrabold text-3xl tracking-tight text-duo-green font-['Fredoka']">
            LingoQuest
          </span>
        </div>

        <Mascot mood="excited" size={100} speechBubble="Create your account to start learning!" />

        <Card className="p-8 mt-6 text-left shadow-xl">
          <h2 className="text-2xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-2">
            Create Your Profile
          </h2>
          <p className="text-xs text-gray-500 font-semibold mb-6">
            Join thousands of learners mastering new languages every day.
          </p>

          {formError && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-600 font-bold text-xs rounded-xl border border-rose-200">
              {formError}
            </div>
          )}

          {/* Instant Guest Login Button */}
          <button
            type="button"
            onClick={handleGuestSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-duo-green hover:bg-emerald-600 text-white font-black text-sm transition-all mb-4 shadow-md shadow-duo-green/20"
          >
            <Zap className="w-5 h-5 fill-yellow-300 text-yellow-300 animate-bounce" />
            <span>CONTINUE AS GUEST (FAST LOG IN)</span>
          </button>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-slate-700" /></div>
            <span className="relative bg-white dark:bg-slate-900 px-3 text-xs font-bold text-gray-400 uppercase">OR FILL REGISTRATION DETAILS</span>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="full_name" className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Full Name
                </label>
                <input
                  id="full_name"
                  type="text"
                  placeholder="e.g. Ashutosh Raj"
                  className="w-full p-3 font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-duo-blue outline-none dark:text-slate-100"
                  {...register("full_name")}
                />
                {errors.full_name && <p className="mt-1 text-xs font-bold text-rose-600">{errors.full_name.message}</p>}
              </div>

              <div>
                <label htmlFor="username" className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="ashutosh_raj"
                  className="w-full p-3 font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-duo-blue outline-none dark:text-slate-100"
                  {...register("username")}
                />
                {errors.username && <p className="mt-1 text-xs font-bold text-rose-600">{errors.username.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase text-gray-500 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="ashutosh@example.com"
                className="w-full p-3 font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-duo-blue outline-none dark:text-slate-100"
                {...register("email")}
              />
              {errors.email && <p className="mt-1 text-xs font-bold text-rose-600">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3 font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-duo-blue outline-none dark:text-slate-100"
                  {...register("password")}
                />
                {errors.password && <p className="mt-1 text-xs font-bold text-rose-600">{errors.password.message}</p>}
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirm_password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3 font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-duo-blue outline-none dark:text-slate-100"
                  {...register("confirm_password")}
                />
                {errors.confirm_password && (
                  <p className="mt-1 text-xs font-bold text-rose-600">{errors.confirm_password.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="native_language" className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  I Speak
                </label>
                <select
                  id="native_language"
                  className="w-full p-3 font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-duo-blue outline-none dark:text-slate-100"
                  {...register("native_language")}
                >
                  {INDIAN_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="language_to_learn" className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  I Want to Learn
                </label>
                <select
                  id="language_to_learn"
                  className="w-full p-3 font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-duo-blue outline-none dark:text-slate-100"
                  {...register("language_to_learn")}
                >
                  {INDIAN_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                {errors.language_to_learn && (
                  <p className="mt-1 text-xs font-bold text-rose-600">{errors.language_to_learn.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="country" className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Country
                </label>
                <select
                  id="country"
                  className="w-full p-3 font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-duo-blue outline-none dark:text-slate-100"
                  {...register("country")}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button variant="green" size="full" type="submit" disabled={loading} className="mt-4">
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </Button>
          </form>

          <p className="text-center text-xs font-bold text-gray-400 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-duo-blue hover:underline">
              LOG IN
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
