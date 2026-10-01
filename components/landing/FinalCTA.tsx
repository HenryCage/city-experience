import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="bg-(--background) px-6 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-4xl bg-(--heading) px-5 py-7 text-center sm:px-10 sm:py-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--visitor-light)">
            Start exploring
          </p>

          <h2 className="mx-auto mt-2 max-w-2xl text-3xl font-bold leading-tight text-white sm:mt-3 sm:text-4xl">
            Ready to experience the city differently?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:mt-4 sm:text-base">
            Discover places through the experiences of people who have actually been there.
          </p>

          <Link
            href="/explore"
            className="mt-5 inline-flex rounded-full bg-(--visitor) px-6 py-3 text-sm font-semibold text-white transition hover:bg-(--visitor-dark)"
          >
            Start Exploring
          </Link>
        </div>
      </div>
    </section>
  );
}