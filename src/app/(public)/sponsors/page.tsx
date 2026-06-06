import SponsorsPage from "@/components/pages/SponsorsPage";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  let sponsors: any[] = [];
  try {
    sponsors = await prisma.sponsor.findMany({
      orderBy: { displayOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch sponsors from database, falling back to dummy data:", error);
  }

  const groupedSponsors = sponsors.length > 0 ? {
    gold: sponsors.filter((s) => s.tier === "gold"),
    silver: sponsors.filter((s) => s.tier === "silver"),
    bronze: sponsors.filter((s) => s.tier === "bronze"),
  } : undefined;

  return <SponsorsPage dbSponsors={groupedSponsors} />;
}
