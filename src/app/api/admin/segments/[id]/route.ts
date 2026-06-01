import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { segmentSchema } from "@/lib/validations/segment";

// PUT update segment
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const segmentId = parseInt(id, 10);
    if (isNaN(segmentId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const result = segmentSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.segment.findUnique({
      where: { id: segmentId },
    });
    if (!existing) {
      return NextResponse.json(
        { message: "Segment not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.segment.update({
      where: { id: segmentId },
      data: result.data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update segment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE segment
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const segmentId = parseInt(id, 10);
    if (isNaN(segmentId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const existing = await prisma.segment.findUnique({
      where: { id: segmentId },
    });
    if (!existing) {
      return NextResponse.json(
        { message: "Segment not found" },
        { status: 404 }
      );
    }

    await prisma.segment.delete({ where: { id: segmentId } });

    return NextResponse.json({ message: "Segment deleted successfully" });
  } catch (error) {
    console.error("Failed to delete segment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
