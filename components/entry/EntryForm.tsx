"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Mode } from "@/components/explore/ExploreContent";
import PlaceSelector from "./PlaceSelector";
import AddPlaceModal from "./AddPlaceModal";

type EntryFormProps = {
  initialMode: Mode;
};

type SelectedPlace = {
  id: string;
  name: string;
  city: string;
  country: string;
};

export default function EntryForm({ initialMode }: EntryFormProps) {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>(initialMode);
  const [place, setPlace] = useState<SelectedPlace | null>(null);

  const [title, setTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [tags, setTags] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const isLocal = mode === "local";
  const [addPlaceOpen, setAddPlaceOpen] = useState(false);

  const [ newPlaceQuery, setNewPlaceQuery ] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const canSubmit =
    Boolean(place) &&
    title.trim().length > 0 &&
    experience.trim().length > 0 &&
    acknowledged &&
    !submitting;

  async function handleSubmit() {
    if (!place) {
      setErrorMessage(
        "Please select a place."
      );
      return;
    }

    if (!title.trim()) {
      setErrorMessage(
        "Please add a title."
      );
      return;
    }

    if (!experience.trim()) {
      setErrorMessage(
        "Please describe your experience."
      );
      return;
    }

    if (!acknowledged) {
      setErrorMessage(
        "Please acknowledge the publishing notice before posting."
      );
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // 1. Create the experience
      const response =
        await fetch(
          "/api/experiences",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              title: title.trim(),
              description:
                experience.trim(),
              place_ids: [
                place.id,
              ],
              mode,
              retention_acknowledged:
                acknowledged,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Failed to publish entry."
        );
      }

      const experienceId =
        data.experience_id;

      // 2. Upload photos
      if (photos.length > 0) {
        const formData =
          new FormData();

        for (const photo of photos) {
          formData.append(
            "file",
            photo
          );
        }

        formData.append(
          "experience_id",
          experienceId
        );

        formData.append(
          "place_id",
          place.id
        );

        const photoResponse =
          await fetch(
            "/api/experience-photos",
            {
              method: "POST",
              body: formData,
            }
          );

        const photoData =
          await photoResponse.json();

        if (!photoResponse.ok) {
          throw new Error(
            photoData.error ??
              "Entry was published, but photo upload failed."
          );
        }

        if (
          photoData.failures?.length >
          0
        ) {
          console.warn(
            "Some photos failed:",
            photoData.failures
          );
        }
      }

      setSuccessMessage(
        "Your entry has been published."
      );
      router.push(`/explore?mode=${mode}`);
      router.refresh();
    } catch (error) {
      console.error(
        "Entry submission failed:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while publishing your entry."
      );
    } finally {
      setSubmitting(false);
    }
  }
  
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold text-slate-500">
          Share your experience
        </p>

        <h1 className="mt-1 text-3xl font-bold text-(--heading)">
          New Entry
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Add a place you visited and tell people what the experience was like.
        </p>
      </div>

      <section className="rounded-2xl border border-(--border) bg-white p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Posting as
        </p>

        <div className="mt-3 grid grid-cols-2 overflow-hidden rounded-xl border border-(--border)">
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
      </section>

      <div className="mt-6 space-y-6 rounded-2xl border border-(--border) bg-white p-4 sm:p-6">
        <PlaceSelector
          value={place}
          onChange={setPlace}
          onAddNew={(name) => {
            setNewPlaceQuery(name);
            setAddPlaceOpen(true);
          }}
        />

        {/*Title*/}
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-semibold text-(--heading)"
          >
            Entry title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Give your experience a title"
            className="w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--heading) outline-none transition focus:border-(--local)"
          />
        </div>

        {/*Experience*/}
        <div>
          <label
            htmlFor="experience"
            className="mb-2 block text-sm font-semibold text-(--heading)"
          >
            Your experience
          </label>

          <textarea
            id="experience"
            rows={6}
            value={experience}
            onChange={(event) => setExperience(event.target.value)}
            placeholder="What was it like? What should someone know before going?"
            className="w-full resize-none rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--heading) outline-none transition focus:border-(--local)"
          />
        </div>

        {/*Rating*/}
        <div>
          <p className="mb-2 text-sm font-semibold text-(--heading)">
            Rating
          </p>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => {
              const selected = rating === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition ${
                    selected
                      ? isLocal
                        ? "border-(--local) bg-(--local) text-white"
                        : "border-(--visitor) bg-(--visitor) text-white"
                      : "border-(--border) text-slate-500 hover:border-(--local)"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>

        {/*Tags*/}
        <div>
          <label
            htmlFor="tags"
            className="mb-2 block text-sm font-semibold text-(--heading)"
          >
            Tags
            <span className="ml-1 font-normal text-slate-400">
              optional
            </span>
          </label>

          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="e.g. art, quiet, date spot"
            className="w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--heading) outline-none transition focus:border-(--local)"
          />
        </div>

        {/*Photos*/}
        <div>
          <p className="mb-2 text-sm font-semibold text-(--heading)">
            Photos
          </p>

          <input
            id="photos"
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              setPhotos(files);
            }}
            className="hidden"
          />

          <label
            htmlFor="photos"
            className="flex min-h-32 cursor-pointer items-center justify-center rounded-xl border border-dashed border-(--border) bg-(--background) text-sm font-semibold text-slate-500 transition hover:border-(--local) hover:text-(--local)"
          >
            {photos.length > 0
              ? `${photos.length} photo${photos.length === 1 ? "" : "s"} selected`
              : "+ Add photos"}
          </label>
        </div>

        {/*Acknowledgment */}
        <div className="rounded-xl bg-(--surface) p-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(event) => setAcknowledged(event.target.checked)}
              className="mt-1"
            />

            <span className="text-sm leading-6 text-slate-600">
              I understand that structured information from this entry may remain
              anonymously in the recommendation system if I later delete my account.
            </span>
          </label>
        </div>

        <div className="flex gap-3">
          {errorMessage && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <button
            type="button"
            onClick={() => router.push(`/explore?mode=${mode}`)}
            className="flex-1 rounded-xl border border-(--border) px-4 py-3 text-sm font-semibold text-(--heading)"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${
              !canSubmit
                ? "cursor-not-allowed bg-slate-300"
                : isLocal
                  ? "bg-(--local)"
                  : "bg-(--visitor)"
            }`}
          >
            {submitting ? "Posting..." : "Post Entry"}
          </button>
        </div>
      </div>
      <AddPlaceModal
        open={addPlaceOpen}
        initialQuery={newPlaceQuery}
        onClose={() => setAddPlaceOpen(false)}
        onSelect={async (externalPlace) => {
          try {
            const response = await fetch("/api/places", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(externalPlace),
            });

            const data = await response.json();

            if (!response.ok) {
              setErrorMessage(data.error ?? "Failed to add place.");
              return;
            }

            setPlace(data.place);
            setAddPlaceOpen(false);
            setErrorMessage("");
          } catch (error) {
            console.error("Failed to add place:", error);
            setErrorMessage("Something went wrong while adding the place.");
          }
        }}
      />
    </div> 
  );
}