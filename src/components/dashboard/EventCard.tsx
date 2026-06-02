"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, Hash, Users, CreditCard } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link } from '@/lib/router-compat';

interface EventCardProps {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  image?: string;
  segmentId?: number | null;
  registrationCode?: string;
  registrationDate?: string;
  teamName?: string;
  registrationStatus?: string;
  paymentStatus?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  date,
  time,
  location,
  status,
  image,
  segmentId,
  registrationCode,
  registrationDate,
  teamName,
  registrationStatus,
  paymentStatus,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || !theme;

  const statusColors = {
    upcoming: { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)', text: '#60a5fa' },
    ongoing: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)', text: '#4ade80' },
    completed: { bg: 'rgba(156, 163, 175, 0.15)', border: 'rgba(156, 163, 175, 0.3)', text: '#9ca3af' },
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl overflow-hidden backdrop-blur-md"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(58,90,64,0.06) 0%, rgba(163,177,138,0.03) 100%)'
          : 'linear-gradient(135deg, rgba(58,90,64,0.04) 0%, rgba(163,177,138,0.02) 100%)',
        border: `1px solid ${isDark ? 'rgba(163,177,138,0.12)' : 'rgba(58,90,64,0.15)'}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      {/* Image */}
      {image && (
        <div className="relative h-40 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(58,90,64,0.6) 100%)',
            }}
          />

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span
              className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase backdrop-blur-md"
              style={{
                background: statusColors[status].bg,
                border: `1px solid ${statusColors[status].border}`,
                color: statusColors[status].text,
              }}
            >
              {status}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3
          className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#1a1a14]'} group-hover:text-[#588157] transition-colors`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {title}
        </h3>

        <div className="space-y-3 mb-6">
          {registrationCode && (
            <div className="flex items-center gap-2.5 text-sm">
              <Hash className="w-4 h-4 text-[#588157]" />
              <span className={isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}>{registrationCode}</span>
            </div>
          )}
          {teamName && (
            <div className="flex items-center gap-2.5 text-sm">
              <Users className="w-4 h-4 text-[#588157]" />
              <span className={isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}>{teamName}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5 text-sm">
            <Calendar className="w-4 h-4 text-[#588157]" />
            <span className={isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}>{date}</span>
          </div>
          {registrationDate && (
            <div className="flex items-center gap-2.5 text-sm">
              <Calendar className="w-4 h-4 text-[#588157]" />
              <span className={isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}>Registered {registrationDate}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5 text-sm">
            <Clock className="w-4 h-4 text-[#588157]" />
            <span className={isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}>{time}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <MapPin className="w-4 h-4 text-[#588157]" />
            <span className={isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}>{location}</span>
          </div>
          {(registrationStatus || paymentStatus) && (
            <div className="flex items-center gap-2.5 text-sm">
              <CreditCard className="w-4 h-4 text-[#588157]" />
              <span className={`capitalize ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
                {[registrationStatus, paymentStatus].filter(Boolean).join(' / ')}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to={`/event/${segmentId ?? id}`}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-center transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #3a5a40 0%, #344e41 100%)',
              color: '#ffffff',
            }}
          >
            View Details
          </Link>
          {status !== 'completed' && (
            <Link
              to="/dashboard/qr-pass"
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-center transition-all duration-300 hover:scale-105"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${isDark ? 'rgba(163,177,138,0.2)' : 'rgba(58,90,64,0.2)'}`,
                color: '#588157',
              }}
            >
              QR Pass
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};
