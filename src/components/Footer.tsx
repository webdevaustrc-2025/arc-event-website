"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Twitter, Github, Linkedin, Youtube, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden mt-0">
      {/* ── Premium dark glass background ── */}
      <div className="absolute inset-0">
        {/* Deep dark base */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #060c09 0%, #040a07 50%, #030806 100%)',
          }}
        />
        {/* Very subtle green atmosphere orb */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '700px',
            height: '700px',
            background: 'radial-gradient(circle, rgba(58,130,80,0.10) 0%, transparent 65%)',
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
            background: 'rgba(4,10,7,0.15)',
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
                className="font-bold tracking-widest text-xl uppercase text-[#d4e8c2]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                RoboFest
              </span>
            </div>

            <p className="text-[#3d5a3d] text-sm leading-relaxed max-w-xs">
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
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    background: 'rgba(18,32,20,0.60)',
                    border: '1px solid rgba(88,129,87,0.18)',
                    color: '#3d5a3d',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#a3b18a';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(140,200,140,0.35)';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(22,42,26,0.80)';
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 14px rgba(58,130,80,0.20)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#3d5a3d';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(88,129,87,0.18)';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(18,32,20,0.60)';
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links — 2 cols */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4
              className="font-semibold uppercase tracking-widest text-[11px] text-[#6a8a6a] mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Navigation
            </h4>
            {['Home', 'Segments', 'Schedule', 'Sponsors', 'FAQ'].map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm text-[#2e4a2e] hover:text-[#a3b18a] transition-colors duration-200 w-fit"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Contact — 3 cols */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4
              className="font-semibold uppercase tracking-widest text-[11px] text-[#6a8a6a] mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Contact
            </h4>
            <a
              href="mailto:info@robofest.io"
              className="text-sm text-[#2e4a2e] hover:text-[#a3b18a] transition-colors duration-200 w-fit flex items-center gap-2"
            >
              <Mail className="w-3.5 h-3.5 text-[#3d5a3d]" />
              info@robofest.io
            </a>
            <a
              href="tel:+880123456789"
              className="text-sm text-[#2e4a2e] hover:text-[#a3b18a] transition-colors duration-200 w-fit flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-[#3d5a3d]" />
              +880 1234 56789
            </a>
            <span className="text-sm text-[#2e4a2e] flex items-start gap-2 max-w-[200px]">
              <MapPin className="w-3.5 h-3.5 text-[#3d5a3d] mt-0.5 flex-shrink-0" />
              123 Robotics Lane, Tech District, Dhaka 1200
            </span>
          </div>

          {/* Newsletter — 3 cols */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4
              className="font-semibold uppercase tracking-widest text-[11px] text-[#6a8a6a] mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Stay Updated
            </h4>
            <p className="text-sm text-[#2e4a2e]">
              Get event announcements and updates delivered to your inbox.
            </p>
            <form className="mt-1 flex flex-col gap-2" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full h-10 px-4 text-sm text-[#c8ddb0] placeholder-[#2e4a2e] outline-none rounded-xl transition-all"
                style={{
                  background: 'rgba(14,24,16,0.70)',
                  border: '1px solid rgba(88,129,87,0.18)',
                  backdropFilter: 'blur(12px)',
                }}
                onFocus={e => {
                  (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(140,200,140,0.35)';
                  (e.currentTarget as HTMLInputElement).style.boxShadow = '0 0 16px rgba(58,130,80,0.12)';
                }}
                onBlur={e => {
                  (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(88,129,87,0.18)';
                  (e.currentTarget as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
              <button
                type="submit"
                className="w-full h-10 rounded-xl text-sm font-semibold text-[#c8ddb0] flex items-center justify-center gap-2 transition-all hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(32,56,36,0.90) 0%, rgba(58,90,64,0.80) 100%)',
                  border: '1px solid rgba(140,200,140,0.22)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.07)',
                }}
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
            borderTop: '1px solid rgba(88,129,87,0.12)',
          }}
        >
          <p className="text-xs tracking-wider text-[#223322]">
            © 2025 RoboFest · Robotics Club · All Rights Reserved
          </p>
          <div className="flex items-center gap-6 text-xs tracking-wider text-[#223322]">
            <a href="#" className="hover:text-[#6a8a6a] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#6a8a6a] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#6a8a6a] transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
