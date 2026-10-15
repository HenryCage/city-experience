import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function normalize(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}

function fuzzyScore(query: string, candidate: string) {
  const q = normalize(query);
  const c = normalize(candidate);

  if (!q || !c) return 0;

  if (q === c) return 1;

  if (c.startsWith(q)) {
    return 0.95;
  }

  if (c.includes(q)) {
    return 0.9;
  }

  const queryTokens = q.split(" ");
  const candidateTokens = c.split(" ");

  const matchedTokens = queryTokens.filter((token) =>
    candidateTokens.some(
      (candidateToken) =>
        candidateToken.includes(token) ||
        token.includes(candidateToken)
    )
  );

  const tokenScore =
    matchedTokens.length / queryTokens.length;

  return tokenScore * 0.75;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }

    const { data: places, error } = await supabaseAdmin
      .from("places")
      .select(`
        id,
        name,
        city,
        country,
        category,
        description
      `)
      .limit(200);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const matches = (places ?? [])
      .map((place) => ({
        ...place,
        fuzzy_score: fuzzyScore(
          name,
          place.name
        ),
        source: "existing" as const,
      }))
      .filter(
        (place) =>
          place.fuzzy_score >= 0.35
      )
      .sort(
        (a, b) =>
          b.fuzzy_score -
          a.fuzzy_score
      )
      .slice(0, 8);

    return NextResponse.json({
      matches,
    });
  } catch (error) {
    console.error(
      "Place match error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to match places" },
      { status: 500 }
    );
  }
}