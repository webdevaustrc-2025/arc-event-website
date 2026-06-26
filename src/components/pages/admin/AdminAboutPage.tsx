"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { toast } from 'sonner';
import { 
  Info, Target, Eye, Image as ImageIcon, Sparkles, Trophy, Loader2, Plus, 
  HelpCircle, Trash2, Edit3, Settings, AlertTriangle, CheckCircle2 
} from 'lucide-react';
import {
  PageHeader,
  DataTable,
  CreateEditDialog,
  useAdminData,
  useAdminDialog,
  FormField,
  SelectField,
  TextareaField
} from "@/components/SharedAdminPanel";
import type { TableColumn } from "@/components/SharedAdminPanel/types/admin";

interface HeroData {
  heading: string;
  description: string;
  imageUrl: string;
}

interface AustrcData {
  title: string;
  content: string;
  imageUrl: string;
}

interface MissionVisionData {
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;
}

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
}

interface WhatWeDoItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  displayOrder: number;
}

interface EventItem {
  id: number;
  title: string;
  tag: string;
  badge: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  displayOrder: number;
}

export default function AdminAboutPage() {
  const { isDark } = useResolvedTheme();
  const [activeTab, setActiveTab] = useState<'hero' | 'austrc' | 'mission-vision' | 'gallery' | 'what-we-do' | 'events'>('hero');
  const [isClient, setIsClient] = useState(false);

  // Singleton data states
  const [hero, setHero] = useState<HeroData>({ heading: '', description: '', imageUrl: '' });
  const [austrc, setAustrc] = useState<AustrcData>({ title: '', content: '', imageUrl: '' });
  const [missionVision, setMissionVision] = useState<MissionVisionData>({
    missionTitle: 'Our Mission',
    missionDescription: '',
    visionTitle: 'Our Vision',
    visionDescription: '',
  });

  const [loadingSingletons, setLoadingSingletons] = useState(true);
  const [savingSingle, setSavingSingle] = useState(false);

  // List data hooks
  const galleryData = useAdminData<GalleryItem>({ endpoint: "/api/admin/about/gallery", pageSize: 10 });
  const whatWeDoData = useAdminData<WhatWeDoItem>({ endpoint: "/api/admin/about/what-we-do", pageSize: 10 });
  const eventsData = useAdminData<EventItem>({ endpoint: "/api/admin/about/events", pageSize: 10 });

  const galleryDialog = useAdminDialog();
  const whatWeDoDialog = useAdminDialog();
  const eventsDialog = useAdminDialog();

  const [listFormData, setListFormData] = useState<any>({});
  const [submittingList, setSubmittingList] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch singleton section data
  const fetchSingletons = async () => {
    try {
      setLoadingSingletons(true);
      const res = await fetch('/api/about');
      if (res.ok) {
        const json = await res.json();
        if (json.about_hero) {
          setHero({
            heading: json.about_hero.heading,
            description: json.about_hero.description,
            imageUrl: json.about_hero.imageUrl || '',
          });
        }
        if (json.about_austrc) {
          setAustrc({
            title: json.about_austrc.title,
            content: json.about_austrc.content,
            imageUrl: json.about_austrc.imageUrl || '',
          });
        }
        if (json.about_mission_vision) {
          setMissionVision({
            missionTitle: json.about_mission_vision.mission_title,
            missionDescription: json.about_mission_vision.mission_description,
            visionTitle: json.about_mission_vision.vision_title,
            visionDescription: json.about_mission_vision.vision_description,
          });
        }
      }
    } catch (err) {
      console.error("Failed to load sections data", err);
      toast.error("Failed to load sections data");
    } finally {
      setLoadingSingletons(false);
    }
  };

  useEffect(() => {
    fetchSingletons();
  }, []);

  if (!isClient) return null;

  // Theme Styles
  const cardBg = isDark ? 'bg-[#111116] border-white/[0.07]' : 'bg-white border-black/[0.08]';
  const textColor = isDark ? 'text-[#F5F5F0]' : 'text-[#1a1a14]';
  const mutedText = isDark ? 'text-[#9A9A8E]' : 'text-[#4a4a40]';
  const inputStyle = `w-full px-3 py-2 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#588157]/40 transition-all ${
    isDark ? 'bg-[#18181f] border-white/[0.07] text-[#F5F5F0]' : 'bg-white border-gray-300 text-gray-900'
  }`;

  // Image Upload component inside form
  const ImageUploadInput = ({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/about/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const result = await res.json();
          onChange(result.url);
          toast.success("Image uploaded successfully!");
        } else {
          const err = await res.json();
          toast.error(err.message || "Failed to upload");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error uploading image");
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="space-y-2">
        <label className={`block text-xs font-semibold uppercase tracking-wider ${mutedText}`}>{label}</label>
        <div className="flex gap-4 items-center">
          <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            className={inputStyle}
            placeholder="https://example.com/image.png"
          />
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-[#3a5a40] hover:bg-[#344e41] text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload"}
          </button>
        </div>
        {value && (
          <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-border bg-black/10">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    );
  };

  // Singleton Savers
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSingle(true);
    try {
      const res = await fetch('/api/admin/about/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hero),
      });
      if (res.ok) {
        toast.success("Hero section saved successfully");
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to save Hero section");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save Hero section");
    } finally {
      setSavingSingle(false);
    }
  };

  const handleSaveAustrc = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSingle(true);
    try {
      const res = await fetch('/api/admin/about/austrc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(austrc),
      });
      if (res.ok) {
        toast.success("About ARC section saved successfully");
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to save details");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save section");
    } finally {
      setSavingSingle(false);
    }
  };

  const handleSaveMissionVision = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSingle(true);
    try {
      const res = await fetch('/api/admin/about/mission-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(missionVision),
      });
      if (res.ok) {
        toast.success("Mission & Vision statements saved successfully");
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to save section");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save statements");
    } finally {
      setSavingSingle(false);
    }
  };

  // Gallery CRUD handlers
  const galleryColumns: TableColumn<GalleryItem>[] = [
    { key: "title", label: "Title", width: "200px" },
    { key: "description", label: "Description", width: "300px" },
    { key: "displayOrder", label: "Order", width: "100px" },
  ];

  const handleEditGallery = (item: GalleryItem) => {
    galleryDialog.open("edit", item);
    setListFormData({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      displayOrder: item.displayOrder,
    });
  };

  const handleDeleteGallery = async (item: GalleryItem) => {
    try {
      await galleryData.deleteItem(item.id);
      toast.success("Gallery item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete gallery item");
    }
  };

  const handleGalleryDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingList(true);
    try {
      if (galleryDialog.mode === "create") {
        await galleryData.createItem(listFormData);
        toast.success("Gallery item created successfully");
      } else if (galleryDialog.data?.id) {
        await galleryData.updateItem(galleryDialog.data.id, listFormData);
        toast.success("Gallery item updated successfully");
      }
      galleryDialog.close();
      setListFormData({});
    } catch (error: any) {
      toast.error(error.message || "Failed to save item");
    } finally {
      setSubmittingList(false);
    }
  };

  // What We Do CRUD handlers
  const whatWeDoColumns: TableColumn<WhatWeDoItem>[] = [
    { key: "title", label: "Title", width: "200px" },
    { key: "description", label: "Description", width: "300px" },
    { key: "icon", label: "Icon Name", width: "120px" },
    { key: "displayOrder", label: "Order", width: "100px" },
  ];

  const handleEditWhatWeDo = (item: WhatWeDoItem) => {
    whatWeDoDialog.open("edit", item);
    setListFormData({
      title: item.title,
      description: item.description,
      icon: item.icon,
      displayOrder: item.displayOrder,
    });
  };

  const handleDeleteWhatWeDo = async (item: WhatWeDoItem) => {
    try {
      await whatWeDoData.deleteItem(item.id);
      toast.success("Activity item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete activity item");
    }
  };

  const handleWhatWeDoDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingList(true);
    try {
      if (whatWeDoDialog.mode === "create") {
        await whatWeDoData.createItem(listFormData);
        toast.success("Activity item created successfully");
      } else if (whatWeDoDialog.data?.id) {
        await whatWeDoData.updateItem(whatWeDoDialog.data.id, listFormData);
        toast.success("Activity item updated successfully");
      }
      whatWeDoDialog.close();
      setListFormData({});
    } catch (error: any) {
      toast.error(error.message || "Failed to save item");
    } finally {
      setSubmittingList(false);
    }
  };

  // Events CRUD handlers
  const eventsColumns: TableColumn<EventItem>[] = [
    { key: "title", label: "Title", width: "200px" },
    { key: "tag", label: "Category Tag", width: "150px" },
    { key: "badge", label: "Bottom Badge", width: "120px" },
    { key: "date", label: "Date", width: "120px" },
    { key: "location", label: "Location", width: "150px" },
  ];

  const handleEditEvent = (item: EventItem) => {
    eventsDialog.open("edit", item);
    setListFormData({
      title: item.title,
      tag: item.tag,
      badge: item.badge,
      description: item.description,
      date: item.date,
      location: item.location,
      imageUrl: item.imageUrl,
      displayOrder: item.displayOrder,
    });
  };

  const handleDeleteEvent = async (item: EventItem) => {
    try {
      await eventsData.deleteItem(item.id);
      toast.success("Event item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  const handleEventDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingList(true);
    try {
      if (eventsDialog.mode === "create") {
        await eventsData.createItem(listFormData);
        toast.success("Event item created successfully");
      } else if (eventsDialog.data?.id) {
        await eventsData.updateItem(eventsDialog.data.id, listFormData);
        toast.success("Event item updated successfully");
      }
      eventsDialog.close();
      setListFormData({});
    } catch (error: any) {
      toast.error(error.message || "Failed to save event");
    } finally {
      setSubmittingList(false);
    }
  };

  // Menu items for sections
  const sections = [
    { id: 'hero', label: 'Hero Section', icon: Info },
    { id: 'austrc', label: 'About ARC', icon: Sparkles },
    { id: 'mission-vision', label: 'Mission & Vision', icon: Target },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'what-we-do', label: 'What We Do', icon: Sparkles },
    { id: 'events', label: 'Events & Competitions', icon: Trophy },
  ] as const;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-full">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${textColor} mb-2`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>About Us Page Management</h1>
        <p className={`${mutedText} text-sm sm:text-base`}>Manage hero banners, copy content, mission declarations, gallery items, focus activities, and highlighted competitions.</p>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeTab === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive 
                  ? 'bg-[#3a5a40] text-white shadow-sm scale-[1.01]' 
                  : isDark
                    ? 'bg-[#121217] text-[#9A9A8E] hover:text-[#F5F5F0] border border-white/5'
                    : 'bg-white text-[#4a4a40] hover:text-[#1a1a14] border border-black/5'
              }`}
            >
              <Icon size={16} />
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* RENDER ACTIVE TAB */}
      {loadingSingletons ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#588157]" />
          <p className={mutedText}>Loading page content...</p>
        </div>
      ) : (
        <div className="min-w-0">
          {/* TAB 1: HERO */}
          {activeTab === 'hero' && (
            <form onSubmit={handleSaveHero} className={`p-6 rounded-2xl border ${cardBg} space-y-6 max-w-4xl`}>
              <h3 className={`text-xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Hero Banner Copy</h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>Main Heading</label>
                  <textarea
                    rows={2}
                    value={hero.heading}
                    onChange={(e) => setHero({ ...hero, heading: e.target.value })}
                    className={inputStyle}
                    required
                    placeholder="Enter main heading"
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>Introductory Description</label>
                  <textarea
                    rows={4}
                    value={hero.description}
                    onChange={(e) => setHero({ ...hero, description: e.target.value })}
                    className={inputStyle}
                    required
                    placeholder="Enter short description text"
                  />
                </div>
                <ImageUploadInput
                  label="Hero Background Image"
                  value={hero.imageUrl}
                  onChange={(val) => setHero({ ...hero, imageUrl: val })}
                />
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingSingle}
                  className="px-6 py-2.5 rounded-lg bg-[#3a5a40] hover:bg-[#344e41] text-white font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {savingSingle ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Hero Section"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ABOUT ARC */}
          {activeTab === 'austrc' && (
            <form onSubmit={handleSaveAustrc} className={`p-6 rounded-2xl border ${cardBg} space-y-6 max-w-4xl`}>
              <h3 className={`text-xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>About AUST Rover Challenge Details</h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>Title Header</label>
                  <input
                    type="text"
                    value={austrc.title}
                    onChange={(e) => setAustrc({ ...austrc, title: e.target.value })}
                    className={inputStyle}
                    required
                    placeholder="Where Bangladesh's Best Engineers Compete."
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>Description Content</label>
                  <textarea
                    rows={6}
                    value={austrc.content}
                    onChange={(e) => setAustrc({ ...austrc, content: e.target.value })}
                    className={inputStyle}
                    required
                    placeholder="Explain the event's purpose, background, and significance."
                  />
                </div>
                <ImageUploadInput
                  label="Editorial Section Image"
                  value={austrc.imageUrl}
                  onChange={(val) => setAustrc({ ...austrc, imageUrl: val })}
                />
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingSingle}
                  className="px-6 py-2.5 rounded-lg bg-[#3a5a40] hover:bg-[#344e41] text-white font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {savingSingle ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save ARC Details"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: MISSION & VISION */}
          {activeTab === 'mission-vision' && (
            <form onSubmit={handleSaveMissionVision} className={`p-6 rounded-2xl border ${cardBg} space-y-6 max-w-4xl`}>
              <h3 className={`text-xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Mission & Vision Statements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mission */}
                <div className="space-y-4">
                  <h4 className={`text-lg font-bold ${textColor} flex items-center gap-2`}><Target size={18} className="text-[#588157]" /> Mission</h4>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>Mission Section Title</label>
                    <input
                      type="text"
                      value={missionVision.missionTitle}
                      onChange={(e) => setMissionVision({ ...missionVision, missionTitle: e.target.value })}
                      className={inputStyle}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>Mission Statement</label>
                    <textarea
                      rows={5}
                      value={missionVision.missionDescription}
                      onChange={(e) => setMissionVision({ ...missionVision, missionDescription: e.target.value })}
                      className={inputStyle}
                      required
                      placeholder="To advance robotics..."
                    />
                  </div>
                </div>

                {/* Vision */}
                <div className="space-y-4">
                  <h4 className={`text-lg font-bold ${textColor} flex items-center gap-2`}><Eye size={18} className="text-[#588157]" /> Vision</h4>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>Vision Section Title</label>
                    <input
                      type="text"
                      value={missionVision.visionTitle}
                      onChange={(e) => setMissionVision({ ...missionVision, visionTitle: e.target.value })}
                      className={inputStyle}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>Vision Statement</label>
                    <textarea
                      rows={5}
                      value={missionVision.visionDescription}
                      onChange={(e) => setMissionVision({ ...missionVision, visionDescription: e.target.value })}
                      className={inputStyle}
                      required
                      placeholder="To build strong collaborations..."
                    />
                  </div>
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingSingle}
                  className="px-6 py-2.5 rounded-lg bg-[#3a5a40] hover:bg-[#344e41] text-white font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {savingSingle ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Statements"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <PageHeader
                title="Gallery Items"
                subtitle={`Manage ${galleryData.data.length} carousel pictures`}
                actionButton={{
                  label: "Add Gallery Item",
                  onClick: () => {
                    galleryDialog.open("create");
                    setListFormData({ title: '', description: '', imageUrl: '', displayOrder: galleryData.data.length });
                  },
                }}
              />
              <DataTable<GalleryItem>
                columns={galleryColumns}
                data={galleryData.data}
                loading={galleryData.loading}
                onEdit={handleEditGallery}
                onDelete={handleDeleteGallery}
              />
              <CreateEditDialog
                isOpen={galleryDialog.isOpen}
                title={galleryDialog.mode === "create" ? "Add Gallery Image" : "Edit Gallery Image Details"}
                onClose={galleryDialog.close}
                onSubmit={handleGalleryDialogSubmit}
                isLoading={submittingList}
              >
                <div className="space-y-4">
                  <FormField
                    label="Image Title"
                    name="title"
                    required
                    value={listFormData.title || ""}
                    onChange={(e) => setListFormData({ ...listFormData, title: e.target.value })}
                    placeholder="Enter short title label"
                  />
                  <TextareaField
                    label="Description"
                    name="description"
                    value={listFormData.description || ""}
                    onChange={(e) => setListFormData({ ...listFormData, description: e.target.value })}
                    placeholder="Explain/comment on this event slide..."
                  />
                  <FormField
                    label="Display Order (priority)"
                    name="displayOrder"
                    type="number"
                    value={listFormData.displayOrder || 0}
                    onChange={(e) => setListFormData({ ...listFormData, displayOrder: parseInt(e.target.value) })}
                  />
                  <ImageUploadInput
                    label="Slide Image"
                    value={listFormData.imageUrl || ""}
                    onChange={(val) => setListFormData({ ...listFormData, imageUrl: val })}
                  />
                </div>
              </CreateEditDialog>
            </div>
          )}

          {/* TAB 5: WHAT WE DO */}
          {activeTab === 'what-we-do' && (
            <div className="space-y-6">
              <PageHeader
                title="Activities & Objectives"
                subtitle={`Manage ${whatWeDoData.data.length} focus topics`}
                actionButton={{
                  label: "Add Activity",
                  onClick: () => {
                    whatWeDoDialog.open("create");
                    setListFormData({ title: '', description: '', icon: 'Lightbulb', displayOrder: whatWeDoData.data.length });
                  },
                }}
              />
              <DataTable<WhatWeDoItem>
                columns={whatWeDoColumns}
                data={whatWeDoData.data}
                loading={whatWeDoData.loading}
                onEdit={handleEditWhatWeDo}
                onDelete={handleDeleteWhatWeDo}
              />
              <CreateEditDialog
                isOpen={whatWeDoDialog.isOpen}
                title={whatWeDoDialog.mode === "create" ? "Add Focus Activity" : "Edit Activity Details"}
                onClose={whatWeDoDialog.close}
                onSubmit={handleWhatWeDoDialogSubmit}
                isLoading={submittingList}
              >
                <div className="space-y-4">
                  <FormField
                    label="Activity Title"
                    name="title"
                    required
                    value={listFormData.title || ""}
                    onChange={(e) => setListFormData({ ...listFormData, title: e.target.value })}
                    placeholder="Innovative Development..."
                  />
                  <TextareaField
                    label="Brief Description"
                    name="description"
                    required
                    value={listFormData.description || ""}
                    onChange={(e) => setListFormData({ ...listFormData, description: e.target.value })}
                    placeholder="What does this activity focus on?"
                  />
                  <SelectField
                    label="Lucide Icon"
                    name="icon"
                    value={listFormData.icon || "HelpCircle"}
                    onChange={(val) => setListFormData({ ...listFormData, icon: val })}
                    options={[
                      { label: "💡 Lightbulb", value: "Lightbulb" },
                      { label: "🎓 Graduation Cap", value: "GraduationCap" },
                      { label: "💬 Message Bubble", value: "MessageSquare" },
                      { label: "👥 Users Group", value: "Users" },
                      { label: "📄 Document Text", value: "FileText" },
                      { label: "⚙️ Processor Chip", value: "Cpu" },
                      { label: "🎯 Target", value: "Target" },
                      { label: "⚡ Sparkle/Zap", value: "Zap" },
                      { label: "🏆 Trophy", value: "Trophy" },
                      { label: "🥇 Award badge", value: "Award" },
                      { label: "🌐 Globe", value: "Globe" },
                    ]}
                  />
                  <FormField
                    label="Display Order (priority)"
                    name="displayOrder"
                    type="number"
                    value={listFormData.displayOrder || 0}
                    onChange={(e) => setListFormData({ ...listFormData, displayOrder: parseInt(e.target.value) })}
                  />
                </div>
              </CreateEditDialog>
            </div>
          )}

          {/* TAB 6: EVENTS & COMPETITIONS */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <PageHeader
                title="Current & Past Events"
                subtitle={`Manage ${eventsData.data.length} events`}
                actionButton={{
                  label: "Add Event Showcase",
                  onClick: () => {
                    eventsDialog.open("create");
                    setListFormData({ title: '', tag: 'Championship', badge: 'Achievement', description: '', date: '', location: '', imageUrl: '', displayOrder: eventsData.data.length });
                  },
                }}
              />
              <DataTable<EventItem>
                columns={eventsColumns}
                data={eventsData.data}
                loading={eventsData.loading}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
              <CreateEditDialog
                isOpen={eventsDialog.isOpen}
                title={eventsDialog.mode === "create" ? "Add Event Showcase" : "Edit Event Details"}
                onClose={eventsDialog.close}
                onSubmit={handleEventDialogSubmit}
                isLoading={submittingList}
              >
                <div className="space-y-4">
                  <FormField
                    label="Event Title"
                    name="title"
                    required
                    value={listFormData.title || ""}
                    onChange={(e) => setListFormData({ ...listFormData, title: e.target.value })}
                    placeholder="AUST ROVER CHALLENGE 2.0"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <SelectField
                      label="Top Category Tag"
                      name="tag"
                      value={listFormData.tag || "Championship"}
                      onChange={(val) => setListFormData({ ...listFormData, tag: val })}
                      options={[
                        { label: "Championship", value: "Championship" },
                        { label: "Intra Competition", value: "Intra Competition" },
                        { label: "Exhibition", value: "Exhibition" },
                        { label: "Achievement", value: "Achievement" },
                        { label: "Research", value: "Research" },
                        { label: "Dual Victory", value: "Dual Victory" },
                      ]}
                    />
                    <SelectField
                      label="Bottom Badge Status"
                      name="badge"
                      value={listFormData.badge || "Achievement"}
                      onChange={(val) => setListFormData({ ...listFormData, badge: val })}
                      options={[
                        { label: "🏆 Achievement", value: "Achievement" },
                        { label: "✓ Participated", value: "Participated" },
                      ]}
                    />
                  </div>
                  <TextareaField
                    label="Event Description"
                    name="description"
                    required
                    value={listFormData.description || ""}
                    onChange={(e) => setListFormData({ ...listFormData, description: e.target.value })}
                    placeholder="Short summary of event highlights..."
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Date Description"
                      name="date"
                      value={listFormData.date || ""}
                      onChange={(e) => setListFormData({ ...listFormData, date: e.target.value })}
                      placeholder="e.g. July 12-13, 2025"
                    />
                    <FormField
                      label="Venue / Location"
                      name="location"
                      value={listFormData.location || ""}
                      onChange={(e) => setListFormData({ ...listFormData, location: e.target.value })}
                      placeholder="e.g. AUST Campus"
                    />
                  </div>
                  <FormField
                    label="Display Order (priority)"
                    name="displayOrder"
                    type="number"
                    value={listFormData.displayOrder || 0}
                    onChange={(e) => setListFormData({ ...listFormData, displayOrder: parseInt(e.target.value) })}
                  />
                  <ImageUploadInput
                    label="Event Banner Image"
                    value={listFormData.imageUrl || ""}
                    onChange={(val) => setListFormData({ ...listFormData, imageUrl: val })}
                  />
                </div>
              </CreateEditDialog>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
