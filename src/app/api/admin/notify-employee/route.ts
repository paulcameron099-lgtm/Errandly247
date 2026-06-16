import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/server";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request) {
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

    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (
      !currentProfile ||
      (currentProfile.role !== "admin" && currentProfile.role !== "manager")
    ) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const adminClient = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: employee, error: employeeError } = await adminClient
      .from("profiles")
      .select("email, full_name, first_name, job_title, status")
      .eq("id", employeeId)
      .single();

    if (employeeError || !employee) {
      return NextResponse.json(
        { error: "Employee profile not found." },
        { status: 404 }
      );
    }

    if (employee.status === "restricted") {
      return NextResponse.json(
        { error: "Cannot notify a restricted employee." },
        { status: 400 }
      );
    }

    let emailSent = true;

    try {
      await sendMail({
        to: employee.email,
        subject: "New Message Notification ",
        html: `
          <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:30px;">
            <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:14px; overflow:hidden;">
              <div style="background:#000000; color:#ffffff; padding:28px; text-align:center;">
                <h1 style="margin:0; font-size:24px;">You Have Received a New Message</h1>
                <p style="margin-top:8px; font-size:14px; color:#e5e5e5;">
                  Dashboard Notification
                </p>
              </div>

              <div style="padding:28px; color:#222;">
                <p style="font-size:16px;">
                  Hello <strong>${employee.full_name || employee.first_name || "Team Member"}</strong>,
                </p>

                <p style="font-size:15px; line-height:1.7;">
                 You have received a new message from your supervisor, Peter Payne, in the Chat section of your dashboard.
                </p>

                <div style="background:#f8f8f8; border:1px solid #eeeeee; padding:18px; border-radius:10px; margin:24px 0;">
                  <p style="margin:0 0 10px; font-size:15px;">
                    <strong>Section:</strong> Chat
                  </p>
                  <p style="margin:0 0 10px; font-size:15px;">
                    <strong>Sender:</strong> Peter Payne
                  </p>
                </div>

                <p style="margin:0; font-size:15px; margin-bottom:5px;">
                    Kindly log in to your dashboard to review the message and respond as needed.
                </p>

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
      console.error("Notify employee email failed:", mailError);
      emailSent = false;
    }

    return NextResponse.json({
      message: emailSent
        ? "Employee notification sent successfully."
        : "Notification action completed, but email failed to send.",
    });
  } catch (error) {
    console.error("Notify employee error:", error);

    return NextResponse.json(
      { error: "Something went wrong while notifying employee." },
      { status: 500 }
    );
  }
}