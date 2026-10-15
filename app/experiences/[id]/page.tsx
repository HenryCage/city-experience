import ExperienceDetail from "@/components/experiences/ExperienceDetails"

type ExperiencePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    mode?: string;
  }>;
};

export default async function ExperiencePage({
  params,
  searchParams,
}: ExperiencePageProps) {
  const { id } = await params;
  const query = await searchParams;

  const mode =
    query.mode === "visitor"
      ? "visitor"
      : "local";

  return (
    <ExperienceDetail
      experienceId={id}
      mode={mode}
    />
  );
}