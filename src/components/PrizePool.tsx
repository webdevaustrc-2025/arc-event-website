"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Crown, Medal, Award } from 'lucide-react';

export const PrizePool = () => {
  return (
    <section className="py-[100px] relative overflow-hidden">
      {/* Full-width liquid-glass backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Base vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'var(--section-gradient-2)',
          }}
        />

        {/* Subtle accent blobs for depth */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: '520px',
            height: '420px',
            borderRadius: '38px',
            background: 'radial-gradient(ellipse at 10% 25%, rgba(88,160,88,0.10) 0%, transparent 55%)',
            filter: 'blur(40px) saturate(140%)',
            left: '4%',
            top: '6%',
            mixBlendMode: 'screen',
          }}
        />

        <div
          className="absolute pointer-events-none"
          style={{
            width: '520px',
            height: '420px',
            borderRadius: '38px',
            background: 'radial-gradient(ellipse at 90% 75%, rgba(36,80,48,0.08) 0%, transparent 55%)',
            filter: 'blur(36px) saturate(120%)',
            right: '4%',
            top: '10%',
            mixBlendMode: 'screen',
          }}
        />

        {/* Top and bottom subtle borders */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(88,129,87,0.18)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(88,129,87,0.14)] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">

        {/* ══════════════════════════════════════════════
            COMPETE FOR GLORY — PREMIUM LIQUID GLASS CTA
        ══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
          className="mb-12 w-full"
        >
          {/* Outer radial glow behind the panel */}
          <div
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: '900px',
              height: '400px',
              background: 'radial-gradient(ellipse, rgba(58,180,80,0.14) 0%, transparent 60%)',
              filter: 'blur(60px)',
              top: '0',
            }}
          />

          {/* Main liquid glass CTA panel */}
          <div
            className="relative mx-auto max-w-3xl rounded-[36px]"
            style={{
              padding: 'clamp(40px, 5vw, 56px) clamp(32px, 4vw, 48px)',
              background: 'var(--glass-panel-bg)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: '1px solid var(--glass-panel-border)',
              boxShadow: 'var(--glass-panel-shadow)',
            }}
          >
            {/* ── Liquid wave top highlight ── */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px] rounded-t-[36px] pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(180,255,180,0.10) 15%, rgba(255,255,255,0.38) 35%, rgba(200,255,200,0.28) 50%, rgba(255,255,255,0.38) 65%, rgba(180,255,180,0.10) 85%, transparent 100%)',
              }}
            />
            {/* Glossy inner top glow */}
            <div
              className="absolute top-0 left-0 right-0 h-24 rounded-t-[36px] pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% -20%, rgba(100,220,110,0.16) 0%, rgba(60,160,80,0.08) 40%, transparent 70%)',
              }}
            />
            {/* Subtle curved wave highlight — liquid feel */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: '-1px',
                left: '15%',
                right: '15%',
                height: '60px',
                background: 'radial-gradient(ellipse at 50% 0%, rgba(200,255,200,0.12) 0%, transparent 70%)',
                filter: 'blur(8px)',
                borderRadius: '50%',
              }}
            />

            {/* Corner accent dots */}
            <div className="absolute top-5 left-7 w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(100,220,100,0.50)', boxShadow: '0 0 6px rgba(100,220,100,0.40)' }} />
            <div className="absolute top-5 right-7 w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(100,220,100,0.50)', boxShadow: '0 0 6px rgba(100,220,100,0.40)' }} />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-4 justify-center mb-7">
                <div className="h-px w-12" style={{ background: 'rgba(88,180,100,0.55)' }} />
                <span className="text-[#588157] text-[11px] tracking-[0.18em] font-medium uppercase">/ Prize Pool</span>
                <div className="h-px w-12" style={{ background: 'rgba(88,180,100,0.55)' }} />
              </div>

              <h2
                className="font-bold text-center"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(38px, 6vw, 62px)',
                  lineHeight: '1.08',
                  letterSpacing: '-0.025em',
                }}
              >
                <span style={{ color: 'var(--text-heading)' }}>Compete for Glory</span>
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, var(--text-heading) 0%, #588157 100%)',
                  }}
                >
                  Win Big
                </span>
              </h2>

              <p className="text-[15px] mt-5 max-w-[440px] mx-auto" style={{ color: 'var(--text-body)' }}>
                Total prize money distributed across all segments
              </p>
            </div>

            {/* Bottom fade */}
            <div
              className="absolute bottom-0 left-0 right-0 h-16 rounded-b-[36px] pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, transparent 0%, rgba(88,200,88,0.04) 100%)',
              }}
            />
          </div>
        </motion.div>

        {/* ── Hero Prize Amount ── */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 mb-14"
        >
          <h3
            className="font-bold tracking-tight"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(64px, 8vw, 96px)',
              color: 'var(--text-heading)',
            }}
          >
            ৳1,00,000+
          </h3>
          <div
            className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full shadow-sm"
            style={{
              background: 'var(--stat-badge-bg)',
              border: '1px solid var(--stat-badge-border)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span className="text-[11px] uppercase tracking-[0.10em]" style={{ color: 'var(--text-body)' }}>Total Prize Money Across All Segments</span>
          </div>
        </motion.div>

        {/* ── Podium Layout — 3 Tier Glass Cards ── */}
        <div className="mt-10 w-full max-w-5xl">

          {/* Desktop Podium */}
          <div className="hidden md:flex items-end justify-center gap-6">

            {/* Runner Up — 2nd */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="w-[290px] h-[220px] rounded-[20px] p-6 relative group cursor-default hover:-translate-y-2 transition-all duration-300"
              style={{
                background: 'var(--glass-panel-bg)',
                backdropFilter: 'blur(24px) saturate(160%)',
                WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                border: '1px solid var(--glass-panel-border)',
                borderTop: '2px solid rgba(192,192,192,0.60)',
                boxShadow: 'var(--glass-panel-shadow)',
              }}
            >
              <div className="absolute inset-0 rounded-[20px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(200,200,200,0.05) 0%, transparent 55%)' }} />
              <div className="absolute top-4 right-4 text-[60px] font-bold leading-none opacity-20" style={{ color: 'var(--text-muted)', fontFamily: "'Space Grotesk', sans-serif" }}>2</div>
              <Medal className="w-5 h-5 text-[#A8A8A8] mb-3" />
              <p className="text-[#A8A8A8] text-[11px] uppercase tracking-[0.15em] mb-2">Runner Up</p>
              <p className="text-[26px] font-bold mb-1" style={{ color: 'var(--text-heading)', fontFamily: "'Space Grotesk', sans-serif" }}>৳30,000</p>
              <p className="text-[12px] mb-3" style={{ color: 'var(--text-body)' }}>Second Place Prize</p>
              <div className="h-px mb-3" style={{ background: 'var(--border)' }} />
              <p className="text-[12px] text-left" style={{ color: 'var(--text-body)' }}>• Silver medal + Certificate</p>
              <p className="text-[12px] text-left" style={{ color: 'var(--text-body)' }}>• Recognition award</p>
            </motion.div>

            {/* Champion — 1st */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="w-[330px] h-[290px] rounded-[22px] p-7 relative group cursor-default hover:-translate-y-2 transition-all duration-300"
              style={{
                background: 'var(--glass-panel-bg)',
                backdropFilter: 'blur(30px) saturate(200%)',
                WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                border: '1px solid var(--glass-panel-border)',
                borderTop: '2px solid rgba(212,175,55,0.75)',
                boxShadow: 'var(--glass-panel-shadow)',
              }}
            >
              <div className="absolute inset-0 rounded-[22px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.10) 0%, transparent 52%)' }} />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ width: '55%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,230,80,0.28), transparent)' }} />
              <div className="absolute top-4 right-4 text-[60px] font-bold leading-none opacity-20" style={{ color: 'var(--text-muted)', fontFamily: "'Space Grotesk', sans-serif" }}>1</div>
              <Crown className="w-7 h-7 text-[#D4AF37] mb-3" />
              <p className="text-[#D4AF37] text-[11px] uppercase tracking-[0.15em] mb-2">Champion</p>
              <p className="text-[32px] font-bold mb-1" style={{ color: 'var(--text-heading)', fontFamily: "'Space Grotesk', sans-serif" }}>৳50,000</p>
              <p className="text-[13px] mb-4" style={{ color: 'var(--text-body)' }}>First Place Prize</p>
              <div className="h-px mb-3" style={{ background: 'var(--border)' }} />
              <p className="text-[12px] text-left" style={{ color: 'var(--text-body)' }}><span className="text-[#588157]">✦</span> Gold Trophy + Certificate</p>
              <p className="text-[12px] text-left mt-1" style={{ color: 'var(--text-body)' }}><span className="text-[#588157]">✦</span> University Recognition</p>
              <p className="text-[12px] text-left mt-1" style={{ color: 'var(--text-body)' }}><span className="text-[#588157]">✦</span> Special Sponsor Gift</p>
            </motion.div>

            {/* 2nd Runner Up — 3rd */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-[290px] h-[200px] rounded-[20px] p-6 relative group cursor-default hover:-translate-y-2 transition-all duration-300"
              style={{
                background: 'var(--glass-panel-bg)',
                backdropFilter: 'blur(24px) saturate(160%)',
                WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                border: '1px solid var(--glass-panel-border)',
                borderTop: '2px solid rgba(176,141,87,0.60)',
                boxShadow: 'var(--glass-panel-shadow)',
              }}
            >
              <div className="absolute inset-0 rounded-[20px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(176,141,87,0.07) 0%, transparent 52%)' }} />
              <div className="absolute top-4 right-4 text-[60px] font-bold leading-none opacity-20" style={{ color: 'var(--text-muted)', fontFamily: "'Space Grotesk', sans-serif" }}>3</div>
              <Award className="w-5 h-5 text-[#B08D57] mb-3" />
              <p className="text-[#B08D57] text-[11px] uppercase tracking-[0.15em] mb-2">2nd Runner Up</p>
              <p className="text-[26px] font-bold mb-1" style={{ color: 'var(--text-heading)', fontFamily: "'Space Grotesk', sans-serif" }}>৳20,000</p>
              <p className="text-[12px] mb-3" style={{ color: 'var(--text-body)' }}>Third Place Prize</p>
              <div className="h-px mb-3" style={{ background: 'var(--border)' }} />
              <p className="text-[12px] text-left" style={{ color: 'var(--text-body)' }}>• Bronze medal + Certificate</p>
            </motion.div>
          </div>

          {/* Mobile stacked */}
          <div className="md:hidden flex flex-col gap-4">
            {[
              { rank: 'Champion', amount: '৳50,000', label: 'First Place Prize', color: '#D4AF37', BIcon: Crown, perks: ['Gold Trophy + Certificate', 'University Recognition', 'Special Sponsor Gift'] },
              { rank: 'Runner Up', amount: '৳30,000', label: 'Second Place Prize', color: '#A8A8A8', BIcon: Medal, perks: ['Silver medal + Certificate', 'Recognition award'] },
              { rank: '2nd Runner Up', amount: '৳20,000', label: 'Third Place Prize', color: '#B08D57', BIcon: Award, perks: ['Bronze medal + Certificate'] },
            ].map(({ rank, amount, label, color, BIcon, perks }, idx) => (
              <motion.div
                key={rank}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="w-full rounded-[20px] p-6 text-left"
                style={{
                  background: 'var(--glass-panel-bg)',
                  backdropFilter: 'blur(22px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(22px) saturate(160%)',
                  border: '1px solid var(--glass-panel-border)',
                  borderTop: `2px solid ${color}`,
                  boxShadow: 'var(--glass-panel-shadow)',
                }}
              >
                <BIcon className="w-6 h-6 mb-3" style={{ color }} />
                <p className="text-[11px] uppercase tracking-[0.15em] mb-2" style={{ color }}>{rank}</p>
                <p className="text-[28px] font-bold mb-1" style={{ color: 'var(--text-heading)', fontFamily: "'Space Grotesk', sans-serif" }}>{amount}</p>
                <p className="text-[13px] mb-3" style={{ color: 'var(--text-body)' }}>{label}</p>
                <div className="h-px mb-3" style={{ background: 'var(--border)' }} />
                {perks.map((p, i) => <p key={i} className="text-[12px] mt-1" style={{ color: 'var(--text-body)' }}>• {p}</p>)}
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Segment Prize Breakdown ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 w-full"
        >
          <h3 className="text-[17px] text-center mb-8 tracking-wide" style={{ color: 'var(--text-body)' }}>Prize breakdown per segment</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 justify-center flex-wrap">
            {[
              { name: 'Line Following', prize: '৳15,000' },
              { name: 'Maze Solving', prize: '৳15,000' },
              { name: 'Robo Soccer', prize: '৳20,000' },
              { name: 'Robo War', prize: '৳25,000' },
              { name: 'Innovation', prize: '৳15,000' },
              { name: 'Creative Bot', prize: '৳10,000' }
            ].map((segment, i) => (
              <div
                key={i}
                className="min-w-[155px] h-[96px] rounded-[14px] p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 cursor-default group text-left"
                style={{
                  background: 'var(--glass-panel-bg)',
                  backdropFilter: 'blur(18px) saturate(145%)',
                  WebkitBackdropFilter: 'blur(18px) saturate(145%)',
                  border: '1px solid var(--glass-panel-border)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(88,129,87,0.35)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.09)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.border = '1px solid var(--glass-panel-border)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.06)';
                }}
              >
                <p className="text-[13px] font-bold" style={{ color: 'var(--text-body)' }}>{segment.name}</p>
                <div>
                  <p className="text-[20px] font-bold" style={{ color: 'var(--text-heading)', fontFamily: "'Space Grotesk', sans-serif" }}>{segment.prize}</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>1st place</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
