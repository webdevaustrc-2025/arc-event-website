import EventDetailsPage from "@/components/pages/EventDetailsPage";
import { prisma } from "@/lib/prisma";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    return <EventDetailsPage />;
  }

  let segment = null;
  try {
    segment = await prisma.segment.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error(`Failed to fetch segment ${id} from database, falling back to dummy data:`, error);
  }

  return <EventDetailsPage dbSegment={segment || undefined} />;
}
