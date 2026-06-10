"use client";

import React, { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

const fallbackFaqs = [
  {
    q: "Who is eligible to participate?",
    a: "Any active university student from a recognized institution in Bangladesh can participate. Teams can be formed across different universities, provided all members hold valid student IDs."
  },
  {
    q: "How much is the registration fee?",
    a: "Fees vary by segment, ranging from ৳500 for single-player events like Maze Solver to ৳3000 for heavy combat robotics. Full details will be available on May 1st."
  },
  {
    q: "Can one person participate in multiple segments?",
    a: "Yes, you can register for multiple segments as long as the schedules do not conflict. We try our best to stagger major events, but please check the final timetable."
  },
  {
    q: "Will hardware be provided?",
    a: "No, teams must bring their own fully constructed robots and spare parts. We only provide the arena, power outlets, and basic workbench facilities in the pit area."
  },
  {
    q: "How does the prize money distribution work?",
    a: "The prize pool is distributed across the 12 segments based on complexity and participation volume. The Heavyweight Combat and Robo Soccer champions receive the largest shares."
  },
  {
    q: "Are there accommodation facilities for out-of-town teams?",
    a: "Limited accommodation is available on a first-come, first-served basis for teams traveling from outside Dhaka. You can request this during registration."
  }
];

export const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch("/api/admin/faqs");
        const data = await res.json();

        const dbFaqs = data.map((faq: any) => ({
          q: faq.question,
          a: faq.answer,
        }));

        setFaqs(dbFaqs);
      } catch (error) {
        console.error("Failed to load FAQs", error);
      }
    }

    loadFaqs();
  }, []);

  const items = faqs ?? [];

  

  return (
    <section id="faq" className="py-32 relative overflow-hidden">
      {/* ── Technical precision atmosphere ── */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: 'var(--section-gradient-base)',
          }}
        />

        {/* ── FULL-WIDTH BACKDROP BLUR ── */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(8px) saturate(120%)',
            WebkitBackdropFilter: 'blur(8px) saturate(120%)',
            background: 'var(--section-backdrop)',
          }}
        />
        {/* Clean vertical-axis haze — minimal and precise */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'var(--section-haze)',
          }}
        />

        {/* Subtle vertical grid lines for tech feel */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(88,180,100,1) 0px, rgba(88,180,100,1) 1px, transparent 1px, transparent 80px)',
          }}
        />
        {/* Center glow */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '600px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(58,130,80,0.10) 0%, transparent 65%)',
            filter: 'blur(90px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Ghost text */}
        <div
          className="absolute select-none pointer-events-none"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(80px, 12vw, 200px)',
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
          FAQ
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(88,129,87,0.22)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(88,129,87,0.18)] to-transparent" />
      </div>

      <div className="px-6 max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mb-14 text-center"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8" style={{ background: 'rgba(88,129,87,0.45)' }} />
            <span className="text-[#588157] text-[11px] tracking-[0.18em] font-medium uppercase">/ FAQ</span>
            <div className="h-px w-8" style={{ background: 'rgba(88,129,87,0.45)' }} />
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ color: 'var(--text-heading)', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Common Questions
          </h2>
        </motion.div>

        {/* ── Technical glass FAQ panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[24px] overflow-hidden"
          style={{
            background: 'var(--glass-panel-bg)',
            backdropFilter: 'blur(18px) saturate(140%)',
            WebkitBackdropFilter: 'blur(18px) saturate(140%)',
            border: '1px solid var(--glass-panel-border)',
            boxShadow: 'var(--glass-panel-shadow)',
          }}
        >
          {/* Top inner highlight */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: '65%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), rgba(180,255,180,0.08), transparent)',
            }}
          />
          {/* Left neon accent line */}
          <div
            className="absolute left-0 top-8 bottom-8 w-px pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, transparent, rgba(88,180,100,0.30), transparent)',
            }}
          />

          <div className="p-2">
            {items.map((faq, i) => (
              <div
                key={i}
                className="relative overflow-hidden"
                style={{
                  borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                {/* Active item highlight */}
                {open === i && (
                  <motion.div
                    layoutId="faq-active"
                    className="absolute inset-0 rounded-[16px] pointer-events-none"
                    style={{
                      background: 'var(--faq-active-bg)',
                      border: '1px solid var(--faq-active-border)',
                    }}
                    transition={{ duration: 0.25 }}
                  />
                )}

                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="relative z-10 w-full flex items-center justify-between text-left group py-5 px-5"
                >
                  {/* Left dot for active */}
                  <span
                    className="mr-3 w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300"
                    style={{
                      background: open === i ? '#6aaf6a' : 'rgba(88,129,87,0.25)',
                      boxShadow: open === i ? '0 0 8px rgba(106,175,106,0.60)' : 'none',
                    }}
                  />
                  <h3
                    className="flex-1 text-[15px] md:text-[17px] font-medium pr-6 transition-colors duration-200"
                    style={{ color: open === i ? 'var(--text-heading)' : 'var(--text-body)' }}
                  >
                    {faq.q}
                  </h3>
                  <div
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: open === i ? 'rgba(88,160,88,0.18)' : 'rgba(14,26,18,0.10)',
                      border: open === i ? '1px solid rgba(106,175,106,0.40)' : '1px solid var(--border)',
                      color: open === i ? '#6aaf6a' : '#588157',
                      boxShadow: open === i ? '0 0 12px rgba(88,160,88,0.20)' : 'none',
                    }}
                  >
                    {open === i ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                      className="relative z-10"
                    >
                      <p className="leading-relaxed text-[14px] pb-5 px-5 pl-10 pr-14" style={{ color: 'var(--text-body)' }}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};