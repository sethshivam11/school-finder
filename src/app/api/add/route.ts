import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req: NextRequest) {
  const db = await connectDB();

  try {
    const formData = await req.formData();
    const email = formData.get("email")?.toString().trim();
    const name = formData.get("name")?.toString().trim();
    const address = formData.get("address")?.toString().trim();
    const city = formData.get("city")?.toString().trim();
    const state = formData.get("state")?.toString().trim();
    const contact = formData.get("contact")?.toString().trim();
    const image = formData.get("image") as unknown as File;

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
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${image.name}`;
      const filePath = path.join(
        process.cwd(),
        "public/schoolImages",
        fileName
      );
      await writeFile(filePath, buffer);

      imagePath = `/schoolImages/${fileName}`;
    }

    const [result] = await db.execute(
      `
      INSERT INTO schools (email_id, name, address, city, state, contact, image)  VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [email, name, address, city, state, contact, imagePath]
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
