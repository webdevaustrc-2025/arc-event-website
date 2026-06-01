"use client";
import React from 'react';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { Settings, Shield, Bell, Key, Database, Globe } from 'lucide-react';

export default function AdminSettingsPage() {
  const { isDark } = useResolvedTheme();
  const cardBg = isDark ? 'bg-[#111116] border-white/[0.07]' : 'bg-white border-black/[0.08]';
  const itemBg = isDark ? 'bg-[#18181f] border-white/[0.07]' : 'bg-[#F0EDE6] border-black/[0.08]';
  const textColor = isDark ? 'text-[#F5F5F0]' : 'text-[#1a1a14]';
  const mutedText = isDark ? 'text-[#9A9A8E]' : 'text-[#4a4a40]';

  const settingsSections = [
    {
      title: 'General Settings',
      icon: Globe,
      description: 'Configure basic event details and website behavior.',
      settings: [
        { label: 'Event Name', type: 'text', value: 'ARC 3.0 2026' },
        { label: 'Registration Status', type: 'select', value: 'Open' },
        { label: 'Contact Email', type: 'email', value: 'support@ARC 3.0.edu' }
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      description: 'Manage admin access, passwords, and 2FA.',
      settings: [
        { label: 'Require 2FA for Admins', type: 'toggle', value: true },
        { label: 'Session Timeout', type: 'select', value: '2 Hours' }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      description: 'Manage automated emails and SMS alerts.',
      settings: [
        { label: 'Email on New Registration', type: 'toggle', value: true },
        { label: 'Daily Digest', type: 'toggle', value: false }
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${textColor} mb-2`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Platform Settings</h1>
          <p className={`${mutedText} text-lg`}>Configure your event dashboard and platform preferences.</p>
        </div>
        <button className={`px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_2px_12px_rgba(0,0,0,0.15)] bg-[#3a5a40] text-white hover:bg-[#344e41]`}>
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6 lg:col-span-2">
          {settingsSections.map((section, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border ${cardBg}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}>
                  <section.icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{section.title}</h2>
                  <p className={`text-sm ${mutedText}`}>{section.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {section.settings.map((setting, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${itemBg}`}>
                    <span className={`font-medium ${textColor}`}>{setting.label}</span>

                    {setting.type === 'toggle' && (
                      <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${setting.value ? 'bg-[#3a5a40]' : 'bg-gray-400'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${setting.value ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    )}

                    {(setting.type === 'text' || setting.type === 'email') && (
                      <input
                        type={setting.type}
                        defaultValue={setting.value as string}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#588157]/40 ${isDark ? 'bg-[#18181f] border-white/[0.07] text-[#F5F5F0]' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                      />
                    )}

                    {setting.type === 'select' && (
                      <select className={`px-3 py-1.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#588157]/40 ${isDark ? 'bg-[#18181f] border-white/[0.07] text-[#F5F5F0]' : 'bg-white border-gray-300 text-gray-900'
                        }`}>
                        <option>{setting.value}</option>
                        <option>Alternative Option</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${cardBg}`}>
            <h3 className={`text-lg font-bold ${textColor} mb-4`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Quick Actions</h3>
            <div className="space-y-3">
              <button className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${isDark ? 'border-white/10 hover:bg-white/5 text-gray-300' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}>
                <Key className="w-5 h-5" />
                <span>Reset API Keys</span>
              </button>
              <button className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${isDark ? 'border-white/10 hover:bg-white/5 text-gray-300' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}>
                <Database className="w-5 h-5" />
                <span>Export Database</span>
              </button>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
            <h3 className="text-lg font-bold text-red-500 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Danger Zone</h3>
            <p className={`text-sm mb-4 ${isDark ? 'text-red-400' : 'text-red-700'}`}>These actions are destructive and cannot be undone.</p>
            <button className="w-full py-2.5 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors">
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}