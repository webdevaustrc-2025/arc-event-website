"use client";
import React, { useState, useEffect } from 'react';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { Plus, Edit2, Trash2, Users, Trophy, Clock, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface Segment {
  id: number;
  name: string;
  description: string;
  rules: string;
  prizePool: string;
  category: string;
  type: string;
  difficulty: string;
  teamSize: string;
  fee: string;
  deadline: string;
  location: string;
  scheduleText: string;
  ruleBookUrl?: string;
  highlights: string[];
  status: string;
  imageUrl?: string;
}

export default function AdminSegmentsPage() {
  const { isDark } = useResolvedTheme();
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    rules: '',
    prizePool: '',
    category: 'General',
    type: 'Team',
    difficulty: 'Medium',
    teamSize: '',
    fee: '',
    deadline: '',
    location: '',
    scheduleText: '',
    ruleBookUrl: '',
    highlights: '',
    status: 'active',
    imageUrl: '',
  });

  const cardBg = isDark ? 'bg-[#111116] border-white/[0.07] hover:bg-[#111116]' : 'bg-white border-black/[0.08] hover:shadow-[0_2px_12px_rgba(0,0,0,0.12)]';
  const textColor = isDark ? 'text-[#F5F5F0]' : 'text-[#1a1a14]';
  const mutedText = isDark ? 'text-[#9A9A8E]' : 'text-[#4a4a40]';

  useEffect(() => {
    fetchSegments();
  }, []);

  async function fetchSegments() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/segments');
      const data = await response.json();
      
      if (data && data.success && data.data && Array.isArray(data.data.items)) {
        setSegments(data.data.items);
      } else if (Array.isArray(data)) {
        setSegments(data);
      } else {
        setSegments([]);
      }
    } catch (error) {
      console.error('Failed to fetch segments:', error);
      toast.error('Failed to load segments');
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditingSegment(null);
    setForm({
      name: '',
      description: '',
      rules: '',
      prizePool: '',
      category: 'General',
      type: 'Team',
      difficulty: 'Medium',
      teamSize: '',
      fee: '',
      deadline: '',
      location: '',
      scheduleText: '',
      ruleBookUrl: '',
      highlights: '',
      status: 'active',
      imageUrl: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (segment: Segment) => {
    setEditingSegment(segment);
    setForm({
      name: segment.name,
      description: segment.description,
      rules: segment.rules,
      prizePool: segment.prizePool,
      category: segment.category || 'General',
      type: segment.type || 'Team',
      difficulty: segment.difficulty || 'Medium',
      teamSize: segment.teamSize || '',
      fee: segment.fee || '',
      deadline: segment.deadline || '',
      location: segment.location || '',
      scheduleText: segment.scheduleText || '',
      ruleBookUrl: segment.ruleBookUrl || '',
      highlights: (segment.highlights || []).join('\n'),
      status: segment.status,
      imageUrl: segment.imageUrl || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSegment(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description) {
      toast.error('Name and description are required');
      return;
    }

    try {
      setSaving(true);
      const url = editingSegment 
        ? `/api/admin/segments/${editingSegment.id}`
        : '/api/admin/segments';
      
      const method = editingSegment ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          highlights: form.highlights
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Operation failed');
      }

      toast.success(editingSegment ? 'Segment updated successfully' : 'Segment created successfully');
      closeModal();
      fetchSegments();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to save segment');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this segment?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/segments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete');
      }

      toast.success('Segment deleted successfully');
      fetchSegments();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete segment');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 suppressHydrationWarning className={`text-3xl font-bold ${textColor} mb-2`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Segments & Events</h1>
          <p suppressHydrationWarning className={`${mutedText} text-lg`}>Manage the competitions and special events of ARC 3.0.</p>
        </div>
        <button 
          onClick={openAddModal}
          className={`px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex items-center gap-2 bg-[#3a5a40] text-white hover:bg-[#344e41]`}>
          <Plus className="w-4 h-4" />
          Create Segment
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#588157]" />
          <p className={mutedText}>Loading segments...</p>
        </div>
      ) : segments.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border ${cardBg}`}>
          <h3 className={`text-xl font-bold ${textColor} mb-2`}>No Segments Yet</h3>
          <p className={`${mutedText} mb-6`}>Create your first competition segment to get started.</p>
          <button 
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl font-semibold transition-all bg-[#3a5a40] text-white hover:bg-[#344e41]"
          >
            Create First Segment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {segments.map((segment) => (
            <div key={segment.id} className={`group relative p-6 rounded-2xl border transition-all duration-300 ${cardBg} overflow-hidden flex flex-col h-full`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#588157]/20 to-[#a3b18a]/20 blur-3xl rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity" />

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{segment.name}</h3>
                  <p className={`text-xs ${mutedText} mt-1 capitalize`}>{segment.status}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(segment)}
                    className={`p-1.5 rounded-lg transition-colors ${isDark ? 'bg-white/5 hover:bg-white/20 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(segment.id)}
                    className={`p-1.5 rounded-lg transition-colors ${isDark ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className={`text-sm ${mutedText} mb-4 line-clamp-2 relative z-10`}>{segment.description}</p>

              <div className="space-y-2 mb-4 relative z-10">
                <div className="flex justify-between text-sm">
                  <span className={mutedText}>Prize Pool:</span>
                  <span className={`font-semibold ${textColor}`}>{segment.prizePool}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={mutedText}>Category:</span>
                  <span className={`font-semibold ${textColor}`}>{segment.category}</span>
                </div>
              </div>

              <div className={`text-xs ${mutedText} mb-4 p-3 rounded-lg relative z-10`} style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                <p className="line-clamp-2">{segment.rules || 'No rules specified'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl ${cardBg} max-w-md w-full max-h-screen overflow-y-auto`}>
            <div className={`p-6 flex justify-between items-center border-b ${isDark ? 'border-white/10' : 'border-black/10'}`}>
              <h2 className={`text-xl font-bold ${textColor}`}>{editingSegment ? 'Edit Segment' : 'Create Segment'}</h2>
              <button 
                onClick={closeModal}
                className={`p-1 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>Segment Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:border-[#588157] ${isDark ? 'bg-[#18181f] border-white/10 text-[#F5F5F0]' : 'bg-white border-black/10 text-[#1a1a14]'}`}
                  placeholder="Enter segment name"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:border-[#588157] ${isDark ? 'bg-[#18181f] border-white/10 text-[#F5F5F0]' : 'bg-white border-black/10 text-[#1a1a14]'}`}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>Rules & Requirements</label>
                <textarea
                  value={form.rules}
                  onChange={(e) => setForm({ ...form, rules: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:border-[#588157] ${isDark ? 'bg-[#18181f] border-white/10 text-[#F5F5F0]' : 'bg-white border-black/10 text-[#1a1a14]'}`}
                  placeholder="Enter rules"
                  rows={3}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>Prize Pool</label>
                <input
                  type="text"
                  value={form.prizePool}
                  onChange={(e) => setForm({ ...form, prizePool: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:border-[#588157] ${isDark ? 'bg-[#18181f] border-white/10 text-[#F5F5F0]' : 'bg-white border-black/10 text-[#1a1a14]'}`}
                  placeholder="e.g., ৳50,000"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:border-[#588157] ${isDark ? 'bg-[#18181f] border-white/10 text-[#F5F5F0]' : 'bg-white border-black/10 text-[#1a1a14]'}`}
                    placeholder="Manual Control"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:border-[#588157] ${isDark ? 'bg-[#18181f] border-white/10 text-[#F5F5F0]' : 'bg-white border-black/10 text-[#1a1a14]'}`}>
                    <option value="Team">Team</option>
                    <option value="Solo">Solo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:border-[#588157] ${isDark ? 'bg-[#18181f] border-white/10 text-[#F5F5F0]' : 'bg-white border-black/10 text-[#1a1a14]'}`}>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Extreme">Extreme</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>Team Size</label>
                  <input
                    type="text"
                    value={form.teamSize}
                    onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:border-[#588157] ${isDark ? 'bg-[#18181f] border-white/10 text-[#F5F5F0]' : 'bg-white border-black/10 text-[#1a1a14]'}`}
                    placeholder="Max 4 members"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>Fee</label>
                  <input
                    type="text"
                    value={form.fee}
                    onChange={(e) => setForm({ ...form, fee: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:border-[#588157] ${isDark ? 'bg-[#18181f] border-white/10 text-[#F5F5F0]' : 'bg-white border-black/10 text-[#1a1a14]'}`}
                    placeholder="৳500"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>Deadline</label>
                  <input
                    type="text"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:border-[#588157] ${isDark ? 'bg-[#18181f] border-white/10 text-[#F5F5F0]' : 'bg-white border-black/10 text-[#1a1a14]'}`}
                    placeholder="May 15, 2026"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>Schedule Text</label>
                <input
                  type="text"
                  value={form.scheduleText}
                  onChange={(e) => setForm({ ...form, scheduleText: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:border-[#588157] ${isDark ? 'bg-[#18181f] border-white/10 text-[#F5F5F0]' : 'bg-white border-black/10 text-[#1a1a14]'}`}
                  placeholder="Day 1 • May 20, 2026 • 10:00 AM"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:border-[#588157] ${isDark ? 'bg-[#18181f] border-white/10 text-[#F5F5F0]' : 'bg-white border-black/10 text-[#1a1a14]'}`}
                  placeholder="Arena A, Main Hall"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>Rule Book URL (Optional)</label>
                <input
                  type="url"
                  value={form.ruleBookUrl}
                  onChange={(e) => setForm({ ...form, ruleBookUrl: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:border-[#588157] ${isDark ? 'bg-[#18181f] border-white/10 text-[#F5F5F0]' : 'bg-white border-black/10 text-[#1a1a14]'}`}
                  placeholder="https://example.com/rulebook.pdf"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>Highlights</label>
                <textarea
                  value={form.highlights}
                  onChange={(e) => setForm({ ...form, highlights: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:border-[#588157] ${isDark ? 'bg-[#18181f] border-white/10 text-[#F5F5F0]' : 'bg-white border-black/10 text-[#1a1a14]'}`}
                  placeholder="One highlight per line"
                  rows={4}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:border-[#588157] ${isDark ? 'bg-[#18181f] border-white/10 text-[#F5F5F0]' : 'bg-white border-black/10 text-[#1a1a14]'}`}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>Image URL (Optional)</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:border-[#588157] ${isDark ? 'bg-[#18181f] border-white/10 text-[#F5F5F0]' : 'bg-white border-black/10 text-[#1a1a14]'}`}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-[#F5F5F0]' : 'bg-black/10 hover:bg-black/20 text-[#1a1a14]'}`}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all bg-[#3a5a40] text-white hover:bg-[#344e41] disabled:opacity-50 flex items-center justify-center gap-2`}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editingSegment ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
