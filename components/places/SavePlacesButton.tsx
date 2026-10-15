"use client";

import { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa";
import { FiBookmark } from "react-icons/fi";

type SavePlaceButtonProps = {
  placeId: string;
  mode: "local" | "visitor";
};

export default function SavePlaceButton({
  placeId,
  mode,
}: SavePlaceButtonProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function checkSaved() {
      try {
        const response = await fetch("/api/saved-places");

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        const isSaved = (data.saved_places ?? []).some(
          (savedPlace: { place_id: string }) =>
            savedPlace.place_id === placeId
        );

        setSaved(isSaved);
      } catch (error) {
        console.error(
          "Failed to check saved place:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    checkSaved();
  }, [placeId]);

  async function handleToggle() {
    if (updating) return;

    setUpdating(true);

    try {
      const response = await fetch(
        saved
          ? `/api/saved-places/${placeId}`
          : "/api/saved-places",
        {
          method: saved ? "DELETE" : "POST",
          headers: saved
            ? undefined
            : {
                "Content-Type": "application/json",
              },
          body: saved
            ? undefined
            : JSON.stringify({
                place_id: placeId,
              }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = `/login?mode=${mode}`;
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Failed to update saved place."
        );
      }

      setSaved((current) => !current);
    } catch (error) {
      console.error(
        "Failed to update saved place:",
        error
      );
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <button
        type="button"
        disabled
        className="rounded-xl border border-(--border) px-4 py-2 text-sm font-semibold text-slate-400"
      >
        Save
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={updating}
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
        saved
          ? mode === "local"
            ? "border-(--local) bg-(--local-light) text-(--local-dark)"
            : "border-(--visitor) bg-(--visitor-light) text-(--visitor-dark)"
          : "border-(--border) bg-white text-(--heading)"
      }`}
    >
      {saved ? (
        <FaBookmark size={14} aria-hidden="true" />
      ) : (
        <FiBookmark size={16} aria-hidden="true" />
      )}
      <span>
        {updating
          ? "Saving..."
          : saved
            ? "Saved"
            : "Save place"}
      </span>
    </button>
  );
}