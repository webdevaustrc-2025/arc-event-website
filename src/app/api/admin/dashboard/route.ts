import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  try {
    // Step 1: Check admin session
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    // Step 2: Fetch stats from database
    const totalUsers = await prisma.user.count();
    const totalRegistrations = await prisma.registration.count();
    const pendingRegistrations = await prisma.registration.count({
      where: { status: "pending" },
    });
    const activeSegments = await prisma.segment.count({
      where: { status: "active" },
    });

    // Step 3: Registration trends: group by day for the chart (past 7 days)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const trendRegistrations = await prisma.registration.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const trends = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });

      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);

      const count = trendRegistrations.filter((r) => {
        const rTime = r.createdAt.getTime();
        return rTime >= start.getTime() && rTime <= end.getTime();
      }).length;

      trends.push({
        id: dayName.toLowerCase(),
        name: dayName,
        registrations: count,
      });
    }

    // Step 4: Fetch latest registrations for recent activity feed
    const recentRegistrations = await prisma.registration.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        user: {
          select: {
            name: true,
          },
        },
        segment: {
          select: {
            name: true,
          },
        },
      },
    });

    // Step 5: Return response
    return NextResponse.json({
      totalUsers,
      totalRegistrations,
      pendingRegistrations,
      activeSegments,
      trends,
      recentRegistrations,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
