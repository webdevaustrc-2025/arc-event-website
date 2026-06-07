import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// PUT update FAQ
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const faqId = parseInt(id, 10);

    if (isNaN(faqId)) {
      return NextResponse.json(
        { message: "Invalid ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const existing = await prisma.fAQ.findUnique({
      where: { id: faqId },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "FAQ not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.fAQ.update({
      where: { id: faqId },
      data: {
        question: body.question,
        answer: body.answer,
        displayOrder: Number(body.displayOrder ?? 0),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update FAQ:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE FAQ
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const faqId = parseInt(id, 10);

    if (isNaN(faqId)) {
      return NextResponse.json(
        { message: "Invalid ID" },
        { status: 400 }
      );
    }

    const existing = await prisma.fAQ.findUnique({
      where: { id: faqId },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "FAQ not found" },
        { status: 404 }
      );
    }

    await prisma.fAQ.delete({
      where: { id: faqId },
    });

    return NextResponse.json({
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete FAQ:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}