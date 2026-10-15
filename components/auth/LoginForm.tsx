"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/supabase";
import type { AuthMode } from "./AuthShell";

type LoginFormProps = {
  mode: AuthMode;
};

export default function LoginForm({ mode }: LoginFormProps) {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isLocal = mode === "local";

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") ?? "").trim();

    const password = String(formData.get("password") ?? "");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setErrorMessage(
          "Please confirm your email before logging in."
        );
      } else {
        setErrorMessage(error.message);
      }

      setLoading(false);
      return;
    }

    router.push(`/explore?mode=${mode}`);
    router.refresh();
  }

  
  async function handleGoogleAuth() {
    const redirectTo =
      `${window.location.origin}/auth/callback?mode=${mode}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold text-(--heading)">
          Welcome back
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
          Log in to continue discovering cities through real experiences.
        </p>
      </div>

      <form
        onSubmit={handleLogin}
        className="mt-7 space-y-5"
      >
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-(--heading)"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--heading) outline-none placeholder:text-slate-400 focus:border-slate-400"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-(--heading)"
            >
              Password
            </label>

            <Link
              href={`/forgot-password?mode=${mode}`}
              className={`text-xs font-semibold ${
                isLocal ? "text-(--local)" : "text-(--visitor)"
              }`}
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-(--border) bg-white px-4 py-3 pr-14 text-sm text-(--heading) outline-none placeholder:text-slate-400 focus:border-slate-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {errorMessage && (
          <p className="text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-full px-6 py-3.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
            isLocal
              ? "bg-(--local) hover:bg-(--local-dark)"
              : "bg-(--visitor) hover:bg-(--visitor-dark)"
          }`}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-(--border)" />
        <span className="text-xs text-slate-400">or</span>
        <div className="h-px flex-1 bg-(--border)" />
      </div>

      <button
        type="button"
        onClick={handleGoogleAuth}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-(--border) bg-white px-6 py-3.5 text-sm font-semibold text-(--heading) transition hover:bg-(--surface)"
      >
        <FcGoogle className="text-xl" />
        Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href={`/signup?mode=${mode}`}
          className={`font-semibold ${
            isLocal ? "text-(--local)" : "text-(--visitor)"
          }`}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}