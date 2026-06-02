import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const segments = await prisma.segment.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        rules: true,
        prizePool: true,
        category: true,
        type: true,
        difficulty: true,
        teamSize: true,
        fee: true,
        deadline: true,
        location: true,
        scheduleText: true,
        ruleBookUrl: true,
        highlights: true,
        status: true,
        imageUrl: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(segments);
  } catch (error) {
    console.error("Failed to fetch segments list:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
