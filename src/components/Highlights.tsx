"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Play, ArrowUpRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const photos = [
  "https://images.unsplash.com/photo-1775826476139-b5968f28ebdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdGljcyUyMGNvbXBldGl0aW9ufGVufDF8fHx8MTc3NjQzMTA1NHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1581092158926-006506f47dc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdCUyMGVuZ2luZWVyaW5nfGVufDF8fHx8MTc3NjUzODE5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1641311281574-98b9e7a76479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdGljJTIwYXJtJTIwdGVjaHxlbnwxfHx8fDE3NzY1MzgxOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1761751237628-b760f64fc2b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29tcGV0aXRpb24lMjB3aW5uZXJ8ZW58MXx8fHwxNzc2NTM4MjAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/flagged/photo-1568118782915-fa213a00a49b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcm9uZSUyMHJhY2luZ3xlbnwxfHx8fDE3NzY1MzgxOTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
];

const galleryLabels = ['Robo Soccer', 'Engineering', 'Robotic Arms', 'Champions', 'Drone Racing'];

export const Highlights = ({ dbPhotos }: { dbPhotos?: string[] }) => {
  const activePhotos = dbPhotos && dbPhotos.length > 0 ? dbPhotos : photos;
  const leftColumnPhotos = [...activePhotos, ...activePhotos];
  const middleColumnPhotos = [...[...activePhotos].reverse(), ...activePhotos];
  const rightColumnPhotos = [...activePhotos, ...activePhotos];

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* ── Image gallery atmosphere — deeper, darker, more cinematic ── */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: 'var(--section-gradient-base)',
          }}
        />

        {/* ── FULL-WIDTH BACKDROP BLUR — dynamic immersive frosted layer ── */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(12px) saturate(140%)',
            WebkitBackdropFilter: 'blur(12px) saturate(140%)',
            background: 'var(--section-backdrop)',
          }}
        />
        {/* Dynamic atmospheric haze — diagonal cinematic sweep */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'var(--section-haze)',
          }}
        />

        {/* Cinematic vignette sides */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(4,8,6,0.60) 100%)',
          }}
        />
        {/* Ghost GALLERY text */}
        <div
          className="absolute select-none pointer-events-none"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(100px, 14vw, 220px)',
            fontWeight: 900,
            color: 'transparent',
            WebkitTextStroke: '1px rgba(88,129,87,0.06)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            filter: 'blur(1px)',
          }}
        >
          GALLERY
        </div>
        {/* Subtle ambient orbs */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(58,120,70,0.12) 0%, transparent 65%)',
            filter: 'blur(100px)',
            top: '5%',
            left: '-5%',
          }}
          animate={{ x: [0, 25, 0], y: [0, 15, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(163,177,138,0.22)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(163,177,138,0.18)] to-transparent" />
      </div>

      <div className="px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 sm:mb-16 gap-4"
        >
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="h-px w-8" style={{ background: 'rgba(88,129,87,0.45)' }} />
              <span className="text-[#588157] text-[11px] tracking-[0.18em] font-medium uppercase">/ Gallery</span>
            </div>
            <h2
              className="font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px, 5vw, 58px)', color: 'var(--text-heading)' }}
            >
              Relive ARC 3.0 2024
            </h2>
          </div>
          <a
            href="#"
            className="text-sm font-medium text-[var(--text-label)] hover:text-[var(--text-heading)] transition-colors flex items-center gap-2 pb-2"
          >
            View Full Gallery <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Mobile: single column */}
        <div className="flex flex-col gap-4 md:hidden">
          {activePhotos.slice(0, 4).map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden group cursor-pointer"
              style={{
                height: '220px',
                borderRadius: '16px',
                border: '1px solid rgba(100,160,100,0.12)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#060c09]/60 group-hover:to-[#060c09]/30 transition-all duration-700 z-10" />
              <ImageWithFallback
                src={src}
                alt={`Highlight ${i + 1}`}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transform group-hover:scale-105 transition-all duration-700"
              />
              {/* Glass caption */}
              <div
                className="absolute bottom-3 left-3 right-3 z-20 px-3 py-2 rounded-xl"
                style={{
                  background: 'rgba(6,14,9,0.70)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(88,129,87,0.15)',
                }}
              >
                <p className="text-[#6a8a6a] text-[11px] uppercase tracking-[0.12em] font-medium">{galleryLabels[i % galleryLabels.length]}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: 3-column infinite scroll */}
        <div className="hidden md:grid grid-cols-3 gap-5 h-[680px] overflow-hidden">
          {/* Left Column — scrolls down */}
          <div className="relative h-full overflow-hidden rounded-[20px]">
            <motion.div
              className="flex flex-col gap-5"
              animate={{ y: ["0%", "-50%"] }}
              transition={{ duration: 42, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
            >
              {leftColumnPhotos.map((src, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden group cursor-pointer flex-shrink-0"
                  style={{
                    height: '320px',
                    borderRadius: '16px',
                    border: '1px solid rgba(100,160,100,0.10)',
                    boxShadow: '0 8px 36px rgba(0,0,0,0.45)',
                  }}
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#060c09]/45 to-[#060c09]/20 group-hover:from-[#060c09]/15 group-hover:to-transparent transition-all duration-700 z-10" />
                  <ImageWithFallback
                    src={src}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transform group-hover:scale-110 transition-all duration-1000"
                  />
                  {/* Glass caption overlay on hover */}
                  <div
                    className="absolute bottom-0 left-0 right-0 z-20 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                    style={{
                      background: 'linear-gradient(180deg, transparent 0%, rgba(5,12,8,0.88) 100%)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <p className="text-[#6a8a6a] text-[11px] uppercase tracking-[0.12em]">{galleryLabels[i % galleryLabels.length]}</p>
                  </div>
                  {/* Hover border glow */}
                  <div
                    className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(140,200,140,0.25)' }}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Middle Column — scrolls up, with play button */}
          <div className="relative h-full overflow-hidden rounded-[20px]">
            <motion.div
              className="flex flex-col gap-5"
              animate={{ y: ["-50%", "0%"] }}
              transition={{ duration: 42, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
            >
              {middleColumnPhotos.map((src, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden group cursor-pointer flex-shrink-0"
                  style={{
                    height: '320px',
                    borderRadius: '16px',
                    border: '1px solid rgba(100,160,100,0.10)',
                    boxShadow: '0 8px 36px rgba(0,0,0,0.45)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#060c09]/45 to-[#060c09]/20 group-hover:from-[#060c09]/15 group-hover:to-transparent transition-all duration-700 z-10" />
                  <ImageWithFallback
                    src={src}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transform group-hover:scale-110 transition-all duration-1000"
                  />
                  {i === 2 && (
                    <div
                      className="w-14 h-14 absolute inset-0 m-auto rounded-full text-white flex items-center justify-center z-20 group-hover:scale-110 transition-all duration-500"
                      style={{
                        background: 'rgba(32,60,38,0.85)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(140,200,140,0.30)',
                        boxShadow: '0 4px 24px rgba(58,130,80,0.35)',
                      }}
                    >
                      <Play className="w-5 h-5 ml-0.5 text-[#a3b18a]" fill="currentColor" />
                    </div>
                  )}
                  <div
                    className="absolute bottom-0 left-0 right-0 z-20 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                    style={{
                      background: 'linear-gradient(180deg, transparent 0%, rgba(5,12,8,0.88) 100%)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <p className="text-[#6a8a6a] text-[11px] uppercase tracking-[0.12em]">{galleryLabels[i % galleryLabels.length]}</p>
                  </div>
                  <div
                    className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(140,200,140,0.25)' }}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column — scrolls down */}
          <div className="relative h-full overflow-hidden rounded-[20px]">
            <motion.div
              className="flex flex-col gap-5"
              animate={{ y: ["0%", "-50%"] }}
              transition={{ duration: 42, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
            >
              {rightColumnPhotos.map((src, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden group cursor-pointer flex-shrink-0"
                  style={{
                    height: '320px',
                    borderRadius: '16px',
                    border: '1px solid rgba(100,160,100,0.10)',
                    boxShadow: '0 8px 36px rgba(0,0,0,0.45)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#060c09]/45 to-[#060c09]/20 group-hover:from-[#060c09]/15 group-hover:to-transparent transition-all duration-700 z-10" />
                  <ImageWithFallback
                    src={src}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transform group-hover:scale-110 transition-all duration-1000"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 z-20 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                    style={{
                      background: 'linear-gradient(180deg, transparent 0%, rgba(5,12,8,0.88) 100%)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <p className="text-[#6a8a6a] text-[11px] uppercase tracking-[0.12em]">{galleryLabels[i % galleryLabels.length]}</p>
                  </div>
                  <div
                    className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(140,200,140,0.25)' }}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};