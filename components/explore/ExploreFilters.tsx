import type { Mode } from "./ExploreContent";

const categories = [
  "All",
  "Food",
  "Activities",
  "Culture",
  "Nightlife",
  "Hidden Gems",
];

type Props = {
  mode: Mode;
  category: string;
  setCategory: (category: string) => void;
};

export default function ExploreFilters({
  mode,
  category,
  setCategory,
}: Props) {
  const isLocal = mode === "local";

  return (
    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        className="flex w-fit items-center gap-2 rounded-full border border-(--border) px-4 py-2 text-sm font-medium text-(--heading)"
      >
        <span>📍</span>
        Lagos
        <span className="text-slate-400">⌄</span>
      </button>

      <div className="-mx-6 overflow-x-auto px-6 pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
        <div className="flex w-max gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                category === item
                  ? isLocal
                    ? "bg-(--local) text-white"
                    : "bg-(--visitor) text-white"
                  : "border border-(--border) text-slate-500 hover:text-(--heading)"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}