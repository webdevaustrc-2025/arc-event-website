const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clear existing data
  await prisma.setting.deleteMany({});
  await prisma.leaderboard.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.registration.deleteMany({});
  await prisma.schedule.deleteMany({});
  await prisma.segment.deleteMany({});
  await prisma.sponsor.deleteMany({});
  await prisma.fAQ.deleteMany({});
  await prisma.pastEvent.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Seed Default Settings
  await prisma.setting.create({
    data: { key: 'registration_status', value: 'open' }
  });

  // 3. Seed FAQs
  const faqs = [
    { question: 'Who can participate in RoboFest?', answer: 'Students from any recognized school, college, or university across the country can participate.', displayOrder: 1 },
    { question: 'Are teams allowed to have members from different institutions?', answer: 'Yes, cross-institutional teams are allowed for all team segments.', displayOrder: 2 },
    { question: 'Is there a registration fee?', answer: 'Yes, registration fees vary by segment. Check the individual segment page for details.', displayOrder: 3 },
    { question: 'Can a participant register for multiple segments?', answer: 'Yes, as long as the schedules of the segments do not overlap.', displayOrder: 4 },
  ];
  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }

  // 4. Seed Sponsors
  const sponsors = [
    { name: 'Tech Giant Corp', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&q=80', tier: 'gold', websiteUrl: 'https://example.com', displayOrder: 1 },
    { name: 'Robotics Labs Ltd', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&q=80', tier: 'gold', websiteUrl: 'https://example.com', displayOrder: 2 },
    { name: 'Future Innovators', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&q=80', tier: 'silver', websiteUrl: 'https://example.com', displayOrder: 3 },
    { name: 'Cyber Automations', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&q=80', tier: 'bronze', websiteUrl: 'https://example.com', displayOrder: 4 },
  ];
  for (const sponsor of sponsors) {
    await prisma.sponsor.create({ data: sponsor });
  }

  // 5. Seed Past Events
  const pastEvents = [
    { name: 'RoboFest 2024', date: new Date('2024-05-15'), description: 'The largest robotic showdown of the year with over 500 participants.', imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80' },
    { name: 'National Line Follower Championship 2025', date: new Date('2025-02-10'), description: 'High speed algorithms meeting precision tracks.', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80' },
  ];
  for (const event of pastEvents) {
    await prisma.pastEvent.create({ data: event });
  }

  // 6. Seed Segments
  const segments = [
    { name: 'Robo Soccer', description: 'Build and program autonomous or manual robots to compete in a high-stakes soccer tournament.', rules: '1. Robots must fit within dimensions. 2. Manual control via wireless RF. 3. No damage to arena.', prizePool: '৳20,000', status: 'active', imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80' },
    { name: 'Line Follower', description: 'Optimize your algorithms for the fastest time across complex track layouts.', rules: '1. Autonomous control only. 2. Max weight 1kg. 3. Time trial base scoring.', prizePool: '৳15,000', status: 'active', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80' },
    { name: 'Drone Race', description: 'Navigate aerial obstacles in a high-speed FPV drone racing championship.', rules: '1. Quadcopter design only. 2. Safety nets active. 3. FPV video feed mandatory.', prizePool: '৳50,000', status: 'active', imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80' },
    { name: 'Sumo Bot', description: 'Push the opponent out of the ring. Pure torque and grip.', rules: '1. Auton/Manual options. 2. Ring size 1.5m diameter. 3. Weight limits apply.', prizePool: '৳25,000', status: 'active', imageUrl: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80' },
  ];

  const dbSegments = [];
  for (const seg of segments) {
    const s = await prisma.segment.create({ data: seg });
    dbSegments.push(s);
  }

  // 7. Seed Schedule
  const scheduleItems = [
    { segmentId: dbSegments[0].id, title: 'Robo Soccer - Group Stage', startTime: new Date('2026-06-10T10:00:00Z'), endTime: new Date('2026-06-10T13:00:00Z'), venue: 'Arena Alpha', displayOrder: 1 },
    { segmentId: dbSegments[1].id, title: 'Line Follower - Qualifying', startTime: new Date('2026-06-10T14:00:00Z'), endTime: new Date('2026-06-10T17:00:00Z'), venue: 'Track Beta', displayOrder: 2 },
    { segmentId: dbSegments[2].id, title: 'Drone Race - Time Trials', startTime: new Date('2026-06-11T09:00:00Z'), endTime: new Date('2026-06-11T12:00:00Z'), venue: 'Outdoor Field', displayOrder: 3 },
    { segmentId: dbSegments[3].id, title: 'Sumo Bot - Round of 32', startTime: new Date('2026-06-11T14:00:00Z'), endTime: new Date('2026-06-11T18:00:00Z'), venue: 'Arena Alpha', displayOrder: 4 },
  ];
  for (const item of scheduleItems) {
    await prisma.schedule.create({ data: item });
  }

  // 8. Seed Default Admin User
  const bcrypt = require('bcryptjs');
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set before seeding.');
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const hashedPassword = bcrypt.hashSync(adminPassword, 10);
  
  const defaultAdmin = {
    name: 'AUSTRC Administrator',
    email: process.env.ADMIN_EMAIL,
    passwordHash: hashedPassword,
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'
  };
  await prisma.user.create({ data: defaultAdmin });

  console.log('Database successfully seeded!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
