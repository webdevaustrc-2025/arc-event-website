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

    const items = await prisma.aboutWhatWeDo.findMany({
      orderBy: { displayOrder: "asc" },
    });
    
    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Failed to fetch admin what-we-do:", error);
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
    const { title, description, icon, displayOrder } = body;

    if (!title || !description) {
      return NextResponse.json({ success: false, message: "Title and description are required" }, { status: 400 });
    }

    const item = await prisma.aboutWhatWeDo.create({
      data: {
        title,
        description,
        icon: icon || "HelpCircle",
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder.toString()) : 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: item,
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create what-we-do item:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
