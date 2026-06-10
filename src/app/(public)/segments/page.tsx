export const dynamic = 'force-dynamic';
import SegmentsPage from "@/components/pages/SegmentsPage";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const segments = await prisma.segment.findMany({
    where: { status: "active" },
    orderBy: { id: "asc" },
  });

  return <SegmentsPage dbSegments={segments} />;
}
