"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Building2, Globe2, Monitor, Network, Server, Webhook, ArrowUpRight } from 'lucide-react';

const sponsorData = [
  { name: "Vercel", icon: <Building2 className="w-10 h-10" /> },
  { name: "Logitech", icon: <Globe2 className="w-10 h-10" /> },
  { name: "Notion", icon: <Server className="w-10 h-10" /> },
  { name: "Figma", icon: <Webhook className="w-10 h-10" /> },
  { name: "Stripe", icon: <Network className="w-10 h-10" /> },
  { name: "Linear", icon: <Monitor className="w-10 h-10" /> },
  { name: "GitHub", icon: <Briefcase className="w-10 h-10" /> },
];

export const Sponsors = () => {
  return (
    <section id="sponsors" className="py-24 relative overflow-hidden">
      {/* ── Lighter, cleaner atmosphere — distinct from other sections ── */}
      <div className="absolute inset-0 -z-10">
        {/* Slightly lighter dark base vs other sections */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #080e0b 0%, #0b1510 40%, #090f0c 100%)',
          }}
        />

        {/* ── FULL-WIDTH BACKDROP BLUR — clean lightest frosted layer ── */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(8px) saturate(125%)',
            WebkitBackdropFilter: 'blur(8px) saturate(125%)',
            background: 'rgba(8,14,10,0.25)',
          }}
        />
        {/* Clean horizontal emerald haze — keeps logos highly readable */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 100% 70% at 50% 50%, rgba(60,120,65,0.09) 0%, transparent 60%),
              linear-gradient(180deg, rgba(6,12,8,0.22) 0%, rgba(10,18,12,0.12) 50%, rgba(6,12,8,0.22) 100%)
            `,
          }}
        />

        {/* Very soft diffused glow — low intensity intentionally */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '900px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(88,129,87,0.08) 0%, transparent 65%)',
            filter: 'blur(100px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Top/bottom hairlines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(88,129,87,0.22)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(88,129,87,0.18)] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mb-14"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8" style={{ background: 'rgba(88,129,87,0.45)' }} />
            <span className="text-[#588157] text-[11px] tracking-[0.18em] font-medium uppercase">/ Partners & Sponsors</span>
            <div className="h-px w-8" style={{ background: 'rgba(88,129,87,0.45)' }} />
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold text-center text-[#d4e8c2]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Our <span className="text-[#6aaf6a]">Sponsors</span>
          </h2>
          <p className="text-[#3d5a3d] mt-4 text-center max-w-lg text-[15px]">
            Empowering the next generation of robotics innovators with premium hardware and software support.
          </p>
        </motion.div>

        {/* ── Sponsor marquee inside a clean light glass panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mb-12 rounded-[20px] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(14,22,16,0.42) 0%, rgba(8,14,10,0.35) 100%)',
            backdropFilter: 'blur(14px) saturate(130%)',
            WebkitBackdropFilter: 'blur(14px) saturate(130%)',
            border: '1px solid rgba(100,160,100,0.12)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* Top inner hairline */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: '80%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
            }}
          />

          {/* Edge fade masks */}
          <div
            className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, rgba(10,16,12,0.95), transparent)' }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(-90deg, rgba(10,16,12,0.95), transparent)' }}
          />

          <motion.div
            className="flex whitespace-nowrap min-w-max items-center gap-16 px-0 py-8"
            animate={{ x: [0, -2200] }}
            transition={{ repeat: Infinity, duration: 42, ease: 'linear' }}
          >
            {[...sponsorData, ...sponsorData, ...sponsorData].map((sponsor, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 cursor-pointer group"
                style={{ color: 'rgba(100,140,100,0.55)' }}
              >
                <div
                  className="transition-all duration-300 group-hover:scale-110"
                  style={{
                    filter: 'grayscale(0.5)',
                    color: 'rgba(120,160,120,0.60)',
                  }}
                >
                  {sponsor.icon}
                </div>
                <span
                  className="text-2xl font-bold tracking-widest uppercase transition-colors duration-300 group-hover:text-[#a3b18a]"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: 'rgba(100,150,100,0.55)',
                  }}
                >
                  {sponsor.name}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2 px-8 py-4 rounded-full font-bold text-[#c8ddb0] transition-all"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: 'linear-gradient(135deg, rgba(32,56,36,0.80) 0%, rgba(58,90,64,0.70) 100%)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(140,200,140,0.22)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            Become a Sponsor
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};