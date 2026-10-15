import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

type RouteProps = {
  params: Promise<{
    placeId: string;
  }>;
};

export async function DELETE(
  request: Request,
  { params }: RouteProps
) {
  const { placeId } = await params;

  const supabase =
    await createSupabaseServerClient();

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

  const { error } = await supabase
    .from("saved_places")
    .delete()
    .eq("user_id", user.id)
    .eq("place_id", placeId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}