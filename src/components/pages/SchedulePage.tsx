"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, MapPin, BadgeAlert, Loader2, Calendar } from 'lucide-react';
import { Link } from '@/lib/router-compat';

interface DatabaseScheduleItem {
  id: number;
  segmentId: number | null;
  title: string;
  startTime: string;
  endTime: string;
  venue: string;
  displayOrder: number;
  segment: { id: number; name: string } | null;
}

const DUMMY_SCHEDULE: DatabaseScheduleItem[] = [
  { id: 101, segmentId: null, title: 'Opening Ceremony', startTime: '2026-06-10T09:00:00Z', endTime: '2026-06-10T10:00:00Z', venue: 'Main Auditorium', displayOrder: 1, segment: null },
  { id: 102, segmentId: 1, title: 'Robo Soccer - Group Stage', startTime: '2026-06-10T10:30:00Z', endTime: '2026-06-10T13:00:00Z', venue: 'Arena Alpha', displayOrder: 2, segment: { id: 1, name: 'Robo Soccer' } },
  { id: 103, segmentId: 2, title: 'Line Follower - Qualifying', startTime: '2026-06-10T11:00:00Z', endTime: '2026-06-10T13:00:00Z', venue: 'Track Beta', displayOrder: 3, segment: { id: 2, name: 'Line Follower' } },
  { id: 104, segmentId: null, title: 'Lunch Break', startTime: '2026-06-10T13:00:00Z', endTime: '2026-06-10T14:30:00Z', venue: 'Cafeteria', displayOrder: 4, segment: null },
  { id: 105, segmentId: null, title: 'Combat Robotics - Prelims', startTime: '2026-06-10T14:30:00Z', endTime: '2026-06-10T17:00:00Z', venue: 'BattleBox Gamma', displayOrder: 5, segment: null },
  { id: 106, segmentId: null, title: 'Day 1 Closing Remarks', startTime: '2026-06-10T17:00:00Z', endTime: '2026-06-10T18:00:00Z', venue: 'Main Auditorium', displayOrder: 6, segment: null },
  { id: 201, segmentId: 3, title: 'Drone Race - Time Trials', startTime: '2026-06-11T09:00:00Z', endTime: '2026-06-11T12:00:00Z', venue: 'Outdoor Field', displayOrder: 1, segment: { id: 3, name: 'Drone Race' } },
  { id: 202, segmentId: 4, title: 'Sumo Bot - Round of 32', startTime: '2026-06-11T11:00:00Z', endTime: '2026-06-11T13:00:00Z', venue: 'Arena Alpha', displayOrder: 2, segment: { id: 4, name: 'Sumo Bot' } },
  { id: 203, segmentId: null, title: 'Lunch Break', startTime: '2026-06-11T13:00:00Z', endTime: '2026-06-11T14:00:00Z', venue: 'Cafeteria', displayOrder: 3, segment: null },
  { id: 204, segmentId: null, title: 'Maze Solver - Attempts', startTime: '2026-06-11T14:00:00Z', endTime: '2026-06-11T16:30:00Z', venue: 'Lab Complex 2', displayOrder: 4, segment: null },
  { id: 205, segmentId: null, title: 'App Dev Sprint - Kickoff', startTime: '2026-06-11T16:30:00Z', endTime: '2026-06-11T18:00:00Z', venue: 'Innovation Lab', displayOrder: 5, segment: null },
  { id: 301, segmentId: 1, title: 'Robo Soccer - Finals', startTime: '2026-06-12T10:00:00Z', endTime: '2026-06-12T11:30:00Z', venue: 'Main Stage', displayOrder: 1, segment: { id: 1, name: 'Robo Soccer' } },
  { id: 302, segmentId: null, title: 'Combat Robotics - Grand Finale', startTime: '2026-06-12T11:30:00Z', endTime: '2026-06-12T13:30:00Z', venue: 'Main Stage', displayOrder: 2, segment: null },
  { id: 303, segmentId: null, title: 'Lunch Break', startTime: '2026-06-12T13:30:00Z', endTime: '2026-06-12T15:00:00Z', venue: 'Cafeteria', displayOrder: 3, segment: null },
  { id: 304, segmentId: null, title: 'Award Ceremony & Gala', startTime: '2026-06-12T15:00:00Z', endTime: '2026-06-12T18:00:00Z', venue: 'Main Auditorium', displayOrder: 4, segment: null }
];

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
        if (data && data.length > 0) {
          setEvents(data);
        } else {
          setEvents(DUMMY_SCHEDULE);
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setEvents(DUMMY_SCHEDULE);
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

  // Group events by date dynamically
  const uniqueDates = Array.from(new Set(events.map(e => new Date(e.startTime).toDateString()))).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const days = uniqueDates.map((_, i) => `Day ${i + 1}`);

  const activeDateIndex = days.indexOf(activeDay);
  const activeDateStr = activeDateIndex !== -1 ? uniqueDates[activeDateIndex] : null;
  const activeDayEvents = activeDateStr ? events.filter(e => new Date(e.startTime).toDateString() === activeDateStr) : [];

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
          <div className="text-sm tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>
            <Link to="/" className="hover:text-[var(--text-heading)] transition-colors">HOME</Link> / SCHEDULE
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 relative z-10" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Event Timeline.
          </h1>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed" style={{ color: 'var(--text-body)' }}>
            Plan your visit. {days.length || '3'} days of non-stop robotics action, engineering battles, and innovation showcases.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#588157]" />
            <p style={{ color: 'var(--text-muted)' }}>Loading timeline...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border" style={{ background: 'var(--glass-panel-bg)', borderColor: 'var(--glass-panel-border)' }}>
            <Calendar className="w-12 h-12 mx-auto text-gray-500 mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>Timeline Coming Soon</h3>
            <p style={{ color: 'var(--text-body)' }}>The detailed event schedule has not been published yet. Please check back later!</p>
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
                      ? 'bg-[#588157]/15 border-[#588157] text-[var(--text-heading)] shadow-md' 
                      : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-[var(--text-body)] hover:bg-black/10 dark:hover:bg-white/10 hover:text-[var(--text-heading)]'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Timeline */}
            <div className="relative pl-6 md:pl-0">
              {/* Vertical Line */}
              <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-[var(--border)]" />

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
                            <div className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: isCurrent ? 'var(--text-label)' : 'var(--text-heading)' }}>
                              {formatTime(item.startTime)}
                            </div>
                            <div className="text-sm uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>GMT+6</div>
                          </div>

                          {/* Node */}
                          <div className="absolute left-[39px] md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4"
                            style={{
                              borderColor: 'var(--background)',
                              backgroundColor: isCurrent ? 'var(--text-label)' : 'gray',
                            }}
                          />

                          {/* Card */}
                          <div className={`w-full md:w-1/2 ml-16 md:ml-0 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                            <div className="p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 border"
                              style={{
                                background: 'var(--glass-panel-bg)',
                                borderColor: isCurrent ? 'var(--text-label)' : 'var(--glass-panel-border)',
                                boxShadow: isCurrent ? '0 8px 32px rgba(88,129,87,0.15), var(--glass-panel-shadow)' : 'var(--glass-panel-shadow)',
                              }}
                            >
                              {/* Time (Mobile only) */}
                              <div className="md:hidden font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-label)' }}>
                                <Clock className="w-4 h-4" />
                                {formatTime(item.startTime)}
                              </div>

                              <div className="flex justify-between items-start gap-4 mb-4">
                                <h3 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-heading)' }}>{item.title}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                                  type === 'Opening' || type === 'Award' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                  type === 'Segment' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                  type === 'Break' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' :
                                  'bg-white/5 text-gray-300 border border-white/10'
                                }`}>
                                  {type}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-body)' }}>
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