export default function ExploreSearch() {
  return (
    <div className="mt-8">
      <div className="flex items-center rounded-2xl border border-(--border) bg-white px-4 py-3">
        <span className="mr-3 text-slate-400">⌕</span>

        <input
          type="text"
          placeholder="Search places or experiences..."
          className="w-full bg-transparent text-sm text-(--heading) outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}