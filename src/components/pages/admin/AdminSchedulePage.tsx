"use client";
import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Calendar, Clock, MapPin, Edit2, Trash2, Plus, GripVertical } from 'lucide-react';

const scheduleData = [
  {
    day: 'Day 1: Innovation',
    date: 'April 20, 2026',
    events: [
      { id: 1, time: '09:00 AM', title: 'Opening Ceremony', location: 'Main Auditorium', type: 'General' },
      { id: 2, time: '10:30 AM', title: 'AI Hackathon Kickoff', location: 'Innovation Lab', type: 'Competition' },
      { id: 3, time: '01:00 PM', title: 'Robotics Workshop', location: 'Room 304', type: 'Workshop' },
      { id: 4, time: '03:00 PM', title: 'Line Follower Prelims', location: 'Arena B', type: 'Competition' },
    ]
  },
  {
    day: 'Day 2: Competition',
    date: 'April 21, 2026',
    events: [
      { id: 5, time: '09:00 AM', title: 'Robo Wars Qualifiers', location: 'Main Arena', type: 'Competition' },
      { id: 6, time: '12:00 PM', title: 'Keynote Speaker: Dr. Alan Turing', location: 'Main Auditorium', type: 'Keynote' },
      { id: 7, time: '02:00 PM', title: 'Drone Racing Finals', location: 'Outdoor Field', type: 'Competition' },
    ]
  }
];

export default function AdminSchedulePage() {
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#111116] border-white/[0.07]' : 'bg-white border-black/[0.08]';
  const eventBg = isDark ? 'bg-[#18181f] border-white/[0.07] hover:bg-[#111116]' : 'bg-[#F0EDE6] border-black/[0.06] hover:bg-white hover:shadow-[0_2px_12px_rgba(0,0,0,0.12)]';
  const textColor = isDark ? 'text-[#F5F5F0]' : 'text-[#1a1a14]';
  const mutedText = isDark ? 'text-[#9A9A8E]' : 'text-[#4a4a40]';

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Competition': return isDark ? 'text-orange-400 bg-orange-400/10 border-orange-400/20' : 'text-orange-700 bg-orange-100 border-orange-200';
      case 'General': return isDark ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-blue-700 bg-blue-100 border-blue-200';
      case 'Workshop': return isDark ? 'text-purple-400 bg-purple-400/10 border-purple-400/20' : 'text-purple-700 bg-purple-100 border-purple-200';
      case 'Keynote': return isDark ? 'text-[#a3b18a] bg-[#588157]/10 border-[#588157]/20' : 'text-[#344e41] bg-[#3a5a40]/10 border-[#3a5a40]/20';
      default: return isDark ? 'text-gray-400 bg-gray-400/10 border-gray-400/20' : 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${textColor} mb-2`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Schedule Manager</h1>
          <p className={`${mutedText} text-lg`}>Update event timings, locations, and manage the daily agenda.</p>
        </div>
        <button className={`px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex items-center gap-2 bg-[#3a5a40] text-white hover:bg-[#344e41]`}>
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="space-y-10">
        {scheduleData.map((dayGroup, i) => (
          <div key={i} className={`p-6 rounded-2xl border ${cardBg}`}>
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
              <div>
                <h2 className={`text-2xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{dayGroup.day}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className={`w-4 h-4 ${mutedText}`} />
                  <span className={mutedText}>{dayGroup.date}</span>
                </div>
              </div>
              <button className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                isDark ? 'border-white/10 hover:bg-white/5 text-gray-300' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}>
                Edit Day Details
              </button>
            </div>

            <div className="space-y-3">
              {dayGroup.events.map((event) => (
                <div key={event.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${eventBg} group cursor-move`}>
                  <div className={`p-2 cursor-grab text-gray-400 opacity-50 group-hover:opacity-100 transition-opacity`}>
                    <GripVertical className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Time */}
                    <div className="md:col-span-2 flex items-center gap-2">
                      <Clock className={`w-4 h-4 text-[#588157]`} />
                      <span className={`font-medium ${textColor}`}>{event.time}</span>
                    </div>
                    
                    {/* Event Title */}
                    <div className="md:col-span-5">
                      <h4 className={`font-semibold ${textColor}`}>{event.title}</h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border mt-2 ${getTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="md:col-span-3 flex items-center gap-2">
                      <MapPin className={`w-4 h-4 ${mutedText}`} />
                      <span className={mutedText}>{event.location}</span>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-2 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button className={`w-full py-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-colors ${
                isDark 
                  ? 'border-white/10 text-gray-500 hover:text-white hover:border-white/30 hover:bg-white/5' 
                  : 'border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50'
              }`}>
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add Event</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}