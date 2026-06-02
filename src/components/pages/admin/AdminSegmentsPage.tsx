"use client";
import React from 'react';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { Plus, Edit2, Trash2, Users, Trophy, Clock } from 'lucide-react';

const segmentsData = [
  { id: 1, title: 'Robo Wars', participants: 48, prize: '$5,000', status: 'Active', duration: '3 Hours', color: 'from-orange-500/20 to-red-500/20' },
  { id: 2, title: 'Line Follower', participants: 32, prize: '$2,000', status: 'Active', duration: '2 Hours', color: 'from-blue-500/20 to-cyan-500/20' },
  { id: 3, title: 'Drone Racing', participants: 24, prize: '$3,500', status: 'Upcoming', duration: '4 Hours', color: 'from-purple-500/20 to-pink-500/20' },
  { id: 4, title: 'AI Hackathon', participants: 150, prize: '$10,000', status: 'Registration Open', duration: '24 Hours', color: 'from-[#588157]/20 to-[#a3b18a]/20' },
  { id: 5, title: 'Maze Solver', participants: 20, prize: '$1,500', status: 'Active', duration: '1.5 Hours', color: 'from-amber-500/20 to-yellow-500/20' },
];

export default function AdminSegmentsPage() {
  const { isDark } = useResolvedTheme();
  const cardBg = isDark ? 'bg-[#111116] border-white/[0.07] hover:bg-[#111116]' : 'bg-white border-black/[0.08] hover:shadow-[0_2px_12px_rgba(0,0,0,0.12)]';
  const textColor = isDark ? 'text-[#F5F5F0]' : 'text-[#1a1a14]';
  const mutedText = isDark ? 'text-[#9A9A8E]' : 'text-[#4a4a40]';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${textColor} mb-2`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Segments & Events</h1>
          <p className={`${mutedText} text-lg`}>Manage the competitions and special events of ARC 3.0.</p>
        </div>
        <button className={`px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex items-center gap-2 bg-[#3a5a40] text-white hover:bg-[#344e41]`}>
          <Plus className="w-4 h-4" />
          Create Segment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {segmentsData.map((segment) => (
          <div key={segment.id} className={`group relative p-6 rounded-2xl border transition-all duration-300 ${cardBg} overflow-hidden flex flex-col h-full`}>
            {/* Background Gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${segment.color} blur-3xl rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity`} />

            <div className="flex justify-between items-start mb-6 relative z-10">
              <h3 className={`text-xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{segment.title}</h3>
              <div className="flex gap-2">
                <button className={`p-1.5 rounded-lg transition-colors ${isDark ? 'bg-white/5 hover:bg-white/20 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className={`p-1.5 rounded-lg transition-colors ${isDark ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'}`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4 flex-1 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Users className={`w-4 h-4 ${mutedText}`} />
                  <span className={mutedText}>Participants</span>
                </div>
                <span className={`font-semibold ${textColor}`}>{segment.participants} Registered</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className={`w-4 h-4 text-yellow-500`} />
                  <span className={mutedText}>Prize Pool</span>
                </div>
                <span className={`font-semibold text-yellow-500`}>{segment.prize}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className={`w-4 h-4 ${mutedText}`} />
                  <span className={mutedText}>Duration</span>
                </div>
                <span className={`font-semibold ${textColor}`}>{segment.duration}</span>
              </div>
            </div>

            <div className={`mt-6 pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-100'} flex items-center justify-between relative z-10`}>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${segment.status === 'Active'
                  ? (isDark ? 'bg-[#588157]/10 text-[#a3b18a] border-[#588157]/20' : 'bg-[#3a5a40]/10 text-[#3a5a40] border-[#3a5a40]/20')
                  : segment.status === 'Upcoming'
                    ? (isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-100 text-blue-700 border-blue-200')
                    : (isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-100 text-purple-700 border-purple-200')
                }`}>
                {segment.status}
              </span>
              <button className={`text-sm font-medium hover:underline text-[#588157] hover:text-[#a3b18a]`}>
                Manage Teams
              </button>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button className={`group flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all duration-300 min-h-[300px] ${isDark
            ? 'border-white/20 hover:border-[#588157] hover:bg-[rgba(88,129,87,0.08)] text-[#9A9A8E] hover:text-[#a3b18a]'
            : 'border-black/20 hover:border-[#3a5a40] hover:bg-[rgba(58,90,64,0.06)] text-[#4a4a40] hover:text-[#344e41]'
          }`}>
          <div className="w-16 h-16 rounded-full bg-current/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8" />
          </div>
          <span className="font-semibold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Create New Segment</span>
          <span className="text-sm opacity-70 mt-2">Add a new competition or event</span>
        </button>
      </div>
    </div>
  );
}