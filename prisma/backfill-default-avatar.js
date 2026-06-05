const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEFAULT_AVATAR =
  'https://res.cloudinary.com/dxyhzgrul/image/upload/v1780398181/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4215_bdeofc.jpg';

async function main() {
  const result = await prisma.user.updateMany({
    where: { avatarUrl: null },
    data: { avatarUrl: DEFAULT_AVATAR },
  });
  console.log(`Updated ${result.count} existing user(s) with the default avatar.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
