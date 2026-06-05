import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/server";

function adminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function isStaffRole(role?: string | null) {
  return role === "admin" || role === "manager" || role === "supervisor";
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { title, description, location, eventTime, status, currentLocation } =
    await req.json();

  if (!title) {
    return NextResponse.json(
      { error: "Event title is required." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const admin = adminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !isStaffRole(profile.role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { data: event, error } = await admin
    .from("tracking_events")
    .insert({
      tracking_id: id,
      title,
      description: description || null,
      location: location || null,
      event_time: eventTime || new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await admin
    .from("trackings")
    .update({
      status: status || title,
      current_location: currentLocation || location || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  return NextResponse.json({
    message: "Tracking event added successfully.",
    event,
  });
}