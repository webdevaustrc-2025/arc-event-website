import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET FAQs (Public)
export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: {
        displayOrder: "asc",
      },
    });

    return NextResponse.json(faqs);
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// CREATE FAQ (Admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const faq = await prisma.fAQ.create({
      data: {
        question: body.question,
        answer: body.answer,
        displayOrder: Number(body.displayOrder || 0),
      },
    });

    return NextResponse.json(faq, {
      status: 201,
    });
  } catch (error) {
    console.error("Failed to create FAQ:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}