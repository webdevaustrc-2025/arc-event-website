"use client";
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link } from '@/lib/router-compat';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  Swords,
  Calendar,
  LayoutTemplate,
  Settings,
  LogOut,
  Moon,
  Sun,
  Home,
  Trophy
} from 'lucide-react';
import { AnimatedMenuButton } from '@/components/AnimatedMenuButton';
import { signOut } from 'next-auth/react';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
  { path: '/admin/users', icon: Users, label: 'Users & Teams' },
  { path: '/admin/segments', icon: Swords, label: 'Segments' },
  { path: '/admin/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/admin/schedule', icon: Calendar, label: 'Schedule' },
  { path: '/admin/content', icon: LayoutTemplate, label: 'Content' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

export const AdminLayout = () => {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDark = theme === 'dark' || !theme;

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={`min-h-screen flex antialiased transition-colors duration-300 ${isDark
          ? 'bg-[#0A0A0F] text-[#F5F5F0] selection:bg-[#588157] selection:text-[#F5F5F0]'
          : 'bg-[var(--background)] text-[#1a1a14] selection:bg-[#3a5a40] selection:text-white'
        }`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Top Navbar - Only visible on mobile/tablet */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 h-16 border-b z-50 flex items-center px-4 transition-colors duration-300 ${
        isDark 
          ? 'bg-[#0d0d12]/95 border-white/[0.06] text-white' 
          : 'bg-white/95 border-black/[0.06] text-[#1a1a14]'
      }`}>
        <div className="md:hidden">
          <AnimatedMenuButton isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        </div>
        <div className="ml-4">
          <h1
            className={`text-lg font-bold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="text-[#588157]">Robo</span>Fest <span className="text-[#a3b18a]">Admin</span>
          </h1>
        </div>
      </div>

      {/* Sidebar - Full width on lg+ */}
      <aside className={`hidden lg:flex flex-col w-64 border-r fixed top-0 h-screen z-30 backdrop-blur-xl ${isDark ? 'border-white/[0.06] bg-[#0d0d12]/95' : 'border-black/[0.06] bg-white/95'
        }`}>
        <div className="p-6">
          <h1 className="font-bold text-xl tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            ARC 3.0<span className="text-[#588157]"> Admin</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                ${isActive
                  ? isDark
                    ? 'bg-[rgba(88,129,87,0.15)] text-[#a3b18a] border-l-[3px] border-[#3a5a40] pl-[13px]'
                    : 'bg-[rgba(58,90,64,0.10)] text-[#344e41] border-l-[3px] border-[#3a5a40] pl-[13px]'
                  : isDark
                    ? 'text-[#9A9A8E] hover:text-[#F5F5F0] hover:bg-white/5'
                    : 'text-[#4a4a40] hover:text-[#1a1a14] hover:bg-black/5'
                }
              `}
            >
              <item.icon className={`w-5 h-5 text-[#588157]`} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className={`pt-4 border-t ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
          <div className="space-y-2 px-4">
            {/* Home Button */}
            <Link
              to="/"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isDark
                  ? 'text-[#9A9A8E] hover:bg-white/5 hover:text-[#a3b18a]'
                  : 'text-[#8a8a7a] hover:bg-black/5 hover:text-[#3a5a40]'
                }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full ${isDark
                  ? 'text-[#9A9A8E] hover:bg-white/5 hover:text-[#a3b18a]'
                  : 'text-[#8a8a7a] hover:bg-black/5 hover:text-[#3a5a40]'
                }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="font-medium">Theme</span>
            </button>

            {/* Exit Admin Button */}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full ${isDark
                  ? 'text-[#9A9A8E] hover:bg-red-500/10 hover:text-red-400'
                  : 'text-[#8a8a7a] hover:bg-red-500/10 hover:text-red-600'
                }`}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Exit Admin</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar - Icon-only on md (768px–1023px) */}
      <aside className={`hidden md:flex lg:hidden flex-col items-center w-[60px] border-r fixed top-0 h-screen z-30 py-4 backdrop-blur-xl ${isDark ? 'border-white/[0.06] bg-[#0d0d12]/95' : 'border-black/[0.06] bg-white/95'
        }`}>
        <div className="mb-6 flex items-center justify-center w-10 h-10">
          <span className="font-bold text-[#588157] text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>R</span>
        </div>
        <nav className="flex flex-col items-center gap-1 flex-1 w-full px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              title={item.label}
              className={({ isActive }) => `
                relative group flex items-center justify-center w-10 h-10 rounded-xl transition-all
                ${isActive
                  ? isDark
                    ? 'bg-[rgba(88,129,87,0.20)] text-[#a3b18a]'
                    : 'bg-[rgba(58,90,64,0.15)] text-[#344e41]'
                  : isDark
                    ? 'text-[#9A9A8E] hover:bg-white/5 hover:text-[#F5F5F0]'
                    : 'text-[#4a4a40] hover:bg-black/5 hover:text-[#1a1a14]'
                }
              `}
            >
              <item.icon className="w-5 h-5 text-[#588157]" />
              {/* Tooltip */}
              <span className={`absolute left-full ml-3 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 ${isDark ? 'bg-[#18181f] text-[#F5F5F0] border border-white/10' : 'bg-white text-[#1a1a14] border border-black/10'
                }`}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
        <div className={`pt-4 border-t w-full flex flex-col items-center gap-2 px-2 ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
          <Link
            to="/"
            title="Home"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDark ? 'text-[#9A9A8E] hover:bg-white/5 hover:text-[#a3b18a]' : 'text-[#8a8a7a] hover:bg-black/5 hover:text-[#3a5a40]'
              }`}
          >
            <Home className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            title="Toggle theme"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDark ? 'text-[#9A9A8E] hover:bg-white/5 hover:text-[#a3b18a]' : 'text-[#8a8a7a] hover:bg-black/5 hover:text-[#3a5a40]'
              }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            title="Exit Admin"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDark ? 'text-[#9A9A8E] hover:bg-red-500/10 hover:text-red-400' : 'text-[#8a8a7a] hover:bg-red-500/10 hover:text-red-600'
              }`}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`md:hidden fixed top-16 left-0 bottom-0 w-[280px] flex flex-col border-r backdrop-blur-xl z-40 ${isDark ? 'border-white/[0.06] bg-[#0d0d12]/98' : 'border-black/[0.06] bg-white/98'
                }`}
            >
              <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-6">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                      ${isActive
                        ? isDark
                          ? 'bg-[rgba(88,129,87,0.15)] text-[#a3b18a]'
                          : 'bg-[rgba(58,90,64,0.10)] text-[#344e41]'
                        : isDark
                          ? 'text-[#9A9A8E] hover:text-[#F5F5F0] hover:bg-white/5'
                          : 'text-[#4a4a40] hover:text-[#1a1a14] hover:bg-black/5'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5 text-[#588157]" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              {/* Bottom Actions */}
              <div className={`pt-4 border-t ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
                <div className="space-y-2 px-4">
                  {/* Home Button */}
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full ${isDark
                        ? 'text-[#9A9A8E] hover:bg-white/5 hover:text-[#a3b18a]'
                        : 'text-[#8a8a7a] hover:bg-black/5 hover:text-[#3a5a40]'
                      }`}
                  >
                    <Home className="w-5 h-5" />
                    <span className="font-medium">Home</span>
                  </Link>

                  {/* Theme Toggle */}
                  <button
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full ${isDark
                        ? 'text-[#9A9A8E] hover:bg-white/5 hover:text-[#a3b18a]'
                        : 'text-[#8a8a7a] hover:bg-black/5 hover:text-[#3a5a40]'
                      }`}
                  >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    <span className="font-medium">Theme</span>
                  </button>

                  {/* Exit Admin Button */}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full ${isDark
                        ? 'text-[#9A9A8E] hover:bg-red-500/10 hover:text-red-400'
                        : 'text-[#8a8a7a] hover:bg-red-500/10 hover:text-red-600'
                      }`}
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Exit Admin</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0 lg:ml-64 md:ml-[60px] min-h-screen pt-20 lg:pt-4">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};