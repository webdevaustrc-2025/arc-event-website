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
      <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-6 bg-background">
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
          <Link to="/" className="text-sm tracking-widest hover:text-[var(--text-heading)] transition-colors" style={{ color: 'var(--text-body)' }}>
            ← BACK TO HOME
          </Link>
        </div>

        {/* Closed State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl border rounded-3xl p-10 text-center relative overflow-hidden"
          style={{
            background: 'var(--glass-panel-bg)',
            borderColor: 'var(--glass-panel-border)',
            boxShadow: 'var(--glass-panel-shadow)',
          }}
        >
          {/* Accent border — red since registration is closed */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-red-400">
            <XCircle className="w-8 h-8" />
          </div>

          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: "'Space Grotesk', sans-serif" }}>
            Registration Closed
          </h2>

          <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-body)' }}>
            We've reached our maximum capacity. Registration for {details.eventName} is now closed. Thank you for your interest!
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="rounded-xl p-4 border" style={{ background: 'var(--glass-panel-bg)', borderColor: 'var(--glass-panel-border)' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-heading)' }}>500+</div>
              <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Teams Registered</div>
            </div>
            <div className="rounded-xl p-4 border" style={{ background: 'var(--glass-panel-bg)', borderColor: 'var(--glass-panel-border)' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-heading)' }}>100%</div>
              <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Capacity Reached</div>
            </div>
          </div>

          {/* Event Date */}
          <div className="rounded-xl p-4 mb-6 border" style={{ background: 'var(--glass-panel-bg)', borderColor: 'var(--glass-panel-border)' }}>
            <div className="flex items-center justify-center gap-2" style={{ color: 'var(--text-body)' }}>
              <Calendar className="w-4 h-4 text-[#588157]" />
              <span className="text-sm">Event Date: <span className="font-semibold" style={{ color: 'var(--text-heading)' }}>{details.eventDate}</span></span>
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
              className="block w-full border py-3 rounded-xl font-semibold transition-colors"
              style={{
                background: 'var(--input-background)',
                borderColor: 'var(--glass-panel-border)',
                color: 'var(--text-heading)',
              }}
            >
              Back to Home
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm flex items-center justify-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <Mail className="w-4 h-4" />
              Questions? Email us at{' '}
              <a href={`mailto:${details.contactEmail}`} className="text-[#588157] hover:underline">
                {details.contactEmail}
              </a>
            </p>
          </div>
        </motion.div>

        <div className="mt-8 text-center text-sm flex items-center justify-center gap-2" style={{ color: 'var(--text-muted)' }}>
          <ShieldCheck className="w-4 h-4" />
          <span>See you at {details.eventName}</span>
        </div>
      </div>
    </div>
  );
}