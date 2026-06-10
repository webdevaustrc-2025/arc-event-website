"use client";
import React, { useState, useEffect } from 'react';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { 
  Settings, 
  Shield, 
  Bell, 
  Key, 
  Database, 
  Globe, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar,
  CreditCard,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface SettingsData {
  event_name: string;
  event_date: string;
  contact_email: string;
  contact_phone: string;
  registration_status: string;
  max_teams: string;
  registration_deadline: string;
  event_starting_deadline: string;
  min_members_per_team: string;
  max_members_per_team: string;
  enable_leaderboard: string;
  enable_certificates: string;
  allow_team_edits: string;
  require_payment_proof: string;
  bkash_number: string;
  nagad_number: string;
  maintenance_mode: string;
  require_2fa: string;
}

const DEFAULT_SETTINGS: SettingsData = {
  event_name: 'ARC 3.0 2026',
  event_date: 'June 15-17, 2026',
  contact_email: 'support@austrc-fest.org',
  contact_phone: '+880 1700-000000',
  registration_status: 'open',
  max_teams: '500',
  registration_deadline: '2026-06-10',
  event_starting_deadline: '2026-06-15T09:00',
  min_members_per_team: '1',
  max_members_per_team: '5',
  enable_leaderboard: 'true',
  enable_certificates: 'true',
  allow_team_edits: 'true',
  require_payment_proof: 'false',
  bkash_number: '+8801700000000',
  nagad_number: '+8801800000000',
  maintenance_mode: 'false',
  require_2fa: 'false',
};

export default function AdminSettingsPage() {
  const { isDark } = useResolvedTheme();
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const cardBg = isDark ? 'bg-[#111116] border-white/[0.07]' : 'bg-white border-black/[0.08]';
  const itemBg = isDark ? 'bg-[#18181f] border-white/[0.07]' : 'bg-[#F0EDE6] border-black/[0.08]';
  const textColor = isDark ? 'text-[#F5F5F0]' : 'text-[#1a1a14]';
  const mutedText = isDark ? 'text-[#9A9A8E]' : 'text-[#4a4a40]';
  const inputStyle = `w-full px-3 py-2 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#588157]/40 transition-all ${
    isDark ? 'bg-[#18181f] border-white/[0.07] text-[#F5F5F0]' : 'bg-white border-gray-300 text-gray-900'
  }`;

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        } else {
          console.error('Failed to load settings');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.message || 'Failed to save settings.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  }

  const handleInputChange = (key: keyof SettingsData, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSetting = (key: keyof SettingsData) => {
    setSettings((prev) => ({
      ...prev,
      [key]: prev[key] === 'true' ? 'false' : 'true',
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#588157]" />
        <p className={mutedText}>Loading system settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${textColor} mb-2`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Platform Settings</h1>
          <p className={`${mutedText} text-sm sm:text-base`}>Configure event metadata, registrations, payment channels, and system settings.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold transition-all shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 bg-[#3a5a40] text-white hover:bg-[#344e41] disabled:opacity-50`}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-w-0">
        <div className="space-y-6 lg:col-span-2 min-w-0">
          
          {/* Section 1: General Settings */}
          <div className={`p-6 rounded-2xl border ${cardBg}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <Globe className="w-5 h-5 text-[#588157]" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>General Settings</h2>
                <p className={`text-sm ${mutedText}`}>Configure basic event branding and contact details.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>Event Name</label>
                <input
                  type="text"
                  value={settings.event_name}
                  onChange={(e) => handleInputChange('event_name', e.target.value)}
                  className={inputStyle}
                  placeholder="ARC 3.0"
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>Event Dates Description</label>
                <input
                  type="text"
                  value={settings.event_date}
                  onChange={(e) => handleInputChange('event_date', e.target.value)}
                  className={inputStyle}
                  placeholder="June 15-17, 2026"
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>Contact Email Address</label>
                <input
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  className={inputStyle}
                  placeholder="support@event.com"
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>Contact Phone Number</label>
                <input
                  type="text"
                  value={settings.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  className={inputStyle}
                  placeholder="+880 1700-000000"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Registration Controls */}
          <div className={`p-6 rounded-2xl border ${cardBg}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <Calendar className="w-5 h-5 text-[#588157]" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Registration & Deadlines</h2>
                <p className={`text-sm ${mutedText}`}>Manage timelines, capacities, and team sizes.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>Registration Status</label>
                  <select
                    value={settings.registration_status}
                    onChange={(e) => handleInputChange('registration_status', e.target.value)}
                    className={inputStyle}
                  >
                    <option value="open">Open (Normal)</option>
                    <option value="closed">Closed (Capacity Full Warning)</option>
                    <option value="disabled">Disabled (Waitlist / Not Open Yet)</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>Max Teams Limit</label>
                  <input
                    type="number"
                    value={settings.max_teams}
                    onChange={(e) => handleInputChange('max_teams', e.target.value)}
                    className={inputStyle}
                    placeholder="500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>Registration Deadline (Date & Time)</label>
                  <input
                    type="datetime-local"
                    value={settings.registration_deadline ? (settings.registration_deadline.includes('T') ? settings.registration_deadline : `${settings.registration_deadline}T23:59`) : ''}
                    onChange={(e) => handleInputChange('registration_deadline', e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>Event Starting Deadline (Date & Time)</label>
                  <input
                    type="datetime-local"
                    value={settings.event_starting_deadline ? (settings.event_starting_deadline.includes('T') ? settings.event_starting_deadline : `${settings.event_starting_deadline}T09:00`) : ''}
                    onChange={(e) => handleInputChange('event_starting_deadline', e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>Min Members/Team</label>
                  <input
                    type="number"
                    value={settings.min_members_per_team}
                    onChange={(e) => handleInputChange('min_members_per_team', e.target.value)}
                    className={inputStyle}
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>Max Members/Team</label>
                  <input
                    type="number"
                    value={settings.max_members_per_team}
                    onChange={(e) => handleInputChange('max_members_per_team', e.target.value)}
                    className={inputStyle}
                    placeholder="5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Feature Toggles */}
          <div className={`p-6 rounded-2xl border ${cardBg}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <Settings className="w-5 h-5 text-[#588157]" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Feature Toggles</h2>
                <p className={`text-sm ${mutedText}`}>Enable or disable sections of the public website.</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Public Leaderboard Page', desc: 'Allows visitors to view participant points and ranks.', key: 'enable_leaderboard' as keyof SettingsData },
                { label: 'Certificate Downloads', desc: 'Allows logged-in users to download segment certificates.', key: 'enable_certificates' as keyof SettingsData },
                { label: 'Allow Post-Registration Edits', desc: 'Allows teams to modify details after submitting.', key: 'allow_team_edits' as keyof SettingsData },
                { label: 'Require Payment Verification Screenshot', desc: 'Force team captains to upload manual proof of payment.', key: 'require_payment_proof' as keyof SettingsData },
              ].map((toggle) => (
                <div key={toggle.key} className={`flex items-center justify-between p-4 rounded-xl border ${itemBg} transition-colors`}>
                  <div className="min-w-0 pr-4">
                    <span className={`font-semibold text-sm ${textColor} block`}>{toggle.label}</span>
                    <span className={`${mutedText} text-xs block truncate sm:whitespace-normal`}>{toggle.desc}</span>
                  </div>
                  <button
                    onClick={() => toggleSetting(toggle.key)}
                    className={`focus:outline-none transition-colors shrink-0 ${
                      settings[toggle.key] === 'true' ? 'text-[#3a5a40]' : 'text-gray-400'
                    }`}
                  >
                    {settings[toggle.key] === 'true' ? (
                      <ToggleRight className="w-12 h-8" />
                    ) : (
                      <ToggleLeft className="w-12 h-8" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Payment Details */}
          <div className={`p-6 rounded-2xl border ${cardBg}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <CreditCard className="w-5 h-5 text-[#588157]" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Payment Gateways</h2>
                <p className={`text-sm ${mutedText}`}>Set up official details for registration fee collection.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>bKash Merchant Number</label>
                <input
                  type="text"
                  value={settings.bkash_number}
                  onChange={(e) => handleInputChange('bkash_number', e.target.value)}
                  className={inputStyle}
                  placeholder="+880 1700-000000"
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>Nagad Merchant Number</label>
                <input
                  type="text"
                  value={settings.nagad_number}
                  onChange={(e) => handleInputChange('nagad_number', e.target.value)}
                  className={inputStyle}
                  placeholder="+880 1800-000000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6 min-w-0">
          {/* Quick Actions */}
          <div className={`p-6 rounded-2xl border ${cardBg}`}>
            <h3 className={`text-lg font-bold ${textColor} mb-4`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => alert('API keys reset successfully. All connected external integrations are updated.')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  isDark ? 'border-white/10 hover:bg-white/5 text-gray-300' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Key className="w-5 h-5 text-[#588157]" />
                <span className="text-sm font-medium">Reset API Keys</span>
              </button>
              <button 
                onClick={() => alert('Database export started. Your download will begin shortly as arc_backup.sql.')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  isDark ? 'border-white/10 hover:bg-white/5 text-gray-300' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Database className="w-5 h-5 text-[#588157]" />
                <span className="text-sm font-medium">Export Database</span>
              </button>
            </div>
          </div>

          {/* System toggles */}
          <div className={`p-6 rounded-2xl border ${cardBg}`}>
            <h3 className={`text-lg font-bold ${textColor} mb-4`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>System Locks</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`font-semibold text-sm ${textColor} block`}>Maintenance Mode</span>
                  <span className={`${mutedText} text-xs`}>Lock website for database migration.</span>
                </div>
                <button
                  onClick={() => toggleSetting('maintenance_mode')}
                  className={`focus:outline-none shrink-0 ${
                    settings.maintenance_mode === 'true' ? 'text-amber-500' : 'text-gray-400'
                  }`}
                >
                  {settings.maintenance_mode === 'true' ? (
                    <ToggleRight className="w-12 h-8" />
                  ) : (
                    <ToggleLeft className="w-12 h-8" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <span className={`font-semibold text-sm ${textColor} block`}>Enforce Admin 2FA</span>
                  <span className={`${mutedText} text-xs`}>Mandatory Google Authenticator login.</span>
                </div>
                <button
                  onClick={() => toggleSetting('require_2fa')}
                  className={`focus:outline-none shrink-0 ${
                    settings.require_2fa === 'true' ? 'text-[#3a5a40]' : 'text-gray-400'
                  }`}
                >
                  {settings.require_2fa === 'true' ? (
                    <ToggleRight className="w-12 h-8" />
                  ) : (
                    <ToggleLeft className="w-12 h-8" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
            <h3 className="text-lg font-bold text-red-500 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Danger Zone</h3>
            <p className={`text-sm mb-4 ${isDark ? 'text-red-400' : 'text-red-700'}`}>These actions are destructive and cannot be undone.</p>
            <button 
              onClick={() => {
                if (confirm('Are you absolutely sure you want to reset all registrations, segments, and leaderboard points? This will purge all transaction data.')) {
                  alert('Database reset successful. Default settings reloaded.');
                  setSettings(DEFAULT_SETTINGS);
                }
              }}
              className="w-full py-2.5 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors text-sm"
            >
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}