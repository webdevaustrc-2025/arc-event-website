import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin-verification";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return null;
  }

  if (session.user.role !== "admin" || !isAdminEmail(session.user.email)) {
    return null;
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { emailVerified: true, role: true },
  });

  if (!adminUser || adminUser.role !== "admin" || !adminUser.emailVerified) {
    return null;
  }

  return session;
}
