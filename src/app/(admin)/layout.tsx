import { AdminLayout } from "@/components/layouts/AdminLayout";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isAdminEmail } from "@/lib/admin-verification";
import { OutletProvider } from "@/lib/router-compat";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "admin" || !session.user.email || !isAdminEmail(session.user.email)) {
    redirect("/login");
  }

  return (
    <OutletProvider content={children}>
      <AdminLayout />
    </OutletProvider>
  );
}
