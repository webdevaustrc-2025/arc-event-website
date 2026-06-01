"use client";
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Mail, Phone, MapPin, Building2, Save, User as UserIcon } from 'lucide-react';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';

export default function ProfilePage() {
  const { isDark } = useResolvedTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    phone: '+880 1234 567890',
    university: 'Dhaka University',
    department: 'Computer Science & Engineering',
    studentId: 'DU-2024-12345',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&h=400',
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1
            className={`text-3xl sm:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Profile Settings
          </h1>
          <p className={`text-base sm:text-lg ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
            Manage your account information
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #3a5a40 0%, #344e41 100%)',
              color: '#ffffff',
            }}
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl overflow-hidden backdrop-blur-md"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(58,90,64,0.06) 0%, rgba(163,177,138,0.03) 100%)'
            : 'linear-gradient(135deg, rgba(58,90,64,0.04) 0%, rgba(163,177,138,0.02) 100%)',
          border: `1px solid ${isDark ? 'rgba(163,177,138,0.12)' : 'rgba(58,90,64,0.15)'}`,
        }}
      >
        {/* Avatar Section */}
        <div
          className="p-8 border-b"
          style={{
            borderColor: isDark ? 'rgba(163,177,138,0.1)' : 'rgba(58,90,64,0.1)',
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <img
                src={profile.avatar}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
                style={{
                  border: `3px solid ${isDark ? 'rgba(88,129,87,0.3)' : 'rgba(88,129,87,0.25)'}`,
                }}
              />
              {isEditing && (
                <button
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <Camera className="w-8 h-8 text-white" />
                </button>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2
                className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {profile.name}
              </h2>
              <p className={`text-lg ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
                {profile.university}
              </p>
              <span
                className="inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-semibold"
                style={{
                  background: isDark ? 'rgba(88,129,87,0.15)' : 'rgba(88,129,87,0.12)',
                  border: `1px solid ${isDark ? 'rgba(88,129,87,0.3)' : 'rgba(88,129,87,0.25)'}`,
                  color: '#588157',
                }}
              >
                Participant
              </span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}
              >
                <UserIcon className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl transition-all ${
                  isEditing
                    ? isDark
                      ? 'bg-white/10 border border-[#588157]/30 text-white focus:border-[#588157]'
                      : 'bg-black/5 border border-[#588157]/25 text-[#1a1a14] focus:border-[#588157]'
                    : isDark
                    ? 'bg-white/5 border border-transparent text-[#9A9A8E]'
                    : 'bg-black/3 border border-transparent text-[#8a8a7a]'
                } outline-none`}
              />
            </div>

            {/* Email */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl transition-all ${
                  isEditing
                    ? isDark
                      ? 'bg-white/10 border border-[#588157]/30 text-white focus:border-[#588157]'
                      : 'bg-black/5 border border-[#588157]/25 text-[#1a1a14] focus:border-[#588157]'
                    : isDark
                    ? 'bg-white/5 border border-transparent text-[#9A9A8E]'
                    : 'bg-black/3 border border-transparent text-[#8a8a7a]'
                } outline-none`}
              />
            </div>

            {/* Phone */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl transition-all ${
                  isEditing
                    ? isDark
                      ? 'bg-white/10 border border-[#588157]/30 text-white focus:border-[#588157]'
                      : 'bg-black/5 border border-[#588157]/25 text-[#1a1a14] focus:border-[#588157]'
                    : isDark
                    ? 'bg-white/5 border border-transparent text-[#9A9A8E]'
                    : 'bg-black/3 border border-transparent text-[#8a8a7a]'
                } outline-none`}
              />
            </div>

            {/* University */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}
              >
                <Building2 className="w-4 h-4 inline mr-2" />
                University
              </label>
              <input
                type="text"
                value={profile.university}
                onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl transition-all ${
                  isEditing
                    ? isDark
                      ? 'bg-white/10 border border-[#588157]/30 text-white focus:border-[#588157]'
                      : 'bg-black/5 border border-[#588157]/25 text-[#1a1a14] focus:border-[#588157]'
                    : isDark
                    ? 'bg-white/5 border border-transparent text-[#9A9A8E]'
                    : 'bg-black/3 border border-transparent text-[#8a8a7a]'
                } outline-none`}
              />
            </div>

            {/* Department */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}
              >
                <MapPin className="w-4 h-4 inline mr-2" />
                Department
              </label>
              <input
                type="text"
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl transition-all ${
                  isEditing
                    ? isDark
                      ? 'bg-white/10 border border-[#588157]/30 text-white focus:border-[#588157]'
                      : 'bg-black/5 border border-[#588157]/25 text-[#1a1a14] focus:border-[#588157]'
                    : isDark
                    ? 'bg-white/5 border border-transparent text-[#9A9A8E]'
                    : 'bg-black/3 border border-transparent text-[#8a8a7a]'
                } outline-none`}
              />
            </div>

            {/* Student ID */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}
              >
                Student ID
              </label>
              <input
                type="text"
                value={profile.studentId}
                disabled
                className={`w-full px-4 py-3 rounded-xl ${
                  isDark
                    ? 'bg-white/5 border border-transparent text-[#5A5A52]'
                    : 'bg-black/3 border border-transparent text-[#8a8a7a]'
                } outline-none cursor-not-allowed`}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #3a5a40 0%, #344e41 100%)',
                  color: '#ffffff',
                }}
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${isDark ? 'rgba(163,177,138,0.2)' : 'rgba(58,90,64,0.2)'}`,
                  color: isDark ? '#9A9A8E' : '#8a8a7a',
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
