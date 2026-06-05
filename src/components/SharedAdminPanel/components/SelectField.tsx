"use client";

import React, { SelectHTMLAttributes } from "react";
import { useTheme } from "next-themes";

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  placeholder?: string;
  fullWidth?: boolean;
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      placeholder,
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
        <select
          ref={ref}
          className={`w-full px-3 py-2 rounded-lg border transition-colors ${
            isDark
              ? "bg-[#0d0d12] border-white/[0.06] text-[#F5F5F0]"
              : "bg-white border-black/[0.06] text-[#1a1a14]"
          } focus:outline-none focus:border-[#588157] ${
            error ? "border-red-600" : ""
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

SelectField.displayName = "SelectField";
