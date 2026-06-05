"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { XCircle, ShieldCheck, Calendar, Mail, Loader2 } from 'lucide-react';
import { Link } from '@/lib/router-compat';

export default function ClosedRegistrationPage() {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({
    eventName: 'ARC 3.0',
    eventDate: 'June 15-17, 2026',
    contactEmail: 'support@austrc-fest.org',
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const settings = await res.json();
          setDetails({
            eventName: settings.event_name || 'ARC 3.0',
            eventDate: settings.event_date || 'June 15-17, 2026',
            contactEmail: settings.contact_email || 'support@austrc-fest.org',
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-6 bg-[#0A0A0F]">
        <Loader2 className="w-10 h-10 animate-spin text-[#588157]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-6">
      {/* No glow blob — clean flat design */}

      <div className="relative z-10 w-full max-w-lg">
        {/* Nav Link */}
        <div className="text-center mb-12">
          <Link to="/" className="text-gray-400 text-sm tracking-widest hover:text-white transition-colors">
            ← BACK TO HOME
          </Link>
        </div>

        {/* Closed State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111116]/90 backdrop-blur-xl border border-white/[0.07] rounded-3xl p-10 text-center shadow-[0_2px_12px_rgba(0,0,0,0.30)] relative overflow-hidden"
        >
          {/* Accent border — red since registration is closed */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-red-400">
            <XCircle className="w-8 h-8" />
          </div>

          <h2 className="text-4xl font-bold mb-4 text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Registration Closed
          </h2>

          <p className="text-gray-400 mb-8 leading-relaxed">
            We've reached our maximum capacity. Registration for {details.eventName} is now closed. Thank you for your interest!
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-[#a3b18a] mb-1">500+</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Teams Registered</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-[#a3b18a] mb-1">100%</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Capacity Reached</div>
            </div>
          </div>

          {/* Event Date */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <Calendar className="w-4 h-4 text-[#588157]" />
              <span className="text-sm">Event Date: <span className="font-semibold text-white">{details.eventDate}</span></span>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Link
              to="/schedule"
              className="block w-full bg-[#3a5a40] text-white py-3 rounded-xl font-bold hover:bg-[#344e41] transition-colors"
            >
              View Event Schedule
            </Link>
            <Link
              to="/"
              className="block w-full bg-white/5 border border-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              Back to Home
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              Questions? Email us at{' '}
              <a href={`mailto:${details.contactEmail}`} className="text-[#588157] hover:underline">
                {details.contactEmail}
              </a>
            </p>
          </div>
        </motion.div>

        <div className="mt-8 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>See you at {details.eventName}</span>
        </div>
      </div>
    </div>
  );
}