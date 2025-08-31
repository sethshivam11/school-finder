import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const db = await connectDB();

  try {
    const [rows] = await db.execute("SELECT * FROM schools");

    if (!rows) {
      return NextResponse.json(
        { success: false, message: "No schools were found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: rows,
        message: "Schools fetched successfully",
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
