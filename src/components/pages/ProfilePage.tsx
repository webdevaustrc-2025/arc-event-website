"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, Mail, Phone, MapPin, Building2, Save, User as UserIcon, Loader2, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useTheme } from 'next-themes';
import AvatarUploadModal from '@/components/ui/AvatarUploadModal';

const DEFAULT_AVATAR =
  'https://res.cloudinary.com/dxyhzgrul/image/upload/v1780398181/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4215_bdeofc.jpg';

export default function ProfilePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || !theme;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [error, setError] = useState('');

  // Change-password state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [changingPassword, setChangingPassword] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    department: '',
    studentId: '',
    avatar: DEFAULT_AVATAR,
    registrationId: '',
    accountCreatedAt: '',
    role: 'user',
    hasPassword: false,
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/dashboard/summary');
        if (res.ok) {
          const summaryData = await res.json();
          setProfile({
            name: summaryData.user?.name || '',
            email: summaryData.user?.email || '',
            phone: summaryData.user?.phone || '',
            university: summaryData.user?.university || '',
            department: summaryData.user?.department || '',
            studentId: summaryData.user?.studentId || 'N/A',
            avatar: summaryData.user?.avatarUrl || DEFAULT_AVATAR,
            registrationId: summaryData.user?.registrationId || 'N/A',
            accountCreatedAt: summaryData.user?.accountCreatedAt || 'N/A',
            role: summaryData.user?.role || 'user',
            hasPassword: Boolean(summaryData.user?.hasPassword),
          });
        } else {
          const data = await res.json().catch(() => ({}));
          setError(data.message || 'Failed to load profile.');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Network error while loading profile.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/dashboard/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          university: profile.university,
          department: profile.department,
          studentId: profile.studentId,
        }),
      });

      if (res.ok) {
        alert('Profile details updated successfully!');
        setIsEditing(false);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('An error occurred while saving your profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (newUrl: string) => {
    setProfile((prev) => ({ ...prev, avatar: newUrl }));
  };

  const handleChangePassword = async () => {
    setPwMsg(null);
    if (!pwForm.newPassword || pwForm.newPassword.length < 8) {
      setPwMsg({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch('/api/dashboard/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pwForm),
      });
      const data = await res.json();
      if (res.ok) {
        setPwMsg({ type: 'success', text: 'Password updated successfully!' });
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPwMsg({ type: 'error', text: data.message || 'Failed to update password.' });
      }
    } catch {
      setPwMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setChangingPassword(false);
    }
  };

  const inputClass = (editable: boolean) =>
    `w-full px-4 py-3 rounded-xl transition-all ${
      editable
        ? isDark
          ? 'bg-white/10 border border-[#588157]/30 text-white focus:border-[#588157]'
          : 'bg-black/5 border border-[#588157]/25 text-[#1a1a14] focus:border-[#588157]'
        : isDark
        ? 'bg-white/5 border border-transparent text-[#9A9A8E]'
        : 'bg-black/3 border border-transparent text-[#8a8a7a]'
    } outline-none`;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#588157]" />
        <p className="text-gray-400 text-sm">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
        <UserIcon className="w-12 h-12 text-red-400" />
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}>Unable to Load Profile</h1>
        <p className="text-sm text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Avatar Upload Modal */}
      <AvatarUploadModal
        isOpen={showAvatarModal}
        currentAvatar={profile.avatar}
        isDark={isDark}
        onClose={() => setShowAvatarModal(false)}
        onAvatarChange={handleAvatarChange}
      />

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
            {/* Avatar with clickable overlay */}
            <div className="relative group">
              <img
                src={profile.avatar || DEFAULT_AVATAR}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
                style={{
                  border: `3px solid ${isDark ? 'rgba(88,129,87,0.3)' : 'rgba(88,129,87,0.25)'}`,
                }}
              />
              {/* Always-clickable camera button */}
              <button
                onClick={() => setShowAvatarModal(true)}
                aria-label="Change profile picture"
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              >
                <Camera className="w-8 h-8 text-white" />
              </button>

              {/* Small camera badge */}
              <div
                className="absolute bottom-1 right-1 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer shadow-lg"
                onClick={() => setShowAvatarModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #3a5a40 0%, #588157 100%)',
                }}
              >
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2
                className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {profile.name}
              </h2>
              <p className={`text-lg ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
                {profile.university || 'Institution not added'}
              </p>
              <div className="flex flex-col sm:flex-row items-center md:items-start gap-2 mt-3">
                <span
                  className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
                  style={{
                    background: isDark ? 'rgba(88,129,87,0.15)' : 'rgba(88,129,87,0.12)',
                    border: `1px solid ${isDark ? 'rgba(88,129,87,0.3)' : 'rgba(88,129,87,0.25)'}`,
                    color: '#588157',
                  }}
                >
                  Participant
                </span>
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                    border: `1px solid ${isDark ? 'rgba(163,177,138,0.15)' : 'rgba(58,90,64,0.15)'}`,
                    color: isDark ? '#9A9A8E' : '#8a8a7a',
                  }}
                >
                  Change Photo
                </button>
              </div>
            </div>

            {/* Registration ID */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
                Registration ID
              </label>
              <input
                type="text"
                value={profile.registrationId || 'N/A'}
                disabled
                className={`w-full px-4 py-3 rounded-xl ${
                  isDark
                    ? 'bg-white/5 border border-transparent text-[#5A5A52]'
                    : 'bg-black/3 border border-transparent text-[#8a8a7a]'
                } outline-none cursor-not-allowed`}
              />
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
                <UserIcon className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!isEditing}
                className={inputClass(isEditing)}
              />
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className={inputClass(false)}
              />
            </div>

            {/* Phone */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isEditing}
                className={inputClass(isEditing)}
              />
            </div>

            {/* University */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
                <Building2 className="w-4 h-4 inline mr-2" />
                University
              </label>
              <input
                type="text"
                value={profile.university}
                onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                disabled={!isEditing}
                className={inputClass(isEditing)}
              />
            </div>

            {/* Department */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
                <MapPin className="w-4 h-4 inline mr-2" />
                Department
              </label>
              <input
                type="text"
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                disabled={!isEditing}
                className={inputClass(isEditing)}
              />
            </div>

            {/* Student ID – always read-only */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
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
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #3a5a40 0%, #344e41 100%)',
                  color: '#ffffff',
                }}
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? 'Saving...' : 'Save Changes'}
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

      {/* Account Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="rounded-2xl overflow-hidden backdrop-blur-md mt-6 p-6 sm:p-8"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(58,90,64,0.06) 0%, rgba(163,177,138,0.03) 100%)'
            : 'linear-gradient(135deg, rgba(58,90,64,0.04) 0%, rgba(163,177,138,0.02) 100%)',
          border: `1px solid ${isDark ? 'rgba(163,177,138,0.12)' : 'rgba(58,90,64,0.15)'}`,
        }}
      >
        <h2
          className={`text-xl font-bold mb-5 ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Account Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Account Type', value: profile.role === 'admin' ? 'Admin' : 'Participant' },
            { label: 'Account Created', value: profile.accountCreatedAt || 'N/A' },
            { label: 'Password', value: profile.hasPassword ? 'Configured' : 'Not configured' },
          ].map((item) => (
            <div
              key={item.label}
              className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'}`}
            >
              <p className={`text-xs uppercase tracking-wider mb-1 ${isDark ? 'text-[#5A5A52]' : 'text-[#8a8a7a]'}`}>
                {item.label}
              </p>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Change Password Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl overflow-hidden backdrop-blur-md mt-6"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(58,90,64,0.06) 0%, rgba(163,177,138,0.03) 100%)'
            : 'linear-gradient(135deg, rgba(58,90,64,0.04) 0%, rgba(163,177,138,0.02) 100%)',
          border: `1px solid ${isDark ? 'rgba(163,177,138,0.12)' : 'rgba(58,90,64,0.15)'}`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 p-6 border-b"
          style={{ borderColor: isDark ? 'rgba(163,177,138,0.1)' : 'rgba(58,90,64,0.1)' }}
        >
          <div
            className="w-10 h-10 flex items-center justify-center rounded-xl"
            style={{ background: isDark ? 'rgba(88,129,87,0.15)' : 'rgba(88,129,87,0.1)' }}
          >
            <KeyRound className="w-5 h-5" style={{ color: '#588157' }} />
          </div>
          <div>
            <h2
              className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#1a1a14]'}`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Change Password
            </h2>
            <p className={`text-sm ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
              Update your account password
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Current Password */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
                <Lock className="w-4 h-4 inline mr-2" />
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPw.current ? 'text' : 'password'}
                  value={pwForm.currentPassword}
                  onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                  placeholder="Your current password"
                  className={`w-full px-4 py-3 pr-10 rounded-xl transition-all outline-none ${
                    isDark
                      ? 'bg-white/10 border border-[#588157]/30 text-white placeholder:text-[#5A5A52] focus:border-[#588157]'
                      : 'bg-black/5 border border-[#588157]/25 text-[#1a1a14] placeholder:text-[#9a9a8a] focus:border-[#588157]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => ({ ...p, current: !p.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: isDark ? '#5A5A52' : '#9a9a8a' }}
                >
                  {showPw.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
                <Lock className="w-4 h-4 inline mr-2" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPw.new ? 'text' : 'password'}
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                  placeholder="Min 8 characters"
                  className={`w-full px-4 py-3 pr-10 rounded-xl transition-all outline-none ${
                    isDark
                      ? 'bg-white/10 border border-[#588157]/30 text-white placeholder:text-[#5A5A52] focus:border-[#588157]'
                      : 'bg-black/5 border border-[#588157]/25 text-[#1a1a14] placeholder:text-[#9a9a8a] focus:border-[#588157]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => ({ ...p, new: !p.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: isDark ? '#5A5A52' : '#9a9a8a' }}
                >
                  {showPw.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#9A9A8E]' : 'text-[#8a8a7a]'}`}>
                <Lock className="w-4 h-4 inline mr-2" />
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPw.confirm ? 'text' : 'password'}
                  value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                  placeholder="Repeat new password"
                  className={`w-full px-4 py-3 pr-10 rounded-xl transition-all outline-none ${
                    isDark
                      ? 'bg-white/10 border border-[#588157]/30 text-white placeholder:text-[#5A5A52] focus:border-[#588157]'
                      : 'bg-black/5 border border-[#588157]/25 text-[#1a1a14] placeholder:text-[#9a9a8a] focus:border-[#588157]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => ({ ...p, confirm: !p.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: isDark ? '#5A5A52' : '#9a9a8a' }}
                >
                  {showPw.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Feedback message */}
          {pwMsg && (
            <div
              className="mt-4 px-4 py-3 rounded-xl text-sm"
              style={{
                background: pwMsg.type === 'success' ? 'rgba(88,129,87,0.15)' : 'rgba(220,38,38,0.1)',
                border: `1px solid ${pwMsg.type === 'success' ? 'rgba(88,129,87,0.3)' : 'rgba(220,38,38,0.25)'}`,
                color: pwMsg.type === 'success' ? '#588157' : '#f87171',
              }}
            >
              {pwMsg.text}
            </div>
          )}

          <button
            onClick={handleChangePassword}
            disabled={changingPassword}
            className="mt-6 flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #3a5a40 0%, #344e41 100%)',
              color: '#ffffff',
            }}
          >
            {changingPassword ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <KeyRound className="w-4 h-4" />
            )}
            {changingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
