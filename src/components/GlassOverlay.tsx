"use client";
import React from 'react';
import { motion } from 'motion/react';

/**
 * Full-page blurry liquid glass effect overlay
 * Creates a premium glassmorphism aesthetic across the entire page
 * NOTE: Excludes hero section for crisp, sharp visuals
 */
export const GlassOverlay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Mask to exclude hero section (first 100vh) */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: 'polygon(0 100vh, 100% 100vh, 100% 100%, 0 100%)',
        }}
      >
        {/* Main glass layer with gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(88,129,87,0.02) 0%, transparent 50%, rgba(58,90,64,0.03) 100%)',
            backdropFilter: 'blur(0.5px)',
          }}
        />

        {/* Animated floating orbs for liquid effect */}
        <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(88,129,87,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          top: '10%',
          left: '5%',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(163,177,138,0.06) 0%, transparent 70%)',
          filter: 'blur(70px)',
          bottom: '15%',
          right: '10%',
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, -25, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(58,90,64,0.05) 0%, transparent 70%)',
          filter: 'blur(50px)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -20, 20, 0],
          scale: [1, 1.2, 0.95, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
      />

        {/* Subtle noise texture for glass realism */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Vignette for depth */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,15,0.15) 100%)',
          }}
        />
      </div>
    </div>
  );
};
