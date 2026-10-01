import Image from "next/image";
import Link from "next/link";

const experiences = [
  {
    id: 1,
    title: "A Foodie Weekend in Lagos",
    places: 5,
    author: "Teni",
    likes: 124,
    image: "/images/landing/featured-1.jpg",
  },
  {
    id: 2,
    title: "Three Days in Paris",
    places: 8,
    author: "Amara",
    likes: 98,
    image: "/images/landing/featured-2.jpg",
  },
  {
    id: 3,
    title: "Dubai First Timer Guide",
    places: 6,
    author: "Daniel",
    likes: 214,
    image: "/images/landing/featured-3.jpg",
  },
  {
    id: 4,
    title: "Hidden Gems in Cape Town",
    places: 7,
    author: "Sarah",
    likes: 87,
    image: "/images/landing/featured-4.jpg",
  },
];

export default function FeaturedExperiences() {
  return (
    <section className="bg-(--background) px-6 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-(--heading) sm:text-4xl">
              Featured Experiences
            </h2>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Real experiences from real people.
            </p>
          </div>

          <Link
            href="/explore"
            className="shrink-0 text-sm font-semibold text-(--visitor)"
          >
            View all <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Cards */}
        <div className="-mx-6 mt-6 overflow-x-auto px-6 pb-2 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-4 sm:grid sm:w-full sm:grid-cols-2 lg:grid-cols-4">
            {experiences.map((experience) => (
              <Link
                key={experience.id}
                href={`/experiences/${experience.id}`}
                className="w-52.5 shrink-0 sm:w-auto"
              >
                <article>
                  <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
                    <Image
                      src={experience.image}
                      alt={experience.title}
                      fill
                      className="object-cover transition duration-300 hover:scale-[1.03]"
                      sizes="(max-width: 640px) 210px, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>

                  <div className="pt-3">
                    <h3 className="text-base leading-snug font-bold text-(--heading)">
                      {experience.title}
                    </h3>

                    <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
                      <span>
                        {experience.places} places · By {experience.author}
                      </span>

                      <span className="shrink-0 text-(--visitor)">
                        ♥ {experience.likes}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}