import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const scheduleCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  day: z.string().min(1, "Day is required").default("Day 1"),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start time format",
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid end time format",
  }),
  venue: z.string().min(1, "Venue is required"),
  segmentId: z.number().nullable().optional(),
  displayOrder: z.number().int().default(0),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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
    console.error("Failed to fetch admin schedules:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = scheduleCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = result.data;

    if (data.segmentId) {
      const segment = await prisma.segment.findUnique({
        where: { id: data.segmentId },
      });
      if (!segment) {
        return NextResponse.json(
          { message: "Associated segment not found" },
          { status: 400 }
        );
      }
    }

    const schedule = await prisma.schedule.create({
      data: {
        title: data.title,
        day: data.day,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        venue: data.venue,
        segmentId: data.segmentId,
        displayOrder: data.displayOrder,
      },
      include: {
        segment: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error("Failed to create schedule:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
