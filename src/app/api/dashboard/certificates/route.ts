import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const certificates = await prisma.certificate.findMany({
      where: { userId },
      include: {
        segment: true,
      },
      orderBy: { issuedAt: "desc" },
    });

    // We can also query leaderboard to see if this user has a rank in this segment
    // But since the Leaderboard schema doesn't have segmentId (it's global), we can just check their rank or use "Participant"
    const leaderboardRecord = await prisma.leaderboard.findFirst({
      where: { userId },
    });

    const mappedCertificates = certificates.map((cert) => {
      let rankText = "Participant";
      if (leaderboardRecord && leaderboardRecord.rank <= 3) {
        if (leaderboardRecord.rank === 1) rankText = "1st Place Champion";
        if (leaderboardRecord.rank === 2) rankText = "2nd Place Runner-up";
        if (leaderboardRecord.rank === 3) rankText = "3rd Place";
      }

      return {
        id: cert.id,
        event: cert.segment?.name ?? "Championship Event",
        type: rankText === "Participant" ? "Participation" : "Achievement",
        date: new Date(cert.issuedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        rank: rankText,
        image: cert.segment?.imageUrl ?? "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80",
        fileUrl: cert.fileUrl,
      };
    });

    return NextResponse.json(mappedCertificates);
  } catch (error) {
    console.error("Dashboard certificates API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
