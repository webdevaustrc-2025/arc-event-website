import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET: Retrieve segment registrations merged with leaderboard entries
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const segmentIdStr = searchParams.get('segmentId');
    if (!segmentIdStr) {
      return NextResponse.json({ message: 'Missing segmentId' }, { status: 400 });
    }

    const segmentId = parseInt(segmentIdStr);
    if (isNaN(segmentId)) {
      return NextResponse.json({ message: 'Invalid segmentId' }, { status: 400 });
    }

    // Check if segment exists
    const segment = await prisma.segment.findUnique({
      where: { id: segmentId },
      select: { id: true, name: true, resultDeclared: true },
    });

    if (!segment) {
      return NextResponse.json({ message: 'Segment not found' }, { status: 404 });
    }

    // Fetch all registrations for this segment
    const registrations = await prisma.registration.findMany({
      where: { segmentId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            university: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Fetch all existing leaderboard entries for this segment
    const leaderboardItems = await prisma.leaderboard.findMany({
      where: { segmentId },
    });

    // Create a map for easy lookup
    const leaderboardMap = new Map();
    leaderboardItems.forEach((item) => {
      leaderboardMap.set(item.userId, item);
    });

    // Map registrations to merge with leaderboard data
    const entries = registrations.map((reg) => {
      const dbLeaderboard = leaderboardMap.get(reg.userId);
      return {
        userId: reg.userId,
        userName: reg.user?.name ?? 'Participant',
        teamName: reg.teamName,
        university: reg.user?.university ?? 'AUST',
        avatarUrl: reg.user?.avatarUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(String(reg.user?.name || 'avatar'))}`,
        points: dbLeaderboard ? dbLeaderboard.points : 0,
        rank: dbLeaderboard ? dbLeaderboard.rank : 0,
        hasLeaderboard: !!dbLeaderboard,
      };
    });

    // Sort by points descending, then by teamName for stable sort
    entries.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return a.teamName.localeCompare(b.teamName);
    });

    // Assign rank dynamically based on points
    let currentRank = 1;
    for (let i = 0; i < entries.length; i++) {
      if (i > 0 && entries[i].points !== entries[i - 1].points) {
        currentRank = i + 1;
      }
      entries[i].rank = currentRank;
    }

    return NextResponse.json({
      segmentId,
      segmentName: segment.name,
      resultDeclared: segment.resultDeclared,
      entries,
    });
  } catch (error) {
    console.error('Error in admin leaderboard GET API:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Save leaderboard configuration (ranks, points, status) for a segment
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { segmentId, resultDeclared, entries } = body;

    if (segmentId === undefined || resultDeclared === undefined || !Array.isArray(entries)) {
      return NextResponse.json({ message: 'Invalid payload parameters' }, { status: 400 });
    }

    const parsedSegmentId = parseInt(String(segmentId));
    if (isNaN(parsedSegmentId)) {
      return NextResponse.json({ message: 'Invalid segmentId' }, { status: 400 });
    }

    // 1. Verify segment exists
    const segment = await prisma.segment.findUnique({
      where: { id: parsedSegmentId },
    });

    if (!segment) {
      return NextResponse.json({ message: 'Segment not found' }, { status: 404 });
    }

    // 2. Perform database updates in a transaction
    await prisma.$transaction(async (tx) => {
      // Update resultDeclared field on segment
      await tx.segment.update({
        where: { id: parsedSegmentId },
        data: { resultDeclared: !!resultDeclared },
      });

      // Sort entries by points descending to compute ranks automatically
      const sortedEntries = [...entries].sort((a, b) => {
        const ptsA = parseInt(a.points) || 0;
        const ptsB = parseInt(b.points) || 0;
        return ptsB - ptsA;
      });

      // Upsert leaderboard entries with auto-calculated ranks
      let currentRank = 1;
      for (let i = 0; i < sortedEntries.length; i++) {
        const entry = sortedEntries[i];
        const userId = parseInt(entry.userId);
        const points = parseInt(entry.points) || 0;

        if (isNaN(userId)) continue;

        if (i > 0) {
          const prevEntry = sortedEntries[i - 1];
          const prevPoints = parseInt(prevEntry.points) || 0;
          if (points !== prevPoints) {
            currentRank = i + 1;
          }
        }

        await tx.leaderboard.upsert({
          where: {
            userId_segmentId: {
              userId,
              segmentId: parsedSegmentId,
            },
          },
          update: {
            points,
            rank: currentRank,
          },
          create: {
            userId,
            segmentId: parsedSegmentId,
            points,
            rank: currentRank,
          },
        });
      }
    });

    // 3. Log activity
    await prisma.activity.create({
      data: {
        title: 'Leaderboard Updated',
        desc: `Admin updated results for event: ${segment.name}. Results declared: ${resultDeclared ? 'Yes' : 'No'}.`,
        icon: 'Trophy',
        color: 'text-amber-500',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in admin leaderboard POST API:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
