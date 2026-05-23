"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, MapPin, BadgeAlert } from 'lucide-react';
import { Link } from '@/lib/router-compat';

interface ScheduleItem {
  time: string;
  title: string;
  venue: string;
  type: string;
  current?: boolean;
}

const scheduleData: Record<string, ScheduleItem[]> = {
  day1: [
    { time: '09:00 AM', title: 'Opening Ceremony', venue: 'Main Auditorium', type: 'Opening' },
    { time: '10:30 AM', title: 'Robo Soccer - Group Stage', venue: 'Arena Alpha', type: 'Segment' },
    { time: '11:00 AM', title: 'Line Follower - Qualifying', venue: 'Track Beta', type: 'Segment' },
    { time: '01:00 PM', title: 'Lunch Break', venue: 'Cafeteria', type: 'Break' },
    { time: '02:30 PM', title: 'Combat Robotics - Prelims', venue: 'BattleBox Gamma', type: 'Segment', current: true },
    { time: '05:00 PM', title: 'Day 1 Closing Remarks', venue: 'Main Auditorium', type: 'Closing' }
  ],
  day2: [
    { time: '09:00 AM', title: 'Drone Race - Time Trials', venue: 'Outdoor Field', type: 'Segment' },
    { time: '11:00 AM', title: 'Sumo Bot - Round of 32', venue: 'Arena Alpha', type: 'Segment' },
    { time: '01:00 PM', title: 'Lunch Break', venue: 'Cafeteria', type: 'Break' },
    { time: '02:00 PM', title: 'Maze Solver - Attempts', venue: 'Lab Complex 2', type: 'Segment' },
    { time: '04:30 PM', title: 'App Dev Sprint - Kickoff', venue: 'Innovation Lab', type: 'Segment' }
  ],
  day3: [
    { time: '10:00 AM', title: 'Robo Soccer - Finals', venue: 'Main Stage', type: 'Segment' },
    { time: '11:30 AM', title: 'Combat Robotics - Grand Finale', venue: 'Main Stage', type: 'Segment' },
    { time: '01:30 PM', title: 'Lunch Break', venue: 'Cafeteria', type: 'Break' },
    { time: '03:00 PM', title: 'Award Ceremony & Gala', venue: 'Main Auditorium', type: 'Award' },
    { time: '06:00 PM', title: 'Event Closure', venue: 'Main Auditorium', type: 'Closing' }
  ]
};

const days = ['Day 1', 'Day 2', 'Day 3'];

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState('Day 1');

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 relative">
          {/* No glow blob */}
          <div className="text-gray-400 text-sm tracking-widest mb-6">
            <Link to="/" className="hover:text-white transition-colors">HOME</Link> / SCHEDULE
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 relative z-10" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Event Timeline.
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Plan your visit. 3 days of non-stop robotics action, engineering battles, and innovation showcases.
          </p>
        </div>

        {/* Day Tabs */}
        <div className="flex justify-center gap-4 mb-16 relative z-10">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 border ${
                activeDay === day 
                  ? 'bg-[rgba(88,129,87,0.12)] border-[#588157] text-[#a3b18a]' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative pl-6 md:pl-0">
          {/* Vertical Line */}
          <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

          <div className="space-y-12 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                {scheduleData[activeDay.toLowerCase().replace(' ', '') as keyof typeof scheduleData].map((item, i) => (
                  <div key={i} className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    {/* Time (Mobile hidden) */}
                    <div className={`hidden md:block w-1/2 ${i % 2 === 0 ? 'text-left pl-12' : 'text-right pr-12'}`}>
                      <div className={`text-2xl font-bold ${item.current ? 'text-[#a3b18a]' : 'text-white'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {item.time}
                      </div>
                      <div className="text-gray-500 text-sm uppercase tracking-widest mt-1">GMT+6</div>
                    </div>

                    {/* Node */}
                    <div className={`absolute left-[39px] md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-[#0A0A0F] ${
                      item.current ? 'bg-[#588157]' : 'bg-gray-600'
                    }`} />

                    {/* Card */}
                    <div className={`w-full md:w-1/2 ml-16 md:ml-0 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                      <div className={`p-6 rounded-2xl bg-white/[0.02] border backdrop-blur-sm transition-colors duration-300 ${
                        item.current ? 'border-[#3a5a40] shadow-[0_2px_12px_rgba(0,0,0,0.20)]' : 'border-white/5 hover:border-white/20'
                      }`}>
                        {/* Time (Mobile only) */}
                        <div className="md:hidden text-[#a3b18a] font-bold mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {item.time}
                        </div>

                        <div className="flex justify-between items-start gap-4 mb-4">
                          <h3 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                            item.type === 'Opening' || item.type === 'Award' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                            item.type === 'Segment' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                            item.type === 'Break' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' :
                            'bg-white/5 text-gray-300 border border-white/10'
                          }`}>
                            {item.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin className="w-4 h-4" />
                          {item.venue}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}