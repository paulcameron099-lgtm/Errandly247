import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const employeeId = formData.get("employeeId") as string;
    const file = formData.get("file") as File | null;

    if (!employeeId || !file) {
      return NextResponse.json(
        { error: "Employee and image file are required." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data: currentProfile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !currentProfile) {
      return NextResponse.json(
        { error: "Current user profile not found." },
        { status: 403 }
      );
    }

    if (currentProfile.role !== "admin" && currentProfile.role !== "manager" && currentProfile.role !== "supervisor" ) {
      return NextResponse.json(
        { error: "Only admin or manager/supervisor can upload profile pictures." },
        { status: 403 }
      );
    }

    const adminClient = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const fileExt = file.name.split(".").pop();
    const filePath = `${employeeId}/profile-${Date.now()}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await adminClient.storage
      .from("avatars")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 400 }
      );
    }

    const { data: publicUrlData } = adminClient.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const avatarUrl = publicUrlData.publicUrl;

    const { error: updateError } = await adminClient
      .from("profiles")
      .update({
        avatar_url: avatarUrl,
      })
      .eq("id", employeeId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Profile picture uploaded successfully.",
      avatarUrl,
    });
  } catch (error) {
    console.error("Upload avatar error:", error);

    return NextResponse.json(
      { error: "Something went wrong while uploading image." },
      { status: 500 }
    );
  }
}