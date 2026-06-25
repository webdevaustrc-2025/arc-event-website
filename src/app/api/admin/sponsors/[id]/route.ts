import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sponsorSchema } from "@/lib/validations/sponsor";

// PUT update sponsor
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
    const sponsorId = parseInt(id, 10);
    if (isNaN(sponsorId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    console.log("Update body:", body); // Debug log

    const result = sponsorSchema.partial().safeParse(body);

    if (!result.success) {
      console.log("Validation errors:", result.error.errors); // Debug log
      return NextResponse.json(
        { message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.sponsor.findUnique({
      where: { id: sponsorId },
    });
    if (!existing) {
      return NextResponse.json(
        { message: "Sponsor not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.sponsor.update({
      where: { id: sponsorId },
      data: {
        name: result.data.name,
        logoUrl: result.data.logoUrl,
        category: result.data.category,
        websiteUrl: result.data.websiteUrl || null,
        displayOrder: result.data.displayOrder,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update sponsor:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE sponsor
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
    const sponsorId = parseInt(id, 10);
    if (isNaN(sponsorId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const existing = await prisma.sponsor.findUnique({
      where: { id: sponsorId },
    });
    if (!existing) {
      return NextResponse.json(
        { message: "Sponsor not found" },
        { status: 404 }
      );
    }

    await prisma.sponsor.delete({ where: { id: sponsorId } });

    return NextResponse.json({ message: "Sponsor deleted successfully" });
  } catch (error) {
    console.error("Failed to delete sponsor:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}