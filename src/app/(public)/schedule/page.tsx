export const dynamic = "force-dynamic";
import SchedulePage from "@/components/pages/SchedulePage";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const schedule = await prisma.schedule.findMany({
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

  return <SchedulePage dbSchedule={schedule} />;
}
