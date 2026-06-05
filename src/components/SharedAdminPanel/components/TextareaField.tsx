"use client";

import React, { TextareaHTMLAttributes } from "react";
import { useTheme } from "next-themes";

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      className = "",
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const isDark = theme === "dark" || !theme;

    return (
      <div className={fullWidth ? "w-full" : ""}>
        <label
          className={`block text-sm font-medium mb-2 ${
            isDark ? "text-[#F5F5F0]" : "text-[#1a1a14]"
          }`}
        >
          {label}
        </label>
        <textarea
          ref={ref}
          className={`w-full px-3 py-2 rounded-lg border transition-colors resize-vertical ${
            isDark
              ? "bg-[#0d0d12] border-white/[0.06] text-[#F5F5F0] placeholder-[#9A9A8E]"
              : "bg-white border-black/[0.06] text-[#1a1a14] placeholder-[#4a4a40]"
          } focus:outline-none focus:border-[#588157] ${
            error ? "border-red-600" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        {helperText && (
          <p className={`text-xs mt-1 ${isDark ? "text-[#9A9A8E]" : "text-[#4a4a40]"}`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextareaField.displayName = "TextareaField";
