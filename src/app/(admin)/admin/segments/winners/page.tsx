"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  Trophy,
  Image as ImageIcon,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { adminFetch } from "@/lib/admin-api";
import { ImageUploadField } from "@/components/SharedAdminPanel/components/ImageUploadField";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Winner {
  id: number;
  name: string;
  imageUrl: string;
  position: string;
  segmentName: string;
}

interface WinnerForm {
  name: string;
  imageUrl: string;
  position: string;
  segmentName: string;
}

// ─── Empty forms ─────────────────────────────────────────────────────────────

const EMPTY_WINNER: WinnerForm = {
  name: "",
  imageUrl: "",
  position: "",
  segmentName: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminSegmentWinnersPage() {
  const { theme } = useTheme();

  // ── Fix hydration: don't render theme-dependent classes until mounted ────
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? theme === "dark" : false;

  const cardBg = isDark ? "bg-[#111116] border-white/[0.07]" : "bg-white border-black/[0.08]";
  const itemBg = isDark ? "bg-[#18181f] border-white/[0.07]" : "bg-[#F0EDE6] border-black/[0.06]";
  const textColor = isDark ? "text-[#F5F5F0]" : "text-[#1a1a14]";
  const mutedText = isDark ? "text-[#9A9A8E]" : "text-[#4a4a40]";
  const inputClass = isDark
    ? "bg-[#18181f] border-white/10 text-white placeholder-white/30 focus:border-white/30"
    : "bg-white border-black/10 text-gray-900 placeholder-gray-400 focus:border-black/30";

  // ── State ─────────────────────────────────────────────────────────────────

  const [winners, setWinners] = useState<Winner[]>([]);
  const [winnersLoading, setWinnersLoading] = useState(false);
  const [segments, setSegments] = useState<{name: string}[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Winner | null>(null);
  const [winnerForm, setWinnerForm] = useState<WinnerForm>(EMPTY_WINNER);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Winner | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch data ───────────────────────────────────────────────────────────

  const fetchWinners = useCallback(async () => {
    setWinnersLoading(true);
    try {
      // Get all segments first
      const segmentsData = await adminFetch("/api/admin/segments");
      setSegments(segmentsData.items.map((s: any) => ({ name: s.name })));

      // Get winners for the first segment by default
      if (segmentsData.items.length > 0) {
        const segmentName = segmentsData.items[0].name;
        const data: Winner[] = await adminFetch(`/api/admin/segments/winners?segmentName=${encodeURIComponent(segmentName)}`);
        setWinners(data);
      }
    } catch {
      toast.error("Failed to fetch winners.");
    } finally {
      setWinnersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWinners();
  }, [fetchWinners]);

  // ── Dialog handlers ─────────────────────────────────────────────────────

  function openCreate() {
    setEditTarget(null);
    setWinnerForm(EMPTY_WINNER);
    setDialogOpen(true);
  }

  function openEdit(winner: Winner) {
    setEditTarget(winner);
    setWinnerForm({
      name: winner.name,
      imageUrl: winner.imageUrl,
      position: winner.position,
      segmentName: winner.segmentName,
    });
    setDialogOpen(true);
  }

  // ── Winner handlers ─────────────────────────────────────────────────────

  function updateWinner(field: keyof WinnerForm, value: string) {
    setWinnerForm(prev => ({
      ...prev,
      [field]: value,
    }));
  }

  // ── Submit ──────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!winnerForm.name.trim() || !winnerForm.position || !winnerForm.segmentName) {
      toast.error("Name, position, and segment name are required.");
      return;
    }

    setSubmitting(true);
    try {
      if (editTarget) {
        await adminFetch(`/api/admin/segments/winners/${editTarget.id}`, {
          method: "PUT",
          body: JSON.stringify(winnerForm),
        });
        toast.success("Winner updated successfully.");
      } else {
        await adminFetch("/api/admin/segments/winners", {
          method: "POST",
          body: JSON.stringify(winnerForm),
        });
        toast.success("Winner created successfully.");
      }

      setDialogOpen(false);
      fetchWinners();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Delete ──────────────────────────────────────────────────────────────

  function confirmDelete(winner: Winner) {
    setDeleteTarget(winner);
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminFetch(`/api/admin/segments/winners/${deleteTarget.id}`, {
        method: "DELETE",
      });
      toast.success("Winner deleted.");
      setDeleteOpen(false);
      fetchWinners();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete winner."
      );
    } finally {
      setDeleting(false);
    }
  }

  // ── Prevent render until mounted (fixes hydration) ──────────────────────

  if (!mounted) return null;

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/segments"
            className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-gray-200"}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1
              className={`text-3xl font-bold ${textColor} mb-2`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Segment Winners Management
            </h1>
            <p className={`${mutedText} text-lg`}>
              Manage winners for different segments.
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex items-center gap-2 bg-[#3a5a40] text-white hover:bg-[#344e41]"
        >
          <Plus className="w-4 h-4" />
          Add Winner
        </button>
      </div>

      {/* Winners list */}
      {winnersLoading ? (
        <div className={`p-8 rounded-2xl border ${cardBg} flex items-center justify-center`}>
          <Loader2 className="w-8 h-8 animate-spin text-[#588157]" />
        </div>
      ) : (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h2 className={`text-xl font-bold mb-6 ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Segment Winners ({winners.length})
          </h2>

          {winners.length === 0 ? (
            <div
              className={`p-8 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center ${itemBg}`}
            >
              <Trophy
                className={`w-12 h-12 mb-4 ${mutedText} opacity-50`}
              />
              <h3 className={`font-semibold text-lg ${textColor} mb-2`}>
                No Winners Found
              </h3>
              <p className={`${mutedText} text-sm max-w-md mb-6`}>
                Add winners for this segment to showcase the competition results.
              </p>
              <button
                onClick={openCreate}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isDark
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                }`}
              >
                Add Winner
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {winners.map((winner) => (
                <div
                  key={winner.id}
                  className={`p-6 rounded-xl border transition-all hover:border-gray-400 ${itemBg}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`font-bold text-lg ${textColor} mb-1`}>
                        {winner.name}
                      </h3>
                      <p className={`${mutedText} text-sm`}>
                        {winner.position} Place
                      </p>
                      <p className={`${mutedText} text-sm`}>
                        {winner.segmentName}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(winner)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? "hover:bg-white/10 text-gray-300"
                            : "hover:bg-gray-200 text-gray-600"
                        }`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(winner)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? "bg-red-500/10 hover:bg-red-500/20 text-red-400"
                            : "bg-red-50 hover:bg-red-100 text-red-600"
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className={`w-full h-48 rounded-lg overflow-hidden ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                    {winner.imageUrl ? (
                      <img
                        src={winner.imageUrl}
                        alt={winner.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className={`sm:max-w-2xl max-h-[90vh] overflow-y-auto ${
            isDark
              ? "bg-[#111116] border-white/10 text-white"
              : "bg-white text-gray-900"
          }`}
        >
          <DialogHeader>
            <DialogTitle className={textColor}>
              {editTarget ? "Edit Winner" : "Add New Winner"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* Winner details */}
            <div className="space-y-4 p-4 rounded-lg border border-dashed">
              <h3 className={`font-medium ${textColor}`}>Winner Details</h3>

              <div className="space-y-1">
                <label className={`text-sm font-medium ${mutedText}`}>
                  Name *
                </label>
                <input
                  value={winnerForm.name}
                  onChange={(e) => updateWinner("name", e.target.value)}
                  placeholder="Winner name"
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-sm font-medium ${mutedText}`}>
                  Position *
                </label>
                <input
                  value={winnerForm.position}
                  onChange={(e) => updateWinner("position", e.target.value)}
                  placeholder="e.g. 1st Place"
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-sm font-medium ${mutedText}`}>
                  Segment Name *
                </label>
                <select
                  value={winnerForm.segmentName}
                  onChange={(e) => updateWinner("segmentName", e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                >
                  {segments.map((segment, index) => (
                    <option key={index} value={segment.name}>
                      {segment.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <ImageUploadField
                  label="Winner Image"
                  value={winnerForm.imageUrl}
                  onChange={(url) => updateWinner("imageUrl", url)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <button
              onClick={() => setDialogOpen(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDark
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#3a5a40] hover:bg-[#344e41] text-white transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-3 h-3 animate-spin" />}
              {submitting
                ? editTarget
                  ? "Saving..."
                  : "Creating..."
                : editTarget
                ? "Save Changes"
                : "Create Winner"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation ── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent
          className={
            isDark
              ? "bg-[#111116] border-white/10 text-white"
              : "bg-white text-gray-900"
          }
        >
          <AlertDialogHeader>
            <AlertDialogTitle className={textColor}>
              Delete Winner
            </AlertDialogTitle>
            <AlertDialogDescription className={mutedText}>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteTarget?.name}</span>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className={
                isDark
                  ? "bg-white/10 hover:bg-white/20 text-white border-white/10"
                  : ""
              }
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 flex items-center gap-2"
            >
              {deleting && <Loader2 className="w-3 h-3 animate-spin" />}
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
