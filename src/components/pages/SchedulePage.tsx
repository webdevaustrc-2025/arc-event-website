"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, MapPin, BadgeAlert, Loader2, Calendar } from 'lucide-react';
import { Link } from '@/lib/router-compat';

interface DatabaseScheduleItem {
  id: number;
  segmentId: number | null;
  title: string;
  day: string;
  startTime: string;
  endTime: string;
  venue: string;
  displayOrder: number;
  segment: { id: number; name: string } | null;
}

export default function SchedulePage({ dbSchedule }: { dbSchedule?: any[] }) {
  const [events, setEvents] = useState<DatabaseScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('Day 1');

  useEffect(() => {
    if (dbSchedule && dbSchedule.length > 0) {
      setEvents(dbSchedule);
      setLoading(false);
      return;
    }

    async function fetchSchedule() {
      try {
        const res = await fetch('/api/schedule');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSchedule();
  }, [dbSchedule]);

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getEventType = (event: DatabaseScheduleItem) => {
    if (event.segment) return 'Segment';
    const titleLower = event.title.toLowerCase();
    if (titleLower.includes('opening')) return 'Opening';
    if (titleLower.includes('closing')) return 'Closing';
    if (titleLower.includes('award')) return 'Award';
    if (titleLower.includes('break') || titleLower.includes('lunch')) return 'Break';
    return 'General';
  };

  const checkIsCurrent = (event: DatabaseScheduleItem) => {
    const now = new Date();
    return now >= new Date(event.startTime) && now <= new Date(event.endTime);
  };

  // Helper to extract day number for sorting
  const getDayNumber = (dayStr: string) => {
    const match = dayStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 999;
  };

  // Group events by database Day column
  const days = Array.from(new Set(events.map(e => e.day || 'Day 1'))).sort((a, b) => getDayNumber(a) - getDayNumber(b));

  const activeDayEvents = events
    .filter(e => (e.day || 'Day 1') === activeDay)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  // Reset activeDay if events load and the current activeDay is invalid (e.g. no longer exists)
  useEffect(() => {
    if (days.length > 0 && !days.includes(activeDay)) {
      setActiveDay(days[0]);
    }
  }, [days, activeDay]);

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="text-gray-400 text-sm tracking-widest mb-6">
            <Link to="/" className="hover:text-white transition-colors">HOME</Link> / SCHEDULE
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 relative z-10" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Event Timeline.
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Plan your visit. {days.length || '3'} days of non-stop robotics action, engineering battles, and innovation showcases.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#588157]" />
            <p className="text-gray-400">Loading timeline...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
            <Calendar className="w-12 h-12 mx-auto text-gray-500 mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">Timeline Coming Soon</h3>
            <p className="text-gray-400">The detailed event schedule has not been published yet. Please check back later!</p>
          </div>
        ) : (
          <>
            {/* Day Tabs */}
            <div className="flex justify-center flex-wrap gap-4 mb-16 relative z-10">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 border ${
                    activeDay === day 
                      ? 'bg-[rgba(88,129,87,0.12)] border-[#588157] text-[#a3b18a]' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Timeline */}
            <div className="relative pl-6 md:pl-0">
              {/* Vertical Line */}
              <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

              <div className="space-y-12 relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDay}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-12"
                  >
                    {activeDayEvents.map((item, i) => {
                      const isCurrent = checkIsCurrent(item);
                      const type = getEventType(item);
                      return (
                        <div key={item.id} className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                          {/* Time (Mobile hidden) */}
                          <div className={`hidden md:block w-1/2 ${i % 2 === 0 ? 'text-left pl-12' : 'text-right pr-12'}`}>
                            <div className={`text-2xl font-bold ${isCurrent ? 'text-[#a3b18a]' : 'text-white'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              {formatTime(item.startTime)}
                            </div>
                            <div className="text-gray-500 text-sm uppercase tracking-widest mt-1">GMT+6</div>
                          </div>

                          {/* Node */}
                          <div className={`absolute left-[39px] md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-[#0A0A0F] ${
                            isCurrent ? 'bg-[#588157]' : 'bg-gray-600'
                          }`} />

                          {/* Card */}
                          <div className={`w-full md:w-1/2 ml-16 md:ml-0 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                            <div className={`p-6 rounded-2xl bg-white/[0.02] border backdrop-blur-sm transition-colors duration-300 ${
                              isCurrent ? 'border-[#3a5a40] shadow-[0_2px_12px_rgba(0,0,0,0.20)]' : 'border-white/5 hover:border-white/20'
                            }`}>
                              {/* Time (Mobile only) */}
                              <div className="md:hidden text-[#a3b18a] font-bold mb-3 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {formatTime(item.startTime)}
                              </div>

                              <div className="flex justify-between items-start gap-4 mb-4">
                                <h3 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                                  type === 'Opening' || type === 'Award' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                  type === 'Segment' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                  type === 'Break' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' :
                                  'bg-white/5 text-gray-300 border border-white/10'
                                }`}>
                                  {type}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <MapPin className="w-4 h-4" />
                                {item.venue}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}