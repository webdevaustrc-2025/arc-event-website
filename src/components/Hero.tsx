"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Play,
  Trophy,
  Users,
  Box,
  HeartHandshake,
} from "lucide-react";
import { ShineButton } from "./ShineButton";
import { Link } from "@/lib/router-compat";
import { useTheme } from "next-themes";

export const Hero = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme !== "light";

  const [timeLeft, setTimeLeft] = useState({
    days: 45,
    hours: 12,
    mins: 30,
    secs: 0,
  });
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const settings = await res.json();
          if (settings.event_starting_deadline) {
            setTargetDate(new Date(settings.event_starting_deadline));
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch event starting deadline:', err);
      }
      // Fallback: Default starting deadline if API fails or settings not set
      setTargetDate(new Date('2026-06-15T09:00:00'));
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - Date.now();
      if (difference <= 0) {
        return { days: 0, hours: 0, mins: 0, secs: 0 };
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        mins: Math.floor((difference / 1000 / 60) % 60),
        secs: Math.floor((difference / 1000) % 60),
      };
    };

    // Calculate immediately to avoid delay
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const stats = [
    {
      id: "stat-segments",
      icon: <Box className="w-8 h-8 text-[#588157]" />,
      value: "12+",
      label: "Segments",
    },
    {
      id: "stat-participants",
      icon: <Users className="w-8 h-8 text-[#588157]" />,
      value: "500+",
      label: "Participants",
    },
    {
      id: "stat-prize",
      icon: <Trophy className="w-8 h-8 text-[#588157]" />,
      value: "৳100k+",
      label: "Prize Pool",
    },
    {
      id: "stat-sponsors",
      icon: (
        <HeartHandshake className="w-8 h-8 text-[#588157]" />
      ),
      value: "20+",
      label: "Sponsors",
    },
  ];

  return (
    <>
      {/* Sticky Video Background - Sharp, No Blur */}
      <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity duration-500"
          style={{ opacity: isDark ? 1 : 0.38 }}
        >
          <source
            src="https://res.cloudinary.com/dec82taov/video/upload/v1778156010/Text_ARC_3.0_assembling_glowing_202605071801_kycjem.mp4"
            type="video/mp4"
          />
        </video>
        {/* Sharp gradient overlay - NO BLUR for crisp hero */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: isDark
              ? 'linear-gradient(to bottom, rgba(10, 10, 15, 0.75), rgba(10, 10, 15, 0.60), rgba(10, 10, 15, 0.95))'
              : 'linear-gradient(to bottom, rgba(218, 226, 210, 0.90), rgba(228, 236, 220, 0.78), rgba(240, 244, 240, 0.98))',
          }}
        />
        {/* Subtle color tint - NO BLUR */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 120% 60% at 20% 50%, rgba(50, 110, 60, 0.14) 0%, transparent 65%)'
              : 'radial-gradient(ellipse 120% 60% at 20% 50%, rgba(88, 129, 87, 0.08) 0%, transparent 65%)',
          }}
        />
      </div>

      <section
        id="home"
        className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden rounded-b-[80px] px-[0px] pt-[80px] pb-[96px] mx-[0px] mt-[0px] mb-[20px]"
      >
        <div className="relative z-20 flex flex-col items-center text-center px-4 sm:px-6 max-w-5xl mx-auto mt-12 flex-1 justify-center w-full">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border backdrop-blur-md text-sm mb-8 shadow-lg relative overflow-hidden group cursor-default"
            style={{
              background:
                "linear-gradient(135deg, rgba(88,129,87,0.12) 0%, rgba(58,90,64,0.08) 100%)",
              borderColor: "rgba(163,177,138,0.25)",
              boxShadow:
                "0 4px 20px rgba(88,129,87,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent group-hover:translate-x-full transition-transform duration-1000" />

            <span className="font-medium relative z-10" style={{ color: isDark ? '#a3b18a' : 'var(--text-label)' }}>
              Powered by AUSTRC
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-bold leading-[0.95] tracking-tighter"
            style={{
              color: 'var(--text-heading)',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(32px, 8vw, 112px)",
            }}
          >
            ENGINEER THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#a3b18a] to-[#3a5a40]">
              FUTURE.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg md:text-xl max-w-2xl font-light"
            style={{ color: 'var(--text-body)' }}
          >
            Bangladesh's Most Anticipated University Robotics
            Championship
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          >
            <Link to="/segments" className="w-full sm:w-auto flex">
              <ShineButton>
                Explore Segments →
              </ShineButton>
            </Link>
            <button className="relative inline-block p-px font-semibold leading-6 text-white shadow-2xl cursor-pointer rounded-full transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 group min-h-[52px]">
              <span
                className="absolute inset-0 rounded-full p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(135deg, #588157 0%, #a3b18a 50%, #3a5a40 100%)',
                }}
              />
              <span className="relative z-10 flex items-center justify-center gap-3 px-8 py-4 rounded-full backdrop-blur-md bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10">
                <div className="w-6 h-6 rounded-full bg-white/10 dark:bg-black/10 flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-white">
                  <Play
                    className="w-3 h-3 ml-0.5"
                    fill="currentColor"
                  />
                </div>
                <span className="transition-all duration-500 group-hover:translate-x-1 group-hover:text-white" style={{ color: 'var(--text-body)' }}>
                  Watch Highlights
                </span>
              </span>
            </button>
          </motion.div>
        </div>

        {/* Stats & Countdown Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="w-full px-4 sm:px-6 pb-12 pt-20 max-w-7xl mx-auto relative z-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Minimized Stats - Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center lg:items-start h-full justify-end"
            >
              <span className="text-xs tracking-[0.2em] uppercase mb-6 font-medium" style={{ color: 'var(--text-muted)' }}>
                Event Overview
              </span>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 sm:gap-12">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.7 + idx * 0.08,
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex flex-col items-center group cursor-default"
                  >
                    <h3
                      className="text-3xl sm:text-4xl font-bold tracking-tight leading-none mb-2 group-hover:text-[#588157] group-hover:scale-110 transition-all duration-300"
                      style={{
                        color: isDark ? '#a3b18a' : '#3a5a40',
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {stat.value}
                    </h3>
                    <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Premium Countdown - Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center lg:items-end h-full justify-end"
            >
              <span className="text-xs tracking-[0.2em] uppercase mb-6 font-medium" style={{ color: 'var(--text-muted)' }}>
                Event Begins In
              </span>
              <div className="flex items-center gap-2 sm:gap-3">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Mins", value: timeLeft.mins },
                  { label: "Secs", value: timeLeft.secs },
                ].map((unit, i) => (
                  <React.Fragment key={`countdown-${unit.label}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.8 + i * 0.1,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div
                        className="relative w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center rounded-2xl border transition-all duration-300 shadow-lg group-hover:scale-105 group-hover:shadow-2xl"
                        style={{
                          background: isDark
                            ? "linear-gradient(135deg, rgba(58,90,64,0.25) 0%, rgba(163,177,138,0.15) 100%)"
                            : "linear-gradient(135deg, rgba(88,129,87,0.10) 0%, rgba(88,129,87,0.05) 100%)",
                          borderColor: isDark ? "rgba(163,177,138,0.35)" : "rgba(88,129,87,0.20)",
                          backdropFilter: "blur(20px) saturate(180%)",
                          boxShadow: isDark
                            ? "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px rgba(88,129,87,0.1)"
                            : "0 8px 32px rgba(88,129,87,0.06), inset 0 1px 0 rgba(255,255,255,0.6), 0 0 0 1px rgba(88,129,87,0.05)",
                        }}
                      >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
                        <div className="absolute inset-0 rounded-2xl bg-[#588157]/0 group-hover:bg-[#588157]/10 transition-colors duration-300" />
                        <span
                          className="text-3xl sm:text-4xl font-bold relative z-10 group-hover:scale-110 transition-transform duration-300"
                          style={{
                            color: 'var(--text-heading)',
                            fontFamily: "'Space Grotesk', sans-serif",
                          }}
                        >
                          {unit.value.toString().padStart(2, "0")}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>
                        {unit.label}
                      </span>
                    </motion.div>
                    {i < 3 && (
                      <span className="text-2xl sm:text-3xl font-light mb-8 opacity-40" style={{ color: 'var(--text-muted)' }}>
                        :
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
};