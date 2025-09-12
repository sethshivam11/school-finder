import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sendEmail } from "@/lib/mailer";
import { mail, mailText } from "@/lib/mail";
import { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
  fullName: string;
  email: string;
  password: string;
  code: string;
  codeExpiry: Date;
  isVerified: 0 | 1;
}

export async function POST(req: NextRequest) {
  const db = await connectDB();

  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const [existingUser] = await db.execute<User[]>(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    const code = Math.floor(100_000 + Math.random() * 900_000).toString();
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);

    if (
      Array.isArray(existingUser) &&
      existingUser.length > 0 &&
      existingUser[0]?.isVerified === 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 400 }
      );
    }

    if(existingUser[0]?.isVerified === 0) {
      await db.execute(`DELETE FROM users WHERE email = ?`, [email]);
    }

    const [user] = await db.execute(
      `INSERT INTO users (fullName, email, password, code, codeExpiry) VALUES (?, ?, ?, ?, ?)`,
      [fullName, email, hashedPassword, code, codeExpiry]
    );

    await sendEmail({
      to: email,
      subject: "Verify your email",
      text: mailText(code),
      html: mail(code),
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create user",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
      },
      { status: 201 }
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
