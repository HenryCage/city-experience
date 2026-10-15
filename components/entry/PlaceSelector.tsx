"use client";

import { useEffect, useState } from "react";
import { FiMapPin, FiSearch } from "react-icons/fi";

type Place = {
  id: string;
  name: string;
  city: string;
  country: string;
  category?: string;
  description?: string;
  match_score?: number;
  fuzzy_score?: number;
  semantic_score?: number;
  source?: "existing";
};

type PlaceSelectorProps = {
  value: Place | null;
  onChange: (place: Place | null) => void;
  onAddNew?: (name: string) => void;
};

export default function PlaceSelector({
  value,
  onChange,
  onAddNew
}: PlaceSelectorProps) {
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setPlaces([]);
      setErrorMessage("");
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch("/api/places/match", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedQuery,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setPlaces([]);
          setErrorMessage(
            data.error ?? "Failed to search for places."
          );
          return;
        }

        setPlaces(data.matches ?? []);
      } catch (error) {
        console.error("Place matching failed:", error);

        setPlaces([]);
        setErrorMessage(
          "Something went wrong while searching for places."
        );
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [query]);

  function handleSelect(place: Place) {
    onChange(place);
    setQuery("");
    setPlaces([]);
  }

  function handleChangePlace() {
    onChange(null);
    setQuery("");
    setPlaces([]);
  }

  if (value) {
    return (
      <div>
        <label className="mb-2 block text-sm font-semibold text-(--heading)">
          Place
        </label>

        <div className="flex items-start justify-between gap-4 rounded-xl border border-(--border) bg-white p-4">
          <div className="flex min-w-0 items-start gap-3">
            <FiMapPin className="mt-1 shrink-0 text-lg text-(--local)" />

            <div className="min-w-0">
              <p className="truncate font-semibold text-(--heading)">
                {value.name}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {[value.city, value.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              {value.category && (
                <p className="mt-1 text-xs text-slate-400">
                  {value.category}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleChangePlace}
            className="shrink-0 text-sm font-semibold text-(--local)"
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <label
        htmlFor="place"
        className="mb-2 block text-sm font-semibold text-(--heading)"
      >
        Place
      </label>

      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

        <input
          id="place"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for a place..."
          autoComplete="off"
          className="w-full rounded-xl border border-(--border) bg-white py-3 pl-11 pr-4 text-sm text-(--heading) outline-none transition focus:border-(--local)"
        />
      </div>

      <p className="mt-2 text-xs text-slate-400">
        We&apos;ll check for existing places before creating a new one.
      </p>

      {errorMessage && (
        <p className="mt-2 text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      {query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-(--border) bg-white shadow-lg">
          {loading && (
            <div className="px-4 py-4">
              <p className="text-sm text-slate-500">
                Checking existing places...
              </p>
            </div>
          )}

          {!loading && places.length > 0 && (
            <div>
              <div className="border-b border-(--border) px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Possible matches
                </p>
              </div>

              {places.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => handleSelect(place)}
                  className="flex w-full items-start gap-3 border-b border-(--border) px-4 py-3 text-left transition last:border-b-0 hover:bg-(--surface)"
                >
                  <FiMapPin className="mt-1 shrink-0 text-(--local)" />

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-(--heading)">
                      {place.name}
                    </p>

                    <p className="mt-0.5 text-sm text-slate-500">
                      {[place.city, place.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>

                    {place.category && (
                      <p className="mt-1 text-xs text-slate-400">
                        {place.category}
                      </p>
                    )}
                  </div>
                </button>
              ))}

              <div className="border-t border-(--border) p-3">
                <button
                  type="button"
                  onClick={() => onAddNew?.(query.trim())}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-(--local) transition hover:bg-(--local-light)"
                >
                  Can&apos;t find it? Add “{query.trim()}” as a new place
                </button>
              </div>
            </div>
          )}

          {!loading &&
            !errorMessage &&
            places.length === 0 && (
              <div className="p-4">
                <p className="text-sm text-slate-500">
                  No matching places found. You can add it as a new place.
                </p>

                <button
                  type="button"
                  onClick={() => onAddNew?.(query.trim())}
                  className="mt-3 text-sm font-semibold text-(--local)"
                >
                  + Add “{query.trim()}” as a new place
                </button>
              </div>
            )}
        </div>
      )}
    </div>
  );
}