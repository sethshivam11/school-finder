import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { User } from "../sign-up/route";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const db = await connectDB();

  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and code are required",
        },
        { status: 400 }
      );
    }

    const [user] = await db.execute<User[]>(
      `SELECT id, fullName, email, isVerified, code, codeExpiry FROM users WHERE email = ?`,
      [email]
    );

    if (!user[0]) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (user[0].isVerified === 1) {
      return NextResponse.json(
        {
          success: true,
          message: "Email already verified",
        },
        { status: 200 }
      );
    }

    if (user[0].code !== code) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification code",
        },
        { status: 400 }
      );
    }

    if (user[0].codeExpiry < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code has expired",
        },
        { status: 400 }
      );
    }

    await db.execute(
      `UPDATE users SET isVerified=1, code=NULL, codeExpiry=NULL WHERE email = ?`,
      [email]
    );

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: "Email verified successfully",
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
