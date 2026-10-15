import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import AppNavigation from "@/components/app/AppNavigation";
import Navbar from "@/components/landing/NavBar";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getCurrentUser } from "@/lib/auth";

type ExperienceDetailProps = {
  experienceId: string;
  mode: "local" | "visitor";
};

export default async function ExperienceDetail({
  experienceId,
  mode,
}: ExperienceDetailProps) {
  const user = await getCurrentUser();

  const supabase =
    await createSupabaseServerClient();

  const {
    data: experience,
    error,
  } = await supabase
    .from("experiences")
    .select(`
      id,
      title,
      description,
      mode,
      created_at,

      experience_places (
        place_id,
        places (
          id,
          name,
          city,
          country,
          category,
          formatted_address
        )
      ),

      experience_photos (
        id,
        url,
        place_id
      )
    `)
    .eq("id", experienceId)
    .single();

  if (error || !experience) {
    notFound();
  }

  const linkedPlaces =
    experience.experience_places?.flatMap(
      ({ places }) => places ?? []
    ) ?? [];

  const photos =
    experience.experience_photos ?? [];

  const isLocal =
    experience.mode === "local";

  return (
    <main className="min-h-screen bg-(--background) pb-20 md:pb-0">
      {user ? (
        <AppNavigation />
      ) : (
        <Navbar mode={mode} />
      )}

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
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

        {photos.length > 0 && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-(--border)">
            <div className="relative aspect-video">
              <Image
                src={photos[0].url}
                alt={experience.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          </div>
        )}

        <article className="mt-6 rounded-2xl border border-(--border) bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isLocal
                  ? "bg-(--local-light) text-(--local-dark)"
                  : "bg-(--visitor-light) text-(--visitor-dark)"
              }`}
            >
              {isLocal
                ? "Local"
                : "Visitor"}
            </span>

            <span className="text-xs text-slate-400">
              {new Date(
                experience.created_at
              ).toLocaleDateString()}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-(--heading)">
            {experience.title}
          </h1>

          {linkedPlaces.map((linkedPlace) => (
            <Link
              key={linkedPlace.id}
              href={`/places/${linkedPlace.id}?mode=${mode}`}
              className="mt-4 block rounded-xl bg-(--surface) p-4 transition hover:opacity-90"
            >
              <p className="font-semibold text-(--heading)">
                {linkedPlace.name}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {[linkedPlace.city, linkedPlace.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              {linkedPlace.formatted_address && (
                <p className="mt-1 text-xs text-slate-400">
                  {linkedPlace.formatted_address}
                </p>
              )}
            </Link>
          ))}

          <p className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-700">
            {experience.description}
          </p>

          {photos.length > 1 && (
            <div className="mt-6 grid grid-cols-2 gap-3">
              {photos
                .slice(1)
                .map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square overflow-hidden rounded-xl"
                  >
                    <Image
                      src={photo.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </div>
                ))}
            </div>
          )}
        </article>
      </div>
    </main>
  );
}