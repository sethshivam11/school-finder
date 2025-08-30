import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const db = await connectDB();

  try {
    const { name, email, address, city, state, contact, image } =
      await req.json();

    if (!name || !email || !address || !city || !state || !contact) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const [result] = await db.execute(
      `
      INSERT INTO schools (email_id, name, address, city, state, contact, image)  VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [email, name, address, city, state, contact, image || "null"]
    );

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add school",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "School added successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
