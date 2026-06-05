import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: [{ displayOrder: "asc" }],
    });

    const grouped = {
      gold: sponsors.filter((s) => s.tier === "gold"),
      silver: sponsors.filter((s) => s.tier === "silver"),
      bronze: sponsors.filter((s) => s.tier === "bronze"),
    };

    return NextResponse.json(grouped);
  } catch (error) {
    console.error("Failed to fetch public sponsors:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}