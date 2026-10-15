import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { query } = await request.json();

  if (!query?.trim()) {
    return NextResponse.json(
      { error: "query is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Geoapify API key is missing" },
      { status: 500 }
    );
  }

  const url = new URL(
    "https://api.geoapify.com/v1/geocode/autocomplete"
  );

  url.searchParams.set("text", query.trim());
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "8");
  url.searchParams.set("apiKey", apiKey);

  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok) {
    console.error("Geoapify error:", data);

    return NextResponse.json(
      { error: "Failed to search external places" },
      { status: 500 }
    );
  }

  const places =
    data.results?.map(
      (result: {
        place_id?: string;
        name?: string;
        formatted?: string;
        address_line1?: string;
        address_line2?: string;
        city?: string;
        country?: string;
        lat?: number;
        lon?: number;
      }) => ({
        external_place_id: result.place_id ?? null,
        name:
          result.name ??
          result.address_line1 ??
          "Unknown place",
        address:
          result.formatted ??
          [
            result.address_line1,
            result.address_line2,
          ]
            .filter(Boolean)
            .join(", "),

        // hidden metadata for later
        city: result.city ?? null,
        country: result.country ?? null,
        latitude: result.lat ?? null,
        longitude: result.lon ?? null,
      })
    ) ?? [];

  return NextResponse.json({
    places,
  });
}