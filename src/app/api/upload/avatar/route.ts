import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dxyhzgrul/image/upload/v1780398181/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4215_bdeofc.jpg";
const AVATAR_UPLOAD_PRESET = process.env.CLOUDINARY_AVATAR_UPLOAD_PRESET || "profile_arcevent";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ message: "File too large. Maximum size is 5MB." }, { status: 400 });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ message: "Cloudinary is not configured correctly." }, { status: 500 });
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary using the configured avatar upload preset.
    const uploadResult = await cloudinary.uploader.unsigned_upload(base64, AVATAR_UPLOAD_PRESET, {
      resource_type: "image",
    });

    const avatarUrl = uploadResult.secure_url;

    // Persist URL to database
    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl } as any,
    });

    return NextResponse.json({ success: true, avatarUrl });
  } catch (error: any) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { message: error?.message || "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}

// DELETE: revert to default avatar
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: DEFAULT_AVATAR } as any,
    });

    return NextResponse.json({ success: true, avatarUrl: DEFAULT_AVATAR });
  } catch (error) {
    console.error("Avatar delete error:", error);
    return NextResponse.json({ message: "Failed to reset avatar." }, { status: 500 });
  }
}
