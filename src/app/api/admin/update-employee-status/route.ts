import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/server";
import { sendMail } from "@/lib/mailer";
import { createNotification } from "@/lib/createNotification";

export async function PATCH(req: Request) {
  try {
    const { employeeId, status } = await req.json();

    if (!employeeId || !status) {
      return NextResponse.json(
        { error: "Employee ID and status are required." },
        { status: 400 }
      );
    }

    if (!["active", "restricted"].includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
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
      (currentProfile.role !== "admin" && currentProfile.role !== "manager" && currentProfile.role !== "supervisor" )
    ) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const adminClient = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: employeeProfile, error: employeeError } = await adminClient
      .from("profiles")
      .select("email, full_name, first_name, role, job_title")
      .eq("id", employeeId)
      .single();

    if (employeeError || !employeeProfile) {
      return NextResponse.json(
        { error: "Employee profile not found." },
        { status: 404 }
      );
    }

    const { error } = await adminClient
      .from("profiles")
      .update({ status })
      .eq("id", employeeId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (status === "restricted") {
      await createNotification({
        admin: adminClient,
        userId: employeeId,
        actorId: user.id,
        title: "Account Access Restricted",
        message:
          "Your dashboard access has been restricted. Please contact the support team.",
        type: "Account",
        link: "/dashboard",
      });
    }

    if (status === "active") {
      await createNotification({
        admin: adminClient,
        userId: employeeId,
        actorId: user.id,
        title: "Account Access Restored",
        message: "Your dashboard access has been restored successfully.",
        type: "Account",
        link: "/dashboard",
      });
    }

    let emailSent = true;

    if (status === "restricted") {
      try {
        await sendMail({
          to: employeeProfile.email,
          subject: "Important Notice: Dashboard Access Temporarily Restricted",
          html: `
          <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:30px;">
            <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:14px; overflow:hidden;">
              <div style="background:#000000; color:#ffffff; padding:28px; text-align:center;">
                <h1 style="margin:0; font-size:24px;">Dashboard Access Restricted</h1>
                <p style="margin-top:8px; font-size:14px; color:#e5e5e5;">
                  Dashboard Notification
                </p>
              </div>

              <div style="padding:28px; color:#222;">
                <p style="font-size:16px;">
                  Hello <strong>${employeeProfile.full_name || employeeProfile.first_name || "User"}</strong>,
                </p>

                <p style="font-size:15px; line-height:1.7;">
                  This is to inform you that your Errandly247 Employee Dashboard access has been temporarily restricted. During this period, access to key features such as attendance, projects, and chat will be unavailable.
                </p>

                <div style="background:#fff4f4; border:1px solid #ffd4d4; padding:18px; border-radius:10px; margin:24px 0;">
                  <p style="margin:0 0 10px; font-size:15px;">
                    <strong>Account Email:</strong> ${employeeProfile.email}
                  </p>
                  <p style="margin:0 0 10px; font-size:15px;">
                    <strong>Job Title:</strong> ${employeeProfile.job_title || "Not provided"}
                  </p>
                  <p style="margin:0; font-size:15px;">
                    <strong>Status:</strong> Temporarily Restricted
                  </p>
                </div>

                <p style="font-size:15px; line-height:1.7;">
                 If you believe this action has been applied in error, please contact the Support Team for further assistance and review.
                </p>

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
        console.error("Restriction email failed:", mailError);
        emailSent = false;
      }
    }

   return NextResponse.json({
  message:
    status === "restricted"
      ? emailSent
        ? "Employee account restricted successfully and email notification sent."
        : "Employee account restricted successfully, but email notification failed."
      : "Employee account activated successfully.",
});
  } catch (error) {
    console.error("Update employee status error:", error);

    return NextResponse.json(
      { error: "Something went wrong while updating employee status." },
      { status: 500 }
    );
  }
}