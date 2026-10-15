import Image from "next/image";
import Link from "next/link";

export type AuthMode = "local" | "visitor";

type AuthShellProps = {
  mode: AuthMode;
  type: "login" | "signup";
  children: React.ReactNode;
};

export default function AuthShell({
  mode,
  type,
  children,
}: AuthShellProps) {
  const isLocal = mode === "local";

  const modeLabel = isLocal ? "Local" : "Visitor";

  const modeMessage =
    type === "signup"
      ? `You're starting as a ${modeLabel}`
      : `You're continuing as a ${modeLabel}`;

  return (
    <main className="min-h-screen bg-(--background)">
      {/* Simple auth navbar */}
      <header>
        <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--local) text-white">
              <span className="text-lg">●</span>
            </div>

            <span className="text-lg font-bold text-(--heading) sm:text-xl">
              City Experience
            </span>
          </Link>

          <Link
            href={
              type === "login"
                ? `/signup?mode=${mode}`
                : `/login?mode=${mode}`
            }
            className={`text-sm font-semibold ${
              isLocal ? "text-(--local)" : "text-(--visitor)"
            }`}
          >
            {type === "login" ? "Sign up" : "Log in"}
          </Link>
        </nav>
      </header>

      <section className="px-6 pb-10 pt-4 sm:pb-14">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-4xl border border-(--border) bg-white lg:grid-cols-[1fr_1fr]">
          {/* Image side */}
          <div className="relative hidden min-h-155 lg:block">
            <Image
              src={
                isLocal
                  ? "/images/auth/local-auth.jpg"
                  : "/images/auth/visitor-auth.jpg"
              }
              alt=""
              fill
              priority
              className="object-cover"
              sizes="50vw"
            />

            <div className="absolute inset-0 bg-black/10" />

            <div className="absolute bottom-8 left-8 right-8 rounded-2xl bg-white/90 p-5 backdrop-blur">
              <p
                className={`text-xs font-bold uppercase tracking-[0.18em] ${
                  isLocal ? "text-(--local)" : "text-(--visitor)"
                }`}
              >
                {modeLabel} mode
              </p>

              <p className="mt-2 text-2xl font-bold text-(--heading)">
                {isLocal
                  ? "Rediscover the city you already know."
                  : "Experience somewhere new."}
              </p>
            </div>
          </div>

          {/* Form side */}
          <div className="flex items-center justify-center px-5 py-8 sm:px-10 sm:py-12 lg:px-14">
            <div className="w-full max-w-md">
              {/* Mode indicator */}
              <div
                className={`mb-6 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
                  isLocal
                    ? "bg-(--local-light) text-(--local-dark)"
                    : "bg-(--visitor-light) text-(--visitor-dark)"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isLocal ? "bg-(--local)" : "bg-(--visitor)"
                  }`}
                />

                <span className="font-medium">{modeMessage}</span>
              </div>

              {children}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}