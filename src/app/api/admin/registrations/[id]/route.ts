import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function PUT(
  request: Request,
  { params }: { params: any }, // Type as 'any' to allow both Next.js 14 and Next.js 15/16 dynamic params
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

    // 2. Safely resolve params if it is an async Promise (Next.js 15/16 compatibility)
    const resolvedParams =
      params instanceof Promise ? await params : await Promise.resolve(params);
    const idString = resolvedParams?.id;

    // 3. Parse and validate the registration ID
    const registrationId = parseInt(idString, 10);
    if (isNaN(registrationId)) {
      return NextResponse.json(
        { message: "Invalid registration ID format." },
        { status: 400 },
      );
    }

    // 4. Parse and validate the status from the request body
    const body = await request.json();
    const { status, paymentStatus } = body;

    const allowedStatuses = ["pending", "approved", "rejected"];
    const allowedPaymentStatuses = ["unpaid", "paid"];

    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          message:
            "Invalid status value. Must be 'pending', 'approved', or 'rejected'.",
        },
        { status: 400 },
      );
    }

    if (paymentStatus && !allowedPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { message: "Invalid payment status. Must be 'unpaid' or 'paid'." },
        { status: 400 },
      );
    }

    // 5. Verify that the registration exists
    const existingRegistration = await prisma.registration.findUnique({
      where: { id: registrationId },
    });

    if (!existingRegistration) {
      return NextResponse.json(
        { message: "Registration record not found." },
        { status: 404 },
      );
    }

    // 6. Update the registration
    const updatedRegistration = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      },
    });

    return NextResponse.json({
      message: "Registration updated successfully.",
      registration: updatedRegistration,
    });
  } catch (error) {
    console.error("ADMIN_REGISTRATION_PUT_ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update registration status." },
      { status: 500 },
    );
  }
}
