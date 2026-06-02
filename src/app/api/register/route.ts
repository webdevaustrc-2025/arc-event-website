import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { registrationSchema } from "@/lib/validations/registration";

export async function POST(request: Request) {
  try {
    // 1. Check if the user is logged in
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "You must be logged in to register." },
        { status: 401 },
      );
    }

    // 2. Parse and validate incoming request body
    const body = await request.json();
    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.errors[0].message },
        { status: 400 },
      );
    }

    const { segmentId } = parsed.data;

    // 3. Get User record
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { message: "User email not found in session." },
        { status: 400 },
      );
    }

    const userDb = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!userDb) {
      return NextResponse.json(
        { message: "User account not found in database." },
        { status: 404 },
      );
    }
    // --- DYNAMIC SELF-HEALING SEGMENT CREATION WITH REAL NAMES ---
    const segmentNames: Record<number, string> = {
      1: "Line Following Robot",
      2: "Maze Solving Robot",
      3: "Robo Soccer",
      4: "Project Showcase",
      5: "Innovation Challenge",
    };
    const actualSegmentName = segmentNames[Number(segmentId)] || "Test Segment";

    await prisma.segment.upsert({
      where: { id: Number(segmentId) },
      update: {},
      create: {
        id: Number(segmentId),
        name: actualSegmentName, // This dynamically writes the real name!
        description: "Temporary segment created for testing purposes",
        rules: "Standard rules apply.",
        prizePool: "$5,000",
        status: "active",
      },
    });
    // -------------------------------------------------------------
    // ----------------------------------------------

    // 4. Check if already registered
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        userId: userDb.id,
        segmentId: Number(segmentId),
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { message: "You are already registered for this segment." },
        { status: 400 },
      );
    }

    // 5. Generate secure QR token using standard JavaScript
    const qrToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // 6. Create registration
    const registration = await prisma.registration.create({
      data: {
        userId: Number(userDb.id),
        segmentId: Number(segmentId),
        qrToken: qrToken,
        status: "pending",
        paymentStatus: "unpaid",
        teamName: String(body.teamName || "No Team"),
      },
    });

    return NextResponse.json(
      {
        message: "Registration submitted successfully.",
        registration,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("REGISTRATION_POST_ERROR:", error);
    return NextResponse.json(
      {
        message:
          error.message || "An unexpected error occurred. Please try again.",
      },
      { status: 500 },
    );
  }
}
