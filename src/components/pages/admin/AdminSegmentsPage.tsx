"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { 
  Plus, Edit2, Trash2, Users, Trophy, Clock, Loader2, MapPin, 
  BookOpen, Calendar, HelpCircle, Layers, ShieldAlert, Award, AlignLeft, Info,
  UploadCloud, FileText, X
} from 'lucide-react';
import { toast } from 'sonner';
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

interface Segment {
  id: number;
  name: string;
  description: string;
  rules: string;
  prizePool: string;
  status: string;
  imageUrl?: string | null;
  category: string;
  deadline: string;
  difficulty: string;
  fee: string;
  highlights: string[];
  location: string;
  ruleBookUrl?: string | null;
  scheduleText: string;
  teamSize: string;
  type: string;
  _count?: {
    registrations: number;
  };
}

const INITIAL_FORM = {
  name: '',
  description: '',
  rules: '',
  prizePool: '',
  status: 'active',
  imageUrl: '',
  category: 'General',
  deadline: 'TBA',
  difficulty: 'Medium',
  fee: 'TBA',
  highlights: '',
  location: 'TBA',
  ruleBookUrl: '',
  scheduleText: 'TBA',
  teamSize: 'TBA',
  type: 'Team',
};

// Cycle through premium gradients for card backgrounds to match the design system
const getGradientColor = (id: number) => {
  const gradients = [
    'from-orange-500/20 to-red-500/20',
    'from-blue-500/20 to-cyan-500/20',
    'from-purple-500/20 to-pink-500/20',
    'from-[#588157]/20 to-[#a3b18a]/20',
    'from-amber-500/20 to-yellow-500/20',
    'from-teal-500/20 to-emerald-500/20',
    'from-indigo-500/20 to-violet-500/20'
  ];
  return gradients[id % gradients.length];
};

interface FileDropZoneProps {
  label: string;
  accept: string;
  value: string;
  onChange: (url: string) => void;
  isDark: boolean;
  type: 'image' | 'pdf';
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ label, accept, value, onChange, isDark, type }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      if (data.success && data.url) {
        onChange(data.url);
        toast.success(`${file.name} uploaded successfully!`);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Could not upload file');
    } finally {
      setUploading(false);
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (type === 'image' && !file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      if (type === 'pdf' && file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      uploadFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const getFileName = (url: string) => {
    if (!url) return '';
    const parts = url.split('/');
    const name = parts[parts.length - 1];
    return name.replace(/^\d+_/, '');
  };

  const dropZoneBg = isDragActive
    ? (isDark ? 'bg-[#588157]/10 border-[#588157]' : 'bg-[#3a5a40]/5 border-[#3a5a40]')
    : (isDark ? 'bg-[#18181f] border-white/10 hover:border-white/20' : 'bg-gray-50 border-black/10 hover:border-black/20');

  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const mutedText = isDark ? 'text-[#9A9A8E]' : 'text-[#4a4a40]';

  return (
    <div className="space-y-2">
      <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>{label}</label>
      
      {value ? (
        <div className={`flex items-center justify-between p-4 rounded-xl border ${
          isDark ? 'bg-[#18181f]/80 border-white/10' : 'bg-white border-black/10'
        } relative overflow-hidden group`}>
          <div className="flex items-center gap-3 min-w-0">
            {type === 'image' ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-black/20 flex items-center justify-center">
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className={`w-12 h-12 rounded-lg border flex items-center justify-center shrink-0 ${
                isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600'
              }`}>
                <FileText className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <p className={`text-sm font-semibold truncate ${textColor}`}>{getFileName(value)}</p>
              <p className={`text-xs ${mutedText} truncate`}>Successfully uploaded</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1.5 rounded-lg transition-colors text-red-500 hover:bg-red-500/10 shrink-0"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dropZoneBg} min-h-[120px] flex flex-col items-center justify-center`}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={uploading}
          />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-[#588157]" />
              <p className={`text-sm font-medium ${textColor}`}>Uploading file...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <UploadCloud className={`w-8 h-8 ${isDragActive ? 'text-[#588157]' : mutedText} transition-colors`} />
              <p className={`text-sm font-semibold ${textColor}`}>
                {isDragActive ? 'Drop file here' : 'Drag & drop or click to upload'}
              </p>
              <p className={`text-xs ${mutedText}`}>
                {type === 'image' ? 'PNG, JPG, JPEG, GIF up to 5MB' : 'PDF rulebook file up to 10MB'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function AdminSegmentsPage() {
  const { isDark } = useResolvedTheme();
  
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Segment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Segment | null>(null);
  
  const [form, setForm] = useState(INITIAL_FORM);

  const cardBg = isDark 
    ? 'bg-[#111116] border-white/[0.07] hover:bg-[#111116]' 
    : 'bg-white border-black/[0.08] hover:shadow-[0_2px_12px_rgba(0,0,0,0.12)]';
  const textColor = isDark ? 'text-[#F5F5F0]' : 'text-[#1a1a14]';
  const mutedText = isDark ? 'text-[#9A9A8E]' : 'text-[#4a4a40]';
  const inputClass = isDark
    ? 'bg-[#18181f] border-white/10 text-white placeholder-white/30 focus:border-white/30'
    : 'bg-white border-black/10 text-gray-900 placeholder-gray-400 focus:border-black/30';

  const fetchSegments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/segments');
      if (!res.ok) {
        throw new Error('Failed to fetch segments');
      }
      const data = await res.json();
      setSegments(data);
    } catch (error) {
      console.error(error);
      toast.error('Could not load segments from database');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSegments();
  }, [fetchSegments]);

  const openCreateModal = () => {
    setEditTarget(null);
    setForm(INITIAL_FORM);
    setDialogOpen(true);
  };

  const openEditModal = (segment: Segment) => {
    setEditTarget(segment);
    setForm({
      name: segment.name,
      description: segment.description,
      rules: segment.rules,
      prizePool: segment.prizePool,
      status: segment.status,
      imageUrl: segment.imageUrl || '',
      category: segment.category,
      deadline: segment.deadline,
      difficulty: segment.difficulty,
      fee: segment.fee,
      highlights: segment.highlights ? segment.highlights.join(', ') : '',
      location: segment.location,
      ruleBookUrl: segment.ruleBookUrl || '',
      scheduleText: segment.scheduleText,
      teamSize: segment.teamSize,
      type: segment.type,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim() || !form.rules.trim() || !form.prizePool.trim()) {
      toast.error('Please fill in all required fields (Name, Prize Pool, Description, Rules)');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        highlights: form.highlights 
          ? form.highlights.split(',').map(h => h.trim()).filter(Boolean) 
          : [],
        imageUrl: form.imageUrl.trim() || null,
        ruleBookUrl: form.ruleBookUrl.trim() || null,
      };

      const url = editTarget ? `/api/admin/segments/${editTarget.id}` : '/api/admin/segments';
      const method = editTarget ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Operation failed');
      }

      toast.success(editTarget ? 'Segment updated successfully' : 'Segment created successfully');
      setDialogOpen(false);
      fetchSegments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save segment');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (segment: Segment) => {
    setDeleteTarget(segment);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/segments/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to delete');
      }

      toast.success('Segment deleted successfully');
      setDeleteOpen(false);
      fetchSegments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete segment');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 w-full max-w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${textColor} mb-2`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Segments & Events</h1>
          <p className={`${mutedText} text-lg`}>Manage the competitions and special events of ARC 3.0.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex items-center gap-2 bg-[#3a5a40] text-white hover:bg-[#344e41]"
        >
          <Plus className="w-4 h-4" />
          Create Segment
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`p-6 rounded-2xl border ${cardBg} animate-pulse h-[340px] flex flex-col justify-between`}>
              <div className="space-y-4">
                <div className={`h-6 rounded w-3/4 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                <div className="space-y-2 mt-4">
                  <div className={`h-4 rounded w-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                  <div className={`h-4 rounded w-5/6 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className={`h-4 rounded w-1/2 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                <div className={`h-4 rounded w-2/3 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
              </div>
            </div>
          ))}
        </div>
      ) : segments.length === 0 ? (
        <div className={`p-16 text-center rounded-2xl border ${cardBg} max-w-3xl mx-auto flex flex-col items-center justify-center space-y-6`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
            <Layers className={`w-10 h-10 ${mutedText} opacity-60`} />
          </div>
          <div className="space-y-2">
            <h3 className={`text-2xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>No Segments Found</h3>
            <p className={`${mutedText} max-w-md`}>
              There are no segments registered in the database. Create a segment to populate the competition page.
            </p>
          </div>
          <button 
            onClick={openCreateModal}
            className="px-6 py-3 rounded-xl font-semibold transition-all bg-[#3a5a40] text-white hover:bg-[#344e41] flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Create Your First Segment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {segments.map((segment) => (
            <div key={segment.id} className={`group relative p-6 rounded-2xl border transition-all duration-300 ${cardBg} overflow-hidden flex flex-col h-full`}>
              {/* Dynamic Gradient Background based on ID */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getGradientColor(segment.id)} blur-3xl rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity`} />

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="pr-4">
                  <span className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-[#a3b18a]' : 'text-[#3a5a40]'} block mb-1`}>
                    {segment.category}
                  </span>
                  <h3 className={`text-xl font-bold ${textColor} line-clamp-1`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {segment.name}
                  </h3>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => openEditModal(segment)}
                    className={`p-1.5 rounded-lg transition-colors ${isDark ? 'bg-white/5 hover:bg-white/20 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                    title="Edit Segment"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => confirmDelete(segment)}
                    className={`p-1.5 rounded-lg transition-colors ${isDark ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'}`}
                    title="Delete Segment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 flex-1 relative z-10 text-sm">
                <p className={`${mutedText} line-clamp-3 mb-4 text-xs leading-relaxed`}>
                  {segment.description}
                </p>

                <div className="flex items-center justify-between border-t border-dashed border-white/10 pt-3">
                  <div className="flex items-center gap-2">
                    <Users className={`w-4 h-4 ${mutedText}`} />
                    <span className={mutedText}>Registrations</span>
                  </div>
                  <span className={`font-semibold ${textColor}`}>{segment._count?.registrations ?? 0} Teams</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className={mutedText}>Prize Pool</span>
                  </div>
                  <span className="font-semibold text-yellow-500">{segment.prizePool}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className={`w-4 h-4 ${mutedText}`} />
                    <span className={mutedText}>Reg Fee</span>
                  </div>
                  <span className={`font-semibold ${textColor}`}>{segment.fee}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${mutedText}`} />
                    <span className={mutedText}>Deadline</span>
                  </div>
                  <span className={`font-semibold ${textColor}`}>{segment.deadline}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${mutedText}`} />
                    <span className={mutedText}>Location</span>
                  </div>
                  <span className={`font-semibold ${textColor}`}>{segment.location}</span>
                </div>
              </div>

              <div className={`mt-6 pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-100'} flex items-center justify-between relative z-10`}>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${
                  segment.status === 'active'
                    ? (isDark ? 'bg-[#588157]/10 text-[#a3b18a] border-[#588157]/20' : 'bg-[#3a5a40]/10 text-[#3a5a40] border-[#3a5a40]/20')
                    : (isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-100 text-red-700 border-red-200')
                }`}>
                  {segment.status}
                </span>
                
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                  {segment.type} ({segment.teamSize})
                </span>
              </div>
            </div>
          ))}

          {/* Add New Card in grid */}
          <button 
            onClick={openCreateModal}
            className={`group flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all duration-300 min-h-[340px] ${
              isDark
                ? 'border-white/20 hover:border-[#588157] hover:bg-[rgba(88,129,87,0.08)] text-[#9A9A8E] hover:text-[#a3b18a]'
                : 'border-black/20 hover:border-[#3a5a40] hover:bg-[rgba(58,90,64,0.06)] text-[#4a4a40] hover:text-[#344e41]'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-current/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <span className="font-semibold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Create New Segment</span>
            <span className="text-sm opacity-70 mt-2">Add a new competition or event</span>
          </button>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={`sm:max-w-2xl max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-[#111116] border-white/10 text-white' : 'bg-white text-gray-900'
        }`}>
          <DialogHeader>
            <DialogTitle className={`${textColor} text-xl font-bold`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {editTarget ? 'Edit Segment' : 'Create New Segment'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Segment Name */}
              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Segment Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Robo Soccer"
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Robotics, Hackathon"
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                />
              </div>

              {/* Type */}
              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                >
                  <option value="Team">Team</option>
                  <option value="Individual">Individual</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Prize Pool */}
              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Prize Pool *</label>
                <input
                  type="text"
                  required
                  value={form.prizePool}
                  onChange={(e) => setForm({ ...form, prizePool: e.target.value })}
                  placeholder="e.g. ৳20,000"
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                />
              </div>

              {/* Registration Fee */}
              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Registration Fee</label>
                <input
                  type="text"
                  value={form.fee}
                  onChange={(e) => setForm({ ...form, fee: e.target.value })}
                  placeholder="e.g. ৳500"
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                />
              </div>

              {/* Team Size */}
              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Team Size / Limit</label>
                <input
                  type="text"
                  value={form.teamSize}
                  onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
                  placeholder="e.g. 3-4 members"
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                />
              </div>

              {/* Difficulty */}
              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Difficulty Level</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Location / Venue</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Arena Alpha, Main Gym"
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                />
              </div>

              {/* Deadline */}
              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Registration Deadline</label>
                <input
                  type="text"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  placeholder="e.g. June 10, 2026"
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                />
              </div>

              {/* Image Upload Zone */}
              <div className="md:col-span-1">
                <FileDropZone
                  label="Segment Banner Image (optional)"
                  accept="image/*"
                  value={form.imageUrl}
                  onChange={(url) => setForm({ ...form, imageUrl: url })}
                  isDark={isDark}
                  type="image"
                />
              </div>

              {/* Rulebook Upload Zone */}
              <div className="md:col-span-1">
                <FileDropZone
                  label="Rulebook PDF Document (optional)"
                  accept="application/pdf"
                  value={form.ruleBookUrl}
                  onChange={(url) => setForm({ ...form, ruleBookUrl: url })}
                  isDark={isDark}
                  type="pdf"
                />
              </div>

              {/* Schedule Text info */}
              <div className="space-y-1 md:col-span-2">
                <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Schedule Summary (Text)</label>
                <input
                  type="text"
                  value={form.scheduleText}
                  onChange={(e) => setForm({ ...form, scheduleText: e.target.value })}
                  placeholder="e.g. Day 1, 10:00 AM - 1:00 PM"
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                />
              </div>

              {/* Highlights */}
              <div className="space-y-1 md:col-span-2">
                <div className="flex items-center gap-1">
                  <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Segment Highlights</label>
                  <span className="text-[10px] text-gray-500">(comma-separated)</span>
                </div>
                <input
                  type="text"
                  value={form.highlights}
                  onChange={(e) => setForm({ ...form, highlights: e.target.value })}
                  placeholder="e.g. High-torque motors, Custom arenas, Live telemetry"
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                />
              </div>

              {/* Description */}
              <div className="space-y-1 md:col-span-2">
                <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the segment details, objectives, and parameters..."
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors resize-none ${inputClass}`}
                />
              </div>

              {/* Rules */}
              <div className="space-y-1 md:col-span-2">
                <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Rules & Regulation Details *</label>
                <textarea
                  required
                  rows={4}
                  value={form.rules}
                  onChange={(e) => setForm({ ...form, rules: e.target.value })}
                  placeholder="1. Robots must fit in 30x30x30cm box.
2. Maximum weight is 3kg.
3. No damaging weapons allowed."
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputClass}`}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <button
                type="button"
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
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#3a5a40] hover:bg-[#344e41] text-white transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? (editTarget ? 'Saving...' : 'Creating...') : (editTarget ? 'Save Changes' : 'Create Segment')}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className={isDark ? 'bg-[#111116] border-white/10 text-white' : 'bg-white text-gray-900'}>
          <AlertDialogHeader>
            <AlertDialogTitle className={`${textColor} text-xl font-bold flex items-center gap-2`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <ShieldAlert className="w-6 h-6 text-red-500" />
              Delete Segment
            </AlertDialogTitle>
            <AlertDialogDescription className={mutedText}>
              Are you sure you want to delete <span className="font-semibold text-red-500">{deleteTarget?.name}</span>? 
              This will remove all segment rules, details, and delete any associated team registrations recursively. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={isDark ? 'bg-white/10 hover:bg-white/20 text-white border-white/10' : ''}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 flex items-center gap-2"
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}