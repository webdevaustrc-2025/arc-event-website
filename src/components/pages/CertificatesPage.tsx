"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, Eye, Award, Calendar, Trophy, Loader2, Lock } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link } from '@/lib/router-compat';

export default function CertificatesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || !theme;
  const [selectedCert, setSelectedCert] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(true);

  const [certificates, setCertificates] = useState<Array<{
    id: number;
    event: string;
    type: string;
    date: string;
    rank: string;
    image: string;
    fileUrl: string;
  }>>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, certificatesRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/dashboard/certificates'),
        ]);

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          setEnabled(settings.enable_certificates !== 'false');
        }

        if (certificatesRes.ok) {
          const certs = await certificatesRes.json();
          setCertificates(certs);
        }
      } catch (err) {
        console.error('Error loading certificates data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#588157]" />
        <p className="text-gray-400 text-sm">Loading certificates...</p>
      </div>
    );
  }

  if (!enabled) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto px-4">
        <div className={`p-5 rounded-full mb-6 ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-700'}`}>
          <Lock className="w-12 h-12" />
        </div>
        <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Certificates Locked
        </h2>
        <p className={`text-sm leading-relaxed mb-8 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
          Certificate validation and download options are currently closed by the event administrators. Please check back after final results are published.
        </p>
        <Link to="/" className="px-6 py-2.5 rounded-lg bg-[#3a5a40] text-white hover:bg-[#344e41] font-semibold transition-all">
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1
          className={`text-3xl sm:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          My Certificates
        </h1>
        <p className={`text-base sm:text-lg ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
          Download and view your earned certificates
        </p>
      </div>

      {/* Certificates Grid */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="group relative rounded-2xl overflow-hidden backdrop-blur-md hover:-translate-y-2 transition-all duration-300"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(58,90,64,0.06) 0%, rgba(163,177,138,0.03) 100%)'
                  : 'linear-gradient(135deg, rgba(58,90,64,0.04) 0%, rgba(163,177,138,0.02) 100%)',
                border: `1px solid ${isDark ? 'rgba(163,177,138,0.12)' : 'rgba(58,90,64,0.15)'}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              {/* Certificate Preview */}
              <div className="relative h-48 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cert.image})` }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(58,90,64,0.7) 100%)',
                  }}
                />

                {/* Certificate Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="p-6 rounded-full backdrop-blur-md"
                    style={{
                      background: 'rgba(88,129,87,0.2)',
                      border: '2px solid rgba(163,177,138,0.3)',
                    }}
                  >
                    <Award className="w-12 h-12 text-[#a3b18a]" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-[#1a1a14]'} group-hover:text-[#588157] transition-colors`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {cert.event}
                </h3>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2.5 text-sm">
                    <Award className="w-4 h-4 text-[#588157]" />
                    <span className={isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}>{cert.type}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <Calendar className="w-4 h-4 text-[#588157]" />
                    <span className={isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}>{cert.date}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <Trophy className="w-4 h-4 text-[#588157]" />
                    <span className={isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}>{cert.rank}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedCert(cert.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #3a5a40 0%, #344e41 100%)',
                      color: '#ffffff',
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      border: `1px solid ${isDark ? 'rgba(163,177,138,0.2)' : 'rgba(58,90,64,0.2)'}`,
                      color: '#588157',
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-20 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}
        >
          <Award className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-[#5A5A52]' : 'text-[#8a8a7a]'}`} />
          <p className="text-lg mb-2">No certificates yet</p>
          <p className="text-sm">Complete events to earn certificates!</p>
        </motion.div>
      )}

      {/* Preview Modal (Simple) */}
      {selectedCert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedCert(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full rounded-2xl overflow-hidden"
            style={{
              background: isDark ? '#0d0d12' : '#ffffff',
              border: `2px solid ${isDark ? 'rgba(163,177,138,0.2)' : 'rgba(58,90,64,0.2)'}`,
            }}
          >
            <div className="p-8 text-center">
              <Award className="w-16 h-16 text-[#588157] mx-auto mb-4" />
              <h2
                className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Certificate of Participation
              </h2>
              <p className={`text-lg mb-8 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
                {certificates.find((c) => c.id === selectedCert)?.event}
              </p>
              <button
                onClick={() => setSelectedCert(null)}
                className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #3a5a40 0%, #344e41 100%)',
                  color: '#ffffff',
                }}
              >
                Close Preview
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
