import crypto from 'crypto'

/**
 * Generate a cryptographically secure random token (64 hex characters)
 */
export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Hash a token using SHA-256 before database storage to prevent token leakage
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}
