import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-(--background)">
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--local) text-white">
            <span className="text-lg">●</span>
          </div>

          <span className="text-lg font-bold text-(--heading) sm:text-xl">
            City Experience
          </span>
        </Link>

        {/* Authentication */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/login"
            className="text-sm font-medium text-(--heading) transition hover:text-(--visitor)"
          >
            Log in
          </Link>

          <Link
            href="/signup"
            className="rounded-full bg-(--visitor) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--visitor-dark) sm:px-6"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}