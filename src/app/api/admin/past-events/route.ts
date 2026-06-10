import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { pastEventSchema } from "@/lib/validations/past-event";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const pastEvents = await prisma.pastEvent.findMany({
            orderBy: { date: "desc" },
        });

        return NextResponse.json(pastEvents);
    } catch (error) {
        console.error("Failed to fetch past events:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const result = pastEventSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Invalid input", errors: result.error.errors },
                { status: 400 }
            );
        }

        const pastEvent = await prisma.pastEvent.create({
            data: {
                ...result.data,
                date: new Date(result.data.date),
            },
        });

        return NextResponse.json(pastEvent, { status: 201 });
    } catch (error) {
        console.error("Failed to create past event:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
