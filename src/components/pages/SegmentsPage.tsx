"use client";
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, Crosshair, Map, Zap, Cpu, ShieldAlert, Car, MonitorSmartphone, Target, Swords, Ghost, Radar, Calendar, MapPin, Clock } from 'lucide-react';
import { Link } from '@/lib/router-compat';

const allSegments = [
  { id: 1, title: 'Robo Soccer', desc: 'Build and program autonomous or manual robots to compete in a high-stakes soccer tournament on a custom arena.', type: 'Team', difficulty: 'Hard', icon: <Bot className="w-8 h-8" />, size: 'large', team: 'Max 4', fee: '৳500', prize: '৳20,000', filter: 'Manual', schedule: 'Day 1 • 10:00 AM', location: 'Arena A', deadline: 'May 15, 2026', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80' },
  { id: 2, title: 'Line Follower', desc: 'Optimize your algorithms for the fastest time across complex track layouts with sharp turns and intersections.', type: 'Team', difficulty: 'Medium', icon: <Map className="w-8 h-8" />, size: 'small', team: 'Max 3', fee: '৳400', prize: '৳15,000', filter: 'Autonomous', schedule: 'Day 1 • 2:00 PM', location: 'Track B', deadline: 'May 12, 2026', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80' },
  { id: 3, title: 'Drone Race', desc: 'Navigate aerial obstacles in a high-speed FPV drone racing championship.', type: 'Solo', difficulty: 'Extreme', icon: <Crosshair className="w-8 h-8" />, size: 'small', team: 'Max 1', fee: '৳1000', prize: '৳50,000', filter: 'Manual', schedule: 'Day 2 • 11:00 AM', location: 'Sky Zone', deadline: 'May 10, 2026', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80' },
  { id: 4, title: 'Sumo Bot', desc: 'Push the opponent out of the ring. Pure torque and grip.', type: 'Team', difficulty: 'Hard', icon: <Zap className="w-8 h-8" />, size: 'small', team: 'Max 4', fee: '৳600', prize: '৳25,000', filter: 'Autonomous', schedule: 'Day 1 • 4:00 PM', location: 'Ring C', deadline: 'May 14, 2026', image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80' },
  { id: 5, title: 'Maze Solver', desc: 'Autonomous micro-mouse navigating unknown labyrinths.', type: 'Solo', difficulty: 'Hard', icon: <Cpu className="w-8 h-8" />, size: 'small', team: 'Max 2', fee: '৳300', prize: '৳10,000', filter: 'Autonomous', schedule: 'Day 2 • 9:00 AM', location: 'Lab D', deadline: 'May 16, 2026', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80' },
  { id: 6, title: 'Combat Robotics', desc: 'Heavyweight destructive robots battle in an enclosed bulletproof arena. Only one survives.', type: 'Team', difficulty: 'Extreme', icon: <ShieldAlert className="w-8 h-8" />, size: 'large', team: 'Max 5', fee: '৳1500', prize: '৳100,000', filter: 'Manual', schedule: 'Day 2 • 5:00 PM', location: 'Battle Arena', deadline: 'May 8, 2026', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80' },
  { id: 7, title: 'RC Car Racing', desc: 'Off-road RC racing on dirt tracks. High speed maneuvering required.', type: 'Team', difficulty: 'Medium', icon: <Car className="w-8 h-8" />, size: 'small', team: 'Max 3', fee: '৳400', prize: '৳15,000', filter: 'Manual', schedule: 'Day 1 • 1:00 PM', location: 'Outdoor Track', deadline: 'May 13, 2026', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
  { id: 8, title: 'App Dev Sprint', desc: '24-hour hackathon to build a robotic control app interface.', type: 'Team', difficulty: 'Medium', icon: <MonitorSmartphone className="w-8 h-8" />, size: 'small', team: 'Max 4', fee: '৳300', prize: '৳15,000', filter: 'Autonomous', schedule: 'Day 1 • 6:00 PM', location: 'Tech Hub', deadline: 'May 11, 2026', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80' },
  { id: 9, title: 'Object Sorting', desc: 'AI-powered robot arms sorting color-coded blocks on a conveyor.', type: 'Solo', difficulty: 'Hard', icon: <Target className="w-8 h-8" />, size: 'small', team: 'Max 2', fee: '৳400', prize: '৳12,000', filter: 'Autonomous', schedule: 'Day 2 • 3:00 PM', location: 'Lab E', deadline: 'May 15, 2026', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80' },
  { id: 10, title: 'Gladiator Bot', desc: 'Melee weapons only. Bipedal robots fighting for supremacy.', type: 'Team', difficulty: 'Hard', icon: <Swords className="w-8 h-8" />, size: 'small', team: 'Max 4', fee: '৳600', prize: '৳25,000', filter: 'Manual', schedule: 'Day 2 • 1:00 PM', location: 'Arena B', deadline: 'May 12, 2026', image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80' },
  { id: 11, title: 'Stealth Navigator', desc: 'Evade laser sensors in a dark room using infrared and lidar.', type: 'Solo', difficulty: 'Hard', icon: <Ghost className="w-8 h-8" />, size: 'small', team: 'Max 1', fee: '৳300', prize: '৳10,000', filter: 'Autonomous', schedule: 'Day 1 • 8:00 PM', location: 'Dark Chamber', deadline: 'May 14, 2026', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80' },
  { id: 12, title: 'Search & Rescue', desc: 'Navigate a simulated disaster zone to find heat signatures.', type: 'Team', difficulty: 'Medium', icon: <Radar className="w-8 h-8" />, size: 'small', team: 'Max 4', fee: '৳500', prize: '৳20,000', filter: 'Autonomous', schedule: 'Day 2 • 12:00 PM', location: 'Zone F', deadline: 'May 13, 2026', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80' }
];

const filters = ['All', 'Solo', 'Team', 'Autonomous', 'Manual'];

export default function SegmentsPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredSegments = allSegments.filter(s => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Solo' || activeFilter === 'Team') return s.type === activeFilter;
    if (activeFilter === 'Autonomous' || activeFilter === 'Manual') return s.filter === activeFilter;
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