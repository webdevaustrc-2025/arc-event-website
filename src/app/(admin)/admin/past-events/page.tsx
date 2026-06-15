"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Image as ImageIcon,
  Loader2,
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

interface Judge {
  id: number;
  name: string;
  title: string;
  imageUrl: string;
}

interface Winner {
  id: number;
  name: string;
  imageUrl: string;
  position: string;
  segmentName: string;
}

interface PastEvent {
  id: number;
  name: string;
  date: string;
  description: string;
  imageUrl: string;
  judges: Judge[];
  winners: Winner[];
}

interface JudgeForm {
  name: string;
  title: string;
  imageUrl: string;
}

interface WinnerForm {
  name: string;
  imageUrl: string;
  position: string;
  segmentName: string;
}

interface EventForm {
  name: string;
  date: string;
  description: string;
  imageUrl: string;
  judges: JudgeForm[];
  winners: WinnerForm[];
}

// ─── Empty forms ─────────────────────────────────────────────────────────────

const EMPTY_JUDGE: JudgeForm = {
  name: "",
  title: "",
  imageUrl: "",
};

const EMPTY_WINNER: WinnerForm = {
  name: "",
  imageUrl: "",
  position: "",
  segmentName: "",
};

const EMPTY_EVENT: EventForm = {
  name: "",
  date: "",
  description: "",
  imageUrl: "",
  judges: [EMPTY_JUDGE],
  winners: [EMPTY_WINNER],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminPastEventsPage() {
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

  const [events, setEvents] = useState<PastEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PastEvent | null>(null);
  const [eventForm, setEventForm] = useState<EventForm>(EMPTY_EVENT);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<PastEvent | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch events ─────────────────────────────────────────────────────────

  const fetchEvents = useCallback(async () => {
    setEventsLoading(true);
    try {
      const data: PastEvent[] = await adminFetch("/api/admin/past-events");
      setEvents(data);
    } catch {
      toast.error("Failed to fetch past events.");
    } finally {
      setEventsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // ── Dialog handlers ─────────────────────────────────────────────────────

  function openCreate() {
    setEditTarget(null);
    setEventForm(EMPTY_EVENT);
    setDialogOpen(true);
  }

  function openEdit(event: PastEvent) {
    setEditTarget(event);
    setEventForm({
      name: event.name,
      date: new Date(event.date).toISOString().split("T")[0],
      description: event.description,
      imageUrl: event.imageUrl,
      judges: event.judges.map(judge => ({
        name: judge.name,
        title: judge.title,
        imageUrl: judge.imageUrl,
      })),
      winners: event.winners.map(winner => ({
        name: winner.name,
        imageUrl: winner.imageUrl,
        position: winner.position,
        segmentName: winner.segmentName,
      })),
    });
    setDialogOpen(true);
  }

  // ── Judge handlers ───────────────────────────────────────────────────────

  function addJudge() {
    setEventForm(prev => ({
      ...prev,
      judges: [...prev.judges, EMPTY_JUDGE],
    }));
  }

  function updateJudge(index: number, field: keyof JudgeForm, value: string) {
    setEventForm(prev => ({
      ...prev,
      judges: prev.judges.map((judge, i) =>
        i === index ? { ...judge, [field]: value } : judge
      ),
    }));
  }

  function removeJudge(index: number) {
    setEventForm(prev => ({
      ...prev,
      judges: prev.judges.filter((_, i) => i !== index),
    }));
  }

  // ── Winner handlers ─────────────────────────────────────────────────────

  function addWinner() {
    setEventForm(prev => ({
      ...prev,
      winners: [...prev.winners, EMPTY_WINNER],
    }));
  }

  function updateWinner(index: number, field: keyof WinnerForm, value: string) {
    setEventForm(prev => ({
      ...prev,
      winners: prev.winners.map((winner, i) =>
        i === index ? { ...winner, [field]: value } : winner
      ),
    }));
  }

  function removeWinner(index: number) {
    setEventForm(prev => ({
      ...prev,
      winners: prev.winners.filter((_, i) => i !== index),
    }));
  }

  // ── Submit ──────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!eventForm.name.trim() || !eventForm.date || !eventForm.description.trim()) {
      toast.error("Name, date, and description are required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...eventForm,
        date: new Date(eventForm.date).toISOString(),
      };

      if (editTarget) {
        await adminFetch(`/api/admin/past-events/${editTarget.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Event updated successfully.");
      } else {
        await adminFetch("/api/admin/past-events", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Event created successfully.");
      }

      setDialogOpen(false);
      fetchEvents();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Delete ──────────────────────────────────────────────────────────────

  function confirmDelete(event: PastEvent) {
    setDeleteTarget(event);
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminFetch(`/api/admin/past-events/${deleteTarget.id}`, {
        method: "DELETE",
      });
      toast.success("Event deleted.");
      setDeleteOpen(false);
      fetchEvents();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete event."
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
        <div>
          <h1
            className={`text-3xl font-bold ${textColor} mb-2`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Past Events Management
          </h1>
          <p className={`${mutedText} text-lg`}>
            Create, edit, and manage past events with judges and winners.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex items-center gap-2 bg-[#3a5a40] text-white hover:bg-[#344e41]"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {/* Events list */}
      {eventsLoading ? (
        <div className={`p-8 rounded-2xl border ${cardBg} flex items-center justify-center`}>
          <Loader2 className="w-8 h-8 animate-spin text-[#588157]" />
        </div>
      ) : (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h2 className={`text-xl font-bold mb-6 ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Past Events ({events.length})
          </h2>

          {events.length === 0 ? (
            <div
              className={`p-8 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center ${itemBg}`}
            >
              <Calendar
                className={`w-12 h-12 mb-4 ${mutedText} opacity-50`}
              />
              <h3 className={`font-semibold text-lg ${textColor} mb-2`}>
                No Past Events
              </h3>
              <p className={`${mutedText} text-sm max-w-md mb-6`}>
                Create your first past event to showcase previous ARC 3.0 competitions.
              </p>
              <button
                onClick={openCreate}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isDark
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                }`}
              >
                Create Event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`p-6 rounded-xl border transition-all hover:border-gray-400 ${itemBg}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`font-bold text-xl ${textColor} mb-1`}>
                        {event.name}
                      </h3>
                      <p className={`${mutedText} text-sm`}>
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(event)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? "hover:bg-white/10 text-gray-300"
                            : "hover:bg-gray-200 text-gray-600"
                        }`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(event)}
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

                  <p className={`${mutedText} mb-4`}>
                    {event.description}
                  </p>

                  {/* Judges */}
                  {event.judges.length > 0 && (
                    <div className="mb-6">
                      <h4 className={`font-medium mb-3 ${textColor}`}>Judges ({event.judges.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {event.judges.map((judge, index) => (
                          <div
                            key={judge.id || index}
                            className={`p-3 rounded-lg border ${isDark ? "border-white/10" : "border-gray-200"}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
                                {judge.imageUrl ? (
                                  <img
                                    src={judge.imageUrl}
                                    alt={judge.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ImageIcon className="w-full h-full p-1 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <p className={`font-medium ${textColor}`}>{judge.name}</p>
                                <p className={`text-sm ${mutedText}`}>{judge.title}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Winners */}
                  {event.winners.length > 0 && (
                    <div>
                      <h4 className={`font-medium mb-3 ${textColor}`}>Winners ({event.winners.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {event.winners.map((winner, index) => (
                          <div
                            key={winner.id || index}
                            className={`p-3 rounded-lg border ${isDark ? "border-white/10" : "border-gray-200"}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
                                {winner.imageUrl ? (
                                  <img
                                    src={winner.imageUrl}
                                    alt={winner.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ImageIcon className="w-full h-full p-1 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <p className={`font-medium ${textColor}`}>{winner.name}</p>
                                <p className={`text-xs ${mutedText}`}>{winner.position} - {winner.segmentName}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className={`sm:max-w-4xl max-h-[90vh] overflow-y-auto ${
            isDark
              ? "bg-[#111116] border-white/10 text-white"
              : "bg-white text-gray-900"
          }`}
        >
          <DialogHeader>
            <DialogTitle className={textColor}>
              {editTarget ? "Edit Past Event" : "Add New Past Event"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* Event details */}
            <div className="space-y-4 p-4 rounded-lg border border-dashed">
              <h3 className={`font-medium ${textColor}`}>Event Details</h3>

              <div className="space-y-1">
                <label className={`text-sm font-medium ${mutedText}`}>
                  Event Name *
                </label>
                <input
                  value={eventForm.name}
                  onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                  placeholder="e.g. ARC 3.0 2023"
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-sm font-medium ${mutedText}`}>
                  Event Date *
                </label>
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-sm font-medium ${mutedText}`}>
                  Description *
                </label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Describe the event..."
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-sm font-medium ${mutedText}`}>
                  Event Image URL (optional)
                </label>
                <input
                  value={eventForm.imageUrl}
                  onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                />
              </div>
            </div>

            {/* Judges */}
            <div className="space-y-4 p-4 rounded-lg border border-dashed">
              <div className="flex justify-between items-center">
                <h3 className={`font-medium ${textColor}`}>Judges</h3>
                <button
                  type="button"
                  onClick={addJudge}
                  className="text-sm px-3 py-1 rounded-lg bg-[#3a5a40] text-white hover:bg-[#344e41] transition-colors"
                >
                  Add Judge
                </button>
              </div>

              {eventForm.judges.map((judge, index) => (
                <div key={index} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className={`font-medium ${textColor}`}>Judge #{index + 1}</h4>
                    {eventForm.judges.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeJudge(index)}
                        className="text-sm px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className={`text-sm font-medium ${mutedText}`}>
                        Name *
                      </label>
                      <input
                        value={judge.name}
                        onChange={(e) => updateJudge(index, "name", e.target.value)}
                        placeholder="Judge name"
                        className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={`text-sm font-medium ${mutedText}`}>
                        Title *
                      </label>
                      <input
                        value={judge.title}
                        onChange={(e) => updateJudge(index, "title", e.target.value)}
                        placeholder="e.g. Chief Judge"
                        className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <ImageUploadField
                        label="Judge Image"
                        value={judge.imageUrl}
                        onChange={(url) => updateJudge(index, "imageUrl", url)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Winners */}
            <div className="space-y-4 p-4 rounded-lg border border-dashed">
              <div className="flex justify-between items-center">
                <h3 className={`font-medium ${textColor}`}>Winners</h3>
                <button
                  type="button"
                  onClick={addWinner}
                  className="text-sm px-3 py-1 rounded-lg bg-[#3a5a40] text-white hover:bg-[#344e41] transition-colors"
                >
                  Add Winner
                </button>
              </div>

              {eventForm.winners.map((winner, index) => (
                <div key={index} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className={`font-medium ${textColor}`}>Winner #{index + 1}</h4>
                    {eventForm.winners.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWinner(index)}
                        className="text-sm px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className={`text-sm font-medium ${mutedText}`}>
                        Name *
                      </label>
                      <input
                        value={winner.name}
                        onChange={(e) => updateWinner(index, "name", e.target.value)}
                        placeholder="Winner name"
                        className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={`text-sm font-medium ${mutedText}`}>
                        Position *
                      </label>
                      <input
                        value={winner.position}
                        onChange={(e) => updateWinner(index, "position", e.target.value)}
                        placeholder="e.g. 1st Place"
                        className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={`text-sm font-medium ${mutedText}`}>
                        Segment Name *
                      </label>
                      <input
                        value={winner.segmentName}
                        onChange={(e) => updateWinner(index, "segmentName", e.target.value)}
                        placeholder="e.g. Robo Soccer"
                        className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={`text-sm font-medium ${mutedText}`}>
                        Image URL
                      </label>
                      <ImageUploadField
                        label="Winner Image"
                        value={winner.imageUrl}
                        onChange={(url) => updateWinner(index, "imageUrl", url)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
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
                : "Create Event"}
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
              Delete Past Event
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
