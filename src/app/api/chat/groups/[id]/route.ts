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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: chatId } = await params;
    const { name } = await req.json();

    const cleanName = String(name || "").trim();

    if (!cleanName) {
      return NextResponse.json(
        { error: "Group name is required." },
        { status: 400 }
      );
    }

    if (cleanName.length > 100) {
      return NextResponse.json(
        { error: "Group name cannot exceed 100 characters." },
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

    const { data: currentProfile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!currentProfile || !isStaffRole(currentProfile.role)) {
      return NextResponse.json(
        {
          error:
            "Only admin, manager, or supervisor can rename group chats.",
        },
        { status: 403 }
      );
    }

    const { data: group } = await admin
      .from("chats")
      .select("id, type")
      .eq("id", chatId)
      .maybeSingle();

    if (!group || group.type !== "group") {
      return NextResponse.json(
        { error: "Group chat not found." },
        { status: 404 }
      );
    }

    const { data: updatedGroup, error } = await admin
      .from("chats")
      .update({
        name: cleanName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", chatId)
      .select("id, name, type, updated_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "Group name updated successfully.",
      group: updatedGroup,
    });
  } catch (error) {
    console.error("Rename group error:", error);

    return NextResponse.json(
      { error: "Something went wrong while renaming the group." },
      { status: 500 }
    );
  }
}