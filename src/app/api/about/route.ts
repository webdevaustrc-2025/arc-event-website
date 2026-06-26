import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ১. এটি খুবই জরুরি! এটি অ্যাডমিন প্যানেলে ডাটা সাথে সাথে আপডেট করবে (Cache বন্ধ করবে)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Hero section
    let hero = await prisma.aboutHero.findFirst();
    if (!hero) {
      hero = await prisma.aboutHero.create({
        data: {
          heading: "Born from Curiosity.\nBuilt for Competition.",
          description: "The premier robotics festival...",
          imageUrl: "https://images.unsplash.com/photo-1712971724897-a9ae95e0ec44",
        },
      });
    }

    // 2. About ARC section
    let austrc = await prisma.aboutAustrc.findFirst();
    if (!austrc) {
      austrc = await prisma.aboutAustrc.create({
        data: {
          title: "Where Bangladesh's Best Engineers Compete.",
          content: "ARC 3.0 2025 isn't just an event...",
          imageUrl: "https://images.unsplash.com/photo-1712971724897-a9ae95e0ec44",
        },
      });
    }

    // 3. Mission & Vision
    let missionVision = await prisma.aboutMissionVision.findFirst();
    if (!missionVision) {
      missionVision = await prisma.aboutMissionVision.create({
        data: {
          missionTitle: "Our Mission",
          missionDescription: "To advance robotics...",
          visionTitle: "Our Vision",
          visionDescription: "To build strong collaborations...",
        },
      });
    }

    // 4. Gallery items (অ্যাডমিন প্যানেলের জন্য সবচাইতে গুরুত্বপূর্ণ অংশ)
    let gallery = await prisma.aboutGallery.findMany({
      orderBy: { displayOrder: "asc" },
    });

    if (gallery.length === 0) {
      const defaultGallery = [
        {
          title: "Robomania 2.0",
          description: "Celebrating innovation...",
          imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
          displayOrder: 0,
        },
      ];
      // ডিফল্ট ডাটা তৈরি
      await prisma.aboutGallery.createMany({ data: defaultGallery });
      // আবার ফ্রেশ ডাটা আনা
      gallery = await prisma.aboutGallery.findMany({ orderBy: { displayOrder: "asc" } });
    }

    // ৫. What We Do এবং Events ডাটা আনা
    const whatWeDoItems = await prisma.aboutWhatWeDo.findMany({ orderBy: { displayOrder: "asc" } });
    const events = await prisma.aboutEvent.findMany({ orderBy: { displayOrder: "asc" } });

    // ফাইনাল রেসপন্স (নিশ্চিত করছি যেন ডাটা নাল না থাকে)
    return NextResponse.json({
      about_hero: hero,
      about_austrc: austrc,
      about_mission_vision: {
        mission_title: missionVision?.missionTitle || "",
        mission_description: missionVision?.missionDescription || "",
        vision_title: missionVision?.visionTitle || "",
        vision_description: missionVision?.visionDescription || "",
      },
      about_what_we_do: {
        title: "What We Do",
        description: "Focus areas guiding our work",
        items: whatWeDoItems || [],
      },
      about_event_competition: {
        title: "Events & Competitions",
        description: "Current and past highlights",
        items: events || [],
      },
      about_gallery: gallery || [], // এই কি (key) টাই অ্যাডমিন প্যানেলে ডাটা দেখাবে
    });

  } catch (error) {
    console.error("Failed to load about content:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}