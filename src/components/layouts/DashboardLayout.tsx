"use client";
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link } from '@/lib/router-compat';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Calendar, Trophy, Award, QrCode, User, LogOut, Home, Sun, Moon, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { AnimatedMenuButton } from '@/components/AnimatedMenuButton';
import { signOut, useSession } from 'next-auth/react';

const menuItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Events', path: '/dashboard/events', icon: Calendar },
  { name: 'Leaderboard', path: '/dashboard/leaderboard', icon: Trophy },
  { name: 'Certificates', path: '/dashboard/certificates', icon: Award },
  { name: 'QR Pass', path: '/dashboard/qr-pass', icon: QrCode },
  { name: 'Profile', path: '/dashboard/profile', icon: User },
];

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = '/login?callbackUrl=/dashboard';
    },
  });
  const isDark = theme === 'dark' || !theme;

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      window.location.href = '/admin';
    }
  }, [session, status]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (status === 'loading') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${isDark ? 'bg-[#0A0A0F]' : 'bg-[#f5f5f0]'}`}>
        <Loader2 className="w-10 h-10 animate-spin text-[#588157]" />
        <p className={isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}>Checking your session...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0A0A0F]' : 'bg-[#f5f5f0]'}`}>
      {/* Top Navbar - Only visible on mobile/tablet */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 h-16 border-b z-50 flex items-center px-4 transition-colors duration-300 ${
        isDark ? 'bg-[#0A0A0F] border-white/[0.06]' : 'bg-[#ffffff] border-black/[0.06]'
      }`}>
        <AnimatedMenuButton isOpen={sidebarOpen} onClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="ml-4">
          <h1
            className={`text-lg font-bold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="text-[#588157]">Robo</span>Fest
          </h1>
          <p className={`text-[10px] ${isDark ? 'text-[#5A5A52]' : 'text-[#8a8a7a]'}`}>Participant Dashboard</p>
        </div>
      </div>

      {/* Desktop Sidebar - Always visible on lg+ */}
      <aside
        className={`hidden lg:flex fixed top-0 left-0 h-screen w-[280px] z-30 border-r backdrop-blur-xl flex-col ${
          isDark ? 'bg-[#0d0d12]/95 border-white/[0.06]' : 'bg-white/95 border-black/[0.06]'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="mb-8 mt-4">
            <h1
              className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span className="text-[#588157]">Robo</span>Fest
            </h1>
            <p className={`text-xs mt-1 ${isDark ? 'text-[#5A5A52]' : 'text-[#8a8a7a]'}`}>
              Participant Dashboard
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                    isActive
                      ? isDark
                        ? 'bg-[#588157]/10 text-[#a3b18a]'
                        : 'bg-[#588157]/10 text-[#3a5a40]'
                      : isDark
                      ? 'text-[#9A9A8E] hover:bg-white/5 hover:text-[#a3b18a]'
                      : 'text-[#8a8a7a] hover:bg-black/5 hover:text-[#3a5a40]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: isDark
                            ? 'linear-gradient(135deg, rgba(88,129,87,0.15) 0%, rgba(163,177,138,0.08) 100%)'
                            : 'linear-gradient(135deg, rgba(88,129,87,0.1) 0%, rgba(163,177,138,0.05) 100%)',
                          boxShadow: '0 0 20px rgba(88,129,87,0.2)',
                        }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                    <item.icon className="w-5 h-5 relative z-10" />
                    <span className="font-medium relative z-10">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className={`pt-4 border-t ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
            <div className="space-y-2">
              {/* Home Button */}
              <Link
                to="/"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full ${
                  isDark
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full ${
                  isDark
                    ? 'text-[#9A9A8E] hover:bg-white/5 hover:text-[#a3b18a]'
                    : 'text-[#8a8a7a] hover:bg-black/5 hover:text-[#3a5a40]'
                }`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span className="font-medium">Theme</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full ${
                  isDark
                    ? 'text-[#9A9A8E] hover:bg-red-500/10 hover:text-red-400'
                    : 'text-[#8a8a7a] hover:bg-red-500/10 hover:text-red-600'
                }`}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`lg:hidden fixed top-16 left-0 bottom-0 w-[280px] z-40 border-r backdrop-blur-xl flex flex-col ${
                isDark ? 'bg-[#0d0d12]/98 border-white/[0.06]' : 'bg-white/98 border-black/[0.06]'
              }`}
            >
              <div className="flex flex-col h-full p-6 pt-4">
                {/* Navigation */}
                <nav className="flex-1 space-y-2 overflow-y-auto">
                  {menuItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/dashboard'}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          isActive
                            ? isDark
                              ? 'bg-[#588157]/15 text-[#a3b18a]'
                              : 'bg-[#588157]/12 text-[#3a5a40]'
                            : isDark
                            ? 'text-[#9A9A8E] hover:bg-white/5 hover:text-[#a3b18a]'
                            : 'text-[#8a8a7a] hover:bg-black/5 hover:text-[#3a5a40]'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </NavLink>
                  ))}
                </nav>

                {/* Bottom Actions */}
                <div className={`pt-4 border-t mt-4 ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
                  <div className="space-y-2">
                    {/* Home Button */}
                    <Link
                      to="/"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full ${
                        isDark
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
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full ${
                        isDark
                          ? 'text-[#9A9A8E] hover:bg-white/5 hover:text-[#a3b18a]'
                          : 'text-[#8a8a7a] hover:bg-black/5 hover:text-[#3a5a40]'
                      }`}
                    >
                      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                      <span className="font-medium">Theme</span>
                    </button>

                    {/* Logout Button */}
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full ${
                        isDark
                          ? 'text-[#9A9A8E] hover:bg-red-500/10 hover:text-red-400'
                          : 'text-[#8a8a7a] hover:bg-red-500/10 hover:text-red-600'
                      }`}
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-[280px] min-h-screen pt-20 lg:pt-4">
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
