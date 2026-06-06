"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate, useParams } from '@/lib/router-compat';
import { Calendar, MapPin, Clock, Trophy, Medal, ArrowLeft, FileText, Zap, Target, Shield, Award } from 'lucide-react';

interface DbSegment {
  id: number;
  name: string;
  description: string;
  rules?: string | null;
  prizePool?: string | null;
  category?: string | null;
  teamSize?: string | null;
  fee?: string | null;
  deadline?: string | null;
  location?: string | null;
  scheduleText?: string | null;
  imageUrl?: string | null;
  ruleBookUrl?: string | null;
  highlights?: string[];
}

const eventData: Record<string, unknown> = {
  1: {
    id: 1,
    title: 'Robo Soccer',
    tagline: 'Build and program autonomous or manual robots to compete in a high-stakes soccer tournament',
    category: 'Manual Control',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    schedule: 'Day 1 • May 20, 2026 • 10:00 AM',
    location: 'Arena A, Main Hall',
    deadline: 'May 15, 2026',
    prizePool: {
      champion: '৳20,000',
      runnerUp: '৳10,000',
    },
    teamSize: 'Max 4 members',
    fee: '৳500',
    description:
      'Robo Soccer is the ultimate test of robotics engineering, programming, and real-time strategy. Teams design and build robots capable of playing soccer on a custom arena. Whether autonomous or manually controlled, your robot must navigate the field, coordinate with teammates, and score goals while defending against opponents. This competition demands precision mechanics, intelligent algorithms, and tactical gameplay.',
    highlights: [
      'Custom-built arena with professional soccer field layout',
      'Real-time strategy and quick decision-making required',
      'Combines mechanical design with advanced programming',
      'Team coordination essential for victory',
      'Live tournament bracket with elimination rounds',
      'Referee system with instant replay technology',
    ],
  },
  2: {
    id: 2,
    title: 'Line Follower',
    tagline: 'Optimize your algorithms for the fastest time across complex track layouts',
    category: 'Autonomous',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    schedule: 'Day 1 • May 20, 2026 • 2:00 PM',
    location: 'Track B, Engineering Wing',
    deadline: 'May 12, 2026',
    prizePool: {
      champion: '৳15,000',
      runnerUp: '৳7,500',
    },
    teamSize: 'Max 3 members',
    fee: '৳400',
    description:
      'The Line Follower challenge tests your ability to create a fully autonomous robot that can navigate complex track patterns at high speed. Using sensors and optimized algorithms, your robot must follow a black line through sharp turns, intersections, and obstacles without human intervention. Speed and accuracy are key to victory.',
    highlights: [
      'Complex track with sharp turns and intersections',
      'Sensor calibration and PID tuning critical',
      'Speed optimization without sacrificing accuracy',
      'Multiple track configurations for different rounds',
      'Time-based scoring system',
      'Penalty for track deviations',
    ],
  },
  3: {
    id: 3,
    title: 'Drone Race',
    tagline: 'Navigate aerial obstacles in a high-speed FPV drone racing championship',
    category: 'Manual Control',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
    schedule: 'Day 2 • May 21, 2026 • 11:00 AM',
    location: 'Sky Zone, Outdoor Arena',
    deadline: 'May 10, 2026',
    prizePool: {
      champion: '৳50,000',
      runnerUp: '৳25,000',
    },
    teamSize: 'Solo (Max 1)',
    fee: '৳1000',
    description:
      'Experience the thrill of high-speed FPV drone racing through challenging aerial obstacle courses. Pilots navigate their drones through gates, around pylons, and over barriers using first-person view goggles. This extreme competition requires lightning-fast reflexes, precision control, and nerves of steel.',
    highlights: [
      'Professional FPV racing course with multiple obstacles',
      'Real-time video feed from drone camera',
      'Weather-resistant outdoor arena',
      'Elimination bracket tournament format',
      'Live audience screens showing pilot perspective',
      'Safety nets and crash recovery zones',
    ],
  },
};

export default function EventDetailsPage({ dbSegment }: { dbSegment?: DbSegment }) {
  const navigate = useNavigate();
  const params = useParams();
  const idStr = params.id || '1';
  const dummyEvent = (eventData[idStr] || eventData['1']) as any;

  const event = dbSegment
    ? {
        id: dbSegment.id,
        title: dbSegment.name,
        tagline: dbSegment.description,
        category: dbSegment.category && dbSegment.category !== 'General' ? dbSegment.category : (dummyEvent?.category || 'General'),
        image: dbSegment.imageUrl || dummyEvent?.image || '/globe.svg',
        schedule: dbSegment.scheduleText && dbSegment.scheduleText !== 'TBA' ? dbSegment.scheduleText : (dummyEvent?.schedule || 'TBA'),
        location: dbSegment.location && dbSegment.location !== 'TBA' ? dbSegment.location : (dummyEvent?.location || 'TBA'),
        deadline: dbSegment.deadline && dbSegment.deadline !== 'TBA' ? dbSegment.deadline : (dummyEvent?.deadline || 'TBA'),
        prizePool: {
          champion: dbSegment.prizePool || dummyEvent?.prizePool?.champion || 'Not Specified',
          runnerUp: dummyEvent?.prizePool?.runnerUp || 'TBA',
        },
        teamSize: dbSegment.teamSize && dbSegment.teamSize !== 'TBA' ? dbSegment.teamSize : (dummyEvent?.teamSize || 'TBA'),
        fee: dbSegment.fee && dbSegment.fee !== 'TBA' ? dbSegment.fee : (dummyEvent?.fee || 'TBA'),
        description: dbSegment.description || dummyEvent?.description,
        highlights: dbSegment.highlights?.length ? dbSegment.highlights : (dummyEvent?.highlights || [dbSegment.rules || 'No rules specified']),
        ruleBookUrl: dbSegment.ruleBookUrl || dummyEvent?.ruleBookUrl,
      }
    : (dummyEvent as any);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/segments')}
          className="flex items-center gap-2 text-[#9A9A8E] hover:text-[#a3b18a] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Back to Segments</span>
        </motion.button>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl overflow-hidden group"
            style={{
              boxShadow: '0 0 40px rgba(88,129,87,0.2), 0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <div
              className="aspect-[4/3] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url(${event.image})`,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(58,90,64,0.4) 100%)',
              }}
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(88,129,87,0.3) 0%, transparent 70%)',
              }}
            />
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center"
          >
            <span
              className="inline-block px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 w-fit"
              style={{
                background: 'rgba(88,129,87,0.2)',
                border: '1px solid rgba(163,177,138,0.3)',
                color: '#a3b18a',
              }}
            >
              {event.category}
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {event.title}
            </h1>
            <p className="text-[#9A9A8E] text-lg leading-relaxed">{event.tagline}</p>
          </motion.div>
        </div>

        {/* Prize Pool & Info Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Prize Pool Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-1 p-6 rounded-2xl backdrop-blur-md group hover:-translate-y-1 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(58,90,64,0.08) 0%, rgba(163,177,138,0.04) 100%)',
              border: '1px solid rgba(163,177,138,0.15)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.03)',
            }}
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#588157]" />
              Prize Pool
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-[#9A9A8E] text-sm">Champion</span>
                </div>
                <span className="text-2xl font-bold text-[#a3b18a]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {event.prizePool.champion}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Medal className="w-5 h-5 text-gray-400" />
                  <span className="text-[#9A9A8E] text-sm">Runner-up</span>
                </div>
                <span className="text-xl font-bold text-[#9A9A8E]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {event.prizePool.runnerUp}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {/* Schedule Card */}
            <div
              className="p-5 rounded-xl backdrop-blur-md hover:-translate-y-1 transition-all duration-300 group"
              style={{
                background: 'rgba(88,129,87,0.06)',
                border: '1px solid rgba(88,129,87,0.2)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              }}
            >
              <Calendar className="w-6 h-6 text-[#588157] mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-xs text-[#5A5A52] uppercase tracking-wider mb-1">Schedule</p>
              <p className="text-sm font-semibold text-white">{event.schedule}</p>
            </div>

            {/* Location Card */}
            <div
              className="p-5 rounded-xl backdrop-blur-md hover:-translate-y-1 transition-all duration-300 group"
              style={{
                background: 'rgba(163,177,138,0.06)',
                border: '1px solid rgba(163,177,138,0.2)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              }}
            >
              <MapPin className="w-6 h-6 text-[#a3b18a] mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-xs text-[#5A5A52] uppercase tracking-wider mb-1">Location</p>
              <p className="text-sm font-semibold text-white">{event.location}</p>
            </div>

            {/* Deadline Card */}
            <div
              className="p-5 rounded-xl backdrop-blur-md hover:-translate-y-1 transition-all duration-300 group"
              style={{
                background: 'rgba(58,90,64,0.06)',
                border: '1px solid rgba(58,90,64,0.25)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              }}
            >
              <Clock className="w-6 h-6 text-[#3a5a40] mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-xs text-[#5A5A52] uppercase tracking-wider mb-1">Deadline</p>
              <p className="text-sm font-semibold text-white">{event.deadline}</p>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <Link
            to="/register"
            className="flex-1 sm:flex-none px-8 py-4 rounded-xl font-semibold text-center transition-all duration-300 hover:scale-105 shadow-lg group"
            style={{
              background: 'linear-gradient(135deg, #3a5a40 0%, #344e41 100%)',
              border: '1px solid rgba(163,177,138,0.3)',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(58,90,64,0.4)',
            }}
          >
            <span className="inline-flex items-center gap-2">
              Register Now
              <Zap className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <a
            href={event.ruleBookUrl || undefined}
            aria-disabled={!event.ruleBookUrl}
            className="flex-1 sm:flex-none px-8 py-4 rounded-xl font-semibold backdrop-blur-md transition-all duration-300 hover:scale-105 group text-center"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(163,177,138,0.25)',
              color: '#a3b18a',
              pointerEvents: event.ruleBookUrl ? 'auto' : 'none',
              opacity: event.ruleBookUrl ? 1 : 0.65,
            }}
          >
            <span className="inline-flex items-center gap-2">
              <FileText className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Download Rule Book
            </span>
          </a>
        </motion.div>

        {/* Description Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 rounded-2xl backdrop-blur-md mb-12"
          style={{
            background: 'linear-gradient(135deg, rgba(58,90,64,0.06) 0%, rgba(163,177,138,0.03) 100%)',
            border: '1px solid rgba(163,177,138,0.12)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.03)',
          }}
        >
          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            About This Event
          </h2>
          <p className="text-[#9A9A8E] leading-relaxed text-base">{event.description}</p>
        </motion.div>

        {/* Key Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 rounded-2xl backdrop-blur-md"
          style={{
            background: 'linear-gradient(135deg, rgba(88,129,87,0.06) 0%, rgba(163,177,138,0.03) 100%)',
            border: '1px solid rgba(88,129,87,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.03)',
          }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <Target className="w-6 h-6 text-[#588157]" />
            Key Highlights
          </h2>
          <ul className="space-y-4">
            {event.highlights.map((highlight: string, idx: number) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.05 }}
                className="flex items-start gap-3 text-[#9A9A8E] group"
              >
                <Shield className="w-5 h-5 text-[#588157] mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="leading-relaxed">{highlight}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
