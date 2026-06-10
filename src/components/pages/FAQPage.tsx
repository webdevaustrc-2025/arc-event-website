"use client";
import React, { useState } from 'react';
import { FAQ } from '@/components/FAQ';
import { Link } from '@/lib/router-compat';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function FAQPage({ dbFAQs }: { dbFAQs?: any[] }) {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 mb-16 text-center">
        <div className="text-sm tracking-widest mb-6" style={{ color: 'var(--text-body)' }}>
          <Link to="/" className="hover:text-[var(--text-heading)] transition-colors">HOME</Link> / FAQ
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: 'var(--text-heading)', fontFamily: "'Space Grotesk', sans-serif" }}>
          Got Questions?
        </h1>
        <p className="max-w-2xl mx-auto text-lg leading-relaxed mb-12" style={{ color: 'var(--text-body)' }}>
          Everything you need to know about registering, competing, and winning at ARC 3.0 2025.
        </p>

        {/* Filter Pills — horizontal scroll on mobile, wrap on larger screens */}
        <div className="flex overflow-x-auto sm:flex-wrap sm:justify-center gap-3 pb-2 sm:pb-0 -mx-6 px-6 sm:mx-0 sm:px-0 scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {['General', 'Registration', 'Payment', 'Segments', 'Technical'].map((f, i) => (
            <button
              key={f}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border min-h-[40px] ${i === 0
                  ? 'bg-[#588157]/15 border-[#588157] text-[var(--text-heading)] shadow-md'
                  : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-[var(--text-body)] hover:bg-black/10 dark:hover:bg-white/10'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <FAQ dbFAQs={dbFAQs} />
      </div>

      {/* Bottom CTA */}
      <section className="py-24 px-6 max-w-4xl mx-auto mt-16 border-t text-center" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: "'Space Grotesk', sans-serif" }}>
          Still have questions?
        </h2>
        <p className="mb-8" style={{ color: 'var(--text-body)' }}>
          Can\'t find the answer you\'re looking for? Our support team is here to help.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 bg-[#3a5a40] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#344e41] transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.20)]"
        >
          <MessageCircle className="w-5 h-5" />
          Chat with Support
        </motion.button>
      </section>
    </div>
  );
}