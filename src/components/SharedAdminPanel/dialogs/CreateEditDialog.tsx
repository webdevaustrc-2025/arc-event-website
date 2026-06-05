"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CreateEditDialogProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  submitButtonText?: string;
  submitButtonVariant?: "default" | "destructive";
  children: React.ReactNode;
}

export function CreateEditDialog({
  isOpen,
  title,
  subtitle,
  isLoading = false,
  onClose,
  onSubmit,
  submitButtonText = "Save",
  submitButtonVariant = "default",
  children,
}: CreateEditDialogProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark" || !theme;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(e);
    } catch (error) {
      console.error("Dialog submit error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`${
          isDark
            ? "bg-[#0d0d12] border-white/[0.06]"
            : "bg-white border-black/[0.06]"
        }`}
      >
        <DialogHeader>
          <DialogTitle
            className={`text-xl font-semibold ${
              isDark ? "text-[#F5F5F0]" : "text-[#1a1a14]"
            }`}
          >
            {title}
          </DialogTitle>
          {subtitle && (
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-[#9A9A8E]" : "text-[#4a4a40]"
              }`}
            >
              {subtitle}
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="max-h-[400px] overflow-y-auto">{children}</div>

          <DialogFooter className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isDark
                  ? "bg-white/[0.08] text-[#F5F5F0] hover:bg-white/[0.12]"
                  : "bg-black/[0.08] text-[#1a1a14] hover:bg-black/[0.12]"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                submitButtonVariant === "destructive"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-[#588157] text-white hover:bg-[#3a5a40]"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitButtonText}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
