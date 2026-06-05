const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Searching for schedule entries containing "Line Follower"...');
  const candidates = await prisma.schedule.findMany({
    where: { title: { contains: 'Line Follower' } },
  });

  if (!candidates.length) {
    console.log('No schedule entries found matching "Line Follower". Nothing to update.');
    return;
  }

  for (const s of candidates) {
    console.log(`Updating schedule id=${s.id} title="${s.title}" -> "LFR1 - Qualifying"`);
    await prisma.schedule.update({
      where: { id: s.id },
      data: { title: 'LFR1 - Qualifying' },
    });
  }

  console.log('Update complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
