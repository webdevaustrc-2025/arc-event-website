import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET all items
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.aboutGallery.findMany({
      orderBy: { displayOrder: "asc" },
    });
    
    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Failed to fetch admin gallery:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

// POST create item
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, imageUrl, displayOrder } = body;

    if (!title || !description || !imageUrl) {
      return NextResponse.json({ success: false, message: "Title, description, and image URL are required" }, { status: 400 });
    }

    const item = await prisma.aboutGallery.create({
      data: {
        title,
        description,
        imageUrl,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder.toString()) : 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: item,
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create gallery item:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
