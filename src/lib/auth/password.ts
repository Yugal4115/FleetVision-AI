import bcrypt from 'bcryptjs'

const BCRYPT_SALT_ROUNDS = 12

/**
 * Hash a plaintext password using bcrypt with 12 salt rounds
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
}

/**
 * Verify a plaintext password against a stored bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false
  try {
    return await bcrypt.compare(password, hash)
  } catch (err) {
    console.error('Password comparison failed:', err)
    return false
  }
}
