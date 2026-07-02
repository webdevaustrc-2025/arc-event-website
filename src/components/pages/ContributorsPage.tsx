"use client";

import React from "react";
import { motion } from "motion/react";
import { Linkedin, Facebook, Github, Mail, Gem } from "lucide-react";
import { Contributor, contributorsData } from "@/data/contributors";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatLink = (
  url: string,
  type: "linkedin" | "github" | "facebook",
): string => {
  if (!url) return "#";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (type === "linkedin")
    return `https://${url.startsWith("www.") ? "" : ""}${url.includes("linkedin.com") ? "" : "linkedin.com/in/"}${url}`;
  if (type === "github")
    return url.includes("github.com")
      ? `https://${url}`
      : `https://github.com/${url}`;
  return `https://${url}`;
};

const getImageUrl = (url: string): string => {
  if (!url) return "";
  if (url.includes("drive.google.com")) {
    const idMatch = url.match(/id=([^&]+)/);
    if (idMatch?.[1])
      return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
    const fileMatch = url.match(/\/file\/d\/([^/]+)/);
    if (fileMatch?.[1])
      return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
  }
  return url;
};

// ─── Social Icon ──────────────────────────────────────────────────────────────

const SocialIcon = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ y: -3, scale: 1.15 }}
    whileTap={{ scale: 0.9 }}
    className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/25 bg-black/35 text-emerald-300 shadow-[0_0_0_1px_rgba(16,185,129,0.08)] transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-500/15 hover:text-white hover:shadow-[0_0_18px_rgba(52,211,153,0.35)]"
    aria-label={label}
  >
    <Icon className="h-3.5 w-3.5" />
  </motion.a>
);

// ─── Contributor Card ─────────────────────────────────────────────────────────

const ContributorCard = ({ person }: { person: Contributor }) => {
  const displayImage = getImageUrl(person.profileImage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -7, transition: { duration: 0.22, ease: "easeOut" } }}
      className="group relative flex w-full max-w-85 flex-col overflow-hidden rounded-2xl border border-emerald-500/20 bg-[linear-gradient(180deg,rgba(10,20,14,0.82)_0%,rgba(5,8,7,0.96)_100%)] shadow-[0_24px_80px_rgba(0,0,0,0.62)] ring-1 ring-inset ring-emerald-500/20"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_0_0_1px_rgba(34,197,94,0.08)]" />

      {/* Top: circular glowing portrait */}
      <div className="relative flex justify-center px-5 pt-7">
        <div className="relative aspect-square w-[80%] overflow-hidden rounded-full ring-4 ring-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.7),0_0_80px_rgba(16,185,129,0.25)]">
          <img
            src={displayImage}
            alt={person.name}
            className="h-full w-full rounded-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
        </div>
      </div>

      {/* Middle: text and actions */}
      <div className="flex flex-1 flex-col items-center px-5 pb-5 pt-4 text-center">
        <h3
          className="text-xl font-bold leading-tight text-white"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {person.name}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-emerald-400">
          <Gem className="h-3.5 w-3.5 fill-emerald-400/20" />
          <span className="text-sm font-semibold text-emerald-400">
            {person.role}
          </span>
        </div>

        <p className="mt-1.5 text-[11px] leading-none text-[#8a938b]">
          Web Development Team, Fall 2024
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          {person.facebook && (
            <SocialIcon
              href={person.facebook}
              icon={Facebook}
              label={`${person.name} Facebook`}
            />
          )}
          {person.linkedin && (
            <SocialIcon
              href={formatLink(person.linkedin, "linkedin")}
              icon={Linkedin}
              label={`${person.name} LinkedIn`}
            />
          )}
          {person.github && (
            <SocialIcon
              href={formatLink(person.github, "github")}
              icon={Github}
              label={`${person.name} GitHub`}
            />
          )}
          {person.email && (
            <SocialIcon
              href={`mailto:${person.email}`}
              icon={Mail}
              label={`Email ${person.name}`}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Tier Section Divider ─────────────────────────────────────────────────────

const TierDivider = ({ label }: { label: string }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="flex-1 h-px bg-linear-to-r from-transparent via-[#588157]/30 to-transparent" />
    <span className="text-[#588157] text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full border border-[#588157]/20 bg-[#588157]/5">
      {label}
    </span>
    <div className="flex-1 h-px bg-linear-to-r from-transparent via-[#588157]/30 to-transparent" />
  </div>
);

// ─── Group contributors by role in the defined order ─────────────────────────

const ROLE_ORDER: Contributor["role"][] = [
  "Director",
  "Assistant Director",
  "Deputy Executive",
  "Senior Sub Executive",
  "Sub Executive",
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ContributorsPage() {
  const grouped = ROLE_ORDER.reduce<Record<string, Contributor[]>>(
    (acc, role) => {
      acc[role] = contributorsData.filter((c) => c.role === role);
      return acc;
    },
    {},
  );

  const getGridClass = (count: number) => {
    if (count === 2) return "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  const getItemClass = (count: number, index: number) => {
    if (count > 1 && count % 3 === 1 && index === count - 1) {
      return "lg:col-start-2";
    }

    return "";
  };

  const director = grouped["Director"]?.[0];

  return (
    <main className="min-h-screen pt-32 pb-28 relative overflow-hidden bg-[#060d0a]">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] left-[-8%] h-175 w-175 rounded-full bg-[#588157]/10 blur-[130px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, -40, 0] }}
          transition={{
            duration: 24,
            repeat: Infinity,
            delay: 1.5,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-15%] right-[-8%] h-150 w-150 rounded-full bg-[#a3b18a]/8 blur-[130px]"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* ── Page Header ── */}
        <div
          id="meet-the-contributors"
          className="text-center mb-20 max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-400 text-[10px] tracking-[0.3em] font-bold uppercase mb-4 block">
              / The Development Team
            </span>
            <h1
              className="text-4xl md:text-6xl font-bold text-[#d4e8c2] mb-5"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: "-0.025em",
              }}
            >
              Meet the Contributors
            </h1>
            <div className="h-px w-16 bg-linear-to-r from-transparent via-emerald-500/60 to-transparent mx-auto mb-5" />
            <p className="text-[#a3b18a]/75 text-base md:text-lg leading-relaxed">
              The visionary minds and passionate developers shaping the ARC 3.0
              platform.
            </p>
          </motion.div>
        </div>

        {/* ── Director (solo, centered, large) ── */}
        {director && (
          <div className="mb-16">
            <TierDivider label="Director" />
            <div className="flex justify-center">
              <ContributorCard person={director} />
            </div>
          </div>
        )}

        {/* ── Assistant Director ── */}
        {grouped["Assistant Director"]?.length > 0 && (
          <div className="mb-14">
            <TierDivider label="Assistant Director" />
            <div
              className={`grid gap-6 justify-items-center ${getGridClass(grouped["Assistant Director"].length)}`}
            >
              {grouped["Assistant Director"].map((p, i) => (
                <div
                  key={`${p.name}-${i}`}
                  className={getItemClass(
                    grouped["Assistant Director"].length,
                    i,
                  )}
                >
                  <ContributorCard person={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Deputy Executive ── */}
        {grouped["Deputy Executive"]?.length > 0 && (
          <div className="mb-14">
            <TierDivider label="Deputy Executive" />
            <div
              className={`grid gap-6 justify-items-center ${getGridClass(grouped["Deputy Executive"].length)}`}
            >
              {grouped["Deputy Executive"].map((p, i) => (
                <div
                  key={`${p.name}-${i}`}
                  className={getItemClass(
                    grouped["Deputy Executive"].length,
                    i,
                  )}
                >
                  <ContributorCard person={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Senior Sub Executive ── */}
        {grouped["Senior Sub Executive"]?.length > 0 && (
          <div className="mb-14">
            <TierDivider label="Senior Sub Executive" />
            <div
              className={`grid gap-6 justify-items-center ${getGridClass(grouped["Senior Sub Executive"].length)}`}
            >
              {grouped["Senior Sub Executive"].map((p, i) => (
                <div
                  key={`${p.name}-${i}`}
                  className={getItemClass(
                    grouped["Senior Sub Executive"].length,
                    i,
                  )}
                >
                  <ContributorCard person={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Sub Executive ── */}
        {grouped["Sub Executive"]?.length > 0 && (
          <div className="mb-4">
            <TierDivider label="Sub Executive" />
            <div
              className={`grid gap-6 justify-items-center ${getGridClass(grouped["Sub Executive"].length)}`}
            >
              {grouped["Sub Executive"].map((p, i) => (
                <div
                  key={`${p.name}-${i}`}
                  className={getItemClass(grouped["Sub Executive"].length, i)}
                >
                  <ContributorCard person={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="relative z-10 pb-8 pt-2">
        <div className="container mx-auto px-6 max-w-6xl flex justify-center">
          <a
            href="#meet-the-contributors"
            className="inline-flex items-center rounded-full border border-emerald-500/20 bg-[#07110c]/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300 transition-colors duration-300 hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-emerald-200"
          >
            Meet the Contributors
          </a>
        </div>
      </footer>

      {/* Glass noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-1">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: 0.018,
          }}
        />
      </div>
    </main>
  );
}
