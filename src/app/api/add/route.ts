import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
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
    const formData = await req.formData();
    const email = formData.get("email")?.toString().trim();
    const name = formData.get("name")?.toString().trim();
    const address = formData.get("address")?.toString().trim();
    const city = formData.get("city")?.toString().trim();
    const state = formData.get("state")?.toString().trim();
    const contact = formData.get("contact")?.toString().trim();
    const file = formData.get("image") as unknown as File;

    if (!name || !email || !address || !city || !state || !contact) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    let imagePath: string | null = null;
    if (file && file.size > 0) {
      if (file.size > 50 * 1024 * 1024) {
        return NextResponse.json(
          {
            success: false,
            message: "Please upload a file smaller than 50MB",
          },
          { status: 400 }
        );
      }

      const fileBuffer = await file.arrayBuffer();

      const mimeType = file.type;
      const encoding = "base64";
      const base64Data = Buffer.from(fileBuffer).toString("base64");

      const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

      const upload = await uploadToCloudinary(fileUri);
      imagePath = upload?.secure_url || null;
    }

    const [result] = await db.execute(
      `
      INSERT INTO schools (email_id, name, address, city, state, contact, image, creator)  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [email, name, address, city, state, contact, imagePath, user.id]
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
        message: "School added successfully",
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
