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
  Clock,
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

interface Announcement {
  id: number;
  title: string;
  message: string;
  icon: string;
  color: string;
  isNew: boolean;
  createdAt: string;
}

interface AnnouncementForm {
  title: string;
  message: string;
  icon: string;
  color: string;
  isNew: boolean;
}

interface PastEventItem {
  id: number;
  name: string;
  date: string;
  description: string;
  imageUrl?: string | null;
}

interface PastEventForm {
  name: string;
  date: string;
  description: string;
  imageUrl: string;
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

const EMPTY_ANNOUNCEMENT_FORM: AnnouncementForm = {
  title: "",
  message: "",
  icon: "Bell",
  color: "#588157",
  isNew: true,
};

const EMPTY_PAST_EVENT_FORM: PastEventForm = {
  name: "",
  date: "",
  description: "",
  imageUrl: "",
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

const [faqs, setFaqs] = useState<FAQ[]>([]);
const [faqLoading, setFaqLoading] = useState(false);

const [faqDialogOpen, setFaqDialogOpen] = useState(false);
const [faqEditTarget, setFaqEditTarget] = useState<FAQ | null>(null);

const [faqForm, setFaqForm] = useState({
  question: "",
  answer: "",
  displayOrder: 0,
});

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

  // ── Announcement state ────────────────────────────────────────────────────

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);

  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [announcementEditTarget, setAnnouncementEditTarget] = useState<Announcement | null>(null);
  const [announcementForm, setAnnouncementForm] = useState<AnnouncementForm>(EMPTY_ANNOUNCEMENT_FORM);
  const [announcementSubmitting, setAnnouncementSubmitting] = useState(false);

  const [announcementDeleteTarget, setAnnouncementDeleteTarget] = useState<Announcement | null>(null);
  const [announcementDeleteOpen, setAnnouncementDeleteOpen] = useState(false);
  const [announcementDeleting, setAnnouncementDeleting] = useState(false);

  // ── Past Event state ──────────────────────────────────────────────────────

  const [pastEvents, setPastEvents] = useState<PastEventItem[]>([]);
  const [pastEventsLoading, setPastEventsLoading] = useState(false);

  const [pastEventDialogOpen, setPastEventDialogOpen] = useState(false);
  const [pastEventEditTarget, setPastEventEditTarget] = useState<PastEventItem | null>(null);
  const [pastEventForm, setPastEventForm] = useState<PastEventForm>(EMPTY_PAST_EVENT_FORM);
  const [pastEventSubmitting, setPastEventSubmitting] = useState(false);

  const [pastEventDeleteTarget, setPastEventDeleteTarget] = useState<PastEventItem | null>(null);
  const [pastEventDeleteOpen, setPastEventDeleteOpen] = useState(false);
  const [pastEventDeleting, setPastEventDeleting] = useState(false);

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

  const fetchFaqs = useCallback(async () => {
  setFaqLoading(true);

  try {
    const data: FAQ[] = await adminFetch("/api/admin/faqs");
    setFaqs(data);
  } catch {
    toast.error("Failed to load FAQs");
  } finally {
    setFaqLoading(false);
  }
}, []);

  useEffect(() => {
  if (activeTab === "sponsors") {
    fetchSponsors();
  }

  // ── Fetch announcements ───────────────────────────────────────────────────

  const fetchAnnouncements = useCallback(async () => {
    setAnnouncementsLoading(true);
    try {
      const data: Announcement[] = await adminFetch("/api/admin/announcements");
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch {
      setAnnouncements([]);
      toast.warning("Could not load announcements.");
    } finally {
      setAnnouncementsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "announcements") fetchAnnouncements();
  }, [activeTab, fetchAnnouncements]);

  // ── Fetch past events ─────────────────────────────────────────────────────

  const fetchPastEvents = useCallback(async () => {
    setPastEventsLoading(true);
    try {
      const data: PastEventItem[] = await adminFetch("/api/admin/past-events");
      setPastEvents(Array.isArray(data) ? data : []);
    } catch {
      setPastEvents([]);
      toast.warning("Could not load past events.");
    } finally {
      setPastEventsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "past-events") fetchPastEvents();
  }, [activeTab, fetchPastEvents]);

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

  // ── Announcement dialog handlers ──────────────────────────────────────────

  function openCreateAnnouncement() {
    setAnnouncementEditTarget(null);
    setAnnouncementForm(EMPTY_ANNOUNCEMENT_FORM);
    setAnnouncementDialogOpen(true);
  }

  function openEditAnnouncement(announcement: Announcement) {
    setAnnouncementEditTarget(announcement);
    setAnnouncementForm({
      title: announcement.title,
      message: announcement.message,
      icon: announcement.icon,
      color: announcement.color,
      isNew: announcement.isNew,
    });
    setAnnouncementDialogOpen(true);
  }

  // ── Past Event dialog handlers ────────────────────────────────────────────

  function openCreatePastEvent() {
    setPastEventEditTarget(null);
    setPastEventForm(EMPTY_PAST_EVENT_FORM);
    setPastEventDialogOpen(true);
  }

  function openEditPastEvent(event: PastEventItem) {
    setPastEventEditTarget(event);
    setPastEventForm({
      name: event.name,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : "",
      description: event.description,
      imageUrl: event.imageUrl ?? "",
    });
    setPastEventDialogOpen(true);
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
async function handleFaqDelete(id: number) {
  try {
    await adminFetch(`/api/admin/faqs/${id}`, {
      method: "DELETE",
    });

    toast.success("FAQ deleted.");

    fetchFaqs();
  } catch {
    toast.error("Failed to delete FAQ");
  }
}

async function handleFaqCreate() {
  await adminFetch("/api/admin/faqs", {
    method: "POST",
    body: JSON.stringify(faqForm),
  });

  toast.success("FAQ created");
  setFaqDialogOpen(false);
  fetchFaqs();
}

async function handleFaqEdit() {
  if (!faqEditTarget) return;

  await adminFetch(`/api/admin/faqs/${faqEditTarget.id}`, {
    method: "PUT",
    body: JSON.stringify(faqForm),
  });

  toast.success("FAQ updated");
  setFaqDialogOpen(false);
  setFaqEditTarget(null);
  fetchFaqs();
}

  // ── Announcement submit ───────────────────────────────────────────────────

  async function handleAnnouncementSubmit() {
    if (!announcementForm.title.trim() || !announcementForm.message.trim()) {
      toast.error("Title and message are required.");
      return;
    }

    setAnnouncementSubmitting(true);
    try {
      const payload = {
        ...announcementForm,
        title: announcementForm.title.trim(),
        message: announcementForm.message.trim(),
        icon: announcementForm.icon.trim() || "Bell",
        color: announcementForm.color || "#588157",
      };

      if (announcementEditTarget) {
        await adminFetch(`/api/admin/announcements/${announcementEditTarget.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Announcement updated successfully.");
      } else {
        await adminFetch("/api/admin/announcements", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Announcement created successfully.");
      }

      setAnnouncementDialogOpen(false);
      fetchAnnouncements();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setAnnouncementSubmitting(false);
    }
  }

  // ── Announcement delete ───────────────────────────────────────────────────

  function confirmDeleteAnnouncement(announcement: Announcement) {
    setAnnouncementDeleteTarget(announcement);
    setAnnouncementDeleteOpen(true);
  }

  async function handleAnnouncementDelete() {
    if (!announcementDeleteTarget) return;
    setAnnouncementDeleting(true);
    try {
      await adminFetch(`/api/admin/announcements/${announcementDeleteTarget.id}`, {
        method: "DELETE",
      });
      toast.success("Announcement deleted.");
      setAnnouncementDeleteOpen(false);
      fetchAnnouncements();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete announcement."
      );
    } finally {
      setAnnouncementDeleting(false);
    }
  }

  // ── Past Event submit ─────────────────────────────────────────────────────

  async function handlePastEventSubmit() {
    if (!pastEventForm.name.trim() || !pastEventForm.date || !pastEventForm.description.trim()) {
      toast.error("Name, date, and description are required.");
      return;
    }

    setPastEventSubmitting(true);
    try {
      const payload = {
        ...pastEventForm,
        name: pastEventForm.name.trim(),
        description: pastEventForm.description.trim(),
        imageUrl: pastEventForm.imageUrl.trim() || null,
        date: new Date(pastEventForm.date).toISOString(),
      };

      if (pastEventEditTarget) {
        await adminFetch(`/api/admin/past-events/${pastEventEditTarget.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Past event updated successfully.");
      } else {
        await adminFetch("/api/admin/past-events", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Past event created successfully.");
      }

      setPastEventDialogOpen(false);
      fetchPastEvents();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPastEventSubmitting(false);
    }
  }

  // ── Past Event delete ─────────────────────────────────────────────────────

  function confirmDeletePastEvent(event: PastEventItem) {
    setPastEventDeleteTarget(event);
    setPastEventDeleteOpen(true);
  }

  async function handlePastEventDelete() {
    if (!pastEventDeleteTarget) return;
    setPastEventDeleting(true);
    try {
      await adminFetch(`/api/admin/past-events/${pastEventDeleteTarget.id}`, {
        method: "DELETE",
      });
      toast.success("Past event deleted.");
      setPastEventDeleteOpen(false);
      fetchPastEvents();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete event."
      );
    } finally {
      setPastEventDeleting(false);
    }
  }

  // ── Tabs ──────────────────────────────────────────────────────────────────

  const tabs = [
    { id: "faq", label: "FAQ Manager", icon: HelpCircle },
    { id: "sponsors", label: "Sponsors & Partners", icon: HandHeart },
    { id: "announcements", label: "Announcements", icon: MessageSquare },
    { id: "past-events", label: "Past Events", icon: Clock },
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
            activeTab === "sponsors" && !usingFallback ? openCreate :
              activeTab === "announcements" ? openCreateAnnouncement :
                activeTab === "past-events" ? openCreatePastEvent :
                  undefined
          }
          className="px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex items-center gap-2 bg-[#3a5a40] text-white hover:bg-[#344e41]"
        >
          <Plus className="w-4 h-4" />
          {activeTab === "sponsors" ? "Add Sponsor" :
            activeTab === "announcements" ? "Add Announcement" :
              activeTab === "past-events" ? "Add Past Event" :
                "Add Content"}
        </button>
      </div>

      {/* Tabs */}
      <div className={`p-2 flex gap-2 overflow-x-auto rounded-xl border ${cardBg}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === tab.id
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
          {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className={`p-5 rounded-xl border transition-all hover:border-gray-400 group flex items-start justify-between gap-4 ${itemBg}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs font-medium border ${isDark
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
                      className={`p-2 rounded-lg transition-colors ${isDark
                        ? "hover:bg-white/10 text-gray-300"
                        : "hover:bg-gray-200 text-gray-600"
                        }`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      className={`p-2 rounded-lg transition-colors ${isDark
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
                      className={`w-20 h-20 rounded-full mx-auto mb-4 ${isDark ? "bg-white/10" : "bg-gray-200"
                        }`}
                    />
                    <div
                      className={`h-4 rounded mx-auto w-24 mb-3 ${isDark ? "bg-white/10" : "bg-gray-200"
                        }`}
                    />
                    <div
                      className={`h-3 rounded mx-auto w-16 ${isDark ? "bg-white/10" : "bg-gray-200"
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
                      className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 overflow-hidden ${isDark
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
                        className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                      >
                        Order: {sponsor.displayOrder}
                      </span>
                    </div>

                    <div
                      className={`mt-4 pt-4 border-t w-full flex justify-between items-center ${isDark ? "border-white/10" : "border-gray-200"
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
                            className={`p-1.5 rounded-md transition-colors ${isDark
                              ? "hover:bg-white/10"
                              : "hover:bg-gray-200"
                              }`}
                          >
                            <Edit2 className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            onClick={() => confirmDelete(sponsor)}
                            className={`p-1.5 rounded-md transition-colors ${isDark
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

        {/* ── Announcements tab ── */}
        {activeTab === "announcements" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-xl font-bold ${textColor}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Homepage Announcements
              </h2>
              <button
                onClick={openCreateAnnouncement}
                className="text-sm font-medium hover:underline text-[#588157] hover:text-[#a3b18a] flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Announcement
              </button>
            </div>

            {/* Loading skeleton */}
            {announcementsLoading && (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`p-5 rounded-xl border animate-pulse ${itemBg}`}
                  >
                    <div
                      className={`h-4 rounded w-40 mb-3 ${isDark ? "bg-white/10" : "bg-gray-200"
                        }`}
                    />
                    <div
                      className={`h-3 rounded w-full ${isDark ? "bg-white/10" : "bg-gray-200"
                        }`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Announcement cards */}
            {!announcementsLoading && announcements.length === 0 && (
              <div
                className={`p-8 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center ${isDark
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
                  onClick={openCreateAnnouncement}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${isDark
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                >
                  Create Banner
                </button>
              </div>
            )}

            {!announcementsLoading && announcements.length > 0 && (
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`p-5 rounded-xl border transition-all hover:border-gray-400 group flex items-start justify-between gap-4 ${itemBg}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: announcement.color }}
                        />
                        <h4 className={`font-semibold text-lg ${textColor}`}>
                          {announcement.title}
                        </h4>
                        {announcement.isNew && (
                          <span
                            className={`px-2 py-0.5 rounded-md text-xs font-medium border ${isDark
                              ? "bg-white/5 text-gray-300 border-white/10"
                              : "bg-gray-200 text-gray-700 border-gray-300"
                              }`}
                          >
                            New
                          </span>
                        )}
                      </div>
                      <p className={`${mutedText} text-sm`}>
                        {announcement.message}
                      </p>
                      <p className={`${mutedText} text-xs mt-2 opacity-60`}>
                        Icon: {announcement.icon}
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditAnnouncement(announcement)}
                        className={`p-2 rounded-lg transition-colors ${isDark
                          ? "hover:bg-white/10 text-gray-300"
                          : "hover:bg-gray-200 text-gray-600"
                          }`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDeleteAnnouncement(announcement)}
                        className={`p-2 rounded-lg transition-colors ${isDark
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
            )}
          </div>
        )}

        {/* ── Past Events tab ── */}
        {activeTab === "past-events" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-xl font-bold ${textColor}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Past Events Archive
              </h2>
              <button
                onClick={openCreatePastEvent}
                className="text-sm font-medium hover:underline text-[#588157] hover:text-[#a3b18a] flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Past Event
              </button>
            </div>

            {/* Loading skeleton */}
            {pastEventsLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className={`p-5 rounded-xl border animate-pulse ${itemBg}`}
                  >
                    <div
                      className={`h-40 rounded-lg w-full mb-4 ${isDark ? "bg-white/10" : "bg-gray-200"
                        }`}
                    />
                    <div
                      className={`h-4 rounded w-40 mb-3 ${isDark ? "bg-white/10" : "bg-gray-200"
                        }`}
                    />
                    <div
                      className={`h-3 rounded w-full ${isDark ? "bg-white/10" : "bg-gray-200"
                        }`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Past Event cards */}
            {!pastEventsLoading && pastEvents.length === 0 && (
              <div
                className={`p-8 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center ${isDark
                  ? "border-white/10 bg-white/5"
                  : "border-gray-200 bg-gray-50"
                  }`}
              >
                <Clock
                  className={`w-12 h-12 mb-4 ${mutedText} opacity-50`}
                />
                <h3 className={`font-semibold text-lg ${textColor} mb-2`}>
                  No Past Events Recorded
                </h3>
                <p className={`${mutedText} text-sm max-w-md mb-6`}>
                  Add events that happened in previous years to show in the showcase gallery on the public past events page.
                </p>
                <button
                  onClick={openCreatePastEvent}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${isDark
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                >
                  Add First Event
                </button>
              </div>
            )}

            {!pastEventsLoading && pastEvents.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-5 rounded-xl border transition-all hover:border-gray-400 group flex items-start gap-4 ${itemBg}`}
                  >
                    <div className={`w-24 h-24 rounded-lg overflow-hidden shrink-0 border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                      {event.imageUrl ? (
                        <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-500/10 text-gray-500 italic text-[10px]">No image</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold text-lg ${textColor} truncate`}>
                          {event.name}
                        </h4>
                        <span className={`text-xs px-2 py-0.5 rounded bg-[#a3b18a]/20 text-[#588157] font-bold`}>
                          {new Date(event.date).getFullYear()}
                        </span>
                      </div>
                      <p className={`${mutedText} text-sm line-clamp-2`}>
                        {event.description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditPastEvent(event)}
                        className={`p-2 rounded-lg transition-colors ${isDark
                          ? "hover:bg-white/10 text-gray-300"
                          : "hover:bg-gray-200 text-gray-600"
                          }`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDeletePastEvent(event)}
                        className={`p-2 rounded-lg transition-colors ${isDark
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
            )}
          </div>
        )}
      </div>

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className={`sm:max-w-md ${isDark
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark
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

      {/* ── Delete confirmation (sponsors) ── */}
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

      {/* ── Announcement Create / Edit Dialog ── */}
      <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
        <DialogContent
          className={`sm:max-w-md ${isDark
            ? "bg-[#111116] border-white/10 text-white"
            : "bg-white text-gray-900"
            }`}
        >
          <DialogHeader>
            <DialogTitle className={textColor}>
              {announcementEditTarget ? "Edit Announcement" : "Add Announcement"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className={`text-sm font-medium ${mutedText}`}>
                Title *
              </label>
              <input
                value={announcementForm.title}
                onChange={(e) =>
                  setAnnouncementForm({ ...announcementForm, title: e.target.value })
                }
                placeholder="e.g. Registration is now open!"
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
              />
            </div>

            <div className="space-y-1">
              <label className={`text-sm font-medium ${mutedText}`}>
                Message *
              </label>
              <textarea
                value={announcementForm.message}
                onChange={(e) =>
                  setAnnouncementForm({ ...announcementForm, message: e.target.value })
                }
                placeholder="e.g. Team registrations are now open until June 10."
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors resize-none ${inputClass}`}
              />
            </div>

            <div className="space-y-1">
              <label className={`text-sm font-medium ${mutedText}`}>
                Icon (Lucide icon name)
              </label>
              <input
                value={announcementForm.icon}
                onChange={(e) =>
                  setAnnouncementForm({ ...announcementForm, icon: e.target.value })
                }
                placeholder="e.g. Bell, Info, AlertCircle"
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
              />
            </div>

            <div className="space-y-1">
              <label className={`text-sm font-medium ${mutedText}`}>
                Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={announcementForm.color}
                  onChange={(e) =>
                    setAnnouncementForm({ ...announcementForm, color: e.target.value })
                  }
                  className="w-10 h-9 rounded cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  value={announcementForm.color}
                  onChange={(e) =>
                    setAnnouncementForm({ ...announcementForm, color: e.target.value })
                  }
                  placeholder="#588157"
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="announcement-isnew"
                checked={announcementForm.isNew}
                onChange={(e) =>
                  setAnnouncementForm({ ...announcementForm, isNew: e.target.checked })
                }
                className="w-4 h-4 accent-[#588157] cursor-pointer"
              />
              <label
                htmlFor="announcement-isnew"
                className={`text-sm font-medium ${mutedText} cursor-pointer`}
              >
                Mark as New
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <button
              onClick={() => setAnnouncementDialogOpen(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
            >
              Cancel
            </button>
            <button
              onClick={handleAnnouncementSubmit}
              disabled={announcementSubmitting}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#3a5a40] hover:bg-[#344e41] text-white transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {announcementSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
              {announcementSubmitting
                ? announcementEditTarget
                  ? "Saving..."
                  : "Creating..."
                : announcementEditTarget
                  ? "Save Changes"
                  : "Create Announcement"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Announcement Delete confirmation ── */}
      <AlertDialog open={announcementDeleteOpen} onOpenChange={setAnnouncementDeleteOpen}>
        <AlertDialogContent
          className={
            isDark
              ? "bg-[#111116] border-white/10 text-white"
              : "bg-white text-gray-900"
          }
        >
          <AlertDialogHeader>
            <AlertDialogTitle className={textColor}>
              Delete Announcement
            </AlertDialogTitle>
            <AlertDialogDescription className={mutedText}>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{announcementDeleteTarget?.title}</span>? This
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
              onClick={handleAnnouncementDelete}
              disabled={announcementDeleting}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 flex items-center gap-2"
            >
              {announcementDeleting && <Loader2 className="w-3 h-3 animate-spin" />}
              {announcementDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Past Event Create / Edit Dialog ── */}
      <Dialog open={pastEventDialogOpen} onOpenChange={setPastEventDialogOpen}>
        <DialogContent
          className={`sm:max-w-md ${isDark
            ? "bg-[#111116] border-white/10 text-white"
            : "bg-white text-gray-900"
            }`}
        >
          <DialogHeader>
            <DialogTitle className={textColor}>
              {pastEventEditTarget ? "Edit Past Event" : "Add Past Event"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className={`text-sm font-medium ${mutedText}`}>
                Event Name *
              </label>
              <input
                value={pastEventForm.name}
                onChange={(e) =>
                  setPastEventForm({ ...pastEventForm, name: e.target.value })
                }
                placeholder="e.g. ARC 3.0 2024"
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
              />
            </div>

            <div className="space-y-1">
              <label className={`text-sm font-medium ${mutedText}`}>
                Event Date *
              </label>
              <input
                type="date"
                value={pastEventForm.date}
                onChange={(e) =>
                  setPastEventForm({ ...pastEventForm, date: e.target.value })
                }
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
              />
            </div>

            <div className="space-y-1">
              <label className={`text-sm font-medium ${mutedText}`}>
                Description *
              </label>
              <textarea
                value={pastEventForm.description}
                onChange={(e) =>
                  setPastEventForm({ ...pastEventForm, description: e.target.value })
                }
                placeholder="Briefly describe the event highlights..."
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors resize-none ${inputClass}`}
              />
            </div>

            <div className="space-y-1">
              <label className={`text-sm font-medium ${mutedText}`}>
                Image URL (optional)
              </label>
              <input
                value={pastEventForm.imageUrl}
                onChange={(e) =>
                  setPastEventForm({ ...pastEventForm, imageUrl: e.target.value })
                }
                placeholder="https://..."
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <button
              onClick={() => setPastEventDialogOpen(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
            >
              Cancel
            </button>
            <button
              onClick={handlePastEventSubmit}
              disabled={pastEventSubmitting}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#3a5a40] hover:bg-[#344e41] text-white transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {pastEventSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
              {pastEventSubmitting
                ? pastEventEditTarget
                  ? "Saving..."
                  : "Creating..."
                : pastEventEditTarget
                  ? "Save Changes"
                  : "Create Event"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Past Event Delete confirmation ── */}
      <AlertDialog open={pastEventDeleteOpen} onOpenChange={setPastEventDeleteOpen}>
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
              <span className="font-semibold">{pastEventDeleteTarget?.name}</span>? This
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
              onClick={handlePastEventDelete}
              disabled={pastEventDeleting}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 flex items-center gap-2"
            >
              {pastEventDeleting && <Loader2 className="w-3 h-3 animate-spin" />}
              {pastEventDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}