"use client";
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Cpu, Eye, EyeOff } from 'lucide-react';
import { Link } from '@/lib/router-compat';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-[68px] sm:pt-24 pb-0 sm:pb-12 px-0 sm:px-6">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full sm:max-w-[480px] bg-[#111116]/90 backdrop-blur-xl sm:border border-white/[0.07] sm:rounded-3xl p-8 sm:p-10 sm:shadow-[0_2px_12px_rgba(0,0,0,0.30)] overflow-hidden min-h-[calc(100vh-68px)] sm:min-h-0 flex flex-col justify-center"
      >
        {/* Clean accent top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#3a5a40]" />

        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <Cpu className="text-[#588157] w-6 h-6" />
            <span className="font-bold tracking-widest text-lg uppercase text-[#F5F5F0]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              RoboFest
            </span>
          </Link>
          <h2 className="text-4xl font-bold mb-3 text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Welcome Back.
          </h2>
          <p className="text-gray-400">
            Sign in to access your participant dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); window.location.href = '/dashboard'; }} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A5A52]" />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address" 
              className="w-full bg-[#18181f] border border-white/[0.07] rounded-xl py-4 pl-12 pr-4 text-[#F5F5F0] placeholder:text-[#5A5A52] focus:outline-none focus:border-[#588157] transition-colors"
              style={{ fontSize: '16px' }}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A5A52]" />
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" 
              className="w-full bg-[#18181f] border border-white/[0.07] rounded-xl py-4 pl-12 pr-12 text-[#F5F5F0] placeholder:text-[#5A5A52] focus:outline-none focus:border-[#588157] transition-colors"
              style={{ fontSize: '16px' }}
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5A5A52] hover:text-[#F5F5F0] transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex justify-end">
            <a href="#" className="text-sm text-[#588157] hover:underline opacity-80 hover:opacity-100 transition-opacity">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="w-full bg-[#3a5a40] text-white py-4 rounded-xl font-bold hover:bg-[#344e41] transition-colors flex items-center justify-center gap-2 group mt-2">
            Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/[0.07] text-center">
          <p className="text-[#9A9A8E] text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#588157] hover:underline font-medium">
              Register Now →
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center -space-x-2 mb-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#111116] bg-gray-800 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-1531427186611-${i}b10b9?auto=format&fit=crop&q=80&w=100&h=100`} 
                  alt="avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-[#111116] bg-[#3a5a40]/30 flex items-center justify-center text-[10px] font-bold text-[#a3b18a]">
              500+
            </div>
          </div>
          <p className="text-xs text-[#5A5A52] uppercase tracking-widest">
            Participants Already Registered
          </p>
        </div>
      </motion.div>
    </div>
  );
}