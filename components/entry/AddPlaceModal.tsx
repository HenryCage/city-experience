"use client";

import { useEffect, useState } from "react";
import { FiMapPin, FiX } from "react-icons/fi";

type ExternalPlace = {
  external_place_id: string | null;
  name: string;
  address: string;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
};

type AddPlaceModalProps = {
  open: boolean;
  initialQuery: string;
  onClose: () => void;
  onSelect: (place: ExternalPlace) => void;
};

const MIN_QUERY_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 400;

// Debounced external place search. Ignores responses from superseded queries.
function usePlaceSearch(query: string, open: boolean) {
  const [places, setPlaces] = useState<ExternalPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open) return;

    const trimmedQuery = query.trim();

    if (trimmedQuery.length < MIN_QUERY_LENGTH) {
      setPlaces([]);
      return;
    }

    let cancelled = false;

    const timeout = setTimeout(async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch("/api/places/external-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: trimmedQuery }),
        });

        const data = await response.json();
        if (cancelled) return;

        if (!response.ok) {
          setErrorMessage(data.error ?? "Failed to search places.");
          return;
        }

        setPlaces(data.places ?? []);
      } catch (error) {
        if (cancelled) return;
        console.error(error);
        setErrorMessage("Something went wrong while searching.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query, open]);

  return { places, loading, errorMessage };
}

export default function AddPlaceModal({ open, initialQuery, onClose, onSelect }: AddPlaceModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const { places, loading, errorMessage } = usePlaceSearch(query, open);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  if (!open) return null;

  const showEmptyState = !loading && query.trim().length >= MIN_QUERY_LENGTH && places.length === 0 && !errorMessage;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="max-h-[80vh] w-full overflow-hidden rounded-t-3xl bg-(--background) shadow-xl sm:max-w-lg sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-(--border) px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-(--local)">Add a place</p>
            <h2 className="mt-1 text-xl font-bold text-(--heading)">Find the exact place</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-(--surface)"
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        <div className="p-5">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search place name..."
            autoFocus
            className="w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--heading) outline-none focus:border-(--local)"
          />

          {errorMessage && <p className="mt-3 text-sm text-red-600">{errorMessage}</p>}

          <div className="mt-4 max-h-96 overflow-y-auto">
            {loading && <p className="py-4 text-sm text-slate-500">Searching places...</p>}

            {!loading &&
              places.map((place) => (
                <button
                  key={place.external_place_id}
                  type="button"
                  onClick={() => onSelect(place)}
                  className="flex w-full gap-3 border-b border-(--border) px-1 py-4 text-left transition last:border-b-0 hover:bg-(--surface)"
                >
                  <FiMapPin className="mt-1 shrink-0 text-(--local)" />

                  <div>
                    <p className="font-semibold text-(--heading)">{place.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{place.address}</p>
                  </div>
                </button>
              ))}

            {showEmptyState && <p className="py-6 text-center text-sm text-slate-500">No places found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}