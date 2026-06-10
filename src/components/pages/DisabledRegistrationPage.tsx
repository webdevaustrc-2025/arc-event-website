"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { Link } from '@/lib/router-compat';

export default function DisabledRegistrationPage() {
  const [email, setEmail] = useState('');
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

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you! We will notify you when registration opens.');
    setEmail('');
  };

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

        {/* Locked State */}
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
          {/* Clean accent top border */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#3a5a40]" />

          <div className="w-20 h-20 bg-[rgba(88,129,87,0.12)] rounded-full flex items-center justify-center mx-auto mb-8 text-[#588157]">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: "'Space Grotesk', sans-serif" }}>
            Registration Disabled
          </h2>

          <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-body)' }}>
            Official registration for {details.eventName} is not open yet. Secure your spot by joining the waitlist to be notified instantly.
          </p>

          {/* Countdown */}
          <div className="flex justify-center gap-4 mb-10">
            {[
              { label: 'DAYS', value: '10' },
              { label: 'HOURS', value: '08' },
              { label: 'MINS', value: '45' },
              { label: 'SECS', value: '20' }
            ].map((t, i) => (
              <div key={i} className="w-16 h-16 border rounded-xl flex flex-col items-center justify-center"
                style={{
                  background: 'var(--glass-panel-bg)',
                  borderColor: 'var(--glass-panel-border)',
                  boxShadow: 'var(--glass-panel-shadow)',
                }}
              >
                <div className="font-bold text-xl" style={{ color: 'var(--text-heading)' }}>{t.value}</div>
                <div className="text-[10px] font-medium tracking-wider" style={{ color: 'var(--text-muted)' }}>{t.label}</div>
              </div>
            ))}
          </div>

          {/* Notify Form */}
          <form onSubmit={handleNotifySubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your student email"
                className="w-full bg-[var(--input-background)] border border-[var(--glass-panel-border)] rounded-xl py-4 pl-12 pr-4 text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#588157] transition-all duration-300"
                required
              />
            </div>
            <button type="submit" className="w-full bg-[#3a5a40] text-white py-4 rounded-xl font-bold hover:bg-[#344e41] transition-colors flex items-center justify-center gap-2 group">
              Notify Me <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </motion.div>

        <div className="mt-8 text-center text-sm flex items-center justify-center gap-2" style={{ color: 'var(--text-muted)' }}>
          <ShieldCheck className="w-4 h-4" />
          <span>Secured by {details.eventName} Org</span>
        </div>
      </div>
    </div>
  );
}