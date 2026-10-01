import Image from "next/image";
import Link from "next/link";
import type { Mode } from "./ExploreContent";

const experiences = [
  {
    id: 1,
    title: "A Weekend in Lagos",
    places: 6,
    author: "Sarah",
    likes: 294,
    image: "/images/landing/featured-3.jpg",
  },
  {
    id: 2,
    title: "A Food Lover's Guide to Lagos",
    places: 5,
    author: "Marco",
    likes: 281,
    image: "/images/landing/featured-1.jpg",
  },
];

export default function PopularExperiences({ mode }: { mode: Mode }) {
  const isLocal = mode === "local";

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-(--heading)">
          Popular Experiences
        </h2>

        <Link
          href="/explore/experiences"
          className={`text-sm font-semibold ${
            isLocal ? "text-(--local)" : "text-(--visitor)"
          }`}
        >
          See all →
        </Link>
      </div>

      <div className="-mx-4 mt-4 overflow-x-auto px-4 pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
        <div className="flex w-max gap-4 sm:grid sm:w-full sm:grid-cols-2">
          {experiences.map((experience) => (
            <Link
              key={experience.id}
              href={`/experiences/${experience.id}`}
              className="w-70 shrink-0 sm:w-auto"
            >
              <article className="overflow-hidden rounded-2xl border border-(--border) bg-white">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={experience.image}
                    alt={experience.title}
                    fill
                    className="object-cover transition duration-300 hover:scale-[1.02]"
                    sizes="(max-width: 640px) 280px, 50vw"
                  />
                </div>

                <div className="p-3.5">
                  <h3 className="text-base font-bold leading-snug text-(--heading)">
                    {experience.title}
                  </h3>

                  <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
                    <span>
                      {experience.places} places · By {experience.author}
                    </span>

                    <span className="shrink-0 text-(--visitor)">
                      ♡ {experience.likes}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}