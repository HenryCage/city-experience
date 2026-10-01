import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-(--background)">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-10 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:py-14">

        {/* Text */}
        <div className="relative z-10">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-(--local) sm:text-sm">
            Your city. Your experience.
          </p>

          <h1 className="max-w-2xl text-5xl leading-[1.05] font-bold tracking-[-0.03em] text-(--heading) sm:text-6xl lg:text-7xl">
            Discover cities through{" "}
            <span className="italic text-(--visitor)">
              real experiences.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Explore places through the stories of people who&apos;ve actually
            been there — whether you&apos;re discovering your own city or
            visiting somewhere new.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/explore"
              className="inline-flex justify-center rounded-full bg-(--visitor) px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-(--visitor-dark)"
            >
              Start Exploring
            </Link>

            <Link
              href="/#how-it-works"
              className="inline-flex justify-center rounded-full border border-(--border) px-7 py-3.5 text-sm font-semibold text-(--heading) transition hover:bg-(--surface)"
            >
              How it works
            </Link>
          </div>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-162.5">
          <div className="aspect-5/4 overflow-hidden rounded-4xl bg-(--surface) sm:rounded-[2.5rem]">
            <Image
              src="/images/landing/hero-image.jpg"
              alt="City experience"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>

          {/* Local label */}
          <div className="absolute -left-2 top-8 rotate-[-5deg] rounded-xl bg-(--local) px-4 py-2.5 text-xs font-semibold text-white shadow-md sm:-left-6 sm:top-12 sm:px-5 sm:py-3 sm:text-sm">
            Explore like a local
          </div>

          {/* Visitor label */}
          <div className="absolute -bottom-4 right-3 rotate-[4deg] rounded-xl bg-(--visitor) px-4 py-2.5 text-xs font-semibold text-white shadow-md sm:right-8 sm:px-5 sm:py-3 sm:text-sm">
            Discover as a visitor
          </div>
        </div>
      </div>
    </section>
  );
}