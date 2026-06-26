import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, imageUrl } = body;

    if (!content) {
      return NextResponse.json({ message: "Content description is required" }, { status: 400 });
    }

    const austrc = await prisma.aboutAustrc.findFirst();
    let updated;
    if (austrc) {
      updated = await prisma.aboutAustrc.update({
        where: { id: austrc.id },
        data: { 
          title: title || "Where Bangladesh's Best Engineers Compete.", 
          content, 
          imageUrl 
        },
      });
    } else {
      updated = await prisma.aboutAustrc.create({
        data: { 
          title: title || "Where Bangladesh's Best Engineers Compete.", 
          content, 
          imageUrl 
        },
      });
    }

    // Log activity
    await prisma.activity.create({
      data: {
        title: "About ARC Section Updated",
        desc: `Admin updated About AUST Rover Challenge details.`,
        icon: "Info",
        color: "text-green-500",
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Failed to update About ARC section:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
