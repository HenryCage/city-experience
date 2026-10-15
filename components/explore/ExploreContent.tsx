"use client";

import { useState } from "react";
import ExploreTopBar from "./ExploreTopBar";
import ExploreSearch from "./ExploreSearch";
import ExploreFilters from "./ExploreFilters";
import MustSeePlaces from "./MustSeePlaces";
import PopularExperiences from "./PopularExperiences";

export type Mode =
  | "local"
  | "visitor";

export type ExplorePlace = {
  id: string;
  name: string;
  city: string;
  country: string;
  category: string;
  description: string | null;
  created_at: string;
};

export type ExplorePhoto = {
  id: string;
  url: string;
  place_id: string;
};

export type ExperiencePlace = {
  place_id: string;
};

export type ExploreExperience = {
  id: string;
  title: string;
  description: string;
  mode: Mode;
  created_at: string;
  experience_places: ExperiencePlace[];
  experience_photos: ExplorePhoto[];
};

type ExploreContentProps = {
  initialMode: Mode;
  places: ExplorePlace[];
  experiences: ExploreExperience[];
};

export default function ExploreContent({
  initialMode,
  places,
  experiences,
}: ExploreContentProps) {
  const [mode, setMode] =
    useState<Mode>(initialMode);

  const [category, setCategory] =
    useState("All");

  const filteredExperiences =
    experiences.filter(
      (experience) =>
        experience.mode === mode
    );

  const filteredPlaces =
    places.filter((place) => {
      if (category === "All") {
        return true;
      }

      return (
        place.category === category
      );
    });

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-5 sm:px-6">
      <ExploreTopBar
        mode={mode}
        setMode={setMode}
      />

      <ExploreSearch />

      <ExploreFilters
        mode={mode}
        category={category}
        setCategory={setCategory}
      />

      <MustSeePlaces
        mode={mode}
        places={filteredPlaces}
        experiences={
          filteredExperiences
        }
      />

      <PopularExperiences
        mode={mode}
        places={places}
        experiences={
          filteredExperiences
        }
      />
    </div>
  );
}