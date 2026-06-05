import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
    const sortBy = searchParams.get("sortBy") || "id";
    const sortOrder = (searchParams.get("sortOrder") || "asc") as "asc" | "desc";

    // Build query conditions
    const where = search ? {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
        { status: { contains: search, mode: "insensitive" as const } },
      ],
    } : {};

    // Map frontend/mock keys to database column names
    const allowedSortFields = [
      "id", "name", "description", "rules", "prizePool", "category",
      "type", "difficulty", "teamSize", "fee", "deadline",
      "location", "scheduleText", "ruleBookUrl", "status", "imageUrl"
    ];
    let dbSortBy = sortBy === "title" ? "name" : (sortBy === "prize" ? "prizePool" : sortBy);
    if (!allowedSortFields.includes(dbSortBy)) {
      dbSortBy = "id";
    }

    const skip = (page - 1) * limit;

    // Fetch items and total count
    const [dbItems, total] = await Promise.all([
      prisma.segment.findMany({
        where,
        orderBy: {
          [dbSortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.segment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Map database fields to mock fields to support legacy elements that expect 'title' or 'prize'
    const items = dbItems.map((item) => ({
      ...item,
      title: item.name,      // Legacy mapping
      prize: item.prizePool, // Legacy mapping
    }));

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
        message: "Segments fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching segments:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "Failed to fetch segments",
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
    
    // Parse name and prizePool with fallback to title and prize from older client calls
    const name = body.name || body.title;
    const description = body.description || "";
    const rules = body.rules || "";
    const prizePool = body.prizePool || body.prize || "$0";
    const category = body.category || "General";
    const type = body.type || "Team";
    const difficulty = body.difficulty || "Medium";
    const teamSize = body.teamSize || "TBA";
    const fee = body.fee || "TBA";
    const deadline = body.deadline || "TBA";
    const location = body.location || "TBA";
    const scheduleText = body.scheduleText || "TBA";
    const ruleBookUrl = body.ruleBookUrl || null;
    const highlights = Array.isArray(body.highlights) ? body.highlights : [];
    const status = body.status || "active";
    const imageUrl = body.imageUrl || null;

    if (!name || !status) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "Missing required fields: name/title, status",
        },
        { status: 400 }
      );
    }

    // Save directly to the database via Prisma
    const newSegment = await prisma.segment.create({
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

    // Return mapped segment to client
    const mappedSegment = {
      ...newSegment,
      title: newSegment.name,
      prize: newSegment.prizePool,
    };

    return NextResponse.json(
      {
        success: true,
        data: mappedSegment,
        message: "Segment created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating segment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "Failed to create segment",
      },
      { status: 500 }
    );
  }
}
