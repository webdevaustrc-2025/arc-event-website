"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Filter, Loader2, Calendar } from 'lucide-react';
import { useTheme } from 'next-themes';
import { EventCard } from '@/components/dashboard/EventCard';
import { Link } from '@/lib/router-compat';

export default function MyEventsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || !theme;
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const [myEvents, setMyEvents] = useState<Array<{
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    status: 'upcoming' | 'ongoing' | 'completed';
    image: string;
    segmentId?: number | null;
    registrationCode?: string;
    registrationDate?: string;
    teamName?: string;
    registrationStatus?: string;
    paymentStatus?: string;
  }>>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/dashboard/summary');
        if (res.ok) {
          const summaryData = await res.json();
          setMyEvents(summaryData.events || []);
        } else {
          const errorData = await res.json().catch(() => ({}));
          setError(errorData.message || 'Failed to load your events.');
        }
      } catch (err) {
        console.error('Error fetching registered events:', err);
        setError('Network error while loading your events.');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const filteredEvents = filter === 'all' ? myEvents : myEvents.filter((e) => e.status === filter);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#588157]" />
        <p className="text-gray-400 text-sm">Loading your events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-20 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
        <Calendar className="w-16 h-16 mx-auto mb-4 text-red-400" />
        <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}>Unable to Load Events</h1>
        <p className="text-sm text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1
            className={`text-3xl sm:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            My Events
          </h1>
          <p className={`text-base sm:text-lg ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
            Manage your enrolled events and registrations
          </p>
        </div>

        <Link
          to="/segments"
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #3a5a40 0%, #344e41 100%)',
            color: '#ffffff',
          }}
        >
          <Plus className="w-5 h-5" />
          Join New Event
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <div className={`flex items-center gap-2 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        {(['all', 'upcoming', 'ongoing', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 capitalize ${
              filter === f
                ? isDark
                  ? 'bg-[#588157]/20 text-[#a3b18a] border border-[#588157]/30'
                  : 'bg-[#588157]/15 text-[#3a5a40] border border-[#588157]/25'
                : isDark
                ? 'text-[#9A9A8E] hover:bg-white/5 border border-transparent'
                : 'text-[#8a8a7a] hover:bg-black/5 border border-transparent'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              <EventCard {...event} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-20 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}
        >
          <Calendar className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-[#5A5A52]' : 'text-[#8a8a7a]'}`} />
          <p className="text-lg mb-2">No {filter !== 'all' ? filter : ''} events found.</p>
          {filter === 'all' && (
            <p className="text-sm mb-6">Explore the segments page to register for your first event!</p>
          )}
          {filter === 'all' && (
            <Link
              to="/segments"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #3a5a40 0%, #344e41 100%)',
                color: '#ffffff',
              }}
            >
              Explore Segments
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
}
