"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ExternalLink, Award, Coffee, Users, Building2, Globe, Server, Heart, Zap, Webhook } from "lucide-react";

interface Sponsor {
  id: number;
  name: string;
  logoUrl: string;
  tier: string;
  websiteUrl: string | null;
  displayOrder: number;
  category: string | null;
}

// ─── FALLBACK DUMMY DATA ───
const FALLBACK_SPONSORS: Sponsor[] = [
  { id: 1, name: "Tech Giant Corp", logoUrl: "", tier: "gold", websiteUrl: "https://techcorp.com", displayOrder: 0, category: "Gold Sponsor" },
  { id: 2, name: "Robotics Labs Ltd", logoUrl: "", tier: "gold", websiteUrl: "https://roboticslabs.com", displayOrder: 1, category: "Gold Sponsor" },
  { id: 3, name: "Future Innovators", logoUrl: "", tier: "silver", websiteUrl: "https://futureinnovators.com", displayOrder: 2, category: "Community Partner" },
  { id: 4, name: "Pizza Hut", logoUrl: "", tier: "bronze", websiteUrl: "https://pizzahut.com", displayOrder: 3, category: "Food Partner" },
  { id: 5, name: "Local Community", logoUrl: "", tier: "bronze", websiteUrl: "https://community.com", displayOrder: 4, category: "Community Partner" },
];

const getCategoryColor = (category: string | null) => {
  if (!category) return "text-[#588157] bg-[#588157]/10 border-[#588157]/20";
  
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes("gold")) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
  if (lowerCategory.includes("silver")) return "text-gray-400 bg-gray-400/10 border-gray-400/20";
  if (lowerCategory.includes("bronze")) return "text-orange-500 bg-orange-500/10 border-orange-500/20";
  return "text-[#588157] bg-[#588157]/10 border-[#588157]/20";
};

const getSponsorIcon = (name: string) => {
  const icons: Record<string, React.ReactNode> = {
    "Tech Giant Corp": <Building2 className="w-10 h-10" />,
    "Robotics Labs Ltd": <Globe className="w-10 h-10" />,
    "Future Innovators": <Server className="w-10 h-10" />,
    "Pizza Hut": <Coffee className="w-10 h-10" />,
    "Local Community": <Users className="w-10 h-10" />,
  };
  return icons[name] || <Building2 className="w-10 h-10" />;
};

export function Sponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSponsors() {
      try {
        const response = await fetch("/api/public/sponsors");
        if (!response.ok) throw new Error("Failed to fetch sponsors");
        const data = await response.json();
        setSponsors(data);
      } catch (error) {
        console.error("Error fetching sponsors:", error);
        setSponsors(FALLBACK_SPONSORS);
      } finally {
        setLoading(false);
      }
    }
    fetchSponsors();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-2xl p-4 animate-pulse aspect-square" />
          ))}
        </div>
      </div>
    );
  }

  if (sponsors.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-400">Sponsor information will be announced soon.</p>
      </div>
    );
  }

  const renderCard = (sponsor: Sponsor, idx: number) => {
    const isClickable = sponsor.websiteUrl && sponsor.websiteUrl.trim() !== "";
    const cardContent = (
      <div
        className={`group relative rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full min-h-[220px] ${
          isClickable ? "cursor-pointer" : "cursor-default"
        }`}
        style={{
          background: 'var(--glass-panel-bg)',
          border: '1px solid var(--glass-panel-border)',
          boxShadow: 'var(--glass-panel-shadow)',
        }}
      >
        {/* Logo */}
        <div className="w-full aspect-square max-h-[100px] bg-white/5 rounded-xl flex items-center justify-center p-3 mb-3 overflow-hidden">
          {sponsor.logoUrl ? (
            <img
              src={sponsor.logoUrl}
              alt={sponsor.name}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const icon = document.createElement("div");
                  icon.className = "text-gray-400";
                  icon.innerHTML = getSponsorIcon(sponsor.name)?.toString() || "";
                  parent.appendChild(icon);
                }
              }}
            />
          ) : (
            <div className="text-gray-400">
              {getSponsorIcon(sponsor.name)}
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-sm text-center mb-1" style={{ color: 'var(--text-heading)' }}>
          {sponsor.name}
        </h3>

        {/* Category - displayed below name */}
        {sponsor.category && (
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getCategoryColor(sponsor.category)}`}>
            {sponsor.category}
          </span>
        )}

        {/* Website indicator */}
        {isClickable && (
          <div className="absolute bottom-2 right-2 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="w-3 h-3" />
          </div>
        )}
      </div>
    );

    if (isClickable) {
      return (
        <motion.div
          key={sponsor.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="h-full"
        >
          <a
            href={sponsor.websiteUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            {cardContent}
          </a>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={sponsor.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05 }}
        className="h-full"
      >
        {cardContent}
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sponsors.map((sponsor, idx) => renderCard(sponsor, idx))}
      </div>
    </div>
  );
}