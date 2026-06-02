"use client";

import React from "react";
import { useTheme } from "next-themes";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  isLoading?: boolean;
  isDestructive?: boolean;
  actionText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  isLoading = false,
  isDestructive = false,
  actionText = "Continue",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark" || !theme;

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error("Confirm dialog error:", error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent
        className={`${
          isDark
            ? "bg-[#0d0d12] border-white/[0.06]"
            : "bg-white border-black/[0.06]"
        }`}
      >
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            {isDestructive && (
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <AlertDialogTitle
                className={`text-lg font-semibold ${
                  isDark ? "text-[#F5F5F0]" : "text-[#1a1a14]"
                }`}
              >
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription
                className={`mt-2 ${
                  isDark ? "text-[#9A9A8E]" : "text-[#4a4a40]"
                }`}
              >
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex gap-2">
          <AlertDialogCancel
            disabled={isLoading}
            className={`${
              isDark
                ? "bg-white/[0.08] text-[#F5F5F0] hover:bg-white/[0.12]"
                : "bg-black/[0.08] text-[#1a1a14] hover:bg-black/[0.12]"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex items-center gap-2 ${
              isDestructive
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-[#588157] text-white hover:bg-[#3a5a40]"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
