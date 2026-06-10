"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Cpu, Eye, EyeOff, User } from 'lucide-react';
import { Link } from '@/lib/router-compat';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const adminVerified = params.get('adminVerified');

    if (adminVerified === '1') {
      setSuccess('Admin email verified. Please log in again.');
    }

    if (adminVerified === '0') {
      setError('Verification link is invalid or expired.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isSignUp) {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Something went wrong during registration.');
        } else {
          setSuccess('Account created successfully! Logging you in...');

          // Auto sign-in
          const signInRes = await signIn('credentials', {
            email,
            password,
            redirect: false,
          });

          if (signInRes?.ok) {
            window.location.href = '/dashboard';
          } else {
            setIsSignUp(false);
            setSuccess('Account created! Please sign in.');
          }
        }
      } catch (err) {
        setError('Connection error. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (res?.error) {
          if (res.error === 'ADMIN_EMAIL_VERIFICATION_REQUIRED') {
            setSuccess('Verification email sent. Confirm it from your inbox, then log in again.');
          } else if (res.error === 'SMTP_NOT_CONFIGURED') {
            setError('Admin email verification is not configured yet.');
          } else {
            setError('Invalid email or password.');
          }
        } else {
          const sessionRes = await fetch('/api/auth/session');
          const session = await sessionRes.json();
          if (session?.user?.role === 'admin') {
            window.location.href = '/admin';
          } else {
            window.location.href = '/dashboard';
          }
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-[68px] sm:pt-24 pb-0 sm:pb-12 px-0 sm:px-6">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full sm:max-w-[480px] backdrop-blur-xl sm:border sm:rounded-3xl p-8 sm:p-10 min-h-[calc(100vh-68px)] sm:min-h-0 flex flex-col justify-center"
        style={{
          background: 'var(--glass-panel-bg)',
          borderColor: 'var(--glass-panel-border)',
          boxShadow: 'var(--glass-panel-shadow)',
        }}
      >
        {/* Clean accent top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#3a5a40]" />

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <Cpu className="text-[#588157] w-6 h-6" />
            <span className="font-bold tracking-widest text-lg uppercase" style={{ color: 'var(--text-heading)', fontFamily: "'Space Grotesk', sans-serif" }}>
              ARC 3.0
            </span>
          </Link>
          <h2 className="text-4xl font-bold mb-3" style={{ color: 'var(--text-heading)', fontFamily: "'Space Grotesk', sans-serif" }}>
            {isSignUp ? 'Create Account.' : 'Welcome Back.'}
          </h2>
          <p style={{ color: 'var(--text-body)' }}>
            {isSignUp ? 'Sign up to register events and compete.' : 'Sign in to access your participant dashboard.'}
          </p>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-[#588157]/10 border border-[#588157]/20 text-[#a3b18a] text-sm px-4 py-3 rounded-xl mb-6 text-center">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full bg-[var(--input-background)] border border-[var(--glass-panel-border)] rounded-xl py-4 pl-12 pr-4 text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#588157] transition-all duration-300"
                style={{ fontSize: '16px' }}
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-[var(--input-background)] border border-[var(--glass-panel-border)] rounded-xl py-4 pl-12 pr-4 text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#588157] transition-all duration-300"
              style={{ fontSize: '16px' }}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[var(--input-background)] border border-[var(--glass-panel-border)] rounded-xl py-4 pl-12 pr-12 text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#588157] transition-all duration-300"
              style={{ fontSize: '16px' }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {!isSignUp && (
            <div className="flex justify-end">
              <a href="#" className="text-sm text-[#588157] hover:underline opacity-80 hover:opacity-100 transition-opacity">
                Forgot Password?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3a5a40] text-white py-4 rounded-xl font-bold hover:bg-[#344e41] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 group mt-2"
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Login'}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        {/* OAuth Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: 'var(--border)' }}></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[var(--card)] px-2" style={{ color: 'var(--text-muted)' }}>Or continue with</span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="w-full bg-[var(--input-background)] text-[var(--text-heading)] border border-[var(--glass-panel-border)] py-4 rounded-xl font-bold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.09 14.99 0 12 0 7.354 0 3.307 2.68 1.285 6.6l3.981 3.165z"
            />
            <path
              fill="#4285F4"
              d="M16.04 15.34C15.01 16.03 13.62 16.45 12 16.45c-2.91 0-5.382-1.97-6.266-4.63l-3.98 3.17C3.81 19.34 7.646 22 12 22c2.99 0 5.862-1.11 7.842-3.03l-3.802-3.63z"
            />
            <path
              fill="#FBBC05"
              d="M5.734 11.82A7.042 7.042 0 0 1 5.734 9.766L1.753 6.6A11.96 11.96 0 0 0 1 12c0 1.942.459 3.774 1.285 5.4l3.449-2.736a6.979 6.979 0 0 1-.5-2.844z"
            />
            <path
              fill="#34A853"
              d="M12 4.909c2.81 0 5.163 1.95 6.045 4.6l3.856-3.08A11.97 11.97 0 0 0 12 0C7.646 0 3.81 2.66 2.036 6.6L5.734 9.765c.884-2.66 3.355-4.6 6.266-4.6z"
            />
            <path
              fill="#4285F4"
              d="M23 12c0-.772-.069-1.52-.198-2.245H12V14.3h6.166a5.283 5.283 0 0 1-2.285 3.468l3.802 3.63C21.896 19.5 23 16.09 23 12z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Toggle Footer */}
        <div className="mt-8 pt-8 border-t text-center" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-body)' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setSuccess('');
              }}
              className="text-[#588157] hover:underline font-medium"
            >
              {isSignUp ? 'Log In Now →' : 'Register Now →'}
            </button>
          </p>
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center -space-x-2 mb-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 bg-gray-800 overflow-hidden" style={{ borderColor: 'var(--card)' }}>
                <img
                  src={`https://images.unsplash.com/photo-1531427186611-${i}b10b9?auto=format&fit=crop&q=80&w=100&h=100`}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 bg-[#3a5a40]/30 flex items-center justify-center text-[10px] font-bold text-[#a3b18a]" style={{ borderColor: 'var(--card)' }}>
              500+
            </div>
          </div>
          <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Participants Already Registered
          </p>
        </div>
      </motion.div>
    </div>
  );
}
