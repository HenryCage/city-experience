import Link from "next/link";

export default function ExploreModes() {
  return (
    <section className="bg-(--surface) px-6 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-(--visitor) sm:text-sm">
            Explore your way
          </p>

          <h2 className="text-4xl leading-tight font-bold tracking-[-0.02em] text-(--heading) sm:text-5xl">
            One city. Two ways to explore.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Choose how you&apos;re experiencing the city. You can always switch
            between Local and Visitor later.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-16 lg:gap-8">
          {/* Local */}
          <article className="flex min-w-0 flex-col items-center text-center rounded-2xl border border-(--border) bg-(--background) p-4 sm:rounded-4xl sm:p-7 lg:p-10">
            <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-(--local-light) text-sm font-bold text-(--local) sm:mb-8 sm:h-12 sm:w-12 sm:text-lg">
              L
            </span>

            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-(--local) sm:text-xs sm:tracking-[0.18em]">
              Local
            </p>

            <h3 className="mt-2 text-xl leading-tight font-bold text-(--heading) sm:mt-3 sm:text-3xl lg:text-4xl">
              I&apos;m a Local
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
              Discover new places, activities, food, events, and hidden gems in a city
              you already know.
            </p>

            <Link
              href="/signup?mode=local"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-(--local) px-3 py-3 text-xs font-semibold text-white transition hover:bg-(--local-dark) sm:mt-8  sm:px-6 sm:text-sm"
            >
              Explore Local
              <span className="ml-1 hidden sm:inline" aria-hidden="true">
                →
              </span>
            </Link>
          </article>

          {/* Visitor */}
          <article className="flex min-w-0 flex-col items-center text-center rounded-2xl border border-(--border) bg-(--background) p-4 sm:rounded-4xl sm:p-7 lg:p-10">
            <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-(--visitor-light) text-sm font-bold text-(--visitor) sm:mb-8 sm:h-12 sm:w-12 sm:text-lg">
              V
            </span>

            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-(--visitor) sm:text-xs sm:tracking-[0.18em]">
              Visitor
            </p>

            <h3 className="mt-2 text-xl leading-tight font-bold text-(--heading) sm:mt-3 sm:text-3xl lg:text-4xl">
              I&apos;m a Visitor
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
              Discover landmarks, culture, food, neighborhoods, and experiences in a
              city that&apos;s new to you.
            </p>

            <Link
              href="/signup?mode=visitor"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-(--visitor) px-3 py-3 text-xs font-semibold text-white transition hover:bg-(--visitor-dark) sm:mt-8  sm:px-6 sm:text-sm"
            >
              Explore Visitor
              <span className="ml-1 hidden sm:inline" aria-hidden="true">
                →
              </span>
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}