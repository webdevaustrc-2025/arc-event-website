import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        segment: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { startTime: "asc" },
        { displayOrder: "asc" },
      ],
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Failed to fetch public schedule:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
