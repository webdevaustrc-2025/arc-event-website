import { prisma } from "@/lib/prisma";
import PastEventsPage from "@/components/pages/PastEventsPage";


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
