import AppNavigation from "@/components/app/AppNavigation";
import EntryForm from "@/components/entry/EntryForm";
import type { Mode } from "@/components/explore/ExploreContent";

type EntryPageProps = {
  searchParams: Promise<{ mode?: string }>;
};

export default async function EntryPage({
  searchParams,
}: EntryPageProps) {
  const params = await searchParams;

  const initialMode: Mode =
    params.mode === "visitor" ? "visitor" : "local";

  return (
    <main className="min-h-screen bg-(--background) pb-20 md:pb-0">
      <AppNavigation />

      <EntryForm initialMode={initialMode} />
    </main>
  );
}