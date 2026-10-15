import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("saved_places")
    .select(`
      user_id,
      place_id,
      created_at,
      places (
        id,
        name,
        city,
        country,
        category,
        description,
        formatted_address
      )
    `)
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
    });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    saved_places: data ?? [],
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
  const { place_id } = body;

  if (!place_id) {
    return NextResponse.json(
      { error: "place_id is required" },
      { status: 400 }
    );
  }

  const {
    data: existing,
    error: existingError,
  } = await supabase
    .from("saved_places")
    .select("place_id")
    .eq("user_id", user.id)
    .eq("place_id", place_id)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json(
      { error: existingError.message },
      { status: 500 }
    );
  }

  if (existing) {
    return NextResponse.json({
      saved_place: existing,
      already_saved: true,
    });
  }

  const { data, error } = await supabase
    .from("saved_places")
    .insert({
      user_id: user.id,
      place_id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      saved_place: data,
      already_saved: false,
    },
    { status: 201 }
  );
}