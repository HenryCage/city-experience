import Image from "next/image";
import Link from "next/link";
import type { Mode } from "./ExploreContent";

const places = [
  {
    id: 1,
    name: "Lekki Conservation Centre",
    category: "Nature",
    rating: "4.8",
    reviews: "320",
    image: "/images/landing/lagos.jpg",
  },
  {
    id: 2,
    name: "Nike Art Gallery",
    category: "Art & Culture",
    rating: "4.7",
    reviews: "280",
    image: "/images/landing/featured-1.jpg",
  },
  {
    id: 3,
    name: "Tarkwa Bay",
    category: "Beach",
    rating: "4.6",
    reviews: "410",
    image: "/images/landing/featured-2.jpg",
  },
];

export default function MustSeePlaces({ mode }: { mode: Mode }) {
  const isLocal = mode === "local";

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-(--heading)">
          {isLocal ? "Popular Near You" : "Must-see Places"}
        </h2>

        <Link
          href="/explore/places"
          className={`text-sm font-semibold ${
            isLocal ? "text-(--local)" : "text-(--visitor)"
          }`}
        >
          See all →
        </Link>
      </div>

      <div className="-mx-4 mt-4 overflow-x-auto px-4 pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
        <div className="flex w-max gap-3">
          {places.map((place) => (
            <Link
              key={place.id}
              href={`/places/${place.id}`}
              className="w-43 shrink-0 overflow-hidden rounded-2xl border border-(--border) bg-white"
            >
              <article>
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    className="object-cover"
                    sizes="170px"
                  />

                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                    }}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm shadow-sm"
                    aria-label={`Save ${place.name}`}
                  >
                    ♡
                  </button>
                </div>

                <div className="p-3">
                  <h3 className="line-clamp-1 text-sm font-bold text-(--heading)">
                    {place.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {place.category}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    <span className="text-amber-500">★</span>{" "}
                    {place.rating} ({place.reviews})
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}