"use client";
import React from 'react';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';

interface AnimatedMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const AnimatedMenuButton: React.FC<AnimatedMenuButtonProps> = ({ isOpen, onClick }) => {
  const { isDark } = useResolvedTheme();

  return (
    <button
      onClick={onClick}
      className="relative w-10 h-10 flex flex-col items-center justify-center gap-2.5 transition-transform duration-500 cursor-pointer"
      style={{
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
      aria-label="Toggle menu"
    >
      {/* Bar 1 */}
      <div
        className="h-1 rounded transition-all duration-500"
        style={{
          width: isOpen ? '100%' : '70%',
          backgroundColor: '#588157',
          position: isOpen ? 'absolute' : 'relative',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
        }}
      />

      {/* Bar 2 */}
      <div
        className="w-full h-1 rounded transition-all duration-800"
        style={{
          backgroundColor: '#588157',
          position: isOpen ? 'absolute' : 'relative',
          transform: isOpen ? 'scaleX(0)' : 'scaleX(1)',
        }}
      />

      {/* Bar 3 */}
      <div
        className="h-1 rounded transition-all duration-500"
        style={{
          width: isOpen ? '100%' : '70%',
          backgroundColor: '#588157',
          position: isOpen ? 'absolute' : 'relative',
          transform: isOpen ? 'rotate(-45deg)' : 'rotate(0deg)',
        }}
      />
    </button>
  );
};
