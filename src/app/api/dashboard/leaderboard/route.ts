import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id ? parseInt(session.user.id) : null;

    const { searchParams } = new URL(req.url);
    const segmentIdStr = searchParams.get("segmentId") || "overall";

    if (segmentIdStr === "overall") {
      // 1. Fetch all segments that have resultDeclared: true
      const declaredSegments = await prisma.segment.findMany({
        where: { resultDeclared: true },
        select: { id: true },
      });

      const declaredSegmentIds = declaredSegments.map((s) => s.id);

      if (declaredSegmentIds.length === 0) {
        // No segment results declared yet
        return NextResponse.json({
          declared: false,
          entries: [],
        });
      }

      // 2. Fetch all leaderboard entries for these segments
      const leaderboardItems = await prisma.leaderboard.findMany({
        where: {
          segmentId: { in: declaredSegmentIds },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              university: true,
              avatarUrl: true,
            },
          },
        },
      });

      // 3. Group by userId and sum points
      const userPointsMap = new Map<number, { points: number; user: any }>();
      leaderboardItems.forEach((item) => {
        if (!item.user) return;
        const existing = userPointsMap.get(item.userId);
        if (existing) {
          existing.points += item.points;
        } else {
          userPointsMap.set(item.userId, { points: item.points, user: item.user });
        }
      });

      // 4. Convert to array and sort by total points descending
      const groupedEntries = Array.from(userPointsMap.values());
      groupedEntries.sort((a, b) => b.points - a.points);

      let currentRank = 1;
      const entries = groupedEntries.map((item, idx) => {
        const isCurrentUser = currentUserId !== null && item.user.id === currentUserId;
        if (idx > 0 && item.points !== groupedEntries[idx - 1].points) {
          currentRank = idx + 1;
        }
        return {
          rank: currentRank,
          name: item.user.name ?? "Participant",
          university: item.user.university ?? "AUST",
          points: item.points,
          avatar: item.user.avatarUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(String(item.user.name || "avatar"))}`,
          isCurrentUser,
        };
      });

      return NextResponse.json({
        declared: true,
        entries,
      });
    } else {
      // Fetch leaderboard for a specific segment
      const segmentId = parseInt(segmentIdStr);
      if (isNaN(segmentId)) {
        return NextResponse.json({ message: "Invalid segmentId" }, { status: 400 });
      }

      const segment = await prisma.segment.findUnique({
        where: { id: segmentId },
        select: { id: true, name: true, resultDeclared: true },
      });

      if (!segment) {
        return NextResponse.json({ message: "Segment not found" }, { status: 404 });
      }

      if (!segment.resultDeclared) {
        return NextResponse.json({
          declared: false,
          entries: [],
        });
      }

      const leaderboardItems = await prisma.leaderboard.findMany({
        where: { segmentId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              university: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { points: "desc" },
      });

      let currentRank = 1;
      const entries = leaderboardItems.map((item, idx) => {
        const isCurrentUser = currentUserId !== null && item.userId === currentUserId;
        if (idx > 0 && item.points !== leaderboardItems[idx - 1].points) {
          currentRank = idx + 1;
        }
        return {
          rank: currentRank,
          name: item.user?.name ?? "Participant",
          university: item.user?.university ?? "AUST",
          points: item.points,
          avatar: item.user?.avatarUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(String(item.user?.name || "avatar"))}`,
          isCurrentUser,
        };
      });

      return NextResponse.json({
        declared: true,
        entries,
      });
    }
  } catch (error) {
    console.error("Dashboard leaderboard API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
