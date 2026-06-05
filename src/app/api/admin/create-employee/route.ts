import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/server";
import { sendMail } from "@/lib/mailer";
import { createNotification } from "@/lib/createNotification";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      jobTitle,
      country,
      cityState,
      postalCode,
      password,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !role ||
      !jobTitle ||
      !country ||
      !cityState ||
      !postalCode ||
      !password
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const allowedRoles = ["employee", "manager", "admin", "supervisor"];

    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data: adminProfile, error: adminProfileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (adminProfileError || !adminProfile) {
      return NextResponse.json(
        { error: "Admin profile not found." },
        { status: 403 }
      );
    }

    if (adminProfile.role !== "admin" && adminProfile.role !== "manager" && adminProfile.role !== "supervisor") {
      return NextResponse.json(
        { error: "Only admin or manager or supervisor can create users." },
        { status: 403 }
      );
    }

    const adminClient = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const fullName = `${firstName} ${lastName}`;

    const { data: createdUser, error: createUserError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          first_name: firstName,
          last_name: lastName,
        },
      });

    if (createUserError || !createdUser.user) {
      return NextResponse.json(
        { error: createUserError?.message || "Failed to create user." },
        { status: 400 }
      );
    }

    const { error: profileError } = await adminClient.from("profiles").upsert({
      id: createdUser.user.id,
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      email,
      phone,
      role,
      status: "active",
      is_online: false,
      job_title: jobTitle,
      country,
      city_state: cityState,
      postal_code: postalCode,
    });

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    await createNotification({
      admin: adminClient,
      userId: createdUser.user.id,
      actorId: user.id,
      title: "Welcome to Errandly247",
      message: "Your employee account has been created successfully.",
      type: "Account",
      link: "/dashboard",
    });

    let emailSent = true;

    try {
      await sendMail({
        to: email,
        subject: "Welcome to Errandly247 - Your Dashboard Login Details",
        html: `
        <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:30px;">
          <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:14px; overflow:hidden;">
            <div style="background:#000000; color:#ffffff; padding:28px; text-align:center;">
              <h1 style="margin:0; font-size:26px;">Welcome to Errandly247</h1>
              <p style="margin-top:8px; font-size:14px; color:#e5e5e5;">
                Your company dashboard account has been created.
              </p>
            </div>

            <div style="padding:28px; color:#222;">
              <p style="font-size:16px;">Hello <strong>${fullName}</strong>,</p>

              <p style="font-size:15px; line-height:1.6;">
                Welcome to Errandly247. Your account has been created successfully.
                You can now log in to your dashboard to access your attendance,
                assigned projects, company chat, and profile.
              </p>

              <div style="background:#f8f8f8; padding:18px; border-radius:10px; margin:24px 0; border:1px solid #eeeeee;">
                <p style="margin:0 0 10px; font-size:15px;">
                  <strong>Login Email:</strong> ${email}
                </p>
                <p style="margin:0 0 10px; font-size:15px;">
                  <strong>Temporary Password:</strong> ${password}
                </p>
                <p style="margin:0 0 10px; font-size:15px;">
                <strong>Access Level:</strong> ${role}
              </p>
              <p style="margin:0; font-size:15px;">
                <strong>Job Title:</strong> ${jobTitle}
              </p>
              </div>

              <a href="${process.env.NEXT_PUBLIC_APP_URL}/login"
                style="display:inline-block; background:#000000; color:#ffffff; padding:14px 22px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:14px;">
                Login to Dashboard
              </a>

              <p style="margin-top:24px; font-size:14px; color:#666; line-height:1.6;">
                For security, please change your password after your first login.
                Do not share your login details with anyone.
              </p>

              <p style="margin-top:28px; font-size:15px;">
                Regards,<br/>
                <strong>Errandly247 Team</strong>
              </p>
            </div>

            <div style="background:#fafafa; padding:16px; text-align:center; font-size:12px; color:#777;">
              This email was sent automatically by Errandly247.
            </div>
          </div>
        </div>
      `,
      });
    } catch (mailError) {
      console.error("Welcome email failed:", mailError);
      emailSent = false;
    }

    return NextResponse.json({
      message: emailSent
        ? "User created successfully and welcome email sent."
        : "User created successfully, but welcome email failed to send.",
    });

  } catch (error) {
    console.error("Create employee error:", error);

    return NextResponse.json(
      { error: "Something went wrong while creating user." },
      { status: 500 }
    );

    
  }
}