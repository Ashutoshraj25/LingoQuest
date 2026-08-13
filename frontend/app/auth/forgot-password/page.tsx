"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/ui/Mascot";
import { api } from "@/lib/api";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const parsed = forgotPasswordSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ForgotPasswordValues | undefined;
        if (field) {
          setError(field, { type: "manual", message: issue.message });
        }
      });
      return;
    }

    setLoading(true);
    try {
      await api.forgotPassword({ email: parsed.data.email });
      setSubmittedEmail(parsed.data.email);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit your request right now.";
      setFormError(message);
    } finally {
      setLoading(false);
    }
  });

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

        <Mascot mood="thinking" size={110} speechBubble="Forgot your password? No worries!" />

        <Card className="p-8 mt-6 text-left shadow-lg">
          <h2 className="text-2xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-2">
            Reset Password
          </h2>
          <p className="text-xs text-gray-500 font-semibold mb-6">
            Enter your account email and we&apos;ll send reset instructions if the account exists.
          </p>

          {submittedEmail ? (
            <div className="p-4 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-2xl text-center border border-emerald-200">
              If an account exists for {submittedEmail}, password reset instructions are on the way.
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              {formError && (
                <div className="p-3 bg-rose-50 text-rose-600 font-bold text-xs rounded-xl border border-rose-200">
                  {formError}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full p-3 font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-duo-blue outline-none dark:text-slate-100"
                  {...register("email")}
                />
                {errors.email && <p className="mt-1 text-xs font-bold text-rose-600">{errors.email.message}</p>}
              </div>

              <Button variant="blue" size="full" type="submit" disabled={loading}>
                {loading ? "SENDING..." : "SEND RESET LINK"}
              </Button>
            </form>
          )}

          <p className="text-center text-xs font-bold text-gray-400 mt-6">
            Remembered your password?{" "}
            <Link href="/auth/login" className="text-duo-blue hover:underline">
              LOG IN
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
