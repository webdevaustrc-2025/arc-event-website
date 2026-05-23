"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Target, Zap, Cpu, Code, Grid, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/lib/router-compat';

const segments = [
  {
    id: 1,
    code: 'RO-01',
    name: 'Robo Olympiad',
    subtitle: 'Project Showcase & Innovation Display',
    desc: 'Present your most innovative robotics project to industry experts and compete for top honors.',
    icon: <Trophy className="w-16 h-16" />,
    teamSize: '2-4 members',
    entryFee: '$50',
    prize: '$5,000',
    rules: [
      'Original design required with documentation',
      'Live demonstration mandatory',
      'Q&A session with judges',
      'Must include working prototype'
    ]
  },
  {
    id: 2,
    code: 'SB-02',
    name: 'Soccer Bot',
    subtitle: 'Strategic Gameplay & Autonomous Control',
    desc: 'Design autonomous robots that compete in fast-paced soccer matches using advanced AI.',
    icon: <Target className="w-16 h-16" />,
    teamSize: '3-5 members',
    entryFee: '$60',
    prize: '$7,500',
    rules: [
      'Fully autonomous operation required',
      'Maximum bot dimensions: 20cm x 20cm',
      'Standard arena size: 4m x 6m',
      'Round-robin tournament format'
    ]
  },
  {
    id: 3,
    code: 'LF-03',
    name: 'Line Following Robot',
    subtitle: 'Speed, Precision & Algorithm Mastery',
    desc: 'Navigate complex track patterns at maximum speed with flawless precision.',
    icon: <Zap className="w-16 h-16" />,
    teamSize: '1-3 members',
    entryFee: '$40',
    prize: '$3,000',
    rules: [
      'Time-based scoring system',
      'Multiple track difficulty levels',
      'Sensor limitations apply',
      'Best of 3 runs counted'
    ]
  },
  {
    id: 4,
    code: 'CW-04',
    name: 'Circuit Wizard',
    subtitle: 'Electronics Design & Problem Solving',
    desc: 'Solve real-world circuit challenges and demonstrate advanced electronics expertise.',
    icon: <Cpu className="w-16 h-16" />,
    teamSize: '1-2 members',
    entryFee: '$35',
    prize: '$2,500',
    rules: [
      'Timed problem-solving rounds',
      'PCB design submission required',
      'Component efficiency scoring',
      'Live troubleshooting challenge'
    ]
  },
  {
    id: 5,
    code: 'RH-05',
    name: 'Robo Hackathon',
    subtitle: 'Code, Build & Deploy in 24hrs',
    desc: 'Intense 24-hour challenge to design, build, and present a complete robotic solution.',
    icon: <Code className="w-16 h-16" />,
    teamSize: '2-4 members',
    entryFee: '$70',
    prize: '$10,000',
    rules: [
      '24-hour continuous development',
      'Mentorship sessions available',
      'Final pitch to judging panel',
      'Open-source submission preferred'
    ]
  },
  {
    id: 6,
    code: 'CD-06',
    name: 'Cadyssey',
    subtitle: 'Robotics Engineering & Design',
    desc: 'Showcase exceptional CAD modeling skills and mechanical engineering prowess.',
    icon: <Grid className="w-16 h-16" />,
    teamSize: '1-3 members',
    entryFee: '$45',
    prize: '$4,000',
    rules: [
      'Detailed 3D models required',
      'Assembly simulation mandatory',
      'Bill of materials included',
      'Design optimization challenge'
    ]
  }
];

export const Segments = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % segments.length);
        setFlippedIndex(null);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1200;

  const OFFSETS = isMobile
    ? { step1: 210, step2: 370 }
    : isTablet
    ? { step1: 240, step2: 440 }
    : { step1: 280, step2: 520 };

  return (
    <section
      id="segments"
      className="py-32 relative overflow-hidden"
      style={{ padding: `clamp(64px, 8vw, 112px) clamp(24px, 5vw, 80px)` }}
    >
      {/* ── Rich atmospheric background ── */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Deep dark green base */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, #060d0a 0%, #0a110d 30%, #080e0b 60%, #050a07 100%)',
          }}
        />

        {/* Large glowing green atmosphere blobs */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '900px',
            height: '900px',
            background: 'radial-gradient(circle, rgba(58,130,80,0.22) 0%, rgba(30,80,50,0.12) 40%, transparent 70%)',
            filter: 'blur(120px)',
            top: '-15%',
            left: '-10%',
          }}
          animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '700px',
            height: '700px',
            background: 'radial-gradient(circle, rgba(88,129,87,0.20) 0%, rgba(50,90,60,0.10) 45%, transparent 70%)',
            filter: 'blur(100px)',
            bottom: '-10%',
            right: '-5%',
          }}
          animate={{ x: [0, -50, 0], y: [0, -35, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(100,160,100,0.15) 0%, transparent 65%)',
            filter: 'blur(80px)',
            top: '40%',
            left: '55%',
          }}
          animate={{ x: [0, -30, 30, 0], y: [0, 25, -15, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        {/* Large ghost typography in background for depth — like the reference */}
        <div
          className="absolute select-none pointer-events-none"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(180px, 25vw, 340px)',
            fontWeight: 900,
            color: 'transparent',
            WebkitTextStroke: '1.5px rgba(88,129,87,0.10)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.04em',
            userSelect: 'none',
            filter: 'blur(1px)',
          }}
        >
          COMPETE
        </div>

        {/* Horizontal separator lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(88,129,87,0.25)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(88,129,87,0.25)] to-transparent" />

        {/* Subtle diagonal gradient overlays for richness */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(135deg, rgba(58,90,64,0.15) 0%, transparent 40%, rgba(88,129,87,0.08) 100%)',
          }}
        />
      </div>

      {/* ── Title Area ── */}
      <div className="text-center mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 justify-center mb-5">
            <div className="h-px w-10 bg-[#588157] opacity-70" />
            <span className="text-[#588157] text-[11px] tracking-[0.18em] font-medium uppercase">/ Competition Tracks</span>
            <div className="h-px w-10 bg-[#588157] opacity-70" />
          </div>
          <h2
            className="font-bold mb-4 text-[#a3b18a]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(36px, 6vw, 64px)',
              letterSpacing: '-0.02em',
            }}
          >
            Competition Segments
          </h2>
          <p className="text-[#7a8a72] text-lg max-w-[560px] mx-auto">
            Explore diverse tracks crafted to challenge your hardware, software and design skills.
          </p>
        </motion.div>
      </div>

      {/* ── Outer glass container wrapping carousel ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative mx-auto"
        style={{
          maxWidth: '1160px',
          borderRadius: '28px',
          padding: '40px 24px 48px',
          background: 'linear-gradient(145deg, rgba(18,32,22,0.55) 0%, rgba(10,18,13,0.45) 50%, rgba(14,26,18,0.50) 100%)',
          backdropFilter: 'blur(28px) saturate(160%)',
          WebkitBackdropFilter: 'blur(28px) saturate(160%)',
          border: '1px solid rgba(120,180,120,0.18)',
          boxShadow: `
            0 0 80px rgba(58,130,80,0.12),
            0 4px 6px rgba(0,0,0,0.3),
            0 24px 64px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.10),
            inset 0 -1px 0 rgba(88,129,87,0.08)
          `,
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Top inner highlight reflection */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: '70%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.28) 40%, rgba(200,255,200,0.18) 60%, transparent 100%)',
          }}
        />
        {/* Inner soft green glow at top */}
        <div
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none rounded-t-[28px]"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(88,160,88,0.10) 0%, transparent 70%)',
          }}
        />
        {/* Corner accent dots */}
        <div className="absolute top-4 left-6 w-1.5 h-1.5 rounded-full bg-[rgba(88,160,88,0.5)]" />
        <div className="absolute top-4 right-6 w-1.5 h-1.5 rounded-full bg-[rgba(88,160,88,0.5)]" />

        {/* Left Arrow */}
        <button
          onClick={() => {
            setCurrentIndex((prev) => (prev - 1 + segments.length) % segments.length);
            setFlippedIndex(null);
          }}
          className="absolute left-4 top-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-[#a3b18a] hover:scale-110 transition-all"
          style={{
            transform: 'translateY(-50%)',
            background: 'rgba(18,32,22,0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(88,129,87,0.4)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
          }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => {
            setCurrentIndex((prev) => (prev + 1) % segments.length);
            setFlippedIndex(null);
          }}
          className="absolute right-4 top-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-[#a3b18a] hover:scale-110 transition-all"
          style={{
            transform: 'translateY(-50%)',
            background: 'rgba(18,32,22,0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(88,129,87,0.4)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
          }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Cards Track */}
        <div
          className="relative flex items-center justify-center overflow-hidden"
          style={{ height: isMobile ? '480px' : '540px', perspective: '2000px' }}
        >
          {segments.map((segment, index) => {
            const position = (index - currentIndex + segments.length) % segments.length;
            const centerOffset = position > segments.length / 2 ? position - segments.length : position;

            let scale = 0.7;
            let opacity = 0.45;
            let blur = 3;
            let rotateY = 0;
            let zIndex = 0;
            let translateX = 0;

            if (centerOffset === 0) {
              scale = 1;
              opacity = 1;
              blur = 0;
              rotateY = 0;
              zIndex = 10;
              translateX = 0;
            } else if (Math.abs(centerOffset) === 1) {
              scale = 0.85;
              opacity = 0.7;
              blur = 1;
              rotateY = centerOffset > 0 ? 15 : -15;
              zIndex = 5;
              translateX = centerOffset > 0 ? OFFSETS.step1 : -OFFSETS.step1;
            } else if (Math.abs(centerOffset) === 2) {
              scale = 0.7;
              opacity = 0.45;
              blur = 3;
              rotateY = centerOffset > 0 ? 25 : -25;
              zIndex = 1;
              translateX = centerOffset > 0 ? OFFSETS.step2 : -OFFSETS.step2;
            } else {
              scale = 0;
              opacity = 0;
              translateX = centerOffset > 0 ? OFFSETS.step2 + 100 : -(OFFSETS.step2 + 100);
            }

            const isCenter = centerOffset === 0;
            const isFlipped = flippedIndex === index;

            const cardW = isMobile ? 'w-[260px]' : isTablet ? 'w-[280px]' : 'w-[300px]';
            const cardH = isMobile ? 'h-[360px]' : isTablet ? 'h-[400px]' : 'h-[430px]';

            return (
              <motion.div
                key={segment.id}
                className="absolute"
                style={{
                  zIndex,
                  pointerEvents: isCenter ? 'auto' : 'none',
                  filter: `blur(${blur}px)`,
                  transition: 'filter 0.4s ease',
                }}
                initial={{ scale, opacity, x: translateX, rotateY: isFlipped ? rotateY + 180 : rotateY }}
                animate={{ scale, opacity, x: translateX, rotateY: isFlipped ? rotateY + 180 : rotateY }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <div
                  className={`relative ${cardW} ${cardH} cursor-pointer`}
                  style={{ transformStyle: 'preserve-3d' }}
                  onClick={() => { if (isCenter) setFlippedIndex(isFlipped ? null : index); }}
                >
                  {/* ── Front Face — Premium Frosted Glass Card ── */}
                  <motion.div
                    className="absolute inset-0 rounded-[24px] p-6 flex flex-col justify-between"
                    style={{
                      background: isCenter
                        ? 'linear-gradient(145deg, rgba(22,42,28,0.65) 0%, rgba(12,22,16,0.55) 50%, rgba(18,34,22,0.60) 100%)'
                        : 'linear-gradient(145deg, rgba(18,32,22,0.50) 0%, rgba(10,18,13,0.42) 100%)',
                      backdropFilter: isCenter ? 'blur(28px) saturate(200%)' : 'blur(18px) saturate(160%)',
                      WebkitBackdropFilter: isCenter ? 'blur(28px) saturate(200%)' : 'blur(18px) saturate(160%)',
                      border: isCenter
                        ? '1px solid rgba(140,200,140,0.22)'
                        : '1px solid rgba(100,160,100,0.12)',
                      boxShadow: isCenter
                        ? `
                          0 0 50px rgba(58,130,80,0.18),
                          0 2px 4px rgba(0,0,0,0.2),
                          0 16px 40px rgba(0,0,0,0.45),
                          inset 0 1px 0 rgba(255,255,255,0.14),
                          inset 0 0 30px rgba(88,160,88,0.05)
                        `
                        : '0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)',
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(0deg)',
                    }}
                  >
                    {/* Top inner highlight */}
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none rounded-full"
                      style={{
                        width: '65%',
                        height: '1px',
                        background: isCenter
                          ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.30), rgba(180,255,180,0.20), transparent)'
                          : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                      }}
                    />
                    {/* Subtle inner corner glow */}
                    {isCenter && (
                      <div
                        className="absolute inset-0 rounded-[24px] pointer-events-none"
                        style={{
                          background: 'radial-gradient(ellipse at 50% 0%, rgba(88,180,100,0.08) 0%, transparent 55%)',
                        }}
                      />
                    )}

                    {/* Trophy Badge */}
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>

                    {/* Icon Panel */}
                    <div
                      className="rounded-2xl p-8 flex items-center justify-center text-[#6aaf6a] mb-4"
                      style={{
                        background: 'rgba(88,160,88,0.08)',
                        border: '1px solid rgba(88,160,88,0.12)',
                      }}
                    >
                      {segment.icon}
                    </div>

                    {/* Code Name */}
                    <div className="text-center mb-3">
                      <span className="text-xs text-[#4a6a4a] font-mono tracking-wider">{segment.code}</span>
                    </div>

                    {/* Click to Flip */}
                    {isCenter && (
                      <div className="flex justify-center mb-4">
                        <div
                          className="px-4 py-1.5 rounded-full text-xs text-[#a3b18a] font-medium"
                          style={{
                            background: 'rgba(88,129,87,0.12)',
                            border: '1px solid rgba(163,177,138,0.30)',
                          }}
                        >
                          Click to flip
                        </div>
                      </div>
                    )}

                    {/* Segment Name */}
                    <div className="text-center">
                      <h3
                        className="text-2xl font-bold mb-2 text-[#d4e8c2]"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {segment.name}
                      </h3>
                      <p className="text-sm text-[#5a7a5a]">{segment.subtitle}</p>
                    </div>
                  </motion.div>

                  {/* ── Back Face — Premium Frosted Glass ── */}
                  <motion.div
                    className="absolute inset-0 rounded-[24px] p-6"
                    style={{
                      background: 'linear-gradient(145deg, rgba(22,42,28,0.65) 0%, rgba(12,22,16,0.55) 50%, rgba(18,34,22,0.60) 100%)',
                      backdropFilter: 'blur(28px) saturate(200%)',
                      WebkitBackdropFilter: 'blur(28px) saturate(200%)',
                      border: '1px solid rgba(140,200,140,0.22)',
                      boxShadow: `
                        0 0 50px rgba(58,130,80,0.18),
                        0 16px 40px rgba(0,0,0,0.45),
                        inset 0 1px 0 rgba(255,255,255,0.14)
                      `,
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    {/* Top highlight */}
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                      style={{
                        width: '65%',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), rgba(180,255,180,0.18), transparent)',
                      }}
                    />

                    <h3
                      className="text-xl font-bold mb-6 text-center text-[#d4e8c2]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {segment.name}
                    </h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#5a7a5a]">Team Size:</span>
                        <span className="text-[#c8ddb0] font-medium">{segment.teamSize}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#5a7a5a]">Entry Fee:</span>
                        <span className="text-[#c8ddb0] font-medium">{segment.entryFee}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#5a7a5a]">Prize Pool:</span>
                        <span className="text-[#a3b18a] font-bold">{segment.prize}</span>
                      </div>
                    </div>

                    <div className="h-px mb-4" style={{ background: 'rgba(88,160,88,0.15)' }} />

                    <div className="mb-6">
                      <p className="text-xs text-[#4a6a4a] uppercase tracking-wider mb-3">Key Rules:</p>
                      <ul className="space-y-2">
                        {segment.rules.map((rule, i) => (
                          <li key={i} className="text-xs text-[#6a8a6a] flex items-start gap-2">
                            <span className="text-[#6aaf6a] mt-0.5">•</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 mt-auto">
                      <button
                        className="w-full py-2 rounded-full text-sm text-[#a3b18a] hover:text-white transition-colors"
                        style={{
                          background: 'rgba(88,129,87,0.10)',
                          border: '1px solid rgba(120,180,120,0.25)',
                        }}
                      >
                        View Full Rules
                      </button>
                      <button
                        className="w-full py-2 rounded-full text-white text-sm font-semibold transition-all hover:brightness-110"
                        style={{
                          background: 'linear-gradient(135deg, rgba(58,90,64,0.9) 0%, rgba(88,129,87,0.85) 100%)',
                          border: '1px solid rgba(140,200,140,0.30)',
                          boxShadow: '0 4px 16px rgba(58,130,80,0.25), inset 0 1px 0 rgba(255,255,255,0.10)',
                        }}
                      >
                        Register Now
                      </button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-12 relative z-10">
          {segments.map((_, index) => (
            <button
              key={index}
              onClick={() => { setCurrentIndex(index); setFlippedIndex(null); }}
              className={`transition-all ${
                index === currentIndex
                  ? 'w-8 h-2 rounded-full'
                  : 'w-2 h-2 rounded-full'
              }`}
              style={{
                background: index === currentIndex
                  ? 'linear-gradient(90deg, #588157, #a3b18a)'
                  : 'rgba(120,160,120,0.25)',
              }}
            />
          ))}
        </div>

        {/* Bottom reflection inside container */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 rounded-b-[28px] pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(88,160,88,0.03) 100%)',
          }}
        />
      </motion.div>

      {/* Explore Button */}
      <div className="flex justify-center mt-12 relative z-10">
        <Link
          to="/segments"
          className="px-8 py-4 rounded-full font-bold transition-all hover:scale-105 hover:brightness-110"
          style={{
            background: 'linear-gradient(135deg, rgba(22,42,28,0.70) 0%, rgba(18,34,22,0.60) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(140,200,140,0.22)',
            color: '#a3b18a',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(58,130,80,0.10), inset 0 1px 0 rgba(255,255,255,0.10)',
          }}
        >
          Explore the Segments
        </Link>
      </div>
    </section>
  );
};
