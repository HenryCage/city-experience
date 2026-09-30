"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative border-b border-(--border) bg-(--background)">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--local) text-white">
            <span className="text-lg">●</span>
          </div>

          <span className="font-(--font-playfair) text-xl text-(--heading)">
            City Experience
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-(--heading)"
          >
            Home
          </Link>

          <Link
            href="/explore"
            className="text-sm transition hover:text-(--visitor)"
          >
            Explore
          </Link>

          <Link
            href="/#how-it-works"
            className="text-sm transition hover:text-(--visitor)"
          >
            How it works
          </Link>

          <Link
            href="/blog"
            className="text-sm transition hover:text-(--visitor)"
          >
            Blog
          </Link>
        </div>

        {/* Desktop authentication */}
        <div className="hidden items-center gap-5 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-(--heading)"
          >
            Log in
          </Link>

          <Link
            href="/signup"
            className="rounded-full bg-(--visitor) px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-(--visitor-dark)"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((previous) => !previous)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-(--border) md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <div className="flex w-4 flex-col gap-1">
            <span className="h-0.5 w-full bg-(--heading)" />
            <span className="h-0.5 w-full bg-(--heading)" />
            <span className="h-0.5 w-full bg-(--heading)" />
          </div>
        </button>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="absolute left-0 top-full z-50 w-full border-b border-(--border) bg-(--background) px-6 py-6 shadow-sm md:hidden">
          <div className="flex flex-col gap-5">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            <Link href="/explore" onClick={() => setMenuOpen(false)}>
              Explore
            </Link>

            <Link href="/#how-it-works" onClick={() => setMenuOpen(false)}>
              How it works
            </Link>

            <Link href="/blog" onClick={() => setMenuOpen(false)}>
              Blog
            </Link>

            <div className="my-1 border-t border-(--border)" />

            <Link href="/login" onClick={() => setMenuOpen(false)}>
              Log in
            </Link>

            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className="flex w-full justify-center rounded-full bg-(--visitor) px-6 py-3 font-semibold text-white"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}