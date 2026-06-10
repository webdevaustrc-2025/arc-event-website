import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function PUT(request: Request, { params }: { params: any }) {
  // 1. Check admin session
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  try {
    // 2. Safe resolution of route parameters (handles both async & sync parameters)
    const resolvedParams = await params;
    const registrationId = parseInt(resolvedParams.id);

    if (isNaN(registrationId)) {
      return NextResponse.json(
        { message: "Invalid registration ID" },
        { status: 400 },
      );
    }

    // 3. Get status from request body
    const body = await request.json();
    const { status, paymentStatus } = body;

    if (!status && !paymentStatus) {
      return NextResponse.json(
        { message: "No update values provided" },
        { status: 400 },
      );
    }

    // 4. Update the registration in the database
    const updatedRegistration = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      },
      include: {
        user: true,
        segment: true,
      },
    });

    // 5. Log activity
    if (status === "approved" || status === "rejected") {
      try {
        await (prisma as any).activity.create({
          data: {
            title: `Registration ${status}`,
            desc: `Team "${updatedRegistration.teamName || updatedRegistration.user?.name || "Participant"}" is now ${status} for ${updatedRegistration.segment?.name || "Segment"}.`,
            icon: status === "approved" ? "CheckCircle" : "XCircle",
            color: status === "approved" ? "text-green-500" : "text-red-500",
          },
        });
      } catch (e) {
        console.warn("Activity logging skipped:", e);
      }
    }

    return NextResponse.json(updatedRegistration);
  } catch (error) {
    console.error("Admin PUT registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
