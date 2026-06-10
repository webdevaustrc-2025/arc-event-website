export const dynamic = "force-dynamic";
import SegmentsPage from "@/components/pages/SegmentsPage";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  let segments: any[] = [];
  try {
    segments = await prisma.segment.findMany({
      where: { status: "active" },
      orderBy: { id: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch segments from database, falling back to dummy data:", error);
  }

  return <SegmentsPage dbSegments={segments} />;
}
