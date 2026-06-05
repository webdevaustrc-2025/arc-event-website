"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Award, Filter, Loader2, Lock } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link } from '@/lib/router-compat';

export default function LeaderboardPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || !theme;
  const [selectedEvent, setSelectedEvent] = useState('overall');
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [leaderboard, setLeaderboard] = useState<Array<{
    rank: number;
    name: string;
    university: string;
    points: number;
    avatar: string;
    isCurrentUser?: boolean;
  }>>([]);

  const events = [
    { id: 'overall', name: 'Overall Ranking' },
    { id: 'robo-soccer', name: 'Robo Soccer' },
    { id: 'line-follower', name: 'Line Follower' },
    { id: 'sumo-bot', name: 'Sumo Bot' },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, leaderboardRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/dashboard/leaderboard'),
        ]);

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          setEnabled(settings.enable_leaderboard !== 'false');
        }

        if (leaderboardRes.ok) {
          const leaderboardData = await leaderboardRes.json();
          setLeaderboard(leaderboardData);
        }
      } catch (err) {
        console.error('Error loading leaderboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return null;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#588157]" />
        <p className="text-gray-400 text-sm">Loading leaderboard...</p>
      </div>
    );
  }

  if (!enabled) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto px-4">
        <div className={`p-5 rounded-full mb-6 ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-700'}`}>
          <Lock className="w-12 h-12" />
        </div>
        <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Leaderboard Unavailable
        </h2>
        <p className={`text-sm leading-relaxed mb-8 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
          The public leaderboard is currently locked by the event administrators. Rankings will be displayed once the competition results are officially published.
        </p>
        <Link to="/" className="px-6 py-2.5 rounded-lg bg-[#3a5a40] text-white hover:bg-[#344e41] font-semibold transition-all">
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1
          className={`text-3xl sm:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Leaderboard
        </h1>
        <p className={`text-base sm:text-lg ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
          See where you stand among all participants
        </p>
      </div>

      {/* Event Filter */}
      <div className="mb-8">
        <div className={`flex items-center gap-2 mb-4 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filter by Event:</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event.id)}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                selectedEvent === event.id
                  ? isDark
                    ? 'bg-[#588157]/20 text-[#a3b18a] border border-[#588157]/30'
                    : 'bg-[#588157]/15 text-[#3a5a40] border border-[#588157]/25'
                  : isDark
                  ? 'text-[#9A9A8E] hover:bg-white/5 border border-transparent'
                  : 'text-[#8a8a7a] hover:bg-black/5 border border-transparent'
              }`}
            >
              {event.name}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl overflow-hidden backdrop-blur-md"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(58,90,64,0.06) 0%, rgba(163,177,138,0.03) 100%)'
            : 'linear-gradient(135deg, rgba(58,90,64,0.04) 0%, rgba(163,177,138,0.02) 100%)',
          border: `1px solid ${isDark ? 'rgba(163,177,138,0.12)' : 'rgba(58,90,64,0.15)'}`,
        }}
      >
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr
                className={`border-b ${isDark ? 'border-white/10' : 'border-black/10'}`}
                style={{
                  background: isDark ? 'rgba(88,129,87,0.08)' : 'rgba(88,129,87,0.05)',
                }}
              >
                <th className="text-left px-6 py-4 font-semibold text-sm uppercase tracking-wider">
                  Rank
                </th>
                <th className="text-left px-6 py-4 font-semibold text-sm uppercase tracking-wider">
                  Team
                </th>
                <th className="text-left px-6 py-4 font-semibold text-sm uppercase tracking-wider">
                  University
                </th>
                <th className="text-right px-6 py-4 font-semibold text-sm uppercase tracking-wider">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => (
                <motion.tr
                  key={entry.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  className={`border-b transition-colors ${
                    entry.isCurrentUser
                      ? isDark
                        ? 'bg-[#588157]/10 border-[#588157]/30'
                        : 'bg-[#588157]/8 border-[#588157]/25'
                      : isDark
                      ? 'border-white/5 hover:bg-white/5'
                      : 'border-black/5 hover:bg-black/5'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getRankIcon(entry.rank) || (
                        <span
                          className={`text-lg font-bold ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {entry.rank}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={entry.avatar}
                        alt={entry.name}
                        className="w-10 h-10 rounded-full"
                        style={{
                          background: isDark ? 'rgba(88,129,87,0.1)' : 'rgba(88,129,87,0.08)',
                        }}
                      />
                      <div>
                        <p
                          className={`font-semibold ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
                        >
                          {entry.name}
                        </p>
                        {entry.isCurrentUser && (
                          <span className="text-xs font-semibold text-[#588157]">You</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}>
                      {entry.university}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-lg font-bold ${isDark ? 'text-[#a3b18a]' : 'text-[#3a5a40]'}`}
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {entry.points}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
