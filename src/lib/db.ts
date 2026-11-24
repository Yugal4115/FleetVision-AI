import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL
  if (envUrl) {
    // Production PostgreSQL database connection
    if (envUrl.startsWith('postgresql:') || envUrl.startsWith('postgres:')) {
      return envUrl
    }
    // If envUrl is set and does not contain obsolete Linux paths
    if (!envUrl.includes('/home/z') && !envUrl.includes('my-project')) {
      if (envUrl === 'file:./prisma/db/custom.db') {
        return 'file:./db/custom.db'
      }
      return envUrl
    }
  }

  // Fallback: check real file on disk
  const prismaDb = path.resolve(process.cwd(), 'prisma/db/custom.db')
  if (fs.existsSync(prismaDb)) {
    return `file:${prismaDb.replace(/\\/g, '/')}`
  }

  return 'file:./db/custom.db'
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
