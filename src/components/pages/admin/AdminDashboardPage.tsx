"use client";
import React from 'react';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { Users, TrendingUp, CheckCircle, AlertCircle, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { id: 'mon', name: 'Mon', registrations: 12 },
  { id: 'tue', name: 'Tue', registrations: 19 },
  { id: 'wed', name: 'Wed', registrations: 15 },
  { id: 'thu', name: 'Thu', registrations: 25 },
  { id: 'fri', name: 'Fri', registrations: 32 },
  { id: 'sat', name: 'Sat', registrations: 45 },
  { id: 'sun', name: 'Sun', registrations: 50 },
];

export default function AdminDashboardPage() {
  const { isDark } = useResolvedTheme();

  const cardBg = isDark ? 'bg-[#111116] border-white/[0.07]' : 'bg-white border-black/[0.08]';
  const textColor = isDark ? 'text-[#F5F5F0]' : 'text-[#1a1a14]';
  const mutedText = isDark ? 'text-[#9A9A8E]' : 'text-[#4a4a40]';

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
        {[
          { id: 'total-reg', label: 'Total Registrations', value: '1,248', icon: Users, trend: '+12% this week', color: 'text-blue-500' },
          { id: 'total-rev', label: 'Total Revenue', value: '$12,450', icon: TrendingUp, trend: '+5% this week', color: 'text-[#588157]' },
          { id: 'pending-app', label: 'Pending Approvals', value: '45', icon: AlertCircle, trend: 'Needs attention', color: 'text-amber-500' },
          { id: 'active-seg', label: 'Active Segments', value: '12', icon: CheckCircle, trend: 'All running smoothly', color: 'text-purple-500' },
        ].map((stat) => (
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
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${cardBg}`}>
          <div className="mb-6">
            <h3 className={`text-xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Registration Trends</h3>
            <p className={`${mutedText} text-sm`}>New user signups over the past 7 days</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="mb-6 flex justify-between items-center">
            <h3 className={`text-xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Recent Activity</h3>
            <button className={`text-[#588157] hover:text-[#a3b18a] text-sm font-medium`}>View all</button>
          </div>
          <div className="space-y-6">
            {[
              { id: 'act-1', title: 'New team registered', desc: 'Team "CyberKnights" joined Robo Wars.', time: '2 mins ago', icon: Users, color: 'text-blue-500' },
              { id: 'act-2', title: 'Payment verified', desc: 'Payment received for "MechMinds".', time: '1 hour ago', icon: CheckCircle, color: 'text-[#588157]' },
              { id: 'act-3', title: 'Schedule updated', desc: 'Line Follower moved to Arena B.', time: '3 hours ago', icon: CalendarIcon, color: 'text-purple-500' },
              { id: 'act-4', title: 'Sponsorship inquiry', desc: 'TechCorp reached out for Gold tier.', time: '5 hours ago', icon: TrendingUp, color: 'text-amber-500' },
              { id: 'act-5', title: 'Pending Approval', desc: 'Team "ScrapBots" needs document review.', time: '1 day ago', icon: Clock, color: 'text-gray-400' },
            ].map((activity) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}