"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Plus, Search } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export function PageHeader({
  title,
  subtitle,
  showSearch = false,
  searchPlaceholder = "Search...",
  onSearch,
  actionButton,
}: PageHeaderProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark" || !theme;

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h1
          className={`text-3xl font-bold mb-2 ${
            isDark ? "text-[#F5F5F0]" : "text-[#1a1a14]"
          }`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className={`text-sm ${isDark ? "text-[#9A9A8E]" : "text-[#4a4a40]"}`}>
            {subtitle}
          </p>
        )}
      </div>

      {(showSearch || actionButton) && (
        <div className="flex items-center gap-3 flex-wrap">
          {showSearch && (
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#588157]" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch?.(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                  isDark
                    ? "bg-[#0d0d12] border-white/[0.06] text-[#F5F5F0] placeholder-[#9A9A8E]"
                    : "bg-white border-black/[0.06] text-[#1a1a14] placeholder-[#4a4a40]"
                } focus:outline-none focus:border-[#588157]`}
              />
            </div>
          )}

          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-[#588157] text-white hover:bg-[#3a5a40] transition-colors"
            >
              <Plus className="w-4 h-4" />
              {actionButton.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
