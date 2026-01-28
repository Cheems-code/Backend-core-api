import { PrismaClient, Role } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD

  if (!email || !password) {
    console.log('⚠️ Admin seed variables not found. Skipping seed.')
    return
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  })

  if (existingAdmin) {
    console.log('✅ Admin already exists. Skipping.')
    return
  }

  if (process.env.SEED_ENABLED !== 'true') {
    console.log('⛔ Seed disabled.')
    return
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })

  console.log('🔥 Secure admin created')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
