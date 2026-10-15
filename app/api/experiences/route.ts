import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { voyage } from "@/lib/voyage";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("experiences")
    .select("*, experience_places(place_id)");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    experiences: data,
  });
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const {
    title,
    description,
    mode,
    place_ids,
    retention_acknowledged,
  } = body;

  if (
    !title ||
    !description ||
    !place_ids ||
    place_ids.length === 0
  ) {
    return NextResponse.json(
      {
        error:
          "title, description, and at least one place_id are required",
      },
      { status: 400 }
    );
  }

  if (
    mode !== "local" &&
    mode !== "visitor"
  ) {
    return NextResponse.json(
      {
        error:
          'mode must be "local" or "visitor"',
      },
      { status: 400 }
    );
  }

  if (retention_acknowledged !== true) {
    return NextResponse.json(
      {
        error:
          "retention_acknowledged must be true",
      },
      { status: 400 }
    );
  }

  const { data, error } =
    await supabase.rpc(
      "create_experience_with_places",
      {
        p_title: title,
        p_description: description,
        p_mode: mode,
        p_place_ids: place_ids,
      }
    );

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const textToEmbed =
    `${title}. ${description}`;

  const embedResult =
    await voyage.embed({
      input: [textToEmbed],
      model: "voyage-4",
      outputDimension: 1024,
    });

  const embedding =
    embedResult.data?.[0]?.embedding;

  if (embedding) {
    await supabaseAdmin
      .from("experiences")
      .update({ embedding })
      .eq("id", data);
  }

  return NextResponse.json(
    {
      experience_id: data,
    },
    { status: 201 }
  );
}