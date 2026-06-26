// @ts-nocheck
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { About } from '@/components/About';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import {
  Target, Zap, ChevronLeft, ChevronRight, Pause, Play, Cpu,
  ArrowUpRight, Loader2, Trophy, CheckCircle2, Info,
  Calendar, MapPin, Award, Globe, Eye, Sparkles, Image as ImageIcon, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface GalleryItem { id: string; imageUrl: string; title: string; description: string; }
interface EventItem { id: string; tag: string; title: string; description: string; date: string; location: string; imageUrl?: string; }
interface WhatWeDoItem { id: string; title: string; description: string; icon: string; }

interface AboutData {
  about_hero: { heading: string; description: string; imageUrl: string; };
  about_austrc: any;
  about_mission_vision: {
    mission_title: string;
    mission_description: string;
    vision_title: string;
    vision_description: string;
  };
  about_what_we_do: { title: string; description: string; items: WhatWeDoItem[]; };
  about_event_competition: { title: string; description: string; items?: EventItem[]; };
  about_gallery: GalleryItem[];
}

const IconMapper = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (Icons as any)[name] || HelpCircle;
  return <IconComponent className={className} />;
};

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  // Carousel states
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const autoplayTimerRef = useRef<any>(null);

  // Fetch Page Data
  useEffect(() => {
    async function fetchAboutData() {
      try {
        const res = await fetch('/api/about');
        if (res.ok) {
          const fetchedJson = await res.json();
          setData(fetchedJson);
        }
      } catch (err) {
        console.error("Error loading about page data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAboutData();
  }, []);

  // Carousel Autoplay
  useEffect(() => {
    if (!data || !data.about_gallery || data.about_gallery.length <= 1 || !isPlaying) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }
    autoplayTimerRef.current = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % data.about_gallery.length);
    }, 4500);
    return () => { if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current); };
  }, [isPlaying, data]);

  const handlePrevSlide = () => {
    if (!data?.about_gallery || data.about_gallery.length <= 1) return;
    setCarouselIndex((prev) => (prev - 1 + data.about_gallery.length) % data.about_gallery.length);
  };

  const handleNextSlide = () => {
    if (!data?.about_gallery || data.about_gallery.length <= 1) return;
    setCarouselIndex((prev) => (prev + 1) % data.about_gallery.length);
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-background"><Loader2 className="animate-spin text-[#588157] w-10 h-10" /></div>;
  if (!data) return <div className="text-center p-20 text-foreground font-bold">Failed to load content.</div>;

  const galleryItems = data.about_gallery || [];
  const currentGalleryItem = galleryItems[carouselIndex];

  // Helper to compute 3D styles for stacked carousel
  const getCardStyle = (index: number) => {
    const total = galleryItems.length;
    if (total === 0) return {};

    let diff = index - carouselIndex;
    if (diff < -1) {
      if (diff === -total + 1) diff = 1;
      else if (diff === -total + 2) diff = 2;
    }
    if (diff > 1) {
      if (diff === total - 1) diff = -1;
      else if (diff === total - 2) diff = -2;
    }

    if (Math.abs(diff) > 2) {
      return {
        transform: 'translateX(0px) scale(0.4)',
        opacity: 0,
        zIndex: 0,
        pointerEvents: 'none'
      };
    }

    let translateX = 0;
    let scale = 1;
    let zIndex = 30;
    let opacity = 1;
    let rotateY = 0;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const offset = isMobile ? 80 : 160;
    const peekOffset = isMobile ? 130 : 280;

    if (diff === 0) {
      translateX = 0;
      scale = 1.0;
      zIndex = 30;
      opacity = 1.0;
      rotateY = 0;
    } else if (diff === 1) {
      translateX = offset;
      scale = 0.82;
      zIndex = 20;
      opacity = 0.55;
      rotateY = -12;
    } else if (diff === -1) {
      translateX = -offset;
      scale = 0.82;
      zIndex = 20;
      opacity = 0.55;
      rotateY = 12;
    } else if (diff === 2) {
      translateX = peekOffset;
      scale = 0.68;
      zIndex = 10;
      opacity = 0.25;
      rotateY = -22;
    } else if (diff === -2) {
      translateX = -peekOffset;
      scale = 0.68;
      zIndex = 10;
      opacity = 0.25;
      rotateY = 22;
    }

    return {
      transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
      opacity,
      zIndex,
      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      pointerEvents: diff === 0 ? 'auto' : 'none'
    };
  };

  return (
    <div className="pt-32 pb-24 min-h-screen relative overflow-hidden bg-background text-foreground transition-colors duration-300">

      {/* Grid Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(88,129,87,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(88,129,87,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* Radial glows */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute rounded-full" style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(88,129,87,0.08) 0%, transparent 70%)', top: '5%', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)' }} />
        <div className="absolute rounded-full" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(88,129,87,0.06) 0%, transparent 70%)', bottom: '25%', left: '10%', filter: 'blur(80px)' }} />
      </div>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <div className="text-sm tracking-[0.2em] mb-6 dark:text-[#9A9A8E] text-[#6B6B5E] font-semibold uppercase">
          <Link href="/" className="hover:text-[#588157] transition-colors">HOME</Link> / ABOUT US
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.1]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {data.about_hero?.heading ? (
            data.about_hero.heading.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)
          ) : (
            <>Born from Curiosity.<br />Built for Competition.</>
          )}
        </h1>
        {data.about_hero?.description && (
          <p className="max-w-2xl mx-auto text-lg dark:text-[#a3b18a] text-[#5A6D52] mt-4 leading-relaxed font-medium">
            {data.about_hero.description}
          </p>
        )}
      </div>

      {/* ABOUT ARC DETAILS SECTION */}
      <About data={data.about_austrc} />

      {/* SECTION: MISSION & VISION */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t dark:border-white/[0.04] border-black/[0.04]">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#588157] dark:bg-[#588157]/10 bg-[#588157]/5 border border-[#588157]/20 shadow-[0_0_12px_rgba(88,129,87,0.05)] mb-6">
            <Target size={12} /> Mission & Vision
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Mission Card */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="group relative p-10 rounded-[32px] border transition-all duration-500 overflow-hidden flex flex-col items-start dark:bg-white/[0.02] bg-white dark:border-white/5 border-black/[0.08] shadow-sm hover:shadow-2xl dark:hover:border-[#588157]/30 hover:border-[#588157]/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#588157]/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="mb-8 relative w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center text-[#588157] group-hover:border-[#588157]/50 group-hover:scale-110 transition-all duration-500">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-[#588157] transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {data.about_mission_vision?.mission_title || "Our Mission"}
            </h3>
            <p className="text-base leading-relaxed dark:text-[#a3b18a] text-[#5A6D52]">
              {data.about_mission_vision?.mission_description || "To advance robotics and sustainability through structured learning, workshops, and competitions."}
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="group relative p-10 rounded-[32px] border transition-all duration-500 overflow-hidden flex flex-col items-start dark:bg-white/[0.02] bg-white dark:border-white/5 border-black/[0.08] shadow-sm hover:shadow-2xl dark:hover:border-[#588157]/30 hover:border-[#588157]/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#588157]/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="mb-8 relative w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center text-[#588157] group-hover:border-[#588157]/50 group-hover:scale-110 transition-all duration-500">
              <Eye className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-[#588157] transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {data.about_mission_vision?.vision_title || "Our Vision"}
            </h3>
            <p className="text-base leading-relaxed dark:text-[#a3b18a] text-[#5A6D52]">
              {data.about_mission_vision?.vision_description || "To build strong collaborations within and beyond AUST that advance technology, innovation, and social impact."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* GALLERY SECTION (3D STACKED CAROUSEL) */}
      {galleryItems.length > 0 && (
        <section className="py-24 px-6 relative overflow-hidden border-t dark:border-white/[0.04] border-black/[0.04]">

          <div className="absolute rounded-full pointer-events-none" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(88,129,87,0.14) 0%, transparent 70%)', top: '15%', left: '55%', filter: 'blur(90px)', zIndex: 0 }} />

          <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#588157] dark:bg-[#588157]/10 bg-[#588157]/5 border border-[#588157]/20 shadow-[0_0_12px_rgba(88,129,87,0.05)] mb-12">
              <ImageIcon size={12} /> Gallery
            </span>

            {/* 3D Stack Container */}
            <div className="relative w-full max-w-[950px] h-[340px] md:h-[460px] flex items-center justify-center" style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>

              {/* Left Arrow */}
              <button
                onClick={handlePrevSlide}
                className="absolute left-0 md:left-4 z-40 w-12 h-12 rounded-full border border-border bg-background flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 hover:border-[#588157] transition-all text-[#588157]"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Stacked Cards */}
              <div className="relative w-[230px] md:w-[320px] h-[300px] md:h-[410px] flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                {galleryItems.map((item, index) => {
                  const cardStyle = getCardStyle(index);
                  const isActive = index === carouselIndex;
                  return (
                    <div
                      key={item.id}
                      className={`absolute w-full h-full rounded-[28px] overflow-hidden shadow-2xl border dark:bg-[#0d0d12] bg-white ${isActive ? 'border-[#588157] shadow-[0_0_30px_rgba(88,129,87,0.22)]' : 'border-white/5 shadow-none'
                        }`}
                      style={cardStyle}
                    >
                      <ImageWithFallback src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 text-white text-left">
                        <h4 className="text-lg md:text-xl font-bold tracking-tight font-sans text-white drop-shadow-md">{item.title}</h4>
                        <p className="text-[11px] md:text-xs text-[#a3b18a] mt-1 line-clamp-2 drop-shadow-sm font-medium">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Arrow */}
              <button
                onClick={handleNextSlide}
                className="absolute right-0 md:right-4 z-40 w-12 h-12 rounded-full border border-border bg-background flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 hover:border-[#588157] transition-all text-[#588157]"
              >
                <ChevronRight size={20} />
              </button>

              {/* Play / Pause Toggle Button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute right-0 md:right-4 top-[-60px] z-40 w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center cursor-pointer shadow hover:scale-105 hover:border-[#588157] transition-all text-[#588157]"
                title={isPlaying ? "Pause Autoplay" : "Play Autoplay"}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </button>
            </div>

            {/* Indicator bar */}
            <div className="mt-8 flex gap-1.5 justify-center items-center">
              {galleryItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${idx === carouselIndex ? 'w-8 bg-[#588157]' : 'w-2.5 bg-gray-300 dark:bg-zinc-800 hover:bg-[#588157]/40'
                    }`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION: WHAT WE DO */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t dark:border-white/[0.04] border-black/[0.04]">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#588157] dark:bg-[#588157]/10 bg-[#588157]/5 border border-[#588157]/20 shadow-[0_0_12px_rgba(88,129,87,0.05)] mb-6">
            <Sparkles size={12} /> {data.about_what_we_do?.title || "What We Do"}
          </span>
          {data.about_what_we_do?.description && (
            <p className="text-lg dark:text-[#a3b18a] text-[#5A6D52] max-w-3xl leading-relaxed mt-2">{data.about_what_we_do.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.about_what_we_do?.items?.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -8 }}
              className="group relative p-8 rounded-[32px] border transition-all duration-500 overflow-hidden flex flex-col items-start text-left 
              dark:bg-white/[0.02] bg-white dark:border-white/5 border-black/[0.08] shadow-sm hover:shadow-2xl dark:hover:border-[#588157]/30 hover:border-[#588157]/30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#588157]/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <div className="relative w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center text-[#588157] group-hover:border-[#588157]/50 group-hover:scale-110 transition-all duration-500">
                  <IconMapper name={item.icon} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-[#588157] transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</h3>
                  <p className="text-sm dark:text-[#a3b18a] text-[#5A6D52] mt-3 leading-relaxed font-medium">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION: EVENTS & COMPETITIONS */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t dark:border-white/[0.04] border-black/[0.04]">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#588157] dark:bg-[#588157]/10 bg-[#588157]/5 border border-[#588157]/20 shadow-[0_0_12px_rgba(88,129,87,0.05)] mb-6">
            <Trophy size={12} /> {data.about_event_competition?.title || "Events & Competitions"}
          </span>
          {data.about_event_competition?.description && (
            <p className="text-lg dark:text-[#a3b18a] text-[#5A6D52] max-w-3xl leading-relaxed mt-2">{data.about_event_competition.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.about_event_competition?.items?.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ y: -8, scale: 1.01 }}
              className="rounded-[32px] border bg-card border-border group hover:border-[#588157]/30 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden flex flex-col"
            >
              <div className="w-full aspect-[16/10] relative bg-black/20 overflow-hidden">
                <ImageWithFallback src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <span className="absolute top-4 left-4 text-[10px] font-bold text-[#588157] dark:bg-[#588157]/15 bg-[#588157]/10 border border-[#588157]/35 px-3 py-1 rounded-full uppercase tracking-wider font-sans">
                  {event.tag}
                </span>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3 text-left">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-[#588157] transition-colors leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{event.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{event.description}</p>
                </div>

                <div className="pt-6 border-t border-border space-y-3 text-left">
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-medium">
                    <Calendar size={14} className="text-[#588157]" /> {event.date}
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-medium">
                    <MapPin size={14} className="text-[#588157]" /> {event.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}