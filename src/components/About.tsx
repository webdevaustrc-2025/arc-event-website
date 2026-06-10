"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Play, Zap, Award, Globe } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const About = () => {
  return (
    <section id="about" className="py-28 relative overflow-hidden">
      {/* ── Unique editorial atmosphere ── */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: 'var(--section-gradient-base)',
          }}
        />

        {/* ── FULL-WIDTH BACKDROP BLUR — soft warm frosted layer ── */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(10px) saturate(135%)',
            WebkitBackdropFilter: 'blur(10px) saturate(135%)',
            background: 'var(--section-backdrop)',
          }}
        />
        {/* Soft warm emerald haze — full-width atmospheric glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'var(--section-haze)',
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
              className="relative rounded-[28px] p-3 animate-in fade-in duration-500"
              style={{
                background: 'var(--glass-panel-bg)',
                backdropFilter: 'blur(24px) saturate(160%)',
                WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                border: '1px solid var(--glass-panel-border)',
                boxShadow: 'var(--glass-panel-shadow)',
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
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-transparent z-10 opacity-60" />
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
                    background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <p className="text-white text-xs uppercase tracking-[0.14em] font-medium opacity-80">
                    ARC 3.0 2025 · Bangladesh
                  </p>
                </div>
              </div>

              {/* Floating stat badge — overlaid on image frame */}
              <div
                className="absolute -bottom-5 -right-5 rounded-2xl px-5 py-3 z-40"
                style={{
                  background: 'var(--stat-badge-bg)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid var(--stat-badge-border)',
                  boxShadow: 'var(--glass-panel-shadow)',
                }}
              >
                <p className="text-[22px] font-bold" style={{ color: 'var(--text-heading)', fontFamily: "'Space Grotesk', sans-serif" }}>500+</p>
                <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-body)' }}>Engineers</p>
              </div>
            </div>
          </motion.div>

          {/* ── Right: Content ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center py-6 lg:py-0"
          >
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] mb-7"
              style={{ color: 'var(--text-heading)', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Where Bangladesh's Best Engineers Compete.
            </h2>

            <p className="text-lg mb-8 leading-relaxed" style={{ color: 'var(--text-body)' }}>
              ARC 3.0 2025 isn't just an event — it's a proving ground. We bring together the most brilliant minds across universities to solve complex engineering challenges, push the boundaries of autonomous systems, and showcase the future of robotics.
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
                  className="px-4 py-1.5 rounded-full text-sm flex items-center gap-2"
                  style={{
                    background: 'var(--glass-panel-bg)',
                    border: '1px solid var(--glass-panel-border)',
                    backdropFilter: 'blur(12px)',
                    color: 'var(--text-body)',
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
                className="px-8 py-3 rounded-full text-sm font-semibold text-white transition-all hover:brightness-110 hover:scale-105 bg-[#3a5a40] hover:bg-[#344e41] shadow-md"
              >
                Learn More
              </button>
              <button 
                className="flex items-center gap-3 px-5 py-3 rounded-full text-sm font-medium transition-colors group"
                style={{ color: 'var(--text-body)' }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-all"
                  style={{
                    border: '1px solid var(--glass-panel-border)',
                    background: 'var(--glass-panel-bg)',
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