import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { promises as fs } from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    // Check Cloudinary configuration
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      // Upload to Cloudinary
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
      const uploadResult = await cloudinary.uploader.upload(base64, {
        folder: "about_us",
        resource_type: "image",
      });
      return NextResponse.json({ success: true, url: uploadResult.secure_url });
    } else {
      // Fallback to local upload
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      // Ensure directory exists
      await fs.mkdir(uploadDir, { recursive: true });

      const fileExtension = path.extname(file.name) || ".png";
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, buffer);
      return NextResponse.json({ success: true, url: `/uploads/${fileName}` });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: error.message || "Upload failed" }, { status: 500 });
  }
}
