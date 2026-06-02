"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { QRGenerator } from '@/components/dashboard/QRGenerator';
import { Loader2, QrCode } from 'lucide-react';
import { Link } from '@/lib/router-compat';

export default function QRPassPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || !theme;
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [events, setEvents] = useState<Array<{
    id: number;
    title: string;
    qrToken: string;
    registrationCode?: string;
    registrationDate?: string;
    teamName?: string;
    registrationStatus?: string;
  }>>([]);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchQRData() {
      try {
        const res = await fetch('/api/dashboard/summary');
        if (res.ok) {
          const summaryData = await res.json();
          setUserName(summaryData.user?.name || 'Participant');
          const enrolled = (summaryData.events || []).map((e: any) => ({
            id: e.id,
            title: e.title,
            qrToken: e.qrToken,
            registrationCode: e.registrationCode,
            registrationDate: e.registrationDate,
            teamName: e.teamName,
            registrationStatus: e.registrationStatus,
          }));
          setEvents(enrolled);
          if (enrolled.length > 0) {
            setSelectedEventId(enrolled[0].id);
          }
        } else {
          const data = await res.json().catch(() => ({}));
          setError(data.message || 'Failed to load QR passes.');
        }
      } catch (err) {
        console.error('Error fetching QR data:', err);
        setError('Network error while loading QR passes.');
      } finally {
        setLoading(false);
      }
    }
    fetchQRData();
  }, []);

  const currentEvent = events.find((e) => e.id === selectedEventId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#588157]" />
        <p className="text-gray-400 text-sm">Loading QR passes...</p>
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
          QR Entry Pass
        </h1>
        <p className={`text-base sm:text-lg ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
          Generate and download your entry QR codes for events
        </p>
      </div>

      {error ? (
        <div
          className="p-8 rounded-2xl text-center backdrop-blur-md"
          style={{
            background: isDark ? 'rgba(220,38,38,0.08)' : 'rgba(220,38,38,0.06)',
            border: '1px solid rgba(220,38,38,0.25)',
          }}
        >
          <QrCode className="w-12 h-12 mx-auto mb-3 text-red-400" />
          <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}>Unable to Load QR Passes</h3>
          <p className="text-sm text-red-300">{error}</p>
        </div>
      ) : events.length > 0 && currentEvent ? (
        <>
          {/* Event Selector */}
          <div className="mb-8">
            <label
              className={`block text-sm font-medium mb-3 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}
            >
              Select Event
            </label>
            <div className="flex flex-wrap gap-3">
              {events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEventId(event.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedEventId === event.id
                      ? isDark
                        ? 'bg-[#588157]/20 text-[#a3b18a] border-2 border-[#588157]/50'
                        : 'bg-[#588157]/15 text-[#3a5a40] border-2 border-[#588157]/40'
                      : isDark
                      ? 'bg-white/5 text-[#9A9A8E] border-2 border-transparent hover:bg-white/10'
                      : 'bg-black/5 text-[#8a8a7a] border-2 border-transparent hover:bg-black/10'
                  }`}
                >
                  {event.title}
                </button>
              ))}
            </div>
          </div>

          {/* QR Code */}
          <motion.div
            key={selectedEventId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <QRGenerator
              eventName={currentEvent.title}
              userName={userName}
              uniqueId={currentEvent.qrToken}
              registrationCode={currentEvent.registrationCode}
              registrationDate={currentEvent.registrationDate}
              teamName={currentEvent.teamName}
              registrationStatus={currentEvent.registrationStatus}
            />
          </motion.div>
        </>
      ) : (
        <div
          className="p-12 rounded-2xl text-center backdrop-blur-md"
          style={{
            background: isDark
              ? 'rgba(58,90,64,0.03)'
              : 'rgba(58,90,64,0.02)',
            border: `1px dashed ${isDark ? 'rgba(163,177,138,0.2)' : 'rgba(58,90,64,0.2)'}`,
          }}
        >
          <QrCode className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-[#5A5A52]' : 'text-[#8a8a7a]'}`} />
          <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}>No Registered Events</h3>
          <p className={`text-sm mb-6 max-w-md mx-auto ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
            You need to be registered for a segment in order to generate an entry QR code.
          </p>
          <Link
            to="/segments"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #3a5a40 0%, #344e41 100%)',
              color: '#ffffff',
            }}
          >
            Register Now
          </Link>
        </div>
      )}

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 p-6 rounded-2xl backdrop-blur-md"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(58,90,64,0.06) 0%, rgba(163,177,138,0.03) 100%)'
            : 'linear-gradient(135deg, rgba(58,90,64,0.04) 0%, rgba(163,177,138,0.02) 100%)',
          border: `1px solid ${isDark ? 'rgba(163,177,138,0.12)' : 'rgba(58,90,64,0.15)'}`,
        }}
      >
        <h3
          className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          How to Use Your QR Pass
        </h3>
        <ul className={`space-y-3 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#588157]/20 text-[#588157] flex items-center justify-center text-sm font-bold">
              1
            </span>
            <span>Download or screenshot your QR code before arriving at the venue</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#588157]/20 text-[#588157] flex items-center justify-center text-sm font-bold">
              2
            </span>
            <span>Show the QR code at the registration desk for quick check-in</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#588157]/20 text-[#588157] flex items-center justify-center text-sm font-bold">
              3
            </span>
            <span>Keep your QR code accessible throughout the event for verification</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#588157]/20 text-[#588157] flex items-center justify-center text-sm font-bold">
              4
            </span>
            <span>Each QR code is unique to you and cannot be shared or transferred</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
