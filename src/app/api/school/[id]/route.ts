import connectDB from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";

interface SchoolI {
  id: number;
  name: string;
  email_id: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  image: string | null;
  creator: number;
  createdAt: Date;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id: schoolId } = await params;
  if (!schoolId || isNaN(parseInt(schoolId))) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid school id",
      },
      { status: 400 }
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

    if (!name && !email && !address && !city && !state && !contact) {
      return NextResponse.json(
        {
          success: false,
          message: "Atleast one field is required to update",
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

    const [row] = await db.execute(`SELECT image from schools WHERE id=?`, [
      schoolId,
    ]);
    const school = (row as SchoolI[])[0];

    if (!school) {
      return NextResponse.json(
        {
          success: false,
          message: "School not found",
        },
        { status: 404 }
      );
    }

    if (school.image && imagePath) {
      await deleteFromCloudinary(school.image);
    }

    const newSchool = {
      name: name || school.name,
      email: email || school.email_id,
      address: address || school.address,
      city: city || school.city,
      state: state || school.state,
      contact: contact || school.contact,
      image: imagePath || school.image,
    };

    await db.execute(
      `UPDATE schools SET name=?, email_id=?, address=?, city=?, state=?, contact=?, image=? WHERE id=?`,
      [...Object.values(newSchool), schoolId]
    );

    return NextResponse.json(
      {
        success: true,
        data: newSchool,
        message: "School updated successfully",
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

export async function DELETE(
  _: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
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

  const { id: schoolId } = await params;
  if (!schoolId || isNaN(parseInt(schoolId))) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid school id",
      },
      { status: 400 }
    );
  }

  try {
    const [row] = await db.execute(`SELECT * from schools WHERE id=?`, [
      schoolId,
    ]);

    const school = (row as SchoolI[])[0];
    if (!school) {
      return NextResponse.json(
        {
          success: false,
          message: "School not found",
        },
        { status: 404 }
      );
    }

    if (school.creator !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to delete this school",
        },
        { status: 403 }
      );
    }

    if (school.image) {
      await deleteFromCloudinary(school.image);
    }

    await db.execute(`DELETE FROM schools WHERE id=?`, [schoolId]);

    return NextResponse.json(
      {
        success: true,
        message: "School deleted successfully",
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
