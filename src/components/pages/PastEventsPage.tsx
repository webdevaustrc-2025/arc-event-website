"use client";
import React from 'react';
import { Highlights } from '@/components/Highlights';
import { Link } from '@/lib/router-compat';

export default function PastEventsPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <div className="text-gray-400 text-sm tracking-widest mb-6">
          <Link to="/" className="hover:text-white transition-colors">HOME</Link> / PAST EVENTS
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Where It All Began.
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed mb-12">
          Relive the moments of innovation, teamwork, and raw competition from previous editions of RoboFest.
        </p>
      </div>

      <Highlights />
      
      {/* Event Archive */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 mt-24">
        <h2 className="text-4xl font-bold mb-12 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Event Archive</h2>
        
        <div className="grid grid-cols-1 gap-12">
          {[2024, 2023, 2022].map((year, i) => (
            <div key={year} className={`flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden`}>
              <div className="md:w-1/2 aspect-video bg-gray-800">
                <img 
                  src={`https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800&h=600`} 
                  alt={`RoboFest ${year}`} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="md:w-1/2 p-12 flex flex-col justify-center">
                <h3 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>RoboFest {year}</h3>
                <p className="text-gray-400 leading-relaxed mb-8">
                  The {year} edition saw unprecedented participation from over 50 universities nationwide. With {year === 2024 ? '10' : year === 2023 ? '8' : '6'} competitive segments, the event set a new standard for collegiate robotics.
                </p>
                <div className="grid grid-cols-3 gap-6 mb-8 border-t border-b border-white/5 py-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#a3b18a]">{year === 2024 ? '400+' : year === 2023 ? '350+' : '200+'}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Participants</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#a3b18a]">{year === 2024 ? '10' : year === 2023 ? '8' : '6'}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Segments</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#a3b18a]">{year === 2024 ? '৳80K' : year === 2023 ? '৳60K' : '৳40K'}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Prize Pool</div>
                  </div>
                </div>
                <button className="self-start text-[#588157] text-sm uppercase tracking-widest font-bold hover:text-[#a3b18a] transition-colors">
                  View Gallery →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}