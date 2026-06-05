import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/server";
import { sendMail } from "@/lib/mailer";
import { createNotification } from "@/lib/createNotification";

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
  const { id: chatId } = await params;
  const { memberId } = await req.json();

  if (!memberId) {
    return NextResponse.json(
      { error: "Member ID is required." },
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
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { data: group } = await admin
    .from("chats")
    .select("id, name, type")
    .eq("id", chatId)
    .single();

  if (!group || group.type !== "group") {
    return NextResponse.json({ error: "Group not found." }, { status: 404 });
  }

  const { error } = await admin.from("chat_members").upsert({
    chat_id: chatId,
    user_id: memberId,
    role: "member",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await createNotification({
  admin,
  userId: memberId,
  actorId: user.id,
  title: "Added to Group Chat",
  message: `You have been added to ${group.name}.`,
  type: "Chat",
  link: "/dashboard/chat",
});

const { data: employee } = await admin
  .from("profiles")
  .select("id, email, full_name, first_name, job_title")
  .eq("id", memberId)
  .single();

  if (employee?.email) {
    try {
      await sendMail({
        to: employee.email,
        subject: `You Have Been Added to ${group.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:30px;">
            <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:14px; overflow:hidden;">
              <div style="background:#000000; color:#ffffff; padding:28px; text-align:center;">
                <h1 style="margin:0; font-size:24px;">Group Chat Access Added</h1>
                <p style="margin-top:8px; font-size:14px; color:#e5e5e5;">
                  Errandly247 Employee Dashboard
                </p>
              </div>

              <div style="padding:28px; color:#222;">
                <p style="font-size:16px;">
                  Hello <strong>${employee.full_name || employee.first_name || "Team Member"}</strong>,
                </p>

                <p style="font-size:15px; line-height:1.7;">
                  You have been added to a company group chat. Please log in to your dashboard
                  to view updates, meeting discussions, and team communication related to this group.
                </p>

                <div style="background:#f8f8f8; border:1px solid #eeeeee; padding:18px; border-radius:10px; margin:24px 0;">
                  <p style="margin:0 0 10px; font-size:15px;">
                    <strong>Group Name:</strong> ${group.name}
                  </p>
                  <p style="margin:0; font-size:15px;">
                    <strong>Action Required:</strong> Log in and attend to the group chat
                  </p>
                </div>

                <a href="${process.env.NEXT_PUBLIC_APP_URL}/chat"
                  style="display:inline-block; background:#000000; color:#ffffff; padding:14px 22px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:14px;">
                  Open Chat
                </a>

                <p style="margin-top:28px; font-size:15px;">
                  Regards,<br/>
                  <strong>Support Team</strong><br/>
                  Errandly247
                </p>
              </div>
            </div>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Add group member email failed:", mailError);
    }
  }

  return NextResponse.json({
    message: "Employee added to group successfully.",
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: chatId } = await params;
  const { memberId } = await req.json();

  if (!memberId) {
    return NextResponse.json(
      { error: "Member ID is required." },
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
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { data: group } = await admin
  .from("chats")
  .select("id, name")
  .eq("id", chatId)
  .single();

  const { error } = await admin
    .from("chat_members")
    .delete()
    .eq("chat_id", chatId)
    .eq("user_id", memberId);

  if (error) {
  return NextResponse.json({ error: error.message }, { status: 400 });
}

  await createNotification({
    admin,
    userId: memberId,
    actorId: user.id,
    title: "Removed From Group Chat",
    message: `You have been removed from ${group?.name || "a group chat"}.`,
    type: "Chat",
    link: "/dashboard/chat",
  });

  return NextResponse.json({
  message: "Employee removed from group successfully.",
});
}