import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashToken } from '@/lib/auth/tokens'
import { hashPassword } from '@/lib/auth/password'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, email, password, confirmPassword } = body

    if (!token?.trim()) {
      return NextResponse.json({ error: 'Password reset token is required.' }, { status: 400 })
    }

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 })
    }

    if (!password || password.trim().length === 0) {
      return NextResponse.json(
        { error: 'New password is required.' },
        { status: 400 }
      )
    }

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'New password must contain at least one letter and one number.' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match. Please verify your new password.' },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim().toLowerCase()
    const hashedToken = hashToken(token.trim())

    const user = await db.user.findUnique({
      where: { email: cleanEmail },
    })

    if (!user || user.resetPasswordToken !== hashedToken) {
      return NextResponse.json(
        { error: 'Invalid or already consumed reset token. Please request a new link.' },
        { status: 400 }
      )
    }

    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      return NextResponse.json(
        { error: 'Reset link has expired. Please request a new password reset.' },
        { status: 410 }
      )
    }

    // Hash new password using bcrypt
    const hashedPassword = await hashPassword(password)

    // Update password and invalidate reset token
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    })

    // Also terminate any active sessions to enforce new login
    await db.session.deleteMany({
      where: { userId: user.id },
    }).catch(() => {})

    return NextResponse.json({
      success: true,
      message: 'Password successfully updated. You may now sign in with your new password.',
    })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'An unexpected internal error occurred during password reset.' },
      { status: 500 }
    )
  }
}
