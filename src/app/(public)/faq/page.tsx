import FAQPage from "@/components/pages/FAQPage";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  let faqs: any[] = [];
  try {
    faqs = await prisma.fAQ.findMany({
      orderBy: { displayOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch FAQs from database, falling back to dummy data:", error);
  }

  return <FAQPage dbFAQs={faqs} />;
}
