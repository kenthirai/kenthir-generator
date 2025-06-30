// setup.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const resetPassword = 'ganti-dengan-password-rahasia-anda'; // Ganti ini!
  const hashedPassword = await bcrypt.hash(resetPassword, 10);

  await prisma.adminConfig.upsert({
    where: { key: 'coinResetPassword' },
    update: { value: hashedPassword },
    create: { key: 'coinResetPassword', value: hashedPassword },
  });
  console.log('Kata sandi reset koin telah diatur.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });