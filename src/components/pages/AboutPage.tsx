"use client";
import React from 'react';
import { About } from '@/components/About';
import { Link } from '@/lib/router-compat';
import { Users, Target, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <div className="text-sm tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>
          <Link to="/" className="hover:text-[var(--text-heading)] transition-colors">HOME</Link> / ABOUT US
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Born from Curiosity.<br />Built for Competition.
        </h1>
      </div>
      
      <About />
      
      {/* Mission & Vision */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-10 rounded-2xl border hover:border-[#588157] transition-all duration-300"
            style={{
              background: 'var(--glass-panel-bg)',
              borderColor: 'var(--glass-panel-border)',
              boxShadow: 'var(--glass-panel-shadow)',
            }}
          >
            <div className="w-16 h-16 rounded-full bg-[rgba(88,129,87,0.12)] flex items-center justify-center text-[#588157] mb-8">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-heading)' }}>Our Mission</h3>
            <p className="leading-relaxed text-lg" style={{ color: 'var(--text-body)' }}>
              To ignite the spark of innovation in the next generation of engineers, providing a world-class platform to showcase their robotics and programming skills on a national stage.
            </p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-10 rounded-2xl border hover:border-[#588157] transition-all duration-300"
            style={{
              background: 'var(--glass-panel-bg)',
              borderColor: 'var(--glass-panel-border)',
              boxShadow: 'var(--glass-panel-shadow)',
            }}
          >
            <div className="w-16 h-16 rounded-full bg-[rgba(88,129,87,0.12)] flex items-center justify-center text-[#588157] mb-8">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-heading)' }}>Our Vision</h3>
            <p className="leading-relaxed text-lg" style={{ color: 'var(--text-body)' }}>
              To become the premier robotics competition in South Asia, fostering a community of brilliant minds who will go on to solve the world's most complex engineering challenges.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-heading)' }}>Meet The Team</h2>
          <p style={{ color: 'var(--text-body)' }}>The minds behind Bangladesh's biggest robotics festival.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-40 h-40 rounded-full bg-white/5 overflow-hidden mb-6 border-2 border-transparent group-hover:border-[#3a5a40] transition-all duration-300">
                <ImageWithFallback src={`https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200`} alt="Team member" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-heading)' }}>Jane Doe</h4>
              <p className="text-[#588157] text-sm uppercase tracking-widest mb-4">Event Director</p>
              <div className="flex gap-4" style={{ color: 'var(--text-muted)' }}>
                <a href="#" className="hover:text-[var(--text-heading)] transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-[var(--text-heading)] transition-colors">Twitter</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}