"use client";
import React, { useState } from 'react';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { Search, Filter, MoreVertical, Check, X, Shield, Users } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Alex Johnson', email: 'alex@example.com', team: 'CyberKnights', role: 'Captain', status: 'Approved', segment: 'Robo Wars' },
  { id: 2, name: 'Sam Smith', email: 'sam@example.com', team: 'MechMinds', role: 'Member', status: 'Pending', segment: 'Line Follower' },
  { id: 3, name: 'Jordan Lee', email: 'jordan@example.com', team: 'ScrapBots', role: 'Captain', status: 'Rejected', segment: 'Drone Racing' },
  { id: 4, name: 'Taylor Swift', email: 'taylor@example.com', team: 'SparkPlugs', role: 'Member', status: 'Approved', segment: 'Hackathon' },
  { id: 5, name: 'Casey Jones', email: 'casey@example.com', team: 'CircuitBreakers', role: 'Captain', status: 'Pending', segment: 'Robo Wars' },
  { id: 6, name: 'Riley Reid', email: 'riley@example.com', team: 'CircuitBreakers', role: 'Member', status: 'Pending', segment: 'Robo Wars' },
  { id: 7, name: 'Morgan Freeman', email: 'morgan@example.com', team: 'AutoBots', role: 'Captain', status: 'Approved', segment: 'AI Challenge' },
];

export default function AdminUsersPage() {
  const { isDark } = useResolvedTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const cardBg = isDark ? 'bg-[#111116] border-white/[0.07]' : 'bg-white border-black/[0.08]';
  const inputBg = isDark ? 'bg-[#18181f] border-white/[0.07] text-[#F5F5F0]' : 'bg-[#F0EDE6] border-black/[0.08] text-[#1a1a14]';
  const textColor = isDark ? 'text-[#F5F5F0]' : 'text-[#1a1a14]';
  const mutedText = isDark ? 'text-[#9A9A8E]' : 'text-[#4a4a40]';

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${textColor} mb-2`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Users & Teams</h1>
          <p className={`${mutedText} text-lg`}>Manage registrations, approve teams, and monitor participants.</p>
        </div>
        <button className={`px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex items-center gap-2 bg-[#3a5a40] text-white hover:bg-[#344e41]`}>
          <Users className="w-4 h-4" />
          Add Participant
        </button>
      </div>

      <div className={`p-6 rounded-2xl border ${cardBg}`}>
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:w-96">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${mutedText}`} />
            <input 
              type="text" 
              placeholder="Search by name, team, or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#588157]/40 transition-all ${inputBg}`}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${cardBg} ${textColor} hover:bg-white/5 transition-colors`}>
              <Filter className="w-4 h-4" />
              Filter Status
            </button>
            <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${cardBg} ${textColor} hover:bg-white/5 transition-colors`}>
              <Shield className="w-4 h-4" />
              Role
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-transparent">
          <table className={`w-full text-left border-collapse ${textColor}`}>
            <thead>
              <tr className={`border-b ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'} text-sm uppercase tracking-wider ${mutedText}`}>
                <th className="p-4 font-medium">Participant</th>
                <th className="p-4 font-medium">Team & Segment</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <tr key={user.id} className={`border-b ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold">{user.name}</span>
                      <span className={`text-sm ${mutedText}`}>{user.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{user.team}</span>
                      <span className={`text-sm ${mutedText}`}>{user.segment}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      user.role === 'Captain' 
                        ? (isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-100 text-purple-700 border-purple-200')
                        : (isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-100 text-blue-700 border-blue-200')
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      user.status === 'Approved'
                        ? (isDark ? 'bg-[#588157]/10 text-[#a3b18a] border-[#588157]/20' : 'bg-[#3a5a40]/10 text-[#3a5a40] border-[#3a5a40]/20')
                        : user.status === 'Pending'
                        ? (isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-100 text-amber-700 border-amber-200')
                        : (isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-100 text-red-700 border-red-200')
                    }`}>
                      {user.status === 'Approved' && <Check className="w-3 h-3" />}
                      {user.status === 'Rejected' && <X className="w-3 h-3" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}>
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No users found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className={`mt-6 flex items-center justify-between border-t ${isDark ? 'border-white/10' : 'border-gray-200'} pt-4`}>
          <span className={`text-sm ${mutedText}`}>Showing 1 to {filteredUsers.length} of {mockUsers.length} entries</span>
          <div className="flex gap-2">
            <button className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`} disabled>Previous</button>
            <button className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}