import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all announcements
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const announcements = await prisma.announcement.findMany({
            orderBy: [{ createdAt: "desc" }],
        });

        return NextResponse.json(announcements);
    } catch (error) {
        console.error("Failed to fetch announcements:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST create announcement
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, message, icon, color, isNew } = body;

        if (!title || !message) {
            return NextResponse.json(
                { message: "Title and message are required" },
                { status: 400 }
            );
        }

        const announcement = await prisma.announcement.create({
            data: {
                title: String(title).trim(),
                message: String(message).trim(),
                icon: icon ? String(icon).trim() : "Bell",
                color: color ? String(color) : "#588157",
                isNew: isNew !== undefined ? Boolean(isNew) : true,
            },
        });

        return NextResponse.json(announcement, { status: 201 });
    } catch (error) {
        console.error("Failed to create announcement:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
