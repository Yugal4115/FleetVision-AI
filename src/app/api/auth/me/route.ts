import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthenticated. No valid session found.' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      user,
    })
  } catch (error) {
    console.error('Session retrieval error:', error)
    return NextResponse.json({ error: 'Failed to retrieve session profile.' }, { status: 500 })
  }
}
