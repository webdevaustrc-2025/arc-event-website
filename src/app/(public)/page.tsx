import Home from "@/components/pages/Home";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  let segments: any[] = [];
  let sponsors: any[] = [];
  let pastEvents: any[] = [];
  let faqs: any[] = [];
  let reviews: any[] = [];

  try {
    const [segmentsData, sponsorsData, pastEventsData, faqsData, reviewsData] =
      await Promise.all([
        prisma.segment.findMany({
          where: { status: "active" },
          orderBy: { id: "asc" },
        }),
        prisma.sponsor.findMany({
          orderBy: { displayOrder: "asc" },
        }),
        prisma.pastEvent.findMany({
          orderBy: { date: "desc" },
        }),
        prisma.fAQ.findMany({
          orderBy: { displayOrder: "asc" },
        }),
        prisma.review
          ? prisma.review.findMany({ orderBy: { displayOrder: "asc" } })
          : Promise.resolve([]),
      ]);

    segments = segmentsData;
    sponsors = sponsorsData;
    pastEvents = pastEventsData;
    faqs = faqsData;
    reviews = reviewsData;
  } catch (error) {
    console.error("Failed to fetch home page data from database, falling back to dummy data:", error);
  }

  const groupedSponsors = sponsors.length > 0 ? {
    gold: sponsors.filter((s) => s.tier === "gold"),
    silver: sponsors.filter((s) => s.tier === "silver"),
    bronze: sponsors.filter((s) => s.tier === "bronze"),
  } : undefined;

  const photos = pastEvents.length > 0
    ? (pastEvents.map((evt) => evt.imageUrl).filter(Boolean) as string[])
    : undefined;

  return (
    <Home
      dbSegments={segments}
      dbSponsors={groupedSponsors}
      dbPhotos={photos}
      dbFAQs={faqs}
      dbReviews={reviews}
    />
  );
}
