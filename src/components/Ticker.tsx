"use client";
import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from 'next-themes';

const stats = [
  "500+ Participants",
  "৳1,00,000 Prize Pool",
  "12 Segments",
  "3 Days of Competition",
  "20+ Sponsors",
  "Top Universities"
];

export const Ticker = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || !theme;

  return (
    <div className={`w-full border-y overflow-hidden py-4 ${
      isDark
        ? 'bg-[#111116] border-white/[0.06]'
        : 'bg-[#F0EDE6] border-black/[0.06]'
    }`}>
      <div className="relative flex max-w-[100vw] overflow-hidden">
        <motion.div 
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            ease: "linear",
            duration: 15, 
            repeat: Infinity 
          }}
        >
          {[...stats, ...stats, ...stats, ...stats].map((stat, i) => (
            <div key={i} className="flex items-center">
              <span className={`text-[13px] sm:text-sm tracking-widest uppercase font-mono px-6 sm:px-8 ${isDark ? 'text-[#9A9A8E]' : 'text-[#4a4a40]'}`}>
                {stat}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#588157]" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};