import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-(--background) px-6 pb-8 pt-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 border-t border-(--border) pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="text-lg font-bold text-(--heading)"
        >
          City Experience
        </Link>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
          <Link href="/explore" className="hover:text-(--heading)">
            Explore
          </Link>

          <Link href="/#how-it-works" className="hover:text-(--heading)">
            How it works
          </Link>

          <Link href="/login" className="hover:text-(--heading)">
            Log in
          </Link>

          <Link href="/signup" className="hover:text-(--heading)">
            Sign up
          </Link>
        </nav>

        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} City Experience
        </p>
      </div>
    </footer>
  );
}