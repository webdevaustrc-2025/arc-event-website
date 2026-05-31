import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sponsorSchema } from "@/lib/validations/sponsor";

// GET all sponsors
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const sponsors = await prisma.sponsor.findMany({
      orderBy: [{ tier: "asc" }, { displayOrder: "asc" }],
    });

    return NextResponse.json(sponsors);
  } catch (error) {
    console.error("Failed to fetch sponsors:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST create sponsor
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = sponsorSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const sponsor = await prisma.sponsor.create({
      data: result.data,
    });

    return NextResponse.json(sponsor, { status: 201 });
  } catch (error) {
    console.error("Failed to create sponsor:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}