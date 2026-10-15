import Navbar from "@/components/landing/NavBar";
import AppNavigation from "@/components/app/AppNavigation";
import ExploreContent, {
  type Mode,
} from "@/components/explore/ExploreContent";
import { getCurrentUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

type ExplorePageProps = {
  searchParams: Promise<{
    mode?: string;
  }>;
};

export default async function ExplorePage({
  searchParams,
}: ExplorePageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();

  const initialMode: Mode =
    params.mode === "visitor"
      ? "visitor"
      : "local";

  const supabase =
    await createSupabaseServerClient();

  const [
    { data: places, error: placesError },
    {
      data: experiences,
      error: experiencesError,
    },
  ] = await Promise.all([
    supabase
      .from("places")
      .select(`
        id,
        name,
        city,
        country,
        category,
        description,
        created_at
      `)
      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("experiences")
      .select(`
        id,
        title,
        description,
        mode,
        created_at,
        experience_places (
          place_id
        ),
        experience_photos (
          id,
          url,
          place_id
        )
      `)
      .order("created_at", {
        ascending: false,
      }),
  ]);

  if (placesError) {
    console.error(
      "Failed to load places:",
      placesError
    );
  }

  if (experiencesError) {
    console.error(
      "Failed to load experiences:",
      experiencesError
    );
  }

  return (
    <main className="min-h-screen bg-(--background) pb-20 md:pb-0">
      {user ? (
        <AppNavigation />
      ) : (
        <Navbar mode={initialMode} />
      )}

      <ExploreContent
        initialMode={initialMode}
        places={places ?? []}
        experiences={experiences ?? []}
      />
    </main>
  );
}