import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { reviewSchema } from "@/lib/validations/review";

// GET all reviews (Public)
export async function GET() {
  if (!prisma.review) {
    return NextResponse.json(
      { message: "Reviews model is not available. Please run prisma generate." },
      { status: 503 }
    );
  }
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST create review (Admin only)
export async function POST(request: Request) {
  if (!prisma.review) {
    return NextResponse.json(
      { message: "Reviews model is not available. Please run prisma generate." },
      { status: 503 }
    );
  }
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: result.data,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
