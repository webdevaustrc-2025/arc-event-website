"use client";
import React from 'react';
import { motion } from 'motion/react';

interface SectionWrapperProps {
  children: React.ReactNode;
  variant?: 'light' | 'medium' | 'heavy' | 'none';
  className?: string;
  id?: string;
}

/**
 * Premium section wrapper with configurable background blur
 * Creates visual depth and separation between sections
 */
export const SectionWrapper = ({
  children,
  variant = 'medium',
  className = '',
  id,
}: SectionWrapperProps) => {
  const blurConfig = {
    none: {
      blur: 0,
      opacity: 0,
      gradient: 'transparent',
    },
    light: {
      blur: 8,
      opacity: 0.03,
      gradient: 'linear-gradient(180deg, rgba(88,129,87,0.02) 0%, transparent 50%, rgba(58,90,64,0.02) 100%)',
    },
    medium: {
      blur: 16,
      opacity: 0.05,
      gradient: 'linear-gradient(180deg, rgba(88,129,87,0.04) 0%, rgba(10,10,15,0.3) 50%, rgba(58,90,64,0.04) 100%)',
    },
    heavy: {
      blur: 24,
      opacity: 0.08,
      gradient: 'linear-gradient(180deg, rgba(88,129,87,0.06) 0%, rgba(10,10,15,0.5) 50%, rgba(58,90,64,0.06) 100%)',
    },
  };

  const config = blurConfig[variant];

  if (variant === 'none') {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <section id={id} className={`relative ${className}`}>
      {/* Background blur layer */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: config.gradient,
          }}
        />

        {/* Blur effect */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${config.blur}px) saturate(120%)`,
            background: `rgba(10,10,15,${config.opacity})`,
          }}
        />

        {/* Ambient orb for depth */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(88,129,87,0.3) 0%, transparent 70%)',
            filter: `blur(${config.blur * 3}px)`,
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
};
