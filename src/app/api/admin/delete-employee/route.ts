import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/server";

function isAllowedRole(role?: string | null) {
  return role === "admin" || role === "manager" || role === "supervisor";
}

export async function DELETE(req: Request) {
  try {
    const { employeeId } = await req.json();

    if (!employeeId) {
      return NextResponse.json(
        { error: "Employee ID is required." },
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

    const { data: currentProfile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !currentProfile || !isAllowedRole(currentProfile.role)) {
      return NextResponse.json(
        { error: "Only admin, manager, or supervisor can delete employee accounts." },
        { status: 403 }
      );
    }

    const adminClient = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await adminClient.auth.admin.deleteUser(employeeId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "Employee account deleted successfully.",
    });
  } catch (error) {
    console.error("Delete employee error:", error);

    return NextResponse.json(
      { error: "Something went wrong while deleting employee account." },
      { status: 500 }
    );
  }
}