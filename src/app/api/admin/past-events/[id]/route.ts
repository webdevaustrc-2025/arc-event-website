import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin-verification";

// GET - Fetch a single past event
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pastEvent = await prisma.pastEvent.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        judges: true,
        winners: true,
      },
    });

    if (!pastEvent) {
      return NextResponse.json(
        { error: "Past event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: pastEvent });
  } catch (error) {
    console.error("Error fetching past event:", error);
    return NextResponse.json(
      { error: "Failed to fetch past event" },
      { status: 500 }
    );
  }
}

// PUT - Update a past event
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Update the past event
    const pastEvent = await prisma.pastEvent.update({
      where: { id: parseInt(params.id) },
      data: {
        name,
        date: new Date(date),
        description,
        imageUrl,
      },
    });

    // Handle judges - delete all existing and create new ones
    if (judges !== undefined) {
      await prisma.judge.deleteMany({
        where: { pastEventId: parseInt(params.id) },
      });

      if (judges.length > 0) {
        await prisma.judge.createMany({
          data: judges.map((judge: any) => ({
            name: judge.name,
            title: judge.title,
            imageUrl: judge.imageUrl,
            pastEventId: parseInt(params.id),
          })),
        });
      }
    }

    // Handle winners - delete all existing and create new ones
    if (winners !== undefined) {
      await prisma.winner.deleteMany({
        where: { pastEventId: parseInt(params.id) },
      });

      if (winners.length > 0) {
        await prisma.winner.createMany({
          data: winners.map((winner: any) => ({
            name: winner.name,
            imageUrl: winner.imageUrl,
            position: winner.position,
            segmentName: winner.segmentName,
            pastEventId: parseInt(params.id),
          })),
        });
      }
    }

    // Fetch updated event with relations
    const updatedEvent = await prisma.pastEvent.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        judges: true,
        winners: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedEvent });
  } catch (error) {
    console.error("Error updating past event:", error);
    return NextResponse.json(
      { error: "Failed to update past event" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a past event
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.pastEvent.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting past event:", error);
    return NextResponse.json(
      { error: "Failed to delete past event" },
      { status: 500 }
    );
  }
}
