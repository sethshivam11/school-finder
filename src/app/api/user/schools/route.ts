import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET() {
  const db = await connectDB();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    const [schools] = await db.execute(
      `SELECT * FROM schools WHERE creator=?`,
      [user.id]
    );

    if (Array.isArray(schools) && schools.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No schools found",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data: schools, message: "Schools found" },
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
