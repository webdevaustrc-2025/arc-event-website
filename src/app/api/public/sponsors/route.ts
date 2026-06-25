import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: [{ displayOrder: "asc" }],
    });

    return NextResponse.json(sponsors);
  } catch (error) {
    console.error("Failed to fetch public sponsors:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}