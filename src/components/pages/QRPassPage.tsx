"use client";
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { QRGenerator } from '@/components/dashboard/QRGenerator';

export default function QRPassPage() {
  const { isDark } = useResolvedTheme();

  const [selectedEvent, setSelectedEvent] = useState('robo-soccer');

  const events = [
    { id: 'robo-soccer', name: 'Robo Soccer', uniqueId: 'RSF-2026-001234' },
    { id: 'line-follower', name: 'Line Follower', uniqueId: 'RSF-2026-001235' },
    { id: 'sumo-bot', name: 'Sumo Bot', uniqueId: 'RSF-2026-001236' },
  ];

  const currentEvent = events.find((e) => e.id === selectedEvent) || events[0];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1
          className={`text-3xl sm:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          QR Entry Pass
        </h1>
        <p className={`text-base sm:text-lg ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
          Generate and download your entry QR codes for events
        </p>
      </div>

      {/* Event Selector */}
      <div className="mb-8">
        <label
          className={`block text-sm font-medium mb-3 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}
        >
          Select Event
        </label>
        <div className="flex flex-wrap gap-3">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedEvent === event.id
                  ? isDark
                    ? 'bg-[#588157]/20 text-[#a3b18a] border-2 border-[#588157]/50'
                    : 'bg-[#588157]/15 text-[#3a5a40] border-2 border-[#588157]/40'
                  : isDark
                  ? 'bg-white/5 text-[#9A9A8E] border-2 border-transparent hover:bg-white/10'
                  : 'bg-black/5 text-[#8a8a7a] border-2 border-transparent hover:bg-black/10'
              }`}
            >
              {event.name}
            </button>
          ))}
        </div>
      </div>

      {/* QR Code */}
      <motion.div
        key={selectedEvent}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <QRGenerator
          eventName={currentEvent.name}
          userName="Alex Rivera"
          uniqueId={currentEvent.uniqueId}
        />
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 p-6 rounded-2xl backdrop-blur-md"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(58,90,64,0.06) 0%, rgba(163,177,138,0.03) 100%)'
            : 'linear-gradient(135deg, rgba(58,90,64,0.04) 0%, rgba(163,177,138,0.02) 100%)',
          border: `1px solid ${isDark ? 'rgba(163,177,138,0.12)' : 'rgba(58,90,64,0.15)'}`,
        }}
      >
        <h3
          className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          How to Use Your QR Pass
        </h3>
        <ul className={`space-y-3 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#588157]/20 text-[#588157] flex items-center justify-center text-sm font-bold">
              1
            </span>
            <span>Download or screenshot your QR code before arriving at the venue</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#588157]/20 text-[#588157] flex items-center justify-center text-sm font-bold">
              2
            </span>
            <span>Show the QR code at the registration desk for quick check-in</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#588157]/20 text-[#588157] flex items-center justify-center text-sm font-bold">
              3
            </span>
            <span>Keep your QR code accessible throughout the event for verification</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#588157]/20 text-[#588157] flex items-center justify-center text-sm font-bold">
              4
            </span>
            <span>Each QR code is unique to you and cannot be shared or transferred</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
