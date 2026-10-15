import PlaceDetail from "@/components/places/PlaceDetail";

type PlacePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    mode?: string;
  }>;
};

export default async function PlacePage({
  params,
  searchParams,
}: PlacePageProps) {
  const { id } = await params;
  const query = await searchParams;

  const mode =
    query.mode === "visitor"
      ? "visitor"
      : "local";

  return (
    <PlaceDetail
      placeId={id}
      mode={mode}
    />
  );
}