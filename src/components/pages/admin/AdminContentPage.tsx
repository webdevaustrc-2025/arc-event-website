"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import {
  HelpCircle,
  HandHeart,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Globe,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { adminFetch } from "@/lib/admin-api";
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

type Tier = "gold" | "silver" | "bronze";

interface Sponsor {
  id: number;
  name: string;
  logoUrl: string;
  tier: Tier;
  websiteUrl?: string | null;
  displayOrder: number;
}

interface SponsorForm {
  name: string;
  logoUrl: string;
  tier: Tier;
  websiteUrl: string;
  displayOrder: number;
}

// ─── Fallback dummy data (never removed) ──────────────────────────────────────

const FALLBACK_SPONSORS: Sponsor[] = [
  {
    id: 1,
    name: "TechCorp",
    logoUrl: "",
    tier: "gold",
    websiteUrl: "https://techcorp.com",
    displayOrder: 0,
  },
  {
    id: 2,
    name: "InnoSystems",
    logoUrl: "",
    tier: "silver",
    websiteUrl: "https://innosystems.com",
    displayOrder: 1,
  },
  {
    id: 3,
    name: "CyberDynamics",
    logoUrl: "",
    tier: "bronze",
    websiteUrl: null,
    displayOrder: 2,
  },
];

// ─── FAQ dummy data (unchanged) ───────────────────────────────────────────────

const faqData = [
  { id: 1, question: "What is ARC 3.0?", answer: "ARC 3.0 is the premier university robotics event...", category: "General" },
  { id: 2, question: "How do I register a team?", answer: "You can register a team by visiting the registration page...", category: "Registration" },
  { id: 3, question: "Are there any registration fees?", answer: "Yes, early bird registration is $50...", category: "Payment" },
];



// ─── Empty form ───────────────────────────────────────────────────────────────

const EMPTY_FORM: SponsorForm = {
  name: "",
  logoUrl: "",
  tier: "gold",
  websiteUrl: "",
  displayOrder: 0,
};

// ─── Tier styling ─────────────────────────────────────────────────────────────

function getTierStyle(tier: Tier) {
  switch (tier) {
    case "gold":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "silver":
      return "bg-gray-400/10 text-gray-400 border-gray-400/20";
    case "bronze":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminContentPage() {
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

  const [activeTab, setActiveTab] = useState("faq");

  // ── Sponsor state ─────────────────────────────────────────────────────────

  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [sponsorsLoading, setSponsorsLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Sponsor | null>(null);
  const [form, setForm] = useState<SponsorForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Sponsor | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch sponsors ────────────────────────────────────────────────────────

  const fetchSponsors = useCallback(async () => {
    setSponsorsLoading(true);
    try {
      const data: Sponsor[] = await adminFetch("/api/admin/sponsors");
      if (data && data.length > 0) {
        setSponsors(data);
        setUsingFallback(false);
      } else {
        setSponsors(FALLBACK_SPONSORS);
        setUsingFallback(true);
      }
    } catch {
      setSponsors(FALLBACK_SPONSORS);
      setUsingFallback(true);
      toast.warning("Could not reach database. Showing fallback data.");
    } finally {
      setSponsorsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "sponsors") fetchSponsors();
  }, [activeTab, fetchSponsors]);

  // ── Dialog handlers ───────────────────────────────────────────────────────

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(sponsor: Sponsor) {
    setEditTarget(sponsor);
    setForm({
      name: sponsor.name,
      logoUrl: sponsor.logoUrl,
      tier: sponsor.tier,
      websiteUrl: sponsor.websiteUrl ?? "",
      displayOrder: sponsor.displayOrder,
    });
    setDialogOpen(true);
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!form.name.trim() || !form.logoUrl.trim()) {
      toast.error("Name and Logo URL are required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        websiteUrl: form.websiteUrl.trim() || null,
        displayOrder: Number(form.displayOrder),
      };

      if (editTarget) {
        await adminFetch(`/api/admin/sponsors/${editTarget.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Sponsor updated successfully.");
      } else {
        await adminFetch("/api/admin/sponsors", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Sponsor created successfully.");
      }

      setDialogOpen(false);
      fetchSponsors();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  function confirmDelete(sponsor: Sponsor) {
    setDeleteTarget(sponsor);
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminFetch(`/api/admin/sponsors/${deleteTarget.id}`, {
        method: "DELETE",
      });
      toast.success("Sponsor deleted.");
      setDeleteOpen(false);
      fetchSponsors();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete sponsor."
      );
    } finally {
      setDeleting(false);
    }
  }

  // ── Tabs ──────────────────────────────────────────────────────────────────

  const tabs = [
    { id: "faq", label: "FAQ Manager", icon: HelpCircle },
    { id: "sponsors", label: "Sponsors & Partners", icon: HandHeart },
    { id: "announcements", label: "Announcements", icon: MessageSquare },
  ];

  // ── Prevent render until mounted (fixes hydration) ────────────────────────

  if (!mounted) return null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1
            className={`text-3xl font-bold ${textColor} mb-2`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Content Management
          </h1>
          <p className={`${mutedText} text-lg`}>
            Update website copy, FAQs, and manage sponsors.
          </p>
        </div>
        <button
          onClick={
            activeTab === "sponsors" && !usingFallback ? openCreate : undefined
          }
          className="px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex items-center gap-2 bg-[#3a5a40] text-white hover:bg-[#344e41]"
        >
          <Plus className="w-4 h-4" />
          Add Content
        </button>
      </div>

      {/* Tabs */}
      <div className={`p-2 flex gap-2 overflow-x-auto rounded-xl border ${cardBg}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? isDark
                  ? "bg-white/10 text-white shadow-sm"
                  : "bg-gray-100 text-gray-900 shadow-sm"
                : isDark
                ? "text-gray-400 hover:text-white hover:bg-white/5"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className={`p-6 rounded-2xl border ${cardBg}`}>

        {/* ── FAQ tab (unchanged) ── */}
        {activeTab === "faq" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-xl font-bold ${textColor}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Frequently Asked Questions
              </h2>
              <button className="text-sm font-medium hover:underline text-[#588157] hover:text-[#a3b18a]">
                Reorder Questions
              </button>
            </div>
            <div className="space-y-4">
              {faqData.map((faq) => (
                <div
                  key={faq.id}
                  className={`p-5 rounded-xl border transition-all hover:border-gray-400 group flex items-start justify-between gap-4 ${itemBg}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
                          isDark
                            ? "bg-white/5 text-gray-300 border-white/10"
                            : "bg-gray-200 text-gray-700 border-gray-300"
                        }`}
                      >
                        {faq.category}
                      </span>
                      <h4 className={`font-semibold text-lg ${textColor}`}>
                        {faq.question}
                      </h4>
                    </div>
                    <p className={`${mutedText} text-sm`}>{faq.answer}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className={`p-2 rounded-lg transition-colors ${
                        isDark
                          ? "hover:bg-white/10 text-gray-300"
                          : "hover:bg-gray-200 text-gray-600"
                      }`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
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
              ))}
            </div>
          </div>
        )}

        {/* ── Sponsors tab ── */}
        {activeTab === "sponsors" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2
                  className={`text-xl font-bold ${textColor}`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Sponsorship Tiers & Logos
                </h2>
                {usingFallback && (
                  <p className="text-xs mt-1 text-amber-500">
                    Showing fallback data — database is empty or unreachable.
                  </p>
                )}
              </div>
              {!usingFallback && (
                <button
                  onClick={openCreate}
                  className="text-sm font-medium hover:underline text-[#588157] hover:text-[#a3b18a] flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Sponsor
                </button>
              )}
            </div>

            {/* Loading skeleton */}
            {sponsorsLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`p-5 rounded-xl border animate-pulse ${itemBg}`}
                  >
                    <div
                      className={`w-20 h-20 rounded-full mx-auto mb-4 ${
                        isDark ? "bg-white/10" : "bg-gray-200"
                      }`}
                    />
                    <div
                      className={`h-4 rounded mx-auto w-24 mb-3 ${
                        isDark ? "bg-white/10" : "bg-gray-200"
                      }`}
                    />
                    <div
                      className={`h-3 rounded mx-auto w-16 ${
                        isDark ? "bg-white/10" : "bg-gray-200"
                      }`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Sponsor cards */}
            {!sponsorsLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sponsors.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className={`p-5 rounded-xl border flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1 ${itemBg}`}
                  >
                    {/* Logo */}
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 overflow-hidden ${
                        isDark
                          ? "bg-white/5 border border-white/10"
                          : "bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {sponsor.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={sponsor.logoUrl}
                          alt={sponsor.name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <ImageIcon className={`w-8 h-8 ${mutedText}`} />
                      )}
                    </div>

                    <h4 className={`font-semibold text-lg ${textColor}`}>
                      {sponsor.name}
                    </h4>

                    <div className="flex flex-col gap-2 mt-3 items-center w-full">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${getTierStyle(sponsor.tier)}`}
                      >
                        {sponsor.tier}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Order: {sponsor.displayOrder}
                      </span>
                    </div>

                    <div
                      className={`mt-4 pt-4 border-t w-full flex justify-between items-center ${
                        isDark ? "border-white/10" : "border-gray-200"
                      }`}
                    >
                      {sponsor.websiteUrl ? (
                        <a
                          href={String(sponsor.websiteUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center gap-1 text-[#588157] hover:underline truncate max-w-[120px]"
                        >
                          <Globe className="w-3 h-3 shrink-0" />
                          Website
                        </a>
                      ) : (
                        <span className={`text-xs ${mutedText}`}>
                          No website
                        </span>
                      )}

                      {!usingFallback && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEdit(sponsor)}
                            className={`p-1.5 rounded-md transition-colors ${
                              isDark
                                ? "hover:bg-white/10"
                                : "hover:bg-gray-200"
                            }`}
                          >
                            <Edit2 className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            onClick={() => confirmDelete(sponsor)}
                            className={`p-1.5 rounded-md transition-colors ${
                              isDark
                                ? "bg-red-500/10 hover:bg-red-500/20 text-red-400"
                                : "bg-red-50 hover:bg-red-100 text-red-500"
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Announcements tab (unchanged) ── */}
        {activeTab === "announcements" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-xl font-bold ${textColor}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Homepage Announcements
              </h2>
            </div>
            <div
              className={`p-8 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center ${
                isDark
                  ? "border-white/10 bg-white/5"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <MessageSquare
                className={`w-12 h-12 mb-4 ${mutedText} opacity-50`}
              />
              <h3 className={`font-semibold text-lg ${textColor} mb-2`}>
                No Active Announcements
              </h3>
              <p className={`${mutedText} text-sm max-w-md mb-6`}>
                Create an announcement banner that will appear at the top of
                the homepage for all visitors.
              </p>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isDark
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                }`}
              >
                Create Banner
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className={`sm:max-w-md ${
            isDark
              ? "bg-[#111116] border-white/10 text-white"
              : "bg-white text-gray-900"
          }`}
        >
          <DialogHeader>
            <DialogTitle className={textColor}>
              {editTarget ? "Edit Sponsor" : "Add Sponsor"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className={`text-sm font-medium ${mutedText}`}>
                Name *
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. TechCorp"
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
              />
            </div>

            <div className="space-y-1">
              <label className={`text-sm font-medium ${mutedText}`}>
                Logo URL *
              </label>
              <input
                value={form.logoUrl}
                onChange={(e) =>
                  setForm({ ...form, logoUrl: e.target.value })
                }
                placeholder="https://..."
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
              />
            </div>

            <div className="space-y-1">
              <label className={`text-sm font-medium ${mutedText}`}>
                Tier *
              </label>
              <select
                value={form.tier}
                onChange={(e) =>
                  setForm({ ...form, tier: e.target.value as Tier })
                }
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
              >
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={`text-sm font-medium ${mutedText}`}>
                Website URL (optional)
              </label>
              <input
                value={form.websiteUrl}
                onChange={(e) =>
                  setForm({ ...form, websiteUrl: e.target.value })
                }
                placeholder="https://..."
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
              />
            </div>

            <div className="space-y-1">
              <label className={`text-sm font-medium ${mutedText}`}>
                Display Order
              </label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) =>
                  setForm({ ...form, displayOrder: Number(e.target.value) })
                }
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
              />
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
                : "Create Sponsor"}
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
              Delete Sponsor
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