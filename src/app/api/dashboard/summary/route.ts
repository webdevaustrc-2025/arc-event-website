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

    const user = (await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        university: true,
        department: true,
        studentId: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        passwordHash: true,
      } as any,
    })) as any;

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Registrations
    const registrations = await prisma.registration.findMany({
      where: { userId },
      include: {
        segment: {
          include: {
            schedule: {
              orderBy: { startTime: "asc" },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Count statistics
    const enrolledCount = registrations.length;
    
    // Completed is if registration status is 'completed' or segment status is 'completed'
    const completedCount = registrations.filter(
      (r) => r.status.toLowerCase() === "completed" || r.segment?.status.toLowerCase() === "completed"
    ).length;

    // Certificates count
    const certificatesCount = await prisma.certificate.count({
      where: { userId },
    });

    // Best rank from Leaderboard
    const bestRankRecord = await prisma.leaderboard.findFirst({
      where: { userId },
      orderBy: { rank: "asc" },
      select: { rank: true },
    });
    const bestRank = bestRankRecord ? `#${bestRankRecord.rank}` : "N/A";

    const formatDate = (date: Date) =>
      date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const latestRegistration = registrations[0];
    const registrationId = latestRegistration ? `ARC-REG-${latestRegistration.id.toString().padStart(5, "0")}` : null;

    // Format events for UI (matching EventCard props)
    const events = registrations.map((reg) => {
      const schedule = reg.segment?.schedule?.[0];
      
      let eventDate = "TBD";
      let eventTime = "TBD";
      let eventLocation = "TBD";

      if (schedule) {
        const start = new Date(schedule.startTime);
        const end = new Date(schedule.endTime);
        
        eventDate = formatDate(start);
        eventTime = `${start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
        eventLocation = schedule.venue;
      }

      // Map status to: 'upcoming' | 'ongoing' | 'completed'
      let mappedStatus: "upcoming" | "ongoing" | "completed" = "upcoming";
      const regStatus = reg.status.toLowerCase();
      const segStatus = reg.segment?.status?.toLowerCase();

      if (regStatus === "completed" || segStatus === "completed") {
        mappedStatus = "completed";
      } else if (regStatus === "ongoing" || segStatus === "ongoing" || regStatus === "approved") {
        // If registration is approved, we treat it as upcoming, unless it's ongoing
        mappedStatus = regStatus === "ongoing" || segStatus === "ongoing" ? "ongoing" : "upcoming";
      } else {
        // pending, rejected, etc.
        mappedStatus = "upcoming";
      }

      return {
        id: reg.id,
        registrationId: reg.id,
        registrationCode: `ARC-REG-${reg.id.toString().padStart(5, "0")}`,
        registrationDate: formatDate(reg.createdAt),
        segmentId: reg.segment?.id ?? null,
        title: reg.segment?.name ?? "Event",
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        status: mappedStatus,
        image: reg.segment?.imageUrl ?? "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
        // additional info for details
        teamName: reg.teamName,
        paymentStatus: reg.paymentStatus,
        registrationStatus: reg.status,
        qrToken: reg.qrToken,
      };
    });

    // Fetch announcements from database
    const announcements = await (prisma as any).announcement.findMany({
      orderBy: { createdAt: "desc" },
    });

    const { passwordHash, createdAt, ...safeUser } = user;

    return NextResponse.json({
      user: {
        ...safeUser,
        hasPassword: Boolean(passwordHash),
        registrationId,
        accountCreatedAt: formatDate(createdAt),
      },
      stats: {
        enrolledCount,
        completedCount,
        bestRank,
        certificatesCount,
      },
      events,
      announcements,
    });
  } catch (error) {
    console.error("Dashboard summary API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
