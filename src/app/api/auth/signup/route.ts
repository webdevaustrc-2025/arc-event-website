import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate inputs using Zod
    const parsedBody = signupSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { message: parsedBody.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsedBody.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email is already registered" },
        { status: 400 }
      );
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user (role defaults to "user")
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: "user",
        avatarUrl:
          "https://res.cloudinary.com/dxyhzgrul/image/upload/v1780398181/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4215_bdeofc.jpg",
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
