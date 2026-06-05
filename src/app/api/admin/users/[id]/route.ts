import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// Mock database
const users: Record<
  number,
  {
    id: number;
    name: string;
    email: string;
    team: string;
    role: string;
    status: string;
    segment: string;
  }
> = {
  1: { id: 1, name: 'Alex Johnson', email: 'alex@example.com', team: 'CyberKnights', role: 'Captain', status: 'Approved', segment: 'Robo Wars' },
  2: { id: 2, name: 'Sam Smith', email: 'sam@example.com', team: 'MechMinds', role: 'Member', status: 'Pending', segment: 'Line Follower' },
  3: { id: 3, name: 'Jordan Lee', email: 'jordan@example.com', team: 'ScrapBots', role: 'Captain', status: 'Rejected', segment: 'Drone Racing' },
  4: { id: 4, name: 'Taylor Swift', email: 'taylor@example.com', team: 'SparkPlugs', role: 'Member', status: 'Approved', segment: 'Hackathon' },
  5: { id: 5, name: 'Casey Jones', email: 'casey@example.com', team: 'CircuitBreakers', role: 'Captain', status: 'Pending', segment: 'Robo Wars' },
  6: { id: 6, name: 'Riley Reid', email: 'riley@example.com', team: 'CircuitBreakers', role: 'Member', status: 'Pending', segment: 'Robo Wars' },
  7: { id: 7, name: 'Morgan Freeman', email: 'morgan@example.com', team: 'AutoBots', role: 'Captain', status: 'Approved', segment: 'AI Challenge' },
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
    const userId = parseInt(id);
    const user = users[userId];

    if (!user) {
      return NextResponse.json(
        { success: false, error: "NOT_FOUND", message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: "User fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "Failed to fetch user",
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
    const userId = parseInt(id);
    const user = users[userId];

    if (!user) {
      return NextResponse.json(
        { success: false, error: "NOT_FOUND", message: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updatedUser = { ...user, ...body, id: userId };
    users[userId] = updatedUser;

    return NextResponse.json(
      {
        success: true,
        data: updatedUser,
        message: "User updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "Failed to update user",
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
    const userId = parseInt(id);
    if (!users[userId]) {
      return NextResponse.json(
        { success: false, error: "NOT_FOUND", message: "User not found" },
        { status: 404 }
      );
    }

    delete users[userId];

    return NextResponse.json(
      {
        success: true,
        data: null,
        message: "User deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "Failed to delete user",
      },
      { status: 500 }
    );
  }
}
