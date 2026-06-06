"use client";
import React from 'react';
import { Sponsors } from '@/components/Sponsors';
import { Link } from '@/lib/router-compat';
import { Download } from 'lucide-react';
import { motion } from 'motion/react';

export default function SponsorsPage({ dbSponsors }: { dbSponsors?: any }) {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <div className="text-gray-400 text-sm tracking-widest mb-6">
          <Link to="/" className="hover:text-white transition-colors">HOME</Link> / SPONSORS & PARTNERS
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          The People Behind<br />ARC 3.0.
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed mb-12">
          We are proud to be supported by industry leaders who believe in the power of innovation and the future of robotics.
        </p>
      </div>

      <Sponsors dbSponsors={dbSponsors} />

      {/* Become a Sponsor CTA */}
      <section className="py-32 px-6 max-w-7xl mx-auto mt-24 border-t border-white/5 relative overflow-hidden">
        {/* No glow blob */}

        <div className="flex flex-col items-center text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Become a Sponsor
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
            Join us in shaping the future of technology. Gain unparalleled access to the brightest young minds in engineering and robotics across the nation.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 bg-[#3a5a40] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#344e41] transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.20)]"
          >
            <Download className="w-5 h-5" />
            Download Sponsor Kit
          </motion.button>
        </div>
      </section>
    </div>
  );
}