"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  Building2,
  Users,
  Trophy,
  Mail,
  Loader2,
  Lock,
  Megaphone,
  Activity,
  QrCode,
  Award,
} from "lucide-react";
import { Link } from "@/lib/router-compat";
import { toast } from "sonner"; // Import Sonner Toast for consistent UI toasts
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false); // Success state
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const [eventDetails, setEventDetails] = useState({
    eventName: "ARC 3.0",
    eventDate: "June 15-17, 2026",
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
    teamName: "",
    institution: "",
    teamLeader: "",
    email: "",
    phone: "",
    members: "",
    segment: "",
    password: "",
    confirmPassword: "",
  });

  const [dbSegments, setDbSegments] = useState<
    Array<{ id: number; name: string; status?: string }>
  >([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function checkRegistration() {
      try {
        const [settingsRes, segmentsRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/segments"), // Direct segments endpoint
        ]);

        if (settingsRes.ok) {
          const settings = await settingsRes.json();

          const deadline = settings.registration_deadline
            ? new Date(settings.registration_deadline)
            : null;
          const isPastDeadline = deadline ? new Date() > deadline : false;

          if (settings.registration_status === "closed" || isPastDeadline) {
            router.push("/closed_reg");
            return;
          }
          if (settings.registration_status === "disabled") {
            router.push("/disable_reg");
            return;
          }

          if (deadline) {
            setDeadlineDate(deadline);
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
            eventName: settings.event_name || "ARC 3.0",
            eventDate: settings.event_date || "June 15-17, 2026",
            minMembers: parseInt(settings.min_members_per_team) || 1,
            maxMembers: parseInt(settings.max_members_per_team) || 5,
          });
        }

        if (segmentsRes.ok) {
          const segmentsList = await segmentsRes.json();
          if (Array.isArray(segmentsList)) {
            setDbSegments(segmentsList);
          } else {
            console.error("Expected array of segments in registration page, received:", segmentsList);
            setDbSegments([]);
          }
        }
      } catch (err) {
        console.error("Error fetching settings/segments:", err);
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
        router.push("/closed_reg");
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
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 401) {
        toast.error(
          "You must be logged in to register. Redirecting to login...",
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }

      if (res.ok) {
        toast.success(data.message || "Registration submitted successfully!");
        
        // Auto-login the user immediately after registering
        const loginRes = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (loginRes?.error) {
          console.error("Auto-login failed:", loginRes.error);
          toast.error("Auto-login failed. Please log in manually.");
          router.push("/login");
        } else {
          router.push("/dashboard/events");
        }
      } else {
        toast.error(data.message || "Failed to submit registration.");
        setSubmitting(false);
      }
    } catch (err) {
      console.error("Error submitting registration:", err);
      toast.error("An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#588157]" />
          <p className="text-sm" style={{ color: 'var(--text-body)' }}>
            Checking registration details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 bg-[#0A0A0F]">
      <div className="relative z-10 w-full max-w-6xl">
        {/* Nav Link */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className="text-sm tracking-widest hover:text-[var(--text-heading)] transition-colors"
            style={{ color: 'var(--text-body)' }}
          >
            ← BACK TO HOME
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Side: Form and Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-4 backdrop-blur-sm"
                style={{
                  background: 'var(--glass-panel-bg)',
                  borderColor: 'var(--glass-panel-border)',
                  borderWidth: '1px',
                }}
              >
                <Trophy className="w-4 h-4 text-[#588157]" />
                <span style={{ color: 'var(--text-heading)' }}>
                  {eventDetails.eventName} Registration
                </span>
              </div>
              <h1
                className="text-4xl md:text-5xl font-bold mb-3"
                style={{ color: 'var(--text-heading)', fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Register Your <span className="text-[#588157]">Team</span>
              </h1>
              <p style={{ color: 'var(--text-body)' }}>
                Join Bangladesh\'s most anticipated university robotics championship
              </p>

              {timeLeft && (
                <div className="mt-6 space-y-2 animate-in fade-in duration-500">
                  <span className="text-xs font-semibold uppercase tracking-widest block" style={{ color: 'var(--text-label)' }}>
                    Registration Closes In
                  </span>
                  <div className="flex justify-center gap-3">
                    {[
                      { label: "Days", value: timeLeft.days },
                      { label: "Hours", value: timeLeft.hours },
                      { label: "Mins", value: timeLeft.minutes },
                      { label: "Secs", value: timeLeft.seconds },
                    ].map((t, i) => (
                      <div
                        key={i}
                        className="w-16 h-16 border rounded-xl flex flex-col items-center justify-center"
                        style={{
                          background: 'var(--glass-panel-bg)',
                          borderColor: 'var(--glass-panel-border)',
                          boxShadow: 'var(--glass-panel-shadow)',
                        }}
                      >
                        <div className="font-bold text-xl font-mono leading-none" style={{ color: 'var(--text-heading)' }}>
                          {String(t.value).padStart(2, "0")}
                        </div>
                        <div className="text-[10px] font-semibold tracking-wider mt-1 uppercase" style={{ color: 'var(--text-muted)' }}>
                          {t.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Registration Form */}
            <form
              onSubmit={handleSubmit}
              className="backdrop-blur-xl border rounded-2xl p-5 sm:p-8"
              style={{
                background: 'var(--glass-panel-bg)',
                borderColor: 'var(--glass-panel-border)',
                boxShadow: 'var(--glass-panel-shadow)',
              }}
            >
              <div className="space-y-5">
                {/* Team Name */}
                <div>
                  <label
                    htmlFor="teamName"
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Team Name *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      id="teamName"
                      name="teamName"
                      required
                      value={formData.teamName}
                      onChange={handleChange}
                      className="w-full bg-[var(--input-background)] border border-[var(--glass-panel-border)] rounded-lg px-12 py-3 text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#588157] transition-all duration-300"
                      style={{ fontSize: "16px" }}
                      placeholder="Enter your team name"
                    />
                  </div>
                </div>

                {/* Institution */}
                <div>
                  <label
                    htmlFor="institution"
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Institution *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      id="institution"
                      name="institution"
                      required
                      value={formData.institution}
                      onChange={handleChange}
                      className="w-full bg-[var(--input-background)] border border-[var(--glass-panel-border)] rounded-lg px-12 py-3 text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#588157] transition-all duration-300"
                      style={{ fontSize: "16px" }}
                      placeholder="Enter your university/college name"
                    />
                  </div>
                </div>

                {/* Team Leader Name */}
                <div>
                  <label
                    htmlFor="teamLeader"
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Team Leader Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      id="teamLeader"
                      name="teamLeader"
                      required
                      value={formData.teamLeader}
                      onChange={handleChange}
                      className="w-full bg-[var(--input-background)] border border-[var(--glass-panel-border)] rounded-lg px-12 py-3 text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#588157] transition-all duration-300"
                      style={{ fontSize: "16px" }}
                      placeholder="Enter team leader's full name"
                    />
                  </div>
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'var(--text-heading)' }}
                    >
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-[var(--input-background)] border border-[var(--glass-panel-border)] rounded-lg px-12 py-3 text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#588157] transition-all duration-300"
                        style={{ fontSize: "16px" }}
                        placeholder="team@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'var(--text-heading)' }}
                    >
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-[var(--input-background)] border border-[var(--glass-panel-border)] rounded-lg px-12 py-3 text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#588157] transition-all duration-300"
                        style={{ fontSize: "16px" }}
                        placeholder="+880 1XXX-XXXXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Number of Members */}
                <div>
                  <label
                    htmlFor="members"
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--text-heading)' }}
                  >
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
                    className="w-full bg-[var(--input-background)] border border-[var(--glass-panel-border)] rounded-lg px-4 py-3 text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#588157] transition-all duration-300"
                    style={{ fontSize: "16px" }}
                    placeholder={`e.g., ${eventDetails.maxMembers}`}
                  />
                </div>

                {/* Segment Selection */}
                <div>
                  <label
                    htmlFor="segment"
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    Competition Segment *
                  </label>
                  <select
                    id="segment"
                    name="segment"
                    required
                    value={formData.segment}
                    onChange={handleChange}
                    className="w-full bg-[var(--input-background)] border border-[var(--glass-panel-border)] rounded-lg px-4 py-3 text-[var(--text-heading)] focus:outline-none focus:border-[#588157] transition-all duration-300"
                    style={{ fontSize: "16px" }}
                  >
                    <option value="" className="bg-[var(--card)] text-[var(--text-heading)]">
                      Select a segment
                    </option>
                    {dbSegments
                      .filter((seg) => !seg.status || seg.status === "active")
                      .map((seg) => (
                        <option
                          key={seg.id}
                          value={seg.name}
                          className="bg-[var(--card)] text-[var(--text-heading)]"
                        >
                          {seg.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'var(--text-heading)' }}
                    >
                      Password * (At least 8 characters)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-[var(--input-background)] border border-[var(--glass-panel-border)] rounded-lg px-12 py-3 text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#588157] transition-all duration-300"
                        style={{ fontSize: "16px" }}
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'var(--text-heading)' }}
                    >
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full bg-[var(--input-background)] border border-[var(--glass-panel-border)] rounded-lg px-12 py-3 text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#588157] transition-all duration-300"
                        style={{ fontSize: "16px" }}
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>
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
                      Submit Registration & Create Account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Footer Note */}
              <p className="text-sm mt-6 text-center" style={{ color: 'var(--text-muted)' }}>
                Already registered?{" "}
                <Link to="/login" className="text-[#588157] hover:underline font-semibold">
                  Login here
                </Link>
              </p>
            </form>
          </motion.div>

          {/* Right Side: Benefits Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="border rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.30)] backdrop-blur-xl"
              style={{
                background: 'var(--glass-panel-bg)',
                borderColor: 'var(--glass-panel-border)',
              }}
            >
              <h3
                className="text-lg font-bold mb-4 flex items-center gap-2"
                style={{ color: 'var(--text-heading)', fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <ShieldCheck className="w-5 h-5 text-[#588157]" />
                Participant Benefits
              </h3>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-body)' }}>
                By completing this registration, a secure personal account will
                automatically be set up for you. Here's what you will get:
              </p>

              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Users className="w-4 h-4 text-[#588157]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>
                      Personal Dashboard Access
                    </h4>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      View and manage your schedule, registered segments, and
                      teammate list at any time.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Megaphone className="w-4 h-4 text-[#588157]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>
                      Announcements & Updates
                    </h4>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Get live, critical event updates and notices directly
                      inside your participant portal.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Activity className="w-4 h-4 text-[#588157]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>
                      Registration Tracking
                    </h4>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Track real-time approval, rejection, and payment status
                      updates on your submission.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <QrCode className="w-4 h-4 text-[#588157]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>
                      QR Pass Access
                    </h4>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Retrieve your team's official entry QR pass immediately
                      upon payment verification.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Award className="w-4 h-4 text-[#588157]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>
                      Certificate Access
                    </h4>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Download official university participation certificates
                      directly from your portal when released.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 text-center text-sm flex items-center justify-center gap-2" style={{ color: 'var(--text-muted)' }}>
          <ShieldCheck className="w-4 h-4" />
          <span>Secured by {eventDetails.eventName} Org</span>
        </div>
      </div>
    </div>
  );
}
