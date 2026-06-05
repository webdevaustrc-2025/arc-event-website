"use client";

import { useTheme } from "next-themes";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark" || !theme;

  return (
    <div
      className={`w-full ${isDark ? "bg-[#0d0d12]" : "bg-white"} rounded-lg overflow-hidden`}
    >
      <div
        className={`grid gap-4 p-4 border-b ${
          isDark ? "border-white/[0.06]" : "border-black/[0.06]"
        }`}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className={`h-4 rounded ${
              isDark
                ? "bg-white/[0.08]"
                : "bg-black/[0.08]"
            }`}
          />
        ))}
      </div>

      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className={`grid gap-4 p-4 border-b ${
            isDark ? "border-white/[0.04]" : "border-black/[0.04]"
          }`}
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={colIdx}
              className={`h-4 rounded ${
                isDark
                  ? "bg-white/[0.05]"
                  : "bg-black/[0.05]"
              } animate-pulse`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
