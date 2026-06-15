import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin-verification";

// GET - Fetch all past events with judges and winners
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pastEvents = await prisma.pastEvent.findMany({
      include: {
        judges: true,
        winners: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ success: true, data: pastEvents });
  } catch (error) {
    console.error("Error fetching past events:", error);
    return NextResponse.json(
      { error: "Failed to fetch past events" },
      { status: 500 }
    );
  }
}

// POST - Create a new past event
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, date, description, imageUrl, judges, winners } = body;

    if (!name || !date || !description) {
      return NextResponse.json(
        { error: "Name, date, and description are required" },
        { status: 400 }
      );
    }

    const pastEvent = await prisma.pastEvent.create({
      data: {
        name,
        date: new Date(date),
        description,
        imageUrl,
        judges: judges ? {
          create: judges.map((judge: any) => ({
            name: judge.name,
            title: judge.title,
            imageUrl: judge.imageUrl,
          })),
        } : undefined,
        winners: winners ? {
          create: winners.map((winner: any) => ({
            name: winner.name,
            imageUrl: winner.imageUrl,
            position: winner.position,
            segmentName: winner.segmentName,
          })),
        } : undefined,
      },
      include: {
        judges: true,
        winners: true,
      },
    });

    return NextResponse.json({ success: true, data: pastEvent });
  } catch (error) {
    console.error("Error creating past event:", error);
    return NextResponse.json(
      { error: "Failed to create past event" },
      { status: 500 }
    );
  }
}
