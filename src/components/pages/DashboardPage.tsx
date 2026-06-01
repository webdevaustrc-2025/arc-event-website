"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Bot, CheckCircle2, Star, Award, Bell, Trophy, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { StatCard } from '@/components/dashboard/StatCard';
import { EventCard } from '@/components/dashboard/EventCard';

export default function DashboardPage() {
  const { isDark } = useResolvedTheme();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const upcomingEvents = [
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
      id: 1,
      title: 'Robo Soccer',
      date: 'May 21, 2026',
      time: '10:00 AM',
      location: 'Arena A, Main Hall',
      status: 'upcoming' as const,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    },
  ];

  const announcements = [
    {
      id: 1,
      title: 'Line Follower Track Update',
      time: '2 hours ago',
      message: 'The track layout for the qualifying round has been slightly modified to include an additional 90-degree turn.',
      icon: Bell,
      color: '#588157',
      isNew: true,
    },
    {
      id: 2,
      title: 'Prize Pool Increased',
      time: '1 day ago',
      message: 'Great news! The total prize pool for Robo Soccer has been increased to ৳30,000.',
      icon: Trophy,
      color: '#60a5fa',
      isNew: true,
    },
    {
      id: 3,
      title: 'Schedule Change',
      time: '3 days ago',
      message: 'Combat Robotics has been rescheduled to May 22nd due to venue preparation.',
      icon: Calendar,
      color: '#f59e0b',
      isNew: false,
    },
  ];

  return (
    <div>
      {/* Greeting Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1
          className={`text-3xl sm:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a3b18a] to-[#588157]">Alex</span> 👋
        </h1>
        <p className={`text-base sm:text-lg ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
          Here's what's happening with your ARC 3.0 2026 journey.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard label="Segments Enrolled" value="3" icon={Bot} trend="+1 this week" />
        <StatCard label="Events Completed" value="1" icon={CheckCircle2} color="text-blue-400" />
        <StatCard label="Best Rank" value="#4" icon={Star} color="text-yellow-400" />
        <StatCard label="Certificates" value="1" icon={Award} color="text-purple-400" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Events */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Upcoming Events
            </h2>
            <button className="text-[#588157] hover:text-[#a3b18a] text-sm font-medium flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Announcements
            </h2>
            {announcements.filter((a) => a.isNew).length > 0 && (
              <span className="bg-red-500/20 text-red-400 text-xs px-2.5 py-1 rounded-full font-semibold">
                {announcements.filter((a) => a.isNew).length} New
              </span>
            )}
          </div>

          <div className="space-y-4">
            {announcements.map((announcement, idx) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="relative p-5 rounded-2xl backdrop-blur-md overflow-hidden group hover:-translate-y-1 transition-all duration-300"
                style={{
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(58,90,64,0.04) 0%, rgba(163,177,138,0.02) 100%)'
                    : 'linear-gradient(135deg, rgba(58,90,64,0.03) 0%, rgba(163,177,138,0.01) 100%)',
                  border: `1px solid ${isDark ? 'rgba(163,177,138,0.1)' : 'rgba(58,90,64,0.12)'}`,
                }}
              >
                {/* Left Accent */}
                <div
                  className="absolute top-0 left-0 w-1 h-full"
                  style={{ background: announcement.color }}
                />

                {/* Content */}
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ background: `${announcement.color}20` }}
                  >
                    <announcement.icon className="w-4 h-4" style={{ color: announcement.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}>
                        {announcement.title}
                      </h4>
                      {announcement.isNew && (
                        <span className="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">
                          New
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mb-2 ${isDark ? 'text-[#5A5A52]' : 'text-[#8a8a7a]'}`}>
                      {announcement.time}
                    </p>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
                      {announcement.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
