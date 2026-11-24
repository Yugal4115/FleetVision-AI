import { NextResponse } from 'next/server'
import { destroySession } from '@/lib/auth/session'

export async function POST() {
  try {
    await destroySession()
    return NextResponse.json({
      success: true,
      message: 'Session invalidated. Logged out successfully.',
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Failed to terminate session' }, { status: 500 })
  }
}
