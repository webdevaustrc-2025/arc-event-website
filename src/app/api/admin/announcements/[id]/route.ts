import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// PUT update announcement
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const announcementId = parseInt(id, 10);
        if (isNaN(announcementId)) {
            return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
        }

        const existing = await prisma.announcement.findUnique({
            where: { id: announcementId },
        });
        if (!existing) {
            return NextResponse.json(
                { message: "Announcement not found" },
                { status: 404 }
            );
        }

        const body = await request.json();

        const updated = await prisma.announcement.update({
            where: { id: announcementId },
            data: {
                title: body.title !== undefined ? String(body.title).trim() : existing.title,
                message: body.message !== undefined ? String(body.message).trim() : existing.message,
                icon: body.icon !== undefined ? String(body.icon).trim() : existing.icon,
                color: body.color !== undefined ? String(body.color) : existing.color,
                isNew: body.isNew !== undefined ? Boolean(body.isNew) : existing.isNew,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Failed to update announcement:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE announcement
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const announcementId = parseInt(id, 10);
        if (isNaN(announcementId)) {
            return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
        }

        const existing = await prisma.announcement.findUnique({
            where: { id: announcementId },
        });
        if (!existing) {
            return NextResponse.json(
                { message: "Announcement not found" },
                { status: 404 }
            );
        }

        await prisma.announcement.delete({ where: { id: announcementId } });

        return NextResponse.json({ message: "Announcement deleted successfully" });
    } catch (error) {
        console.error("Failed to delete announcement:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
