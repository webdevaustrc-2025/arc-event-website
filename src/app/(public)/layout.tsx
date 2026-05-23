"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassOverlay } from "@/components/GlassOverlay";
import { useTheme } from "next-themes";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen overflow-x-hidden antialiased relative transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-[#0A0A0F] text-[#F5F5F0] selection:bg-[#588157] selection:text-[#F5F5F0]'
          : 'bg-[#dad7cd] text-[#1a1a14] selection:bg-[#3a5a40] selection:text-white'
      }`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <GlassOverlay />
      <Navbar />
      <main className="relative z-10">
        {children}
        <Footer />
      </main>
    </div>
  );
}
