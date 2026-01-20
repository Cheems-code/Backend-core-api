import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@system.com';

  const exists = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!exists) {
    const password = await bcrypt.hash('admin0805', 10);

    await prisma.user.create({
      data: {
        email: adminEmail,
        password,
        role: Role.ADMIN,
      },
    });

    console.log('✅ Admin created');
  } else {
    console.log('ℹ️ Admin already exists');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
