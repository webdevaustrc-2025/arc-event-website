import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  try {
    // 1. Enforce admin session validation
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { message: "Not authorized. Admin access required." },
        { status: 401 },
      );
    }

    // 2. Fetch users with nested registrations and segments
    // This query is directly mapped to your specifications in the work order
    const users = await prisma.user.findMany({
      include: {
        registrations: {
          include: {
            segment: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("ADMIN_USERS_GET_ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch user list." },
      { status: 500 },
    );
  }
}
