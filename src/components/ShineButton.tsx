"use client";
import React from 'react';
import { motion } from 'motion/react';

interface ShineButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const ShineButton: React.FC<ShineButtonProps> = ({ children, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      className="shine-button relative px-8 py-4 rounded-full font-semibold min-h-[52px] overflow-hidden transition-all duration-300 group"
      style={{
        background: 'linear-gradient(135deg, #3a5a40 0%, #344e41 100%)',
        border: '1px solid rgba(163, 177, 138, 0.3)',
        color: '#ffffff',
        boxShadow: '0 4px 20px rgba(58, 90, 64, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
    >
      <span className="relative z-20 inline-block group-hover:animate-shimmer" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {children}
      </span>

      {/* Shine Effect */}
      <div
        className="absolute top-[-50px] left-[-75px] w-[50px] h-[155px] opacity-40 transition-all duration-[550ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:left-[120%] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(163, 177, 138, 0.6) 0%, rgba(88, 129, 87, 0.8) 100%)',
          transform: 'rotate(35deg)',
          zIndex: 10,
        }}
      />
    </motion.button>
  );
};
