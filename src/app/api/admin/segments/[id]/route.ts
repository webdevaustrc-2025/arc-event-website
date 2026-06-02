import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const segmentId = parseInt(id);

    const segment = await prisma.segment.findUnique({
      where: { id: segmentId },
    });

    if (!segment) {
      return NextResponse.json(
        { success: false, error: "NOT_FOUND", message: "Segment not found" },
        { status: 404 }
      );
    }

    // Map database fields to mock fields to support legacy elements that expect 'title' or 'prize'
    const mappedSegment = {
      ...segment,
      title: segment.name,
      prize: segment.prizePool,
    };

    return NextResponse.json(
      {
        success: true,
        data: mappedSegment,
        message: "Segment fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching segment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "Failed to fetch segment",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const segmentId = parseInt(id);

    const existing = await prisma.segment.findUnique({
      where: { id: segmentId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "NOT_FOUND", message: "Segment not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Map updated fields from body with fallback to legacy keys and existing values
    const name = body.name || body.title || existing.name;
    const description = body.description !== undefined ? body.description : existing.description;
    const rules = body.rules !== undefined ? body.rules : existing.rules;
    const prizePool = body.prizePool || body.prize || existing.prizePool;
    const category = body.category !== undefined ? body.category : existing.category;
    const type = body.type !== undefined ? body.type : existing.type;
    const difficulty = body.difficulty !== undefined ? body.difficulty : existing.difficulty;
    const teamSize = body.teamSize !== undefined ? body.teamSize : existing.teamSize;
    const fee = body.fee !== undefined ? body.fee : existing.fee;
    const deadline = body.deadline !== undefined ? body.deadline : existing.deadline;
    const location = body.location !== undefined ? body.location : existing.location;
    const scheduleText = body.scheduleText !== undefined ? body.scheduleText : existing.scheduleText;
    const ruleBookUrl = body.ruleBookUrl !== undefined ? body.ruleBookUrl : existing.ruleBookUrl;
    const highlights = Array.isArray(body.highlights) ? body.highlights : existing.highlights;
    const status = body.status !== undefined ? body.status : existing.status;
    const imageUrl = body.imageUrl !== undefined ? body.imageUrl : existing.imageUrl;

    const updated = await prisma.segment.update({
      where: { id: segmentId },
      data: {
        name,
        description,
        rules,
        prizePool,
        category,
        type,
        difficulty,
        teamSize,
        fee,
        deadline,
        location,
        scheduleText,
        ruleBookUrl,
        highlights,
        status,
        imageUrl,
      },
    });

    const mappedSegment = {
      ...updated,
      title: updated.name,
      prize: updated.prizePool,
    };

    return NextResponse.json(
      {
        success: true,
        data: mappedSegment,
        message: "Segment updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating segment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "Failed to update segment",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const segmentId = parseInt(id);

    const existing = await prisma.segment.findUnique({
      where: { id: segmentId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "NOT_FOUND", message: "Segment not found" },
        { status: 404 }
      );
    }

    await prisma.segment.delete({
      where: { id: segmentId },
    });

    return NextResponse.json(
      {
        success: true,
        data: null,
        message: "Segment deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting segment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "Failed to delete segment",
      },
      { status: 500 }
    );
  }
}
