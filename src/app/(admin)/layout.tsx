"use client";

import { AdminLayout } from "@/components/layouts/AdminLayout";
import { OutletProvider } from "@/lib/router-compat";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <OutletProvider content={children}>
      <AdminLayout />
    </OutletProvider>
  );
}
