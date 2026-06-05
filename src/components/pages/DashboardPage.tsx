"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bot, CheckCircle2, Star, Award, Bell, Trophy, Calendar, ChevronRight, Loader2, QrCode, Users } from 'lucide-react';
import { useTheme } from 'next-themes';
import { StatCard } from '@/components/dashboard/StatCard';
import { EventCard } from '@/components/dashboard/EventCard';
import { Link } from '@/lib/router-compat';

export default function DashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || !theme;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    user: {
      name: string;
      email: string;
      phone: string | null;
      university: string | null;
      department: string | null;
      studentId: string | null;
      avatarUrl: string | null;
    };
    stats: {
      enrolledCount: number;
      completedCount: number;
      bestRank: string;
      certificatesCount: number;
    };
    events: Array<{
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
    }>;
    announcements: Array<{
      id: number;
      title: string;
      message: string;
      icon: string;
      color: string;
      isNew: boolean;
      createdAt: string;
    }>;
  } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch('/api/dashboard/summary');
        if (res.ok) {
          const summaryData = await res.json();
          setData(summaryData);
        } else {
          const errorData = await res.json().catch(() => ({}));
          setError(errorData.message || 'Failed to load dashboard.');
        }
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
        setError('Network error while loading dashboard.');
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const iconMap: Record<string, React.ComponentType<any>> = {
    Bell,
    Trophy,
    Calendar,
    QrCode,
    Users,
  };

  const announcementsFromDb = data?.announcements || [];
  const announcements = announcementsFromDb.map((ann) => {
    const createdDate = new Date(ann.createdAt);
    const diffMs = Date.now() - createdDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    let timeString = 'Just now';
    if (diffDays > 0) {
      timeString = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      timeString = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins > 0) {
        timeString = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      }
    }

    return {
      id: ann.id,
      title: ann.title,
      message: ann.message,
      time: timeString,
      icon: iconMap[ann.icon] || Bell,
      color: ann.color,
      isNew: ann.isNew,
    };
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#588157]" />
        <p className="text-gray-400 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  const userFirstName = data?.user?.name ? data.user.name.split(' ')[0] : 'Participant';
  const enrolledEvents = data?.events || [];
  // Upcoming events are those that are not completed (upcoming/ongoing)
  const upcomingEvents = enrolledEvents.filter(e => e.status !== 'completed').slice(0, 2);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
        <Bell className="w-12 h-12 text-red-400" />
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}>Unable to Load Dashboard</h1>
        <p className="text-red-300 text-sm">{error}</p>
      </div>
    );
  }

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
          {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a3b18a] to-[#588157]">{userFirstName}</span>
        </h1>
        <p className={`text-base sm:text-lg ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
          Here's what's happening with your ARC 3.0 2026 journey.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard label="Segments Enrolled" value={data?.stats?.enrolledCount?.toString() || '0'} icon={Bot} />
        <StatCard label="Events Completed" value={data?.stats?.completedCount?.toString() || '0'} icon={CheckCircle2} color="text-blue-400" />
        <StatCard label="Best Rank" value={data?.stats?.bestRank || 'N/A'} icon={Star} color="text-yellow-400" />
        <StatCard label="Certificates" value={data?.stats?.certificatesCount?.toString() || '0'} icon={Award} color="text-purple-400" />
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
            <Link to="/dashboard/events" className="text-[#588157] hover:text-[#a3b18a] text-sm font-medium flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          ) : (
            <div
              className="p-8 rounded-2xl text-center backdrop-blur-md"
              style={{
                background: isDark
                  ? 'rgba(58,90,64,0.03)'
                  : 'rgba(58,90,64,0.02)',
                border: `1px dashed ${isDark ? 'rgba(163,177,138,0.2)' : 'rgba(58,90,64,0.2)'}`,
              }}
            >
              <Calendar className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-[#5A5A52]' : 'text-[#8a8a7a]'}`} />
              <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}>No Upcoming Events</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>You haven't registered for any segments yet or all registered segments are completed.</p>
              <Link
                to="/segments"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #3a5a40 0%, #344e41 100%)',
                  color: '#ffffff',
                }}
              >
                Browse Events
              </Link>
            </div>
          )}
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
