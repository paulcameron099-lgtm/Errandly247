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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action } = await req.json();

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
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
      .select("id,role")
      .eq("id", user.id)
      .single();

    if (!currentProfile || !isStaffRole(currentProfile.role)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { data: requestRow, error: requestError } = await admin
      .from("private_chat_requests")
      .select(
        `
        id,
        requester_id,
        receiver_id,
        status,
        requester:profiles!private_chat_requests_requester_id_fkey (
          id,
          email,
          full_name,
          first_name,
          job_title
        ),
        receiver:profiles!private_chat_requests_receiver_id_fkey (
          id,
          email,
          full_name,
          first_name,
          job_title
        )
      `
      )
      .eq("id", id)
      .single();

    if (requestError || !requestRow) {
      return NextResponse.json(
        { error: "Private chat request not found." },
        { status: 404 }
      );
    }

    if (requestRow.status !== "pending") {
      return NextResponse.json(
        { error: "This request has already been reviewed." },
        { status: 400 }
      );
    }

    const requester = Array.isArray(requestRow.requester)
      ? requestRow.requester[0]
      : requestRow.requester;

    const receiver = Array.isArray(requestRow.receiver)
      ? requestRow.receiver[0]
      : requestRow.receiver;

    if (action === "reject") {
      const { error } = await admin
        .from("private_chat_requests")
        .update({
          status: "rejected",
          approved_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        message: "Private chat request rejected successfully.",
      });
    }

   const chatName = null;
   const key = [requestRow.requester_id, requestRow.receiver_id].sort().join("_");

    const { data: chat, error: chatError } = await admin
      .from("chats")
      .insert({
        type: "private",
        name: chatName,
        private_pair_key: key,
        created_by: requestRow.requester_id,
        approved_by: user.id,
        is_approved: true,
        })
      .select("id")
      .single();

    if (chatError || !chat) {
      return NextResponse.json(
        { error: chatError?.message || "Failed to create private chat." },
        { status: 400 }
      );
    }

    const { error: memberError } = await admin.from("chat_members").insert([
      {
        chat_id: chat.id,
        user_id: requestRow.requester_id,
        role: "member",
      },
      {
        chat_id: chat.id,
        user_id: requestRow.receiver_id,
        role: "member",
      },
    ]);

    if (memberError) {
      return NextResponse.json({ error: memberError.message }, { status: 400 });
    }

    const { error: updateError } = await admin
      .from("private_chat_requests")
      .update({
        status: "approved",
        approved_by: user.id,
        chat_id: chat.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    await createNotification({
      admin,
      userId: requestRow.requester_id,
      actorId: requestRow.receiver_id,
      title: "Private Chat Approved",
      message: `${receiver?.full_name || "The employee"} accepted your private chat request.`,
      type: "Chat",
      link: "/dashboard/chat",
    });

    await createNotification({
      admin,
      userId: requestRow.receiver_id,
      actorId: requestRow.requester_id,
      title: "Private Chat Approved",
      message: `A private chat with ${requester?.full_name || "the employee"} is now available.`,
      type: "Chat",
      link: "/dashboard/chat",
    });

    if (requester?.email) {
      try {
        await sendMail({
          to: requester.email,
          subject: "Private Chat Request Approved",
          html: `
            <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:30px;">
              <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:14px; overflow:hidden;">
                <div style="background:#000000; color:#ffffff; padding:28px; text-align:center;">
                  <h1 style="margin:0; font-size:24px;">Request Approved</h1>
                  <p style="margin-top:8px; font-size:14px; color:#e5e5e5;">
                    Dashboard notification
                  </p>
                </div>

                <div style="padding:28px; color:#222;">
                  <p style="font-size:16px;">
                    Hello <strong>${requester.full_name || requester.first_name || "Team Member"}</strong>,
                  </p>

                  <p style="font-size:15px; line-height:1.7;">
                    Your request to start a private chat with <strong>${receiver?.full_name || "the selected employee"}</strong> has been approved.
                    You can now access and continue the conversation through your chat dashboard.
                  </p>

                  <div style="background:#f0fff4; border:1px solid #bbf7d0; padding:18px; border-radius:10px; margin:24px 0;">
                    <p style="margin:0 0 10px; font-size:15px;">
                      <strong>Private Chat:</strong> ${receiver?.full_name || "Approved Employee"}
                    </p>
                    <p style="margin:0; font-size:15px;">
                      <strong>Status:</strong> Approved
                    </p>
                  </div>

                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/chat"
                    style="display:inline-block; background:#000000; color:#ffffff; padding:14px 22px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:14px;">
                    Open Chat
                  </a>

                  <p style="margin-top:28px; font-size:15px;">
                    Regards,<br/>
                    <strong>Support Team</strong><br/>
                    Errandly247
                  </p>
                </div>
                <div style="background:#fafafa; padding:16px; text-align:center; font-size:12px; color:#777;">
                  This is an automated notification from the Errandly247 Employee Dashboard.
                </div>
              </div>
            </div>
          `,
        });
      } catch (mailError) {
        console.error("Private chat approved email failed:", mailError);
      }
    }

    return NextResponse.json({
      message: "Private chat request approved successfully.",
      chatId: chat.id,
    });
  } catch (error) {
    console.error("Approve private request error:", error);

    return NextResponse.json(
      { error: "Something went wrong while reviewing request." },
      { status: 500 }
    );
  }
}