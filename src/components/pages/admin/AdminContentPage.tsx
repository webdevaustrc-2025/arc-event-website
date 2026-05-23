"use client";
import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { HelpCircle, HandHeart, MessageSquare, Plus, Edit2, Trash2, Globe, Image as ImageIcon } from 'lucide-react';

const faqData = [
  { id: 1, question: 'What is RoboFest?', answer: 'RoboFest is the premier university robotics event...', category: 'General' },
  { id: 2, question: 'How do I register a team?', answer: 'You can register a team by visiting the registration page...', category: 'Registration' },
  { id: 3, question: 'Are there any registration fees?', answer: 'Yes, early bird registration is $50...', category: 'Payment' },
];

const sponsorsData = [
  { id: 1, name: 'TechCorp', tier: 'Platinum', status: 'Active', amount: '$10,000' },
  { id: 2, name: 'InnoSystems', tier: 'Gold', status: 'Active', amount: '$5,000' },
  { id: 3, name: 'CyberDynamics', tier: 'Silver', status: 'Pending Approval', amount: '$2,500' },
];

export default function AdminContentPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('faq');

  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#111116] border-white/[0.07]' : 'bg-white border-black/[0.08]';
  const itemBg = isDark ? 'bg-[#18181f] border-white/[0.07]' : 'bg-[#F0EDE6] border-black/[0.06]';
  const textColor = isDark ? 'text-[#F5F5F0]' : 'text-[#1a1a14]';
  const mutedText = isDark ? 'text-[#9A9A8E]' : 'text-[#4a4a40]';
  
  const tabs = [
    { id: 'faq', label: 'FAQ Manager', icon: HelpCircle },
    { id: 'sponsors', label: 'Sponsors & Partners', icon: HandHeart },
    { id: 'announcements', label: 'Announcements', icon: MessageSquare },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${textColor} mb-2`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Content Management</h1>
          <p className={`${mutedText} text-lg`}>Update website copy, FAQs, and manage sponsors.</p>
        </div>
        <button className={`px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex items-center gap-2 bg-[#3a5a40] text-white hover:bg-[#344e41]`}>
          <Plus className="w-4 h-4" />
          Add Content
        </button>
      </div>

      <div className={`p-2 flex gap-2 overflow-x-auto rounded-xl border ${cardBg}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? (isDark ? 'bg-white/10 text-white shadow-sm' : 'bg-gray-100 text-gray-900 shadow-sm')
                : (isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50')
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className={`p-6 rounded-2xl border ${cardBg}`}>
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Frequently Asked Questions</h2>
              <button className={`text-sm font-medium hover:underline text-[#588157] hover:text-[#a3b18a]`}>
                Reorder Questions
              </button>
            </div>
            <div className="space-y-4">
              {faqData.map((faq) => (
                <div key={faq.id} className={`p-5 rounded-xl border transition-all hover:border-gray-400 group flex items-start justify-between gap-4 ${itemBg}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${isDark ? 'bg-white/5 text-gray-300 border-white/10' : 'bg-gray-200 text-gray-700 border-gray-300'}`}>
                        {faq.category}
                      </span>
                      <h4 className={`font-semibold text-lg ${textColor}`}>{faq.question}</h4>
                    </div>
                    <p className={`${mutedText} text-sm`}>{faq.answer}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}>
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sponsors' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Sponsorship Tiers & Logos</h2>
              <button className={`text-sm font-medium hover:underline text-[#588157] hover:text-[#a3b18a]`}>
                Manage Tiers
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sponsorsData.map((sponsor) => (
                <div key={sponsor.id} className={`p-5 rounded-xl border flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1 ${itemBg}`}>
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'}`}>
                    <ImageIcon className={`w-8 h-8 ${mutedText}`} />
                  </div>
                  <h4 className={`font-semibold text-lg ${textColor}`}>{sponsor.name}</h4>
                  
                  <div className="flex flex-col gap-2 mt-3 items-center w-full">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      sponsor.tier === 'Platinum' ? 'bg-gray-800 text-gray-200 border-gray-600' :
                      sponsor.tier === 'Gold' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                      'bg-gray-400/10 text-gray-400 border-gray-400/20'
                    }`}>
                      {sponsor.tier}
                    </span>
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{sponsor.amount}</span>
                  </div>

                  <div className={`mt-4 pt-4 border-t w-full flex justify-between items-center ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <span className={`text-xs flex items-center gap-1 ${sponsor.status === 'Active' ? 'text-[#588157]' : 'text-amber-500'}`}>
                      <Globe className="w-3 h-3" />
                      {sponsor.status}
                    </span>
                    <button className={`p-1.5 rounded-md transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}>
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Homepage Announcements</h2>
            </div>
            
            <div className={`p-8 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
              <MessageSquare className={`w-12 h-12 mb-4 ${mutedText} opacity-50`} />
              <h3 className={`font-semibold text-lg ${textColor} mb-2`}>No Active Announcements</h3>
              <p className={`${mutedText} text-sm max-w-md mb-6`}>Create an announcement banner that will appear at the top of the homepage for all visitors.</p>
              <button className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}>
                Create Banner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}