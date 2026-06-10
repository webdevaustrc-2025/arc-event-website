"use client";
import React, { useState, useEffect } from "react";
import { Globe, Image as ImageIcon, ExternalLink, Building2, Server, Webhook, Network, Monitor, Briefcase } from "lucide-react";
import { motion } from "motion/react";

type Tier = "gold" | "silver" | "bronze";

interface Sponsor {
  id: number;
  name: string;
  logoUrl: string;
  tier: Tier;
  websiteUrl: string | null;
  displayOrder: number;
}

interface GroupedSponsors {
  gold: Sponsor[];
  silver: Sponsor[];
  bronze: Sponsor[];
}

// ─── FALLBACK DUMMY DATA (shown when database is empty) ───
const FALLBACK_SPONSORS: GroupedSponsors = {
  gold: [
    {
      id: 1,
      name: "Vercel",
      logoUrl: "",
      tier: "gold",
      websiteUrl: "https://vercel.com",
      displayOrder: 0,
    },
    {
      id: 2,
      name: "Logitech",
      logoUrl: "",
      tier: "gold",
      websiteUrl: "https://logitech.com",
      displayOrder: 1,
    },
  ],
  silver: [
    {
      id: 3,
      name: "Notion",
      logoUrl: "",
      tier: "silver",
      websiteUrl: "https://notion.com",
      displayOrder: 0,
    },
    {
      id: 4,
      name: "Figma",
      logoUrl: "",
      tier: "silver",
      websiteUrl: "https://figma.com",
      displayOrder: 1,
    },
  ],
  bronze: [
    {
      id: 5,
      name: "Stripe",
      logoUrl: "",
      tier: "bronze",
      websiteUrl: "https://stripe.com",
      displayOrder: 0,
    },
    {
      id: 6,
      name: "GitHub",
      logoUrl: "",
      tier: "bronze",
      websiteUrl: "https://github.com",
      displayOrder: 1,
    },
  ],
};

const tierConfig = {
  gold: {
    title: "Gold Sponsors",
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-600 dark:bg-yellow-400",
    borderColor: "border-yellow-500/20",
    bgGradient: "from-yellow-500/5 to-transparent",
    iconBg: "bg-yellow-500/10",
  },
  silver: {
    title: "Silver Sponsors",
    color: "text-gray-500 dark:text-gray-400",
    bg: "bg-gray-500 dark:bg-gray-400",
    borderColor: "border-gray-400/20",
    bgGradient: "from-gray-400/5 to-transparent",
    iconBg: "bg-gray-400/10",
  },
  bronze: {
    title: "Bronze Sponsors",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-600 dark:bg-orange-400",
    borderColor: "border-orange-500/20",
    bgGradient: "from-orange-500/5 to-transparent",
    iconBg: "bg-orange-500/10",
  },
};

// Helper to get icon for fallback sponsors
const getSponsorIcon = (name: string) => {
  const icons: Record<string, React.ReactNode> = {
    Vercel: <Building2 className="w-12 h-12" />,
    Logitech: <Globe className="w-12 h-12" />,
    Notion: <Server className="w-12 h-12" />,
    Figma: <Webhook className="w-12 h-12" />,
    Stripe: <Network className="w-12 h-12" />,
    GitHub: <Briefcase className="w-12 h-12" />,
  };
  return icons[name] || <Building2 className="w-12 h-12" />;
};

export function Sponsors({ dbSponsors }: { dbSponsors?: GroupedSponsors }) {
  const [sponsors, setSponsors] = useState<GroupedSponsors | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    if (dbSponsors && (dbSponsors.gold?.length > 0 || dbSponsors.silver?.length > 0 || dbSponsors.bronze?.length > 0)) {
      setSponsors(dbSponsors);
      setUsingFallback(false);
      setLoading(false);
      return;
    }

    async function fetchSponsors() {
      try {
        console.log("Fetching sponsors from API...");
        const response = await fetch("/api/public/sponsors");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if we got real data or empty data
        if (data && (data.gold?.length > 0 || data.silver?.length > 0 || data.bronze?.length > 0)) {
          console.log("Using database sponsors:", data);
          setSponsors(data);
          setUsingFallback(false);
        } else {
          console.log("No sponsors in database, using fallback data");
          setSponsors(FALLBACK_SPONSORS);
          setUsingFallback(true);
        }
      } catch (err) {
        console.error("Error fetching sponsors, using fallback:", err);
        setSponsors(FALLBACK_SPONSORS);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSponsors();
  }, [dbSponsors]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="space-y-16">
          {["gold", "silver", "bronze"].map((tier) => (
            <div key={tier} className="space-y-8">
              <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse mx-auto" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 animate-pulse"
                  >
                    <div className="h-32 bg-white/10 rounded-lg mb-6" />
                    <div className="h-6 bg-white/10 rounded w-3/4 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!sponsors) {
    return null;
  }

  const renderSponsorCards = (tierSponsors: Sponsor[], tier: keyof typeof tierConfig) => {
    if (tierSponsors.length === 0) return null;

    const config = tierConfig[tier];

    const textColor = `var(--sponsor-${tier}-text)`;
    const bgColor = `var(--sponsor-${tier}-bg)`;
    const iconBgColor = `var(--sponsor-${tier}-icon)`;

    return (
      <div key={tier} className="mb-20 last:mb-0">
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ 
              fontFamily: "'Space Grotesk', sans-serif",
              color: textColor
            }}
          >
            {config.title}
          </h2>
          <div 
            className="w-24 h-1 mx-auto rounded-full" 
            style={{ backgroundColor: bgColor }}
          />
          {usingFallback && (
            <p className="text-xs text-gray-500 mt-3">(Demo data - waiting for sponsors)</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tierSponsors.map((sponsor, index) => (
            <motion.a
              key={sponsor.id}
              href={sponsor.websiteUrl || "#"}
              target={sponsor.websiteUrl ? "_blank" : undefined}
              rel={sponsor.websiteUrl ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`group relative backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 ${
                !sponsor.websiteUrl ? "cursor-default" : "cursor-pointer"
              }`}
              style={{
                background: 'var(--glass-panel-bg)',
                borderColor: 'var(--glass-panel-border)',
                boxShadow: 'var(--glass-panel-shadow)',
              }}
            >
              {/* Subtle top reflection overlay matching tier */}
              <div
                className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl`}
                style={{
                  background: tier === 'gold' ? '#eab308' : tier === 'silver' ? '#9ca3af' : '#f97316',
                  opacity: 0.35,
                }}
              />

              <div className="h-36 flex items-center justify-center mb-6 p-4">
                {sponsor.logoUrl ? (
                  <img
                    src={sponsor.logoUrl}
                    alt={`${sponsor.name} logo`}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      // If image fails to load, show icon instead
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const iconDiv = document.createElement("div");
                        iconDiv.className = `rounded-full p-4`;
                        iconDiv.style.backgroundColor = iconBgColor;
                        iconDiv.innerHTML = `<div class="text-[var(--text-body)]">${getSponsorIcon(sponsor.name)}</div>`;
                        parent.appendChild(iconDiv);
                      }
                    }}
                  />
                ) : (
                  <div 
                    className="rounded-full p-4 text-[var(--text-body)]"
                    style={{ backgroundColor: iconBgColor }}
                  >
                    {getSponsorIcon(sponsor.name)}
                  </div>
                )}
              </div>

              <h3 className="text-xl font-semibold text-center mb-3 transition" style={{ color: 'var(--text-heading)' }}>
                {sponsor.name}
              </h3>

              {sponsor.websiteUrl && (
                <div className="flex items-center justify-center gap-2 text-sm transition text-[var(--text-body)] group-hover:text-[var(--text-heading)]">
                  <span>Visit Website</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              )}
            </motion.a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {renderSponsorCards(sponsors.gold, "gold")}
      {renderSponsorCards(sponsors.silver, "silver")}
      {renderSponsorCards(sponsors.bronze, "bronze")}
    </div>
  );
}