"use client";
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, Crosshair, Map, Zap, Cpu, ShieldAlert, Car, MonitorSmartphone, Target, Swords, Ghost, Radar, Calendar, MapPin, Clock } from 'lucide-react';
import { Link } from '@/lib/router-compat';

interface DbSegment {
  id: number;
  name: string;
  description: string;
  prizePool?: string | null;
  category?: string | null;
  type?: string | null;
  difficulty?: string | null;
  teamSize?: string | null;
  fee?: string | null;
  deadline?: string | null;
  location?: string | null;
  scheduleText?: string | null;
  imageUrl?: string | null;
}

const icons = [
  <Bot key="bot" className="w-8 h-8" />,
  <Map key="map" className="w-8 h-8" />,
  <Crosshair key="crosshair" className="w-8 h-8" />,
  <Zap key="zap" className="w-8 h-8" />,
  <Cpu key="cpu" className="w-8 h-8" />,
  <ShieldAlert key="shield-alert" className="w-8 h-8" />,
  <Car key="car" className="w-8 h-8" />,
  <MonitorSmartphone key="monitor-smartphone" className="w-8 h-8" />,
  <Target key="target" className="w-8 h-8" />,
  <Swords key="swords" className="w-8 h-8" />,
  <Ghost key="ghost" className="w-8 h-8" />,
  <Radar key="radar" className="w-8 h-8" />,
];

const filters = ['All', 'Solo', 'Team', 'Autonomous', 'Manual'];

export default function SegmentsPage({ dbSegments }: { dbSegments?: DbSegment[] }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const segments = (dbSegments || []).map((s, index) => ({
    id: s.id,
    title: s.name,
    desc: s.description,
    type: s.type || 'Team',
    difficulty: s.difficulty || 'Medium',
    icon: icons[index % icons.length],
    team: s.teamSize || 'TBA',
    fee: s.fee || 'TBA',
    prize: s.prizePool || 'Not Specified',
    filter: s.category || 'General',
    schedule: s.scheduleText || 'TBA',
    location: s.location || 'TBA',
    deadline: s.deadline || 'TBA',
    image: s.imageUrl || '/globe.svg',
  }));

  const filteredSegments = segments.filter(s => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Solo' || activeFilter === 'Team') return s.type === activeFilter;
    if (activeFilter === 'Autonomous' || activeFilter === 'Manual') {
      return String(s.filter).toLowerCase().includes(activeFilter.toLowerCase());
    }
    return true;
  });

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Hero */}
      <div className="flex flex-col items-center text-center mb-16 relative">
        {/* No glow blob */}
        
        <div className="text-gray-400 text-sm tracking-widest mb-6">
          <Link to="/" className="hover:text-white transition-colors">HOME</Link> / SEGMENTS
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          All Segments.
        </h1>
        <p className="text-gray-400 max-w-2xl mb-12">
          Discover our 12 competitive segments across different disciplines. Filter by category to find your perfect match.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 relative z-10">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeFilter === f 
                  ? 'bg-[rgba(88,129,87,0.12)] border-[#588157] text-[#a3b18a]' 
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSegments.map((seg, i) => (
          <motion.div
            key={seg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col rounded-2xl backdrop-blur-md transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(58,90,64,0.06) 0%, rgba(163,177,138,0.03) 100%)',
              border: '1px solid rgba(163,177,138,0.12)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.03)',
            }}
          >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden rounded-t-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${seg.image})`,
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(58,90,64,0.6) 100%)',
                }}
              />

              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span
                  className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase backdrop-blur-md"
                  style={{
                    background: 'rgba(88,129,87,0.25)',
                    border: '1px solid rgba(163,177,138,0.3)',
                    color: '#a3b18a',
                  }}
                >
                  {seg.type}
                </span>
              </div>

              {/* Difficulty Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
                    seg.difficulty === 'Extreme'
                      ? 'text-red-300 bg-red-500/20 border border-red-400/30'
                      : seg.difficulty === 'Hard'
                      ? 'text-orange-300 bg-orange-500/20 border border-orange-400/30'
                      : 'text-blue-300 bg-blue-500/20 border border-blue-400/30'
                  }`}
                >
                  {seg.difficulty}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-grow p-6">
              {/* Title */}
              <h3
                className="text-2xl font-bold mb-3 text-white group-hover:text-[#a3b18a] transition-colors duration-300"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {seg.title}
              </h3>

              {/* Description */}
              <p className="text-[#9A9A8E] text-sm leading-relaxed mb-6 flex-grow">
                {seg.desc}
              </p>

              {/* Info Section */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2.5 text-sm">
                  <Calendar className="w-4 h-4 text-[#588157]" />
                  <span className="text-gray-300">{seg.schedule}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <MapPin className="w-4 h-4 text-[#588157]" />
                  <span className="text-gray-300">{seg.location}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Clock className="w-4 h-4 text-[#588157]" />
                  <span className="text-gray-300">Deadline: {seg.deadline}</span>
                </div>
              </div>

              {/* Divider */}
              <div
                className="w-full h-px mb-6"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(163,177,138,0.2) 50%, transparent 100%)',
                }}
              />

              {/* Actions */}
              <div className="flex gap-3">
                <Link
                  to={`/event/${seg.id}`}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-center transition-all duration-300 hover:scale-105 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #3a5a40 0%, #344e41 100%)',
                    border: '1px solid rgba(163,177,138,0.2)',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(58,90,64,0.3)',
                  }}
                >
                  Details
                </Link>
                <button
                  className="flex-1 py-3 rounded-xl text-sm font-semibold backdrop-blur-md transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(163,177,138,0.2)',
                    color: '#a3b18a',
                  }}
                >
                  Rule Book
                </button>
              </div>
            </div>

            {/* Hover Glow Effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
              style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(88,129,87,0.15) 0%, transparent 70%)',
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
