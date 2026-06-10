"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Twitter, Github, Linkedin, Youtube, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden mt-0">
      {/* ── Premium theme-aware background ── */}
      <div className="absolute inset-0">
        {/* Deep base */}
        <div
          className="absolute inset-0"
          style={{
            background: 'var(--section-gradient-base)',
          }}
        />
        {/* Very subtle green atmosphere orb */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '700px',
            height: '700px',
            background: 'radial-gradient(circle, rgba(58,130,80,0.06) 0%, transparent 65%)',
            filter: 'blur(120px)',
            top: '-30%',
            left: '30%',
          }}
          animate={{ x: [0, 30, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Subtle glass layer */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(4px) saturate(110%)',
            background: 'var(--section-backdrop)',
          }}
        />
      </div>

      {/* ── Top border with emerald glow line ── */}
      <div className="absolute top-0 left-0 right-0">
        {/* Glowing line */}
        <div
          className="h-[1px] w-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(88,129,87,0.5) 20%, rgba(163,177,138,0.6) 50%, rgba(88,129,87,0.5) 80%, transparent 100%)',
          }}
        />
        {/* Soft glow blur below the line */}
        <div
          className="h-[2px] w-full opacity-50"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(88,180,100,0.3) 30%, rgba(100,200,100,0.3) 50%, rgba(88,180,100,0.3) 70%, transparent 100%)',
            filter: 'blur(4px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-10">

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-14">

          {/* Brand Column — spans 4 cols */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(58,90,64,0.6) 0%, rgba(88,129,87,0.4) 100%)',
                  border: '1px solid rgba(140,200,140,0.22)',
                  boxShadow: '0 0 16px rgba(58,130,80,0.20)',
                }}
              >
                <Cpu className="text-[#a3b18a] w-5 h-5" />
              </div>
              <span
                className="font-bold tracking-widest text-xl uppercase"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-heading)' }}
              >
                ARC 3.0
              </span>
            </div>

            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-body)' }}>
              Bangladesh's premier university robotics championship. Engineer the future with the best minds in the country.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              {[
                { Icon: Twitter, href: '#' },
                { Icon: Github, href: '#' },
                { Icon: Linkedin, href: '#' },
                { Icon: Youtube, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[var(--text-body)] hover:text-primary dark:hover:text-[#a3b18a] hover:border-primary/30 dark:hover:border-[#588157]/50 hover:shadow-md"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links — 2 cols */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4
              className="font-semibold uppercase tracking-widest text-[11px] mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-label)' }}
            >
              Navigation
            </h4>
            {['Home', 'Segments', 'Schedule', 'Sponsors', 'FAQ'].map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm transition-colors duration-200 w-fit text-[var(--text-body)] hover:text-[var(--text-heading)]"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Contact — 3 cols */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4
              className="font-semibold uppercase tracking-widest text-[11px] mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-label)' }}
            >
              Contact
            </h4>
            <a
              href="mailto:info@ARC 3.0.io"
              className="text-sm transition-colors duration-200 w-fit flex items-center gap-2 text-[var(--text-body)] hover:text-[var(--text-heading)]"
            >
              <Mail className="w-3.5 h-3.5 text-[var(--text-label)]" />
              info@ARC 3.0.io
            </a>
            <a
              href="tel:+880123456789"
              className="text-sm transition-colors duration-200 w-fit flex items-center gap-2 text-[var(--text-body)] hover:text-[var(--text-heading)]"
            >
              <Phone className="w-3.5 h-3.5 text-[var(--text-label)]" />
              +880 1234 56789
            </a>
            <span className="text-sm flex items-start gap-2 max-w-[200px] text-[var(--text-body)]">
              <MapPin className="w-3.5 h-3.5 text-[var(--text-label)] mt-0.5 flex-shrink-0" />
              123 Robotics Lane, Tech District, Dhaka 1200
            </span>
          </div>

          {/* Newsletter — 3 cols */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4
              className="font-semibold uppercase tracking-widest text-[11px] mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-label)' }}
            >
              Stay Updated
            </h4>
            <p className="text-sm text-[var(--text-body)]">
              Get event announcements and updates delivered to your inbox.
            </p>
            <form className="mt-1 flex flex-col gap-2" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full h-10 px-4 text-sm outline-none rounded-xl transition-all bg-[var(--input-background)] border border-[var(--glass-panel-border)] text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:border-[#588157]/50 focus:shadow-[0_0_16px_rgba(58,130,80,0.12)]"
              />
              <button
                type="submit"
                className="w-full h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:brightness-110 bg-[var(--primary)] text-[var(--primary-foreground)] border border-[var(--glass-panel-border)] shadow-[var(--glass-panel-shadow)]"
              >
                Subscribe
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{
            borderTop: '1px solid var(--border)',
          }}
        >
          <p className="text-xs tracking-wider" style={{ color: 'var(--text-muted)' }}>
            © 2025 ARC 3.0 · Robotics Club · All Rights Reserved
          </p>
          <div className="flex items-center gap-6 text-xs tracking-wider">
            <a href="#" className="hover:text-[var(--text-heading)] transition-colors" style={{ color: 'var(--text-muted)' }}>Privacy Policy</a>
            <a href="#" className="hover:text-[var(--text-heading)] transition-colors" style={{ color: 'var(--text-muted)' }}>Terms of Service</a>
            <a href="#" className="hover:text-[var(--text-heading)] transition-colors" style={{ color: 'var(--text-muted)' }}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
