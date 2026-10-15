import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

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
    external_place_id,
    name,
    address,
    city,
    country,
    latitude,
    longitude,
  } = body;

  if (!name?.trim()) {
    return NextResponse.json(
      { error: "name is required" },
      { status: 400 }
    );
  }

  if (!address?.trim()) {
    return NextResponse.json(
      { error: "address is required" },
      { status: 400 }
    );
  }

  // Check if this exact external place already exists
  if (external_place_id) {
    const {
      data: existingPlace,
      error: existingError,
    } = await supabase
      .from("places")
      .select(`
        id,
        name,
        city,
        country,
        category,
        description,
        formatted_address,
        external_place_id
      `)
      .eq(
        "external_place_id",
        external_place_id
      )
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        { error: existingError.message },
        { status: 500 }
      );
    }

    if (existingPlace) {
      return NextResponse.json({
        place: existingPlace,
        already_exists: true,
      });
    }
  }

  const location =
    latitude != null &&
    longitude != null
      ? `POINT(${longitude} ${latitude})`
      : null;

  const {
    data: place,
    error: insertError,
  } = await supabase
    .from("places")
    .insert({
      name: name.trim(),
      city: city ?? "",
      country: country ?? "",
      category: "Other",
      description: null,
      formatted_address: address.trim(),
      external_place_id:
        external_place_id ?? null,
      location,
      created_by: user.id,
    })
    .select(`
      id,
      name,
      city,
      country,
      category,
      description,
      formatted_address,
      external_place_id
    `)
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      place,
      already_exists: false,
    },
    { status: 201 }
  );
}