"use client";

import React from "react";
import { useTheme } from "next-themes";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  onClick,
}: StatCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark" || !theme;

  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-lg border transition-all ${
        isDark
          ? "bg-[#0d0d12] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]"
          : "bg-white border-black/[0.06] hover:border-black/[0.12] hover:bg-black/[0.02]"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className={`text-sm font-medium ${isDark ? "text-[#9A9A8E]" : "text-[#4a4a40]"}`}>
            {title}
          </p>
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-[#588157]/10">
            <Icon className="w-5 h-5 text-[#588157]" />
          </div>
        )}
      </div>

      <div className="mb-2">
        <p
          className={`text-3xl font-bold ${isDark ? "text-[#F5F5F0]" : "text-[#1a1a14]"}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {value}
        </p>
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center justify-between">
          {subtitle && (
            <p className={`text-xs ${isDark ? "text-[#9A9A8E]" : "text-[#4a4a40]"}`}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div
              className={`text-xs font-medium ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {trend.value}%
            </div>
          )}
        </div>
      )}
    </div>
  );
}
