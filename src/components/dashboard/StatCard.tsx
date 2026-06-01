"use client";
import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, trend, color = 'text-[#588157]' }) => {
  const { isDark } = useResolvedTheme();

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative p-6 rounded-2xl backdrop-blur-md transition-all duration-300 overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(58,90,64,0.06) 0%, rgba(163,177,138,0.03) 100%)'
          : 'linear-gradient(135deg, rgba(58,90,64,0.04) 0%, rgba(163,177,138,0.02) 100%)',
        border: `1px solid ${isDark ? 'rgba(163,177,138,0.12)' : 'rgba(58,90,64,0.15)'}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      {/* Glow Effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(88,129,87,0.15) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110"
            style={{
              background: isDark ? 'rgba(88,129,87,0.1)' : 'rgba(88,129,87,0.08)',
            }}
          >
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          {trend && (
            <span className={`text-xs font-medium ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
              {trend}
            </span>
          )}
        </div>

        <h3
          className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {value}
        </h3>
        <p className={`text-sm font-medium ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>{label}</p>
      </div>
    </motion.div>
  );
};
