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
        subject: "Welcome to Errandly247!",
        html: `
        <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:30px;">
          <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:14px; overflow:hidden;">
            <div style="background:#000000; color:#ffffff; padding:28px; text-align:center;">
              <h1 style="margin:0; font-size:26px;">Welcome to Errandly247</h1>
              <p style="margin-top:8px; font-size:14px; color:#e5e5e5;">
                Get Started with Your Dashboard
              </p>
            </div>

            <div style="padding:28px; color:#222;">
              <p style="font-size:16px;">Dear <strong>${fullName}</strong>,</p>

              <p style="font-size:15px; line-height:1.6;">
               A warm welcome to the Errandly247 team! We are excited to have you join us and look forward to working with you as you begin your role as a Personal Shopper.
              </p>

               <p style="font-size:15px; line-height:1.6;">
               Your employee account has been successfully created, and your Employee Dashboard is now ready for use. This dashboard will serve as your primary workspace for attendance tracking, task management, team communication, and company updates.
              </p>

              <p style="font-size:15px; line-height:1.6;">
               Employee Dashboard Access
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
                Dashboard Login
              </a>

              <p style="margin-top:24px; font-size:14px; color:#666; line-height:1.6;">
                For security, please change your password after your first login.
                Do not share your login details with anyone.
              </p>

              <h2 style="margin-top:35px; font-size:20px; line-height:1.6;">Work Schedule</h2>

              <div style="background:#f9fafb; padding:16px; border-left:4px solid #000;"> <p><strong>Regular Schedule:</strong> Monday to Saturday</p> <p><strong>Working Hours:</strong> 10:00 AM - 3:00 PM</p> </div>

              <p style="margin-top:15px;"> Please ensure that you record your attendance daily during your scheduled work hours. </p>

              <h2 style="margin-top:35px; font-size:20px; line-height:1.6;">Dashboard Menu & Functions</h2>

              <p style="font-size:15px; line-height:1.6;"> Your Employee Dashboard contains several menu options designed to help you manage your work, track attendance, communicate with your team, and monitor assigned tasks. </p>

              <h3 style="font-size:20px; line-height:1.6;">1. Dashboard</h3>

              <p style="font-size:15px; line-height:1.6;"> The Dashboard provides a summary of your account activity, including attendance records, assigned projects, chat activity, and profile information. </p>
 
              <h3 style="font-size:20px; line-height:1.6;">2. Attendance</h3>

              <p style="font-size:15px; line-height:1.6;"> The Attendance menu is used to record your daily work hours. </p>

              <ul style="background:#f8f8f8; padding:18px; border-radius:10px; margin:24px 0; border:1px solid #eeeeee;"> 
              <li style="margin:0 0 10px; font-size:15px;">At the start of your shift, click <strong>Check In</strong>.</li> 
              <li style="margin:0 0 10px; font-size:15px;">The system only tracks work hours after check-in.</li> 
              <li style="margin:0 0 10px; font-size:15px;">At the end of your shift, click <strong>Check Out</strong>.</li> 
              <li style="margin:0 0 10px; font-size:15px;">You can also review your attendance history from this section.</li> 
              </ul>

              <h3 style="margin-top:35px; font-size:20px; line-height:1.6;">3. Projects</h3>

              <p style="font-size:15px; line-height:1.6;"> The Projects menu allows you to view assigned tasks, accept new assignments, monitor progress, and manage your workload. </p>

              <p style="font-size:15px; line-height:1.6;"> When a new task is assigned, you will receive a notification. Review the task details, accept the assignment, and communicate with your supervisor through the Chat section. </p>

              <h3 style="margin-top:35px; font-size:20px; line-height:1.6;">4. Chat</h3>

              <p style="font-size:15px; line-height:1.6;"> The Chat menu is used for work-related communication. You can participate in group discussions, receive important updates, and communicate directly with supervisors and team members. </p>

              <h2 style="margin-top:35px; font-size:20px;">Additional Menu Options</h2>

              <h3 style="margin-top:25px; font-size:20px; line-height:1.6;">User Profile</h3>

              <p style="font-size:15px; line-height:1.6;"> Review and update your personal information. Please ensure your address and contact details remain accurate, as assignments may be based on your location. </p>

              <p style="font-size:15px; line-height:1.6;"> You may also change your password from this section at any time. </p>

              <h3 style="margin-top:35px; font-size:20px;">Logout</h3>

              <p style="font-size:15px; line-height:1.6;"> Use the Logout option when you have completed your workday and wish to securely sign out of the dashboard. </p>

              <h2 style="margin-top:35px; font-size:20px;">Navigation Tips</h2>

              <h3 style="margin-top:25px; font-size:20px; line-height:1.6;">Mobile Devices</h3>

              <p style="font-size:15px; line-height:1.6;"> Tap the menu icon (☰) in the upper-left corner of the screen to access all dashboard sections. </p>

              <p style="font-size:15px; line-height:1.6;">The options menu (...) in the upper-right corner provides access to:</p>

              <ul style="background:#f8f8f8; padding:18px; border-radius:10px; margin:24px 0; border:1px solid #eeeeee;"> 
              <li style="margin:0 0 10px; font-size:15px;">☀️ Theme Toggle</li> 
              <li style="margin:0 0 10px; font-size:15px;">🔔 Notifications</li> 
              <li style="margin:0 0 10px; font-size:15px;">Profile Menu</li> 
              </ul>

              <p style="margin-top:28px; font-size:20px;">Profile Menu options:</p>

              <ul style="background:#f8f8f8; padding:18px; border-radius:10px; margin:24px 0; border:1px solid #eeeeee;"> 
              <li style="margin:0 0 10px; font-size:15px;">Edit Profile</li> 
              <li style="margin:0 0 10px; font-size:15px;">Sign Out</li> 
              </ul>

              <h3 style="margin-top:28px; font-size:20px;">Desktop & Laptop Computers</h3>

              <p style="font-size:15px; line-height:1.6;"> The navigation menu is permanently displayed on the left side of the screen. </p>

              <p style="font-size:15px; line-height:1.6;">Top navigation options include:</p>

              <ul style="background:#f8f8f8; padding:18px; border-radius:10px; margin:24px 0; border:1px solid #eeeeee;"> 
              <li style="margin:0 0 10px; font-size:15px;">☀️ Theme Toggle</li> 
              <li style="margin:0 0 10px; font-size:15px;">🔔 Notifications</li> 
              <li style="margin:0 0 10px; font-size:15px;">Profile Menu</li> 
              </ul>

              <p style="margin-top:28px; font-size:15px;">Profile Menu options:</p>

              <ul style="background:#f8f8f8; padding:18px; border-radius:10px; margin:24px 0; border:1px solid #eeeeee;"> 
              <li style="margin:0 0 10px; font-size:15px;">Edit Profile</li> 
              <li style="margin:0 0 10px; font-size:15px;">Sign Out</li> 
              </ul>

              <h2 style="margin-top:35px; font-size:15px;">Security Reminder</h2>

              <p style="font-size:15px; line-height:1.6;"> Please keep your login credentials secure and confidential. Do not share your account information with anyone. </p>

              <p style="font-size:15px; line-height:1.6;"> If you experience any issues accessing or navigating the dashboard, please contact the support team for assistance. </p>

              <p style="font-size:15px; line-height:1.6;"> We are committed to making your onboarding experience smooth and successful. Should you have any questions, our team is here to support you. </p>

              <p style="font-size:15px; line-height:1.6;"> Welcome aboard, and we wish you great success with Errandly247. </p>

              <p style="margin-top:28px; font-size:15px;">
                Warm regards,<br/>
                <strong>Errandly247 Onboarding Team</strong>
              </p>
            </div>

            <div style="background:#fafafa; padding:16px; text-align:center; font-size:12px; color:#777;">
              This is an automated onboarding notification from the Errandly247 Employee Dashboard.
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