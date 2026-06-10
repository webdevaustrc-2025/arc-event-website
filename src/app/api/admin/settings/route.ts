import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

const ALL_DEFAULT_SETTINGS: Record<string, string> = {
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
  allow_team_edits: 'true',
  require_payment_proof: 'false',
  bkash_number: '+8801700000000',
  nagad_number: '+8801800000000',
  maintenance_mode: 'false',
  require_2fa: 'false',
};

// GET: Retrieve all settings (including sensitive payment numbers)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const dbSettings = await prisma.setting.findMany();
    const settingsMap = { ...ALL_DEFAULT_SETTINGS };

    dbSettings.forEach((item) => {
      if (item.key in ALL_DEFAULT_SETTINGS) {
        settingsMap[item.key] = item.value;
      }
    });

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST: Save settings configurations
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    // Save each key-value pair in database
    const updatedKeys: string[] = [];
    for (const [key, value] of Object.entries(body)) {
      if (key in ALL_DEFAULT_SETTINGS) {
        const strValue = String(value);
        await prisma.setting.upsert({
          where: { key },
          update: { value: strValue },
          create: { key, value: strValue },
        });
        updatedKeys.push(key);
      }
    }

    // Log this settings update in client activity list
    if (updatedKeys.length > 0) {
      await prisma.activity.create({
        data: {
          title: 'Settings Updated',
          desc: `Admin updated configurations: ${updatedKeys.slice(0, 3).join(', ')}${updatedKeys.length > 3 ? '...' : ''}`,
          icon: 'Settings',
          color: 'text-blue-500',
        },
      });
    }

    return NextResponse.json({ success: true, updatedKeys });
  } catch (error) {
    console.error('Error saving admin settings:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
