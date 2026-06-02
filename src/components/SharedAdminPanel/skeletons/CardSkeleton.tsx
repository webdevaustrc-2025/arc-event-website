"use client";

import { useTheme } from "next-themes";

interface CardSkeletonProps {
  count?: number;
  columns?: number;
}

export function CardSkeleton({ count = 3, columns = 3 }: CardSkeletonProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark" || !theme;

  return (
    <div
      className={`grid gap-4`}
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(250px, 1fr))` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`p-4 rounded-lg border ${
            isDark
              ? "bg-[#0d0d12] border-white/[0.06]"
              : "bg-white border-black/[0.06]"
          }`}
        >
          <div
            className={`h-6 rounded mb-4 ${
              isDark ? "bg-white/[0.08]" : "bg-black/[0.08]"
            } animate-pulse`}
          />

          {Array.from({ length: 3 }).map((_, j) => (
            <div
              key={j}
              className={`h-3 rounded mb-3 ${
                isDark ? "bg-white/[0.05]" : "bg-black/[0.05]"
              } animate-pulse`}
            />
          ))}

          <div
            className={`h-9 rounded mt-4 ${
              isDark ? "bg-white/[0.08]" : "bg-black/[0.08]"
            } animate-pulse`}
          />
        </div>
      ))}
    </div>
  );
}
