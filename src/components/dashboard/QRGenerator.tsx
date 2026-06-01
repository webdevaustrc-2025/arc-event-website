"use client";
import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Maximize2 } from 'lucide-react';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { motion } from 'motion/react';

interface QRGeneratorProps {
  eventName: string;
  userName: string;
  uniqueId: string;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ eventName, userName, uniqueId }) => {
  const { isDark } = useResolvedTheme();
  const qrRef = useRef<HTMLDivElement>(null);
  const [qrSize, setQrSize] = React.useState(256);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setQrSize(window.innerWidth < 640 ? 200 : 256);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const downloadQR = () => {
    if (qrRef.current) {
      const svg = qrRef.current.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL('image/png');

          const downloadLink = document.createElement('a');
          downloadLink.download = `${eventName}-QR-Pass.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
      }
    }
  };

  const qrValue = JSON.stringify({
    event: eventName,
    user: userName,
    id: uniqueId,
    timestamp: Date.now(),
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative p-4 sm:p-6 md:p-8 rounded-2xl backdrop-blur-md mx-auto max-w-md w-full"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(58,90,64,0.08) 0%, rgba(163,177,138,0.04) 100%)'
          : 'linear-gradient(135deg, rgba(58,90,64,0.06) 0%, rgba(163,177,138,0.03) 100%)',
        border: `2px solid rgba(88,129,87,0.3)`,
        boxShadow: '0 0 40px rgba(88,129,87,0.2), 0 8px 32px rgba(0,0,0,0.15)',
      }}
    >
      {/* Glow Effect */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none rounded-2xl"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(88,129,87,0.2) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h2
            className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Entry Pass
          </h2>
          <p className={`text-sm ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
            Show this QR code at the venue
          </p>
        </div>

        {/* QR Code */}
        <div
          ref={qrRef}
          className="bg-white p-4 sm:p-6 rounded-2xl mb-6 mx-auto w-fit"
        >
          <QRCodeSVG value={qrValue} size={qrSize} level="H" includeMargin />
        </div>

        {/* Details */}
        <div className={`space-y-3 mb-6 p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
          <div>
            <p className={`text-xs uppercase tracking-wider mb-1 ${isDark ? 'text-[#5A5A52]' : 'text-[#8a8a7a]'}`}>
              Event
            </p>
            <p className={`font-semibold ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}>{eventName}</p>
          </div>
          <div>
            <p className={`text-xs uppercase tracking-wider mb-1 ${isDark ? 'text-[#5A5A52]' : 'text-[#8a8a7a]'}`}>
              Participant
            </p>
            <p className={`font-semibold ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}>{userName}</p>
          </div>
          <div>
            <p className={`text-xs uppercase tracking-wider mb-1 ${isDark ? 'text-[#5A5A52]' : 'text-[#8a8a7a]'}`}>
              ID
            </p>
            <p className={`font-mono text-sm font-semibold ${isDark ? 'text-[#588157]' : 'text-[#3a5a40]'}`}>
              {uniqueId}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={downloadQR}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #3a5a40 0%, #344e41 100%)',
              color: '#ffffff',
            }}
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            className="px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              border: `1px solid ${isDark ? 'rgba(163,177,138,0.2)' : 'rgba(58,90,64,0.2)'}`,
              color: '#588157',
            }}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
