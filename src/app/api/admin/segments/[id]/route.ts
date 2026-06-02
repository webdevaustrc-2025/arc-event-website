import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// Mock database
const segments: Record<
  number,
  {
    id: number;
    title: string;
    participants: number;
    prize: string;
    status: string;
    duration: string;
    color: string;
  }
> = {
  1: { id: 1, title: 'Robo Wars', participants: 48, prize: '$5,000', status: 'Active', duration: '3 Hours', color: 'from-orange-500/20 to-red-500/20' },
  2: { id: 2, title: 'Line Follower', participants: 32, prize: '$2,000', status: 'Active', duration: '2 Hours', color: 'from-blue-500/20 to-cyan-500/20' },
  3: { id: 3, title: 'Drone Racing', participants: 24, prize: '$3,500', status: 'Upcoming', duration: '4 Hours', color: 'from-purple-500/20 to-pink-500/20' },
  4: { id: 4, title: 'AI Hackathon', participants: 150, prize: '$10,000', status: 'Registration Open', duration: '24 Hours', color: 'from-[#588157]/20 to-[#a3b18a]/20' },
  5: { id: 5, title: 'Maze Solver', participants: 20, prize: '$1,500', status: 'Active', duration: '1.5 Hours', color: 'from-amber-500/20 to-yellow-500/20' },
};

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
    const segment = segments[segmentId];

    if (!segment) {
      return NextResponse.json(
        { success: false, error: "NOT_FOUND", message: "Segment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: segment,
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
    const segment = segments[segmentId];

    if (!segment) {
      return NextResponse.json(
        { success: false, error: "NOT_FOUND", message: "Segment not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updatedSegment = { ...segment, ...body, id: segmentId };
    segments[segmentId] = updatedSegment;

    return NextResponse.json(
      {
        success: true,
        data: updatedSegment,
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
    if (!segments[segmentId]) {
      return NextResponse.json(
        { success: false, error: "NOT_FOUND", message: "Segment not found" },
        { status: 404 }
      );
    }

    delete segments[segmentId];

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
