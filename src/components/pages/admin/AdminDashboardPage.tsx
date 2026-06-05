"use client";
import React, { useEffect, useState } from 'react';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { Users, TrendingUp, CheckCircle, AlertCircle, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminFetch } from "@/lib/admin-api";
import { Skeleton } from "@/components/ui/skeleton";

// Keep existing dummy data as fallback
const FALLBACK_TRENDS = [
  { id: 'mon', name: 'Mon', registrations: 12 },
  { id: 'tue', name: 'Tue', registrations: 19 },
  { id: 'wed', name: 'Wed', registrations: 15 },
  { id: 'thu', name: 'Thu', registrations: 25 },
  { id: 'fri', name: 'Fri', registrations: 32 },
  { id: 'sat', name: 'Sat', registrations: 45 },
  { id: 'sun', name: 'Sun', registrations: 50 },
];

const FALLBACK_STATS = [
  { id: 'total-reg', label: 'Total Registrations', value: '1,248', icon: Users, trend: '+12% this week', color: 'text-blue-500' },
  { id: 'total-rev', label: 'Total Revenue', value: '$12,450', icon: TrendingUp, trend: '+5% this week', color: 'text-[#588157]' },
  { id: 'pending-app', label: 'Pending Approvals', value: '45', icon: AlertCircle, trend: 'Needs attention', color: 'text-amber-500' },
  { id: 'active-seg', label: 'Active Segments', value: '12', icon: CheckCircle, trend: 'All running smoothly', color: 'text-purple-500' },
];

const FALLBACK_ACTIVITY = [
  { id: 'act-1', title: 'New team registered', desc: 'Team "CyberKnights" joined Robo Wars.', time: '2 mins ago', icon: Users, color: 'text-blue-500' },
  { id: 'act-2', title: 'Payment verified', desc: 'Payment received for "MechMinds".', time: '1 hour ago', icon: CheckCircle, color: 'text-[#588157]' },
  { id: 'act-3', title: 'Schedule updated', desc: 'Line Follower moved to Arena B.', time: '3 hours ago', icon: CalendarIcon, color: 'text-purple-500' },
  { id: 'act-4', title: 'Sponsorship inquiry', desc: 'TechCorp reached out for Gold tier.', time: '5 hours ago', icon: TrendingUp, color: 'text-amber-500' },
  { id: 'act-5', title: 'Pending Approval', desc: 'Team "ScrapBots" needs document review.', time: '1 day ago', icon: Clock, color: 'text-gray-400' },
];

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 0) return 'Just now';
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval === 1 ? '1 year ago' : `${interval} years ago`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval === 1 ? '1 month ago' : `${interval} months ago`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval === 1 ? '1 day ago' : `${interval} days ago`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval === 1 ? '1 min ago' : `${interval} mins ago`;
  return 'Just now';
}

export default function AdminDashboardPage() {
  const { isDark } = useResolvedTheme();

  const cardBg = isDark ? 'bg-[#111116] border-white/[0.07]' : 'bg-white border-black/[0.08]';
  const textColor = isDark ? 'text-[#F5F5F0]' : 'text-[#1a1a14]';
  const mutedText = isDark ? 'text-[#9A9A8E]' : 'text-[#4a4a40]';

  const [stats, setStats] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await adminFetch("/api/admin/dashboard");
        
        if (data && typeof data.totalRegistrations === 'number') {
          const liveStats = [
            { id: 'total-reg', label: 'Total Registrations', value: data.totalRegistrations.toLocaleString(), icon: Users, trend: 'Total registrations count', color: 'text-blue-500' },
            { id: 'total-users', label: 'Total Users', value: data.totalUsers.toLocaleString(), icon: TrendingUp, trend: 'Registered user accounts', color: 'text-[#588157]' },
            { id: 'pending-app', label: 'Pending Approvals', value: data.pendingRegistrations.toLocaleString(), icon: AlertCircle, trend: 'Needs attention', color: 'text-amber-500' },
            { id: 'active-seg', label: 'Active Segments', value: data.activeSegments.toLocaleString(), icon: CheckCircle, trend: 'All running smoothly', color: 'text-purple-500' },
          ];

          const liveTrends = data.trends && data.trends.length > 0 ? data.trends : FALLBACK_TRENDS;

          const liveActivities = data.recentRegistrations && data.recentRegistrations.length > 0
            ? data.recentRegistrations.map((reg: any) => ({
                id: `reg-${reg.id}`,
                title: 'New registration',
                desc: `Team "${reg.teamName}" registered for ${reg.segment?.name || 'a segment'} by ${reg.user?.name || 'anonymous'}.`,
                time: formatTimeAgo(new Date(reg.createdAt)),
                icon: Users,
                color: 'text-blue-500'
              }))
            : FALLBACK_ACTIVITY;

          setStats(liveStats);
          setTrends(liveTrends);
          setActivities(liveActivities);
        } else {
          setStats(FALLBACK_STATS);
          setTrends(FALLBACK_TRENDS);
          setActivities(FALLBACK_ACTIVITY);
        }
      } catch (err) {
        console.error("Dashboard fetch failed, using fallback data:", err);
        setStats(FALLBACK_STATS);
        setTrends(FALLBACK_TRENDS);
        setActivities(FALLBACK_ACTIVITY);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold ${textColor} mb-2`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Overview</h1>
          <p className={`${mutedText} text-base sm:text-lg`}>Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <button className={`px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_2px_12px_rgba(0,0,0,0.15)] whitespace-nowrap ${
          isDark ? 'bg-[#3a5a40] text-[#F5F5F0] hover:bg-[#344e41]' : 'bg-[#3a5a40] text-white hover:bg-[#344e41]'
        }`}>
          Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`p-6 rounded-2xl border ${cardBg}`}>
              <div className="flex justify-between items-start mb-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))
        ) : (
          stats.map((stat) => (
            <div key={stat.id} className={`p-6 rounded-2xl border ${cardBg} transition-all hover:-translate-y-1`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-100'} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className={`${mutedText} text-sm font-medium mb-1`}>{stat.label}</p>
                <h3 className={`text-3xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{stat.value}</h3>
                <p className={`text-xs mt-2 ${stat.trend.includes('attention') ? 'text-amber-500' : mutedText}`}>{stat.trend}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${cardBg}`}>
          <div className="mb-6">
            <h3 className={`text-xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Registration Trends</h3>
            <p className={`${mutedText} text-sm`}>New user signups over the past 7 days</p>
          </div>
          <div className="h-[300px] w-full">
            {loading ? (
              <Skeleton className="w-full h-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid key="grid" strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} vertical={false} />
                  <XAxis key="xaxis" dataKey="name" stroke={isDark ? "#888" : "#666"} tick={{fill: isDark ? "#888" : "#666"}} tickLine={false} axisLine={false} />
                  <YAxis key="yaxis" stroke={isDark ? "#888" : "#666"} tick={{fill: isDark ? "#888" : "#666"}} tickLine={false} axisLine={false} />
                  <Tooltip
                    key="tooltip"
                    contentStyle={{
                      backgroundColor: isDark ? '#0A0A0F' : '#fff',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#000'
                    }}
                  />
                  <Line
                    key="registrations-line"
                    type="monotone"
                    dataKey="registrations"
                    stroke={isDark ? "#588157" : "#3a5a40"}
                    strokeWidth={3}
                    dot={{ r: 4, fill: isDark ? "#0A0A0F" : "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: isDark ? "#588157" : "#3a5a40" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="mb-6 flex justify-between items-center">
            <h3 className={`text-xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Recent Activity</h3>
            <button className={`text-[#588157] hover:text-[#a3b18a] text-sm font-medium`}>View all</button>
          </div>
          <div className="space-y-6">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-5 h-5 rounded-full mt-1 flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-5/6" />
                    <Skeleton className="h-2 w-1/4" />
                  </div>
                </div>
              ))
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className={`mt-1 flex-shrink-0 ${activity.color}`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`font-medium ${textColor} text-sm`}>{activity.title}</p>
                    <p className={`${mutedText} text-xs mt-0.5`}>{activity.desc}</p>
                    <p className={`${mutedText} text-xs mt-1 opacity-70`}>{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}