import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(faqs);
  } catch (error) {
    console.error("Failed to fetch public FAQs:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
