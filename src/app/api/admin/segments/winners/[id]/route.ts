import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin-verification";

// PUT - Update a specific winner
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
    const { name, imageUrl, position, segmentName } = body;

    if (!name || !position || !segmentName) {
      return NextResponse.json(
        { error: "Name, position, and segment name are required" },
        { status: 400 }
      );
    }

    const winner = await prisma.winner.update({
      where: { id: parseInt(params.id) },
      data: {
        name,
        imageUrl,
        position,
        segmentName,
      },
    });

    return NextResponse.json({ success: true, data: winner });
  } catch (error) {
    console.error("Error updating winner:", error);
    return NextResponse.json(
      { error: "Failed to update winner" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific winner
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.winner.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting winner:", error);
    return NextResponse.json(
      { error: "Failed to delete winner" },
      { status: 500 }
    );
  }
}
