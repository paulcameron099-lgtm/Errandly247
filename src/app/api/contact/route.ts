import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, phone, service, message } =
      await req.json();

    if (!firstName || !lastName || !email || !phone || !service || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const fullName = `${firstName} ${lastName}`;

    await sendMail({
      to: process.env.COMPANY_EMAIL || process.env.SMTP_USER!,
      subject: `New Contact Request - ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:30px;">
          <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:14px; overflow:hidden;">
            <div style="background:#000000; color:#ffffff; padding:28px;">
              <h1 style="margin:0; font-size:24px;">New Contact Request</h1>
              <p style="margin-top:8px; font-size:14px; color:#e5e5e5;">
                Errandly247 Contact Form
              </p>
            </div>

            <div style="padding:28px; color:#222;">
              <p><strong>Name:</strong> ${fullName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Service:</strong> ${service}</p>

              <div style="margin-top:24px; padding:18px; background:#f8f8f8; border:1px solid #eee; border-radius:10px;">
                <p style="margin:0 0 8px;"><strong>Message:</strong></p>
                <p style="margin:0; line-height:1.7;">${message}</p>
              </div>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("Contact mail error:", error);

    return NextResponse.json(
      { error: "Something went wrong while sending message." },
      { status: 500 }
    );
  }
}