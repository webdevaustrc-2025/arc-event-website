"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';

interface Sponsor {
  id: number;
  name: string;
  logoUrl: string;
  category: string;
  websiteUrl: string | null;
  displayOrder: number;
}

// ─── FALLBACK DUMMY DATA ───
const FALLBACK_SPONSORS: Sponsor[] = [
  { id: 1, name: 'Vercel', logoUrl: '', category: 'Gold Sponsor', websiteUrl: 'https://vercel.com', displayOrder: 0 },
  { id: 2, name: 'Logitech', logoUrl: '', category: 'Gold Sponsor', websiteUrl: 'https://logitech.com', displayOrder: 1 },
  { id: 3, name: 'Notion', logoUrl: '', category: 'Silver Sponsor', websiteUrl: 'https://notion.com', displayOrder: 2 },
  { id: 4, name: 'Figma', logoUrl: '', category: 'Silver Sponsor', websiteUrl: 'https://figma.com', displayOrder: 3 },
  { id: 5, name: 'Stripe', logoUrl: '', category: 'Bronze Sponsor', websiteUrl: 'https://stripe.com', displayOrder: 4 },
  { id: 6, name: 'GitHub', logoUrl: '', category: 'Bronze Sponsor', websiteUrl: 'https://github.com', displayOrder: 5 },
];

export function SponsorsCarousel() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const xPositionRef = useRef(0);

  // Fetch sponsors from API
  useEffect(() => {
    async function fetchSponsors() {
      try {
        console.log("Fetching sponsors for carousel...");
        const response = await fetch("/api/public/sponsors");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Carousel data received:", data);
        
        if (data && data.length > 0) {
          setSponsors(data);
        } else {
          console.log("No sponsors in database, using fallback data");
          setSponsors(FALLBACK_SPONSORS);
        }
      } catch (error) {
        console.error("Error fetching sponsors for carousel:", error);
        setSponsors(FALLBACK_SPONSORS);
      } finally {
        setLoading(false);
      }
    }
    fetchSponsors();
  }, []);

  // Animation function
  useEffect(() => {
    if (sponsors.length === 0 || loading) return;

    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationId: number;
    let lastTimestamp = 0;
    const pixelsPerSecond = 64;
    const pixelsPerMillisecond = pixelsPerSecond / 1000;

    const animate = (timestamp: number) => {
      if (!isPaused) {
        if (lastTimestamp !== 0) {
          const delta = Math.min(50, timestamp - lastTimestamp);
          xPositionRef.current -= pixelsPerMillisecond * delta;
          
          const totalWidth = carousel.scrollWidth / 4;
          if (Math.abs(xPositionRef.current) >= totalWidth) {
            xPositionRef.current = 0;
          }
          
          carousel.style.transform = `translateX(${xPositionRef.current}px)`;
        }
        lastTimestamp = timestamp;
      } else {
        lastTimestamp = 0;
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [sponsors, loading, isPaused]);

  const duplicatedSponsors = [...sponsors, ...sponsors, ...sponsors, ...sponsors];

  if (loading) {
    return (
      <section className="w-full py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center gap-4 justify-center mb-5">
              <div className="h-px w-10 bg-[#588157] opacity-70" />
              <span className="text-[#588157] text-[11px] tracking-[0.18em] font-medium uppercase">/ Our Partners</span>
              <div className="h-px w-10 bg-[#588157] opacity-70" />
            </div>
            <h2 className="font-bold mb-4 text-white" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(36px, 6vw, 64px)' }}>
              Our Sponsors
            </h2>
          </div>
          <div className="flex items-center justify-center h-48 text-gray-400">
            Loading sponsors...
          </div>
        </div>
      </section>
    );
  }

  if (sponsors.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--section-gradient-base)' }} />
        
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
          SPONSORS
        </div>

        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(88,129,87,0.25)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(88,129,87,0.25)] to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title Area */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 justify-center mb-5">
              <div className="h-px w-10 bg-[#588157] opacity-70" />
              <span className="text-[#588157] text-[11px] tracking-[0.18em] font-medium uppercase">/ Our Partners</span>
              <div className="h-px w-10 bg-[#588157] opacity-70" />
            </div>
            <h2
              className="font-bold mb-4 text-white"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(36px, 6vw, 64px)',
                letterSpacing: '-0.02em',
              }}
            >
              Our Sponsors
            </h2>
            <p className="text-lg max-w-[560px] mx-auto text-gray-400">
              Grateful for the support of our valued sponsors who make our initiatives possible.
            </p>
          </motion.div>
        </div>

        {/* Carousel Container */}
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
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: '70%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.28) 40%, rgba(200,255,200,0.18) 60%, transparent 100%)',
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-32 pointer-events-none rounded-t-[28px]"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(88,160,88,0.10) 0%, transparent 70%)',
            }}
          />
          <div className="absolute top-4 left-6 w-1.5 h-1.5 rounded-full bg-[rgba(88,160,88,0.5)]" />
          <div className="absolute top-4 right-6 w-1.5 h-1.5 rounded-full bg-[rgba(88,160,88,0.5)]" />

          <div className="relative overflow-hidden">
            <div
              ref={carouselRef}
              className="flex gap-6"
              style={{ width: 'fit-content' }}
            >
              {duplicatedSponsors.map((sponsor, index) => (
                <div
                  key={`${sponsor.id}-${index}`}
                  className="flex-shrink-0 w-72 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <Card className="group hover:shadow-[0_0_40px_0_rgba(88,129,87,0.3)] transition-all duration-300 bg-white/10 backdrop-blur-sm border-white/10 hover:border-[#588157]/50 rounded-xl overflow-hidden">
                    <CardContent className="p-6 flex flex-col items-center justify-center gap-4 h-full min-h-[220px]">
                      <div className="h-24 w-full flex items-center justify-center">
                        {sponsor.logoUrl ? (
                          <img 
                            src={sponsor.logoUrl} 
                            alt={sponsor.name}
                            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="text-5xl">🏢</div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-white font-semibold text-lg mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {sponsor.name}
                        </h3>
                        {sponsor.category && (
                          <span className="text-xs font-medium text-[#588157] uppercase tracking-wider">
                            {sponsor.category}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 h-16 rounded-b-[28px] pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(88,160,88,0.03) 100%)',
            }}
          />
        </motion.div>

        {/* View All Button */}
        <div className="flex justify-center mt-12 relative z-10">
          <a
            href="/sponsors"
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
            View All Sponsors
          </a>
        </div>
      </div>
    </section>
  );
}