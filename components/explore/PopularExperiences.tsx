import Image from "next/image";
import Link from "next/link";
import type {
  Mode,
  ExplorePlace,
  ExploreExperience,
} from "./ExploreContent";

type PopularExperiencesProps = {
  mode: Mode;
  places: ExplorePlace[];
  experiences: ExploreExperience[];
};

export default function PopularExperiences({
  mode,
  places,
  experiences,
}: PopularExperiencesProps) {
  const isLocal = mode === "local";

  function getPlaceNames(
    experience: ExploreExperience
  ) {
    const placeIds =
      experience.experience_places.map(
        (link) => link.place_id
      );

    return places
      .filter((place) =>
        placeIds.includes(place.id)
      )
      .map((place) => place.name);
  }

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-(--heading)">
          Popular Experiences
        </h2>

        <Link
          href={`/explore/experiences?mode=${mode}`}
          className={`text-sm font-semibold ${
            isLocal
              ? "text-(--local)"
              : "text-(--visitor)"
          }`}
        >
          See all →
        </Link>
      </div>

      {experiences.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-(--border) bg-white p-6">
          <p className="text-sm text-slate-500">
            No {mode} experiences yet.
          </p>
        </div>
      ) : (
        <div className="-mx-4 mt-4 overflow-x-auto px-4 pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
          <div className="flex w-max gap-4 sm:grid sm:w-full sm:grid-cols-2">
            {experiences.map((experience) => {
              const placeNames =
                getPlaceNames(experience);

              const image =
                experience
                  .experience_photos[0]
                  ?.url ?? null;

              return (
                <Link
                  key={experience.id}
                  href={`/experiences/${experience.id}?mode=${mode}`}
                  className="w-70 shrink-0 sm:w-auto"
                >
                  <article className="overflow-hidden rounded-2xl border border-(--border) bg-white">
                    <div className="relative aspect-video overflow-hidden bg-(--surface)">
                      {image ? (
                        <Image
                          src={image}
                          alt={experience.title}
                          fill
                          className="object-cover transition duration-300 hover:scale-[1.02]"
                          sizes="(max-width: 640px) 280px, 50vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-400">
                          No photo yet
                        </div>
                      )}
                    </div>

                    <div className="p-3.5">
                      <h3 className="line-clamp-2 text-base font-bold leading-snug text-(--heading)">
                        {experience.title}
                      </h3>

                      {placeNames.length > 0 && (
                        <p className="mt-2 line-clamp-1 text-xs text-slate-500">
                          {placeNames.join(", ")}
                        </p>
                      )}

                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                        {experience.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span
                          className={`text-xs font-semibold ${
                            isLocal
                              ? "text-(--local)"
                              : "text-(--visitor)"
                          }`}
                        >
                          {mode === "local"
                            ? "Local"
                            : "Visitor"}
                        </span>

                        <span className="text-xs text-slate-400">
                          {experience
                            .experience_places
                            .length}{" "}
                          {experience
                            .experience_places
                            .length === 1
                            ? "place"
                            : "places"}
                        </span>
                      </div>
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