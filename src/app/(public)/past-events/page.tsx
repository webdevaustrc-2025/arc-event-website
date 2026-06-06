import PastEventsPage from "@/components/pages/PastEventsPage";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  let pastEvents: any[] = [];
  try {
    pastEvents = await prisma.pastEvent.findMany({
      orderBy: { date: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch past events from database, falling back to dummy data:", error);
  }

  return <PastEventsPage dbPastEvents={pastEvents} />;
}
