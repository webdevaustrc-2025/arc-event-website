"use client";
import React, { useState, useEffect } from 'react';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { 
  Trophy, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  Filter,
  Users,
  Eye,
  EyeOff,
  ArrowUpDown
} from 'lucide-react';

interface LeaderboardEntry {
  userId: number;
  userName: string;
  teamName: string;
  university: string;
  avatarUrl: string;
  points: number;
  rank: number;
}

interface Segment {
  id: number;
  name: string;
}

export default function AdminLeaderboardPage() {
  const { isDark } = useResolvedTheme();
  const [segments, setSegments] = useState<Segment[]>([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState<number | null>(null);
  const [resultDeclared, setResultDeclared] = useState(false);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loadingSegments, setLoadingSegments] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const cardBg = isDark ? 'bg-[#111116] border-white/[0.07]' : 'bg-white border-black/[0.08]';
  const textColor = isDark ? 'text-[#F5F5F0]' : 'text-[#1a1a14]';
  const mutedText = isDark ? 'text-[#9A9A8E]' : 'text-[#4a4a40]';
  
  const inputStyle = `w-24 px-3 py-1.5 rounded-lg border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#588157]/40 transition-all text-center ${
    isDark ? 'bg-[#18181f] border-white/[0.07] text-[#F5F5F0]' : 'bg-white border-gray-300 text-gray-900'
  }`;

  const selectStyle = `w-full md:w-64 px-3 py-2 rounded-lg border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#588157]/40 transition-all ${
    isDark ? 'bg-[#18181f] border-white/[0.07] text-[#F5F5F0]' : 'bg-white border-gray-300 text-gray-900'
  }`;

  // 1. Fetch segments list
  useEffect(() => {
    async function loadSegments() {
      try {
        const res = await fetch('/api/segments');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setSegments(data);
            if (data.length > 0) {
              setSelectedSegmentId(data[0].id);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching segments:', err);
      } finally {
        setLoadingSegments(false);
      }
    }
    loadSegments();
  }, []);

  // 2. Fetch leaderboard entries for chosen segment
  useEffect(() => {
    if (selectedSegmentId === null) return;

    async function loadLeaderboard() {
      setLoadingEntries(true);
      setMessage(null);
      try {
        const res = await fetch(`/api/admin/leaderboard?segmentId=${selectedSegmentId}`);
        if (res.ok) {
          const data = await res.json();
          setResultDeclared(!!data.resultDeclared);
          setEntries(data.entries || []);
        } else {
          console.error('Failed to fetch leaderboard data');
        }
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
      } finally {
        setLoadingEntries(false);
      }
    }
    loadLeaderboard();
  }, [selectedSegmentId]);

  // Helper to compute ranks based on points dynamically (Dense / Competition Ranking)
  const getComputedEntries = (list: LeaderboardEntry[]) => {
    const sorted = [...list].sort((a, b) => b.points - a.points);
    const rankMap = new Map<number, number>();

    let currentRank = 1;
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i].points !== sorted[i - 1].points) {
        currentRank = i + 1;
      }
      rankMap.set(sorted[i].userId, currentRank);
    }

    return list.map((entry) => ({
      ...entry,
      rank: rankMap.get(entry.userId) || 1,
    }));
  };

  // Sort state entries visually by points descending
  const sortEntriesByPoints = () => {
    setEntries((prev) =>
      [...prev].sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }
        return a.teamName.localeCompare(b.teamName);
      })
    );
  };

  // Handle local change in points input
  const handlePointsChange = (userId: number, value: string) => {
    const numericValue = parseInt(value) || 0;
    setEntries((prev) =>
      prev.map((entry) => (entry.userId === userId ? { ...entry, points: numericValue } : entry))
    );
  };

  // 3. Save leaderboard data
  const handleSave = async () => {
    if (selectedSegmentId === null) return;
    setSaving(true);
    setMessage(null);

    // Calculate dynamic ranks to save in database
    const computedList = getComputedEntries(entries);

    try {
      const res = await fetch('/api/admin/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          segmentId: selectedSegmentId,
          resultDeclared,
          entries: computedList.map((e) => ({
            userId: e.userId,
            points: e.points,
            rank: e.rank,
          })),
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Leaderboard saved and updated successfully!' });
        // Automatically sort visually after saving for a clean UI
        sortEntriesByPoints();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.message || 'Failed to save changes.' });
      }
    } catch (err) {
      console.error('Error saving leaderboard:', err);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loadingSegments) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#588157]" />
        <p className={mutedText}>Loading competition segments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${textColor} mb-2`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Leaderboard Manager</h1>
          <p className={`${mutedText} text-sm sm:text-base`}>Manage individual segment rankings and declare results for public display.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || selectedSegmentId === null}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold transition-all shadow-md flex items-center justify-center gap-2 bg-[#3a5a40] text-white hover:bg-[#344e41] disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Rankings
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Controls Card */}
      <div className={`p-6 rounded-2xl border ${cardBg} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#588157]" />
            <span className={`text-sm font-semibold ${textColor}`}>Select Segment:</span>
          </div>
          <select
            value={selectedSegmentId || ''}
            onChange={(e) => setSelectedSegmentId(parseInt(e.target.value))}
            className={selectStyle}
          >
            {segments.map((seg) => (
              <option key={seg.id} value={seg.id}>
                {seg.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={sortEntriesByPoints}
            disabled={entries.length === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all font-semibold text-sm disabled:opacity-50 ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-[#F5F5F0]'
                : 'bg-black/5 hover:bg-black/10 border-black/10 text-gray-800'
            }`}
          >
            <ArrowUpDown className="w-4 h-4 text-[#588157]" />
            Sort by Points
          </button>

          <button
            onClick={() => setResultDeclared((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all font-semibold text-sm ${
              resultDeclared
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {resultDeclared ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {resultDeclared ? 'Results Declared (Visible)' : 'Results Undeclared (Hidden)'}
          </button>
        </div>
      </div>

      {/* Leaderboard Table Editor */}
      {loadingEntries ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#588157]" />
          <p className={mutedText}>Fetching participants list...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border border-dashed ${isDark ? 'border-white/10' : 'border-black/10'}`}>
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className={`text-lg font-bold ${textColor} mb-1`}>No Registered Teams</h3>
          <p className={mutedText}>There are no teams currently registered for this segment.</p>
        </div>
      ) : (
        <div className={`rounded-2xl border overflow-hidden backdrop-blur-md ${cardBg}`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className={`border-b text-left ${isDark ? 'border-white/10' : 'border-black/10'} bg-[#588157]/5`}>
                  <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">Team</th>
                  <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">University</th>
                  <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider text-center">Rank</th>
                  <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider text-center">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {getComputedEntries(entries).map((entry) => (
                  <tr key={entry.userId} className={`${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'} transition-colors`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.avatarUrl}
                          alt={entry.userName}
                          className="w-10 h-10 rounded-full object-cover border"
                          style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
                        />
                        <div>
                          <p className={`font-semibold ${textColor}`}>{entry.teamName}</p>
                          <p className={`text-xs ${mutedText}`}>{entry.userName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={mutedText}>{entry.university}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${
                        entry.rank === 1
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : entry.rank === 2
                          ? 'bg-slate-400/10 text-slate-300 border border-slate-400/20'
                          : entry.rank === 3
                          ? 'bg-amber-700/10 text-amber-600 border border-amber-700/20'
                          : isDark
                          ? 'bg-white/5 text-gray-400 border border-white/5'
                          : 'bg-black/5 text-gray-500 border border-black/5'
                      }`}>
                        #{entry.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        min="0"
                        value={entry.points || ''}
                        onChange={(e) => handlePointsChange(entry.userId, e.target.value)}
                        className={inputStyle}
                        placeholder="e.g. 950"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
