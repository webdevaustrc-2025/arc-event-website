"use client";
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Filter } from 'lucide-react';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { EventCard } from '@/components/dashboard/EventCard';
import { Link } from '@/lib/router-compat';

export default function MyEventsPage() {
  const { isDark } = useResolvedTheme();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');

  const myEvents = [
    {
      id: 1,
      title: 'Robo Soccer',
      date: 'May 20, 2026',
      time: '10:00 AM',
      location: 'Arena A, Main Hall',
      status: 'upcoming' as const,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    },
    {
      id: 2,
      title: 'Line Follower',
      date: 'May 20, 2026',
      time: '2:00 PM',
      location: 'Track B, Engineering Wing',
      status: 'upcoming' as const,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    },
    {
      id: 4,
      title: 'Sumo Bot',
      date: 'May 18, 2026',
      time: '4:00 PM',
      location: 'Ring C',
      status: 'completed' as const,
      image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80',
    },
  ];

  const filteredEvents = filter === 'all' ? myEvents : myEvents.filter((e) => e.status === filter);

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
          <p className="text-lg">No {filter !== 'all' && filter} events found.</p>
        </motion.div>
      )}
    </div>
  );
}
