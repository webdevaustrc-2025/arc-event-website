"use client";
import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { Link } from "@/lib/router-compat";
import { toast } from "sonner";

// Specification Rule: Keep dummy segments array as fallback
const FALLBACK_SEGMENTS = [
  { id: 1, name: "Line Following Robot" },
  { id: 2, name: "Maze Solving Robot" },
  { id: 3, name: "Robo Soccer" },
  { id: 4, name: "Project Showcase" },
  { id: 5, name: "Innovation Challenge" },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    teamName: "",
    institution: "",
    teamLeader: "",
    email: "",
    phone: "",
    members: "",
    segmentId: "", // changed from 'segment' to map directly to segment DB id
  });

  const [segments, setSegments] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch Segment List dynamically on Mount with Dual-Source Pattern Fallback
  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const res = await fetch("/api/public/segments");
        if (res.ok) {
          const data = await res.json();
          setSegments(data && data.length > 0 ? data : FALLBACK_SEGMENTS);
        } else {
          setSegments(FALLBACK_SEGMENTS);
        }
      } catch (error) {
        console.error("Public segment load failed, falling back:", error);
        setSegments(FALLBACK_SEGMENTS);
      }
    };
    fetchSegments();
  }, []);

  // 2. Submit Handler utilizing backend endpoint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          segmentId: parseInt(formData.segmentId, 10),
          teamName: formData.teamName,
          institution: formData.institution,
          teamLeader: formData.teamLeader,
          email: formData.email,
          phone: formData.phone,
          members: parseInt(formData.members, 10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to complete registration.");
      }

      toast.success(
        "Registration submitted successfully! You can verify your status in your dashboard.",
      );

      // Reset form upon successful registration
      setFormData({
        teamName: "",
        institution: "",
        teamLeader: "",
        email: "",
        phone: "",
        members: "",
        segmentId: "",
      });
    } catch (error: any) {
      console.error("Registration submit error:", error);
      toast.error(error.message || "An error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-4 sm:px-6">
      <div className="relative z-10 w-full max-w-3xl">
        {/* Nav Link */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-gray-400 text-sm tracking-widest hover:text-white transition-colors"
          >
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
              <span className="text-gray-300">ARC 3.0 2025 Registration</span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Register Your <span className="text-[#a3b18a]">Team</span>
            </h1>
            <p className="text-gray-400">
              Join Bangladesh's most anticipated university robotics
              championship
            </p>
          </div>

          {/* Registration Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#111116]/90 backdrop-blur-xl border border-white/[0.07] rounded-2xl p-5 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.30)]"
          >
            <div className="space-y-5">
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

              {/* Team Leader */}
              <div>
                <label
                  htmlFor="teamLeader"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
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
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
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
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Number of Team Members *
                </label>
                <input
                  type="number"
                  id="members"
                  name="members"
                  required
                  min="1"
                  max="10"
                  value={formData.members}
                  onChange={handleChange}
                  className="w-full bg-[#18181f] border border-white/[0.07] rounded-lg px-4 py-3 text-[#F5F5F0] placeholder:text-[#5A5A52] focus:outline-none focus:border-[#588157] transition-colors"
                  style={{ fontSize: "16px" }}
                  placeholder="e.g., 4"
                />
              </div>

              {/* Segment Selection */}
              <div>
                <label
                  htmlFor="segmentId"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Competition Segment *
                </label>
                <select
                  id="segmentId"
                  name="segmentId"
                  required
                  value={formData.segmentId}
                  onChange={handleChange}
                  className="w-full bg-[#18181f] border border-white/[0.07] rounded-lg px-4 py-3 text-[#F5F5F0] focus:outline-none focus:border-[#588157] transition-colors"
                  style={{ fontSize: "16px" }}
                >
                  <option value="" className="bg-[#18181f]">
                    Select a segment
                  </option>
                  {segments.map((seg) => (
                    <option
                      key={seg.id}
                      value={seg.id}
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
                className="w-full bg-[#3a5a40] text-white py-4 rounded-lg font-semibold hover:bg-[#344e41] transition-all hover:scale-[1.02] shadow-[0_2px_12px_rgba(0,0,0,0.20)] flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
              >
                {submitting
                  ? "Submitting Registration..."
                  : "Submit Registration"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Footer Note */}
            <p className="text-sm text-[#5A5A52] mt-6 text-center">
              Already registered?{" "}
              <Link to="/login" className="text-[#588157] hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </motion.div>

        <div className="mt-8 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Secured by ARC 3.0 Org</span>
        </div>
      </div>
    </div>
  );
}
