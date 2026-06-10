"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Ayan Rahman',
    team: 'BUET Robotics Club',
    quote: "ARC 3.0 challenged us to push our autonomous navigation systems beyond anything we've done before. The competition is fierce, and the learning curve is massive."
  },
  {
    id: 2,
    name: 'Sarah Islam',
    team: 'NSU Mars Rover Team',
    quote: "Winning the Drone Racing segment last year opened up so many opportunities for our team. It's the premier stage for robotics in Bangladesh."
  },
  {
    id: 3,
    name: 'Farhan Ahmed',
    team: 'IUT Mechatronics',
    quote: "The energy in the arena during the Sumo Bot finals is indescribable. It's not just a competition, it's a celebration of engineering."
  },
  {
    id: 4,
    name: 'Nusrat Jahan',
    team: 'DU Innovators',
    quote: "The mentorship and technical support we received at ARC 3.0 helped us refine our project into something we're truly proud of."
  },
  {
    id: 5,
    name: 'Rafiq Hassan',
    team: 'CUET Engineers',
    quote: "Competing at ARC 3.0 is more than winning prizes—it's about pushing boundaries and connecting with like-minded innovators."
  }
];

const doubledTestimonials = [...testimonials, ...testimonials];

export const Testimonials = () => {
  return (
    <section className="py-24 sm:py-32 overflow-hidden relative">
      {/* ── Distinct testimonials atmosphere — mid-green with warm tint ── */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'var(--section-gradient-base)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(10px) saturate(135%)',
            WebkitBackdropFilter: 'blur(10px) saturate(135%)',
            background: 'var(--section-backdrop)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'var(--section-haze)',
          }}
        />
        {/* Center radial glow */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '800px',
            height: '600px',
            background: 'radial-gradient(ellipse, rgba(100,150,80,0.12) 0%, rgba(60,100,55,0.06) 40%, transparent 68%)',
            filter: 'blur(100px)',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
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
            bottom: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            filter: 'blur(1px)',
          }}
        >
          VOICES
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(163,177,138,0.22)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(163,177,138,0.18)] to-transparent" />
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex items-center gap-4 justify-center mb-4">
            <div className="h-px w-8" style={{ background: 'rgba(88,129,87,0.45)' }} />
            <span className="text-[#588157] text-[11px] tracking-[0.18em] font-medium uppercase">/ Testimonials</span>
            <div className="h-px w-8" style={{ background: 'rgba(88,129,87,0.45)' }} />
          </div>
          <h2
            className="font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px, 5vw, 58px)', color: 'var(--text-heading)' }}
          >
            What Participants Say.
          </h2>
          <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: 'var(--text-body)' }}>
            Hear from the champions, builders, and innovators who have stood in the arena.
          </p>
        </motion.div>
      </div>

      {/* ── Infinite scroll of premium glass testimonial cards ── */}
      <div className="relative w-full overflow-hidden">
        {/* Edge masks */}
        <div
          className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, var(--background), transparent)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(-90deg, var(--background), transparent)' }}
        />

        <motion.div
          className="flex gap-5 pl-6"
          animate={{ x: [0, -110 * testimonials.length] }}
          transition={{ duration: 44, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
        >
          {doubledTestimonials.map((test, index) => (
            <div
              key={`${test.id}-${index}`}
              className="flex-shrink-0 w-[400px] h-[260px] rounded-[22px] p-7 flex flex-col justify-between group cursor-default relative overflow-hidden"
              style={{
                background: 'var(--glass-panel-bg)',
                backdropFilter: 'blur(22px) saturate(170%)',
                WebkitBackdropFilter: 'blur(22px) saturate(170%)',
                border: '1px solid var(--glass-panel-border)',
                boxShadow: 'var(--glass-panel-shadow)',
              }}
            >
              {/* Top inner highlight */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                style={{
                  width: '55%',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), rgba(180,255,180,0.12), transparent)',
                }}
              />
              {/* Hover glow border */}
              <div
                className="absolute inset-0 rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 0 1px rgba(140,200,140,0.28), 0 0 30px rgba(58,130,80,0.12)' }}
              />

              {/* Quote icon */}
              <Quote
                className="w-9 h-9 absolute top-5 right-5 transition-all duration-500"
                style={{ color: 'rgba(88,160,88,0.12)' }}
              />

              <p
                className="leading-relaxed text-[14px] relative z-10"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  color: 'var(--text-body)',
                }}
              >
                "{test.quote}"
              </p>

              <div
                className="relative z-10 pt-4"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] flex-shrink-0"
                    style={{
                      background: 'var(--border)',
                      border: '1px solid var(--glass-panel-border)',
                      color: 'var(--text-heading)',
                    }}
                  >
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4
                      className="font-bold text-[14px]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-heading)' }}
                    >
                      {test.name}
                    </h4>
                    <span className="text-[10px] uppercase tracking-[0.10em] font-medium" style={{ color: 'var(--text-muted)' }}>{test.team}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
