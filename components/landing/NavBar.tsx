import Link from "next/link";

type NavbarProps = {
  mode?: "local" | "visitor";
};

export default function Navbar({
  mode = "visitor",
}: NavbarProps) {
  return (
    <header className="bg-(--background)">
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--local) text-white">
            <span className="text-lg">●</span>
          </div>

          <span className="text-lg font-bold text-(--heading) sm:text-xl">
            City Experience
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href={`/login?mode=${mode}`}
            className="text-sm font-medium text-(--heading) transition hover:text-(--visitor)"
          >
            Log in
          </Link>

          <Link
            href={`/signup?mode=${mode}`}
            className="rounded-full bg-(--visitor) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--visitor-dark) sm:px-6"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}