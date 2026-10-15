"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBookmark } from "react-icons/fa";

type SavedPlace = {
  place_id: string;
  created_at: string;
  places: {
    id: string;
    name: string;
    city: string;
    country: string;
    category: string;
    description: string | null;
    formatted_address: string | null;
  } | null;
};

export default function SavedPlacesView() {
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [removingIds, setRemovingIds] = useState<Set<string>>(
    new Set()
  );

  async function handleUnsave(placeId: string) {
    if (removingIds.has(placeId)) return;

    setRemovingIds((current) => {
      const next = new Set(current);
      next.add(placeId);
      return next;
    });

    try {
      const response = await fetch(
        `/api/saved-places/${placeId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "Failed to unsave place."
        );
      }

      setSavedPlaces((current) =>
        current.filter(
          (saved) => saved.place_id !== placeId
        )
      );
    } catch (error) {
      console.error(
        "Failed to unsave place:",
        error
      );
    } finally {
      setRemovingIds((current) => {
        const next = new Set(current);
        next.delete(placeId);
        return next;
      });
    }
  }

  useEffect(() => {
    async function loadSavedPlaces() {
      try {
        const response = await fetch("/api/saved-places");

        const text = await response.text();

        console.log("saved-places status:", response.status);
        console.log("saved-places response:", text);

        if (!response.ok) {
          setErrorMessage(
            `Failed to load saved places (${response.status})`
          );
          return;
        }

        const data = JSON.parse(text);

        setSavedPlaces(data.saved_places ?? []);
      } catch (error) {
        console.error("Failed to load saved places:", error);

        setErrorMessage(
          "Something went wrong while loading saved places."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSavedPlaces();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-sm text-slate-500">
          Loading saved places...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div>
        <p className="text-sm font-semibold text-slate-500">
          Your collection
        </p>

        <h1 className="mt-1 text-3xl font-bold text-(--heading)">
          Saved Places
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Places you want to come back to.
        </p>
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {!errorMessage && savedPlaces.length === 0 && (
        <div className="mt-8 rounded-2xl border border-(--border) bg-white p-8 text-center">
          <h2 className="font-semibold text-(--heading)">
            No saved places yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Save places from Explore and they&apos;ll appear here.
          </p>

          <Link
            href="/explore"
            className="mt-4 inline-block text-sm font-semibold text-(--local)"
          >
            Explore places →
          </Link>
        </div>
      )}

      {savedPlaces.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedPlaces.map((saved) => {
            const place = saved.places;

            if (!place) {
              return null;
            }

            const removing =
              removingIds.has(place.id);

            return (
              <div
                key={saved.place_id}
                className="relative overflow-hidden rounded-2xl border border-(--border) bg-white"
              >
                <Link
                  href={`/places/${place.id}`}
                  className="block p-5"
                >
                  <h2 className="pr-10 text-base font-bold text-(--heading)">
                    {place.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {[place.city, place.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  {place.category && (
                    <p className="mt-3 text-xs font-semibold text-(--local)">
                      {place.category}
                    </p>
                  )}

                  {place.formatted_address && (
                    <p className="mt-2 line-clamp-2 text-xs text-slate-400">
                      {place.formatted_address}
                    </p>
                  )}
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    handleUnsave(place.id)
                  }
                  disabled={removing}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-(--surface) text-lg text-(--local) transition hover:bg-(--local-light) disabled:opacity-50"
                  aria-label={`Unsave ${place.name}`}
                >
                  <FaBookmark size={16} aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}