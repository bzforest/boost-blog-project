import bcrypt from 'bcrypt';
import { prisma } from '../src/lib/db';

async function main() {
  const email = 'admin@boost.com';
  const plainPassword = 'boost-admin-secret'; // Change this if you want
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
      email,
      password: hashedPassword,
    },
  });

  console.log('Admin user created or updated:', admin.email);
  console.log('Password:', plainPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
