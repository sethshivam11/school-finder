import connectDB from "@/lib/db";
import { mail, mailText } from "@/lib/mail";
import { sendEmail } from "@/lib/mailer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const db = await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    const code = Math.floor(100_000 + Math.random() * 900_000).toString();
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await db.execute(
      `UPDATE users SET isVerified = 1, code = ?, codeExpiry = ? WHERE email = ?`,
      [code, codeExpiry, email]
    );

    await sendEmail({
      to: email,
      html: mail(code),
      subject: "Verify your email",
      text: mailText(code),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Verification code sent",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
