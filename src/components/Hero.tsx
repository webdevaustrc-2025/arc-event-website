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

export const Hero = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 45,
    hours: 12,
    mins: 30,
    secs: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, mins, secs } = prev;
        if (secs > 0) secs--;
        else {
          secs = 59;
          if (mins > 0) mins--;
          else {
            mins = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source
            src="https://res.cloudinary.com/dec82taov/video/upload/v1778156010/Text_ARC_3.0_assembling_glowing_202605071801_kycjem.mp4"
            type="video/mp4"
          />
        </video>
        {/* Sharp gradient overlay - NO BLUR for crisp hero */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F]/75 via-[#0A0A0F]/60 to-[#0A0A0F]/95" />
        {/* Subtle color tint - NO BLUR */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#588157]/[0.04]" />
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

            <span className="text-[#a3b18a] font-medium relative z-10">
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
            className="mt-8 text-[#9A9A8E] text-lg md:text-xl max-w-2xl font-light"
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
              <span className="relative z-10 flex items-center justify-center gap-3 px-8 py-4 rounded-full backdrop-blur-md bg-white/5 border border-white/10">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-white">
                  <Play
                    className="w-3 h-3 ml-0.5"
                    fill="currentColor"
                  />
                </div>
                <span className="text-[#9A9A8E] transition-all duration-500 group-hover:translate-x-1 group-hover:text-white">
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
              <span className="text-xs tracking-[0.2em] text-[#5A5A52] uppercase mb-6 font-medium">
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
                      className="text-3xl sm:text-4xl font-bold text-[#a3b18a] tracking-tight leading-none mb-2 group-hover:text-[#588157] group-hover:scale-110 transition-all duration-300"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {stat.value}
                    </h3>
                    <p className="text-[10px] sm:text-xs font-medium text-[#5A5A52] uppercase tracking-wider">
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
              <span className="text-xs tracking-[0.2em] text-[#5A5A52] uppercase mb-6 font-medium">
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
                          background:
                            "linear-gradient(135deg, rgba(58,90,64,0.25) 0%, rgba(163,177,138,0.15) 100%)",
                          borderColor: "rgba(163,177,138,0.35)",
                          backdropFilter: "blur(20px) saturate(180%)",
                          boxShadow:
                            "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px rgba(88,129,87,0.1)",
                        }}
                      >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
                        <div className="absolute inset-0 rounded-2xl bg-[#588157]/0 group-hover:bg-[#588157]/10 transition-colors duration-300" />
                        <span
                          className="text-3xl sm:text-4xl font-bold text-[#a3b18a] relative z-10 group-hover:scale-110 transition-transform duration-300"
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                          }}
                        >
                          {unit.value.toString().padStart(2, "0")}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-xs text-[#5A5A52] uppercase tracking-wider font-medium">
                        {unit.label}
                      </span>
                    </motion.div>
                    {i < 3 && (
                      <span className="text-[#5A5A52] text-2xl sm:text-3xl font-light mb-8 opacity-40">
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