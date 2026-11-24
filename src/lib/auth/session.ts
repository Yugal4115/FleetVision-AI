import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { generateRandomToken, hashToken } from './tokens'

export const SESSION_COOKIE_NAME = 'fleetvision_session'
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface AuthenticatedUser {
  id: string
  email: string
  name: string
  phone: string | null
  role: string
  avatar: string | null
  isActive: boolean
  emailVerified: boolean
  createdAt: Date
  company?: {
    id: string
    name: string
    role: string
  } | null
}

/**
 * Creates a new session in the database and sets an HTTP-only secure cookie
 */
export async function createSession(userId: string): Promise<{ sessionToken: string; expiresAt: Date }> {
  const rawToken = generateRandomToken()
  const hashedToken = hashToken(rawToken)
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

  // Invalidate any older sessions for cleanliness or keep multiple devices
  await db.session.create({
    data: {
      sessionToken: hashedToken,
      userId,
      expiresAt,
    },
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })

  return { sessionToken: rawToken, expiresAt }
}

/**
 * Validate current session from HTTP cookie and return authenticated user
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  try {
    const cookieStore = await cookies()
    const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!rawToken) return null

    const hashedToken = hashToken(rawToken)

    const session = await db.session.findUnique({
      where: { sessionToken: hashedToken },
      include: {
        user: {
          include: {
            companyMemberships: {
              include: {
                company: true,
              },
            },
          },
        },
      },
    })

    if (!session) {
      return null
    }

    // Check expiration
    if (session.expiresAt < new Date()) {
      await db.session.delete({ where: { id: session.id } }).catch(() => {})
      return null
    }

    // Check user active status and lock
    if (!session.user.isActive) {
      return null
    }

    if (session.user.lockedUntil && session.user.lockedUntil > new Date()) {
      return null
    }

    const companyMembership = session.user.companyMemberships[0]

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      phone: session.user.phone,
      role: session.user.role,
      avatar: session.user.avatar,
      isActive: session.user.isActive,
      emailVerified: session.user.emailVerified,
      createdAt: session.user.createdAt,
      company: companyMembership
        ? {
            id: companyMembership.company.id,
            name: companyMembership.company.name,
            role: companyMembership.role,
          }
        : null,
    }
  } catch (error) {
    console.error('Session validation error:', error)
    return null
  }
}

/**
 * Canonical alias for getCurrentUser satisfying getSession() contracts
 */
export const getSession = getCurrentUser

/**
 * Invalidate current session and clear session cookie
 */
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies()
    const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (rawToken) {
      const hashedToken = hashToken(rawToken)
      await db.session.deleteMany({
        where: { sessionToken: hashedToken },
      }).catch(() => {})
    }

    cookieStore.delete(SESSION_COOKIE_NAME)
  } catch (error) {
    console.error('Session destruction error:', error)
  }
}
