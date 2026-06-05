import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { message: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // If the user has an existing password, verify current password
    if (user.passwordHash) {
      if (!currentPassword) {
        return NextResponse.json(
          { message: "Current password is required" },
          { status: 400 }
        );
      }
      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
