import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { heading, description, imageUrl } = body;

    if (!heading || !description) {
      return NextResponse.json({ message: "Heading and Description are required" }, { status: 400 });
    }

    const hero = await prisma.aboutHero.findFirst();
    let updated;
    if (hero) {
      updated = await prisma.aboutHero.update({
        where: { id: hero.id },
        data: { heading, description, imageUrl },
      });
    } else {
      updated = await prisma.aboutHero.create({
        data: { heading, description, imageUrl },
      });
    }

    // Log activity
    await prisma.activity.create({
      data: {
        title: "About Us Hero Updated",
        desc: `Admin updated About Us hero section heading to: "${heading.substring(0, 30)}..."`,
        icon: "Info",
        color: "text-green-500",
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Failed to update About Us hero:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
