import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  // 1. Check admin session
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  try {
    // 2. Fetch all registrations with associated user and segment details
    const registrations = await prisma.registration.findMany({
      include: {
        user: true,
        segment: true,
      },
      orderBy: {
        id: "desc", // Ordered by newest first
      },
    });

    // 3. Return registrations list
    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Admin GET registrations error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
