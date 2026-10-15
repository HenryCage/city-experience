"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/supabase";
import type { AuthMode } from "./AuthShell";

type SignupFormProps = {
  mode: AuthMode;
};

export default function SignupForm({ mode }: SignupFormProps) {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  const isLocal = mode === "local";

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (usernameStatus === "taken") {
      setErrorMessage("Please choose a different username.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("")

    const formData = new FormData(event.currentTarget);

    const displayName = String(formData.get("display_name") ?? "");
    const username = String(formData.get("username") ?? "")
      .trim()
      .toLowerCase();
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: displayName,
        },
        emailRedirectTo: `${window.location.origin}/login?mode=${mode}&confirmed=true`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push(`/explore?mode=${mode}`);
      router.refresh();
      return;
    }

    setSuccessMessage(
      "Check your email to confirm your account before logging in."
    );

    setLoading(false);
  }

  async function checkUsername(usernameValue: string) {
    const username = usernameValue.trim().toLowerCase();

    if (!username) {
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus("checking");

    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (error) {
      console.error(error.message);
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus(data ? "taken" : "available");
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
          Create your account
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
          Start discovering cities through real experiences.
        </p>
      </div>

      <form
        onSubmit={handleSignup}
        className="mt-7 space-y-5"
      >
        <div>
          <label
            htmlFor="display_name"
            className="mb-2 block text-sm font-semibold text-(--heading)"
          >
            Name
          </label>

          <input
            id="display_name"
            name="display_name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className="w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--heading) outline-none placeholder:text-slate-400 focus:border-slate-400"
          />
        </div>

        <div>
          <label
            htmlFor="username"
            className="mb-2 block text-sm font-semibold text-(--heading)"
          >
            Username
          </label>

          <input
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            placeholder="Choose a username"
            onBlur={(event) => checkUsername(event.target.value)}
            className="w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--heading) outline-none placeholder:text-slate-400 focus:border-slate-400"
          />

          {usernameStatus === "checking" && (
            <p className="mt-2 text-xs text-slate-400">
              Checking username...
            </p>
          )}

          {usernameStatus === "available" && (
            <p className="mt-2 text-xs text-emerald-600">
              Username is available
            </p>
          )}

          {usernameStatus === "taken" && (
            <p className="mt-2 text-xs text-red-600">
              Username is already taken
            </p>
          )}
        </div>

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
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold text-(--heading)"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Create a password"
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

        {successMessage && (
          <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

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
          {loading ? "Creating account..." : "Create account"}
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
        Already have an account?{" "}
        <Link
          href={`/login?mode=${mode}`}
          className={`font-semibold ${
            isLocal ? "text-(--local)" : "text-(--visitor)"
          }`}
        >
          Log in
        </Link>
      </p>
    </div>
  );
}