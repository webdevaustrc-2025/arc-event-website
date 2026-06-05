import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, phone, university, department, studentId } = body;

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    const updatedUser = (await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone: phone || null,
        university: university || null,
        department: department || null,
        studentId: studentId || null,
      } as any,
    })) as any;

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        university: updatedUser.university,
        department: updatedUser.department,
        studentId: updatedUser.studentId,
        avatarUrl: updatedUser.avatarUrl,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Dashboard profile update API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
