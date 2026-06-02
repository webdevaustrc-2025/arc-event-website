import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // 1. Enforce admin session validation
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { message: "Not authorized. Admin access required." },
        { status: 401 },
      );
    }

    const userId = params.id;
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 },
      );
    }

    // 2. Parse and validate the update options from request body
    const body = await request.json();
    const { role, status } = body;

    const allowedRoles = ["user", "admin"];

    if (role && !allowedRoles.includes(role)) {
      return NextResponse.json(
        { message: "Invalid role. Role must be 'user' or 'admin'." },
        { status: 400 },
      );
    }

    // 3. Verify that the user exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User account not found." },
        { status: 404 },
      );
    }

    // 4. Update the user account
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(role && { role }),
        ...(status && { status }), // Option in case the schema includes a status string
      },
    });

    return NextResponse.json({
      message: "User updated successfully.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("ADMIN_USER_PUT_ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update user account details." },
      { status: 500 },
    );
  }
}
