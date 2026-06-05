import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id ? parseInt(session.user.id) : null;

    // Check if leaderboard table is empty. If empty, seed some records dynamically
    const count = await prisma.leaderboard.count();
    if (count === 0) {
      console.log("Leaderboard empty. Seeding mock leaderboard entries...");
      const users = await prisma.user.findMany({
        where: { role: "user" },
        take: 8,
      });

      if (users.length > 0) {
        // Seed some points & ranks for these users
        const seedPoints = [950, 920, 890, 850, 820, 790, 760, 730];
        const seedRanks = [1, 2, 3, 4, 5, 6, 7, 8];
        const defaultUniversities = ["BUET", "DU", "CUET", "RUET", "KUET", "NSU", "AUST", "IUT"];

        for (let i = 0; i < users.length; i++) {
          const u = users[i] as any;
          const rank = seedRanks[i] || (i + 1);
          const points = seedPoints[i] || (1000 - i * 30);
          
          await prisma.leaderboard.create({
            data: {
              userId: u.id,
              points,
              rank,
            },
          });

          // Also set user's university if empty to make it look nice
          if (!u.university) {
            await prisma.user.update({
              where: { id: u.id },
              data: {
                university: defaultUniversities[i % defaultUniversities.length],
                department: "Computer Science & Engineering",
                phone: `+880 1711-${100000 + i}`,
                studentId: `UG-2022-${10000 + i}`,
              } as any,
            });
          }
        }
      }
    }

    // Now query the leaderboard with User relation
    const leaderboardItems = await prisma.leaderboard.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            university: true,
            avatarUrl: true,
          } as any,
        },
      },
      orderBy: { rank: "asc" },
    });

    const mappedLeaderboard = leaderboardItems.map((item) => {
      const isCurrentUser = currentUserId !== null && item.userId === currentUserId;
      
      return {
        rank: item.rank,
        name: item.user?.name ?? "Participant",
        university: (item.user as any)?.university ?? "AUST",
        points: item.points,
        avatar: item.user?.avatarUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(String(item.user?.name || "avatar"))}`,
        isCurrentUser,
      };
    });

    return NextResponse.json(mappedLeaderboard);
  } catch (error) {
    console.error("Dashboard leaderboard API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
