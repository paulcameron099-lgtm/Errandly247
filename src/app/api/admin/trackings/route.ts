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

export async function GET() {
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

  const { data, error } = await admin
    .from("trackings")
    .select(
      `
      *,
      tracking_events (
        id,
        title,
        description,
        location,
        event_time
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ trackings: data || [] });
}

export async function POST(req: Request) {
  const body = await req.json();

  const {
    trackingNumber,
    status,
    serviceType,
    senderName,
    receiverName,
    receiverAddress,
    origin,
    destination,
    estimatedDelivery,
    currentLocation,
    packageDescription,
    weight,
  } = body;

  if (!trackingNumber || !status || !receiverName || !destination) {
    return NextResponse.json(
      {
        error:
          "Tracking number, status, receiver name, and destination are required.",
      },
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

  const { data, error } = await admin
    .from("trackings")
    .insert({
      tracking_number: trackingNumber,
      status,
      service_type: serviceType || null,
      sender_name: senderName || null,
      receiver_name: receiverName,
      receiver_address: receiverAddress || null,
      origin: origin || null,
      destination,
      estimated_delivery: estimatedDelivery || null,
      current_location: currentLocation || null,
      package_description: packageDescription || null,
      weight: weight || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await admin.from("tracking_events").insert({
    tracking_id: data.id,
    title: status,
    description: "Tracking record created.",
    location: currentLocation || origin || null,
    event_time: new Date().toISOString(),
  });

  return NextResponse.json({
    message: "Tracking created successfully.",
    tracking: data,
  });
}