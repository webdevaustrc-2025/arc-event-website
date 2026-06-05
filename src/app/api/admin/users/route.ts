import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// Mock data - In production, this would come from database
const mockUsers = [
  { id: 1, name: 'Alex Johnson', email: 'alex@example.com', team: 'CyberKnights', role: 'Captain', status: 'Approved', segment: 'Robo Wars' },
  { id: 2, name: 'Sam Smith', email: 'sam@example.com', team: 'MechMinds', role: 'Member', status: 'Pending', segment: 'Line Follower' },
  { id: 3, name: 'Jordan Lee', email: 'jordan@example.com', team: 'ScrapBots', role: 'Captain', status: 'Rejected', segment: 'Drone Racing' },
  { id: 4, name: 'Taylor Swift', email: 'taylor@example.com', team: 'SparkPlugs', role: 'Member', status: 'Approved', segment: 'Hackathon' },
  { id: 5, name: 'Casey Jones', email: 'casey@example.com', team: 'CircuitBreakers', role: 'Captain', status: 'Pending', segment: 'Robo Wars' },
  { id: 6, name: 'Riley Reid', email: 'riley@example.com', team: 'CircuitBreakers', role: 'Member', status: 'Pending', segment: 'Robo Wars' },
  { id: 7, name: 'Morgan Freeman', email: 'morgan@example.com', team: 'AutoBots', role: 'Captain', status: 'Approved', segment: 'AI Challenge' },
];

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = (searchParams.get("sortOrder") || "asc") as "asc" | "desc";

    // Filter users based on search
    let filtered = mockUsers;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.team.toLowerCase().includes(searchLower) ||
          user.segment.toLowerCase().includes(searchLower)
      );
    }

    // Sort users
    const sorted = filtered.sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a];
      const bVal = b[sortBy as keyof typeof b];

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // Paginate
    const total = sorted.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const items = sorted.slice(start, start + limit);

    return NextResponse.json(
      {
        success: true,
        data: {
          items,
          total,
          page,
          limit,
          totalPages,
        },
        message: "Users fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, team, role, status, segment } = body;

    if (!name || !email || !team || !role || !status || !segment) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Create new user (in production, save to database)
    const newUser = {
      id: Math.max(...mockUsers.map((u) => u.id)) + 1,
      name,
      email,
      team,
      role,
      status,
      segment,
    };

    return NextResponse.json(
      {
        success: true,
        data: newUser,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "Failed to create user",
      },
      { status: 500 }
    );
  }
}
