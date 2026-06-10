import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      teamName,
      institution,
      teamLeader,
      email,
      phone,
      members,
      segment,
      password,
    } = body;

    // 1. Validate all required registration fields
    if (
      !teamName ||
      !institution ||
      !teamLeader ||
      !email ||
      !phone ||
      !segment
    ) {
      return NextResponse.json(
        { message: "Missing required registration fields." },
        { status: 400 },
      );
    }

    // 2. Validate password (mandatory since we are creating/verifying accounts on the fly)
    if (!password) {
      return NextResponse.json(
        { message: "Password is required to secure your account." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long." },
        { status: 400 },
      );
    }

    // 3. Find or Create User Account securely using the provided email
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create a brand new account with a hashed password
      const hashedPassword = await bcrypt.hash(password, 12);
      user = await prisma.user.create({
        data: {
          email,
          name: teamLeader,
          role: "user",
          university: institution,
          phone: phone,
          passwordHash: hashedPassword,
          avatarUrl:
            "https://res.cloudinary.com/dxyhzgrul/image/upload/v1780398181/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4215_bdeofc.jpg",
        } as any,
      });
    } else {
      // User already exists. Verify their password to authenticate the registration.
      if (user.passwordHash) {
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
          return NextResponse.json(
            { message: "Invalid password for this existing user account." },
            { status: 400 },
          );
        }
      } else {
        // If an account existed from a different system but had no password, set it now.
        const hashedPassword = await bcrypt.hash(password, 12);
        await prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: hashedPassword },
        });
      }

      // Update user details if they were previously empty
      await prisma.user.update({
        where: { id: user.id },
        data: {
          phone: user.phone || phone,
          university: user.university || institution,
        } as any,
      });
    }

    const userId = user.id;

    // 4. Resolve the requested competition segment
    let dbSegment = await prisma.segment.findFirst({
      where: {
        name: {
          equals: segment,
          mode: "insensitive",
        },
      },
    });

    if (!dbSegment) {
      dbSegment = await prisma.segment.findFirst({
        where: {
          name: {
            contains: segment,
            mode: "insensitive",
          },
        },
      });
    }

    // Try finding by ID if the frontend passed ID
    if (!dbSegment && !isNaN(parseInt(segment))) {
      dbSegment = await prisma.segment.findUnique({
        where: {
          id: parseInt(segment),
        },
      });
    }

    // Fallback: If not found, check standard list or take first segment
    if (!dbSegment) {
      dbSegment = await prisma.segment.findFirst();
    }

    if (!dbSegment) {
      return NextResponse.json(
        { message: "No active competition segments found in the database." },
        { status: 400 },
      );
    }

    // 5. Prevent duplicate registration for the same segment
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        userId,
        segmentId: dbSegment.id,
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        {
          success: false,
          message: `This account is already registered for ${dbSegment.name} under Team: "${existingRegistration.teamName}".`,
        },
        { status: 400 },
      );
    }

    // 6. Generate a secure, unique QR Token (Page 17 requirements)
    const qrToken =
      "ARC-" + crypto.randomBytes(6).toString("hex").toUpperCase();

    // 7. Save the registration record to Neon
    const registration = await prisma.registration.create({
      data: {
        userId,
        segmentId: dbSegment.id,
        teamName,
        status: "pending",
        paymentStatus: "unpaid",
        qrToken,
      },
    });

    // 8. Log the activity to the database feed
    try {
      await (prisma as any).activity.create({
        data: {
          title: "New registration",
          desc: `Team "${teamName}" registered for ${dbSegment.name}.`,
          icon: "Users",
          color: "text-green-500",
        },
      });
    } catch (e) {
      console.warn("Activity logging skipped:", e);
    }

    return NextResponse.json(
      {
        success: true,
        data: registration,
        message:
          "Registration submitted successfully! Your account and team details are secured.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unified registration API error:", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again." },
      { status: 500 },
    );
  }
}
