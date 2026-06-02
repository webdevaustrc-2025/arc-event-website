"use client";
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Calendar, Clock, MapPin, Edit2, Trash2, Plus, GripVertical, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ScheduleItem {
  id: number;
  segmentId: number | null;
  title: string;
  startTime: string;
  endTime: string;
  venue: string;
  displayOrder: number;
  segment: { id: number; name: string } | null;
}

interface SegmentItem {
  id: number;
  name: string;
}

export default function AdminSchedulePage() {
  const { theme } = useTheme();
  const [events, setEvents] = useState<ScheduleItem[]>([]);
  const [segments, setSegments] = useState<SegmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleItem | null>(null);

  const [form, setForm] = useState({
    title: '',
    startTime: '',
    endTime: '',
    venue: '',
    segmentId: null as number | null,
    displayOrder: 0,
  });

  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#111116] border-white/[0.07]' : 'bg-white border-black/[0.08]';
  const eventBg = isDark ? 'bg-[#18181f] border-white/[0.07] hover:bg-[#111116]' : 'bg-[#F0EDE6] border-black/[0.06] hover:bg-white hover:shadow-[0_2px_12px_rgba(0,0,0,0.12)]';
  const textColor = isDark ? 'text-[#F5F5F0]' : 'text-[#1a1a14]';
  const mutedText = isDark ? 'text-[#9A9A8E]' : 'text-[#4a4a40]';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [scheduleRes, segmentsRes] = await Promise.all([
        fetch('/api/admin/schedule'),
        fetch('/api/segments'),
      ]);

      if (!scheduleRes.ok || !segmentsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const scheduleData = await scheduleRes.json();
      const segmentsData = await segmentsRes.json();

      setEvents(scheduleData);
      setSegments(segmentsData);
    } catch (error) {
      console.error(error);
      toast.error('Could not load schedule or segments');
    } finally {
      setLoading(false);
    }
  };

  const toDatetimeLocal = (dateStr: string) => {
    const d = new Date(dateStr);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const formatTimeRange = (startStr: string, endStr: string) => {
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    };
    const s = new Date(startStr);
    const e = new Date(endStr);
    return `${formatTime(s)} - ${formatTime(e)}`;
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setForm({
      title: '',
      startTime: '',
      endTime: '',
      venue: '',
      segmentId: null,
      displayOrder: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (event: ScheduleItem) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      startTime: toDatetimeLocal(event.startTime),
      endTime: toDatetimeLocal(event.endTime),
      venue: event.venue,
      segmentId: event.segmentId,
      displayOrder: event.displayOrder,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.startTime || !form.endTime) {
      toast.error('Please specify both start and end times');
      return;
    }

    if (new Date(form.startTime) > new Date(form.endTime)) {
      toast.error('Start time must be before end time');
      return;
    }

    try {
      setSaving(true);
      const url = editingEvent 
        ? `/api/admin/schedule/${editingEvent.id}`
        : '/api/admin/schedule';
      
      const method = editingEvent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          startTime: new Date(form.startTime).toISOString(),
          endTime: new Date(form.endTime).toISOString(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Operation failed');
      }

      toast.success(editingEvent ? 'Event updated successfully' : 'Event created successfully');
      closeModal();
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this event from the schedule?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/schedule/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to delete');
      }

      toast.success('Event removed from schedule');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete event');
    }
  };

  // Group events by date dynamically
  const uniqueDates = Array.from(new Set(events.map(e => new Date(e.startTime).toDateString()))).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const dayGroups = uniqueDates.map((dateStr, index) => {
    const dayEvents = events.filter(e => new Date(e.startTime).toDateString() === dateStr);
    return {
      day: `Day ${index + 1}`,
      date: new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      events: dayEvents
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${textColor} mb-2`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Schedule Manager</h1>
          <p className={`${mutedText} text-lg`}>Update event timings, locations, and manage the daily agenda.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex items-center gap-2 bg-[#3a5a40] text-white hover:bg-[#344e41]"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#588157]" />
          <p className={mutedText}>Loading schedule...</p>
        </div>
      ) : dayGroups.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border ${cardBg}`}>
          <Calendar className={`w-12 h-12 mx-auto ${mutedText} mb-4 opacity-50`} />
          <h3 className={`text-xl font-bold ${textColor} mb-2`}>No Events Scheduled</h3>
          <p className={`${mutedText} mb-6`}>Start by adding a new event to the ARC 3.0 event timeline.</p>
          <button 
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl font-semibold transition-all bg-[#3a5a40] text-white hover:bg-[#344e41]"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {dayGroups.map((dayGroup, i) => (
            <div key={i} className={`p-6 rounded-2xl border ${cardBg}`}>
              <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                <div>
                  <h2 className={`text-2xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{dayGroup.day}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className={`w-4 h-4 ${mutedText}`} />
                    <span className={mutedText}>{dayGroup.date}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {dayGroup.events.map((event) => (
                  <div key={event.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${eventBg} group`}>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Time */}
                      <div className="md:col-span-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#588157]" />
                        <span className={`font-medium ${textColor} text-sm`}>
                          {formatTimeRange(event.startTime, event.endTime)}
                        </span>
                      </div>
                      
                      {/* Event Title */}
                      <div className="md:col-span-5">
                        <h4 className={`font-semibold ${textColor}`}>{event.title}</h4>
                        {event.segment ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border mt-2 text-orange-400 bg-orange-400/10 border-orange-400/20">
                            {event.segment.name}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border mt-2 text-blue-400 bg-blue-400/10 border-blue-400/20">
                            General Event
                          </span>
                        )}
                      </div>

                      {/* Location */}
                      <div className="md:col-span-2 flex items-center gap-2">
                        <MapPin className={`w-4 h-4 ${mutedText}`} />
                        <span className={mutedText}>{event.venue}</span>
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-2 flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(event)}
                          className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(event.id)}
                          className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111116] border-white/10' : 'bg-white border-black/10'} max-w-lg w-full space-y-6 shadow-2xl transform scale-100 transition-all`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {editingEvent ? 'Edit Schedule Event' : 'Add Schedule Event'}
              </h3>
              <button 
                onClick={closeModal}
                className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]/40 ${
                    isDark ? 'bg-[#18181f] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-black'
                  }`}
                  placeholder="e.g. Opening Ceremony"
                />
              </div>

              {/* Segment */}
              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Segment / Event Type</label>
                <select
                  value={form.segmentId || ""}
                  onChange={(e) => setForm({ ...form, segmentId: e.target.value ? parseInt(e.target.value, 10) : null })}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]/40 ${
                    isDark ? 'bg-[#18181f] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-black'
                  }`}
                >
                  <option value="">General Event (No Segment)</option>
                  {segments.map((seg) => (
                    <option key={seg.id} value={seg.id}>
                      {seg.name} (Segment)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Time */}
                <div className="space-y-1">
                  <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Start Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]/40 ${
                      isDark ? 'bg-[#18181f] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-black'
                    }`}
                  />
                </div>

                {/* End Time */}
                <div className="space-y-1">
                  <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>End Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]/40 ${
                      isDark ? 'bg-[#18181f] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-black'
                    }`}
                  />
                </div>
              </div>

              {/* Venue */}
              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Venue / Location</label>
                <input
                  type="text"
                  required
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]/40 ${
                    isDark ? 'bg-[#18181f] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-black'
                  }`}
                  placeholder="e.g. Main Auditorium"
                />
              </div>

              {/* Display Order */}
              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Display Order (Sort weight)</label>
                <input
                  type="number"
                  required
                  value={form.displayOrder}
                  onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value, 10) || 0 })}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]/40 ${
                    isDark ? 'bg-[#18181f] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-black'
                  }`}
                  placeholder="0"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    isDark ? 'border-white/10 hover:bg-white/5 text-gray-300' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-md flex items-center gap-2 bg-[#3a5a40] text-white hover:bg-[#344e41] disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
