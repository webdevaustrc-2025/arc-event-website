"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, User, Phone, Building2, Users, Trophy, Mail, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from '@/lib/router-compat';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [eventDetails, setEventDetails] = useState({
    eventName: 'ARC 3.0',
    eventDate: 'June 15-17, 2026',
    minMembers: 1,
    maxMembers: 5,
  });
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);

  const [formData, setFormData] = useState({
    teamName: '',
    institution: '',
    teamLeader: '',
    email: '',
    phone: '',
    members: '',
    segment: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [dbSegments, setDbSegments] = useState<Array<{ id: number; name: string }>>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function checkRegistration() {
      try {
        // Fetch settings and segments in parallel
        const [settingsRes, segmentsRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/segments')
        ]);

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          
          // Check deadline
          const deadline = settings.registration_deadline ? new Date(settings.registration_deadline) : null;
          const isPastDeadline = deadline ? new Date() > deadline : false;
          
          if (settings.registration_status === 'closed' || isPastDeadline) {
            router.push('/closed_reg');
            return;
          }
          if (settings.registration_status === 'disabled') {
            router.push('/disable_reg');
            return;
          }

          if (deadline) {
            setDeadlineDate(deadline);
            // Calculate initial time left immediately
            const difference = deadline.getTime() - Date.now();
            if (difference > 0) {
              const days = Math.floor(difference / (1000 * 60 * 60 * 24));
              const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
              const minutes = Math.floor((difference / 1000 / 60) % 60);
              const seconds = Math.floor((difference / 1000) % 60);
              setTimeLeft({ days, hours, minutes, seconds });
            }
          }
          
          setEventDetails({
            eventName: settings.event_name || 'ARC 3.0',
            eventDate: settings.event_date || 'June 15-17, 2026',
            minMembers: parseInt(settings.min_members_per_team) || 1,
            maxMembers: parseInt(settings.max_members_per_team) || 5,
          });
        }

        if (segmentsRes.ok) {
          const segmentsList = await segmentsRes.json();
          setDbSegments(segmentsList);
        }
      } catch (err) {
        console.error('Error fetching settings/segments:', err);
      } finally {
        setLoading(false);
      }
    }
    checkRegistration();
  }, [router]);

  useEffect(() => {
    if (!deadlineDate) return;

    const interval = setInterval(() => {
      const difference = deadlineDate.getTime() - Date.now();
      
      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft(null);
        router.push('/closed_reg');
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadlineDate, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.password) {
      alert('Password is required.');
      return;
    }
    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }
    if (!formData.confirmPassword) {
      alert('Please confirm your password.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...formData };
      // Remove confirmPassword before sending
      const { confirmPassword, ...bodyToSend } = payload;
      void confirmPassword; // suppress unused variable lint
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyToSend),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Registration submitted successfully!');
        router.push('/dashboard/events');
      } else {
        alert(data.message || 'Failed to submit registration.');
      }
    } catch (err) {
      console.error('Error submitting registration:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 bg-[#0A0A0F]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#588157]" />
          <p className="text-gray-400 text-sm">Checking registration details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-4 sm:px-6">
      {/* No glow blob — clean flat design */}

      <div className="relative z-10 w-full max-w-3xl">
        {/* Nav Link */}
        <div className="text-center mb-8">
          <Link to="/" className="text-gray-400 text-sm tracking-widest hover:text-white transition-colors">
            ← BACK TO HOME
          </Link>
        </div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm mb-4 backdrop-blur-sm">
              <Trophy className="w-4 h-4 text-[#588157]" />
              <span className="text-gray-300">{eventDetails.eventName} Registration</span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Register Your <span className="text-[#a3b18a]">Team</span>
            </h1>
            <p className="text-gray-400">
              Join Bangladesh's most anticipated university robotics championship
            </p>

            {timeLeft && (
              <div className="mt-6 space-y-2 animate-in fade-in duration-500">
                <span className="text-xs font-semibold text-[#a3b18a]/80 uppercase tracking-widest block">Registration Closes In</span>
                <div className="flex justify-center gap-3">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Mins', value: timeLeft.minutes },
                    { label: 'Secs', value: timeLeft.seconds }
                  ].map((t, i) => (
                    <div key={i} className="w-16 h-16 bg-[#111116]/90 border border-white/[0.07] rounded-xl flex flex-col items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
                      <div className="text-[#a3b18a] font-bold text-xl font-mono leading-none">
                        {String(t.value).padStart(2, '0')}
                      </div>
                      <div className="text-[10px] text-gray-500 font-semibold tracking-wider mt-1 uppercase">{t.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Registration Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#111116]/90 backdrop-blur-xl border border-white/[0.07] rounded-2xl p-5 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.30)]"
          >
            <div className="space-y-5">
              {/* Team Name */}
              <div>
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-2">
                  Team Name *
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    id="teamName"
                    name="teamName"
                    required
                    value={formData.teamName}
                    onChange={handleChange}
                    className="w-full bg-[#18181f] border border-white/[0.07] rounded-lg px-12 py-3 text-[#F5F5F0] placeholder:text-[#5A5A52] focus:outline-none focus:border-[#588157] transition-colors"
                    style={{ fontSize: '16px' }}
                    placeholder="Enter your team name"
                  />
                </div>
              </div>

              {/* Institution */}
              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-gray-300 mb-2">
                  Institution *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    id="institution"
                    name="institution"
                    required
                    value={formData.institution}
                    onChange={handleChange}
                    className="w-full bg-[#18181f] border border-white/[0.07] rounded-lg px-12 py-3 text-[#F5F5F0] placeholder:text-[#5A5A52] focus:outline-none focus:border-[#588157] transition-colors"
                    style={{ fontSize: '16px' }}
                    placeholder="Enter your university/college name"
                  />
                </div>
              </div>

              {/* Team Leader */}
              <div>
                <label htmlFor="teamLeader" className="block text-sm font-medium text-gray-300 mb-2">
                  Team Leader Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    id="teamLeader"
                    name="teamLeader"
                    required
                    value={formData.teamLeader}
                    onChange={handleChange}
                    className="w-full bg-[#18181f] border border-white/[0.07] rounded-lg px-12 py-3 text-[#F5F5F0] placeholder:text-[#5A5A52] focus:outline-none focus:border-[#588157] transition-colors"
                    style={{ fontSize: '16px' }}
                    placeholder="Enter team leader's full name"
                  />
                </div>
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#18181f] border border-white/[0.07] rounded-lg px-12 py-3 text-[#F5F5F0] placeholder:text-[#5A5A52] focus:outline-none focus:border-[#588157] transition-colors"
                      style={{ fontSize: '16px' }}
                      placeholder="team@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#18181f] border border-white/[0.07] rounded-lg px-12 py-3 text-[#F5F5F0] placeholder:text-[#5A5A52] focus:outline-none focus:border-[#588157] transition-colors"
                      style={{ fontSize: '16px' }}
                      placeholder="+880 1XXX-XXXXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-[#18181f] border border-white/[0.07] rounded-lg px-12 py-3 text-[#F5F5F0] placeholder:text-[#5A5A52] focus:outline-none focus:border-[#588157] transition-colors"
                      style={{ fontSize: '16px' }}
                      placeholder="Min 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      minLength={8}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-[#18181f] border border-white/[0.07] rounded-lg px-12 py-3 text-[#F5F5F0] placeholder:text-[#5A5A52] focus:outline-none focus:border-[#588157] transition-colors"
                      style={{ fontSize: '16px' }}
                      placeholder="Repeat your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#5A5A52] -mt-2">
                Use this password to log in to your dashboard later.
              </p>

              {/* Number of Members */}
              <div>
                <label htmlFor="members" className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Team Members * (Between {eventDetails.minMembers} and {eventDetails.maxMembers})
                </label>
                <input
                  type="number"
                  id="members"
                  name="members"
                  required
                  min={eventDetails.minMembers}
                  max={eventDetails.maxMembers}
                  value={formData.members}
                  onChange={handleChange}
                  className="w-full bg-[#18181f] border border-white/[0.07] rounded-lg px-4 py-3 text-[#F5F5F0] placeholder:text-[#5A5A52] focus:outline-none focus:border-[#588157] transition-colors"
                  style={{ fontSize: '16px' }}
                  placeholder={`e.g., ${eventDetails.maxMembers}`}
                />
              </div>

              {/* Segment Selection */}
              <div>
                <label htmlFor="segment" className="block text-sm font-medium text-gray-300 mb-2">
                  Competition Segment *
                </label>
                <select
                  id="segment"
                  name="segment"
                  required
                  value={formData.segment}
                  onChange={handleChange}
                  className="w-full bg-[#18181f] border border-white/[0.07] rounded-lg px-4 py-3 text-[#F5F5F0] focus:outline-none focus:border-[#588157] transition-colors"
                  style={{ fontSize: '16px' }}
                >
                  <option value="" className="bg-[#18181f]">Select a segment</option>
                  {dbSegments.map((seg) => (
                    <option key={seg.id} value={seg.name} className="bg-[#18181f]">
                      {seg.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#3a5a40] text-white py-4 rounded-lg font-semibold hover:bg-[#344e41] transition-all hover:scale-[1.02] shadow-[0_2px_12px_rgba(0,0,0,0.20)] flex items-center justify-center gap-2 mt-6 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Submit Registration
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Footer Note */}
            <p className="text-sm text-[#5A5A52] mt-6 text-center">
              Already registered?{' '}
              <Link to="/login" className="text-[#588157] hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </motion.div>

        <div className="mt-8 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Secured by {eventDetails.eventName} Org</span>
        </div>
      </div>
    </div>
  );
}
