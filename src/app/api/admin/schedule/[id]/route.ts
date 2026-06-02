import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const scheduleUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  startTime: z
    .string()
    .refine((val: string) => !isNaN(Date.parse(val)), {
      message: "Invalid start time format",
    })
    .optional(),
  endTime: z
    .string()
    .refine((val: string) => !isNaN(Date.parse(val)), {
      message: "Invalid end time format",
    })
    .optional(),
  venue: z.string().min(1, "Venue is required").optional(),
  segmentId: z.number().nullable().optional(),
  displayOrder: z.number().int().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const scheduleId = parseInt(id, 10);
    if (isNaN(scheduleId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const result = scheduleUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0].message },
        { status: 400 },
      );
    }

    const data = result.data;

    const existing = await prisma.schedule.findUnique({
      where: { id: scheduleId },
    });
    if (!existing) {
      return NextResponse.json(
        { message: "Schedule item not found" },
        { status: 404 },
      );
    }

    if (data.segmentId) {
      const segment = await prisma.segment.findUnique({
        where: { id: data.segmentId },
      });
      if (!segment) {
        return NextResponse.json(
          { message: "Associated segment not found" },
          { status: 400 },
        );
      }
    }

    const updated = await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        title: data.title,
        startTime: data.startTime ? new Date(data.startTime) : undefined,
        endTime: data.endTime ? new Date(data.endTime) : undefined,
        venue: data.venue,
        segmentId: data.segmentId === undefined ? undefined : data.segmentId,
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

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update schedule:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const scheduleId = parseInt(id, 10);
    if (isNaN(scheduleId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const existing = await prisma.schedule.findUnique({
      where: { id: scheduleId },
    });
    if (!existing) {
      return NextResponse.json(
        { message: "Schedule item not found" },
        { status: 404 },
      );
    }

    await prisma.schedule.delete({
      where: { id: scheduleId },
    });

    return NextResponse.json({ message: "Schedule item deleted successfully" });
  } catch (error) {
    console.error("Failed to delete schedule:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
