"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBookmark } from "react-icons/fa";
import { FiBookmark } from "react-icons/fi";

import type {
  Mode,
  ExplorePlace,
  ExploreExperience,
} from "./ExploreContent";

type MustSeePlacesProps = {
  mode: Mode;
  places: ExplorePlace[];
  experiences: ExploreExperience[];
};

export default function MustSeePlaces({
  mode,
  places,
  experiences,
}: MustSeePlacesProps) {
  const isLocal = mode === "local";

  const [savedPlaceIds, setSavedPlaceIds] = useState<Set<string>>(
    new Set()
  );

  const [savingPlaceIds, setSavingPlaceIds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    async function loadSavedPlaces() {
      try {
        const response = await fetch("/api/saved-places");

        if (!response.ok) {
          // Public users may not be logged in.
          return;
        }

        const data = await response.json();

        const ids = new Set<string>(
          (data.saved_places ?? []).map(
            (saved: { place_id: string }) => saved.place_id
          )
        );

        setSavedPlaceIds(ids);
      } catch (error) {
        console.error(
          "Failed to load saved places:",
          error
        );
      }
    }

    loadSavedPlaces();
  }, []);

  async function toggleSavedPlace(placeId: string) {
    if (savingPlaceIds.has(placeId)) {
      return;
    }

    const isSaved = savedPlaceIds.has(placeId);

    setSavingPlaceIds((current) => {
      const next = new Set(current);
      next.add(placeId);
      return next;
    });

    try {
      const response = await fetch(
        isSaved
          ? `/api/saved-places/${placeId}`
          : "/api/saved-places",
        {
          method: isSaved ? "DELETE" : "POST",
          headers: isSaved
            ? undefined
            : {
                "Content-Type": "application/json",
              },
          body: isSaved
            ? undefined
            : JSON.stringify({
                place_id: placeId,
              }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        alert("Log in to save places.");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Failed to update saved place."
        );
      }

      setSavedPlaceIds((current) => {
        const next = new Set(current);

        if (isSaved) {
          next.delete(placeId);
        } else {
          next.add(placeId);
        }

        return next;
      });
    } catch (error) {
      console.error(
        "Failed to update saved place:",
        error
      );
    } finally {
      setSavingPlaceIds((current) => {
        const next = new Set(current);
        next.delete(placeId);
        return next;
      });
    }
  }

  const placesWithData = places
    .map((place) => {
      const matchingExperiences = experiences.filter(
        (experience) =>
          experience.experience_places.some(
            (link) => link.place_id === place.id
          )
      );

      const photo =
        matchingExperiences
          .flatMap(
            (experience) =>
              experience.experience_photos
          )
          .find(
            (photo) =>
              photo.place_id === place.id
          )?.url ?? null;

      return {
        ...place,
        experienceCount:
          matchingExperiences.length,
        image: photo,
      };
    })
    .sort(
      (a, b) =>
        b.experienceCount -
        a.experienceCount
    );

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-(--heading)">
          {isLocal
            ? "Popular Near You"
            : "Must-see Places"}
        </h2>

        <Link
          href={`/explore/places?mode=${mode}`}
          className={`text-sm font-semibold ${
            isLocal
              ? "text-(--local)"
              : "text-(--visitor)"
          }`}
        >
          See all →
        </Link>
      </div>

      {placesWithData.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-(--border) bg-white p-6">
          <p className="text-sm text-slate-500">
            No places found yet.
          </p>
        </div>
      ) : (
        <div className="-mx-4 mt-4 overflow-x-auto px-4 pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
          <div className="flex w-max gap-3">
            {placesWithData.map((place) => {
              const isSaved =
                savedPlaceIds.has(place.id);

              const isSaving =
                savingPlaceIds.has(place.id);

              return (
                <Link
                  key={place.id}
                  href={`/places/${place.id}?mode=${mode}`}
                  className="w-64 shrink-0 overflow-hidden rounded-2xl border border-(--border) bg-white"
                >
                  <article>
                    <div className="relative aspect-4/3 overflow-hidden bg-(--surface)">
                      {place.image ? (
                        <Image
                          src={place.image}
                          alt={place.name}
                          fill
                          className="object-cover"
                          sizes="224px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-4 text-center text-xs text-slate-400">
                          No photo yet
                        </div>
                      )}

                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();

                          toggleSavedPlace(
                            place.id
                          );
                        }}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm disabled:opacity-50"
                        aria-label={
                          isSaved
                            ? `Unsave ${place.name}`
                            : `Save ${place.name}`
                        }
                      >
                        {isSaved ? (
                          <FaBookmark
                            size={16}
                            aria-hidden="true"
                            className="text-(--local)"
                          />
                        ) : (
                          <FiBookmark
                            size={18}
                            aria-hidden="true"
                            className="text-slate-700"
                          />
                        )}
                      </button>
                    </div>

                    <div className="p-3">
                      <h3 className="line-clamp-1 text-sm font-bold text-(--heading)">
                        {place.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {place.category}
                      </p>

                      <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                        {[
                          place.city,
                          place.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>

                      <p className="mt-2 text-xs font-medium text-slate-500">
                        {
                          place.experienceCount
                        }{" "}
                        {place.experienceCount ===
                        1
                          ? "experience"
                          : "experiences"}
                      </p>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}