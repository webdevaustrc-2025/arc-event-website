import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.aboutEvent.findMany({
      orderBy: { displayOrder: "asc" },
    });
    
    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Failed to fetch admin events:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, tag, badge, description, date, location, imageUrl, displayOrder } = body;

    if (!title || !description) {
      return NextResponse.json({ success: false, message: "Title and description are required" }, { status: 400 });
    }

    const item = await prisma.aboutEvent.create({
      data: {
        title,
        tag: tag || "Championship",
        badge: badge || "Achievement",
        description,
        date: date || "",
        location: location || "",
        imageUrl,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder.toString()) : 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: item,
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create event item:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
