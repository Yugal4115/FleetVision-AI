const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: { db: { url: 'file:./db/custom.db' } },
})

async function migrate() {
  const users = await prisma.user.findMany()
  for (const u of users) {
    if (!u.password.startsWith('$2a$') && !u.password.startsWith('$2b$')) {
      const hashed = bcrypt.hashSync(u.password, 12)
      await prisma.user.update({
        where: { id: u.id },
        data: {
          password: hashed,
          emailVerified: true,
          isActive: true,
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      })
      console.log(`Hashed password for ${u.email}`)
    } else {
      console.log(`Already hashed: ${u.email}`)
    }
  }
}

migrate()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
