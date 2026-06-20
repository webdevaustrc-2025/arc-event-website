"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, X } from 'lucide-react';
import { Link, useLocation } from '@/lib/router-compat';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { ThemeSwitch } from './ThemeSwitch';
import { AnimatedMenuButton } from './AnimatedMenuButton';
import { useSession } from 'next-auth/react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);
  const location = useLocation();
  const { setTheme, isDark } = useResolvedTheme();
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const userImage = session?.user?.image || 'https://res.cloudinary.com/dxyhzgrul/image/upload/v1780398181/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4215_bdeofc.jpg';

  useEffect(() => {
    const handleScroll = () => { };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const [leaderboardEnabled, setLeaderboardEnabled] = useState(true);

  useEffect(() => {
    async function checkSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const settings = await res.json();
          setLeaderboardEnabled(settings.enable_leaderboard !== 'false');
        }
      } catch (err) {
        console.error('Failed to fetch settings in Navbar:', err);
      }
    }
    checkSettings();
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Segments', path: '/segments' },
    ...(leaderboardEnabled ? [{ name: 'Leaderboard', path: '/leaderboard' }] : []),
    { name: 'Schedule', path: '/schedule' },
    { name: 'Sponsors', path: '/sponsors' },
    { name: 'About', path: '/about' },
  ];

  const activeIndex = navLinks.findIndex(link => link.path === location.pathname);

  const updateIndicator = (index: number) => {
    const element = navRefs.current[index];
    if (element) {
      setIndicatorStyle({ left: element.offsetLeft, width: element.offsetWidth });
    }
  };

  useEffect(() => {
    if (activeIndex !== -1 && hoveredIndex === null) {
      updateIndicator(activeIndex);
    }
  }, [activeIndex, hoveredIndex]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 border-b ${isDark ? 'border-white/[0.08]' : 'border-black/[0.06]'
          }`}
        style={{
          height: '68px',
          background: isDark
            ? 'linear-gradient(135deg, rgba(10,10,15,0.65) 0%, rgba(26,26,31,0.55) 100%)'
            : 'linear-gradient(135deg, rgba(218,215,205,0.75) 0%, rgba(245,242,235,0.65) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          boxShadow: isDark
            ? '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(255,255,255,0.02)'
            : '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.05)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between relative">

          {/* ── Left: Logo ── */}
          <div className="flex items-center z-10 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2.5">
              <Cpu className="text-[#588157] w-5 h-5" />
              <span
                className={`font-bold tracking-widest text-sm uppercase ${isDark ? 'text-[#F5F5F0]' : 'text-[#1a1a14]'}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                ARC 3.0
              </span>
            </Link>
          </div>

          {/* ── Center: Nav pill — only above 950px ── */}
          <div
            className={`hidden min-[951px]:flex items-center gap-1 border rounded-full px-2 py-1.5 absolute left-1/2 -translate-x-1/2 z-10 ${isDark ? 'border-white/[0.12]' : 'border-black/[0.12]'
              }`}
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)'
                : 'linear-gradient(135deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.03) 100%)',
              backdropFilter: 'blur(16px) saturate(180%)',
              boxShadow: isDark
                ? '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)'
                : '0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
            }}
          >
            <div className="relative flex items-center gap-1">
              {(hoveredIndex !== null || activeIndex !== -1) && (
                <motion.div
                  className="absolute rounded-full pointer-events-none"
                  initial={false}
                  animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  style={{
                    height: '40px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(88,129,87,0.15)',
                  }}
                />
              )}
              {navLinks.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    ref={(el) => { navRefs.current[index] = el; }}
                    to={item.path}
                    onMouseEnter={() => { setHoveredIndex(index); updateIndicator(index); }}
                    onMouseLeave={() => {
                      setHoveredIndex(null);
                      if (activeIndex !== -1) updateIndicator(activeIndex);
                    }}
                    className={`text-sm font-medium transition-colors duration-200 ease-out rounded-full px-[18px] py-2 relative z-10 ${isActive
                        ? isDark ? 'text-[#a3b18a]' : 'text-[#344e41]'
                        : isDark ? 'text-[#9A9A8E] hover:text-[#F5F5F0]' : 'text-[#4a4a40] hover:text-[#1a1a14]'
                      }`}
                    style={{ letterSpacing: '0.01em' }}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Right: Unified action row ── */}
          <div className="flex items-center gap-4 z-10 flex-shrink-0">

            {/* Theme toggle — hidden at ≤1140px (moves to sidebar) */}
            <div className="hidden min-[1141px]:flex">
              <ThemeSwitch />
            </div>

            {isLoggedIn ? (
              <Link to={session?.user?.role === 'admin' ? '/admin' : '/dashboard'} className="hidden min-[1141px]:flex items-center gap-3 group relative z-10 transition-transform hover:scale-105">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#588157]/40 group-hover:border-[#588157] transition-all shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
                  <img
                    src={userImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/dxyhzgrul/image/upload/v1780398181/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4215_bdeofc.jpg';
                    }}
                  />
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-[#9A9A8E] group-hover:text-[#F5F5F0]' : 'text-[#4a4a40] group-hover:text-[#1a1a14]'} transition-colors`}>
                  
                </span>
              </Link>
            ) : (
              <>
                {/* Login — hidden at ≤1140px (moves to sidebar) */}
                <Link
                  to="/login"
                  className={`hidden min-[1141px]:inline-flex text-sm font-medium transition-colors ${isDark ? 'text-[#9A9A8E] hover:text-[#F5F5F0]' : 'text-[#4a4a40] hover:text-[#1a1a14]'
                    }`}
                >
                  Login
                </Link>

                {/* Register Now — always visible */}
                <Link
                  to="/register"
                  className="inline-flex items-center bg-[#3a5a40] text-white px-[22px] py-2.5 rounded-full text-sm font-bold hover:bg-[#344e41] transition-all"
                >
                  Register Now
                </Link>
              </>
            )}

            {/* Hamburger — hidden above 1140px */}
            <div className="flex min-[1141px]:hidden">
              <AnimatedMenuButton isOpen={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Sidebar — slides from right ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop — click to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="min-[1141px]:hidden fixed inset-0 z-[998] bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sidebar Panel */}
            <motion.div
              key="mobile-sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="min-[1141px]:hidden fixed right-0 top-0 bottom-0 z-[999] w-[320px] max-w-[85vw] flex flex-col shadow-2xl border-l"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(18,18,24,0.85) 0%, rgba(26,26,31,0.75) 100%)'
                  : 'linear-gradient(135deg, rgba(245,242,235,0.9) 0%, rgba(218,215,205,0.8) 100%)',
                backdropFilter: 'blur(32px) saturate(180%)',
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                boxShadow: isDark
                  ? '0 0 60px rgba(0,0,0,0.5), inset 1px 0 0 rgba(255,255,255,0.05)'
                  : '0 0 60px rgba(0,0,0,0.15), inset 1px 0 0 rgba(255,255,255,0.3)',
              }}
            >
              {/* Header */}
              <div className={`flex items-center justify-between px-6 h-[68px] border-b flex-shrink-0 ${isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'
                }`}>
                <span
                  className={`font-bold tracking-widest text-sm uppercase ${isDark ? 'text-[#a3b18a]' : 'text-[#3a5a40]'}`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${isDark
                      ? 'bg-white/[0.04] border-white/10 text-[#F5F5F0] hover:bg-white/[0.08]'
                      : 'bg-black/[0.03] border-black/10 text-[#1a1a14] hover:bg-black/[0.06]'
                    }`}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 flex flex-col px-4 pt-2 overflow-y-auto">
                {navLinks.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 min-h-[52px] rounded-xl my-1 font-medium transition-all ${isActive
                          ? isDark
                            ? 'bg-[#3a5a40]/20 text-[#a3b18a] border border-[#588157]/30'
                            : 'bg-[#a3b18a]/20 text-[#344e41] border border-[#3a5a40]/30'
                          : isDark
                            ? 'text-[#9A9A8E] hover:bg-white/[0.04] hover:text-[#F5F5F0]'
                            : 'text-[#4a4a40] hover:bg-black/[0.03] hover:text-[#1a1a14]'
                        }`}
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full transition-all ${isActive
                          ? 'bg-[#588157] scale-100'
                          : 'bg-transparent scale-0'
                        }`} />
                      <span className="text-[15px]">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom Actions */}
              <div className={`px-4 py-5 border-t flex-shrink-0 space-y-3 ${isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'
                }`}>
                {/* Theme Toggle */}
                <div className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-black/[0.02] border-black/[0.08]'
                  }`}>
                  <span className={`text-sm font-medium ${isDark ? 'text-[#F5F5F0]' : 'text-[#1a1a14]'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Theme
                  </span>
                  <ThemeSwitch />
                </div>

                {/* Login/Dashboard Button */}
                {isLoggedIn ? (
                  <Link
                    to={session?.user?.role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center h-[48px] rounded-xl font-bold bg-[#3a5a40] text-white hover:bg-[#344e41] transition-all gap-3 shadow-[0_2px_12px_rgba(58,90,64,0.25)] border border-[#588157]/20"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    <img
                      src={userImage}
                      alt="Profile"
                      className="w-6 h-6 rounded-full object-cover border border-white/20"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/dxyhzgrul/image/upload/v1780398181/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4215_bdeofc.jpg';
                      }}
                    />
                    {session?.user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-center h-[48px] rounded-xl border font-medium transition-all ${isDark
                        ? 'bg-white/[0.03] border-white/[0.08] text-[#F5F5F0] hover:bg-white/[0.06]'
                        : 'bg-black/[0.03] border-black/[0.08] text-[#1a1a14] hover:bg-black/[0.06]'
                      }`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};