import Link from "next/link";
import type { Mode } from "./ExploreContent";

type Props = {
  mode: Mode;
  setMode: (mode: Mode) => void;
};

export default function ExploreTopBar({ mode, setMode }: Props) {
  const isLocal = mode === "local";

  return (
    <div>
      {/* Top row */}
      <div className="relative flex items-center justify-between">
        <Link
          href="/"
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-(--heading)"
          aria-label="Go back"
        >
          ←
        </Link>

        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-(--heading)">
          Explore
        </h1>
      </div>

      {/* City selector */}
      <button
        type="button"
        className="mx-auto mt-2 flex items-center gap-1.5 text-sm font-semibold text-(--heading)"
      >
        <span className="text-(--visitor)">●</span>
        Lagos, Nigeria
        <span className="text-slate-400">⌄</span>
      </button>

      {/* Mode toggle */}
      <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-xl border border-(--border)">
        <button
          type="button"
          onClick={() => setMode("local")}
          className={`py-3 text-sm font-semibold transition ${
            isLocal
              ? "bg-(--local) text-white"
              : "bg-(--local-light) text-(--local)"
          }`}
        >
          Local
        </button>

        <button
          type="button"
          onClick={() => setMode("visitor")}
          className={`py-3 text-sm font-semibold transition ${
            !isLocal
              ? "bg-(--visitor) text-white"
              : "bg-(--visitor-light) text-(--visitor)"
          }`}
        >
          Visitor
        </button>
      </div>
    </div>
  );
}