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

const DUMMY_SEGMENTS: DbSegment[] = [
  { id: 1, name: 'Robo Soccer', description: 'Build and program autonomous or manual robots to compete in a high-stakes soccer tournament on a custom arena.', type: 'Team', difficulty: 'Hard', teamSize: 'Max 4', fee: '৳500', prizePool: '৳20,000', category: 'Manual', scheduleText: 'Day 1 • 10:00 AM', location: 'Arena A', deadline: 'May 15, 2026', imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80' },
  { id: 2, name: 'Line Follower', description: 'Optimize your algorithms for the fastest time across complex track layouts with sharp turns and intersections.', type: 'Team', difficulty: 'Medium', teamSize: 'Max 3', fee: '৳400', prizePool: '৳15,000', category: 'Autonomous', scheduleText: 'Day 1 • 2:00 PM', location: 'Track B', deadline: 'May 12, 2026', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80' },
  { id: 3, name: 'Drone Race', description: 'Navigate aerial obstacles in a high-speed FPV drone racing championship.', type: 'Solo', difficulty: 'Extreme', teamSize: 'Max 1', fee: '৳1000', prizePool: '৳50,000', category: 'Manual', scheduleText: 'Day 2 • 11:00 AM', location: 'Sky Zone', deadline: 'May 10, 2026', imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80' },
  { id: 4, name: 'Sumo Bot', description: 'Push the opponent out of the ring. Pure torque and grip.', type: 'Team', difficulty: 'Hard', teamSize: 'Max 4', fee: '৳600', prizePool: '৳25,000', category: 'Autonomous', scheduleText: 'Day 1 • 4:00 PM', location: 'Ring C', deadline: 'May 14, 2026', imageUrl: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80' }
];

export default function SegmentsPage({ dbSegments }: { dbSegments?: DbSegment[] }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const rawSegments = dbSegments && dbSegments.length > 0 ? dbSegments : DUMMY_SEGMENTS;

  const segments = rawSegments.map((s, index) => {
    const fallback = DUMMY_SEGMENTS.find(ds => ds.name.toLowerCase() === s.name.toLowerCase());
    return {
      id: s.id,
      title: s.name,
      desc: s.description,
      type: s.type || fallback?.type || 'Team',
      difficulty: s.difficulty || fallback?.difficulty || 'Medium',
      icon: icons[index % icons.length],
      team: s.teamSize || fallback?.teamSize || 'TBA',
      fee: s.fee || fallback?.fee || 'TBA',
      prize: s.prizePool || fallback?.prizePool || 'Not Specified',
      filter: s.category || fallback?.category || 'General',
      schedule: s.scheduleText || fallback?.scheduleText || 'TBA',
      location: s.location || fallback?.location || 'TBA',
      deadline: s.deadline || fallback?.deadline || 'TBA',
      image: s.imageUrl || fallback?.imageUrl || '/globe.svg',
    };
  });

  const filteredSegments = segments.filter(s => {
    const filterLower = activeFilter.toLowerCase();
    if (filterLower === 'all') return true;
    
    const typeLower = String(s.type).toLowerCase();
    const catLower = String(s.filter).toLowerCase();

    if (filterLower === 'solo' || filterLower === 'team') {
      return typeLower.includes(filterLower);
    }
    if (filterLower === 'autonomous' || filterLower === 'manual') {
      return catLower.includes(filterLower);
    }
    return true;
  });

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Hero */}
      <div className="flex flex-col items-center text-center mb-16 relative">
        {/* No glow blob */}
        
        <div className="text-sm tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>
          <Link to="/" className="hover:text-[var(--text-heading)] transition-colors">HOME</Link> / SEGMENTS
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          All Segments.
        </h1>
        <p className="max-w-2xl mb-12" style={{ color: 'var(--text-body)' }}>
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
                  ? 'bg-[#588157]/15 border-[#588157] text-[var(--text-heading)] shadow-md' 
                  : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-[var(--text-body)] hover:bg-black/10 dark:hover:bg-white/10'
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
            className="group relative flex flex-col rounded-2xl backdrop-blur-md transition-all duration-500 hover:-translate-y-2 overflow-hidden border"
            style={{
              background: 'var(--glass-panel-bg)',
              borderColor: 'var(--glass-panel-border)',
              boxShadow: 'var(--glass-panel-shadow)',
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
                    background: 'var(--border)',
                    border: '1px solid var(--glass-panel-border)',
                    color: 'var(--text-heading)',
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
                className="text-2xl font-bold mb-3 transition-colors duration-300 text-[var(--text-heading)] group-hover:text-primary"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {seg.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed mb-6 flex-grow" style={{ color: 'var(--text-body)' }}>
                {seg.desc}
              </p>

              {/* Info Section */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2.5 text-sm">
                  <Calendar className="w-4 h-4 text-[#588157]" />
                  <span style={{ color: 'var(--text-body)' }}>{seg.schedule}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <MapPin className="w-4 h-4 text-[#588157]" />
                  <span style={{ color: 'var(--text-body)' }}>{seg.location}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Clock className="w-4 h-4 text-[#588157]" />
                  <span style={{ color: 'var(--text-body)' }}>Deadline: {seg.deadline}</span>
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
                    background: 'var(--border)',
                    border: '1px solid var(--glass-panel-border)',
                    color: 'var(--text-heading)',
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
