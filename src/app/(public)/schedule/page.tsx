import SchedulePage from "@/components/pages/SchedulePage";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  let schedule: any[] = [];
  try {
    schedule = await prisma.schedule.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        segment: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch schedule from database, falling back to dummy data:", error);
  }

  return <SchedulePage dbSchedule={schedule} />;
}
