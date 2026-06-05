import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { sendMail } from "@/lib/mailer";

function adminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const admin = adminClient();

  const { data: notifications, error } = await admin
    .from("chat_message_notifications")
    .select(
      `
      id,
      message_id,
      chat_id,
      sender_id,
      receiver_id,
      due_at,
      status,
      message:chat_messages (
        id,
        message,
        message_type,
        is_deleted
      ),
      receiver:profiles!chat_message_notifications_receiver_id_fkey (
        id,
        full_name,
        email,
        is_online
      ),
      sender:profiles!chat_message_notifications_sender_id_fkey (
        id,
        full_name,
        role
      ),
      chat:chats (
        id,
        type,
        name
      )
    `
    )
    .eq("status", "pending")
    .lte("due_at", new Date().toISOString())
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of notifications || []) {
    const receiver = Array.isArray(item.receiver)
      ? item.receiver[0]
      : item.receiver;

    const sender = Array.isArray(item.sender) ? item.sender[0] : item.sender;

    const message = Array.isArray(item.message)
      ? item.message[0]
      : item.message;

    const chat = Array.isArray(item.chat) ? item.chat[0] : item.chat;

    if (!receiver || !receiver.email) {
      skipped++;

      await admin
        .from("chat_message_notifications")
        .update({ status: "skipped" })
        .eq("id", item.id);

      continue;
    }

    if (receiver.is_online) {
      skipped++;

      await admin
        .from("chat_message_notifications")
        .update({ status: "skipped" })
        .eq("id", item.id);

      continue;
    }

    if (!message || message.is_deleted) {
      skipped++;

      await admin
        .from("chat_message_notifications")
        .update({ status: "skipped" })
        .eq("id", item.id);

      continue;
    }

    const { data: alreadyRead } = await admin
      .from("chat_message_reads")
      .select("id")
      .eq("message_id", item.message_id)
      .eq("user_id", item.receiver_id)
      .maybeSingle();

    if (alreadyRead) {
      skipped++;

      await admin
        .from("chat_message_notifications")
        .update({ status: "skipped" })
        .eq("id", item.id);

      continue;
    }

    const messageLabel =
      message.message_type === "image"
        ? "an image"
        : message.message_type === "voice"
        ? "a voice note"
        : message.message_type === "file"
        ? "a file"
        : "a new message";

    try {
      await sendMail({
        to: receiver.email,
        subject: "New Message Waiting in Your Errandly247 Dashboard",
        html: `
          <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:30px;">
            <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:14px; overflow:hidden;">
              <div style="background:#000000; color:#ffffff; padding:28px; text-align:center;">
                <h1 style="margin:0; font-size:24px;">New Message Waiting</h1>
                <p style="margin-top:8px; font-size:14px; color:#e5e5e5;">
                  Errandly247 Employee Dashboard
                </p>
              </div>

              <div style="padding:28px; color:#222;">
                <p style="font-size:16px;">
                  Hello <strong>${receiver.full_name || "Team Member"}</strong>,
                </p>

                <p style="font-size:15px; line-height:1.7;">
                  You have ${messageLabel} waiting for you in your Errandly247 employee dashboard.
                  Please log in to review and respond as soon as possible.
                </p>

                <div style="background:#f8f8f8; border:1px solid #eeeeee; padding:18px; border-radius:10px; margin:24px 0;">
                  <p style="margin:0 0 10px; font-size:15px;">
                    <strong>From:</strong> ${sender?.full_name || "Support Team"}
                  </p>

                  <p style="margin:0 0 10px; font-size:15px;">
                    <strong>Chat:</strong> ${
                      chat?.type === "group"
                        ? chat?.name || "Group Chat"
                        : "Private Chat"
                    }
                  </p>

                  <p style="margin:0; font-size:15px;">
                    <strong>Action Required:</strong> Log in and respond
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

      sent++;

      await admin
        .from("chat_message_notifications")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
        })
        .eq("id", item.id);
    } catch (mailError) {
      console.error("Chat notification email failed:", mailError);

      failed++;

      await admin
        .from("chat_message_notifications")
        .update({ status: "failed" })
        .eq("id", item.id);
    }
  }

  return NextResponse.json({
    message: "Chat notification cron completed.",
    sent,
    skipped,
    failed,
  });
}