"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FiCompass, FiPlusCircle, FiBookmark, FiUser } from "react-icons/fi";

const navItems = [
  { label: "Explore", href: "/explore", icon: FiCompass },
  { label: "New Entry", href: "/entry", icon: FiPlusCircle },
  { label: "Saved Places", href: "/saved", icon: FiBookmark },
  { label: "Profile", href: "/profile", icon: FiUser },
];

export default function AppNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode") === "visitor" ? "visitor" : "local";

  return (
    <>
      {/* Desktop */}
      <header className="hidden border-b border-(--border) bg-(--background) md:block">
        <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Link href={`/explore?mode=${mode}`} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--local) text-white">
              <span className="text-lg">●</span>
            </div>

            <span className="text-xl font-bold text-(--heading)">
              City Experience
            </span>
          </Link>

          <div className="flex items-center gap-7">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const href = `${item.href}?mode=${mode}`;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-semibold transition ${
                    active
                      ? "text-(--local)"
                      : "text-(--heading) hover:text-(--visitor)"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-(--border) bg-(--background) md:hidden">
        <div className="grid grid-cols-4">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const href = `${item.href}?mode=${mode}`;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col min-h-16 items-center justify-center px-2 text-center text-xs font-semibold transition ${
                  active
                    ? "text-(--local)"
                    : "text-slate-500"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}