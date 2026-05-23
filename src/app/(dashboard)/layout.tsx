"use client";

import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { OutletProvider } from "@/lib/router-compat";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <OutletProvider content={children}>
      <DashboardLayout />
    </OutletProvider>
  );
}
