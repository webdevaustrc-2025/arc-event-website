"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Target, Zap, Cpu, Code, Grid, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/lib/router-compat';
import { useSession } from 'next-auth/react';

interface SegmentData {
  id: number;
  name: string;
  description: string;
  rules: string;
  prizePool: string;
  status: string;
  imageUrl?: string;
}

const ICONS: { [key: number]: React.ReactNode } = {
  1: <Trophy className="w-16 h-16" />,
  2: <Target className="w-16 h-16" />,
  3: <Zap className="w-16 h-16" />,
  4: <Cpu className="w-16 h-16" />,
  5: <Code className="w-16 h-16" />,
  6: <Grid className="w-16 h-16" />,
};

const DUMMY_SEGMENTS: SegmentData[] = [
  { id: 1, name: 'Robo Soccer', description: 'Build and program autonomous or manual robots to compete in a high-stakes soccer tournament on a custom arena.', rules: '1. Robots must fit within dimensions. 2. Manual control via wireless RF. 3. No damage to arena.', prizePool: '৳20,000', status: 'active', imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80' },
  { id: 2, name: 'Line Follower', description: 'Optimize your algorithms for the fastest time across complex track layouts with sharp turns and intersections.', rules: '1. Autonomous control only. 2. Max weight 1kg. 3. Time trial base scoring.', prizePool: '৳15,000', status: 'active', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80' },
  { id: 3, name: 'Drone Race', description: 'Navigate aerial obstacles in a high-speed FPV drone racing championship.', rules: '1. Quadcopter design only. 2. Safety nets active. 3. FPV video feed mandatory.', prizePool: '৳50,000', status: 'active', imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80' },
  { id: 4, name: 'Sumo Bot', description: 'Push the opponent out of the ring. Pure torque and grip.', rules: '1. Auton/Manual options. 2. Ring size 1.5m diameter. 3. Weight limits apply.', prizePool: '৳25,000', status: 'active', imageUrl: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80' }
];

export const Segments = ({ dbSegments }: { dbSegments?: SegmentData[] }) => {
  const { data: session } = useSession();
  const [registeredSegmentIds, setRegisteredSegmentIds] = useState<number[]>([]);
  const [segments, setSegments] = useState<SegmentData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (session) {
      fetch('/api/dashboard/summary')
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Failed to load registered segments');
        })
        .then((data) => {
          if (data && Array.isArray(data.events)) {
            const ids = data.events.map((e: any) => e.segmentId).filter(Boolean);
            setRegisteredSegmentIds(ids);
          }
        })
        .catch((err) => console.error('Error fetching segment registrations:', err));
    }
  }, [session]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch segments from API
  useEffect(() => {
    if (dbSegments && dbSegments.length > 0) {
      setSegments(dbSegments);
      return;
    }
    if (mounted) {
      fetchSegments();
    }
  }, [mounted, dbSegments]);

  const fetchSegments = async () => {
    try {
      const response = await fetch('/api/segments');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setSegments(data);
        } else {
          console.error('Expected array of segments, received:', data);
          setSegments([]);
        }
      } else {
        console.error('Failed to fetch segments, status:', response.status);
        setSegments([]);
      }
    } catch (error) {
      console.error('Failed to fetch segments:', error);
      setSegments([]);
    }
  };

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!isPaused && segments.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % segments.length);
        setFlippedIndex(null);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused, segments.length]);

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
        {/* Deep base background */}
        <div
          className="absolute inset-0"
          style={{
            background: 'var(--section-gradient-base)',
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
            className="font-bold mb-4"
            style={{
              color: 'var(--text-heading)',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(36px, 6vw, 64px)',
              letterSpacing: '-0.02em',
            }}
          >
            Competition Segments
          </h2>
          <p className="text-lg max-w-[560px] mx-auto" style={{ color: 'var(--text-body)' }}>
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
          background: 'var(--glass-panel-bg)',
          backdropFilter: 'blur(28px) saturate(160%)',
          WebkitBackdropFilter: 'blur(28px) saturate(160%)',
          border: '1px solid var(--glass-panel-border)',
          boxShadow: 'var(--glass-panel-shadow)',
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
            if (segments.length === 0) return;
            setCurrentIndex((prev) => (prev - 1 + segments.length) % segments.length);
            setFlippedIndex(null);
          }}
          disabled={segments.length === 0}
          className="absolute left-4 top-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center hover:scale-110 transition-all disabled:opacity-50 disabled:pointer-events-none"
          style={{
            transform: 'translateY(-50%)',
            background: 'var(--arrow-bg)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--arrow-border)',
            boxShadow: 'var(--arrow-shadow)',
            color: 'var(--arrow-text)',
          }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => {
            if (segments.length === 0) return;
            setCurrentIndex((prev) => (prev + 1) % segments.length);
            setFlippedIndex(null);
          }}
          disabled={segments.length === 0}
          className="absolute right-4 top-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center hover:scale-110 transition-all disabled:opacity-50 disabled:pointer-events-none"
          style={{
            transform: 'translateY(-50%)',
            background: 'var(--arrow-bg)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--arrow-border)',
            boxShadow: 'var(--arrow-shadow)',
            color: 'var(--arrow-text)',
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
                      background: 'var(--glass-panel-bg)',
                      backdropFilter: isCenter ? 'blur(28px) saturate(200%)' : 'blur(18px) saturate(160%)',
                      WebkitBackdropFilter: isCenter ? 'blur(28px) saturate(200%)' : 'blur(18px) saturate(160%)',
                      border: '1px solid var(--glass-panel-border)',
                      boxShadow: 'var(--glass-panel-shadow)',
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
                      className="rounded-2xl p-8 flex items-center justify-center text-[#588157] mb-4"
                      style={{
                        background: 'var(--border)',
                        border: '1px solid var(--glass-panel-border)',
                      }}
                    >
                      {ICONS[segment.id % 6] || ICONS[1]}
                    </div>

                    {/* Code Name */}
                    <div className="text-center mb-3">
                      <span className="text-xs font-mono tracking-wider" style={{ color: 'var(--text-muted)' }}>SEG-{String(segment.id).padStart(2, '0')}</span>
                    </div>

                    {/* Click to Flip */}
                    {isCenter && (
                      <div className="flex justify-center mb-4">
                        <div
                          className="px-4 py-1.5 rounded-full text-xs font-medium"
                          style={{
                            background: 'var(--border)',
                            color: 'var(--text-body)',
                          }}
                        >
                          Click to flip
                        </div>
                      </div>
                    )}

                    {/* Segment Name */}
                    <div className="text-center">
                      <h3
                        className="text-2xl font-bold mb-2"
                        style={{ color: 'var(--text-heading)', fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {segment.name}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-body)' }}>{segment.description.substring(0, 50)}...</p>
                    </div>
                  </motion.div>

                  {/* ── Back Face — Premium Frosted Glass ── */}
                  <motion.div
                    className="absolute inset-0 rounded-[24px] p-6"
                    style={{
                      background: 'var(--glass-panel-bg)',
                      backdropFilter: 'blur(28px) saturate(200%)',
                      WebkitBackdropFilter: 'blur(28px) saturate(200%)',
                      border: '1px solid var(--glass-panel-border)',
                      boxShadow: 'var(--glass-panel-shadow)',
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
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                      }}
                    />

                    <h3
                      className="text-xl font-bold mb-6 text-center"
                      style={{ color: 'var(--text-heading)', fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {segment.name}
                    </h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-muted)' }}>Prize Pool:</span>
                        <span className="font-bold" style={{ color: 'var(--text-heading)' }}>{segment.prizePool}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                        <span className="font-medium capitalize" style={{ color: 'var(--text-heading)' }}>{segment.status}</span>
                      </div>
                    </div>

                    <div className="h-px mb-4" style={{ background: 'var(--border)' }} />

                    <div className="mb-4 text-left">
                      <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-body)' }}>Description:</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-body)' }}>{segment.description}</p>
                    </div>

                    <div className="mb-4 text-left">
                      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-body)' }}>Rules & Requirements:</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{segment.rules || 'No rules specified'}</p>
                    </div>

                    <div className="space-y-2 mt-auto" onClick={(e) => e.stopPropagation()}>
                      <Link
                        to={`/event/${segment.id}`}
                        className="w-full py-2 rounded-full text-sm font-semibold transition-colors text-center block"
                        style={{
                          background: 'var(--border)',
                          color: 'var(--text-body)',
                          border: '1px solid var(--glass-panel-border)',
                        }}
                      >
                        View Details
                      </Link>
                      {registeredSegmentIds.includes(segment.id) ? (
                        <button
                          disabled
                          className="w-full py-2 rounded-full text-sm font-semibold cursor-not-allowed opacity-60 text-center block"
                          style={{
                            background: 'var(--border)',
                            color: 'var(--text-muted)',
                            border: '1px solid var(--glass-panel-border)',
                          }}
                        >
                          Already Registered
                        </button>
                      ) : (
                        <Link
                          to="/register"
                          className="w-full py-2 rounded-full text-white text-sm font-semibold transition-all hover:brightness-110 text-center block bg-[#3a5a40] hover:bg-[#344e41] shadow-md"
                        >
                          Register Now
                        </Link>
                      )}
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
            background: 'var(--primary)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-panel-border)',
            color: 'var(--primary-foreground)',
            boxShadow: 'var(--glass-panel-shadow)',
          }}
        >
          Explore the Segments
        </Link>
      </div>
    </section>
  );
};
