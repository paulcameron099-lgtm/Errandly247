import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

function adminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  const { trackingNumber } = await params;

  if (!trackingNumber) {
    return NextResponse.json(
      { error: "Tracking number is required." },
      { status: 400 }
    );
  }

  const admin = adminClient();

  const { data: tracking, error } = await admin
    .from("trackings")
    .select(
      `
      id,
      tracking_number,
      status,
      service_type,
      sender_name,
      receiver_name,
      receiver_address,
      origin,
      destination,
      estimated_delivery,
      current_location,
      package_description,
      weight,
      created_at,
      tracking_events (
        id,
        title,
        description,
        location,
        event_time
      )
    `
    )
    .eq("tracking_number", trackingNumber)
    .single();

  if (error || !tracking) {
    return NextResponse.json(
      { error: "Tracking number not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ tracking });
}