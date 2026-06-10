import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { pastEventSchema } from "@/lib/validations/past-event";

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
        const eventId = parseInt(id, 10);
        if (isNaN(eventId)) {
            return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
        }

        const existing = await prisma.pastEvent.findUnique({
            where: { id: eventId },
        });

        if (!existing) {
            return NextResponse.json(
                { message: "Past event not found" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const result = pastEventSchema.partial().safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Invalid input", errors: result.error.errors },
                { status: 400 }
            );
        }

        const updateData = { ...result.data };
        if (updateData.date) {
            updateData.date = new Date(updateData.date) as any;
        }

        const pastEvent = await prisma.pastEvent.update({
            where: { id: eventId },
            data: updateData,
        });

        return NextResponse.json(pastEvent);
    } catch (error) {
        console.error("Failed to update past event:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const eventId = parseInt(id, 10);
        if (isNaN(eventId)) {
            return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
        }

        const existing = await prisma.pastEvent.findUnique({
            where: { id: eventId },
        });

        if (!existing) {
            return NextResponse.json(
                { message: "Past event not found" },
                { status: 404 }
            );
        }

        await prisma.pastEvent.delete({
            where: { id: eventId },
        });

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("Failed to delete past event:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
