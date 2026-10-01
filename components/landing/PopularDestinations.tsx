import Image from "next/image";
import Link from "next/link";

const destinations = [
  {
    name: "Lagos",
    country: "Nigeria",
    experiences: "1.2k experiences",
    image: "/images/landing/lagos.jpg",
  },
  {
    name: "Paris",
    country: "France",
    experiences: "2.8k experiences",
    image: "/images/landing/paris.jpg",
  },
  {
    name: "Dubai",
    country: "UAE",
    experiences: "2.4k experiences",
    image: "/images/landing/dubai.jpg",
  },
  {
    name: "London",
    country: "United Kingdom",
    experiences: "3.1k experiences",
    image: "/images/landing/london.jpg",
  },
  {
    name: "Cape Town",
    country: "South Africa",
    experiences: "1.6k experiences",
    image: "/images/landing/cape-town.jpg",
  },
];

export default function PopularDestinations() {
  return (
    <section className="bg-(--background) px-6 py-16 sm:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-(--heading) sm:text-4xl">
              Popular Destinations
            </h2>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Explore cities being experienced right now.
            </p>
          </div>

          <Link
            href="/explore"
            className="shrink-0 text-sm font-semibold text-(--visitor)"
          >
            View all <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Destinations */}
        <div className="-mx-6 mt-5 overflow-x-auto px-6 pb-2 lg:mx-0 lg:overflow-visible lg:px-0">
          <div className="flex w-max gap-4 lg:mx-auto lg:w-fit">
            {destinations.map((destination) => (
              <Link
                key={destination.name}
                href={`/explore?city=${encodeURIComponent(destination.name)}`}
                className="w-42.5 shrink-0 overflow-hidden rounded-2xl border border-(--border) bg-(--background) sm:w-50"
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover transition duration-300 hover:scale-[1.03]"
                    sizes="200px"
                  />
                </div>

                <div className="p-3.5">
                  <h3 className="text-base font-bold text-(--heading)">
                    {destination.name}
                  </h3>

                  <p className="mt-0.5 text-sm text-slate-500">
                    {destination.country}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {destination.experiences}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}