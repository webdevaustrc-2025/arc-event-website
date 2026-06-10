import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_SETTINGS: Record<string, string> = {
  event_name: 'ARC 3.0 2026',
  event_date: 'June 15-17, 2026',
  contact_email: 'support@austrc-fest.org',
  contact_phone: '+880 1700-000000',
  registration_status: 'open',
  max_teams: '500',
  registration_deadline: '2026-06-10T23:59',
  event_starting_deadline: '2026-06-15T09:00',
  min_members_per_team: '1',
  max_members_per_team: '5',
  enable_leaderboard: 'true',
  enable_certificates: 'true',
};

export async function GET() {
  try {
    const dbSettings = await prisma.setting.findMany();
    const settingsMap = { ...DEFAULT_SETTINGS };

    dbSettings.forEach((item) => {
      // Only expose public-safe settings to public API
      if (item.key in DEFAULT_SETTINGS) {
        settingsMap[item.key] = item.value;
      }
    });

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error('Error fetching public settings:', error);
    // Return default settings if DB query fails to maintain site functionality
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}
