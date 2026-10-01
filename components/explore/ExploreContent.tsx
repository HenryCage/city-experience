"use client";

import { useState } from "react";
import ExploreTopBar from "./ExploreTopBar";
import ExploreSearch from "./ExploreSearch";
import ExploreFilters from "./ExploreFilters";
import MustSeePlaces from "./MustSeePlaces";
import PopularExperiences from "./PopularExperiences";
// import ExploreBottomNav from "./ExploreBottomNav";

export type Mode = "local" | "visitor";

export default function ExploreContent() {
  const [mode, setMode] = useState<Mode>("local");
  const [category, setCategory] = useState("All");

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-5 sm:px-6">
      <ExploreTopBar mode={mode} setMode={setMode} />
      <ExploreSearch />
      <ExploreFilters
        mode={mode}
        category={category}
        setCategory={setCategory}
      />

      <MustSeePlaces mode={mode} />
      <PopularExperiences mode={mode} />
    </div>
  );
}