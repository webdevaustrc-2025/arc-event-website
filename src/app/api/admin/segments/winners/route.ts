import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin-verification";

// GET - Fetch all winners for a specific segment
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const segmentName = searchParams.get("segmentName");

    if (!segmentName) {
      return NextResponse.json(
        { error: "Segment name is required" },
        { status: 400 }
      );
    }

    const winners = await prisma.winner.findMany({
      where: { segmentName },
      orderBy: { position: "asc" },
    });

    return NextResponse.json({ success: true, data: winners });
  } catch (error) {
    console.error("Error fetching segment winners:", error);
    return NextResponse.json(
      { error: "Failed to fetch segment winners" },
      { status: 500 }
    );
  }
}

// POST - Create a new winner for a specific segment
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, imageUrl, position, segmentName } = body;

    if (!name || !position || !segmentName) {
      return NextResponse.json(
        { error: "Name, position, and segment name are required" },
        { status: 400 }
      );
    }

    const winner = await prisma.winner.create({
      data: {
        name,
        imageUrl,
        position,
        segmentName,
      },
    });

    return NextResponse.json({ success: true, data: winner });
  } catch (error) {
    console.error("Error creating segment winner:", error);
    return NextResponse.json(
      { error: "Failed to create segment winner" },
      { status: 500 }
    );
  }
}
