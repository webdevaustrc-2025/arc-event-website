import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const pastEvents = await prisma.pastEvent.findMany({
            orderBy: { date: "desc" },
        });
        return NextResponse.json(pastEvents);
    } catch (error) {
        console.error("Failed to fetch public past events:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
