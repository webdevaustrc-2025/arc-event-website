"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Play, Zap, Award, Globe } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const About = () => {
  return (
    <section id="about" className="py-28 relative overflow-hidden">
      {/* ── Unique editorial atmosphere — warmer forest green hue ── */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, #070d09 0%, #0c1810 30%, #091209 65%, #070c08 100%)',
          }}
        />

        {/* ── FULL-WIDTH BACKDROP BLUR — soft warm frosted layer ── */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(10px) saturate(135%)',
            WebkitBackdropFilter: 'blur(10px) saturate(135%)',
            background: 'rgba(8,18,12,0.28)',
          }}
        />
        {/* Soft warm emerald haze — full-width atmospheric glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 120% 60% at 20% 50%, rgba(50,110,60,0.14) 0%, transparent 65%),
              radial-gradient(ellipse 80% 80% at 80% 50%, rgba(80,140,70,0.08) 0%, transparent 60%),
              linear-gradient(180deg, rgba(10,22,14,0.20) 0%, rgba(6,14,9,0.35) 50%, rgba(10,20,13,0.20) 100%)
            `,
          }}
        />

        {/* Warm green left-side atmosphere */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '700px',
            height: '700px',
            background: 'radial-gradient(circle, rgba(68,120,68,0.18) 0%, rgba(40,80,45,0.09) 45%, transparent 68%)',
            filter: 'blur(110px)',
            top: '10%',
            left: '-10%',
          }}
          animate={{ x: [0, 35, 0], y: [0, 20, 0], scale: [1, 1.07, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(100,155,80,0.12) 0%, transparent 65%)',
            filter: 'blur(90px)',
            bottom: '10%',
            right: '5%',
          }}
          animate={{ x: [0, -25, 0], y: [0, -20, 0], scale: [1, 1.10, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
        {/* Ghost text — editorial depth */}
        <div
          className="absolute select-none pointer-events-none"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(120px, 18vw, 280px)',
            fontWeight: 900,
            color: 'transparent',
            WebkitTextStroke: '1px rgba(88,129,87,0.07)',
            top: '50%',
            right: '-5%',
            transform: 'translateY(-50%)',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            filter: 'blur(1px)',
          }}
        >
          ABOUT
        </div>
        {/* Top separator */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(88,129,87,0.30)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(88,129,87,0.20)] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="h-px flex-1 max-w-[60px]" style={{ background: 'rgba(88,129,87,0.40)' }} />
          <span className="text-[#588157] text-[11px] tracking-[0.18em] font-medium uppercase">/ About The Event</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* ── Left: Editorial glass image card ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Outer glass frame */}
            <div
              className="relative rounded-[28px] p-3"
              style={{
                background: 'linear-gradient(145deg, rgba(16,28,18,0.55) 0%, rgba(10,18,12,0.45) 100%)',
                backdropFilter: 'blur(24px) saturate(160%)',
                WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                border: '1px solid rgba(120,180,120,0.16)',
                boxShadow: `
                  0 0 50px rgba(58,130,80,0.10),
                  0 20px 60px rgba(0,0,0,0.50),
                  inset 0 1px 0 rgba(255,255,255,0.10)
                `,
              }}
            >
              {/* Top inner highlight */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                style={{
                  width: '60%',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
                }}
              />

              {/* Image */}
              <div
                className="relative overflow-hidden rounded-[20px] group"
                style={{ height: 'clamp(260px, 40vw, 520px)' }}
              >
                {/* Dark gradient for editorial feel */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#060d09]/70 via-transparent to-transparent z-10 opacity-60" />
                {/* Glass reflection */}
                <div
                  className="absolute inset-0 z-20 opacity-20"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 45%)',
                  }}
                />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1712971724897-a9ae95e0ec44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdCUyMHJlbmRlciUyMDNkfGVufDF8fHx8MTc3NjUzODIwNXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Robotic 3D Render"
                  className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                />

                {/* Bottom glass caption strip */}
                <div
                  className="absolute bottom-0 left-0 right-0 z-30 p-5"
                  style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(6,14,9,0.85) 100%)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <p className="text-[#6a8a6a] text-xs uppercase tracking-[0.14em] font-medium">
                    RoboFest 2025 · Bangladesh
                  </p>
                </div>
              </div>

              {/* Floating stat badge — overlaid on image frame */}
              <div
                className="absolute -bottom-5 -right-5 rounded-2xl px-5 py-3 z-40"
                style={{
                  background: 'linear-gradient(135deg, rgba(18,34,22,0.90) 0%, rgba(10,22,14,0.85) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(140,200,140,0.22)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 0 20px rgba(58,130,80,0.12), inset 0 1px 0 rgba(255,255,255,0.10)',
                }}
              >
                <p className="text-[#a3b18a] text-[22px] font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>500+</p>
                <p className="text-[#3d5a3d] text-[11px] uppercase tracking-wide">Engineers</p>
              </div>
            </div>
          </motion.div>

          {/* ── Right: Content with minimal glass accent ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center py-6 lg:py-0"
          >
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] mb-7 text-[#d4e8c2]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Where Bangladesh's Best Engineers Compete.
            </h2>

            <p className="text-[#4a6a4a] text-lg mb-8 leading-relaxed">
              RoboFest 2025 isn't just an event — it's a proving ground. We bring together the most brilliant minds across universities to solve complex engineering challenges, push the boundaries of autonomous systems, and showcase the future of robotics.
            </p>

            {/* Glass tag pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                { label: 'Innovation', Icon: Zap },
                { label: 'Competition', Icon: Award },
                { label: 'Community', Icon: Globe },
              ].map(({ label, Icon }) => (
                <span
                  key={label}
                  className="px-4 py-1.5 rounded-full text-sm text-[#7a9a7a] flex items-center gap-2"
                  style={{
                    background: 'rgba(16,28,18,0.55)',
                    border: '1px solid rgba(100,160,100,0.16)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <Icon className="w-3.5 h-3.5 text-[#588157]" />
                  {label}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                className="px-8 py-3 rounded-full text-sm font-semibold text-[#c8ddb0] transition-all hover:brightness-110 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(32,56,36,0.90) 0%, rgba(58,90,64,0.80) 100%)',
                  border: '1px solid rgba(140,200,140,0.25)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
                }}
              >
                Learn More
              </button>
              <button className="flex items-center gap-3 px-5 py-3 rounded-full text-sm font-medium text-[#4a6a4a] hover:text-[#a3b18a] transition-colors group">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-all"
                  style={{
                    border: '1px solid rgba(88,129,87,0.30)',
                    background: 'rgba(16,28,18,0.50)',
                  }}
                >
                  <Play className="w-3.5 h-3.5 ml-0.5 text-[#588157]" fill="currentColor" />
                </div>
                Watch a Video
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};