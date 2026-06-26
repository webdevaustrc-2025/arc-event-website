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
    const { missionTitle, missionDescription, visionTitle, visionDescription } = body;

    if (!missionDescription || !visionDescription) {
      return NextResponse.json({ message: "Mission and Vision descriptions are required" }, { status: 400 });
    }

    const mv = await prisma.aboutMissionVision.findFirst();
    let updated;
    if (mv) {
      updated = await prisma.aboutMissionVision.update({
        where: { id: mv.id },
        data: { 
          missionTitle: missionTitle || "Our Mission", 
          missionDescription, 
          visionTitle: visionTitle || "Our Vision", 
          visionDescription 
        },
      });
    } else {
      updated = await prisma.aboutMissionVision.create({
        data: { 
          missionTitle: missionTitle || "Our Mission", 
          missionDescription, 
          visionTitle: visionTitle || "Our Vision", 
          visionDescription 
        },
      });
    }

    // Log activity
    await prisma.activity.create({
      data: {
        title: "Mission & Vision Updated",
        desc: `Admin updated Mission and Vision statements.`,
        icon: "Target",
        color: "text-green-500",
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Failed to update Mission & Vision section:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
