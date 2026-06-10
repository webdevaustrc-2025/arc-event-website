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
  CheckCircle,
  Megaphone,
  QrCode,
  Award,
  Activity,
} from "lucide-react";
import { Link } from "@/lib/router-compat";
import { toast } from "sonner";

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
    password: "", // Added password field
  });

  const [dbSegments, setDbSegments] = useState<
    Array<{ id: number; name: string }>
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
          setDbSegments(segmentsList);
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
        toast.success("Registration submitted successfully!");
        setIsSuccess(true); // Trigger the inline success banner inside the form [1]

        // Auto-scroll smoothly to the top of the screen so they instantly see the green banner [1]
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
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
      <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 bg-[#0A0A0F]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#588157]" />
          <p className="text-gray-400 text-sm">
            Checking registration details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 bg-[#0A0A0F]">
      <div className="relative z-10 w-full max-w-5xl">
        {/* Nav Link */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className="text-gray-400 text-sm tracking-widest hover:text-white transition-colors"
          >
            ← BACK TO HOME
          </Link>
        </div>

        {/* Title Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm mb-4 backdrop-blur-sm">
            <Trophy className="w-4 h-4 text-[#588157]" />
            <span className="text-gray-300">
              {eventDetails.eventName} Unified Registration
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Register Your <span className="text-[#a3b18a]">Team</span>
          </h1>
          <p className="text-gray-400">
            Create an account and register for event segments in a single,
            simple step.
          </p>

          {/* Countdown timer */}
          {timeLeft && (
            <div className="mt-6 space-y-2 animate-in fade-in duration-500">
              <span className="text-xs font-semibold text-[#a3b18a]/80 uppercase tracking-widest block">
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
                    className="w-16 h-16 bg-[#111116]/90 border border-white/[0.07] rounded-xl flex flex-col items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
                  >
                    <div className="text-[#a3b18a] font-bold text-xl font-mono leading-none">
                      {String(t.value).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] text-gray-500 font-semibold tracking-wider mt-1 uppercase">
                      {t.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Split Grid (Form Left, Benefits Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-8">
          {/* Left Side: Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-[#111116]/90 backdrop-blur-xl border border-white/[0.07] rounded-2xl p-5 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.30)]"
            >
              <div className="space-y-5">
                {/* Flat Success Banner styled exactly like the Create Account screenshot! */}
                {isSuccess && (
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center text-sm text-green-400 font-medium animate-in fade-in duration-300">
                    Registration submitted successfully! You can continue
                    browsing.
                  </div>
                )}

                {/* Team Name */}
                <div>
                  <label
                    htmlFor="teamName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
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
                      style={{ fontSize: "16px" }}
                      placeholder="Enter your team name"
                    />
                  </div>
                </div>

                {/* Institution */}
                <div>
                  <label
                    htmlFor="institution"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
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
                      style={{ fontSize: "16px" }}
                      placeholder="Enter your university/college name"
                    />
                  </div>
                </div>

                {/* Team Leader / Full Name */}
                <div>
                  <label
                    htmlFor="teamLeader"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Full Name (Team Leader) *
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
                      style={{ fontSize: "16px" }}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Email Address *
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
                        style={{ fontSize: "16px" }}
                        placeholder="team@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Phone Number *
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
                        style={{ fontSize: "16px" }}
                        placeholder="+880 1XXX-XXXXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Secure Password Field (Added!) */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Account Password * (Minimum 8 characters)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-[#18181f] border border-white/[0.07] rounded-lg px-12 py-3 text-[#F5F5F0] placeholder:text-[#5A5A52] focus:outline-none focus:border-[#588157] transition-colors"
                      style={{ fontSize: "16px" }}
                      placeholder="Choose a password for your portal"
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

                {/* Number of Members */}
                <div>
                  <label
                    htmlFor="members"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Number of Team Members * (Between {eventDetails.minMembers}{" "}
                    and {eventDetails.maxMembers})
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
                    style={{ fontSize: "16px" }}
                    placeholder={`e.g., ${eventDetails.maxMembers}`}
                  />
                </div>

                {/* Segment Selection */}
                <div>
                  <label
                    htmlFor="segment"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Competition Segment *
                  </label>
                  <select
                    id="segment"
                    name="segment"
                    required
                    value={formData.segment}
                    onChange={handleChange}
                    className="w-full bg-[#18181f] border border-white/[0.07] rounded-lg px-4 py-3 text-[#F5F5F0] focus:outline-none focus:border-[#588157] transition-colors"
                    style={{ fontSize: "16px" }}
                  >
                    <option value="" className="bg-[#18181f]">
                      Select a segment
                    </option>
                    {dbSegments.map((seg) => (
                      <option
                        key={seg.id}
                        value={seg.name}
                        className="bg-[#18181f]"
                      >
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
                      Submit Registration & Create Account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Footer Note */}
              <p className="text-sm text-[#5A5A52] mt-6 text-center">
                Already registered?{" "}
                <Link to="/login" className="text-[#588157] hover:underline">
                  Login to your portal
                </Link>
              </p>
            </form>
          </motion.div>

          {/* Right Side: Benefits Section (Added!) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-[#111116]/90 border border-white/[0.07] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.30)] backdrop-blur-xl">
              <h3
                className="text-lg font-bold text-[#a3b18a] mb-4 flex items-center gap-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <ShieldCheck className="w-5 h-5 text-[#588157]" />
                Participant Benefits
              </h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                By completing this registration, a secure personal account will
                automatically be set up for you. Here's what you will get:
              </p>

              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Users className="w-4 h-4 text-[#588157]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-200">
                      Personal Dashboard Access
                    </h4>
                    <p className="text-xs text-gray-400">
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
                    <h4 className="text-sm font-semibold text-gray-200">
                      Announcements & Updates
                    </h4>
                    <p className="text-xs text-gray-400">
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
                    <h4 className="text-sm font-semibold text-gray-200">
                      Registration Tracking
                    </h4>
                    <p className="text-xs text-gray-400">
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
                    <h4 className="text-sm font-semibold text-gray-200">
                      QR Pass Access
                    </h4>
                    <p className="text-xs text-gray-400">
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
                    <h4 className="text-sm font-semibold text-gray-200">
                      Certificate Access
                    </h4>
                    <p className="text-xs text-gray-400">
                      Download official university participation certificates
                      directly from your portal when released.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Secured by {eventDetails.eventName} Org</span>
        </div>
      </div>
    </div>
  );
}
