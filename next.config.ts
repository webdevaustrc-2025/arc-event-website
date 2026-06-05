import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Turbopack-কে সঠিক রুট ডিরেক্টরি দেখানোর জন্য
    root: path.join(process.cwd()),
  },
  /* আপনার অন্যান্য কনফিগারেশন এখানে যোগ করবেন (যদি থাকে) */
};

export default nextConfig;