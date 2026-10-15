import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import AppNavigation from "@/components/app/AppNavigation";
import Navbar from "@/components/landing/NavBar";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getCurrentUser } from "@/lib/auth";

import SavePlaceButton from "./SavePlacesButton";

type PlaceDetailProps = {
  placeId: string;
  mode: "local" | "visitor";
};

export default async function PlaceDetail({
  placeId,
  mode,
}: PlaceDetailProps) {
  const user = await getCurrentUser();

  const supabase =
    await createSupabaseServerClient();

  const {
    data: place,
    error: placeError,
  } = await supabase
    .from("places")
    .select(`
      id,
      name,
      city,
      country,
      category,
      description,
      formatted_address
    `)
    .eq("id", placeId)
    .single();

  if (placeError || !place) {
    notFound();
  }

  const {
    data: links,
    error: experiencesError,
  } = await supabase
    .from("experience_places")
    .select(`
      experience_id,
      experiences (
        id,
        title,
        description,
        mode,
        created_at,
        experience_photos (
          id,
          url,
          place_id
        )
      )
    `)
    .eq("place_id", placeId);

  if (experiencesError) {
    console.error(
      "Failed to load place experiences:",
      experiencesError
    );
  }

  const experiences =
    links?.flatMap(
      ({ experiences }) =>
        experiences ?? []
    ) ?? [];

  const heroPhoto =
    experiences
      .flatMap(
        (experience) =>
          experience.experience_photos ?? []
      )
      .find(
        (photo) =>
          photo.place_id === placeId
      )?.url ?? null;

  return (
    <main className="min-h-screen bg-(--background) pb-20 md:pb-0">
      {user ? (
        <AppNavigation />
      ) : (
        <Navbar mode={mode} />
      )}

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        <Link
          href={`/explore?mode=${mode}`}
          className={`text-sm font-semibold ${
            mode === "local"
              ? "text-(--local)"
              : "text-(--visitor)"
          }`}
        >
          ← Back to Explore
        </Link>

        {heroPhoto && (
          <div className="relative mt-5 aspect-video overflow-hidden rounded-2xl">
            <Image
              src={heroPhoto}
              alt={place.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        )}

        <section className="mt-6 rounded-2xl border border-(--border) bg-white p-5 sm:p-6">
          <p className="text-sm font-semibold text-(--local)">
            {place.category}
          </p>

          <div className="mt-1 flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold text-(--heading)">
              {place.name}
            </h1>

            <SavePlaceButton
              placeId={place.id}
              mode={mode}
            />
          </div>

          <p className="mt-2 text-sm text-slate-500">
            {[place.city, place.country]
              .filter(Boolean)
              .join(", ")}
          </p>

          {place.formatted_address && (
            <p className="mt-2 text-sm text-slate-400">
              {place.formatted_address}
            </p>
          )}

          {place.description && (
            <p className="mt-5 leading-7 text-slate-700">
              {place.description}
            </p>
          )}
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-(--heading)">
              Experiences
            </h2>

            <span className="text-sm text-slate-400">
              {experiences.length}
            </span>
          </div>

          {experiences.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-(--border) bg-white p-6">
              <p className="text-sm text-slate-500">
                No experiences have been shared for this place yet.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {experiences.map(
                (experience) => {
                  const photo =
                    experience
                      .experience_photos?.[0]
                      ?.url ?? null;

                  return (
                    <Link
                      key={experience.id}
                      href={`/experiences/${experience.id}?mode=${mode}`}
                      className="overflow-hidden rounded-2xl border border-(--border) bg-white"
                    >
                      {photo && (
                        <div className="relative aspect-video">
                          <Image
                            src={photo}
                            alt={experience.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                        </div>
                      )}

                      <div className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span
                            className={`text-xs font-semibold ${
                              experience.mode ===
                              "local"
                                ? "text-(--local)"
                                : "text-(--visitor)"
                            }`}
                          >
                            {experience.mode ===
                            "local"
                              ? "Local"
                              : "Visitor"}
                          </span>

                          <span className="text-xs text-slate-400">
                            {new Date(
                              experience.created_at
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="mt-2 font-bold text-(--heading)">
                          {experience.title}
                        </h3>

                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                          {
                            experience.description
                          }
                        </p>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}