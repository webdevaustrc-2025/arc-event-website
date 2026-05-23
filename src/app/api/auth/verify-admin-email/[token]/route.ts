import { verifyAdminEmailToken } from "@/lib/admin-verification";
import { redirect } from "next/navigation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const verified = await verifyAdminEmailToken(token);

  redirect(verified ? "/login?adminVerified=1" : "/login?adminVerified=0");
}
